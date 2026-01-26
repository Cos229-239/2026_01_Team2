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
    <div className='w-sm h-screen'>
        <nav className='h-full bg-neutral-200'>
          <div className="flex justify-between p-8 content-center">
              <img width='36' src={brand} alt='brand' />
              <Button className=" hover:bg-neutral-300 rounded-md">
                <img width='24'  src={collapse} alt='collapse' /> {/* TODO: Add Collapsability interaction to the button . Add in hover capability*/}
              </Button>
          </div>
          {pages.map((page) => (
              <div key={page.id} className=' text-xl hover:bg-neutral-300'>
                <Button 
                  className='px-8 justify-start py-8 h-full w-full text-neutral-800' 
                  radius="md">
                    {page.name}
                </Button>
              </div>
          ))}

        </nav>
      </div>
    )
}