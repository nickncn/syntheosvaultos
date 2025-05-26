// src/components/MockTxNotification.tsx
"use client";
import { motion, AnimatePresence } from "framer-motion";

export function MockTxNotification({ hash, show, amount }: { hash: string; show: boolean; amount: number }) {
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="fixed top-4 left-4 z-50 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-4 rounded-xl shadow-lg text-sm text-white font-mono"
                >
                    <div className="mb-1">✅ Mock TX Submitted:</div>
                    <div className="text-green-300 break-all">{hash}</div>
                    <div className="text-gray-400 mt-1 text-xs">{timestamp} · {amount} sats</div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
