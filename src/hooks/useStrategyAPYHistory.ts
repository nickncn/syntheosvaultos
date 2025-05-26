// src/hooks/useStrategyAPYHistory.ts
import { useEffect, useState } from "react";
import { useStrategyAPY } from "./useStrategyAPY";

export interface APYHistoryPoint {
    time: string;
    apy: number;
    strategy: string;
}

export function useStrategyAPYHistory(strategy: "Ekubo" | "Vesu") {
    const apy = useStrategyAPY(strategy);
    const [history, setHistory] = useState<APYHistoryPoint[]>([]);

    useEffect(() => {
        if (apy === null) return;
        const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        setHistory(prev => [
            ...prev.slice(-4),
            { time: now, apy, strategy }
        ]);
    }, [apy, strategy]);

    return history;
}
