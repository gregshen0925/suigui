import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { getCoinsByType } from "../../../utils/getCoinsByType";
import { type SuiCoinResult } from "../../../bindings";

type Props = {
  selectedCoin: string;
};
const dummyObjects = [
  { ObjectId: "1vnjeovjwerdnvwre", balance: 1 },
  { ObjectId: "2vfejiojvrkevm", balance: 2 },
  { ObjectId: "3vmeiowgmlkremgrlk", balance: 3 },
];

const Objects = ({ selectedCoin }: Props) => {
  const [objects, setObjects] = useState<SuiCoinResult[]>([]);
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
  console.log(selectedCoin);

  const { refetch: refetchCoins } = useQuery({
    queryKey: ["getCoinsByType"],
    queryFn: () => getCoinsByType(selectedCoin),
    onSuccess: (data) => {
      const { result } = data;
      if (result) {
        setObjects(result);
        console.log(result);
      }
    },
    enabled: selectedCoin !== "",
  });

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
              onDragStart={(e) => handleOnDrag(e, object.coin_id)}
              className="m-2 w-[130px] h-[130px] rounded-full bg-white text-black flex flex-col justify-center items-center"
            >
              <div className="absolute w-[130px] h-[130px] z-[1] m-2 rounded-full" />
              <div className=" text-center">
                <div className="">
                  {" "}
                  {object.coin_id.slice(0, 4) +
                    "..." +
                    object.coin_id.slice(-4)}
                </div>
                <div className="">{Number(object.balance) / 10 ** 9}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Objects;
