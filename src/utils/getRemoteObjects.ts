import { invoke } from "@tauri-apps/api";
import type { IpcResponse, SuiObjectResult } from "../bindings";

export const getRemoteObjects = async () => {
  const { error, result } = (await invoke(
    "get_remote_objects"
  )) as IpcResponse<SuiObjectResult>;
  return { error, result };
};
