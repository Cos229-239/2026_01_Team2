import { Button } from "@heroui/react";
// This component provides the primary means of navigation. On mobile this component is concealed via a Hamburger Menu.

export default function Sidebar(){
    const pages = [
  {
    "name":"Home",
    "id":0
  },
  {
    "name":"Tool",
    "id":1
  },
  {
    "name":"About",
    "id":2
  }
];

    return (
    <div className='static h-screen overflow-auto bg-neutral-500 col-span-3'>
        {pages.map((page) => (
            <div key={page.id} className='text-lg p-5'>
              <Button class="bg-primary " color="primary" radius="md">{page.name}</Button>
            </div>
        ))}
    </div>
    )
}