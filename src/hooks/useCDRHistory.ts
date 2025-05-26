// src/hooks/useCDRHistory.ts

import { useState, useEffect, useRef } from "react";
import { calculateCDR, calculateVolatility } from "../lib/cdr";
import { usePragmaBTCPrice } from "./usePragmaBTCPrice";

export function useCDRHistory({ vaultBTC = 1, vaultDebt = 50000 }) {
    // For demo: 1 BTC collateral, $50k loan (dynamic in prod)
    const { price } = usePragmaBTCPrice();
    const [cdrHistory, setCdrHistory] = useState<{ time: string, cdr: number, volatility: number }[]>([]);
    const priceBuffer = useRef<number[]>([]);

    useEffect(() => {
        if (!price) return;
        // Push price to buffer
        priceBuffer.current.push(price);
        if (priceBuffer.current.length > 10) priceBuffer.current.shift();

        const cdr = calculateCDR(vaultBTC, price, vaultDebt);
        const volatility = calculateVolatility(priceBuffer.current);

        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setCdrHistory(prev => [
            ...prev.slice(-4),
            { time: now, cdr, volatility }
        ]);
    }, [price, vaultBTC, vaultDebt]);

    return cdrHistory;
}
