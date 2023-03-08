#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

mod ipc;
// mod store;
mod sui_client;
use crate::sui_client::{
    create_new_config, get_active_address, get_coins_by_coin_type, get_remote_coins,
    get_remote_objects, merge_coins, split_and_transfer,
};
use anyhow::Result;

#[tokio::main]
async fn main() -> Result<()> {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            greet,
            // config
            create_new_config,
            get_active_address,
            // coin
            get_remote_coins,
            get_coins_by_coin_type,
            split_and_transfer,
            merge_coins,
            // object
            get_remote_objects,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}
