import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { type SuiCoinResult } from "../../bindings";
import { getCoinsByType } from "../../utils/getCoinsByType";

export function useGetCoinsByType(selectedCoin: string) {
  const [objects, setObjects] = useState<SuiCoinResult[]>([]);
  const { isLoading, isFetching } = useQuery({
    queryKey: ["getCoinsByType"],
    queryFn: () => getCoinsByType(selectedCoin),
    onSuccess: (data) => {
      const { error, result } = data;
      if (result) {
        setObjects(result);
        console.log(result);
        if (error) {
          console.log(error);
        }
      }
    },
  });

  return { objects, isLoading, isFetching };
}
