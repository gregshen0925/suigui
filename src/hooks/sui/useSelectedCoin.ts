import { useState } from "react";

export const useSelectedCoin = () => {
  const [selectedCoin, setSelectedCoin] = useState<string>("0x2::sui::SUI");

  return { selectedCoin, setSelectedCoin };
};
