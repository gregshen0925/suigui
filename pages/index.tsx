import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

import { invoke } from "@tauri-apps/api";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { motion } from "framer-motion";

const Home: NextPage = () => {
  const [name, setName] = useState<string>("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleClick = () => {
    if (!name) {
      toast.error("Please enter your name");
      return;
    }
    async function greet() {
      const result = await invoke("greet", { name });
      toast.success(result as string);
    }
    greet();
    // toast.success("Tx sent");
  };

  return (
    <div className="custom-img2 z-[-2] flex min-h-screen bg-cover bg-fixed bg-center items-center justify-center">
      <div className="absolute z-[-1] top-0 bottom-0 left-0 right-0 h-screen bg-black/10" />

      <Head>
        <title>Sui Gui</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <div className="relative">
          <input
            className="block w-full p-4 text-sm text-white border border-gray-300 rounded-lg bg-white/20 outline-none placeholder:text-gray-200"
            placeholder="Name"
            onChange={handleChange}
            required={true}
          />
          <motion.button
            className="text-white absolute right-2.5 bottom-2.5 bg-[#00BCD4]/70 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 "
            onClick={handleClick}
            whileTap={{ scale: 0.9 }}
          >
            Enter
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Home;
