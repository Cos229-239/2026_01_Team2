import { Accordion, AccordionItem } from "@heroui/react";
// This component uses Accordians
export default function FAQ() {
    const faqWhat = "MyHQ is a gamer strategy tool specially designed to cater to games that rely on grid based logic-- maps, cities, fortresses, dungeons and factories.";
    const faqHow = "By using two input forms, users can set up the core game logic of their favorite games, and then populate a toolbar with a list of grid item options. These two forms enable gamers to design for all of their favorite games!";
    const faqWho = "The concept for MyHQ is by Steve Asphodel. The initial student development team, 'Interacting Humans,' included Nelson Sung, Albert Tagoe, and Dwight Thompson.";
    const faqWhy = "There are a handful of amazing grid designer apps, but they are all single-use. MyHQ Aims to deliver a universal tool for designing in ALL games."
    const future = "In its current state, MyHQ is highly experimental in its development phase. Future features planned include grid layering, more complex form data, automated game schema imports, and smarter data interpretation! More info will become available via Trello as time persists."

    return (
        <section>
            <Accordion>
                <AccordionItem key="1" aria-label="What is MyHQ about?" title="What is MyHQ about?">
                    {faqWhat}
                </AccordionItem>
                <AccordionItem key="2" aria-label="How does MyHQ work?" title="How does MyHQ work?">
                    {faqHow}
                </AccordionItem>
                <AccordionItem key="3" aria-label="Who helped create MyHQ?" title="Who helped create MyHQ?">
                    {faqWho}
                </AccordionItem>
                <AccordionItem key="4" aria-label="What purpose does MyHQ introduce for users?" title="What purpose does MyHQ introduce for users?">
                    {faqWhy}
                </AccordionItem>
                <AccordionItem key="5" aria-label="What does the future look like for MyHQ?" title="What does the future look like for MyHQ?">
                    {future}
                </AccordionItem>
            </Accordion>
        </section>
    )
}