"use client";
import { useState } from "react";
import { Contract, uint256 } from "starknet";
import StrategyVaultABI from "../lib/StrategyVaultABI.json";
import type { AccountInterface } from "starknet";
import { useAccount } from "@starknet-react/core";
import { useUpdateStrategyFromOracle } from "../hooks/useUpdateStrategyFromOracle";

// Addresses from .env
const VAULT_ADDRESS = process.env.NEXT_PUBLIC_STRATEGY_VAULT!;
const VESU_STRATEGY_ADDRESS = process.env.NEXT_PUBLIC_VESU_STRATEGY!;

export default function PragmaAdminPanel() {
    const { account } = useAccount();

    // --- Oracle Data Push State ---
    const [price, setPrice] = useState("");
    const [vol, setVol] = useState("");
    const [status, setStatus] = useState("");

    // --- APY Update From Oracle State ---
    const [volatility, setVolatility] = useState("42"); // default demo value
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");

    // Hook for Vesu strategy update
    const updateStrategy = useUpdateStrategyFromOracle(VESU_STRATEGY_ADDRESS!);

    // Push oracle data to Vault contract
    const handleUpdateOracle = async () => {
        if (!account) return;
        setStatus("Updating...");
        const contract = new Contract(StrategyVaultABI, VAULT_ADDRESS, account);
        try {
            await contract.invoke("update_oracle_data", [
                uint256.bnToUint256(BigInt(price)),
                uint256.bnToUint256(BigInt(vol)),
            ]);
            setStatus("Oracle data pushed!");
        } catch (e) {
            setStatus("Failed: " + String(e));
        }
    };

    // Trigger Vesu strategy to update from oracle (APY logic)
    const handleTriggerApyUpdate = async () => {
        if (!account) return;
        setLoading(true);
        setMsg("");
        try {
            await updateStrategy(account, Number(volatility));
            setMsg("APY updated onchain based on volatility!");
        } catch (err) {
            setMsg("Error: " + (err as any).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-8 bg-white/5 p-6 rounded-2xl border border-white/10 shadow mb-4 max-w-3xl mx-auto">
            {/* Oracle Data Push */}
            <div className="flex-1">
                <h3 className="font-bold mb-2">Admin: Push Oracle Price/Volatility</h3>
                <input
                    className="mr-2 bg-black/20 px-2 py-1 rounded"
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                />
                <input
                    className="mr-2 bg-black/20 px-2 py-1 rounded"
                    type="number"
                    placeholder="Volatility"
                    value={vol}
                    onChange={e => setVol(e.target.value)}
                />
                <button
                    onClick={handleUpdateOracle}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                    disabled={!account}
                >
                    Push Oracle
                </button>
                <div className="mt-2 text-xs">{status}</div>
            </div>

            {/* APY Update from Oracle */}
            <div className="flex-1">
                <h3 className="text-lg font-semibold mb-3">Trigger APY Update From Oracle</h3>
                <div className="flex gap-3 items-center">
                    <input
                        className="bg-black/30 px-2 py-1 rounded"
                        type="number"
                        value={volatility}
                        onChange={e => setVolatility(e.target.value)}
                        placeholder="Volatility"
                        min={0}
                    />
                    <button
                        className={`px-4 py-1 rounded bg-starknet-accent text-white font-semibold text-xs ${loading ? "opacity-50" : ""}`}
                        disabled={loading || !account}
                        onClick={handleTriggerApyUpdate}
                    >
                        {loading ? "Updating..." : "Trigger APY Update"}
                    </button>
                </div>
                {msg && <div className="mt-2 text-xs text-green-300">{msg}</div>}
                <p className="text-xs text-gray-400 mt-2">
                    Simulate an on-chain APY update (e.g., via Pragma or bot). Triggers <code>update_strategy_params_from_oracle</code> on Vesu.
                </p>
            </div>
        </div>
    );
}
