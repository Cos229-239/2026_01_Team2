import { useState } from 'react';
const pages = [
{
"name":"Home",
"id":0,
"href":"/"
},
{
"name":"Profile",
"id":1,
"href":"/profile"
},
{
"name":"Designer",
"id":2,
"href":"/designer"
}
];

export default function Sidebar(){
  const [toggleSidebar , setToggleSidebar] = useState(false);
  
  const toggleNav = ()=>{
    setToggleSidebar(!toggleSidebar)
  }

    return (
    <div className='h-screen bg-neutral-500'>
      <div className={`${toggleSidebar? '': 'justify-between'} flex py-2 px-4 align-center`}>
        <h2 className={`content-center ${toggleSidebar?'text-2xl p-2':'text-4xl'} text-neutral-800`}>MyHQ</h2>
        <div className='rounded-md p-4 bg-neutral-400 hover:bg-neutral-200 hover:cursor-pointer' onClick={toggleNav}>{toggleSidebar? "Open": "Close"}</div>
      </div>
      <nav>
        {pages.map((page) => (
            <div key={page.id} href={page.href} className={`${toggleSidebar ? 'hidden': ''} text-neutral-800 text-lg p-5 hover:bg-neutral-400 hover:text-neutral-600`}>
              <button>{page.name}</button>
            </div>
        ))}
      </nav>
    </div>
    )
}