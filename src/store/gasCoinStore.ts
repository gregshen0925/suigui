import { create } from "zustand";
import { type GasCoin } from "../../types";

interface GasCoinStore {
  gasCoin: GasCoin | null;
}

interface GasCoinAction {
  setGasCoin: (gasCoin: GasCoin) => void;
}

export const useGasCoinStore = create<GasCoinStore & GasCoinAction>()(
  (set) => ({
    gasCoin: null,
    setGasCoin: (gasCoin) => {
      set(() => ({ gasCoin: gasCoin }));
    },
  })
);
