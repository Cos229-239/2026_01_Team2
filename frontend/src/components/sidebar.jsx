import { Button } from "@heroui/react";
import collapse from '../assets/sidebar-collapse.svg';
import brand from '../assets/brand.svg';

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
        <nav className='h-screen bg-neutral-200'>
          <div className="flex justify-between p-8 content-center">
            <div>
              <img width='32' src={brand} alt='brand' />
            </div>
            <div>
              <img width='24' className='py-1 ' src={collapse} alt='collapse' /> {/* TODO: Add Collapsability interaction to the button . Add in hover capability*/}
            </div>
          </div>
          {pages.map((page) => (
              <div key={page.id} className='text-xl py-1 px-4 hover:bg-neutral-400 rounded-md'>
                <Button className='w-full h-16 text-neutral-800' radius="md">{page.name}</Button>
              </div>
          ))}
        </nav>
      </div>
    )
}