import { create } from "zustand";

interface SelectedCoinType {
  selectedCoinType: string;
}

interface SelectedCoinTypeAction {
  setSelectedCoinType: (selectedCoinType: string) => void;
}

export const useSelectedCoinTypeStore = create<
  SelectedCoinType & SelectedCoinTypeAction
>()((set) => ({
  selectedCoinType: "0x2::sui::SUI",
  setSelectedCoinType: (selectedCoinType) => {
    set(() => ({ selectedCoinType: selectedCoinType }));
  },
}));
