import { useState, useEffect } from 'react'
import Sidebar from './components/sidebar';
import Designer from './components/designer';
import FAQ from './components/faq';
import Toolbar from './components/toolbar';
import PageHeader from './components/pageHeader';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Hero from './components/hero';
import './index.css';

//will be deprecated later on once there is additional games added
const gameInfo = {
    "gameName": "Clash of Clans",
    "path": "Clash Of Clans"
}


function GetPath(currentPage, path) {
    return (
        `${currentPage} / ${path}`
    )
}

function AppContent({ assetList, brushSize, toolbarMode, setToolbarMode, setBrushSize, saveToBackend, setSaveToBackend, overwrite, setOverwrite }) {
    const location = useLocation();
    const currentPageName = location.pathname.replace('/', '') || 'designer';

    return (
        <main className='h-screen w-screen flex bg-neutral-100 overflow-hidden'>
            {/*Navbar*/}
            <div className='flex-shrink-0'>
                <Sidebar />
            </div>

            {/*Dynamic Page Structure*/}
            <div className='flex flex-col flex-grow p-10 overflow-auto'>
                <PageHeader
                    gameName={gameInfo.gameName}
                    path={GetPath(currentPageName, gameInfo.path)}
                />
                <div className="mt-8 flex-grow">
                    <Routes>
                        <Route path="/" element={<Hero />} />
                        <Route path="/designer" element={
                            <Designer
                                brushSize={brushSize}
                                toolbarMode={toolbarMode}
                                saveToBackend={saveToBackend}
                                setSavetoBackend={setSaveToBackend}
                                overwrite={overwrite}
                            />
                        } />
                        <Route path="/about" element={<FAQ />} />
                        <Route path="/login" element={<div>Login Page Coming Soon</div>} />
                        <Route path="*" element={<div>404: Page Not Found</div>} />
                    </Routes>
                </div>
            </div>

            <div className='flex-shrink-0'>
                <Toolbar
                    toolbarMode={toolbarMode}
                    setToolbarMode={setToolbarMode}
                    setBrushSize={setBrushSize}
                    assetList={assetList}
                    setSaveToBackend={setSaveToBackend}
                    overwrite={overwrite}
                    setOverwrite={setOverwrite}
                />
            </div>
    </main >
    );
}

function App() {
    const [brushSize, setBrushSize] = useState(1);
    const [toolbarMode, setToolbarMode] = useState("main");
    const [assetList, setAssetList] = useState(() => {
        const saved = localStorage.getItem('assets');
        return saved ? JSON.parse(saved) : null;
    });
    const [saveToBackend, setSaveToBackend] = useState(false);
    const [overwrite, setOverwrite] = useState(true);

    //fetching assets to pass onto children
    const fetchAssets = async () => {
        const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";
        try {
            const res = await axios.get(`${API_BASE}/api/v1/assets`, { withCredentials: true });
            console.log("Assets Gathered");
            setAssetList(res.data.assets);
            localStorage.setItem('assets', JSON.stringify(res.data.assets));
        }
        catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        const loadData = async () => {
            if (!assetList) await fetchAssets();
        };
        loadData();
    }, []);

    return (
        <Router>
            <AppContent
                assetList={assetList}
                brushSize={brushSize}
                toolbarMode={toolbarMode}
                setToolbarMode={setToolbarMode}
                setBrushSize={setBrushSize}
                saveToBackend={saveToBackend}
                setSaveToBackend={setSaveToBackend}
                overwrite={overwrite}
                setOverwrite={setOverwrite} />
        </Router>
    )
}

export default App
