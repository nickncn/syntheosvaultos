// src/components/Toast.tsx
"use client";
import { motion, AnimatePresence } from "framer-motion";

export default function Toast({ message, show }: { message: string; show: boolean }) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="fixed top-6 left-6 z-50 px-5 py-3 rounded-xl bg-black/80 text-white text-sm shadow-lg"
                >
                    {message}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
