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


function GetPath(currentPage, path){
  return(
    `${currentPage} / ${path}`
  )
}

function App() {
  const [ currPage, setPage ] = useState("designer");
  // const [ activeTool, setActiveTool ] = useState('select');
  const [ brushSize, setBrushSize ] = useState(1);
  const [ toolbarMode, setToolbarMode ] = useState("main");
  // const [ selectedCell, setSelectedCell ] = useState([]);
  const [ assets, setAssets ] = useState([])


  return (
    <>
      <main className='h-screen w-screen flex-row align-center bg-neutral-100'>
        <div className='flex'> {/*top layer*/}
          <div className='col-span-2'> {/* Will be moved into the child component */}
            <Sidebar onSelect={setPage} selectedPage={currPage} />
          </div>
          <div className='flex flex-col h-screen w-full p-16'>
            <div> {/* keep this within the parent for all contnt */}
              {/* <h1 className='text-2xl'>This React Page is Working</h1> */}
              <PageHeader 
                gameName={gameInfo.gameName} 
                path={GetPath(currPage, gameInfo.path)} 
                />
            <Designer brushSize={ brushSize } setAssets ={ setAssets }/>
            </div>
          </div>
            
            <Toolbar
              toolbarMode = {toolbarMode}
              setToolbarMode = {setToolbarMode}
              setBrushSize={setBrushSize}
                />

        </div>
      </main>
    </>
  )
}

export default App
