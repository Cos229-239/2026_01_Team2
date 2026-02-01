import { Button } from "@heroui/react";
// This component is the primary Call To Action. The screen is divided 3:1 where the larger portion is an intro image, 
// and the smaller column is a condense portion of feature descriptions
export default function Hero() {
    return (
        <section>
        {/*Main body of the landing page*/}
            <section>
            {/*Hero image using 75% of page*/}
                <image />
            </section>
            <section>
            {/*List of key features*/}
                <ul>
                    <li>
                        <h1>Build the Future
                        </h1>
                        <p>One system, any game; Develop your next fortress or factory using our universal design tool.
                        </p>
                    </li>
                    <li>
                        <h2>Iterate on Perfection
                        </h2>
                        <p>Implement your current designs and test out the next generation of your designs.
                        </p>
                    </li>
                    <li>
                        <h2>Powered by Community
                        </h2>
                        <p>Share your layouts with others and learn from one another.
                        </p>
                    </li>
                    <li>
                        <h2>Made for Gamers, by Gamers
                        </h2>
                        <p>MyHQ is designed with gaming community in mind and perfecting strategy in any kind of game!
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