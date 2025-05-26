// Enhanced StrategyToggle with icons, logos, glowing card effects, and AI-selected status
"use client";
import React from "react";
import { ToggleLeft, ToggleRight } from "lucide-react";
import Image from "next/image";

interface Props {
    selected: "Ekubo" | "Vesu";
    onSelect: (strategy: "Ekubo" | "Vesu") => void;
    aiMode: boolean;
    onToggleAI: () => void;
    sensitivity: "Aggressive" | "Moderate" | "Conservative";
    onSensitivity: (s: "Aggressive" | "Moderate" | "Conservative") => void;
    ekuboAPY: number;
    vesuAPY: number;
}

const sensitivities = ["Aggressive", "Moderate", "Conservative"] as const;

export default function StrategyToggle({
    selected,
    onSelect,
    aiMode,
    onToggleAI,
    sensitivity,
    onSensitivity,
    ekuboAPY,
    vesuAPY,
}: Props) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <span className="font-bold text-base text-white">Routing Mode:</span>
                <button
                    onClick={onToggleAI}
                    className={`flex items-center gap-2 px-4 py-1 rounded-lg font-mono text-xs shadow border transition
            ${aiMode ? "bg-starknet-accent text-white border-starknet-accent" : "bg-white/10 text-gray-400 hover:bg-starknet-accent/30"}`}
                >
                    {aiMode ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    {aiMode ? "AI" : "Manual"}
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Ekubo Button */}
                <button
                    className={`group relative flex flex-col items-center justify-center px-4 py-4 rounded-xl border font-bold shadow-sm transition-transform duration-150 ease-out overflow-hidden
            ${selected === "Ekubo" ? "bg-blue-600 text-white border-blue-400 scale-105" : "bg-white/10 text-gray-200 border-transparent hover:bg-blue-600/30 hover:text-white hover:scale-[1.03] hover:shadow-lg"}
            ${aiMode ? "opacity-70 cursor-not-allowed" : ""}`}
                    onClick={() => !aiMode && onSelect("Ekubo")}
                    disabled={aiMode}
                >
                    <div className="absolute inset-0 bg-blue-400 opacity-10 blur-xl rounded-xl z-0 group-hover:opacity-20 transition-opacity" />
                    <div className="relative z-10 flex flex-col items-center">
                        <Image src="/ekubo.png" alt="Ekubo Logo" width={32} height={32} className="mb-1" />
                        <span className="text-lg">Ekubo</span>
                        <span className="text-xs text-green-300 mt-1">{ekuboAPY.toFixed(2)}% APY</span>
                        {selected === "Ekubo" && (
                            <span className="mt-2 text-[11px] bg-yellow-400/90 text-black rounded px-2 py-0.5 font-semibold">Active</span>
                        )}
                    </div>
                </button>

                {/* Vesu Button */}
                <button
                    className={`group relative flex flex-col items-center justify-center px-4 py-4 rounded-xl border font-bold shadow-sm transition-transform duration-150 ease-out overflow-hidden
            ${selected === "Vesu" ? "bg-green-600 text-white border-green-400 scale-105" : "bg-white/10 text-gray-200 border-transparent hover:bg-green-600/30 hover:text-white hover:scale-[1.03] hover:shadow-lg"}
            ${aiMode ? "opacity-70 cursor-not-allowed" : ""}`}
                    onClick={() => !aiMode && onSelect("Vesu")}
                    disabled={aiMode}
                >
                    <div className="absolute inset-0 bg-green-400 opacity-10 blur-xl rounded-xl z-0 group-hover:opacity-20 transition-opacity" />
                    <div className="relative z-10 flex flex-col items-center">
                        <Image src="/vesu.png" alt="Vesu Logo" width={32} height={32} className="mb-1" />
                        <span className="text-lg">Vesu</span>
                        <span className="text-xs text-green-300 mt-1">{vesuAPY.toFixed(2)}% APY</span>
                        {selected === "Vesu" && (
                            <span className="mt-2 text-[11px] bg-yellow-400/90 text-black rounded px-2 py-0.5 font-semibold">Active</span>
                        )}
                    </div>
                </button>
            </div>

            <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-gray-400">Sensitivity:</span>
                {sensitivities.map((s) => (
                    <button
                        key={s}
                        onClick={() => onSensitivity(s)}
                        className={`px-2 py-1 rounded-lg text-xs font-semibold transition
              ${sensitivity === s ? "bg-starknet-accent text-white" : "bg-white/10 text-gray-400 hover:bg-starknet-accent/20 hover:text-white"}`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {aiMode && (
                <div className="text-xs text-blue-300 mt-4">
                    AI selected: <span className="font-bold">{selected}</span>
                </div>
            )}
        </div>
    );
}
