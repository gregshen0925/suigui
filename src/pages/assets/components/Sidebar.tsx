/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { useGetCoinTypes } from "../../../hooks/sui/useGetCoinTypes";
import { useGetObjects } from "../../../hooks/sui/useGetObjects";

const Sidebar = () => {
  const router = useRouter();
  const pathname = router.query.coinType;

  const { coinTypes } = useGetCoinTypes();

  return (
    <div className="hidden h-[80vh] max-w-xs flex-col p-5 md:flex md:min-w-[20rem] xl:min-w-[23rem] rounded-xl bg-white/30">
      <div className="">
        <p className="text-md text-center font-mono font-normal text-gray-700">
          Assets
        </p>
        <ul className="my-4 space-y-3">
          {coinTypes.map((coinType, index) => (
            <li key={index}>
              <Link href={`/assets/${coinType}`}>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group flex w-full h-[55px] justify-center items-center bg-blue-300 rounded-lg p-3 text-base font-bold text-gray-900 hover:bg-blue-400 hover:shadow"
                >
                  <span
                    className={` ${
                      pathname == coinType
                        ? "underline underline-offset-4 text-blue-600"
                        : ""
                    }`}
                  >
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
