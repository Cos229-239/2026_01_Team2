export default function DiscordRadio() {
    return (
        <div className="mt-8 p-1 bg-neutral-800 rounded-xl shadow-2xl border-b-4 border-black">
            {/* Radio Top: Antenna & Signal */}
            <div className="flex justify-between items-center px-3 py-2 bg-neutral-900 rounded-t-lg">
                <div className="flex gap-1">
                    <div className="w-1 h-3 bg-green-500"></div>
                    <div className="w-1 h-3 bg-green-500"></div>
                    <div className="w-1 h-3 bg-neutral-700"></div>
                </div>
                <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest animate-pulse">
                    Live Feed // Comms-Link
                </span>
            </div>

            {/* The Discord Widget Container */}
            <div className="bg-neutral-900 overflow-hidden border-x-4 border-neutral-800">
                {/* Replace URL with your actual Discord Server Widget URL */}
                <iframe
                    src="https://discord.com/widget?id=1034616802937946182&theme=dark"
                    width="100%"
                    height="400"
                    allowtransparency="true"
                    frameBorder="0"
                    sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                />
            </div>

            {/* Radio Bottom: Dial & Speaker Grille */}
            <div className="p-3 bg-neutral-800 rounded-b-lg flex justify-between items-center">
                <div className="w-8 h-8 rounded-full bg-black shadow-inner border border-neutral-700 flex items-center justify-center">
                    <div className="w-1 h-4 bg-orange-600 rotate-45 rounded-full"></div>
                </div>
                <div className="grid grid-cols-4 gap-1">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="w-1 h-1 bg-black rounded-full opacity-50"></div>
                    ))}
                </div>
            </div>
        </div>
    );
}