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
    // config
    create_new_config,
    get_active_address,
    // object
    get_remote_coins,
    get_remote_objects,
};
use anyhow::Result;

#[tokio::main]
async fn main() -> Result<()> {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            greet,
            //config
            create_new_config,
            get_active_address,
            // object
            get_remote_objects,
            get_remote_coins,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}
