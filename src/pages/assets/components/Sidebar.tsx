/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Sidebar = () => {
  const router = useRouter();

  const coinTypes: string[] = ["Sui", "Eth"];

  return (
    <div className="hidden h-[85vh] max-w-xs flex-col p-5 md:flex md:min-w-[20rem] lg:min-w-[25rem] md:pt-[3rem] rounded-xl bg-white/30 pb-2">
      <div className="">
        <p className="text-md text-center font-mono font-normal text-gray-700">
          Assets
        </p>
        <ul className="my-4 space-y-3">
          {coinTypes.map((coinType) => (
            <li key={coinType}>
              <Link href={""}>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group flex w-full h-[55px] items-center rounded-lg bg-blue-300 p-3 text-base font-bold text-gray-900 hover:bg-blue-400 hover:shadow"
                >
                  <span className="flex-1 whitespace-nowrap text-center">
                    {coinType}
                  </span>
                </motion.button>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
