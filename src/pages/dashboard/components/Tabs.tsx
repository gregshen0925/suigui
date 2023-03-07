import React from "react";

type Props = {};

enum Tab {
  CONTACT = "Contact",
  NFT = "NFT Projects",
  DEFI = "DeFi Protocols",
}

const Tabs = (props: Props) => {
  const [selectedTab, setSelectedTab] = React.useState<Tab>(Tab.CONTACT);
  return (
    <div className="w-full h-[80vh] bg-sky-100 text-gray-700 rounded-xl">
      <div className="flex justify-center pt-[2.5rem] ">
        <div className="w-4/5">
          {/* Tabs */}
          <div className="grid grid-cols-3">
            {Object.values(Tab).map((tab, index) => (
              <div className="col-span-1" key={index}>
                <button
                  onClick={() => setSelectedTab(tab)}
                  className={`w-full py-3 ${
                    selectedTab == tab
                      ? "bg-blue-400 text-white border-blue-400 text-xl"
                      : "bg-blue-200 text-gray-500 border-gray-300 text-lg hover:bg-blue-500 hover:text-gray-300"
                  }  rounded-t-xl font-bold border-b transition duration-200`}
                >
                  {tab}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="h-[68vh] w-4/5 ">
          <div className="bg-blue-400 h-full w-full rounded-b-xl">
            <div className="p-[2rem]">
              {selectedTab == Tab.CONTACT ? <div>contact</div> : null}
              {selectedTab == Tab.NFT ? <div>nft</div> : null}
              {selectedTab == Tab.DEFI ? <div>defi</div> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tabs;
