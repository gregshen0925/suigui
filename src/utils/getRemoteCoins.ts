import { invoke } from "@tauri-apps/api";
import type { IpcResponse, SuiCoinResult } from "../bindings";

export const getRemoteCoins = async () => {
  const { error, result } = (await invoke(
    "get_remote_coins"
  )) as IpcResponse<SuiCoinResult>;
  return { error, result };
};
