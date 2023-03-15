import { useState } from "react";

export const useSelectedObjectType = () => {
  const [selectedObjectType, setSelectedObjectType] =
    useState<string>("0x2::sui::SUI");

  return { selectedObjectType, setSelectedObjectType };
};
