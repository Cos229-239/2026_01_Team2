import { useState } from 'react'
import Sidebar from './components/sidebar';
import Designer from './components/designer';
import Toolbar from './components/toolbar';
import PageHeader from './components/pageHeader';

//will be deprecated later on once there is additional games added
const gameInfo = {
  "gameName":"Clash of Clans",
  "path": "Clash Of Clans"
}


function GetPath({currentPage, path}){
  return(
    `${currentPage} / ${path}`
  )
}

function App() {
  const [ currentPage, setPage ] = useState("designer");


  return (
    <>
      <main className='h-screen w-screen flex-row align-center bg-neutral-100'>
        <div className='grid grid-flow-col grid-cols-12 gap-4'> {/*top layer*/}
          <div className='col-span-2'> {/* Will be moved into the child component */}
            <Sidebar />
          </div>
          <div className='flex col-span-10 row-span-1'>
            <div className='w-full'> {/* keep this within the parent for all contnt */}
              <h1 className='text-2xl'>This React Page is Working</h1>
            </div>
          </div>
        </div>
        {/*<Footer />*/}
      </main>
    </>
  )
}

export default App
