import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getOnchainCoinTypes } from "../../utils/getOnchainCoinTypes";

export function useGetCoinTypes() {
  const [coinTypes, setCoinTypes] = useState<string[]>([]);
  const {
    data: coins,
    refetch: refetchCoins,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["getOnchainCoinTypes"],
    queryFn: getOnchainCoinTypes,
    onSuccess: (data) => {
      const { coinTypes } = data;
      setCoinTypes(coinTypes);
    },
  });

  return { coins, refetchCoins, coinTypes, isLoading, isFetching };
}
