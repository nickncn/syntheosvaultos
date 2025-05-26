// src/components/ZKProofPanel.tsx
"use client";
import { useState } from "react";

export default function ZKProofPanel() {
    const [proof, setProof] = useState("");
    const [result, setResult] = useState<"success" | "fail" | null>(null);
    const [loading, setLoading] = useState(false);

    // Mock proof check: accept any string ending with 'VALID'
    const verifyProof = async (input: string) => {
        return input.trim().toUpperCase().endsWith("VALID");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        try {
            const ok = await verifyProof(proof);
            setResult(ok ? "success" : "fail");
        } catch {
            setResult("fail");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[50vh]">
            <div className="bg-white/10 p-8 rounded-2xl shadow-lg w-full max-w-xl flex flex-col items-center">
                <h2 className="text-xl font-bold mb-4 text-white">zkProof Verification</h2>
                <form onSubmit={handleSubmit} className="w-full">
                    <input
                        type="text"
                        placeholder="Paste ZK Proof Data"
                        className="w-full px-4 py-2 rounded mb-4 bg-black/20 text-white"
                        value={proof}
                        onChange={e => setProof(e.target.value)}
                        disabled={loading}
                        autoFocus
                    />
                    <button
                        type="submit"
                        className="w-full py-2 rounded bg-starknet-accent text-white font-bold text-lg mb-2"
                        disabled={loading || !proof}
                    >
                        {loading ? "Verifying..." : "Submit Proof"}
                    </button>
                </form>
                {result === "success" && (
                    <div className="mt-4 text-green-400 font-bold text-lg">✅ Proof Accepted!</div>
                )}
                {result === "fail" && (
                    <div className="mt-4 text-red-400 font-bold text-lg">❌ Invalid Proof</div>
                )}
                <div className="mt-2 text-xs text-gray-400">
                    (Try any string ending with <code>VALID</code> to pass the mock demo)
                </div>
            </div>
        </div>
    );
}
