import { useState, useEffect } from 'react'
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
    const [currentPage, setPage] = useState("designer");
    const [toolbarMode, setToolbarMode] = useState("main");
    const [brushSize, setBrushSize] = useState(1);
    const [assetList, setAssetList] = useState({});

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const res = await fetch("http://127.0.0.1:5000/api/assets");
                const data = await res.json();
                setAssetList(data.assets);
            } catch (e) {
                console.error("Could not load asset " + e);
            }
        };
        fetchAssets();
    }, []);


  return (
    <>
      <main className='h-screen w-screen flex-row align-center bg-neutral-100'>
        <div className='grid grid-flow-col grid-cols-12 gap-4'> {/*top layer*/}
          <div className='col-span-2'> {/* Will be moved into the child component */}
            <Sidebar />
          </div>

          <div className='col-span-8 flex flex-col p-16 overflow-hidden'>
            <div> {/* keep this within the parent for all contnt */}
            </div>

                      <div className='outline-1 outline-neutral-300 rounded-md overflow-auto'>
                          <PageHeader gameName={gameInfo.gameName} path={`${currentPage} / ${gameInfo.path}`} />

                <Designer brushSize={brushSize} activeTool={toolbarMode} />
            </div>
            </div>
            <div className='col-span-2 flex items-center justify-center bg-neutral-200'>
                <Toolbar toolbarMode={toolbarMode} setToolbarMode={setToolbarMode} setBrushSize={setBrushSize} />
            </div>
        </div>
        {/*<Footer />*/}
      </main>
    </>
  )
}

export default App
