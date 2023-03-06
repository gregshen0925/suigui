import { invoke } from "@tauri-apps/api";
import { type IpcResponse, type CreateConfigResult } from "../bindings";

export const createNewKey = async () => {
  const { error, result } = (await invoke(
    "create_new_config"
  )) as IpcResponse<CreateConfigResult>;
  return { error, result };
};
