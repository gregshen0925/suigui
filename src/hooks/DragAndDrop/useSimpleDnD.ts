import { useState } from "react";
import { toast } from "react-hot-toast";
import { useStore } from "../../store/store";
import { useGetCoinsByType } from "../Sui/useGetCoinsByType";
import { useSelectedCoinType } from "../Sui/useSelectedCoinType";

type GasObject = {
  coin_id: string;
  balance: number;
};

export const useSimpleDnD = () => {
  const { selectedCoinType } = useSelectedCoinType();
  const { objects, loadingCoins, fetchingCoins, refetchCoins } =
    useGetCoinsByType(selectedCoinType);

  // if coin is being dragged
  const [isDragged, setIsDragged] = useState<string>("");

  // if coin is dragged over to gas box
  const [isDragOverToSetGas, setIsDragOverToSetGas] = useState<boolean>(false);

  // set gas coin
  const [gasObject, setGasObject] = useState<GasObject>({
    coin_id: "",
    balance: 0,
  });

  // zustand store filter coin
  const [filterCoin] = useStore((state) => [state.filterCoin]);

  // handle coin drag
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
  };

  // handle coin drag leave gas box
  const handleOnDragLeaveGasBox = () => {
    setIsDragOverToSetGas(false);
  };

  const handleOnDropGas = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const objectId = e.dataTransfer.getData("objectId");
    const balance = e.dataTransfer.getData("balance");
    setGasObject({ coin_id: objectId, balance: Number(balance) });
    toast.success(`Set ${objectId.slice(0, 4)}...${objectId.slice(-4)} as Gas`);
    filterCoin(objectId);
    setIsDragOverToSetGas(false);
  };

  const handleDragOverToSetGas = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOverToSetGas(true);
  };

  return {
    gasObject,
    handleOnDrag,
    handleOnDropGas,
    handleDragOverToSetGas,
    isDragged,
    setIsDragged,
    handleOnDragEnd,
    isDragOverToSetGas,
    handleOnDragLeaveGasBox,
    loadingCoins,
    fetchingCoins,
    refetchCoins,
    objects,
  };
};
