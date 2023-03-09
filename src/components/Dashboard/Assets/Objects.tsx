import { useGetCoinsByType } from "../../../hooks/sui/useGetCoinsByType";
import { useSelectedCoin } from "../../../hooks/sui/useSelectedCoin";
import { useDragAndDrop } from "../../../hooks/useDragAndDrop";
import { motion } from "framer-motion";

const Objects = () => {
  const { selectedCoin } = useSelectedCoin();
  const { handleOnDrag, enableDropping, handleOnDropToMerge } =
    useDragAndDrop();

  const { objects, isFetching, isLoading, refetch } =
    useGetCoinsByType(selectedCoin);

  return (
    <div className="">
      <div className="pt-5 px-2">
        <div className="flex justify-center pb-5">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => refetch()}
            className="bg-black rounded-xl w-[100px] h-[50px] text-white font-bold"
          >
            Refetch
          </motion.button>
        </div>
        {isLoading || isFetching ? (
          <div className="flex justify-center pt-10">
            <div role="status ">
              <svg
                aria-hidden="true"
                className="inline w-10 h-10 mr-2 text-blue-600 animate-spin fill-white"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {objects?.map((object, index) => (
              <div
                key={index}
                onDrop={(e) => handleOnDropToMerge(e, object.coin_id)}
                onDragOver={enableDropping}
                draggable
                onDragStart={(e) =>
                  handleOnDrag(e, object.coin_id, object.balance)
                }
                className="m-2 w-[130px] h-[130px] rounded-full bg-white/30 text-white flex flex-col justify-center items-center"
              >
                <div className="absolute w-[130px] h-[130px] z-[1] m-2 rounded-full" />
                <div className=" text-center font-bold text-white">
                  <div className="">
                    {" "}
                    {object.coin_id.slice(0, 4) +
                      "..." +
                      object.coin_id.slice(-4)}
                  </div>
                  <div className="">{Number(object.balance) / 10 ** 9}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Objects;
