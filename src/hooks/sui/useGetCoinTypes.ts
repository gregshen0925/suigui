import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getRemoteCoinTypes } from "../../utils/getRemoteCoinTypes";

export function useGetCoinTypes() {
  const [coinTypes, setCoinTypes] = useState<string[]>([]);
  const {
    data: coins,
    refetch: refetchCoins,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["getRemoteObjects"],
    queryFn: getRemoteCoinTypes,
    onSuccess: (data) => {
      const { coinTypes } = data;
      setCoinTypes(coinTypes);
    },
  });

  return { coins, refetchCoins, coinTypes, isLoading, isFetching };
}
