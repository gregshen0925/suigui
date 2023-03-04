import { invoke } from "@tauri-apps/api";
import { type CreateKeyResult } from "../bindings/CreateKeyResult";

export const createNewKey = async () => {
  const { address, phrase, scheme } = (await invoke(
    "create_new_keypair"
  )) as CreateKeyResult;
  console.log(phrase);
  return phrase;
};
