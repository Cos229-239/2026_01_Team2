import { Button } from "@heroui/react";
// This component is the primary Call To Action. The screen is divided 3:1 where the larger portion is an intro image, 
// and the smaller column is a condense portion of feature descriptions
export default function Hero() {
    return (
        <section className="grid grid-cols-4 gap-8 h-full items-start">
        {/*Main body of the landing page*/}
            <section className="col-span-3 bg-neutral-300 rounded-xl h-96 flex items-center justify-center">
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
            <section>
                {/*Main text area and call to action. Huge start button, signup below that, 1-2 paragraphs below*/}
            </section>
        </section>
    )
}