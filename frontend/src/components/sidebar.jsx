

export default function Sidebar(){
    const pages = [
  {
    "name":"Home",
    "id":0
  },
  {
    "name":"Profile",
    "id":1
  },
  {
    "name":"Designer",
    "id":2
  }
];

    return (
    <div className='static h-screen overflow-auto bg-neutral-500 col-span-3'>
        {pages.map((page) => (
            <div key={page.id} className='text-lg p-5'>
              <button>{page.name}</button>
            </div>
        ))}
    </div>
    )
}