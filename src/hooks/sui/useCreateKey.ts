import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-hot-toast";
import type { CreateConfigResult, IpcResponse } from "../../bindings";
import { createNewKey } from "../../utils/createNewKey";

export function useCreateKey() {
  const [createNewAddress, setCreateNewAddress] = useState<boolean>(false);
  const [seedPhrase, setSeedPhrase] = useState<string[]>([]);
  const { refetch: getNewKey } = useQuery({
    queryKey: ["createNewKey"],
    queryFn: createNewKey,
    enabled: false,
    onSuccess: (data) => {
      const { error, result } = data as IpcResponse<CreateConfigResult>;
      if (result) {
        const { address, phrase } = result;
        setSeedPhrase(phrase.split(" "));
        setCreateNewAddress(true);
      }
      if (error) {
        toast.error(error);
      }
    },
  });

  return { createNewAddress, seedPhrase, getNewKey };
}
