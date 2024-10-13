"use client";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navbar } from "@/components/base-layout/navbar";
import { wagmiConfig } from "@/configs/wagmi";
import { ThemeProvider } from "@/utils/theme-provider";
import { Roboto } from "next/font/google";
import * as axiosConf from "@/configs/axiosConf";
import "@/styles/globals.scss";

const roboto = Roboto({ subsets: ["latin"], weight: ["400"] });

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
              <Navbar />
              {children}
            </ThemeProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
