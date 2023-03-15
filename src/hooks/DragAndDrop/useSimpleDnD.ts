import { useState } from "react";
import { toast } from "react-hot-toast";
import { useGasCoinStore } from "../../store/gasCoinStore";
import { useObjectStore } from "../../store/objectStore";

export const useSimpleDnD = () => {
  // if coin is being dragged
  const [isDragged, setIsDragged] = useState<string>("");

  // if coin is dragged over to gas box
  const [isDragOverToSetGas, setIsDragOverToSetGas] = useState<boolean>(false);

  // zustand store gas coin
  const [gasCoin, setGasCoin] = useGasCoinStore((state) => [
    state.gasCoin,
    state.setGasCoin,
  ]);

  // zustand store filter coin
  const [filterCoin, returnGasCoin] = useObjectStore((state) => [
    state.filterCoin,
    state.returnGasCoin,
  ]);

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
    if (gasCoin) {
      returnGasCoin({
        coin_type: gasCoin.coin_type,
        coin_id: gasCoin.coin_id,
        balance: gasCoin.balance,
      });
    }
    setGasCoin({
      coin_type: "0x2::sui::SUI",
      coin_id: objectId,
      balance: Number(balance),
    });
    toast.success(`Set ${objectId.slice(0, 4)}...${objectId.slice(-4)} as Gas`);
    filterCoin(objectId);
    setIsDragOverToSetGas(false);
  };

  const handleDragOverToSetGas = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOverToSetGas(true);
  };

  return {
    handleOnDrag,
    handleOnDropGas,
    handleDragOverToSetGas,
    isDragged,
    setIsDragged,
    handleOnDragEnd,
    isDragOverToSetGas,
    handleOnDragLeaveGasBox,
  };
};
