import { useConnect, useDisconnect, useAccount } from "@starknet-react/core";

export default function WalletStatus() {
    const { address, status } = useAccount();
    const { disconnect } = useDisconnect();

    if (!address) return null;

    return (
        <div className="flex items-center justify-between bg-black/10 p-2 rounded-lg">
            <span className="text-sm text-white/80">
                Connected: {address.slice(0, 6)}...{address.slice(-4)}
            </span>
            <button
                onClick={() => disconnect()}
                className="ml-4 px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
            >
                Disconnect
            </button>
        </div>
    );
}
