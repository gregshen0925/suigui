/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { motion } from "framer-motion";
import Objects from "./Objects";
import SelectButton from "./SelectButton";
import { useDrop } from "react-dnd";
import { useState } from "react";
import { ObjectProps } from "./Object";
import { ItemTypes, ObjectContext } from "../../../contexts/ObjectContext";
import useDnd from "../../../hooks/useDnd";

const Assets = () => {
  const { gasObject, handleOnDropGas } = useDnd();
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ItemTypes.OBJECT,
      drop: (item: ObjectProps) => handleOnDropGas(item),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    []
  );

  return (
    <div className="w-full rounded-xl bg-gradient-to-b from-black to-white p-[1px]">
      <div className="h-[80vh] w-full flex-col p-5 rounded-xl bg-gradient-to-b from-slate-800 to-black">
        {/* Header */}
        <div className="grid  grid-cols-2 lg:grid-cols-3 items-center">
          <div className="col-span-1 flex justify-center">
            <SelectButton />
          </div>
          <div className="font-mono font-bold text-xl lg:text-3xl col-span-1 text-center text-white">
            <div>Assets</div>
          </div>
          <div className="col-span-1 flex flex-col items-center">
            <div className="text-white">Gas</div>
            <div
              ref={drop}
              style={isOver ? { border: "2px solid red" } : {}}
              className="w-[130px] h-[130px] border"
            >
              <div className="flex items-center justify-center">
                <div className="m-2 w-[110px] h-[110px] rounded-full bg-white/30 text-white flex flex-col justify-center items-center">
                  <div className="absolute w-[110px] h-[110px] z-[1] m-2 rounded-full" />
                  <div className="text-xs text-center font-bold text-white">
                    <div className="">
                      {gasObject?.coin_id == ""
                        ? "Not Set"
                        : gasObject?.coin_id.slice(0, 4) +
                          "..." +
                          gasObject?.coin_id.slice(-4)}
                    </div>
                    <div className="">
                      {gasObject?.coin_id == "Not Set"
                        ? null
                        : Number(gasObject?.balance) / 10 ** 9}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Display Objects */}
        <Objects />
      </div>
    </div>
  );
};

export default Assets;
