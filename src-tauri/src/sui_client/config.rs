// use std::collections::HashMap;
use crate::ipc::IpcResponse;
use anyhow::anyhow;
use serde::Serialize;
use std::path::PathBuf;
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

pub const SUI_CLIENT_CONFIG: &str = "suigui_config.yaml";
pub const SUI_KEYSTORE_FILENAME: &str = "suigui.keystore";

#[tauri::command]
pub fn create_new_config() -> IpcResponse<CreateConfigResult> {
    let config_path = PathBuf::new().join(SUI_CLIENT_CONFIG);
    let keystore_path = PathBuf::new().join(SUI_KEYSTORE_FILENAME);

    let keystore_path = if let Ok(k) = FileBasedKeystore::new(&keystore_path) {
        k
    } else {
        return Err(anyhow!("fail to create keystore file")).into();
    };

    let mut keystore = Keystore::from(keystore_path);
    let (new_address, phrase, scheme) =
        if let Ok(key_result) = keystore.generate_and_add_new_key(SignatureScheme::ED25519, None) {
            key_result
        } else {
            return Err(anyhow!("fail to generate new key")).into();
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
        return Err(anyhow!("fail to save config file")).into();
    };

    IpcResponse::from(Ok(CreateConfigResult {
        address: new_address.to_string(),
        phrase,
        scheme: scheme.to_string(),
    }))
}
