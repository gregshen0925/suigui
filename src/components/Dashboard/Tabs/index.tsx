import React from "react";
import Contact from "./Contact";

enum Tab {
  CONTACT = "Contact",
  NFT = "NFT Projects",
  DEFI = "DeFi Protocols",
}

const Tabs = () => {
  const [selectedTab, setSelectedTab] = React.useState<Tab>(Tab.CONTACT);
  return (
    <div className="w-full rounded-xl bg-gradient-to-b from-black to-white p-[1px]">
      <div className="w-full h-[80vh] bg-gradient-to-b from-slate-800 to-black text-white rounded-xl">
        <div className="flex justify-center pt-[2.5rem]">
          <div className="w-4/5">
            {/* Tabs */}
            <div className="grid grid-cols-3">
              {Object.values(Tab).map((tab, index) => (
                <div className="col-span-1" key={index}>
                  <button
                    onClick={() => setSelectedTab(tab)}
                    className={`w-full py-3 ${
                      selectedTab == tab
                        ? "bg-black text-white lg:text-md text-sm border-t-slate-600 border-b-transparent border-x-slate-600 border-[1px] "
                        : "bg-gray-800 text-gray-400 text-xs lg:text-sm hover:bg-gray-700 hover:text-gray-300"
                    }  rounded-t-xl font-bold transition duration-200`}
                  >
                    {tab}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="w-4/5 h-[65vh]">
            <div className="bg-black border-gray-700 border-x border-b h-full w-full rounded-b-xl">
              <div className="p-[2rem]">
                {selectedTab == Tab.CONTACT ? <Contact /> : null}
                {selectedTab == Tab.NFT ? <div>nft</div> : null}
                {selectedTab == Tab.DEFI ? <div>defi</div> : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tabs;
