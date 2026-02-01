import { Button } from "@heroui/react";
// This component is a logo, version, breadcrumbs for pagination, and space for User Card
export default function Header() {
    return (
        <header className="w-full border-b border-slate-200 bg-white px-6 py-4">
            <nav className="mx-auto flex max-w-7xl items-center justify-between">
                <div className="text-xl font-bold text-slate-900">MyHQ</div>

                {/* Desktop Links */}
                <ul className="hidden space-x-8 md:flex text-slate-600 font-medium">
                    <li><a href="/" className="hover:text-blue-600">Home</a></li>
                    <li><a href="/about" className="hover:text-blue-600">About</a></li>
                    <li><a href="/tool" className="hover:text-blue-600">Designer</a></li>
                </ul>

                <div className="flex items-center gap-4">
                    <button className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                        Sign In
                    </button>
                    <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                        Get Started
                    </button>
                </div>
            </nav>
        </header>
    )
}