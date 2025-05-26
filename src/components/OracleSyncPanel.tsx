// src/components/OracleSyncPanel.tsx
"use client";
import { useState } from "react";
import { usePragmaBTCPrice } from "../hooks/usePragmaBTCPrice";
import { useAccount } from "@starknet-react/core";
import { updateVaultOraclePrice } from "../lib/vault"; // to be added

export default function OracleSyncPanel() {
    const { account } = useAccount();
    const { price, source } = usePragmaBTCPrice();
    const [syncing, setSyncing] = useState(false);
    const [msg, setMsg] = useState<string | null>(null);

    const handleSync = async () => {
        if (!account || !price) return;
        setSyncing(true);
        try {
            await updateVaultOraclePrice(account, price);
            setMsg("✅ Synced latest oracle price on-chain!");
        } catch (err) {
            setMsg("❌ Sync failed");
        }
        setSyncing(false);
    };

    return (
        <div className="my-4 p-4 rounded bg-white/10 border border-white/20">
            <div className="mb-2 text-xs">
                Last Oracle Price:{" "}
                <span className="font-mono">{price ? `$${price}` : "Loading..."}</span> [{source}]
            </div>
            <button
                onClick={handleSync}
                disabled={syncing || !account || !price}
                className="px-4 py-1 rounded bg-starknet-accent text-white font-mono text-xs"
            >
                {syncing ? "Syncing..." : "Sync Oracle Price (on-chain)"}
            </button>
            {msg && <div className="mt-2 text-green-400 text-xs">{msg}</div>}
        </div>
    );
}
