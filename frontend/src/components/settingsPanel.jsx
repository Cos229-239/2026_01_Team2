import { X, Settings, Moon, Sun, Monitor, Save } from 'lucide-react';
import { Button, Switch } from "@heroui/react";
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

export default function SettingsPanel({ isOpen, onClose, user }) {
    const handleSave = async () => {
        try {
            const updatedData = {
                username: document.getElementById('callsign-input').value,
                about: document.getElementById('about-input').value,
            };
            await axios.post(`${API_BASE}/api/v1/user/update`, updatedData, { withCredentials: true });
            window.location.reload();
        } catch (err) {
            console.error("Maintenance failed: ", err);
        }
    };
    return (
        <div className={`fixed top-0 right-0 h-full w-80 bg-neutral-900 border-l-4 border-neutral-800 shadow-2xl transform transition-transform duration-300 z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

            {/* Header: The "Latch" */}
            <div className="p-4 border-b border-neutral-800 bg-black/20 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Settings className="text-neutral-500" size={18} />
                    <span className="text-xs font-black text-neutral-400 uppercase tracking-widest">System Config</span>
                </div>
                <button onClick={onClose} className="p-1 hover:bg-neutral-800 rounded text-neutral-500"><X size={20} /></button>
            </div>

            <div className="p-6 space-y-8">
                {/* Section 1: Visual Output */}
                <div className="space-y-4">
                    <label className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">Visual Output</label>
                    <div className="flex items-center justify-between p-3 bg-black/40 border border-neutral-800 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Moon size={16} className="text-neutral-400" />
                            <span className="text-sm text-neutral-300 font-mono">Dark Mode</span>
                        </div>
                        <Switch defaultSelected color="primary" size="sm" />
                    </div>
                </div>

                {/* Section 2: Core Identity */}
                <div className="space-y-4">
                    <label className="text-[10px] font-bold text-orange-500 uppercase tracking-tighter">Core Identity</label>
                    <div className="space-y-2">
                        <span className="text-[10px] text-neutral-600 uppercase ml-1">Callsign</span>
                        <input
                            type="text" id="callsign-input"
                            defaultValue={user?.username}
                            className="w-full bg-neutral-950 border border-neutral-800 p-2 text-sm text-neutral-300 rounded font-mono focus:border-orange-500 outline-none transition-colors"
                        />
                    </div>
                </div>
                {/* Profile Briefing */}
                <div className="space-y-2 mt-4">
                    <span className="text-[10px] text-neutral-600 uppercase ml-1">Mission Briefing (About)</span>
                    <textarea
                        className="w-full bg-neutral-950 border border-neutral-800 p-2 text-sm text-neutral-300 rounded font-mono h-20 focus:border-blue-500 outline-none resize-none"
                        placeholder="Enter operator bio..." id="about-input"
                    />
                </div>

                {/* Section 3: Diagnostic Info */}
                <div className="pt-4 border-t border-neutral-800">
                    <div className="p-3 bg-blue-900/10 border border-blue-900/30 rounded-lg">
                        <p className="text-[10px] text-blue-400 font-mono italic">
                            Running Build: v0.4.2-ALPHA<br />
                            Status: System Optimal
                        </p>
                    </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-widest text-xs h-12"
                    onPress={handleSave}>
                    <Save size={16} className="mr-2" /> Commit Changes
                </Button>
            </div>
        </div>
    );
}