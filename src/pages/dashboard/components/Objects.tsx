import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { type Object } from "../../../../types";
import { getObjectsByType } from "../../../utils/getObjectsByType";

type Props = {
  selectedCoin: string;
};

const Objects = ({ selectedCoin }: Props) => {
  const [objects, setObjects] = useState<Object[]>([
    { ObjectId: "1vnjeovjwerdnvwre", balance: 1 },
    { ObjectId: "2vfejiojvrkevm", balance: 2 },
    { ObjectId: "3vmeiowgmlkremgrlk", balance: 3 },
  ]);
  const handleOnDrag = (
    e: React.DragEvent<HTMLDivElement>,
    objectId: string
  ) => {
    e.dataTransfer.setData("objectId", objectId);
    console.log("ObjectId", objectId);
    // setObjects(objects.filter((object) => object.ObjectId !== objectId));
  };
  const handleOnDropToMerge = (e: React.DragEvent<HTMLDivElement>) => {
    const objectId = e.dataTransfer.getData("objectId");
    console.log("ObjectId", objectId);
    // setCoinsToMerge([...coinsToMerge, objectId]);
    // setObjects(objects.filter((object) => object.coinObjectId !== objectId));
  };
  const handleOnDropToSend = (e: React.DragEvent<HTMLDivElement>) => {
    const objectId = e.dataTransfer.getData("objectId");
    console.log("ObjectId", objectId);
    // setGasObject(objectId);
    // setObjects(objects.filter((object) => object.coinObjectId !== objectId));
  };
  //   const handleOnDropGas = (e: React.DragEvent<HTMLDivElement>) => {
  //     const objectId = e.dataTransfer.getData("objectId");
  //     console.log("objectId", objectId);
  //     setGasObject(objectId);
  //     setObjects(objects.filter((object) => object.coinObjectId !== objectId));
  //   };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  //   const { refetch: refetchObjects } = useQuery({
  //       queryKey: ["getObjectsByType"],
  //       queryFn: ()=>getObjectsByType(selectedCoin),
  //       onSuccess: (data) => {
  //         const { result } = data;
  //         if (result) {
  //           setObjects(result);
  //           if (error) {
  //             toast.error(error);
  //           }
  //         }
  //       },
  //     });

  return (
    <div className="">
      <div className="pt-5">
        <div className=" grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {objects?.map((object, index) => (
            <div
              key={index}
              // onDrop={handleOnDropToMerge}
              // onDragOver={handleDragOver}
              draggable
              onDragStart={(e) => handleOnDrag(e, object.ObjectId)}
              className="m-2 w-[130px] h-[130px] rounded-full bg-white text-black flex flex-col justify-center items-center"
            >
              <div className="absolute w-[130px] h-[130px] z-[1] m-2 rounded-full" />
              <div className=" text-center">
                <div className="">
                  {" "}
                  {object.ObjectId.slice(0, 4) +
                    "..." +
                    object.ObjectId.slice(-4)}
                </div>
                <div className="">{object.balance}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Objects;
