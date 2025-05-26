// Enhanced version of AIDecisionFeed with icon + improved layout
"use client";
import React from "react";
import { Info, CheckCircle, RefreshCcw } from "lucide-react";

interface AIDecisionFeedProps {
    aiFeed: string[];
    setAIFeed: React.Dispatch<React.SetStateAction<string[]>>;
}

const AIDecisionFeed: React.FC<AIDecisionFeedProps> = ({ aiFeed, setAIFeed }) => {
    const interpretMessage = (msg: string) => {
        if (msg.toLowerCase().includes("switch")) return <CheckCircle className="text-green-400 w-4 h-4" />;
        if (msg.toLowerCase().includes("monitor")) return <RefreshCcw className="text-blue-400 w-4 h-4" />;
        return <Info className="text-gray-400 w-4 h-4" />;
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-white">AI Decision Feed</h3>
                <button
                    className="text-xs text-red-400 hover:underline"
                    onClick={() => setAIFeed(["AI monitoring. No switch needed yet."])}
                >
                    Clear
                </button>
            </div>

            <div className="text-sm space-y-2 max-h-48 overflow-y-auto font-mono">
                {aiFeed.length === 0 ? (
                    <div className="text-xs text-gray-500">AI system is live and monitoring strategy performance...</div>
                ) : (
                    aiFeed.map((msg, i) => (
                        <div key={i} className="text-xs text-green-300 flex items-center gap-2">
                            {interpretMessage(msg)}
                            <span>{msg}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AIDecisionFeed;
