import { Button } from "@heroui/react";
import PublicGallery from './publicGallery';

// This component is the primary Call To Action. The screen is divided 3:1 where the larger portion is an intro image, 
// and the smaller column is a condense portion of feature descriptions
export default function Hero() {
    return (
        <div className="flex flex-col gap-16">
            <section className="grid grid-cols-4 gap-8 items-start">

                {/*Main body of the landing page*/}
                <section className="col-span-3 bg-neutral-900 rounded-xl h-96 flex items-center justify-center">
                    {/*Hero image using 75% of page*/}
                    <img /> <p className="text-neutral-500">[Hero Image Placeholder]</p>
                </section>

                <section className="col-span-1">
                    {/*List of key features*/}
                    <ul className="space-y-6">
                        <li>
                            <h1 className="font-bold text-xl text-neutral-800">Build the Future
                            </h1>
                            <p className="text-sm text-neutral-600">One system, any game; Develop your next fortress or factory using our universal design tool.
                            </p>
                        </li>
                        <li>
                            <h2 className="font-bold text-xl text-neutral-800">Iterate on Perfection
                            </h2>
                            <p className="text-sm text-neutral-600">Implement your current designs and test out the next generation of your designs.
                            </p>
                        </li>
                        <li>
                            <h2 className="font-bold text-xl text-neutral-800">Powered by Community
                            </h2>
                            <p className="text-sm text-neutral-600">Share your layouts with others and learn from one another.
                            </p>
                        </li>
                        <li>
                            <h2 className="font-bold text-xl text-neutral-800">Made for Gamers, by Gamers
                            </h2>
                            <p className="text-sm text-neutral-600">MyHQ is designed with gaming community in mind and perfecting strategy in any kind of game!
                            </p>
                        </li>
                    </ul>
                </section>
            </section>


            <section className="flex flex-col items-center py-10 border-y border-neutral-800/50">
                {/*Main text area and call to action. Huge start button, signup below that, 1-2 paragraphs below*/}
                <Button className="bg-blue-600 text-white font-black italic uppercase px-12 h-16 text-xl shadow-[0_0_20px_rgba(37,99,235,0.3)]">Initialize Designer</Button>
            </section>

            <section className="w-full">
                <div className="flex items-center gap-4 mb-6">
                    <div className="h-px flex-grow bg-neutral-800" />
                    <h2 className="text-sm font-black text-neutral-500 uppercase tracking-[0.3em]">Global Archive Access</h2>
                    <div className="h-px flex-grow bg-neutral-800" />
                </div>
                <PublicGallery context="home" />
            </section>
        </div>
    )
}