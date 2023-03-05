import dynamic from "next/dynamic";
import React from "react";

type Props = {};

const Sidebar = dynamic(() => import("../components/Sidebar"), {
  ssr: false,
});

const ProjectPage = (props: Props) => {
  return (
    <div className="flex pl-5 pt-[3rem]">
      <Sidebar />
    </div>
  );
};

export default ProjectPage;
