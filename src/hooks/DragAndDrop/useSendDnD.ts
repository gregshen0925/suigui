import { useState } from "react";
import { toast } from "react-hot-toast";
import { useGasCoinStore } from "../../store/gasCoinStore";
import { useObjectStore } from "../../store/objectStore";
import { transferObject } from "../../utils/transferObject";

export const useSendDnD = () => {
  // if coin is dragged over to other coin to send
  const [isDragOverToSend, setIsDragOverToSend] = useState<string>();

  // zustand store gas coin
  const [gasCoin] = useGasCoinStore((state) => [state.gasCoin]);

  // zustand store filter coin
  const [filterCoin] = useObjectStore((state) => [state.filterCoin]);

  // send section
  const handleOnDropToSend = async (
    e: React.DragEvent<HTMLDivElement>,
    contact: string
  ) => {
    e.preventDefault();
    setIsDragOverToSend("");
    const coinToSend = e.dataTransfer.getData("objectId");
    filterCoin(coinToSend);
    const gasCoinToUse = gasCoin ? gasCoin.coin_id : null;
    toast.promise(transferObject(coinToSend, contact, gasCoinToUse), {
      loading: "Sending...",
      success: `Sent ${coinToSend.slice(0, 4)}...${coinToSend.slice(
        -4
      )} to ${contact.slice(0, 4)}...${contact.slice(-4)}`,
      error: "Error when sending",
    });
  };

  const handleDragOverToSend = (
    e: React.DragEvent<HTMLDivElement>,
    contact: string
  ) => {
    e.preventDefault();
    setIsDragOverToSend(contact);
  };

  const handleOnDragLeaveContact = () => {
    setIsDragOverToSend("");
  };

  return {
    handleOnDropToSend,
    handleDragOverToSend,
    isDragOverToSend,
    handleOnDragLeaveContact,
  };
};
