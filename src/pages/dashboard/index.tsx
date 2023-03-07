import dynamic from "next/dynamic";
import React from "react";
import Tabs from "./components/Tabs";

type Props = {};

const Assets = dynamic(() => import("./components/Assets"), {
  ssr: false,
});

const Dashboard = () => {
  return (
    <div className="flex pt-[3rem] space-x-6">
      <div className="w-1/2 pl-8">
        <Assets />
      </div>
      <div className="w-1/2 pr-8">
        <div className="w-full h-[80vh] bg-sky-100 text-gray-700 rounded-xl">
          <Tabs />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
