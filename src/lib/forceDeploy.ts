// lib/forceDeploy.ts
import { AccountInterface, Contract } from "starknet";
import VaultABI from "./VaultABI.json"; // Already exists

const VAULT_ADDRESS = "0x0123456789abcdef"; // any dummy address

export async function forceDeploy(account: AccountInterface) {
    try {
        const contract = new Contract(VaultABI, VAULT_ADDRESS, account);
        // Call any method that exists in the ABI, even if it's a dummy
        await contract.invoke("deposit", [1]); // just triggers deployment
    } catch (e: unknown) {
        const err = e as Error;
        console.warn("This is expected, just deploying wallet:", err.message);
    }
}      
