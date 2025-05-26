"use client";
import { useState } from "react";
import StrategyToggle from "./StrategyToggle";
import AIDecisionFeed from "./AIDecisionFeed";
import StrategyAPYChart from "./StrategyAPYChart";

export default function AIDashboardPanel() {
    const [aiMode, setAIMode] = useState(true);
    const [sensitivity, setSensitivity] = useState<"Aggressive" | "Moderate" | "Conservative">("Moderate");
    const [selectedRoute, setSelectedRoute] = useState<"Ekubo" | "Vesu">("Ekubo");
    const [userPreferred, setUserPreferred] = useState<"Ekubo" | "Vesu">("Ekubo");

    const ekuboAPY = 6.01;
    const vesuAPY = 4.55;

    const [aiFeed, setAIFeed] = useState<string[]>([
        "AI initialized. Monitoring strategies for optimal routing.",
        "No switch needed. Market is stable.",
    ]);

    const apyHistory = [
        { time: "Jan", ekubo: 6.01, vesu: 4.55 },
        { time: "Feb", ekubo: 6.15, vesu: 4.52 },
        { time: "Mar", ekubo: 5.87, vesu: 4.64 },
        { time: "Apr", ekubo: 6.08, vesu: 4.61 },
        { time: "May", ekubo: 5.94, vesu: 4.56 }
    ];

    <StrategyAPYChart data={apyHistory} />


    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* LEFT COLUMN */}
            <div className="bg-white/5 rounded-2xl border border-white/10 p-8 flex flex-col justify-between min-h-[430px]">
                <h3 className="text-2xl font-bold mb-6 text-white">Routing Mode</h3>

                <StrategyToggle
                    selected={aiMode ? selectedRoute : userPreferred}
                    onSelect={(r) => setSelectedRoute(r as "Ekubo" | "Vesu")}
                    aiMode={aiMode}
                    onToggleAI={() => setAIMode((v) => !v)}
                    sensitivity={sensitivity}
                    onSensitivity={(v) => setSensitivity(v)}
                    ekuboAPY={ekuboAPY}
                    vesuAPY={vesuAPY}
                />

                <div className="flex items-center gap-2 mt-6 text-white text-sm">
                    <label className="font-medium">User Preferred Route:</label>
                    <select
                        value={userPreferred}
                        onChange={(e) => setUserPreferred(e.target.value as "Ekubo" | "Vesu")}
                        className="bg-black/20 px-2 py-1 rounded border border-white/10 text-white"
                        disabled={aiMode}
                    >
                        <option value="Ekubo">Ekubo</option>
                        <option value="Vesu">Vesu</option>
                    </select>
                    <span className="ml-2 text-xs text-gray-400">(Manual override)</span>
                </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="flex flex-col gap-8">
                <div className="bg-white/5 rounded-2xl border border-white/10 p-6 min-h-[160px]">
                    <AIDecisionFeed aiFeed={aiFeed} setAIFeed={setAIFeed} />
                </div>
                <div className="bg-white/5 rounded-2xl border border-white/10 p-6 min-h-[220px] flex flex-col">
                    <StrategyAPYChart data={apyHistory} />
                    <div className="text-xs text-gray-400 mt-2">
                        *APY values simulated for demo. Real on-chain values will be supported soon.
                    </div>
                </div>
            </div>
        </div>
    );
}
