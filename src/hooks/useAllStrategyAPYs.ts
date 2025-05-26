// src/hooks/useAllStrategyAPYs.ts
import { useEffect, useState } from "react";
import { Contract } from "starknet";
import StrategyVaultABI from "../lib/StrategyVaultABI.json";
import EkuboABI from "../lib/EkuboStrategyABI.json";
import VesuABI from "../lib/VesuStrategyABI.json";

const VAULT_ADDRESS = process.env.NEXT_PUBLIC_STRATEGY_VAULT!;
const ABI_LOOKUP: { [key: string]: any } = {
    Ekubo: EkuboABI,
    Vesu: VesuABI,
};

export function useAllStrategyAPYs() {
    const [strategies, setStrategies] = useState<{ id: number; name: string; address: string; apy: number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAll() {
            setLoading(true);
            try {
                const vault = new Contract(StrategyVaultABI, VAULT_ADDRESS);

                // Call get_all_strategies()
                const res: any = await vault.call("get_all_strategies");
                const ids: number[] = Array.from(res[1]);
                const names: string[] = Array.from(res[2]);
                const addrs: string[] = Array.from(res[3]);

                // Parallel fetch APYs
                const stratData = await Promise.all(
                    ids.map(async (id, i) => {
                        const name = names[i];
                        const addr = addrs[i];
                        const abi = ABI_LOOKUP[name] || EkuboABI; // fallback
                        const strat = new Contract(abi, addr);
                        let apy = 0;
                        try {
                            const apyRes: any = await strat.call("get_simulated_apy");
                            apy = Number(apyRes[0] || apyRes.apy) / 100;
                        } catch { }
                        return { id, name, address: addr, apy };
                    })
                );

                setStrategies(stratData);
            } catch (err) {
                setStrategies([]);
            } finally {
                setLoading(false);
            }
        }
        fetchAll();
        const t = setInterval(fetchAll, 10000);
        return () => clearInterval(t);
    }, []);

    return { strategies, loading };
}
