import React from "react";
import Sidebar from "./components/Sidebar";

type Props = {};

const index = (props: Props) => {
  return (
    <div className="flex p-5">
      <Sidebar />
    </div>
  );
};

export default index;
