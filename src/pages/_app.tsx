// src/pages/_app.tsx
import "../styles/globals.css";
import type { AppProps } from "next/app";
import {
  StarknetConfig,
  publicProvider,
  argent,
  braavos,
} from "@starknet-react/core";
import { sepolia } from "@starknet-react/chains";
import { AnimatePresence } from "framer-motion";

console.log("🌐 Using Vault:", process.env.NEXT_PUBLIC_VAULT_ADDRESS);
console.log("🌐 Using MockBTC:", process.env.NEXT_PUBLIC_MOCKBTC_ADDRESS);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <StarknetConfig
      autoConnect
      chains={[sepolia]}
      provider={publicProvider()}
      connectors={[braavos(), argent()]}
    >
      <AnimatePresence mode="wait">
        <Component {...pageProps} />
      </AnimatePresence>
    </StarknetConfig>
  );
}
