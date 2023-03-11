import { ReactNode, createContext, useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { mergeCoins } from "../utils/mergeCoins";
import { ObjectProps } from "../components/Dashboard/Assets/Object";

export type GasObject = {
  coin_id: string;
  balance: number;
};

export const ItemTypes = {
  OBJECT: "object",
};

const ObjectContext = createContext<{
  selectedCoin: string;
  objects: ObjectProps[];
  gasObject: GasObject;
  handleOnDropGas: (item: ObjectProps) => void;
  handleSelectCoin: (coin: string) => void;
}>({
  selectedCoin: "",
  objects: [],
  gasObject: {
    coin_id: "",
    balance: 0,
  },
  handleOnDropGas: () => {},
  handleSelectCoin: () => {},
});

const ObjectProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCoin, setSelectedCoin] = useState<string>("0x2::sui::SUI");
  const [gasObject, setGasObject] = useState<GasObject>({
    coin_id: "",
    balance: 0,
  });
  const [objects, setObjects] = useState<ObjectProps[]>([
    {
      coin_type: "testType",
      coin_id: "Id1",
      balance: 5000000000000000000,
    },
    {
      coin_type: "testType",
      coin_id: "Id2",
      balance: 1000000000000000000,
    },
  ]);

  const handleOnDropGas = (item: ObjectProps) => {
    console.log("ObjectId", item.coin_id, item.balance);
    setGasObject({ coin_id: item.coin_id, balance: Number(item.balance) });
    updateObjects(item.coin_id);
    toast.success(
      `Set ${item.coin_id.slice(0, 4)}...${item.coin_id.slice(-4)} as Gas`
    );
  };

  // console.log("Objects", objects);
  const updateObjects = useCallback(
    (objectId: string) => {
      const newObjects = objects.filter(
        (object) => object.coin_id !== objectId
      );
      console.log("NewObjects", newObjects);
      setObjects(newObjects);
    },
    [objects]
  );

  const handleSelectCoin = (coin: string) => {
    setSelectedCoin(coin);
  };

  // const handleOnDropToMerge = (
  //   e: React.DragEvent<HTMLDivElement>,
  //   mergeTo: string
  // ) => {
  //   const coinToMerge = e.dataTransfer.getData("objectId");
  //   // const coinToMerge = objectId;
  //   console.log("ObjectId", coinToMerge);
  //   mergeCoins(selectedCoin, [mergeTo, coinToMerge], gasObject.coin_id);
  //   toast.success(
  //     `Merged ${coinToMerge.slice(0, 4)}...${coinToMerge.slice(
  //       -4
  //     )} to ${mergeTo.slice(0, 4)}...${mergeTo.slice(-4)}`
  //   );
  //   // setObjects(objects.filter((object) => object.coinObjectId !== objectId));
  // };
  // const handleOnDropToSend = (
  //   e: React.DragEvent<HTMLDivElement>,
  //   contact: string
  // ) => {
  //   const objectId = e.dataTransfer.getData("objectId");
  //   console.log("ObjectId", objectId);
  //   toast.success("Sent");
  //   // setGasObject(objectId);
  //   // setObjects(objects.filter((object) => object.coinObjectId !== objectId));
  // };

  // const enableDropping = (e: React.DragEvent<HTMLDivElement>) => {
  //   e.preventDefault();
  // };

  return (
    <ObjectContext.Provider
      value={{
        selectedCoin,
        objects,
        gasObject,
        handleOnDropGas,
        handleSelectCoin,
      }}
    >
      {children}
    </ObjectContext.Provider>
  );
};

export { ObjectContext, ObjectProvider };
