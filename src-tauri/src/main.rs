#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

mod ipc;
mod sui_client;
use crate::sui_client::{
    create_new_config, get_active_address, get_coins_by_coin_type,
    get_onchain_coins, get_onchain_coins_by_coin_type, get_onchain_objects,
    merge_coins, merge_coins_and_transfer, split_and_transfer, transfer_object,
};
use anyhow::Result;
use std::sync::Arc;
use sui_client::config::SUI_GUI_APP_IDENTIFIER;
use tauri::api::path::local_data_dir;

const DATABASE_FILENAME: &str = "suigui.db";

#[tokio::main]
async fn main() -> Result<()> {
    let db = if let Some(data_dir) = local_data_dir() {
        sled::open(
            data_dir
                .join(SUI_GUI_APP_IDENTIFIER)
                .join(DATABASE_FILENAME),
        )?
    } else {
        sled::Config::new().temporary(true).open()?
    };
    let db = Arc::new(db);

    tauri::Builder::default()
        .manage(db)
        .invoke_handler(tauri::generate_handler![
            greet,
            // config
            create_new_config,
            get_active_address,
            // coin
            get_onchain_coins,
            get_coins_by_coin_type,
            get_onchain_coins_by_coin_type,
            split_and_transfer,
            merge_coins,
            merge_coins_and_transfer,
            // object
            get_onchain_objects,
            transfer_object,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}
