"use client";
import { useAccount } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { usePragmaBTCPrice } from "../hooks/usePragmaBTCPrice";

// Tooltip component for info icons
function Tooltip({ content }: { content: string }) {
    return (
        <span className="group relative cursor-help ml-1">
            <svg className="w-4 h-4 text-gray-400 inline-block" fill="currentColor" viewBox="0 0 20 20">
                <title>{content}</title>
                <path d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zM9 9V7h2v2H9zm0 2h2v4H9v-4z" />
            </svg>
        </span>
    );
}

export default function UserCard({ xp: initialXP }: { xp: number }) {
    const { address } = useAccount();
    const connected = !!address;
    const short = connected ? `${address.slice(0, 6)}...${address.slice(-4)}` : null;
    const [xp, setXp] = useState(initialXP);
    const [vaultBalance, setVaultBalance] = useState(0);
    const { price } = usePragmaBTCPrice();

    // Dynamic CDR state
    const [cdr, setCdr] = useState<number | null>(null);
    const [cdrVolatility, setCdrVolatility] = useState(false);

    useEffect(() => {
        if (price === null) return;
        const balance = parseInt(localStorage.getItem("mock_balance") || "0", 10);
        if (balance === 0) {
            setCdr(null);
            return;
        }
        // CDR calculation: 150% when perfectly collateralized
        const debt = (balance * price) / 1.5;
        const collateralValue = balance * price;
        const newCdr = (collateralValue / debt) * 100;
        setCdrVolatility(cdr !== null && Math.abs(newCdr - cdr) / cdr > 0.05);
        setCdr(newCdr);
    }, [price, vaultBalance]);

    useEffect(() => {
        const updateXp = () => {
            const storedXp = parseInt(localStorage.getItem("xp") || "0", 10);
            setXp(storedXp);
        };

        updateXp();
        window.addEventListener("xpUpdated", updateXp);
        return () => window.removeEventListener("xpUpdated", updateXp);
    }, []);

    useEffect(() => {
        const mockBal = parseInt(localStorage.getItem("mock_balance") || "0", 10);
        setVaultBalance(mockBal);
        const onDeposit = () => {
            const updatedBal = parseInt(localStorage.getItem("mock_balance") || "0", 10);
            setVaultBalance(updatedBal);
        };
        window.addEventListener("mockDeposit", onDeposit);
        return () => window.removeEventListener("mockDeposit", onDeposit);
    }, []);

    const tier = xp >= 1000 ? "Gold" : xp >= 500 ? "Silver" : "Bronze";

    return (
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-7 shadow-lg text-white flex flex-col gap-3 min-h-[220px]">
            {/* Top Row: Connected, Tier/XP */}
            <div className="flex justify-between items-center mb-1">
                <div>
                    <div className="text-sm text-starknet-soft">
                        {connected ? "Connected Wallet" : "Wallet Not Connected"}
                    </div>
                    {connected && <div className="font-mono text-white text-sm">{short}</div>}
                </div>
                <div className="text-xs font-semibold text-gray-200">
                    Tier: <span className="font-semibold">{tier}</span> &middot; XP: <span className="font-semibold">{xp}</span>
                </div>
            </div>
            {/* Balance and CDR */}
            <div className="flex justify-between items-end">
                <div>
                    <div className="text-xs text-gray-400 mb-1">Vault Balance:</div>
                    <div className="text-3xl font-extrabold text-green-200 tracking-tight">
                        {vaultBalance}
                        <span className="text-lg text-gray-300 font-bold ml-1">MBTC</span>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                        CDR:
                        {cdr !== null ? (
                            <span className={`text-2xl font-extrabold ml-1 ${cdrVolatility ? "text-yellow-300 animate-pulse" : "text-green-300"}`}>
                                {cdr.toFixed(2)}%
                            </span>
                        ) : (
                            <span className="text-red-400 text-lg ml-2">N/A</span>
                        )}
                        <Tooltip content="Collateral Debt Ratio (CDR) — ratio of collateral value to debt. Changes dynamically with price and balance." />
                    </div>
                    <div className="text-xs text-gray-500 italic mt-1 text-right">
                        Min. Collateralization: 150%
                    </div>
                </div>
            </div>
            {/* Warning */}
            {cdr !== null && cdr < 150 && (
                <div className="text-red-400 text-xs animate-pulse mt-2">⚠️ CDR below safe threshold!</div>
            )}

        </div>
    );
}
