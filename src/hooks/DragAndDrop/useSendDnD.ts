import { useState } from "react";
import { toast } from "react-hot-toast";
import { useObjectStore } from "../../store/objectStore";
import { transferObject } from "../../utils/transferObject";
import { useSimpleDnD } from "./useSimpleDnD";

export const useSendDnD = () => {
  const { gasObject } = useSimpleDnD();
  // if coin is dragged over to other coin to send
  const [isDragOverToSend, setIsDragOverToSend] = useState<string>();

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
    // if (coinToMerge === mergeTo) return;
    filterCoin(coinToSend);
    console.log(gasObject.coin_id);
    toast.promise(transferObject(coinToSend, contact, gasObject.coin_id), {
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
