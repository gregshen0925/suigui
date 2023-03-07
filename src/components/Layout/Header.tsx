import Link from "next/link";
import React, { type Dispatch, type SetStateAction, useState } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useActiveAddress } from "../../hooks/sui/useActiveAddress";
import { toast } from "react-hot-toast";

type Props = {
  setConnectModal: Dispatch<SetStateAction<boolean>>;
};

const Header = ({ setConnectModal }: Props) => {
  const [nav, setNav] = useState<boolean>(false);

  const router = useRouter();
  const pathname = router.pathname.split("/")[1];

  const { address } = useActiveAddress();

  const handleNav = () => {
    setNav(!nav);
  };

  const handleCreateModal = () => {
    setNav(false);
    setConnectModal(true);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(address);
    toast.success("Copied Address");
  };

  return (
    <div
      style={{ backgroundColor: "transparent" }}
      className="w-full pt-2 duration-300 ease-in"
    >
      <div className="flex items-center justify-between text-white m-auto my-2 w-11/12 pt-2 md:pt-4">
        <Link href="/">
          <div className="flex items-center space-x-2">
            {/* <div className="">
              <Image src={Logo} height={60} width={60} alt="LOTOF Logo" />
            </div> */}
            <div
              style={{ color: "white" }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-widest"
            >
              Sui GUI
            </div>
          </div>
        </Link>
        <ul
          style={{ color: "white" }}
          className="hidden sm:flex sm:items-center font-bold space-x-8"
        >
          <li className="transition duration-300 ease-in-out hover:scale-110">
            <Link href={"/ecosystem"}>
              <div
                className={`${
                  pathname == "ecosystem"
                    ? "underline underline-offset-4 text-blue-600 text-xl"
                    : ""
                }  `}
              >
                Ecosystem
              </div>
            </Link>
          </li>
          <li className="transition duration-300 ease-in-out hover:scale-110">
            <Link href={"/assets"}>
              <div
                className={`${
                  pathname == "assets"
                    ? "underline underline-offset-4 text-blue-600 text-xl"
                    : ""
                }  `}
              >
                Assets
              </div>
            </Link>
          </li>
          <li className="">
            {address ? (
              <motion.button
                onClick={handleCopyText}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                className="flex w-[130px] h-[50px] text-lg items-center justify-center rounded-2xl bg-gradient-to-r from-sky-600 to-blue-600 font-bold text-white hover:from-blue-500 hover:to-sky-500"
              >
                {address.slice(0, 4) + "..." + address.slice(-4)}
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                onClick={handleCreateModal}
                className="flex w-[130px] h-[50px] text-lg items-center justify-center rounded-2xl bg-gradient-to-r from-sky-600 to-blue-600 font-bold text-white hover:from-blue-500 hover:to-sky-500"
              >
                Connect
              </motion.button>
            )}
          </li>
        </ul>

        {/*Small App Button */}
        <div className="z-10 block sm:hidden" onClick={handleNav}>
          {nav ? (
            <AiOutlineClose size={20} style={{ color: "white" }} />
          ) : (
            <AiOutlineMenu size={30} style={{ color: "white" }} />
          )}
        </div>
        {/* Small App Menu */}
        <div
          className={
            nav
              ? "absolute top-0 left-0 right-0 bottom-0 flex h-screen w-full items-center justify-center bg-black text-center duration-300 ease-in sm:hidden"
              : "absolute top-0 left-[-100%] right-0 bottom-0 flex h-screen w-full items-center justify-center bg-black text-center duration-300 ease-in sm:hidden"
          }
        >
          <ul>
            <li
              onClick={handleNav}
              className="p-4 text-2xl hover:text-gray-500"
            >
              <Link href="/ecosystem">Ecosystem</Link>
            </li>
            <li
              onClick={handleNav}
              className="p-4 text-2xl hover:text-gray-500"
            >
              <Link href="/assets">Assets</Link>
            </li>
            <li
              onClick={handleCreateModal}
              className="p-4 text-2xl hover:text-gray-500"
            >
              Connect
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
