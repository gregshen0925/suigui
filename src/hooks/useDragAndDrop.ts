import { useState } from "react";
import { toast } from "react-hot-toast";
import { mergeCoins } from "../utils/mergeCoins";

type GasObject = {
  coin_id: string;
  balance: number;
};

export const useDragAndDrop = () => {
  const [selectedCoin, setSelectedCoin] = useState<string>("0x2::sui::SUI");
  const [gasObject, setGasObject] = useState<GasObject>({
    coin_id: "",
    balance: 0,
  });

  const handleOnDrag = (
    e: React.DragEvent<HTMLDivElement>,
    objectId: string,
    balance: number
  ) => {
    e.dataTransfer.setData("objectId", objectId);
    e.dataTransfer.setData("balance", `${balance}`);
    console.log("ObjectId", objectId, balance);
  };
  const handleOnDropGas = (e: React.DragEvent<HTMLDivElement>) => {
    const objectId = e.dataTransfer.getData("objectId");
    const balance = e.dataTransfer.getData("balance");
    console.log("objectId", objectId);
    setGasObject({ coin_id: objectId, balance: Number(balance) });
    toast.success(`Set ${objectId.slice(0, 4)}...${objectId.slice(-4)} as Gas`);
    // setObjects(objects.filter((object) => object.coin_id !== objectId));
  };

  const handleOnDropToMerge = (
    e: React.DragEvent<HTMLDivElement>,
    mergeTo: string
  ) => {
    const coinToMerge = e.dataTransfer.getData("objectId");
    console.log("ObjectId", coinToMerge);
    mergeCoins(selectedCoin, [mergeTo, coinToMerge], gasObject.coin_id);
    toast.success(
      `Merged ${coinToMerge.slice(0, 4)}...${coinToMerge.slice(
        -4
      )} to ${mergeTo.slice(0, 4)}...${mergeTo.slice(-4)}`
    );
    // setObjects(objects.filter((object) => object.coinObjectId !== objectId));
  };
  const handleOnDropToSend = (
    e: React.DragEvent<HTMLDivElement>,
    contact: string
  ) => {
    const objectId = e.dataTransfer.getData("objectId");
    console.log("ObjectId", objectId);
    toast.success("Sent");
    // setGasObject(objectId);
    // setObjects(objects.filter((object) => object.coinObjectId !== objectId));
  };

  const enableDropping = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  return {
    gasObject,
    handleOnDrag,
    handleOnDropGas,
    handleOnDropToMerge,
    handleOnDropToSend,
    enableDropping,
    selectedCoin,
    setSelectedCoin,
  };
};
