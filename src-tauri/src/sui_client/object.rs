use super::config;
use anyhow::{anyhow, Result};
use serde::Serialize;
use ts_rs::TS;

#[derive(Serialize, TS, Debug)]
#[ts(export, export_to = "../src/bindings/")]
pub struct SuiObjectResult {
    object_type: String,
    object_id: String,
    version: String,
    digest: String,
    owner: String,
    previous_transaction: String,
}

#[derive(Serialize, TS, Debug)]
#[ts(export, export_to = "../src/bindings/")]
pub struct SuiCoinResult {
    coin_type: String,
    coin_id: String,
    version: String,
    digest: String,
    balance: u64,
    locked_until_epoch: Option<u64>,
    previous_transaction: String,
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
            version: c.version.to_string(),
            digest: c.digest.to_string(),
            balance: c.balance,
            locked_until_epoch: c.locked_until_epoch,
            previous_transaction: c.previous_transaction.to_string(),
        })
        .collect())
}

pub async fn get_remote_objects() -> Result<Vec<SuiObjectResult>> {
    let (wallet, active_address) = config::get_wallet_context().await?;

    let object_list = wallet
        .get_client()
        .await
        .or(Err(anyhow!("Fail to get client")))?
        .read_api()
        .get_objects_owned_by_address(active_address)
        .await
        .or(Err(anyhow!("Fail to get remote objects")))?;

    Ok(object_list
        .into_iter()
        .map(|obj| SuiObjectResult {
            object_type: obj.type_.to_string(),
            object_id: obj.object_id.to_string(),
            version: obj.version.to_string(),
            digest: obj.digest.to_string(),
            owner: obj.owner.to_string(),
            previous_transaction: obj.previous_transaction.to_string(),
        })
        .collect())
}
