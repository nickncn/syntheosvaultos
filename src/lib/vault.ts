import { AccountInterface, Contract, uint256 } from "starknet";
import StrategyVaultABI from "./StrategyVaultABI.json";

const VAULT_ADDRESS = process.env.NEXT_PUBLIC_VAULT_ADDRESS!;

function getVaultContract(account: AccountInterface) {
    return new Contract(StrategyVaultABI as any, VAULT_ADDRESS, account);
}

export async function deposit(account: AccountInterface, amount: number) {
    const contract = getVaultContract(account);
    const uintAmount = uint256.bnToUint256(BigInt(amount));
    await contract.invoke("deposit", [uintAmount.low, uintAmount.high]);
}

export async function withdraw(account: AccountInterface, amount: number) {
    const contract = getVaultContract(account);
    const uintAmount = uint256.bnToUint256(BigInt(amount));
    await contract.invoke("withdraw", [uintAmount.low, uintAmount.high]);
}

export async function getBalance(account: AccountInterface, user?: string) {
    const contract = getVaultContract(account);
    const userAddr = user ?? account.address;
    const res: any = await contract.call("get_user_balance", [userAddr]);
    const balance = res.balance ?? res[0];
    return uint256.uint256ToBN(balance).toString();
}

export async function getTotalDeposits(account: AccountInterface) {
    const contract = getVaultContract(account);
    const res: any = await contract.call("get_total_deposits", []);
    return uint256.uint256ToBN(res[0]).toString();
}

export async function switchStrategy(account: AccountInterface, strategyId: number) {
    const contract = getVaultContract(account);
    await contract.invoke("switch_strategy", [strategyId]);
}

export async function updateVaultOraclePrice(account: AccountInterface, price: number) {
    const contract = getVaultContract(account);
    const uintPrice = uint256.bnToUint256(BigInt(Math.floor(price)));
    await contract.invoke("update_price", [uintPrice.low, uintPrice.high]);
}

export async function submitZKProof(account: AccountInterface, proof: string) {
    const contract = getVaultContract(account);
    const proofArray = Array.from(proof).map((c) => c.charCodeAt(0));
    const res: any = await contract.call("verify_zk_proof", [proofArray]);
    // Normalize for different return types
    if (typeof res === "boolean") return res;
    if (typeof res === "number") return res === 1;
    if (typeof res === "string") return res === "1" || res === "true";
    // If Cairo returns a struct/object
    if (Array.isArray(res)) return res[0] === 1 || res[0] === true;
    return false;
}
