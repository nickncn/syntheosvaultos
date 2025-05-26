import { useState, useEffect } from "react";
import { useConnect, useAccount } from "@starknet-react/core";
import Image from "next/image";

export default function WalletConnect() {
    const { connect, connectors } = useConnect();
    const { address } = useAccount();
    const [isOpen, setIsOpen] = useState(false);

    const short = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : null;

    // RainbowKit style: pill, glow, and green dot when connected
    return (
        <div className="relative">
            <button
                onClick={() => !address && setIsOpen(true)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full shadow-lg font-bold transition 
                    ${address ? "bg-gradient-to-r from-black-400 to-blue-600 text-white" : "bg-black text-white"}
                    hover:opacity-90
                    ring-1 ring-white/20
                `}
                style={{
                    minWidth: "180px",
                    justifyContent: "center",
                    fontSize: "1.05rem"
                }}
            >
                {address ? (
                    <>
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span>{short}</span>
                    </>
                ) : (
                    <>Connect Wallet</>
                )}
            </button>

            {isOpen && !address && (
                <div className="absolute right-0 mt-2 bg-white text-black rounded-xl shadow-lg border border-gray-300 w-64 z-50">
                    <div className="p-4 font-semibold border-b">Choose Wallet</div>
                    {connectors.map((connector) => (
                        <button
                            key={connector.id}
                            onClick={() => { connect({ connector }); setIsOpen(false); }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-3"
                        >
                            <Image
                                src={connector.id === "braavos"
                                    ? "/braavos.jpeg"
                                    : connector.id === "argentX"
                                        ? "/argentx.png"
                                        : "/wallet.svg"
                                }
                                alt={connector.name || connector.id}
                                width={20}
                                height={20}
                            />
                            {connector.name || connector.id}
                        </button>
                    ))}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-full px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
}
