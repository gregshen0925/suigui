use super::config;
use anyhow::{anyhow, Result};
use itertools::Itertools;
use move_core_types::language_storage::TypeTag;
use serde::Serialize;
use serde_json::Value;
use sled::Db;
use std::str::FromStr;
use std::sync::Arc;
use sui::client_commands::call_move;
use sui_json::SuiJsonValue;
use sui_json_rpc_types::{Coin, SuiTransactionResponse};
use sui_types::base_types::ObjectID;
use tauri::{AppHandle, Manager, Wry};
use ts_rs::TS;

const COIN_TYPE_TABLES: &str = "coin_types";

#[derive(Serialize, TS, Debug)]
#[ts(export, export_to = "../src/bindings/")]
pub struct SuiCoinResult {
    coin_type: String,
    coin_id: String,
    // version: String,
    // digest: String,
    balance: u64,
    // locked_until_epoch: Option<u64>,
    // previous_transaction: String,
}
pub async fn get_onchain_coins_by_coin_type(
    app: AppHandle<Wry>,
    coin_type: String,
) -> Result<Vec<SuiCoinResult>> {
    let (wallet, active_address) = config::get_wallet_context().await?;
    let db = (*app.state::<Arc<Db>>()).clone();
    let coin_type_clone = coin_type.clone();
    let coin_db = typed_sled::Tree::<ObjectID, Coin>::open(&db, &coin_type);
    coin_db
        .clear()
        .or(Err(anyhow!("Fail to clear database {}", &coin_type)))?;
    wallet
        .get_client()
        .await
        .or(Err(anyhow!("Fail to get client")))?
        .coin_read_api()
        .get_coins(active_address, Some(coin_type), None, None)
        .await
        .or(Err(anyhow!("Fail to get coins")))?
        .data
        .into_iter()
        .map(|c| {
            coin_db
                .insert(&c.coin_object_id, &c)
                .or(Err(anyhow!("Fail to update coin id {}", c.coin_object_id)))
        })
        .collect::<Result<Vec<Option<Coin>>>>()
        .and(get_coins_by_coin_type(app, coin_type_clone).await)
}

pub async fn get_coins_by_coin_type(
    app: AppHandle<Wry>,
    coin_type: String,
) -> Result<Vec<SuiCoinResult>> {
    let db = (*app.state::<Arc<Db>>()).clone();

    let coin_db = typed_sled::Tree::<ObjectID, Coin>::open(&db, coin_type);
    coin_db
        .iter()
        .map(|item| {
            if let Ok((_, coin)) = item {
                Ok(SuiCoinResult {
                    coin_type: coin.coin_type.to_string(),
                    coin_id: coin.coin_object_id.to_string(),
                    balance: coin.balance,
                })
            } else {
                Err(anyhow!("Fail to get coins from cache"))
            }
        })
        .collect()
}

pub async fn get_onchain_coins(app: AppHandle<Wry>) -> Result<Vec<String>> {
    let (wallet, active_address) = config::get_wallet_context().await?;

    let db = (*app.state::<Arc<Db>>()).clone();

    let coin_page = wallet
        .get_client()
        .await
        .or(Err(anyhow!("Fail to get client")))?
        .coin_read_api()
        .get_all_coins(active_address, None, None)
        .await
        .or(Err(anyhow!("Fail to get onchain coins")))?;

    let coin_type_table =
        typed_sled::Tree::<String, String>::open(&db, COIN_TYPE_TABLES);

    db.clear().or(Err(anyhow!("Fail to clear database")))?;

    Ok(coin_page
        .data
        .into_iter()
        .map(|c| {
            if typed_sled::Tree::<ObjectID, Coin>::open(&db, &c.coin_type)
                .insert(&c.coin_object_id, &c)
                .is_err()
            {
                return Err(anyhow!("Database error (coin data)"));
            };
            coin_type_table
                .insert(&c.coin_type, &c.coin_type)
                .or(Err(anyhow!("Database error (coin types)")))
        })
        .collect::<Result<Vec<Option<String>>>>()?
        .into_iter()
        .map(|opt_coin| opt_coin.unwrap_or(String::from("0x2::sui::SUI")))
        .unique()
        .collect())
}

pub async fn split_and_transfer(
    app: AppHandle<Wry>,
    coin_type: &str,
    coin_id: &str,
    amount: u64,
    recipient: &str,
    gas_coin_id: Option<String>,
) -> Result<SuiTransactionResponse> {
    let (mut wallet, _) = config::get_wallet_context().await?;

    let package_id = ObjectID::from_hex_literal("0x2").unwrap();
    let coin_id = ObjectID::from_hex_literal(coin_id)
        .or(Err(anyhow!("Invalid object ID")))?;
    let coin_type_tag =
        TypeTag::from_str(coin_type).or(Err(anyhow!("Invalid coin type")))?;

    let gas_coin_id = parse_gas_coin(gas_coin_id)?;

    let (certificate, effects) = call_move(
        package_id,
        "pay",
        "split_and_transfer",
        vec![coin_type_tag],
        gas_coin_id,
        500u64,
        vec![
            SuiJsonValue::from_object_id(coin_id),
            SuiJsonValue::new(amount.into())?,
            SuiJsonValue::from_str(recipient)?,
        ],
        &mut wallet,
    )
    .await
    .or(Err(anyhow!("Fail to split and transfer")))?;

    if effects.status.is_ok() {
        let db = (*app.state::<Arc<Db>>()).clone();
        let coin_db = typed_sled::Tree::<ObjectID, Coin>::open(&db, coin_type);
        if let Some(mut coin) = coin_db.get(&coin_id)? {
            coin.balance -= amount;
            coin_db.insert(&coin_id, &coin)?;
        }
    }

    Ok(SuiTransactionResponse {
        certificate,
        effects,
        timestamp_ms: None,
        checkpoint: None,
        parsed_data: None,
    })
}

pub async fn merge_coins(
    app: AppHandle<Wry>,
    coin_type: &str,
    coins: Vec<String>,
    gas_coin_id: Option<String>,
) -> Result<SuiTransactionResponse> {
    let (mut wallet, _) = config::get_wallet_context().await?;

    if coins.len() < 2 {
        return Err(anyhow!("At least two objects to merge"));
    }

    let coin_id_to_merge = ObjectID::from_hex_literal(coins.last().unwrap())
        .or(Err(anyhow!("Invalid object ID")))?;

    let package_id = ObjectID::from_hex_literal("0x2").unwrap();
    let mut coins: Vec<SuiJsonValue> = coins
        .into_iter()
        .map(|c_str| {
            ObjectID::from_hex_literal(&c_str)
                .or(Err(anyhow!("Invalid object ID")))
        })
        .collect::<Result<Vec<ObjectID>>>()?
        .into_iter()
        .map(SuiJsonValue::from_object_id)
        .collect();

    let coin_type_tag =
        TypeTag::from_str(coin_type).or(Err(anyhow!("Invalid coin type")))?;

    let dist_coin_id = coins.pop().unwrap();

    let gas_coin_id = parse_gas_coin(gas_coin_id)?;

    let rest_coin_ids = coins
        .into_iter()
        .map(|cid| cid.to_json_value())
        .collect::<Vec<Value>>();

    let rest_coin_ids = SuiJsonValue::new(Value::from(rest_coin_ids))?;

    let (certificate, effects) = call_move(
        package_id,
        "pay",
        "join_vec",
        vec![coin_type_tag],
        gas_coin_id,
        10000u64,
        vec![dist_coin_id, rest_coin_ids],
        &mut wallet,
    )
    .await
    .or(Err(anyhow!("Fail to merge coins")))?;

    let db = (*app.state::<Arc<Db>>()).clone();
    let coin_db = typed_sled::Tree::<ObjectID, Coin>::open(&db, coin_type);

    let culumulative_amount_of_deleted_coins: u64 = effects
        .deleted
        .clone()
        .into_iter()
        .map(|obj| {
            coin_db
                .remove(&obj.object_id)
                .or(Err(anyhow!("Database error (delete coins)")))
        })
        .collect::<Result<Vec<Option<Coin>>>>()?
        .into_iter()
        .map(|opt_coin| opt_coin.map_or(0, |c| c.balance))
        .sum();

    if let Some(mut coin) = coin_db.get(&coin_id_to_merge)? {
        coin.balance += culumulative_amount_of_deleted_coins;
        coin_db.insert(&coin_id_to_merge, &coin)?;
    }

    Ok(SuiTransactionResponse {
        certificate,
        effects,
        timestamp_ms: None,
        checkpoint: None,
        parsed_data: None,
    })
}

pub async fn merge_coins_and_transfer(
    coin_type: &str,
    coins: Vec<String>,
    recipient: &str,
    gas_coin_id: Option<String>,
) -> Result<SuiTransactionResponse> {
    let (mut wallet, _) = config::get_wallet_context().await?;

    let package_id = ObjectID::from_hex_literal("0x2").unwrap();
    let coins: Vec<SuiJsonValue> = coins
        .into_iter()
        .map(|c_str| {
            ObjectID::from_hex_literal(&c_str)
                .or(Err(anyhow!("Invalid object ID")))
        })
        .collect::<Result<Vec<ObjectID>>>()?
        .into_iter()
        .map(SuiJsonValue::from_object_id)
        .collect();

    let coin_type =
        TypeTag::from_str(coin_type).or(Err(anyhow!("Invalid coin type")))?;

    let gas_coin_id = parse_gas_coin(gas_coin_id)?;

    let coins = coins
        .into_iter()
        .map(|cid| cid.to_json_value())
        .collect::<Vec<Value>>();

    let coins = SuiJsonValue::new(Value::from(coins))?;

    let (certificate, effects) = call_move(
        package_id,
        "pay",
        "join_vec_and_transfer",
        vec![coin_type],
        gas_coin_id,
        10000u64,
        vec![coins, SuiJsonValue::from_str(recipient)?],
        &mut wallet,
    )
    .await
    .or(Err(anyhow!("Fail to merge coins and transfer")))?;

    Ok(SuiTransactionResponse {
        certificate,
        effects,
        timestamp_ms: None,
        checkpoint: None,
        parsed_data: None,
    })
}

pub fn parse_gas_coin(coin_id_str: Option<String>) -> Result<Option<ObjectID>> {
    coin_id_str
        .map(|s| {
            ObjectID::from_hex_literal(&s)
                .or(Err(anyhow!("Invalid gas coin ID")))
        })
        .transpose()
}
