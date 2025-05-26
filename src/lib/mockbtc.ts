// src/lib/mockbtc.ts
import { AccountInterface, Contract, uint256 } from "starknet";
import MockBTCABI from "./MockBTCABI.json";

const MOCKBTC_ADDRESS = process.env.NEXT_PUBLIC_MOCKBTC_ADDRESS!;

function getContract(account: AccountInterface) {
    return new Contract(MockBTCABI as any, MOCKBTC_ADDRESS, account);
}

export async function mint(account: AccountInterface, amount: number) {
    const contract = getContract(account);
    const user = account.address;
    const uintAmount = uint256.bnToUint256(BigInt(amount));
    console.log("🔹 Minting MockBTC:", { user, amount: uintAmount });
    return await contract.invoke("mint", [user, uintAmount]);
}

export async function approve(account: AccountInterface, amount: number) {
    const contract = getContract(account);
    const vault = process.env.NEXT_PUBLIC_VAULT_ADDRESS!;
    const uintAmount = uint256.bnToUint256(BigInt(amount));
    return await contract.invoke("approve", [vault, uintAmount]);
}
