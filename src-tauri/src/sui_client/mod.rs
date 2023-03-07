mod coin;
mod config;
mod object;
use crate::ipc::IpcResponse;
use coin::SuiCoinResult;
use config::CreateConfigResult;
use object::SuiObjectResult;
use sui_json_rpc_types::SuiTransactionResponse;

#[tauri::command]
pub async fn create_new_config() -> IpcResponse<CreateConfigResult> {
    config::create_new_config().into()
}

#[tauri::command]
pub async fn get_active_address() -> IpcResponse<String> {
    config::get_active_address().into()
}

#[tauri::command]
pub async fn get_remote_coins() -> IpcResponse<Vec<SuiCoinResult>> {
    coin::get_remote_coins().await.into()
}

#[tauri::command]
pub async fn split_and_transfer(
    coin_type: String,
    coin_id: String,
    amount: u64,
    receipent: String,
) -> IpcResponse<SuiTransactionResponse> {
    coin::split_and_transfer(&coin_type, &coin_id, amount, &receipent)
        .await
        .into()
}

#[tauri::command]
pub async fn get_remote_objects() -> IpcResponse<Vec<SuiObjectResult>> {
    object::get_remote_objects().await.into()
}
