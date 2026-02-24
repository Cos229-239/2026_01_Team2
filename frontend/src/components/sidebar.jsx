import { useState } from "react";
import { Button } from "@heroui/react";
import collapse from '../assets/sidebar-collapse.svg';
import brand from '../assets/brand.svg';
import brush from '../assets/sidebar-Pencil-Brush.svg';
import paper from '../assets/sidebar-Pencil-Paper.svg';


export default function Sidebar( { onSelect, selectedPage, collapsed, setCollapsed}){


    const pages = [
  {
    "name":"Home",
    "id":0,
    "asset":brush,
  },
  {
    "name":"Layout",
    "id":1,
    "asset":paper,
  },
  {
    "name":"About",
    "id":2,
    "asset": brand, //placeholder
  }
];

    return (
      
    <div className={[' flex h-full flex-col ', collapsed ? 'w-fit': 'w-2xs']}>
        <nav className={['opacity-100 h-full items-center bg-neutral-200 pt-4']}>
          <div className={['flex justify-center pr-4', collapsed ? 'items-center gap-4': 'items-between']}>
            <div className={['flex hover:bg-neutral-300 rounded-md h-fit']}>
              <button className = 'items-center h-fit w-fit' onClick={()=>setCollapsed(!collapsed)}> {/* should be updated later on */}
                <img className = 'w-12' src={brand} alt='brand' />
              </button>
            </div>
            {
              collapsed &&
                <div className={['flex aspect-square items-center justify-center pt-1']}>
                  <button className=' hover:bg-neutral-300 rounded-md ' onClick={()=>setCollapsed(!collapsed)}>
                    <img className='w-8'src={collapse} alt='collapse' /> {/* TODO: Add Collapsability interaction to the button . Add in hover capability*/}
                  </button>
                </div>
            }
          </div>
          {pages.map((page) => (
              <div key={page.id} className={
                [`flex text-lg`
                ]} >
                <Button 
                  onSelect={ ()=> onSelect(page.name)} className={[
                    'py-8 text-neutral-800 items-center', !collapsed ? 'px-8 justify-center':'px-12 justify-start']} 
                  radius="md">
                <img className= 'shrink-0' width='28' src={page.asset} alt ={page.name} />
                    {collapsed && page.name}
                </Button>
              </div>
          ))}
        </nav>
      </div>
    )
}