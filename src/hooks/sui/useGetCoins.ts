import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { getRemoteCoins } from "../../utils/getRemoteCoins";

export function useGetCoins() {
  const { data, refetch: refetchCoins } = useQuery({
    queryKey: ["getRemoteObjects"],
    queryFn: getRemoteCoins,
    onSuccess: (data) => {
      const { error, result } = data;
      if (result) {
        console.log(result);
        if (error) {
          toast.error(error);
        }
      }
    },
  });

  return { data, refetchCoins };
}
