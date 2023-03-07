/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
import dynamic from "next/dynamic";
import { useState } from "react";
import Objects from "./Objects";
import SelectButton from "./SelectButton";

const Sidebar = () => {
  const [selectedCoin, setSelectedCoin] = useState<string>("0x2::sui::SUI");

  return (
    <div className="w-full rounded-xl bg-gradient-to-b from-black to-white p-[1px]">
      <div className="h-[80vh] w-full flex-col p-5 rounded-xl bg-gradient-to-b from-slate-800 to-black">
        <div className="grid grid-cols-3 items-center">
          <div className="col-span-1 flex justify-center">
            <SelectButton
              setSelectedCoin={setSelectedCoin}
              selectedCoin={selectedCoin}
            />
          </div>
          <div className="font-mono font-bold text-3xl col-span-1 text-center text-white">
            <div>Assets</div>
          </div>
        </div>
        <Objects selectedCoin={selectedCoin} />
      </div>
    </div>
  );
};

export default Sidebar;
