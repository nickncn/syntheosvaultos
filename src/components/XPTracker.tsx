import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fireConfetti } from "../lib/effects";
import { XPProgressBar } from "./XPProgressBar";
import { useAccount } from "@starknet-react/core";

interface XPTrackerProps {
    xp: number;
    setXp: (val: number) => void;
}

export default function XPTracker({ xp, setXp }: XPTrackerProps) {
    const { account } = useAccount();
    const [tier, setTier] = useState("Bronze");

    const getTier = (val: number) =>
        val >= 1000 ? "Gold" : val >= 500 ? "Silver" : "Bronze";

    useEffect(() => {
        const storedXp = localStorage.getItem("xp");
        const myWallet = process.env.NEXT_PUBLIC_MY_WALLET?.toLowerCase();
        const initial = storedXp !== null
            ? parseInt(storedXp, 10)
            : account?.address?.toLowerCase() === myWallet
                ? 320
                : 0;
        localStorage.setItem("xp", initial.toString());
        setXp(initial);
        setTier(getTier(initial));
    }, [account]);

    useEffect(() => {
        const updateXpFromStorage = () => {
            const storedXp = parseInt(localStorage.getItem("xp") || "0", 10);
            setXp(storedXp);
            setTier(getTier(storedXp));
        };

        updateXpFromStorage();
        const interval = setInterval(updateXpFromStorage, 1000);
        return () => clearInterval(interval);
    }, []);

    const nextTierTarget = tier === "Bronze" ? 500 : tier === "Silver" ? 1000 : null;
    const toNext = nextTierTarget ? Math.max(nextTierTarget - xp, 0) : 0;

    return (
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 
        shadow-[0_8px_30px_rgba(108,93,211,0.15)] hover:shadow-[0_10px_40px_rgba(108,93,211,0.3)] 
        transition-shadow duration-300 text-white w-full">
            <h3 className="text-lg font-semibold mb-1">XP Progress</h3>
            <p className="text-sm text-gray-300">Your XP: <strong>{xp}</strong></p>

            <AnimatePresence mode="wait">
                <motion.div
                    key={tier}
                    className="text-base font-semibold mb-1"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                >
                    Tier: <span className="text-yellow-400">{tier}</span>
                </motion.div>
            </AnimatePresence>

            {nextTierTarget && (
                <p className="text-xs text-gray-400 mb-2">
                    {toNext} XP to {tier === "Bronze" ? "Silver" : "Gold"}
                </p>
            )}

            <XPProgressBar xp={xp} />
        </div>
    );
}
