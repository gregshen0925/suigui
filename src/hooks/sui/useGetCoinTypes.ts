import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getRemoteObjectTypes } from "../../utils/getRemoteObjectTypes";

export function useGetCoinTypes() {
  const [objectTypes, setObjectTypes] = useState<string[]>([]);
  const {
    data: coins,
    refetch: refetchCoins,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["getRemoteObjects"],
    queryFn: getRemoteObjectTypes,
    onSuccess: (data) => {
      const { objectTypes } = data;
      setObjectTypes(objectTypes);
    },
  });

  return { coins, refetchCoins, objectTypes, isLoading, isFetching };
}
