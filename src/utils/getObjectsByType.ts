import { invoke } from "@tauri-apps/api";
import type { IpcResponse, SuiCoinResult } from "../bindings";

export const getObjectsByType = async (coinType: string) => {
  const { result } = (await invoke("get_remote_coins", {
    coinType: coinType,
  })) as IpcResponse<SuiCoinResult[]>;

  return { result };
};
