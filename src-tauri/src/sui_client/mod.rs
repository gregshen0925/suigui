mod config;
mod object;
use crate::ipc::IpcResponse;

use config::CreateConfigResult;
use object::{SuiCoinResult, SuiObjectResult};

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
    object::get_remote_coins().await.into()
}

#[tauri::command]
pub async fn get_remote_objects() -> IpcResponse<Vec<SuiObjectResult>> {
    object::get_remote_objects().await.into()
}
