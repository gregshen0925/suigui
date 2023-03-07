/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
import dynamic from "next/dynamic";
import { useState } from "react";
import { useGetCoinTypes } from "../../../hooks/sui/useGetCoinTypes";
import { useGetObjects } from "../../../hooks/sui/useGetObjects";

const SelectButton = dynamic(() => import("./SelectButton"), {
  ssr: false,
});
const Objects = dynamic(() => import("./Objects"), {
  ssr: false,
});

const Sidebar = () => {
  const [selectedCoin, setSelectedCoin] = useState<string>();

  return (
    <div className="h-[80vh] w-full flex-col p-5 rounded-xl bg-sky-100">
      <div className="grid grid-cols-3 items-center">
        <div className="col-span-1">
          <SelectButton
            setSelectedCoin={setSelectedCoin}
            selectedCoin={selectedCoin}
          />
        </div>
        <div className="font-mono font-bold text-xl col-span-1 text-center">
          <div>Active</div>
          <div>{selectedCoin}</div>
        </div>
      </div>
      <div className="">
        <Objects selectedCoin={selectedCoin || ""} />
      </div>
    </div>
  );
};

export default Sidebar;
