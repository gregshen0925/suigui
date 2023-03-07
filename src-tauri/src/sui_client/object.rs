use super::config;
use anyhow::{anyhow, Result};
use serde::Serialize;
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
            // version: obj.version.to_string(),
            // digest: obj.digest.to_string(),
            // owner: obj.owner.to_string(),
            // previous_transaction: obj.previous_transaction.to_string(),
        })
        .collect())
}
