import { invoke } from "@tauri-apps/api";
import { IpcResponse } from "../bindings";

export const transferObject = async (
  objectId: string,
  recipient: string,
  gasCoinId: string | null
) => {
  const { error, result } = (await invoke("tranfer_object", {
    objectId: objectId,
    recipient: recipient,
    gasCoinId: gasCoinId,
  })) as IpcResponse<any>;
  if (error) {
    console.log(error);
  }
  if (result) {
    console.log(result);
  }
  return { error, result };
};
