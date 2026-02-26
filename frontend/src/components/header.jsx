import { Button } from "@heroui/react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// This component is a logo, version, breadcrumbs for pagination, and space for User Card
export default function Header({ user, setUser }) {
    const navigate = useNavigate();
    const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

    const handleLogout = async () => {
        try {
            await axios.post(`${API_BASE}/api/v1/auth/logout`);
            setUser(null);
            navigate('/');
        } catch (err) {
            console.error("Logout failed", err);
        }
    };
    return (
        <header className="w-full border-b border-slate-200 bg-white px-6 py-4">
            <nav className="mx-auto flex max-w-7xl items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link to="/" className="text-xl font-bold text-slate-900">MyHQ</Link>
                    <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-600 uppercase">Alpha</span>
                </div>

                {/* Desktop Links */}
                <ul className="hidden space-x-8 md:flex text-slate-600 font-medium">
                    <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
                    <li><Link to="/about" className="hover:text-blue-600">About</Link></li>
                    <li><Link to="/designer" className="hover:text-blue-600">Designer</Link></li>
                </ul>

                {/*User Section*/}
                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                            {/*User ID Card*/}
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tigher">Designer</p>
                                <p className="text-sm font-bold text-slate-900 leading-none">{user.username}</p>
                            </div>
                            {/*User Buttons*/}
                            <Button as={Link} to="/profile" size="sm"
                                color="primary" variant="flat" className="font-semibold">
                                My Layouts</Button>
                            <Button onPress={handleLogout} size="sm" color="danger" variant="light">Logout</Button>
                        </div>
                    ) : (
                        <>
                                <Button className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                                    as={Link } to="/login" variant="light">
                                Sign In
                            </Button>
                                <Button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                                    as={Link} to="/signup" color="primary">
                                Get Started
                            </Button>
                        </>
                    )}
                </div>
            </nav>
        </header>
    )
}