#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

use anyhow::Result;

mod sui;
use crate::sui::create_new_keypair;

#[tokio::main]
async fn main() -> Result<()> {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, create_new_keypair])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}
