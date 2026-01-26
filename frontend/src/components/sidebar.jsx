import { Button } from "@heroui/react";

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
    <div className='col-span-3'>
      <div className='h-screen bg-neutral-500'>
        <div className='flex py-2 px-4 align-center'>
          <h2 className='content-center text-4xl' color="primary">MyHQ</h2>
        </div>
        <nav>
          {pages.map((page) => (
              <div key={page.id} className='text-lg p-2'>
                <Button className='w-full py-4' color="primary" radius="md">{page.name}</Button>
              </div>
          ))}
        </nav>
      </div>
    </div>
    )
}