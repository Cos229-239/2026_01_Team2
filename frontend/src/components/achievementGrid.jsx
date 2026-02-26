import { UserCheck, Contact2, Compass, MapPin, Map, Quill, Footprints, Rocket, Award } from 'lucide-react';

const achievements = [
    { id: 1, title: "New Recruit", desc: "Sign up", icon: UserCheck },
    { id: 2, title: "Hey, That’s Me!", desc: "Fill out profile info", icon: Contact2 },
    { id: 3, title: "At First I was Lost", desc: "1st saved layout", icon: Compass },
    { id: 4, title: "But Now I am Found", desc: "5th saved layout", icon: MapPin },
    { id: 5, title: "Cartographer", desc: "100th saved layout", icon: Map },
    { id: 6, title: "To Whom it may Concern", desc: "1st Forum Post", icon: Quill },
    { id: 7, title: "One Small Step", desc: "1st Game Schema", icon: Footprints },
    { id: 8, title: "One Giant Leap", desc: "10th Game Schema", icon: Rocket },
    { id: 9, title: "Recognized", desc: "10 Schema/Layout uses", icon: Award },
];

export default function AchievementGrid({ user, maps }) {
    // Logic to determine if a light is green or grey
    const getStatus = (title) => {
        if (!user) return "disabled";
        if (title === "New Recruit") return "complete"; // Sign up is inherent if they see this
        if (title === "Hey, That’s Me!" && user.about) return "complete";

        // Check the MAPS array we just passed in
        if (title === "At First I was Lost" && maps?.length >= 1) return "complete";
        if (title === "But Now I am Found" && maps?.length >= 5) return "complete";
        if (title === "Cartographer" && maps?.length >= 100) return "complete";

        return "disabled";
    };

    return (
        <div className="mt-12">
            <div className="flex items-center gap-4 mb-6">
                <h3 className="text-xs font-black text-neutral-500 uppercase tracking-[0.3em]">Service Record</h3>
                <div className="h-[1px] flex-grow bg-neutral-200"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {achievements.map((ach) => {
                    const Icon = ach.icon; // Assign to capitalized variable for JSX
                    const isComplete = getStatus(ach.title) === "complete";

                    return (
                        <div key={ach.id} className={`p-4 border rounded-lg flex items-center gap-4 transition-all ${isComplete ? 'border-green-500 bg-green-500/5 shadow-sm' : 'border-neutral-200 opacity-60'}`}>
                            {/* Rendering the Icon here clears the ESLint error */}
                            <div className={`p-2 rounded ${isComplete ? 'bg-green-100' : 'bg-neutral-100'}`}>
                                <Icon size={20} className={isComplete ? 'text-green-600' : 'text-neutral-400'} />
                            </div>
                            <div>
                                <h4 className={`text-xs font-black uppercase ${isComplete ? 'text-neutral-800' : 'text-neutral-500'}`}>{ach.title}</h4>
                                <p className="text-[10px] text-neutral-400 font-mono italic leading-tight">{ach.desc}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}