import { useState, useEffect } from 'react'
import Sidebar from './components/sidebar';
import Designer from './components/designer';
import Toolbar from './components/toolbar';
import PageHeader from './components/pageHeader';
import api from './api';
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
  const [ assetList, setAssetList ] = useState(null)
  const [ saveToBackend, setSaveToBackend ] = useState(false)

  //fetching assets to pass onto children
  const fetchAssets = async() => {
  
  try{
    const res = await api.get(`/assets`);
    console.log("✅ Assets Gathered");
    setAssetList(res.data.assets);
  }
  catch (err) {
    console.error(err);
  }
}

  const initializeAssets = async ()=>{
    const saved = localStorage.getItem('assets');
    if (saved) setAssetList(JSON.parse(saved));
    else await fetchAssets();
  }

  useEffect(()=>{
    initializeAssets();
  }, [])
  
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
              <Designer 
                brushSize={brushSize} 
                toolbarMode={toolbarMode} 
                saveToBackend={saveToBackend}
                setSavetoBackend={setSaveToBackend}
                />
            </div>
          </div>
            
            <Toolbar
              toolbarMode = {toolbarMode}
              setToolbarMode = {setToolbarMode}
              setBrushSize={setBrushSize}
              assetList = {assetList}
              setSaveToBackend={setSaveToBackend}
                />

        </div>
      </main>
    </>
  )
}

export default App
