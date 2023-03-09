import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { type SuiCoinResult } from "../../bindings";
import { getCoinsByType } from "../../utils/getCoinsByType";

export function useGetCoinsByType(selectedCoin: string) {
  const [objects, setObjects] = useState<SuiCoinResult[]>([
    { coin_type: "111", coin_id: "111", balance: 111 },
    { coin_type: "222", coin_id: "222", balance: 222 },
    { coin_type: "333", coin_id: "333", balance: 333 },
  ]);
  const { isLoading, isFetching, refetch } = useQuery({
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

  return { objects, setObjects, isLoading, isFetching, refetch };
}
