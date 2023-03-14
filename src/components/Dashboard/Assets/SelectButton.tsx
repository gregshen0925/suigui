import React from "react";
import { useGetCoinTypes } from "../../../hooks/sui/useGetCoinTypes";
import { useSelectedCoin } from "../../../hooks/sui/useSelectedCoin";

const SelectButton = () => {
  const { coinTypes, isLoading, isFetching } = useGetCoinTypes();
  const { selectedCoin, setSelectedCoin } = useSelectedCoin();

  return (
    <div className="flex z-[1] p-5 items-center">
      <div className="dropdown inline-block relative">
        <button className="bg-black text-white font-semibold py-3 justify-center rounded hover:rounded-t flex items-center w-[180px]">
          <div className="pl-4">{selectedCoin}</div>
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />{" "}
          </svg>
        </button>
        <ul className="dropdown-menu absolute hidden text-white w-[180px]">
          {isLoading || isFetching ? (
            <div className="rounded-b-lg bg-gray-900 py-2 w-[180px] block whitespace-no-wrap">
              <div role="status" className="flex justify-center">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 mr-2 animate-spin text-white fill-blue-600"
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
          ) : coinTypes.length > 0 ? (
            coinTypes.map((coinType, index) => (
              <li className="" key={index}>
                <button
                  onClick={() => setSelectedCoin(coinType)}
                  className="first:rounded-t last:rounded-b bg-gray-700 hover:bg-gray-600 py-2 w-[180px] block whitespace-no-wrap"
                >
                  {coinType}
                </button>
              </li>
            ))
          ) : (
            <li className="">
              <div className="rounded-b bg-gray-900 py-2 px-4 block whitespace-no-wrap w-[180px]">
                No Assets
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SelectButton;
