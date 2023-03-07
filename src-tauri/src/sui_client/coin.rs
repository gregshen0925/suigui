use super::config;
use anyhow::{anyhow, Result};
use move_core_types::language_storage::TypeTag;
use serde::Serialize;
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

// #[derive(Serialize, TS, Debug)]
// #[ts(export, export_to = "../src/bindings/")]
// pub struct CoinTransferResult {

// }

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
