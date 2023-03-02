import Image from "next/image";
import Link from "next/link";
import React, {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useState,
} from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { motion } from "framer-motion";

type Props = {
  setConnectModal: Dispatch<SetStateAction<boolean>>;
};

const Header = ({ setConnectModal }: Props) => {
  const [nav, setNav] = useState<boolean>(false);

  const handleNav = () => {
    setNav(!nav);
  };

  const handleModal = () => {
    setNav(false);
    setConnectModal(true);
  };

  return (
    <div
      style={{ backgroundColor: "transparent" }}
      className="fixed top-0 z-10 w-full pt-2 duration-300 ease-in"
    >
      <div className="flex items-center justify-between text-white m-auto my-2 w-11/12">
        <Link href="/">
          <div className="flex items-center space-x-2">
            {/* <div className="">
              <Image src={Logo} height={60} width={60} alt="LOTOF Logo" />
            </div> */}
            <div
              style={{ color: "white" }}
              className="text-3xl font-bold tracking-widest"
            >
              Sui GUI
            </div>
          </div>
        </Link>
        <ul
          style={{ color: "white" }}
          className="hidden sm:flex sm:items-center"
        >
          {/* <li className="p-4 transition duration-300 ease-in-out hover:scale-110">
            <Link
            >
              Docs
            </Link>
          </li> */}
          <li className="p-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onClick={handleModal}
              className="flex w-[130px] h-[60px] text-lg items-center justify-center rounded-2xl bg-gradient-to-r from-sky-600 to-blue-600 font-bold text-white hover:from-blue-500 hover:to-sky-500"
            >
              Connect
            </motion.button>
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
              <Link
                href="https://app.archbee.com/public/PREVIEW-TD3kzaCjLc0JFqjwWlYw5"
                target="_blank"
              >
                Docs
              </Link>
            </li>
            <li
              onClick={handleModal}
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
