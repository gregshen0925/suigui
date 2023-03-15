import { invoke } from "@tauri-apps/api";
import type { IpcResponse, SuiCoinResult } from "../bindings";

export const getRemoteObjectTypes = async () => {
  const { error, result } = (await invoke("get_remote_coins")) as IpcResponse<
    SuiCoinResult[]
  >;
  const objectTypes: string[] = [];

  if (result) {
    result?.map(
      (coin) =>
        objectTypes.indexOf(coin?.coin_type || "") === -1 &&
        objectTypes.push(coin?.coin_type || "")
    );
    if (error) {
      console.log(error);
    }
  }

  return { objectTypes };
};
