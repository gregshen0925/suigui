import React from "react";
import { useDrag } from "react-dnd";
import { GasObject, ItemTypes } from "../../../contexts/ObjectContext";
import { motion } from "framer-motion";
export type ObjectProps = {
  coin_type: string;
  coin_id: string;
  balance: number;
};

export default function Object(props: ObjectProps) {
  const { coin_id, balance } = props;
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: ItemTypes.OBJECT,
    item: { coin_id: coin_id, balance: balance },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  return (
    <motion.div
      ref={dragRef}
      style={{ opacity: isDragging ? 0 : 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="m-2 w-[130px] h-[130px] rounded-full bg-white/30 text-white flex flex-col justify-center items-center"
    >
      <div className="absolute w-[130px] h-[130px] z-[1] m-2 rounded-full" />
      <div className=" text-center font-bold text-white">
        <div className="">
          {" "}
          {coin_id.slice(0, 4) + "..." + coin_id.slice(-4)}
        </div>
        <div className="">{Number(balance) / 10 ** 9}</div>
      </div>
    </motion.div>
  );
}
