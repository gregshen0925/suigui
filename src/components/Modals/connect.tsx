import dynamic from "next/dynamic";
import React, {
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import useOnClickOutside from "../../hooks/useOnClickOutside";

type Props = {
  setConnectModal: Dispatch<SetStateAction<boolean>>;
};

const LoginCard = dynamic(() => import("../LoginCard"), {
  ssr: false,
});

const ConnectModal = ({ setConnectModal }: Props) => {
  const clickOutsideRef = useRef<HTMLDivElement>(null);
  const clickOutsidehandler = () => {
    setConnectModal(false);
  };
  useOnClickOutside(clickOutsideRef, clickOutsidehandler);

  return (
    <div className="fixed inset-0 z-50 flex w-full items-center justify-center overflow-y-auto overflow-x-hidden bg-opacity-80 pt-40 backdrop-blur-sm sm:h-full sm:pt-0">
      {/* <div ref={clickOutsideRef} className=""> */}
      <LoginCard setConnectModal={setConnectModal} />
      {/* </div> */}
    </div>
  );
};

export default ConnectModal;
