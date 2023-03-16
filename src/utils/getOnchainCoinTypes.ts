import { invoke } from "@tauri-apps/api";
import type { IpcResponse } from "../bindings";

export const getOnchainCoinTypes = async () => {
  const { error, result } = (await invoke("get_onchain_coins")) as IpcResponse<
    string[]
  >;
  const coinTypes: string[] = [];

  if (error) console.log(error);

  if (result) {
    coinTypes.push(...result);
  }

  return { coinTypes };
};
