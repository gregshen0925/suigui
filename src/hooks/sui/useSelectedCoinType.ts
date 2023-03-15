import { useState } from "react";

export const useSelectedCoinType = () => {
  const [selectedCoinType, setSelectedCoinType] =
    useState<string>("0x2::sui::SUI");

  return { selectedCoinType, setSelectedCoinType };
};
