import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { mergeCoins } from "../../utils/mergeCoins";

export function useMergeCoins(
  coin_type: string,
  coins: string[],
  gas_coin_id: string | null
) {
  const { data } = useQuery({
    queryKey: ["mergeCoins"],
    queryFn: () => mergeCoins(coin_type, coins, gas_coin_id),
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
