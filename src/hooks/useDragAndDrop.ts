import { useState } from "react";
import { toast } from "react-hot-toast";
import { useStore } from "../store/store";
import { mergeCoins } from "../utils/mergeCoins";
import { useGetCoinsByType } from "./sui/useGetCoinsByType";
import { useSelectedCoin } from "./sui/useSelectedCoin";

type GasObject = {
  coin_id: string;
  balance: number;
};

export const useDragAndDrop = () => {
  const { selectedCoin, setSelectedCoin } = useSelectedCoin();
  const { objects, loadingCoins, fetchingCoins, refetchCoins } =
    useGetCoinsByType(selectedCoin);
  const [isDragged, setIsDragged] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [gasObject, setGasObject] = useState<GasObject>({
    coin_id: "",
    balance: 0,
  });
  const [filterCoin] = useStore((state) => [state.filterCoin]);

  const handleOnDrag = (
    e: React.DragEvent<HTMLDivElement>,
    objectId: string,
    balance: number
  ) => {
    e.dataTransfer.setData("objectId", objectId);
    e.dataTransfer.setData("balance", `${balance}`);
    setIsDragged(objectId);
  };

  const handleOnDragEnd = () => {
    setIsDragged("");
    setIsDragOver(false);
  };

  const handleOnDragLeave = () => {
    setIsDragOver(false);
  };

  const handleOnDropGas = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const objectId = e.dataTransfer.getData("objectId");
    const balance = e.dataTransfer.getData("balance");
    setGasObject({ coin_id: objectId, balance: Number(balance) });
    toast.success(`Set ${objectId.slice(0, 4)}...${objectId.slice(-4)} as Gas`);
    filterCoin(objectId);
    setIsDragOver(false);
  };

  const handleOnDropToMerge = async (
    e: React.DragEvent<HTMLDivElement>,
    mergeTo: string
  ) => {
    e.preventDefault();
    const coinToMerge = e.dataTransfer.getData("objectId");
    console.log(mergeTo, coinToMerge);
    if (coinToMerge === mergeTo) return;
    toast.promise(
      mergeCoins(
        selectedCoin,
        [mergeTo, coinToMerge],
        gasObject.coin_id || null
      ),
      {
        loading: "Merging...",
        success: `Merged ${coinToMerge.slice(0, 4)}...${coinToMerge.slice(
          -4
        )} to ${mergeTo.slice(0, 4)}...${mergeTo.slice(-4)}`,
        error: "Error when fetching",
      }
    );
    // setObjects(objects.filter((object) => object.coinObjectId !== objectId));
  };

  const handleOnDropToSend = (
    e: React.DragEvent<HTMLDivElement>,
    contact: string
  ) => {
    e.preventDefault();
    const objectId = e.dataTransfer.getData("objectId");
    console.log("ObjectId", objectId);
    toast.success("Sent");
    // setGasObject(objectId);
    // setObjects(objects.filter((object) => object.coinObjectId !== objectId));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  return {
    gasObject,
    handleOnDrag,
    handleOnDropGas,
    handleOnDropToMerge,
    handleOnDropToSend,
    handleDragOver,
    setSelectedCoin,
    isDragged,
    setIsDragged,
    handleOnDragEnd,
    isDragOver,
    handleOnDragLeave,
    loadingCoins,
    fetchingCoins,
    refetchCoins,
    objects,
  };
};
