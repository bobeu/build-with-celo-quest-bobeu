import React from "react";
import { RainbowKitProvider, connectorsForWallets,} from "@rainbow-me/rainbowkit";
import { injectedWallet } from "@rainbow-me/rainbowkit/wallets";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { http, WagmiProvider, createConfig } from "wagmi";
import Layout from "../components/Layout";
import "../styles/globals.css";
import { celo, celoAlfajores } from "wagmi/chains";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const connectors = connectorsForWallets(
    [
        {
            groupName: "Recommended",
            wallets: [injectedWallet],
        },
    ],
    {
        appName: "Celo Composer",
        projectId: "044601f65212332475a09bc14ceb3c34",
    }
);

const config = createConfig({
    connectors,
    chains: [celo, celoAlfajores],
    transports: {
        [celo.id]: http(),
        [celoAlfajores.id]: http(),
    },
});

const queryClient = new QueryClient();

function App({ Component, pageProps }: AppProps) {
    const [isMounted, setIsMounted] = React.useState(false);
    
    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        isMounted? <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider> : null
    );
}

export default App;
