// src/hooks/useStrategyAPY.ts
import { useEffect, useState } from "react";
import { Contract } from "starknet";
import EkuboABI from "../lib/EkuboStrategyABI.json";
import VesuABI from "../lib/VesuStrategyABI.json";

const EKUBO_ADDRESS = process.env.NEXT_PUBLIC_EKUBO_ADDRESS!;
const VESU_ADDRESS = process.env.NEXT_PUBLIC_VESU_ADDRESS!;

export function useStrategyAPY(strategy: "Ekubo" | "Vesu") {
    const [apy, setApy] = useState<number | null>(null);

    useEffect(() => {
        let address: string, abi: any, returnKey: string;
        if (strategy === "Ekubo") {
            address = EKUBO_ADDRESS;
            abi = EkuboABI;
            returnKey = "simulated_apy";
        } else {
            address = VESU_ADDRESS;
            abi = VesuABI;
            returnKey = "simulated_apy";
        }

        const contract = new Contract(abi, address);

        async function fetchAPY() {
            try {
                const result: any = await contract.call("get_simulated_apy", []);
                let apyRaw: any;
                // 1. Try to get by return variable name
                if (result && typeof result === "object") {
                    if (returnKey in result) {
                        apyRaw = result[returnKey];
                    } else if ("apy" in result) {
                        apyRaw = result.apy;
                    } else if (Array.isArray(result) && result.length > 0) {
                        apyRaw = result[0];
                    } else {
                        apyRaw = Object.values(result)[0];
                    }
                } else {
                    apyRaw = result;
                }

                // Parse to number
                const parsed = typeof apyRaw === "object" && "toString" in apyRaw
                    ? parseFloat(apyRaw.toString())
                    : Number(apyRaw);

                setApy(parsed / 100); // If 520 = 5.2%
            } catch (err) {
                setApy(null);
            }
        }

        fetchAPY();
        const interval = setInterval(fetchAPY, 30000);
        return () => clearInterval(interval);
    }, [strategy]);

    return apy;
}
