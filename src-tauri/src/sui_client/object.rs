use super::config::{SUI_CLIENT_CONFIG, SUI_GUI_APP_NAME};
use crate::ipc::IpcResponse;
use anyhow::anyhow;
use serde::Serialize;
use sui::client_commands::WalletContext;
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

// #[tauri::command]
// pub fn get_cache_objects() -> IpcResponse<()> {
//     Ok(()).into()
// }

#[tauri::command]
pub async fn get_remote_coins() -> IpcResponse<Vec<SuiCoinResult>> {
    let config_dir = if let Some(d) = dirs::config_dir() {
        d.join(SUI_GUI_APP_NAME)
    } else {
        return Err(anyhow!("Fail to obtain config directory")).into();
    };

    let config_path = config_dir.join(SUI_CLIENT_CONFIG);

    let mut wallet = if let Ok(w) = WalletContext::new(&config_path, None).await {
        w
    } else {
        return Err(anyhow!("Fail to get wallet")).into();
    };

    let address = if let Ok(addr) = wallet.active_address() {
        addr
    } else {
        return Err(anyhow!("No active address")).into();
    };

    if let Ok(client) = wallet.get_client().await {
        if let Ok(coins) = client
            .coin_read_api()
            .get_all_coins(address, None, None)
            .await
        {
            Ok(coins
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
            .into()
        } else {
            return Err(anyhow!("Fail to get coins")).into();
        }
    } else {
        return Err(anyhow!("Fail to get client")).into();
    }
}

#[tauri::command]
pub async fn get_remote_objects() -> IpcResponse<Vec<SuiObjectResult>> {
    let config_dir = if let Some(d) = dirs::config_dir() {
        d.join(SUI_GUI_APP_NAME)
    } else {
        return Err(anyhow!("Fail to obtain config directory")).into();
    };

    let config_path = config_dir.join(SUI_CLIENT_CONFIG);

    let mut wallet = if let Ok(w) = WalletContext::new(&config_path, None).await {
        w
    } else {
        return Err(anyhow!("Fail to get wallet")).into();
    };

    let address = if let Ok(addr) = wallet.active_address() {
        addr
    } else {
        return Err(anyhow!("No active address")).into();
    };

    if let Ok(client) = wallet.get_client().await {
        if let Ok(objects) = client
            .read_api()
            .get_objects_owned_by_address(address)
            .await
        {
            Ok(objects
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
            .into()
        } else {
            return Err(anyhow!("Fail to get objects")).into();
        }
    } else {
        return Err(anyhow!("Fail to get client")).into();
    }
}
