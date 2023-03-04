/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Image from "next/image";
import React, { useState, type Dispatch, type SetStateAction } from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";
import { invoke } from "@tauri-apps/api";
import { CreateKeyResult } from "../../bindings/CreateKeyResult";

type Props = {
  setConnectModal: Dispatch<SetStateAction<boolean>>;
};

const LoginCard = ({ setConnectModal }: Props) => {
  const [createNewAddress, setCreateNewAddress] = useState<boolean>(false);
  const isLogin = false;
  const [seedPhrase, setSeedPhrase] = useState<string[]>([]);

  const handleCreateNewKey = async () => {
    const { address, phrase, scheme } = await invoke("create_new_keypair") as CreateKeyResult;
    console.log(address, phrase, scheme);
    setSeedPhrase(phrase.split(' '));
    setCreateNewAddress(true);
  }

  return (
    <>
      <Tilt
        glareEnable={false}
        tiltMaxAngleX={0}
        tiltMaxAngleY={10}
        glareBorderRadius={"15px"}
      // glareColor={"#4b5e7d"}
      >
        <div className="h-[480px] w-[500px] rounded-2xl bg-white/20 font-mono sm:h-[530px] sm:w-[600px]">
          <button
            onClick={() => setConnectModal(false)}
            className="absolute top-3 right-2.5 ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-700 hover:text-black"
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
            {/* Title */}
            <div className="text-white text-2xl font-bold text-center">
              {createNewAddress ? "Your Seed Phrase" : "Login"}
            </div>

            {/* Body */}
            {createNewAddress ? (
              <>
                <div className="flex justify-center items-center pt-5 sm:pt-10">
                  <div className="grid grid-cols-3 grid-rows-4">
                    {seedPhrase.map((word, index) => (
                      <div className="px-2 py-2">
                        <button
                          key={index}
                          className="w-[150px] h-[50px] text-white bg-blue-800/80 rounded-2xl cursor-default text-left"
                        >
                          <span className="pl-4">
                            {index + 1}.{index < 10 ? " " : null}
                            {word}
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex text-red-300 text-xl pt-4 justify-center">
                  Make sure you remember it
                </div>
                <div className="flex justify-center pt-3 sm:pt-5">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-[250px] h-[50px] text-white bg-blue-600 rounded-2xl text-xl font-bold"
                  >
                    Next
                  </motion.button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center pt-10 space-y-5">
                {" "}
                <motion.button
                  onClick={handleCreateNewKey}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-[350px] h-[60px] bg-blue-600 text-white rounded-xl font-bold"
                >
                  Create New Address
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-[350px] h-[60px] bg-blue-600 text-white rounded-xl font-bold"
                >
                  Import Seed Phrase
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </Tilt>
    </>
  );
};

export default LoginCard;
