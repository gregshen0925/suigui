// use std::collections::HashMap;
use serde::Serialize;
use std::path::PathBuf;
use sui_keys::keystore::AccountKeystore;
use sui_keys::keystore::FileBasedKeystore;
use sui_sdk::types::crypto::SignatureScheme;
use ts_rs::TS;

#[derive(Serialize, TS, Debug)]
#[ts(export, export_to = "../src/bindings/")]
pub struct CreateKeyResult {
    address: String,
    phrase: String,
    scheme: String,
}

#[tauri::command]
pub fn create_new_keypair() -> CreateKeyResult {
    let keystore_path = PathBuf::new().join(".suigui.keystore");
    let mut keystore = FileBasedKeystore::new(&keystore_path).expect("Cannot create keystore file");
    let (address, phrase, scheme) = keystore
        .generate_and_add_new_key(SignatureScheme::ED25519, None)
        .expect("Cannot generate new key");
    CreateKeyResult {
        address: address.to_string(),
        phrase,
        scheme: scheme.to_string(),
    }
}
