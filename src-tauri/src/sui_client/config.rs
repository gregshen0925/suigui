// use std::collections::HashMap;
use crate::ipc::IpcResponse;
use anyhow::anyhow;
use serde::Serialize;
use std::{fs, path::PathBuf};
use sui::config::{Config, SuiClientConfig, SuiEnv};
use sui_keys::keystore::{AccountKeystore, FileBasedKeystore, Keystore};
use sui_sdk::types::crypto::SignatureScheme;
use ts_rs::TS;

#[derive(Serialize, TS, Debug)]
#[ts(export, export_to = "../src/bindings/")]
pub struct CreateConfigResult {
    address: String,
    phrase: String,
    scheme: String,
}

pub const SUI_GUI_APP_NAME: &str = "Sui GUI";
pub const SUI_CLIENT_CONFIG: &str = "suigui_config.yaml";
pub const SUI_KEYSTORE_FILENAME: &str = "suigui.keystore";

#[tauri::command]
pub fn create_new_config() -> IpcResponse<CreateConfigResult> {
    let config_dir = if let Some(d) = dirs::config_dir() {
        d.join(SUI_GUI_APP_NAME)
    } else {
        return Err(anyhow!("Fail to obtain config directory")).into();
    };

    let config_path = config_dir.join(SUI_CLIENT_CONFIG);
    let keystore_path = config_dir.join(SUI_KEYSTORE_FILENAME);

    if !config_dir.exists() && fs::create_dir_all(&config_dir).is_err() {
        return Err(anyhow!("Fail to create config directory")).into();
    };

    let keystore_path = if let Ok(k) = FileBasedKeystore::new(&keystore_path) {
        k
    } else {
        return Err(anyhow!("Fail to create keystore file")).into();
    };

    let mut keystore = Keystore::from(keystore_path);
    let (new_address, phrase, scheme) =
        if let Ok(key_result) = keystore.generate_and_add_new_key(SignatureScheme::ED25519, None) {
            key_result
        } else {
            return Err(anyhow!("Fail to generate new key")).into();
        };

    let sui_env = SuiEnv::devnet();
    let sui_alias = sui_env.alias.clone();

    let sui_client_config = SuiClientConfig {
        keystore,
        envs: vec![sui_env],
        active_address: Some(new_address),
        active_env: Some(sui_alias),
    };
    if sui_client_config.persisted(&config_path).save().is_err() {
        return Err(anyhow!("Fail to save config file")).into();
    };

    Ok(CreateConfigResult {
        address: new_address.to_string(),
        phrase,
        scheme: scheme.to_string(),
    })
    .into()
}

#[tauri::command]
pub fn get_active_address() -> IpcResponse<String> {
    let config_path = PathBuf::from(SUI_CLIENT_CONFIG);
    if let Ok(config) = SuiClientConfig::load(config_path) {
        if let Some(address) = config.active_address {
            Ok(address.to_string()).into()
        } else {
            Err(anyhow!("No active address")).into()
        }
    } else {
        Err(anyhow!("Config not exists")).into()
    }
}
