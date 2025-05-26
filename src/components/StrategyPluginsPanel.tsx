"use client";
import { useState } from "react";

const availableStrategies = [
    { name: "Ekubo", description: "Best for stable yields." },
    { name: "Vesu", description: "Maximizes volatile opportunities." },
    // Add more here in future!
];

export default function StrategyPluginsPanel({
    activeStrategy,
    onSelectStrategy,
    aiRecommended,
    aiMode,
    onToggleAI,
}: {
    activeStrategy: string;
    onSelectStrategy: (s: string) => void;
    aiRecommended: string;
    aiMode: boolean;
    onToggleAI: () => void;
}) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-4">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Strategy Plugins</h3>
                <button
                    className="px-2 py-1 text-xs rounded bg-starknet-accent text-white"
                    onClick={onToggleAI}
                >
                    {aiMode ? "AI: ON (auto-switch)" : "AI: OFF (manual override)"}
                </button>
            </div>
            <div className="space-y-3">
                {availableStrategies.map((s) => (
                    <button
                        key={s.name}
                        disabled={aiMode}
                        onClick={() => onSelectStrategy(s.name)}
                        className={`block w-full text-left px-4 py-2 rounded-lg
            ${activeStrategy === s.name ? "bg-green-600 text-white" : "bg-white/10 text-gray-300"}
            ${aiRecommended === s.name && aiMode ? "border-2 border-blue-400" : ""}
            `}
                    >
                        <div className="flex justify-between">
                            <span>{s.name}</span>
                            {aiRecommended === s.name && aiMode && (
                                <span className="text-blue-400 text-xs ml-2">AI Recommended</span>
                            )}
                            {activeStrategy === s.name && <span className="ml-2 text-green-300 font-bold">Active</span>}
                        </div>
                        <div className="text-xs mt-1 text-gray-400">{s.description}</div>
                    </button>
                ))}
            </div>
        </div>
    );
}
