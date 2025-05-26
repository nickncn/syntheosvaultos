// src/components/LiveBTCPriceWidget.tsx
"use client";
import { usePragmaBTCPrice } from "../hooks/usePragmaBTCPrice";

export default function LiveBTCPriceWidget() {
    const { price, source } = usePragmaBTCPrice();

    return (
        <div className="flex items-center gap-2 px-4 py-2 bg-grey/80 rounded-xl border border-white/10 shadow-lg">
            <img src="/pragma.png" alt="Pragma" className="w-10 h-10" />
            <span className={source === "Live" ? "text-green-400" : "text-red-400"}>
                {source === "Live" ? "●" : "●"}
            </span>
            <span className="text-xs font-mono">
                {source === "Live" ? "Pragma Live Price Feed" : "Pragma Fallback"}
            </span>
            <span className="text-xs ml-2 text-white">
                {price !== null ? <>BTC/USD: <b>${Number(price).toLocaleString(undefined, { maximumFractionDigits: 2 })}</b></> : "Loading..."}
            </span>
        </div>
    );
}
