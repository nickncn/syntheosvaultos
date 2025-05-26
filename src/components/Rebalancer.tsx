// src/components/Rebalancer.tsx
"use client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePragmaBTCPrice } from "../hooks/usePragmaBTCPrice";
import { toast } from "react-hot-toast"; // Add react-hot-toast for notifications


const PROTOCOLS = [
    { name: "Ekubo", color: "bg-blue-500", icon: "/ekubo.png", contract: "0xEkuboAddr..." },
    { name: "Vesu", color: "bg-green-500", icon: "/vesu.png", contract: "0xVesuAddr..." },
];

const apyIntervalMs = 60 * 60 * 1000; // 1 hour
const apyHistoryMax = 5;

export default function Rebalancer() {
    const { price } = usePragmaBTCPrice();
    const [route, setRoute] = useState<"Ekubo" | "Vesu">("Ekubo");
    const [feedLog, setFeedLog] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [contract, setContract] = useState(PROTOCOLS[0].contract);
    const [apy, setApy] = useState(6.28);
    const [apyHistory, setApyHistory] = useState<{ time: string; value: number }[]>([]);
    const lastApySaved = useRef(0);
    const lastRoute = useRef(route);

    // Simulate CDR from price & mock balance
    const [cdr, setCdr] = useState<number>(160);

    // Notification on route switch
    useEffect(() => {
        if (lastRoute.current !== route) {
            toast.success(`Route switched to ${route}`);
            lastRoute.current = route;
        }
    }, [route]);

    useEffect(() => {
        // Initial APY history mock
        if (apyHistory.length === 0) {
            const now = Date.now();
            const mock = Array.from({ length: apyHistoryMax }).map((_, i) => {
                const t = new Date(now - (apyHistoryMax - 1 - i) * apyIntervalMs);
                return {
                    time: t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    value: 6 + Math.random() * 0.3,
                };
            });
            setApyHistory(mock);
        }
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        let prevPrice = price || 0;
        let recentRoutes: string[] = [];

        function runLogic(p: number | null) {
            let usePrice = p || prevPrice;
            const delta = Math.abs(usePrice - prevPrice);
            prevPrice = usePrice;

            // Calculate CDR dynamically (simplified)
            const vaultBalance = 1000; // Ideally from state/localstorage or backend
            const debt = 100;
            const collateralValue = vaultBalance * usePrice;
            const newCdr = collateralValue / debt;
            setCdr(newCdr);

            // Volatility detection based on price and CDR
            const volatility = delta > 50 || newCdr < 150; // e.g. CDR threshold 150%
            const newRoute = volatility ? "Vesu" : "Ekubo";

            recentRoutes.push(newRoute);
            if (recentRoutes.length > 3) recentRoutes.shift();

            const sustainedSwitch = recentRoutes.every((v) => v === newRoute);

            if (sustainedSwitch && newRoute !== route) {
                setRoute(newRoute);
                setContract(PROTOCOLS.find((x) => x.name === newRoute)?.contract || "0x...");
            }

            // APY mock based on route
            const apyVal = newRoute === "Ekubo" ? 6 + Math.random() * 0.3 : 4 + Math.random() * 0.3;
            setApy(parseFloat(apyVal.toFixed(2)));

            setFeedLog((log) => [
                `Price: $${usePrice.toLocaleString(undefined, { maximumFractionDigits: 2 })} | Δ $${delta.toFixed(2)} | CDR: ${newCdr.toFixed(2)}% → ${volatility ? "HIGH" : "low"} vol → ${newRoute}`,
                ...log.slice(0, 4),
            ]);

            const now = Date.now();
            if (now - lastApySaved.current >= apyIntervalMs) {
                lastApySaved.current = now;
                const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                setApyHistory((h) => [...h.slice(-(apyHistoryMax - 1)), { time, value: apyVal }]);
            }
            setLoading(false);
        }
        runLogic(price);
        interval = setInterval(() => runLogic(price), 60 * 1000);
        return () => clearInterval(interval);
    }, [price, route]);

    return (
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 min-h-[420px] shadow-[0_8px_30px_rgba(108,93,211,0.15)] hover:shadow-[0_10px_40px_rgba(108,93,211,0.3)] transition-shadow duration-300 w-full text-white flex flex-col gap-4">

            <h3 className="text-lg font-semibold mb-2">Vault Rebalancer</h3>
            <div className="flex gap-3 items-center mb-2">
                {PROTOCOLS.map((p) => (
                    <div
                        key={p.name}
                        className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${route === p.name ? p.color + " text-white shadow-lg scale-105" : "bg-white/10 text-gray-400"
                            }`}
                    >
                        <img src={p.icon} alt={p.name} className="h-6 w-6" />
                        {p.name}
                        {route === p.name && (
                            <motion.span
                                className="ml-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                Active
                            </motion.span>
                        )}
                    </div>
                ))}
            </div>
            <p className="text-sm text-gray-400 mb-2">
                Estimated APY: <span className="text-green-400 font-medium">{apy.toFixed(2)}%</span> · Yield Source: <span className="font-mono">{route}</span>
            </p>
            {contract && (
                <a
                    href={`https://starkscan.co/contract/${contract}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs text-blue-400 underline hover:text-blue-200 mb-2"
                >
                    <svg className="w-4 h-4 mr-1 inline-block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M14 3h7v7" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M5 13l9-9M5 19a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    View Strategy Contract
                </a>
            )}
            <div className="bg-black/20 border border-white/10 rounded p-3 text-sm font-mono h-32 overflow-y-auto text-gray-300 mb-4">
                {loading ? (
                    <div>Loading feed...</div>
                ) : (
                    feedLog.map((log, idx) => (
                        <div key={idx} className="truncate">
                            {log}
                        </div>
                    ))
                )}
            </div>

        </div>
    );
}
