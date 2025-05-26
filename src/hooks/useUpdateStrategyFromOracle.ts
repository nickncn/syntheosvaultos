import { Contract, AccountInterface } from "starknet";
import VesuStrategyABI from "../lib/VesuStrategyABI.json";

export function useUpdateStrategyFromOracle(strategyAddress: string) {
    // You could expand to support Ekubo, Vault, etc
    return async function triggerUpdate(account: AccountInterface, volatility: number) {
        const contract = new Contract(VesuStrategyABI as any, strategyAddress, account);
        // volatility can be any number for demo; adjust as needed for actual feed
        return await contract.invoke("update_strategy_params_from_oracle", [volatility]);
    };
}
