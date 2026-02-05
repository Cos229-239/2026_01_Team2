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
  const [ activeTool, setActiveTool ] = useState('select');
  const [ brushSize, setBrushSize ] = useState(1);
  const [ toolbarMode, setToolbarMode ] = useState("main");
  const [ selectedCell, setSelectedCell ] = useState(false);


  return (
    <>
      <main className='h-screen w-screen flex-row align-center bg-neutral-100'>
        <div className='flex'> {/*top layer*/}
          <Sidebar onSelect={setPage} selectedPage={currPage} />
          <div className='flex flex-col h-screen w-full p-16 place-content-center'>
              {/* <h1 className='text-2xl'>This React Page is Working</h1> */}
              <PageHeader 
                gameName={gameInfo.gameName} 
                path={GetPath(currPage, gameInfo.path)} 
                />
            <Designer brushSize={brushSize}/>
          </div>
            
            <Toolbar
              toolbarMode = {toolbarMode}
              setToolbarMode = {setToolbarMode}
                />

        </div>
      </main>
    </>
  )
}

export default App
