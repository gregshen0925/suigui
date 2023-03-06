import { invoke } from "@tauri-apps/api";
import type { IpcResponse, SuiCoinResult } from "../bindings";

export const getRemoteCoinTypes = async () => {
  const { error, result } = (await invoke("get_remote_coins")) as IpcResponse<
    SuiCoinResult[]
  >;
  const coinTypes: string[] = [];

  result?.map(
    (coin) =>
      coinTypes.indexOf(coin?.coin_type || "") === -1 &&
      coinTypes.push(coin?.coin_type || "")
  );
  return { coinTypes };
};
