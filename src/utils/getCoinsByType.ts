import { invoke } from "@tauri-apps/api";
import type { IpcResponse, SuiCoinResult } from "../bindings";

export const getCoinsByType = async (coinType: string) => {
  const { error, result } = (await invoke("get_coins_by_coin_type", {
    coinType: coinType,
  })) as IpcResponse<SuiCoinResult[]>;

  return { error, result };
};
