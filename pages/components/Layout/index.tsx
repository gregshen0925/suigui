import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";

// const Sidebar = dynamic(() => import("./Sidebar"), { suspense: true });

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
  return (
    <>
      <div className="min-h-screen bg-[#53a8e8]">
        <Toaster position="top-right" toastOptions={toastOptions} />
        <Suspense
          fallback={
            <div className="custom-img2 flex h-screen w-full items-center justify-center">
              Loading...
            </div>
          }
        >
          <div className="">{children}</div>
        </Suspense>
      </div>
    </>
  );
}
