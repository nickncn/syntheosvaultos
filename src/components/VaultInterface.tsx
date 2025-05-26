// src/components/VaultInterface.tsx
"use client";
import { useAccount } from "@starknet-react/core";
import { useState, useEffect } from "react";
import { deposit } from "../lib/vault";
import { mint, approve } from "../lib/mockbtc";
import { fireConfetti } from "../lib/effects";
import Toast from "./Toast";
import { forceDeploy } from "../lib/forceDeploy";
import { usePragmaBTCPrice } from "../hooks/usePragmaBTCPrice";
import { MockTxNotification } from "./MockTxNotification";


export default function VaultInterface() {
    const { account } = useAccount();
    const [amount, setAmount] = useState("");
    const [txHash, setTxHash] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [showNotif, setShowNotif] = useState(false);
    const [simulated, setSimulated] = useState(false);
    const [history, setHistory] = useState<string[]>([]);
    const [lastAmount, setLastAmount] = useState(0);
    const { price, source } = usePragmaBTCPrice();

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("mock_history") || "[]");
        setHistory(saved);
    }, []);

    const triggerMockDeposit = (numAmount: number) => {
        const prev = parseInt(localStorage.getItem("mock_balance") || "0", 10);
        localStorage.setItem("mock_balance", (prev + numAmount).toString());
        const fakeTx = `0xmocked_tx_hash_${Date.now()}`;
        setTxHash(fakeTx);
        setSimulated(true);
        setLastAmount(numAmount);

        const updated = [...history, fakeTx].slice(-5);
        setHistory(updated);
        localStorage.setItem("mock_history", JSON.stringify(updated));

        setShowNotif(true);
        setTimeout(() => setShowNotif(false), 3000);

        // XP reward
        const prevXp = parseInt(localStorage.getItem("xp") || "0", 10);
        const gained = Math.floor(numAmount / 10);
        localStorage.setItem("xp", (prevXp + gained).toString());
        window.dispatchEvent(new Event("xpUpdated"));

        // Fire confetti on mock too!
        fireConfetti();
    };

    const handleDeposit = async () => {
        const numAmount = parseInt(amount, 10);
        if (!account || isNaN(numAmount) || numAmount <= 0) return;

        setLoading(true);
        try {
            // 1. Try real on-chain flow first (forceDeploy, mint, approve as needed)
            await forceDeploy(account);
            await mint(account, numAmount);    // If needed for testnet/mocks
            await approve(account, numAmount); // If needed for testnet/mocks

            try {
                const res: any = await deposit(account, numAmount);
                if (!res || ("code" in res && res.code === "TRANSACTION_REJECTED") || ("status" in res && res.status === "REJECTED")) {
                    throw new Error("User rejected transaction");
                }
                setTxHash(res.transaction_hash || "submitted");
                setSimulated(false);

                // XP and confetti (real chain)
                const prevXp = parseInt(localStorage.getItem("xp") || "0", 10);
                const gained = Math.floor(numAmount / 10);
                localStorage.setItem("xp", (prevXp + gained).toString());
                window.dispatchEvent(new Event("xpUpdated"));
                fireConfetti();
            } catch (onchainErr) {
                // 2. On any failure, fallback to mock flow
                console.warn("⚠️ Onchain deposit failed or declined, using fallback.", onchainErr);
                triggerMockDeposit(numAmount);
            }

            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } catch (err) {
            // 3. If *everything* fails, fallback again
            console.error("❌ Deposit flow failed", err);
            triggerMockDeposit(numAmount);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-[0_8px_30px_rgba(108,93,211,0.15)] hover:shadow-[0_10px_40px_rgba(108,93,211,0.3)] transition-shadow duration-300 w-full">
                <h2 className="text-xl font-semibold mb-4">Vault Deposit</h2>

                <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter BTC amount (sats)"
                    className="w-full mb-4 p-3 rounded-lg bg-black/20 text-white border border-white/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-starknet-accent"
                />

                <button
                    onClick={handleDeposit}
                    disabled={!account || loading}
                    className={`w-full py-2 rounded-lg font-medium flex justify-center items-center gap-2 transition ${loading ? "bg-gray-600 text-white cursor-wait" : "bg-starknet-accent text-white hover:bg-indigo-600"}`}
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                            </svg>
                            Processing...
                        </>
                    ) : (
                        "Deposit BTC"
                    )}
                </button>

                {txHash && (
                    <p className="text-sm text-green-400 mt-3">
                        Submitted: {txHash}{simulated && " (Simulated)"}
                    </p>
                )}

                <div className="mt-4 text-xs text-gray-300 space-y-1">
                    {history.map((tx, i) => (
                        <div key={i} className="truncate">
                            TX {i + 1}: <a
                                href="#"
                                className="text-starknet-accent hover:underline cursor-pointer"
                                title="Mock transaction - not real"
                            >
                                {tx}
                            </a>
                        </div>
                    ))}
                </div>



                {showToast && <Toast message="Deposit complete! XP updated." show={showToast} />}
            </div>

            <MockTxNotification hash={txHash || ""} show={showNotif} amount={lastAmount} />
        </>
    );
}
