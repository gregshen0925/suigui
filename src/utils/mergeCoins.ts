import { invoke } from "@tauri-apps/api";

export const mergeCoins = async (
  coinType: string,
  coins: string[],
  gas_coin_id: string | null
) => {
  const data = await invoke("merge_coins", {
    coin_type: coinType,
    coins: coins,
    gas_coin_id: gas_coin_id,
  });
  return { data };
};
