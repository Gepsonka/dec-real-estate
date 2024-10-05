import { Layout } from "@/components/Layout";
import { ThemeContext } from "@/contexts";
import { ThemeContextType } from "@/contexts/ThemeContext/types";
import "@/styles/globals.scss";
import { startOrbitDB, connectOrbitDatabase, stopOrbitDB } from "@/utils/db";
import { MetaMaskProvider } from "@metamask/sdk-react";
import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect, useState } from "react";
import orbitdbAddress from "@/utils/db/orbitDBAdress.json";
import { useDbStore } from "@/stores";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/config/wagmi";
import { createDummyRealEstates } from "@/utils/db/RealEstate";

// TODO: change this, ugly as hell
axios.defaults.baseURL = "http://localhost:3000/api";
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.put["Content-Type"] = "application/json";
axios.defaults.headers.delete["Content-Type"] = "application/json";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState<ThemeContextType["theme"]>("light");
  const dbStore = useDbStore();

  const createDB = async () => {
    console.log("addess: ", orbitdbAddress.RealEstate.address);

    const { db, orbitdb } = await connectOrbitDatabase({
      //address: orbitdbAddress.RealEstate.address,
      dbName: "RealEstate",
      type: "documents",
      indexBy: "tokenId",
    });
    console.log("DB: ", db);

    dbStore.setDb(db);
    dbStore.setDbInstance(orbitdb);

    //await stopOrbitDB(orbitdb);

    // createDummyRealEstates(db);

    // const all = await db.all();
    // console.log("All: ", all);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme !== null) {
      setTheme(savedTheme as ThemeContextType["theme"]);
    }

    createDB();
  }, []);

  const changeTheme = (theme: ThemeContextType["theme"]) => {
    setTheme(theme);
    localStorage.setItem("theme", theme);
  };

  const host =
    typeof window !== "undefined" ? window.location.host : "defaultHost";

  return (
    <ThemeContext.Provider value={{ theme, setTheme: changeTheme }}>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <NextUIProvider>
            <Head>
              <link rel="preconnect" href="https://fonts.googleapis.com" />
              <link rel="preconnect" href="https://fonts.gstatic.com" />
              <link
                href="https://fonts.googleapis.com/css2?family=Sora:wght@100..800&display=swap"
                rel="stylesheet"
              />
            </Head>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </NextUIProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeContext.Provider>
  );
}
