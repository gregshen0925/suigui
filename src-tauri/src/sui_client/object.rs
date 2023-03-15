use super::coin::parse_gas_coin;
use super::config;
use anyhow::{anyhow, Result};
use serde::Serialize;
use sui_json_rpc_types::SuiTransactionResponse;
use sui_keys::keystore::AccountKeystore;
use sui_types::{
    base_types::{ObjectID, SuiAddress},
    intent::Intent,
    messages::Transaction,
};
use ts_rs::TS;

#[derive(Serialize, TS, Debug)]
#[ts(export, export_to = "../src/bindings/")]
pub struct SuiObjectResult {
    object_type: String,
    object_id: String,
    // version: String,
    // digest: String,
    // owner: String,
    // previous_transaction: String,
}

pub async fn get_onchain_objects() -> Result<Vec<SuiObjectResult>> {
    let (wallet, active_address) = config::get_wallet_context().await?;

    let object_list = wallet
        .get_client()
        .await
        .or(Err(anyhow!("Fail to get client")))?
        .read_api()
        .get_objects_owned_by_address(active_address)
        .await
        .or(Err(anyhow!("Fail to get onchain objects")))?;

    Ok(object_list
        .into_iter()
        .map(|obj| SuiObjectResult {
            object_type: obj.type_.to_string(),
            object_id: obj.object_id.to_string(),
            // version: obj.version.to_string(),
            // digest: obj.digest.to_string(),
            // owner: obj.owner.to_string(),
            // previous_transaction: obj.previous_transaction.to_string(),
        })
        .collect())
}

pub async fn tranfer_object(
    object_id: &str,
    recipient: &str,
    gas_coin_id: Option<String>,
) -> Result<SuiTransactionResponse> {
    let (wallet, active_address) = config::get_wallet_context().await?;

    let object_id = parse_object_id(object_id)?;
    let gas = parse_gas_coin(gas_coin_id)?;
    let gas_budget = 1000u64;
    let recipient = SuiAddress::try_from(recipient.as_bytes())?;

    let client = wallet.get_client().await?;
    let data = client
        .transaction_builder()
        .transfer_object(active_address, object_id, gas, gas_budget, recipient)
        .await?;
    let signature = wallet.config.keystore.sign_secure(
        &active_address,
        &data,
        Intent::default(),
    )?;
    wallet
        .execute_transaction(
            Transaction::from_data(data, Intent::default(), vec![signature])
                .verify()?,
        )
        .await
}

fn parse_object_id(object_id_str: &str) -> Result<ObjectID> {
    ObjectID::from_hex_literal(object_id_str)
        .or(Err(anyhow!("Invalid object ID")))
}
