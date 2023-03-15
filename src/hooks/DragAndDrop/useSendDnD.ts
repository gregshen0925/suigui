import { useState } from "react";
import { toast } from "react-hot-toast";
import { useStore } from "../../store/store";
import { transferCoin } from "../../utils/transferCoin";

export const useSendDnD = () => {
  // zustand store filter coin
  const [filterCoin] = useStore((state) => [state.filterCoin]);

  // if coin is dragged over to other coin to send
  const [isDragOverToSend, setIsDragOverToSend] = useState<string>();

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
    toast.promise(transferCoin(), {
      loading: "Sending...",
      success: `Sent ${coinToSend.slice(0, 4)}...${coinToSend.slice(
        -4
      )} to ${contact.slice(0, 4)}...${contact.slice(-4)}`,
      error: "Error when sending",
    });
  };

  return {
    handleOnDropToSend,
  };
};
