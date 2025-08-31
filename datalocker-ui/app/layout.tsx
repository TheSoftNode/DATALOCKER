"use client";

import "./globals.css";
import { WagmiProvider } from "wagmi";
import { filecoin, filecoinCalibration } from "wagmi/chains";
import { http, createConfig } from "@wagmi/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ConfettiProvider } from "@/providers/ConfettiProvider";
import { GeolocationProvider } from "@/providers/GeolocationProvider";

const queryClient = new QueryClient();

const config = createConfig({
  chains: [filecoinCalibration, filecoin],
  connectors: [],
  transports: {
    [filecoin.id]: http(),
    [filecoinCalibration.id]: http(),
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>DataLocker - Secure Filecoin Storage</title>
        <meta
          name="description"
          content="DataLocker - Secure decentralized storage solution with automated escrow management and perpetual funding on Filecoin."
        />
        <meta
          name="keywords"
          content="Filecoin, DataLocker, synapse-sdk, storage, filecoin, usdfc, decentralized"
        />
        <meta name="author" content="DataLocker Team" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/filecoin.svg" />
      </head>
      <body suppressHydrationWarning>
        <GeolocationProvider
          onBlocked={(info: any) => {
            console.log("blocked", info);
          }}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ConfettiProvider>
              <QueryClientProvider client={queryClient}>
                <WagmiProvider config={config}>
                  <RainbowKitProvider
                    modalSize="compact"
                    initialChain={filecoinCalibration.id}
                  >
                    {children}
                  </RainbowKitProvider>
                </WagmiProvider>
              </QueryClientProvider>
            </ConfettiProvider>
          </ThemeProvider>
        </GeolocationProvider>
      </body>
    </html>
  );
}
