import { create } from "zustand";
import { type SuiCoinResult } from "../bindings";

// interface Store {
//   bears: number;
// }

// interface Actions {
//   increase: (by: number) => void;
//   removeAllBears: () => void;
// }

// export const useStore = create<Store & Actions>()((set) => ({
//   bears: 0,
//   increase: (by) => set((state) => ({ bears: state.bears + by })),
//   removeAllBears: () => set({ bears: 0 }),
// }));

interface ObjectStore {
  objects: SuiCoinResult[];
  setObjects: (objects: SuiCoinResult[]) => void;
  filterCoin: (objectID: string) => void;
}

export const useStore = create<ObjectStore>()((set) => ({
  objects: [],
  setObjects: (objects) => {
    set(() => ({ objects: objects }));
  },
  filterCoin: (objectId) => {
    set((state) => ({
      objects: state.objects.filter((object) => object.coin_id !== objectId),
    }));
  },
}));
