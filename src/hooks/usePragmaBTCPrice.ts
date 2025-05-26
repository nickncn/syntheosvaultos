// src/hooks/usePragmaBTCPrice.ts
import { useEffect, useState } from "react";
import { subscribeToPragmaPriceFeed, unsubscribeFromPragmaFeed } from "../lib/pragma";

export function usePragmaBTCPrice() {
    const [price, setPrice] = useState<number | null>(null);
    const [source, setSource] = useState<"Live" | "Fallback">("Fallback");

    useEffect(() => {
        let fallbackTimer: NodeJS.Timeout | null = null;

        const cb = ({ price }: { price: number }) => {
            setPrice(price);
            setSource("Live");
            if (fallbackTimer) clearTimeout(fallbackTimer);
        };

        subscribeToPragmaPriceFeed(cb);

        // If price doesn't update after 5s, switch to fallback
        fallbackTimer = setTimeout(() => {
            if (price === null) setSource("Fallback");
        }, 5000);

        return () => {
            unsubscribeFromPragmaFeed(cb);
            if (fallbackTimer) clearTimeout(fallbackTimer);
        };
    }, []);

    return { price, source };
}
