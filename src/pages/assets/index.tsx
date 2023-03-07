import dynamic from "next/dynamic";
import React from "react";

type Props = {};

const Sidebar = dynamic(() => import("./components/Sidebar"), {
  ssr: false,
});

const AssetsPage = () => {
  return (
    <div className="flex pt-[3rem]">
      <div className="flex pl-5 ">
        <Sidebar />
      </div>
    </div>
  );
};

export default AssetsPage;
