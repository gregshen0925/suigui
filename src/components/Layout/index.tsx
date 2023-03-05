import { Suspense, useState } from "react";
import { Toaster } from "react-hot-toast";
import ConnectModal from "../Modals/connect";
import Header from "./Header";

const toastOptions = {
  style: {
    background: "#243c5a",
    color: "white",
    fontSize: "1.2rem",
    fontWeight: "bold",
  },
  success: {
    // className: "border border-blue-500",
    iconTheme: {
      primary: "#00BCD4",
      secondary: "white",
    },
  },
  error: {
    className: "border border-red-500",
    iconTheme: {
      primary: "#EF4444",
      secondary: "white",
    },
  },
  loading: { className: "border border-yello-300" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const [connectModal, setConnectModal] = useState<boolean>(false);
  return (
    <>
      <Toaster position="top-right" toastOptions={toastOptions} />
      <Suspense
        fallback={
          <div className="custom-img2 flex h-screen w-full items-center justify-center">
            Loading...
          </div>
        }
      >
        <div className="">
          <div className="custom-img2 z-[-2] h-screen bg-cover bg-fixed">
            <div className="max-h-screen">
              <Header setConnectModal={setConnectModal} />
              {connectModal ? (
                <ConnectModal setConnectModal={setConnectModal} />
              ) : null}
              {/* <div className="my-10 max-w-xs overflow-y-hidden md:min-w-[25rem] h-full">
                <Sidebar />
              </div> */}
              <div className="font-mono">{children}</div>
            </div>
          </div>
        </div>
      </Suspense>
    </>
  );
}
