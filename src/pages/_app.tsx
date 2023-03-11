import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ObjectProvider } from "../contexts/ObjectContext";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <QueryClientProvider client={queryClient}>
        <ObjectProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ObjectProvider>
      </QueryClientProvider>
    </DndProvider>
  );
}

export default MyApp;
