import { Button } from "@heroui/react";
import collapse from '../assets/sidebar-collapse.svg';
import brand from '../assets/brand.svg';
import brush from '../assets/sidebar-Pencil-Brush.svg';
import paper from '../assets/sidebar-Pencil-Paper.svg';
import { Link, useLocation } from 'react-router-dom';


export default function Sidebar() {
    const location = useLocation();
    const pages = [
  {
    "name":"Home",
    "path": "Home",
    "asset":brush,
  },
  {
    "name":"Layout",
    "path": "Designer",
    "asset":paper,
  },
  {
    "name":"About",
    "path": "About",
    "asset": brand, //placeholder
  }
];

    return (
      
    <div className='w-2xs h-screen'>
        <nav className='h-full bg-neutral-200'>
          <div className="flex justify-between pr-12 p-8 content-center">
              <img width='36' src={brand} alt='brand' />
              <Button className=" hover:bg-neutral-300 rounded-md">
                <img width='24'  src={collapse} alt='collapse' /> {/* TODO: Add Collapsability interaction to the button . Add in hover capability*/}
              </Button>
          </div>
          {pages.map((page) => (
              <div key={page.id} className={
                `flex $(
                  ${selectedPage == page.id} ?
                  'hover:bg-neutral-500 bg-neutral-400':
                  'hover:bg-neutral-300 bg-neutral-300'
                  ) text-xl`} >
                  <Button
                      as={Link}
                      to={page.path} className='data-[pressed=true]:scale-100 px-8 justify-start py-8 h-full w-full text-neutral-800' 
                  radius="md">
                <img width='24' src={page.asset} alt ={page.name} />
                    {page.name}
                </Button>
              </div>
          ))}
        </nav>
      </div>
    )
}