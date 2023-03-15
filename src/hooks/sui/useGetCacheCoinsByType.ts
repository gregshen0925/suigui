import { useQuery } from "@tanstack/react-query";
import { useObjectStore } from "../../store/objectStore";
import { getCacheCoinsByType } from "../../utils/getCacheCoinsByType";

export function useGetCacheCoinsByType(selectedCoin: string) {
  const [objects, setObjects] = useObjectStore((state) => [
    state.objects,
    state.setObjects,
  ]);
  const {
    isLoading: loadingCoins,
    isFetching: fetchingCoins,
    refetch: refetchCoins,
    isSuccess,
  } = useQuery({
    queryKey: ["getCoinsByType"],
    queryFn: () => getCacheCoinsByType(selectedCoin),
    onSuccess: (data) => {
      const { error, result } = data;
      if (error) {
        console.log(error);
      }
      if (result) {
        setObjects(result);
      }
    },
  });

  return {
    objects,
    setObjects,
    loadingCoins,
    fetchingCoins,
    refetchCoins,
    isSuccess,
  };
}
