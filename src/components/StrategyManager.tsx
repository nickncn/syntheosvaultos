// src/components/StrategyManager.tsx
"use client";
import { useAccount } from "@starknet-react/core";
import { useAllStrategyAPYs } from "../hooks/useAllStrategyAPYs";
import { useState } from "react";
import { Contract } from "starknet";
import StrategyVaultABI from "../lib/StrategyVaultABI.json";

const VAULT_ADDRESS = process.env.NEXT_PUBLIC_STRATEGY_VAULT!;

export default function StrategyManager() {
    const { account } = useAccount();
    const { strategies, loading } = useAllStrategyAPYs();
    const [switching, setSwitching] = useState<number | null>(null);

    const handleSwitch = async (id: number) => {
        setSwitching(id);
        try {
            if (!account) throw new Error("Not connected");
            const vault = new Contract(StrategyVaultABI, VAULT_ADDRESS, account);
            await vault.invoke("switch_strategy", [id]);
            alert("Strategy switched!");
        } catch (err) {
            alert("Switch failed: " + (err as any).message);
        } finally {
            setSwitching(null);
        }
    };

    return (
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 mb-6">
            <h3 className="text-lg font-semibold mb-3">Strategy Manager</h3>
            {loading ? (
                <div>Loading strategies...</div>
            ) : (
                <table className="w-full text-xs text-white">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Address</th>
                            <th>APY</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {strategies.map((s) => (
                            <tr key={s.id} className="border-b border-white/10">
                                <td className="py-2">{s.name}</td>
                                <td className="py-2 font-mono truncate">{s.address}</td>
                                <td className="py-2">{s.apy ? `${s.apy.toFixed(2)}%` : "-"}</td>
                                <td className="py-2">
                                    <button
                                        disabled={switching === s.id}
                                        onClick={() => handleSwitch(s.id)}
                                        className={`px-2 py-1 rounded bg-starknet-accent text-white text-xs ${switching === s.id ? "opacity-50" : ""}`}
                                    >
                                        Switch
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
