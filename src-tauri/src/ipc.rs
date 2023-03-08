//! Here we are following a "JSON-RPC 2.0" styleesponse with error or result.
//!
//! Notes:
//!     - For now, we do not handle the "request.id" of "JSON-RPC 2.0", and request batching
//!       but this could be added later.
//!     - The benefit of following the "JSON-RPC 2.0" scheme is that the frontend could be adapted to talk to a
//!       web server with minimum effort, and the JSON-RPC data format for request/response is simple, clean, and well thought out.

use anyhow::Result;
use serde::Serialize;
use ts_rs::TS;

#[derive(Serialize, TS, Debug)]
#[ts(export, export_to = "../src/bindings/")]
pub struct IpcResponse<Data>
where
    Data: Serialize,
{
    error: Option<String>,
    result: Option<Data>,
}

impl<Data> From<Result<Data>> for IpcResponse<Data>
where
    Data: Serialize,
{
    fn from(res: Result<Data>) -> Self {
        match res {
            Ok(data) => IpcResponse {
                error: None,
                result: Some(data),
            },
            Err(err) => IpcResponse {
                error: Some(err.to_string()),
                result: None,
            },
        }
    }
}
