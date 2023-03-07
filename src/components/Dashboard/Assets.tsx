/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
import dynamic from "next/dynamic";
import { useState } from "react";
import Objects from "./Objects";
import SelectButton from "./SelectButton";

const Sidebar = () => {
  const [selectedCoin, setSelectedCoin] = useState<string>("0x2::sui::SUI");

  return (
    <div className="h-[80vh] w-full flex-col p-5 rounded-xl bg-sky-100">
      <div className="grid grid-cols-3 items-center">
        <div className="col-span-1 flex justify-center">
          <SelectButton
            setSelectedCoin={setSelectedCoin}
            selectedCoin={selectedCoin}
          />
        </div>
        <div className="font-mono font-bold text-3xl col-span-1 text-center text-black">
          <div>Assets</div>
        </div>
      </div>
      <Objects selectedCoin={selectedCoin} />
    </div>
  );
};

export default Sidebar;
