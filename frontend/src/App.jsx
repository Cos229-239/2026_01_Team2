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
import Header from './components/header';
import Footer from './components/footer';
import AuthForm from './components/authForm';
import axios from 'axios';

axios.defaults.withCredentials = true;

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

function AppContent({ assetList, brushSize, toolbarMode, setToolbarMode, setBrushSize, saveToBackend, setSaveToBackend, overwrite, setOverwrite, user, setUser }) {
    const location = useLocation();
    const currentPageName = location.pathname.replace('/', '') || 'designer';

    return (
        <div className='h-screen w-screen flex flex-col overflow-hidden'>

            <Header user={user} setUser={setUser} />

            {/*Navbar*/}
            <div className='flex flex-grow overflow-hidden'>
                <Sidebar />

                {/*Dynamic Page Structure*/}
                <main className='flex flex-col flex-grow p-10 overflow-auto'>
                    <PageHeader
                        gameName={location.pathname === '/designer' ? gameInfo.gameName : currentPageName.charAt(0).toUpperCase() + currentPageName.slice(1)}
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
                                    setSaveToBackend={setSaveToBackend}
                                    overwrite={overwrite}
                                />
                            } />
                            <Route path="/profile" element={<Profile user={user} />}/>
                            <Route path="/login" element={user ? <Navigate to="/designer" /> : <AuthForm setUser={setUser} />} />
                            <Route path="/signup" element={<AuthForm mode="signup" />}/>
                            <Route path="/about" element={<FAQ />} />
                            <Route path="*" element={<div>404: Page Not Found</div>} />
                        </Routes>
                    </div>
                    <Footer />
                </main>

                {location.pathname === '/designer' && (
                    <div className='flex-shrink-0'>
                        <Toolbar
                            user={user}
                            toolbarMode={toolbarMode}
                            setToolbarMode={setToolbarMode}
                            setBrushSize={setBrushSize}
                            assetList={assetList}
                            setSaveToBackend={setSaveToBackend}
                            overwrite={overwrite}
                            setOverwrite={setOverwrite}
                        />
                    </div>
                )}
            </div >
        </div>
    );
}

function App() {
    const [user, setUser] = useState(null);
    const [brushSize, setBrushSize] = useState(1);
    const [toolbarMode, setToolbarMode] = useState("main");
    const [assetList, setAssetList] = useState(() => {
        const saved = localStorage.getItem('assets');
        return saved ? JSON.parse(saved) : null;
    });
    const [saveToBackend, setSaveToBackend] = useState(false);
    const [overwrite, setOverwrite] = useState(true);
    const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

    //fetching assets to pass onto children
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/v1/auth/session`, { withCredentials: true });
                if (res.data.is_logged_in) {
                    setUser(res.data.user);
                }
            } catch (err) {
                console.log("No active session found. " + err);
            }
        };

        const fetchAssets = async () => {
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
        checkAuth();
        if (!assetList) fetchAssets();
    }, []);

    return (
        <Router>
            <AppContent
                user={user}
                setUser={setUser}
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
    );
}

export default App
