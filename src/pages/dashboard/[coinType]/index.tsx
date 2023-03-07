import dynamic from "next/dynamic";
import React from "react";

type Props = {};

const Sidebar = dynamic(() => import("../components/Assets"), {
  ssr: false,
});
const Objects = dynamic(() => import("../components/Objects"), {
  ssr: false,
});

const CoinPage = () => {
  return (
    <div className="flex pt-[3rem]">
      <div className="flex pl-8">
        <Sidebar />
      </div>
      <div className="flex px-10 w-3/5">
        <Objects />
      </div>
      <div className="flex justify-end w-1/4 xl:w-1/5">
        <div className="w-full h-[80vh] bg-sky-100 text-gray-700 rounded-xl mr-[2rem]">
          <div className="flex justify-center text-2xl font-bold text-gray-700 pt-8">
            Contacts
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinPage;
