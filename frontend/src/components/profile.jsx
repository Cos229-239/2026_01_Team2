import { useEffect, useState } from "react";
import axios from 'axios';
import DisplayCard from "./DisplayCard";
import { Divider, Spinner, Button } from "@heroui/react"; // Assuming HeroUI
import { Settings } from "lucide-react"; // Or your preferred icon set
import AchievementGrid from './achievementGrid';
// import SettingsPanel from "./SettingsPanel"; // Import your panel here

export default function Profile({ user }) {
    const [myMaps, setMyMaps] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

    useEffect(() => {
        const fetchMaps = async () => {
            try {
                // Ensure the backend route /api/v1/game/my-maps exists and returns { "maps": [...] }
                const res = await axios.get(`${API_BASE}/api/v1/game/my-maps`, { withCredentials: true });
                setMyMaps(res.data.maps || []);
            } catch (err) {
                console.error("Critical: Profile fetch failed.", err.response?.status);
            } finally {
                setIsLoading(false);
            }
        };
        if (user) fetchMaps();
    }, [user, API_BASE]);

    const handleDelete = async (id) => {
        if (!window.confirm("Confirm deletion of this layout?")) return;
        try {
            await axios.delete(`${API_BASE}/api/v1/game/map/${id}`, { withCredentials: true });
            setMyMaps(prev => prev.filter(map => map.id !== id));
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    if (!user) return <div className="p-20 text-center font-bold">Access Denied. Please log in.</div>;

    return (
        <div className="max-w-6xl mx-auto w-full py-10 px-4 space-y-16">
            {/* Header with Settings Trigger */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">
                        {user.username}'s HQ
                    </h1>
                    <p className="text-slate-500 font-medium">Tactical Command & User Archives</p>
                </div>
                <Button
                    isIconOnly
                    variant="light"
                    onPress={() => setIsSettingsOpen(true)}
                    className="text-slate-400 hover:text-blue-600"
                >
                    <Settings size={24} />
                </Button>
            </div>

            <section className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                <AchievementGrid user={user} maps={myMaps} />
            </section>

            <div className="space-y-8">
                <h2 className="text-2xl font-bold flex items-center gap-2 border-b border-slate-100 pb-4">
                    My Saved Layouts
                    <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                        {myMaps.length}
                    </span>
                </h2>

                {isLoading ? (
                    <div className="flex justify-center p-20"><Spinner color="primary" /></div>
                ) : myMaps.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {myMaps.map(map => (
                            <DisplayCard
                                key={map.id}
                                id={map.id}
                                isOwner={true}
                                type="map" // String literal to prevent CSS breaks
                                title={map.name}
                                subtitle={map.game_name || "Standard Layout"}
                                image={map.preview_image || "/placeholder-map.png"}
                                footerAction={handleDelete}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-20 text-center">
                        <p className="text-slate-400 mb-4 font-medium">No map signatures detected in your archives.</p>
                        <Button color="primary" variant="flat">Initialize New Design</Button>
                    </div>
                )}
            </div>

            {/* Placeholder for the Settings Panel you want to activate */}
            {/* <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} user={user} /> */}
        </div>
    );
}