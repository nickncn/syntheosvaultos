import { useState, useEffect } from "react";
import { Contract } from "starknet";
import StrategyVaultABI from "../lib/StrategyVaultABI.json";

const STRATEGY_VAULT = process.env.NEXT_PUBLIC_STRATEGY_VAULT!;

export function useVaultOracleData() {
    const [price, setPrice] = useState<number | null>(null);
    const [volatility, setVolatility] = useState<number | null>(null);

    useEffect(() => {
        async function fetchData() {
            const contract = new Contract(StrategyVaultABI, STRATEGY_VAULT);
            const [p, v]: any = await contract.call("get_oracle_data");
            setPrice(Number(p?.low || p[0]) || null);
            setVolatility(Number(v?.low || v[0]) || null);
        }
        fetchData();
    }, []);

    return { price, volatility };
}
