/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Image from "next/image";
import React, { type Dispatch, type SetStateAction } from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";

type Props = {
  setConnectModal: Dispatch<SetStateAction<boolean>>;
};

const LoginCard = ({ setConnectModal }: Props) => {
  const isLogin = false;
  return (
    <>
      <Tilt
        glareEnable={true}
        tiltMaxAngleX={10}
        tiltMaxAngleY={0}
        glareBorderRadius={"15px"}
        glareColor={"#FFFFFF"}
      >
        <div className="h-[300px] w-[300px] rounded-2xl bg-white/50 font-mono sm:h-[400px] sm:w-[400px]">
          <button
            onClick={() => setConnectModal(false)}
            className="absolute top-3 right-2.5 ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:text-black"
          >
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          <div className="flex flex-col justify-center pt-5 sm:pt-10">
            <div className="text-sky-800 text-2xl font-bold text-center">
              Login
            </div>
            <div className="flex flex-col items-center justify-center pt-10 space-y-5">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-[230px] h-[60px] bg-white/50 text-black rounded-xl font-bold"
              >
                Create New Address
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-[230px] h-[60px] bg-white/50 text-black rounded-xl font-bold"
              >
                Import Seed Phrase
              </motion.button>
            </div>
          </div>
        </div>
      </Tilt>
    </>
  );
};

export default LoginCard;
