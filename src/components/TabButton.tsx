interface TabButtonProps {
    label: string;
    active: boolean;
    onClick: () => void;
}

export default function TabButton({ label, active, onClick }: TabButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-xl font-medium border transition-all duration-200 ease-out
          ${active
                    ? "bg-starknet-accent text-white shadow-lg shadow-starknet-accent/30"
                    : "bg-white/5 text-gray-300 hover:bg-starknet-accent/20 hover:text-white hover:shadow-md hover:shadow-starknet-accent/20"
                }`}
        >
            {label}
        </button>
    );
}
