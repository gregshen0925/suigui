use super::config;
use anyhow::{anyhow, Result};
use move_core_types::language_storage::TypeTag;
use serde::Serialize;
use serde_json::Value;
use std::str::FromStr;
use sui::client_commands::call_move;
use sui_json::SuiJsonValue;
use sui_json_rpc_types::{Coin, SuiTransactionResponse};
use sui_types::base_types::ObjectID;
use tauri::{AppHandle, Manager, Wry};
use ts_rs::TS;

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

pub async fn get_coins_by_coin_type(
    coin_type: String,
) -> Result<Vec<SuiCoinResult>> {
    let (wallet, active_address) = config::get_wallet_context().await?;
    Ok(wallet
        .get_client()
        .await
        .or(Err(anyhow!("Fail to get client")))?
        .coin_read_api()
        .get_coins(active_address, Some(coin_type), None, None)
        .await
        .or(Err(anyhow!("Fail to get coins")))?
        .data
        .into_iter()
        .map(|c| SuiCoinResult {
            coin_type: c.coin_type.to_string(),
            coin_id: c.coin_object_id.to_string(),
            // version: c.version.to_string(),
            // digest: c.digest.to_string(),
            balance: c.balance,
            // locked_until_epoch: c.locked_until_epoch,
            // previous_transaction: c.previous_transaction.to_string(),
        })
        .collect())
}

pub async fn get_remote_coins(
    app: AppHandle<Wry>,
) -> Result<Vec<SuiCoinResult>> {
    let (wallet, active_address) = config::get_wallet_context().await?;

    let db = (*app.state::<sled::Db>()).clone();

    let coin_page = wallet
        .get_client()
        .await
        .or(Err(anyhow!("Fail to get client")))?
        .coin_read_api()
        .get_all_coins(active_address, None, None)
        .await
        .or(Err(anyhow!("Fail to get remote coins")))?;

    db.clear().or(Err(anyhow!("Database clear error")))?;

    coin_page
        .data
        .into_iter()
        .map(|c| {
            typed_sled::Tree::<String, Coin>::open(&db, &c.coin_type)
                .insert(&c.coin_type, &c)
                .map(|_| SuiCoinResult {
                    coin_type: c.coin_type.to_string(),
                    coin_id: c.coin_object_id.to_string(),
                    balance: c.balance,
                })
                .or(Err(anyhow!("Database insert error")))
        })
        .collect()
}

pub async fn split_and_transfer(
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
    let coin_type =
        TypeTag::from_str(coin_type).or(Err(anyhow!("Invalid coin type")))?;

    let gas_coin_id = parse_gas_coin(gas_coin_id)?;

    let (certificate, effects) = call_move(
        package_id,
        "pay",
        "split_and_transfer",
        vec![coin_type],
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

    Ok(SuiTransactionResponse {
        certificate,
        effects,
        timestamp_ms: None,
        checkpoint: None,
        parsed_data: None,
    })
}

pub async fn merge_coins(
    coin_type: &str,
    coins: Vec<String>,
    gas_coin_id: Option<String>,
) -> Result<SuiTransactionResponse> {
    let (mut wallet, _) = config::get_wallet_context().await?;

    if coins.len() < 2 {
        return Err(anyhow!("At least two objects to merge"));
    }

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

    let coin_type =
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
        vec![coin_type],
        gas_coin_id,
        10000u64,
        vec![dist_coin_id, rest_coin_ids],
        &mut wallet,
    )
    .await
    .or(Err(anyhow!("Fail to split and transfer")))?;

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
    .or(Err(anyhow!("Fail to split and transfer")))?;

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
            ObjectID::from_hex_literal(&s).or(Err(anyhow!("Invalid object ID")))
        })
        .transpose()
}
