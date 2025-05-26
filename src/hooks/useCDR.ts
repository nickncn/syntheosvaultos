// src/hooks/useCDR.ts
import { useEffect, useState, useRef } from "react";
import { usePragmaBTCPrice } from "./usePragmaBTCPrice";

/**
 * Dynamic CDR calculation:
 * - Base CDR: 150%
 * - If BTC/USD volatility in last hour > 2%, add 25%
 * - If volatility > 5%, add 50%
 */

function getVolatility(prices: number[]): number {
    if (prices.length < 2) return 0;
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return ((max - min) / min) * 100;
}

export function useDynamicCDR() {
    const { price } = usePragmaBTCPrice();
    const [cdr, setCdr] = useState(150); // % base
    const [cdrReason, setCdrReason] = useState("Stable");
    const pricesRef = useRef<number[]>([]);

    useEffect(() => {
        if (price) {
            // Keep up to last 12 prices (for 1 hour, assuming 5min updates)
            pricesRef.current = [...pricesRef.current.slice(-11), price];

            const volatility = getVolatility(pricesRef.current);
            let nextCDR = 150;
            let reason = "Stable";

            if (volatility > 5) {
                nextCDR = 200;
                reason = "High volatility (>5%)";
            } else if (volatility > 2) {
                nextCDR = 175;
                reason = "Moderate volatility (>2%)";
            }
            setCdr(nextCDR);
            setCdrReason(reason);
        }
    }, [price]);

    return { cdr, cdrReason, priceHistory: pricesRef.current };
}
