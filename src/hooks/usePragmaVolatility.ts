import { useEffect, useRef, useState } from "react";
import { subscribeToPragmaPriceFeed, unsubscribeFromPragmaFeed } from "../lib/pragma";

export function usePragmaVolatility(intervalMs = 60000) {
    const [volatility, setVolatility] = useState<number | null>(null);
    const lastPrice = useRef<number | null>(null);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        const cb = ({ price }: { price: number }) => {
            if (lastPrice.current !== null) {
                const change = Math.abs(price - lastPrice.current);
                const vol = (change / lastPrice.current) * 100; // percent
                setVolatility(vol);
            }
            lastPrice.current = price;
        };
        subscribeToPragmaPriceFeed(cb);

        // Optionally update every interval for demo
        interval = setInterval(() => {
            if (lastPrice.current !== null) setVolatility((v) => v); // Just triggers re-render
        }, intervalMs);

        return () => {
            unsubscribeFromPragmaFeed(cb);
            if (interval) clearInterval(interval);
        };
    }, [intervalMs]);

    return volatility;
}
