// src/hooks/useAIStrategyRoute.ts
import { useEffect, useRef, useState } from "react";
import { usePragmaBTCPrice } from "./usePragmaBTCPrice";

export function useAIStrategyRoute(
    sensitivity: "Aggressive" | "Moderate" | "Conservative",
    aiEnabled: boolean
) {
    // FIX: get price from { price } object
    const { price } = usePragmaBTCPrice();
    const lastPrice = useRef<number | null>(null);
    const [route, setRoute] = useState<"Ekubo" | "Vesu">("Ekubo");
    const [log, setLog] = useState<string[]>([]);

    useEffect(() => {
        // FIX: check for null price
        if (!aiEnabled || price == null) return;

        // Sensitivity to volatility
        let threshold = 50;
        if (sensitivity === "Aggressive") threshold = 20;
        if (sensitivity === "Moderate") threshold = 50;
        if (sensitivity === "Conservative") threshold = 100;

        if (lastPrice.current !== null) {
            const delta = Math.abs(price - lastPrice.current);
            let newRoute: "Ekubo" | "Vesu" = delta > threshold ? "Vesu" : "Ekubo";
            if (newRoute !== route) {
                setRoute(newRoute);
                setLog(l => [
                    `${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })} — AI switched to: ${newRoute} (Δ $${delta.toFixed(2)})`,
                    ...l.slice(0, 24)
                ]);
            }
        }
        lastPrice.current = price;
        // eslint-disable-next-line
    }, [price, sensitivity, aiEnabled]);

    return { route, log };
}
