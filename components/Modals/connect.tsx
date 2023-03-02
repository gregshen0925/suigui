import React, {
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { motion } from "framer-motion";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import Image from "next/image";
import LoginCard from "../LoginCard";

type Props = {
  setConnectModal: Dispatch<SetStateAction<boolean>>;
};

const ConnectModal = ({ setConnectModal }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [change, setChange] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

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
