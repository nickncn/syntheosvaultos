export function XPProgressBar({ xp }: { xp: number }) {
    const getProgress = () => {
        if (xp >= 1000) return 100;
        if (xp >= 500) return ((xp - 500) / 500) * 100;
        return (xp / 500) * 100;
    };

    return (
        <div className="mt-3 w-full h-3 bg-gray-700/30 rounded-full overflow-hidden">
            <div
                className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-500"
                style={{ width: `${getProgress()}%` }}
            />
        </div>
    );
}