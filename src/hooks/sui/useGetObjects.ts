import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { getRemoteObjects } from "../../utils/getRemoteObjects";

export function useGetObjects() {
  const { data, refetch: refetchObjects } = useQuery({
    queryKey: ["getRemoteObjects"],
    queryFn: getRemoteObjects,
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

  return { data, refetchObjects };
}
