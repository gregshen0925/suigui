use anyhow::{anyhow, Result};
use serde::Serialize;
use std::fs;
use std::path::PathBuf;
use sui::client_commands::WalletContext;
use sui::config::{Config, SuiClientConfig, SuiEnv};
use sui_keys::keystore::{AccountKeystore, FileBasedKeystore, Keystore};
use sui_sdk::types::base_types::SuiAddress;
use sui_sdk::types::crypto::SignatureScheme;
use tauri::api::path::config_dir;
use ts_rs::TS;

#[derive(Serialize, TS, Debug)]
#[ts(export, export_to = "../src/bindings/")]
pub struct CreateConfigResult {
    address: String,
    phrase: String,
    scheme: String,
}

pub const SUI_GUI_APP_IDENTIFIER: &str = "SuiGUI";
pub const SUI_CLIENT_CONFIG_FILENAME: &str = "suigui_config.yaml";
pub const SUI_KEYSTORE_FILENAME: &str = "suigui.keystore";

pub fn suigui_config_dir() -> Result<PathBuf> {
    if let Some(c_dir) = config_dir() {
        let suigui_config_dir = c_dir.join(SUI_GUI_APP_IDENTIFIER);
        if !suigui_config_dir.exists()
            && fs::create_dir_all(&suigui_config_dir).is_err()
        {
            return Err(anyhow!("Fail to create config directory"));
        }
        Ok(suigui_config_dir)
    } else {
        return Err(anyhow!("Fail to obtain config directory"));
    }
}

pub fn suigui_config_path() -> Result<PathBuf> {
    Ok(suigui_config_dir()?.join(SUI_CLIENT_CONFIG_FILENAME))
}

pub fn suigui_keystore_path() -> Result<PathBuf> {
    Ok(suigui_config_dir()?.join(SUI_KEYSTORE_FILENAME))
}

pub async fn get_wallet_context() -> Result<(WalletContext, SuiAddress)> {
    let mut wallet = WalletContext::new(&suigui_config_path()?, None)
        .await
        .or(Err(anyhow!("Fail to get wallet context")))?;
    let active_addrss = wallet
        .active_address()
        .or(Err(anyhow!("No active address")))?;
    Ok((wallet, active_addrss))
}

pub fn create_new_config() -> Result<CreateConfigResult> {
    let config_path = suigui_config_path()?;
    let keystore_path = suigui_keystore_path()?;

    let keystore_path = FileBasedKeystore::new(&keystore_path)
        .or(Err(anyhow!("Fail to create keystore file")))?;

    let mut keystore = Keystore::from(keystore_path);
    let (new_address, phrase, scheme) = keystore
        .generate_and_add_new_key(SignatureScheme::ED25519, None)
        .or(Err(anyhow!("Fail to generate new key")))?;

    let sui_env = SuiEnv::devnet();
    let sui_alias = sui_env.alias.clone();

    let sui_client_config = SuiClientConfig {
        keystore,
        envs: vec![sui_env],
        active_address: Some(new_address),
        active_env: Some(sui_alias),
    };
    sui_client_config
        .persisted(&config_path)
        .save()
        .or(Err(anyhow!("Fail to save config file")))?;

    Ok(CreateConfigResult {
        address: new_address.to_string(),
        phrase,
        scheme: scheme.to_string(),
    })
}

pub fn get_active_address() -> Result<String> {
    let config_path = suigui_config_path()?;
    let suigui_config = SuiClientConfig::load(config_path)
        .or(Err(anyhow!("Config not exists")))?;
    match suigui_config.active_address {
        Some(address) => Ok(address.to_string()),
        None => Err(anyhow!("No active address")),
    }
}
