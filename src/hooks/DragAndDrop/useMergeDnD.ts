import { useState } from "react";
import { toast } from "react-hot-toast";
import { useStore } from "../../store/store";
import { mergeCoins } from "../../utils/mergeCoins";
import { useSelectedCoinType } from "../Sui/useSelectedCoinType";
import { useSimpleDnD } from "./useSimpleDnD";

export const useMergeDnD = () => {
  const { gasObject } = useSimpleDnD();
  const { selectedCoinType } = useSelectedCoinType();

  // if coin is dragged over to other coin to merge
  const [isDragOverToMerge, setIsDragOverToMerge] = useState<string>();

  // zustand store filter coin
  const [filterCoin] = useStore((state) => [state.filterCoin]);

  // merge section
  const handleOnDropToMerge = async (
    e: React.DragEvent<HTMLDivElement>,
    mergeTo: string
  ) => {
    e.preventDefault();
    setIsDragOverToMerge("");
    const coinToMerge = e.dataTransfer.getData("objectId");
    if (coinToMerge === mergeTo) return;
    filterCoin(coinToMerge);
    toast.promise(
      mergeCoins(
        selectedCoinType,
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
