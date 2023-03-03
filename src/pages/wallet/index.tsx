import { useRouter } from "next/router";
import React from "react";

type Props = {};

const index = (props: Props) => {
  const router = useRouter();
  const handleBack = () => {
    router.push("/");
  };

  return (
    <div>
      <button className="px-4 py-2" onClick={handleBack}>
        Home
      </button>
    </div>
  );
};

export default index;
