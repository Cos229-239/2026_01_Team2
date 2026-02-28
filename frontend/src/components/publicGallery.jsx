import { useEffect, useState, useMemo } from "react";
import axios from 'axios';
import DisplayCard from "./DisplayCard";
import { Spinner, Input, Button } from "@heroui/react";
import { LayoutGrid, StretchHorizontal, Search } from 'lucide-react';

export default function PublicGallery({ context = "browse" }) {
    const [maps, setMaps] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState({
        isCompact: false,
        searchQuery: ""
    });

    const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

    // 1. Unified Fetch Logic
    useEffect(() => {
        const fetchMaps = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/v1/game/maps`);
                setMaps(res.data.maps || []);
            } catch (err) {
                console.error("Archive sync failed:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMaps();
    }, [API_BASE]);

    // 2. Intelligent Data Processing (Search + Limits)
    const processedMaps = useMemo(() => {
        let filtered = maps.filter(m =>
            m.name.toLowerCase().includes(view.searchQuery.toLowerCase())
        );

        // If on Home page, only show the top 4
        return context === "home" ? filtered.slice(0, 4) : filtered;
    }, [maps, view.searchQuery, context]);

    // 3. Dynamic Grid Styling
    const gridLayout = view.isCompact
        ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3"
        : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6";

    if (isLoading) return <div className="flex justify-center p-20"><Spinner label="Syncing Archives..." /></div>;

    return (
        <section className="w-full space-y-6">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-center md:text-left">
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900">
                        {context === "home" ? "Top Operations" : "Global Archives"}
                    </h2>
                    <p className="text-xs font-mono text-slate-500 uppercase">Status: Public Access Enabled</p>
                </div>

                {/* Search and Toggle (Hidden or simplified on Home context if preferred) */}
                {context === "browse" && (
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <Input
                            size="sm"
                            startContent={<Search size={16} className="text-slate-400" />}
                            placeholder="Search by callsign..."
                            className="max-w-xs"
                            onValueChange={(val) => setView(prev => ({ ...prev, searchQuery: val }))}
                        />
                        <Button
                            isIconOnly
                            size="sm"
                            variant="flat"
                            onPress={() => setView(prev => ({ ...prev, isCompact: !prev.isCompact }))}
                        >
                            {view.isCompact ? <LayoutGrid size={18} /> : <StretchHorizontal size={18} />}
                        </Button>
                    </div>
                )}
            </div>

            {/* The Responsive Grid */}
            <div className={gridLayout}>
                {processedMaps.map(map => (
                    <DisplayCard
                        key={map.id}
                        id={map.id}
                        title={map.name}
                        subtitle={map.game_name || "Standard"}
                        image={map.preview_image}
                        isOwner={false}
                        compact={view.isCompact}
                    />
                ))}
            </div>

            {/* Empty State */}
            {processedMaps.length === 0 && (
                <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-xl">
                    <p className="font-mono text-slate-400">No matching intel found in archives.</p>
                </div>
            )}
        </section>
    );
}