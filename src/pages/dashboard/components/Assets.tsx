/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useGetCoinTypes } from "../../../hooks/sui/useGetCoinTypes";
import { useGetObjects } from "../../../hooks/sui/useGetObjects";
import Objects from "./Objects";

const Sidebar = () => {
  const router = useRouter();
  const pathname = router.query.coinType;
  const [selectedCoin, setSelectedCoin] = useState<string>();

  const { coinTypes } = useGetCoinTypes();

  const handleSelect = () => {};

  return (
    <div className="h-[80vh] w-full flex-col p-5 rounded-xl bg-sky-100">
      {/* Hover List */}
      <div className="flex z-[1] p-5 items-center">
        <div className="dropdown inline-block relative">
          <button className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded inline-flex items-center">
            <span className="mr-1">Select</span>
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />{" "}
            </svg>
          </button>
          <ul className="dropdown-menu absolute hidden text-gray-700 pt-1 w-[130px]">
            {coinTypes.length > 0 ? (
              coinTypes.map((coinType, index) => (
                <li className="" key={index}>
                  <button
                    onClick={handleSelect}
                    className="rounded-t bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap"
                  >
                    {coinType}
                  </button>
                </li>
              ))
            ) : (
              <li className="">
                <button className="rounded-t bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap">
                  No coin at the moment
                </button>
              </li>
            )}
          </ul>
        </div>
        <div className="text-center font-mono font-bold text-xl">
          {selectedCoin}
        </div>
      </div>
      <div>
        <Objects selectedCoin={selectedCoin || ""} />
      </div>
    </div>
  );
};

export default Sidebar;
