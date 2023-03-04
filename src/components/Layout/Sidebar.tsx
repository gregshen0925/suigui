/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

const SideBar = () => {
  const router = useRouter();

  return (
    <div className="ml-8 flex flex-col overflow-x-hidden rounded-2xl bg-white/30 max-h-screen">
      <div className="p-8 h-full">
        <p className="text-md text-center font-mono font-normal text-gray-500">
          Menu
        </p>
        <ul className="my-4 space-y-3">
          <li>
            <Link href={""}>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group flex w-full h-[55px] items-center rounded-lg bg-blue-300 p-3 text-base font-bold text-gray-900 hover:bg-blue-400 hover:shadow"
              >
                <span className="flex-1 whitespace-nowrap text-center"></span>
              </motion.button>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
