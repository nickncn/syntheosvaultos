export function XPLeaderboard({ currentXP }: { currentXP: number }) {
    const mockUsers = [
        { name: "you", xp: currentXP },
        { name: "vaultman.eth", xp: 850 },
        { name: "rebalancer.ai", xp: 420 },
        { name: "starknet.doge", xp: 200 },
    ];

    const rankEmoji = (xp: number) =>
        xp >= 1000 ? "🥇" : xp >= 500 ? "🥈" : "🥉";

    return (
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 
        shadow-[0_8px_30px_rgba(108,93,211,0.15)] hover:shadow-[0_10px_40px_rgba(108,93,211,0.3)] 
        transition-shadow duration-300 w-full text-white">
            <h3 className="text-lg font-semibold mb-3">XP Leaderboard</h3>
            <ul className="space-y-2 text-sm">
                {mockUsers.map((u, i) => (
                    <li
                        key={i}
                        className="flex justify-between items-center border-b border-white/5 pb-1 last:border-none"
                    >
                        <div className="flex items-center space-x-2">
                            <span>{rankEmoji(u.xp)}</span>
                            <span className="font-medium">{u.name}</span>
                        </div>
                        <span className="text-gray-300 font-semibold">{u.xp} XP</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
