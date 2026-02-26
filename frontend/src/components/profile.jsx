import { useEffect, useState } from "react";
import axios from 'axios';
import DisplayCard from "./DisplayCard";
import { Divider, Spinner } from "@heroui/react";

export default function Profile({ user }) {
    const [myMaps, setMyMaps] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

    useEffect(() => {
        const fetchMaps = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/v1/game/my-maps`);
                setMyMaps(res.data.maps || []);
            } catch (err) {
                console.error("Failed to fetch maps", err);
            } finally {
                setIsLoading(false);
            }
        };
        if (user) fetchMaps();
    }, [user, API_BASE]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this layout?")) return;
        try {
            await axios.delete(`${API_BASE}/api/v1/game/map/${id}`);
            setMyMaps(prev => prev.filter(map => map.id !== id));
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    if (!user) return <div className="p-20 text-center font-bold">Please log in.</div>;

    return (
        <div className="max-w-6xl mx-auto w-full">
            <div className="mb-8">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                    {user.username}'s HQ
                </h1>
                <p className="text-slate-500 font-medium">Manage your designs and settings (alpha)</p>
            </div>

            <Divider className="my-6" />

            {/*Maps Grid*/}
            <div className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    My Saved Layouts
                    <span className="bg-slate-100 text-slate-500 text-xs px-2 py-0.5 rounded-full">
                        {myMaps.length}
                    </span>
                </h2>

                {isLoading ? (
                    <div className="flex justify-center p-20"><Spinner /></div>
                ) : myMaps.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {myMaps.map(map => (
                            <DisplayCard key={map.id} id={map.id}
                                type={map} title={map.name} subtitle={map.game_name || "Base"}
                                image={map.preview_image} // Refer to backend doc for proper routing
                                footerAction={handleDelete} />
                        ))}
                    </div>
                ) : (
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-20 text-center">
                        <p className="text-slate-400 mb-4 font-medium">No maps found in the archives.</p>
                        <button className="text-blue-600 font-bold hover-underline">Start new design</button>
                    </div>
                )}
            </div>
        </div>
    );
}