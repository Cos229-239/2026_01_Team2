import { useState } from 'react';
import { Button } from "@heroui/react";
// This component provides the primary means of navigation. On mobile this component is concealed via a Hamburger Menu.

const pages = [
    {
        "name": "Home",
        "id": 0
    },
    {
        "name": "Tool",
        "id": 1
    },
    {
        "name": "About",
        "id": 2
    }
];
export default function Sidebar() {
        const [toggleSidebar, setToggleSidebar] = useState(false);

        const toggleNav = () => {
            setToggleSidebar(!toggleSidebar);
        }

        return (
            <div className='h-screen bg-neutral-500'>
                <div className={`${toggleSidebar ? '' : 'justify-between'} flex py-2 px-4 align-center`}>
                    <h2 className={`content-center ${toggleSidebar ? 'text-2xl p-2' : 'text-4xl'} text-neutral-800`}>MyHQ</h2>
                    <div className='rounded-md p-4 bg-neutral-400 hover:bg-neutral-200 hover:cursor-pointer' onClick={toggleNav}>{toggleSidebar ? "Open" : "Close"}</div>
                </div>
                <nav>
                    {pages.map((page) => (
                        <div key={page.id} className='text-lg p-5'>
                            <Button class="bg-primary " color="primary" radius="md">{page.name}</Button>
                        </div>
                    ))}
                </nav>
            </div>
        );
    }