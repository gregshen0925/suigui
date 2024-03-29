import { useSimpleDnD } from "../../../hooks/DragAndDrop/useSimpleDnD";
import { useGasCoinStore } from "../../../store/gasCoinStore";
import Objects from "./Objects";
import SelectButton from "./SelectButton";

const Assets = () => {
  const {
    handleOnDropGas,
    handleDragOverToSetGas,
    isDragOverToSetGas,
    handleOnDragLeaveGasBox,
  } = useSimpleDnD();

  // zustand store gas coin
  const [gasCoin] = useGasCoinStore((state) => [state.gasCoin]);

  return (
    <div className="w-full rounded-xl bg-gradient-to-b from-black to-white p-[1px]">
      <div className="h-[80vh] w-full flex-col p-5 rounded-xl bg-gradient-to-b from-slate-800 to-black">
        {/* Header */}
        <div className="grid  grid-cols-2 lg:grid-cols-3 items-center">
          <div className="col-span-1 flex justify-center items-center">
            <SelectButton />
          </div>
          <div className="font-mono font-bold text-xl lg:text-3xl col-span-1 text-center text-white">
            <div>Assets</div>
          </div>
          <div className="col-span-1 flex flex-col items-center">
            <div className="text-white">Gas</div>
            <div
              className={`w-[130px] h-[130px] border ${
                isDragOverToSetGas ? "border-[2px] border-green-600" : ""
              }`}
              onDrop={(e) => handleOnDropGas(e)}
              onDragOver={handleDragOverToSetGas}
              onDragLeave={handleOnDragLeaveGasBox}
            >
              <div className="flex items-center justify-center">
                <div className="m-2 w-[110px] h-[110px] rounded-full bg-white/30 text-white flex flex-col justify-center items-center">
                  <div className="absolute w-[110px] h-[110px] z-[1] m-2 rounded-full" />
                  <div className="text-xs text-center font-bold text-white">
                    <div className="">
                      {!gasCoin?.coin_id
                        ? "Not Set"
                        : gasCoin?.coin_id.slice(0, 4) +
                          "..." +
                          gasCoin?.coin_id.slice(-4)}
                    </div>
                    <div className="">
                      {!gasCoin?.coin_id
                        ? null
                        : Number(gasCoin?.balance) / 10 ** 9}
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
