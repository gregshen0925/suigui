import { create } from "zustand";
import { type GasCoin } from "../../types";
import { type SuiCoinResult } from "../bindings";

interface ObjectStore {
  objects: SuiCoinResult[];
}

interface ObjectAction {
  setObjects: (objects: SuiCoinResult[]) => void;
  filterCoin: (objectID: string) => void;
  returnGasCoin: (gasCoin: GasCoin) => void;
}

export const useObjectStore = create<ObjectStore & ObjectAction>()((set) => ({
  objects: [],
  setObjects: (objects) => {
    set(() => ({ objects: objects }));
  },
  filterCoin: (objectId) => {
    set((state) => ({
      objects: state.objects.filter((object) => object.coin_id !== objectId),
    }));
  },
  returnGasCoin: (gasCoin) => {
    set((state) => ({
      objects: [...state.objects, gasCoin],
    }));
  },
}));
