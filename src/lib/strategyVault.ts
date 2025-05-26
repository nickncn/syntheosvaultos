// src/lib/strategyVault.ts
import { Contract, RpcProvider, uint256 } from "starknet";
import StrategyVaultABI from "./StrategyVaultABI.json"


// ---- 1. Static strategy list (hardcoded, for demo) ----
// You MUST fill these with your actual deployed contract addresses.
export const STRATEGY_LIST = [
    {
        id: 1,
        name: "Ekubo",
        addr: process.env.NEXT_PUBLIC_EKUBO_STRATEGY!,
    },
    {
        id: 2,
        name: "Vesu",
        addr: process.env.NEXT_PUBLIC_VESU_STRATEGY!,
    },
    // Add more as needed.
];

// ---- 2. Fetch APY from on-chain call ----
const VAULT_ADDRESS = process.env.NEXT_PUBLIC_STRATEGY_VAULT!;

export async function getStrategyAPY(id: number): Promise<number | undefined> {
    const VAULT_ADDRESS = process.env.NEXT_PUBLIC_STRATEGY_VAULT!;
    if (!VAULT_ADDRESS) return undefined;
    const provider = new RpcProvider({ nodeUrl: process.env.NEXT_PUBLIC_RPC_URL! });
    const contract = new Contract(StrategyVaultABI, VAULT_ADDRESS, provider);
    try {
        const result: any = await contract.call("get_strategy_apy", [id]);
        let val = result.apy ?? result[0];
        if (val && typeof val === "object" && "low" in val && "high" in val) {
            return Number(uint256.uint256ToBN(val)) / 100;
        }
        if (typeof val === "bigint" || typeof val === "number") {
            return Number(val) / 100;
        }
        return undefined;
    } catch (e) {
        console.warn("getStrategyAPY failed", e);
        return undefined;
    }
}
