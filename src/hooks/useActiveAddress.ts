import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { getActiveAddress } from "../utils/getActiveAddress";

export function useActiveAddress() {
  const [address, setAddress] = useState<string>("");
  const { data, refetch: checkAddress } = useQuery({
    queryKey: ["getActiveAddress"],
    queryFn: getActiveAddress,
    onSuccess: (data) => {
      const { error, result } = data;
      if (result) {
        setAddress(result);
        if (error) {
          toast.error("No active address found.");
          console.log(error);
        }
      }
    },
  });

  return { address, checkAddress };
}
