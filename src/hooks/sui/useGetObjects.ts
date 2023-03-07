import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Object } from "../../../types";
import { getRemoteObjects } from "../../utils/getRemoteObjects";

export function useGetObjects() {
  const [object, setObject] = useState<Object[]>();
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

  return { object, refetchObjects };
}
