import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { mergeCoins } from "../../utils/mergeCoins";

export function useMergeCoins(
  coinType: string,
  coins: string[],
  gasCoinId: string | null
) {
  const { data } = useQuery({
    queryKey: ["mergeCoins"],
    queryFn: () => mergeCoins(coinType, coins, gasCoinId),
    onSuccess: (data) => {
      //   const { error, result } = data;
      //   if (result) {
      //     console.log(result);
      //     if (error) {
      //       toast.error(error);
      //     }
      //   }
      console.log(data);
    },
  });

  return {};
}
