import { useState } from "react";
import { toast } from "react-hot-toast";
import { useGasCoinStore } from "../../store/gasCoinStore";
import { useObjectStore } from "../../store/objectStore";
import { mergeCoins } from "../../utils/mergeCoins";
import { useSelectedObjectType } from "../Sui/useSelectedObjectType";

export const useMergeDnD = () => {
  const { selectedObjectType } = useSelectedObjectType();

  // if coin is dragged over to other coin to merge
  const [isDragOverToMerge, setIsDragOverToMerge] = useState<string>();

  // zustand store gas coin
  const [gasCoin] = useGasCoinStore((state) => [state.gasCoin]);

  // zustand store filter coin
  const [filterCoin] = useObjectStore((state) => [state.filterCoin]);

  // merge section
  const handleOnDropToMerge = async (
    e: React.DragEvent<HTMLDivElement>,
    mergeTo: string
  ) => {
    e.preventDefault();
    setIsDragOverToMerge("");
    const coinToMerge = e.dataTransfer.getData("objectId");
    if (coinToMerge === mergeTo) return;
    const gasCoinToUse = gasCoin ? gasCoin.coin_id : null;
    filterCoin(coinToMerge);
    toast.promise(
      mergeCoins(selectedObjectType, [mergeTo, coinToMerge], gasCoinToUse),
      {
        loading: "Merging...",
        success: `Merged ${coinToMerge.slice(0, 4)}...${coinToMerge.slice(
          -4
        )} to ${mergeTo.slice(0, 4)}...${mergeTo.slice(-4)}`,
        error: "Error when fetching",
      }
    );
  };

  const handleDragOverToMerge = (
    e: React.DragEvent<HTMLDivElement>,
    mergeTo: string
  ) => {
    e.preventDefault();
    setIsDragOverToMerge(mergeTo);
  };

  const handleOnDragLeaveCoin = () => {
    setIsDragOverToMerge("");
  };

  return {
    handleOnDropToMerge,
    handleDragOverToMerge,
    isDragOverToMerge,
    handleOnDragLeaveCoin,
  };
};
