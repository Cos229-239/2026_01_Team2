import { Button } from "@heroui/react";
// Final call to action, secondary navigation, and branding information.
export default function Footer() {
    return (
        <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
            <div className="mx-auto max-w-7xl px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                    <h4 className="font-bold text-slate-900 mb-4">Planned Platforms</h4>
                    <ul className="space-y-2 text-sm text-slate-600">
                        <li>Mobile App (PWA)</li>
                        <li>Offline Mode</li>
                        <li>Desktop Client</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 mb-4">Community</h4>
                    <ul className="space-y-2 text-sm text-slate-600">
                        <li>Discord</li>
                        <li>Facebook</li>
                        <li>Twitch</li>
                    </ul>
                </div>
                {/* Repeat for other columns... */}
            </div>
            <div className="mt-12 pt-8 border-t border-slate-200 text-center text-xs text-slate-400">
                &copy; {new Date().getFullYear()} MyHQ - Intuitive Grid Strategy
            </div>
        </footer>
    )
}