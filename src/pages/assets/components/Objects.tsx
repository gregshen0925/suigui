import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React from "react";
import type { SuiObjectResult } from "../../../bindings";

const Objects = () => {
  const router = useRouter();
  const { coinType } = router.query;
  const [objects, setObjects] = React.useState();

  // const { refetch: refetchObjects } = useQuery({
  //     queryKey: ["getObjectsByType"],
  //     queryFn: ()=>getObjectsByType(coinType),
  //     onSuccess: (data) => {
  //       const { result } = data;
  //       if (result) {
  //         setObjects(result);
  //         if (error) {
  //           toast.error(error);
  //         }
  //       }
  //     },
  //   });

  return (
    <div>
      <div className="grid grid-cols-3 md:grid-cols-4">
        <div className="flex justify-center items-center w-[80px] h-[80px] rounded-full bg-white text-black">
          123
        </div>
        <div className="flex justify-center items-center w-[80px] h-[80px] rounded-full bg-white text-black">
          123
        </div>
        <div className="flex justify-center items-center w-[80px] h-[80px] rounded-full bg-white text-black">
          123
        </div>
        <div className="flex justify-center items-center w-[80px] h-[80px] rounded-full bg-white text-black">
          123
        </div>
      </div>
    </div>
  );
};

export default Objects;
