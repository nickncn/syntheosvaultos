// src/components/CDRHistoryChart.tsx
"use client";
import { useEffect, useState, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useDynamicCDR } from "../hooks/useCDR";

// Utility: Format as percent with 2 decimals
function percentFmt(val: number) {
    return `${val.toFixed(2)}%`;
}

type CDRDatum = { time: string; cdr: number };

export default function CDRHistoryChart() {
    const { cdr } = useDynamicCDR();
    const [cdrData, setCdrData] = useState<CDRDatum[]>([]);

    // Initialize with 5 unique points, 1 per past hour
    useEffect(() => {
        if (cdrData.length === 0) {
            const now = new Date();
            const mock = Array.from({ length: 5 }).map((_, i) => {
                const t = new Date(now.getTime() - (4 - i) * 60 * 60 * 1000);
                return {
                    time: t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    cdr: 175 + Math.random() * 10,
                };
            });
            setCdrData(mock);
        }
        // eslint-disable-next-line
    }, []);

    // Only add a new point if the hour changes or timestamp is unique (max 5)
    useEffect(() => {
        if (cdr === null || isNaN(cdr) || cdr <= 0) return;

        const now = new Date();
        const timestamp = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        setCdrData(prev => {
            // Prevent adding if timestamp already exists (to avoid duplicate time points per hour)
            if (prev.length > 0 && prev[prev.length - 1].time === timestamp) {
                // If CDR changed, update value for same timestamp
                if (prev[prev.length - 1].cdr !== cdr) {
                    const arr = prev.slice();
                    arr[arr.length - 1] = { ...arr[arr.length - 1], cdr };
                    return arr;
                }
                return prev;
            }
            // Only keep last 5 (rolling window)
            return [...prev.slice(-4), { time: timestamp, cdr }];
        });
    }, [cdr]);

    return (
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 
            shadow-[0_8px_30px_rgba(108,93,211,0.15)] hover:shadow-[0_10px_40px_rgba(108,93,211,0.3)] 
            transition-shadow duration-300 md:col-span-3 w-full">
            <h3 className="text-lg font-semibold mb-4">
                Collateralization Ratio (CDR) History <span className="text-xs text-gray-400">(last 5 hours, live)</span>
            </h3>
            <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={cdrData}>
                        <XAxis dataKey="time" stroke="#ccc" />
                        <YAxis stroke="#ccc" domain={["auto", "auto"]} width={80} tickFormatter={percentFmt} />
                        <Tooltip
                            formatter={(val: any) => (typeof val === "number" ? percentFmt(val) : val)}
                            contentStyle={{ backgroundColor: "#1c1c24", borderColor: "#6C5DD3" }}
                        />
                        <Line type="monotone" dataKey="cdr" stroke="#ffb300" strokeWidth={3} dot />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
