"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
    TooltipProvider,
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from "@radix-ui/react-tooltip";

// Strategy list (demo data)
const STRATEGY_LIST = [
    { id: 1, name: "Ekubo", address: "0xYourEkuboAddress", apy: 6.01, icon: "/ekubo.png" },
    { id: 2, name: "Vesu", address: "0xYourVesuAddress", apy: 4.55, icon: "/vesu.png" },
];

export default function StrategyMarketplace() {
    const [strategies, setStrategies] = useState(STRATEGY_LIST);

    return (
        <TooltipProvider>
            <div className="w-full max-w-5xl mx-auto px-4 py-10">
                <h2 className="text-3xl font-bold mb-8 text-white text-center">Strategy Marketplace</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {strategies.map((strategy) => (
                        <div
                            key={strategy.id}
                            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <Image
                                    src={strategy.icon}
                                    alt={`${strategy.name} icon`}
                                    width={32}
                                    height={32}
                                    className="rounded"
                                />
                                <span className="font-semibold text-xl text-white">{strategy.name}</span>
                            </div>

                            <a
                                href={`https://starkscan.co/contract/${strategy.address}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-400 underline hover:text-blue-200 mb-2 inline-block"
                            >
                                View Contract
                            </a>

                            <div className="text-sm text-white">
                                <span className="font-semibold">APY: </span>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className="text-green-400 cursor-help">{strategy.apy.toFixed(2)}%</span>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="bg-black text-white p-2 rounded text-xs shadow">
                                        Simulated Annual Percentage Yield (APY)
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 text-center flex flex-col items-center gap-4">
                    <h4 className="font-semibold text-2xl text-white">Want to build your own yield strategy?</h4>

                    <p className="text-gray-300 text-base max-w-xl">
                        VaultOS is fully modular: anyone can deploy a new strategy smart contract that follows the <span className="font-mono text-blue-300">IStrategy</span> interface, then register it with the vault. All strategies are hot-swappable!
                    </p>

                    <pre className="bg-black/60 text-white text-left text-sm rounded-lg p-4 max-w-xl w-full overflow-x-auto border border-white/10">
                        {`// Minimal IStrategy example (Cairo)
#[interface]
trait IStrategy {
    fn deposit(user: ContractAddress, amount: u256);
    fn withdraw(user: ContractAddress, amount: u256);
    fn get_user_balance(user: ContractAddress) -> u256;
    fn get_total_deposits() -> u256;
    fn get_simulated_apy() -> u256;
}`}
                    </pre>

                    <a
                        href="https://github.com/YOUR_GITHUB_OR_DOC_LINK"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 px-5 py-2.5 rounded-full bg-starknet-accent text-white font-medium hover:opacity-80 transition"
                    >
                        Read Developer Docs
                    </a>
                </div>

                <div className="mt-6 text-xs text-gray-400 text-center">
                    Want to build your own strategy? Deploy a contract and register it with the vault owner! <br />
                    <span className="text-gray-300 font-semibold">
                        APY values shown are simulated for demonstration purposes only.
                    </span>
                </div>
            </div>
        </TooltipProvider>
    );
}