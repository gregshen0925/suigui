import { useState } from "react";
import { toast } from "react-hot-toast";

type GasObject = {
  coin_id: string;
  balance: number;
};

export const useDragAndDrop = () => {
  const [gasObject, setGasObject] = useState<GasObject>({
    coin_id: "Not Set",
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

  const handleOnDropToMerge = (e: React.DragEvent<HTMLDivElement>) => {
    const objectId = e.dataTransfer.getData("objectId");
    console.log("ObjectId", objectId);
    toast.success("Merged");
    // setCoinsToMerge([...coinsToMerge, objectId]);
    // setObjects(objects.filter((object) => object.coinObjectId !== objectId));
  };
  const handleOnDropToSend = (e: React.DragEvent<HTMLDivElement>) => {
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
  };
};
