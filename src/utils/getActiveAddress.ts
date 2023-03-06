import { invoke } from "@tauri-apps/api";

type GetAddressRes = {
  error: string | null;
  result: string | null;
};

export const getActiveAddress = async () => {
  const { error, result } = (await invoke(
    "get_active_address"
  )) as GetAddressRes;
  return { error, result };
};
