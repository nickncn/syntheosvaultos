export default function Shimmer({ className = "" }) {
    return (
        <div className={`animate-pulse bg-gray-700/20 rounded ${className}`} />
    );
}
