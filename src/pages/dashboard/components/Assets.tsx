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
      <SelectButton
        setSelectedCoin={setSelectedCoin}
        selectedCoin={selectedCoin}
      />
      <div>
        <Objects selectedCoin={selectedCoin || ""} />
      </div>
    </div>
  );
};

export default Sidebar;
