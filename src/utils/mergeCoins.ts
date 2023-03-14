import { invoke } from "@tauri-apps/api";

export const mergeCoins = async (
  coinType: string,
  coins: string[],
  gasCoinId: string | null
) => {
  const data = await invoke("merge_coins", {
    coinType: coinType,
    coinIdList: coins,
    gasCoinId: gasCoinId,
  });
  return { data };
};
