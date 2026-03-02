export default function Cell({ type }) {
    //accepts cell grid position, selected state, and asset list
    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

    if (!type || type === "empty" || type === "select") {
        return <span className="text-[8px] opacity-10">{type}</span>
    }

    return (
        <div className="relative w-full h-full">
            <img
                src={`${API_BASE}/api/v1/assets/${type}`}
                alt={type}
                className="w-full h-full object-contain"
                onError={(e) => {
                    console.log("Failed to load asset " + type);
                    e.target.style.display = 'none';
                }}
            />
        </div>
    );
}