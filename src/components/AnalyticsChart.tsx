// src/components/AnalyticsChart.tsx
"use client";
import { useDynamicCDR } from "../hooks/useDynamicCDR";
import { usePragmaBTCPrice } from "../hooks/usePragmaBTCPrice";
import { useEffect, useState, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function AnalyticsChart() {
    const { price } = usePragmaBTCPrice();
    const { cdr } = useDynamicCDR();

    const [chartData, setChartData] = useState<{ time: string; price: number; cdr: number }[]>([]);
    const lastSaved = useRef(0);

    // On first load, fill with mock data in sane range
    useEffect(() => {
        if (chartData.length === 0) {
            const now = Date.now();
            const mock = Array.from({ length: 4 }).map((_, i) => {
                const t = new Date(now - (4 - i) * 60 * 60 * 1000);
                return {
                    time: t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    price: 111000 + Math.random() * 400,
                    cdr: 160 - i * 10, // in percent, e.g. 150, 140, etc.
                };
            });
            setChartData(mock);
        }
    }, []);

    // On live price or CDR update, save a new point every 30s (demo)
    useEffect(() => {
        if (price === null || cdr === null) return;
        const now = Date.now();
        const interval = 60 * 1000 * 30;
        let cdrPercent = Number(cdr);
        // If cdr is a ratio (like 1.5), multiply by 100
        if (cdrPercent < 10) cdrPercent = cdrPercent * 100;
        // If cdr is too high, likely a bug; clamp for safety
        if (cdrPercent > 1000) cdrPercent = 150;
        if (chartData.length === 0 || now - lastSaved.current >= interval) {
            lastSaved.current = now;
            const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            setChartData(prev =>
                [...prev.slice(-4), { time: timestamp, price, cdr: cdrPercent }]
            );
        } else {
            setChartData(prev => {
                if (prev.length === 0) return prev;
                const arr = prev.slice();
                arr[arr.length - 1] = { ...arr[arr.length - 1], price, cdr: cdrPercent };
                return arr;
            });
        }
    }, [price, cdr]);

    return (
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 
            shadow-[0_8px_30px_rgba(108,93,211,0.15)] hover:shadow-[0_10px_40px_rgba(108,93,211,0.3)] 
            transition-shadow duration-300 md:col-span-3 w-full">
            <h3 className="text-lg font-semibold mb-4">
                Vault Analytics <span className="text-xs text-gray-400">(last 5 points + live)</span>
            </h3>
            <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <XAxis dataKey="time" stroke="#ccc" />
                        <YAxis
                            yAxisId="left"
                            stroke="#6C5DD3"
                            domain={["auto", "auto"]}
                            width={80}
                            tickFormatter={val => `$${Number(val).toLocaleString()}`}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            stroke="#26E07F"
                            domain={[100, 200]} // you can widen if needed
                            width={80}
                            tickFormatter={val => `${val.toFixed(2)}%`}
                        />
                        <Tooltip
                            formatter={(val, name) =>
                                name === "cdr"
                                    ? `${Number(val).toFixed(2)}% CDR`
                                    : `$${Number(val).toLocaleString()}`
                            }
                            contentStyle={{ backgroundColor: "#1c1c24", borderColor: "#6C5DD3" }}
                        />
                        <Legend />
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="price"
                            stroke="#6C5DD3"
                            strokeWidth={3}
                            dot
                            name="BTC Price"
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="cdr"
                            stroke="#26E07F"
                            strokeWidth={3}
                            dot
                            name="CDR (%)"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
