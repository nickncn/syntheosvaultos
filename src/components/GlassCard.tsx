interface Props {
    children: React.ReactNode;
}

export default function GlassCard({ children }: Props) {
    return (
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 
        shadow-[0_8px_30px_rgba(108,93,211,0.15)] hover:shadow-[0_10px_40px_rgba(108,93,211,0.3)] 
        transition-shadow duration-300"
        >
            {children}
        </div>
    );
}
