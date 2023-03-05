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
use crate::sui_client::create_new_config;
use anyhow::Result;

#[tokio::main]
async fn main() -> Result<()> {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, create_new_config])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}
