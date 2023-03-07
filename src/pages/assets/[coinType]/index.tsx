import dynamic from "next/dynamic";
import React from "react";

type Props = {};

const Sidebar = dynamic(() => import("../components/Sidebar"), {
  ssr: false,
});
const Objects = dynamic(() => import("../components/Objects"), {
  ssr: false,
});

const CoinPage = () => {
  return (
    <div className="flex pt-[3rem]">
      <div className="flex pl-8 ">
        <Sidebar />
      </div>
      <div className="flex items-center px-10 w-1/2 ">
        <div className="w-full h-[80vh] bg-white/40 text-white rounded-xl">
          <div className="flex justify-center text-2xl font-bold text-gray-700 pt-8">
            Your objects
          </div>
          <div className="grid justify-center pt-5 ">
            <Objects />
          </div>
        </div>
      </div>
      <div className="flex justify-end w-1/4">
        <div className="w-full h-[80vh] bg-white/40 text-white rounded-xl">
          123
        </div>
      </div>
    </div>
  );
};

export default CoinPage;
