import { useState, useEffect } from "react"
import {
    Button,
    //groupDataFocusVisibleClasses,
    Navbar,
    NavbarContent,
    NavbarItem,
} from "@heroui/react"
import eraser from '../assets/toolbar-eraser-regular.svg'
import pencil from '../assets/toolbar-pencil-regular.svg'
import arrow from '../assets/toolbar-arrow-pointer-regular.svg'
import save from '../assets/toolbar-save-regular.svg'

export default function Toolbar({ toolbarMode, setToolbarMode, setBrushSize, assetList, setSaveToBackend, overwrite, setOverwrite }) {
    const toolItems = {
        "Tools":[
            {"id":0, "name":"Select", "toolName":"select", "asset": arrow},
            // {"id":1, "name":"Move", "toolname":"move"},
            {"id":1, "name":"Pencil", "toolName":"pencil", "asset": pencil},
            // {"id":3, "name":"Bucket", "toolname":"bucket"},
            // {"id":4, "name":"Polygon", "toolname": "polygon"},
            // {"id":5, "name":"Text", "toolname":"text"},
            {"id":2, "name":"Erase", "toolName":"erase", "asset": eraser},
            {"id":3, "name":"Save", "toolName":"save", "asset": save}
        ],
        "Assets":assetList,
        "Select":[
            {"id":0, "name": "1x1", "brushSize": 1 },
            {"id":1, "name": "2x2", "brushSize": 2 },
            {"id":2, "name": "3x3", "brushSize": 3 },
            
        ]

    }
    console.log(toolItems.assets);
    const ASSET_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";
    
    const renderView = (currentView) => {
        switch (currentView) {
            case "select":
                return (
                    <div className="flex flex-col gap-2 p-2">
                        <Button size="sm" title="Select Tool" onClick={() => { setToolbarMode("main") }}>Back</Button>
                        {toolItems.Select.map((tool) => (
                            <Button
                                title={`Brush Size: ${tool.brushSize}`}
                                id={tool.id}
                                className="data-[pressed=true]:scale-100 text-xl h-20 w-full justify-start"
                                onClick={() => setBrushSize(tool.brushSize)}
                            > {tool.brushSize}x{tool.brushSize}
                            </Button>
                        ))}
                    </div>
                );
            case "pencil":
                return (
                    <>
                        <Button size="sm" title="Pencil Tool" className="mb-2 w-full" onClick={() => { setToolbarMode("main") }}>Back</Button>
                        <div className="flex flex-col gap-2 w-full p-2">
                            <span className="text-[10px] font-extrabold text-neutral-600">OVERWRITE</span>
                            <input type="checkbox" className="cursorPointer" checked={overwrite} onChange={(e) => setOverwrite(e.target.checked)} />
                        </div>
                    <div className="flex flex-col gap-4 p-2 max-h-[80vh] overflow-y-auto w-full items-center">
                        {Object.entries(assetList || {}).map(([group, files]) => (
                            <div key={group} className="w-full flex flex-col items-center gap-2">
                                <span className="text-[12px] font-bold uppercase text-neutral-500">{group}</span>
                                    {Array.isArray(files) && files.map((filename) => (
                                        <img
                                            title={filename}
                                            key={`${group}-${filename}`}
                                            src={`${ASSET_BASE_URL}/api/v1/assets/${group}/${filename}`}
                                            alt={filename}
                                            className="w-14 h-14 object-contain cursor-pointer hover:scale-110 transition-transform hover:bg-white rounded border border-2 border-neutral-300 hover:border-brand-500"
                                            onClick={() => {setToolbarMode(`${group}/${filename}`); console.log("Brush changed to: ", `${group}/${filename}`);
                                            }}
                                        />
                                    ))}
                            </div>
                        ))}
                    </div>
                    </>
                );
            case "save":
                setSaveToBackend(true);
                setToolbarMode("main");
                return;
            default: // Main
                return (
                    <div className="flex flex-col gap-2">
                        {toolItems.Tools.map((tool) => {
                            const isActive = toolbarMode === tool.toolName || (tool.toolName === "pencil" && toolbarMode.includes("/"));
                            return (
                                <Button
                                    title="Default Tool"
                                    id={tool.id}
                                    className={`data-[pressed=true]:scale-100 text-xl h-20 w-full justify-start transition-all ${isActive ? "border-l-8 border-brand-600 bg-neutral-300 shadow-inner" : "border-l-0 border-transparent text-neutral-600 hover:bg-neutral-400"}`}
                                    onClick={() => { setToolbarMode(tool.toolName) }}
                                >
                                    <img className="w-10 mr-2" src={tool.asset} alt="" />
                                </Button>
                            );
                        })}
                    </div>
                );
        }
    }

    useEffect(()=>{
        console.log(toolbarMode);
    }, [toolbarMode])

    return (
            <div className={`h-screen bg-neutral-200 transition-all duration-300 border-l border-neutral-300 shadow-xl ${
            toolbarMode === "main" ? "w-20" : "w-72"
        }`}>
            {renderView(toolbarMode)}
        </div>
    )

    }
