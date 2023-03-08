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
    gas_coin_id: Option<String>,
) -> IpcResponse<SuiTransactionResponse> {
    coin::split_and_transfer(&coin_type, &coin_id, amount, &receipent, gas_coin_id)
        .await
        .into()
}

#[tauri::command]
pub async fn merge_coins(
    coin_type: String,
    coin_id_list: Vec<String>,
    gas_coin_id: Option<String>,
) -> IpcResponse<SuiTransactionResponse> {
    coin::merge_coins(&coin_type, coin_id_list, gas_coin_id)
        .await
        .into()
}

#[tauri::command]
pub async fn merge_coins_and_transfer(
    coin_type: String,
    coin_id_list: Vec<String>,
    receipent: String,
    gas_coin_id: Option<String>,
) -> IpcResponse<SuiTransactionResponse> {
    coin::merge_coins_and_transfer(&coin_type, coin_id_list, &receipent, gas_coin_id)
        .await
        .into()
}

#[tauri::command]
pub async fn get_coins_by_coin_type(coin_type: String) -> IpcResponse<Vec<SuiCoinResult>> {
    coin::get_coins_by_coin_type(coin_type).await.into()
}

#[tauri::command]
pub async fn get_remote_objects() -> IpcResponse<Vec<SuiObjectResult>> {
    object::get_remote_objects().await.into()
}
