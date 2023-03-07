use super::config;
use anyhow::{anyhow, Result};
use move_core_types::language_storage::TypeTag;
use serde::Serialize;
use serde_json::Value;
use std::str::FromStr;
use sui::client_commands::call_move;
use sui_json::SuiJsonValue;
use sui_json_rpc_types::SuiTransactionResponse;
use sui_types::base_types::ObjectID;
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

pub async fn get_coins_by_coin_type(coin_type: String) -> Result<Vec<SuiCoinResult>> {
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

pub async fn get_remote_coins() -> Result<Vec<SuiCoinResult>> {
    let (wallet, active_address) = config::get_wallet_context().await?;

    let coin_page = wallet
        .get_client()
        .await
        .or(Err(anyhow!("Fail to get client")))?
        .coin_read_api()
        .get_all_coins(active_address, None, None)
        .await
        .or(Err(anyhow!("Fail to get remote coins")))?;

    Ok(coin_page
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

pub async fn split_and_transfer(
    coin_type: &str,
    coin_id: &str,
    amount: u64,
    receipent: &str,
) -> Result<SuiTransactionResponse> {
    let (mut wallet, _) = config::get_wallet_context().await?;

    let package_id = ObjectID::from_hex_literal("0x2").unwrap();
    let coin_id = ObjectID::from_hex_literal(coin_id).or(Err(anyhow!("Invalid object ID")))?;
    let coin_type = TypeTag::from_str(coin_type).or(Err(anyhow!("Invalid coin type")))?;

    let (certificate, effects) = call_move(
        package_id,
        "pay",
        "split_and_transfer",
        vec![coin_type],
        None,
        500u64,
        vec![
            SuiJsonValue::from_object_id(coin_id),
            SuiJsonValue::new(amount.into())?,
            SuiJsonValue::from_str(receipent)?,
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

pub async fn merge_coins(coin_type: &str, coins: Vec<String>) -> Result<SuiTransactionResponse> {
    let (mut wallet, _) = config::get_wallet_context().await?;

    if coins.len() < 2 {
        return Err(anyhow!("At least two objects to merge"));
    }

    let package_id = ObjectID::from_hex_literal("0x2").unwrap();
    let mut coins: Vec<SuiJsonValue> = coins
        .into_iter()
        .map(|c_str| ObjectID::from_hex_literal(&c_str).or(Err(anyhow!("Invalid object ID"))))
        .collect::<Result<Vec<ObjectID>>>()?
        .into_iter()
        .map(SuiJsonValue::from_object_id)
        .collect();

    let coin_type = TypeTag::from_str(coin_type).or(Err(anyhow!("Invalid coin type")))?;

    let dist_coin_id = coins.pop().unwrap();

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
        None,
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
