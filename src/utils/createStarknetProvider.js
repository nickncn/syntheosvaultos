// src/utils/createStarknetProvider.js
import { RpcProvider } from "starknet";

export function createStarknetProvider() {
    return () => {
        return new RpcProvider({
            nodeUrl: "https://rpc.starknet-testnet.chainstacklabs.com"
        });
    };
}
