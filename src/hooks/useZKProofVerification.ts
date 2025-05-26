// src/hooks/useZKProofVerification.ts
import { Contract } from "starknet";
import StrategyVaultABI from "../lib/StrategyVaultABI.json";

const VAULT_ADDRESS = process.env.NEXT_PUBLIC_STRATEGY_VAULT!;

export function useZKProofVerification() {
    return async (proof: string): Promise<boolean> => {
        try {
            const contract = new Contract(StrategyVaultABI, VAULT_ADDRESS);
            // Assumes contract expects bytes array (convert string to bytes)
            const proofArray = Array.from(new TextEncoder().encode(proof));
            // Use call for view method, not invoke
            const result = await contract.call("verify_zk_proof", [proofArray]);
            // Depending on Cairo version/return type, might need result[0] or just result
            return !!result; // Adapt if needed (sometimes { 0: true } or { result: true })
        } catch (e) {
            console.error("ZK proof verification failed", e);
            return false;
        }
    };
}
