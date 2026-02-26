import { Button } from "@heroui/react";
import { Link, useLocation } from 'react-router-dom';
import DiscordRadio from './discordRadio'; // Adjusted to match your file naming

// Core Assets
import collapse from '../assets/sidebar-collapse.svg';
import brand from '../assets/brand.svg';
import brush from '../assets/sidebar-Pencil-Brush.svg';
import paper from '../assets/sidebar-Pencil-Paper.svg';

export default function Sidebar() {
    const location = useLocation();

    const pages = [
        {
            "name": "Home",
            "path": "/",
            "asset": brush,
        },
        {
            "name": "Layout",
            "path": "/designer",
            "asset": paper,
        },
        {
            "name": "About",
            "path": "/about",
            "asset": brand,
        }
    ];

    return (
        <div className='w-2xs h-screen sticky top-0'>
            <nav className='h-full bg-neutral-200 flex flex-col'>

                {/* Header: Branding & Controls */}
                <div className="flex justify-between pr-12 p-8 content-center">
                    <img width='36' src={brand} alt='brand' />
                    <Button className="hover:bg-neutral-300 rounded-md" isIconOnly>
                        <img width='24' src={collapse} alt='collapse' />
                    </Button>
                </div>

                {/* Navigation Links: Flexible middle section */}
                <div className="flex-grow">
                    {pages.map((page) => {
                        const isActive = location.pathname === page.path;

                        return (
                            <div key={page.path} className={`flex text-xl transition-colors ${isActive ? 'bg-neutral-400 hover:bg-neutral-500' : 'bg-neutral-300 hover:bg-neutral-200'}`}>
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

                {/* The "Field Radio": Anchored to the bottom */}
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