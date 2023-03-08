import { type NextPage } from "next";
import dynamic from "next/dynamic";
import React from "react";

const Assets = dynamic(() => import("../../components/Dashboard/Assets"), {
  ssr: false,
});
const Tabs = dynamic(() => import("../../components/Dashboard/Tabs"), {
  ssr: false,
});

const Dashboard: NextPage = () => {
  return (
    <div className="flex pt-[3rem] space-x-6">
      <div className="w-1/2 pl-8">
        <Assets />
      </div>
      <div className="w-1/2 pr-8">
        <Tabs />
      </div>
    </div>
  );
};

export default Dashboard;
