

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
    <div className='h-screen overflow-auto bg-neutral-500'>
      <div className='flex justify-between py-2 px-4'>
        <h2 className='text-4xl text-neutral-800'>MyHQ</h2>
        <div className='rounded-md p-4 bg-neutral-400 hover:bg-neutral-200'>Close</div>
      </div>
        {pages.map((page) => (
            <div key={page.id} className='text-neutral-800 text-lg p-5 hover:bg-neutral-400 hover:text-neutral-600'>
              <button>{page.name}</button>
            </div>
        ))}
    </div>
    )
}