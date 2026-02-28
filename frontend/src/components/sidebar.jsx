import { useMemo } from 'react'; // MUST import this
import { Button } from "@heroui/react";
import { Link, useLocation } from 'react-router-dom';
import DiscordRadio from './discordRadio';

// Core Assets
import collapse from '../assets/sidebar-collapse.svg';
import brand from '../assets/brand.svg';
import brush from '../assets/sidebar-Pencil-Brush.svg';
import paper from '../assets/sidebar-Pencil-Paper.svg';

export default function Sidebar({ user }) {
    const location = useLocation();

    // 1. Calculate the pages list based on user state
    const pages = useMemo(() => {
        const basePages = [
            { "name": "Home", "path": "/", "asset": brush },
            { "name": "Layout", "path": "/designer", "asset": paper },
            { "name": "About", "path": "/about", "asset": brand }
        ];

        if (user) {
            return [...basePages, { "name": "Profile", "path": "/profile", "asset": brand }];
        } else {
            return [...basePages, { "name": "Login", "path": "/login", "asset": collapse }];
        }
    }, [user]);

    // 2. Return the actual UI
    return (
        <div className='w-2xs h-screen sticky top-0'>
            <nav className='w-64 min-w-[256px] h-screen sticky top-0 flex-shrink-0'>
                {/* Header: Branding & Controls */}
                <div className="flex justify-between pr-12 p-8 content-center">
                    <img width='36' src={brand} alt='brand' />
                    <Button className="hover:bg-neutral-300 rounded-md" isIconOnly>
                        <img width='24' src={collapse} alt='collapse' />
                    </Button>
                </div>

                {/* Navigation Links */}
                <div className="flex-grow">
                    {pages.map((page) => {
                        const isActive = location.pathname === page.path;
                        return (
                            <div key={page.path} className={`flex text-xl transition-all border-l-4 ${isActive ? 'border-blue-500 bg-neutral-400' : 'border-transparent bg-neutral-300'}`}>
                                <Button
                                    as={Link}
                                    to={page.path}
                                    className='data-[pressed=true]:scale-100 px-8 justify-start py-8 h-full w-full text-neutral-800'
                                    radius="md">
                                    <img width='24' src={page.asset} alt={page.name} />
                                    {page.name}
                                </Button>
                            </div>
                        );
                    })}
                </div>

                {/* The "Field Radio" */}
                <div className="p-4 mt-auto border-t border-neutral-300 bg-neutral-200/50">
                    <div className="flex items-center gap-2 mb-2 px-1">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">Comms Active</span>
                    </div>
                    <DiscordRadio />
                </div>
            </nav>
        </div>
    );
}