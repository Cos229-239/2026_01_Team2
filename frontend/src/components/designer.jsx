import { useEffect, useState, useMemo } from 'react'
import Cell from './cell';
import api from '../api';


function Designer({brushSize, toolbarMode, saveToBackend , setSavetoBackend}){
    const [ gridData, setGridData ] = useState(null);
    const [ error, setError ] = useState(null);
    const [ hovered, setHovered ] = useState(null);
    
    
    //example get response from the backend of flask
    const fetchAPI = async () => {
        try {
            // Updated to use dynamic API_BASE
            const res = await api.get(`/game/init`);
            setGridData(res.data);
            // --- DEMO LOG: SUCCESS ---
            console.log("✅ Designer: Cloud Connection Verified!", res.data);
        } 
        catch (err) {
            const errorMessage = err?.message ?? "request failed";
            setError(errorMessage);
            
            // --- DEMO LOG: ERROR ---
            console.error("❌ Designer: Cloud Connection Failed:", err);
        }
    };

    const initializeData = async () => {
        const saved = localStorage.getItem('grid_save');
        if (saved) {
            const parsedData = JSON.parse(saved);
            setGridData(prev => prev === null ? parsedData : prev);
        }
        else await fetchAPI();
    }

    const saveData = async () => {
    try {
        // Pull the raw string from local storage
        const rawStorage = localStorage.getItem("grid_save");
        
        // Parse it back into a JavaScript object
        const parsedData = rawStorage ? JSON.parse(rawStorage) : null;
        
        // Extract just the grid array to satisfy Flask's Schema
        const gridArray = (parsedData && parsedData.grid) ? parsedData.grid : [];

        const payload = {
            "name": `save ${Date.now()}`, 
            "grid": gridArray
        };

        // Send it to Flask
        await api.post('/game/save', payload);
        
        setSavetoBackend(false);
        console.log("✅ Save successful!");
        
    } catch (err) {        
        console.error("❌ Save failed:", err.response ? err.response.data : err.message);
        setSavetoBackend(false); 
    }
};
    //this runs the function based on an action (in this case, the function being run is only run once at the beginning. '[]' would be the action or function being called)
    useEffect (() => {
        initializeData();
    },[])
    
    useEffect (()=>{
		// This stops React from saving a blank grid on first load
        if (saveToBackend) {
			saveData();
		}
    }, [saveToBackend])
    useEffect(() => {
        if (gridData) localStorage.setItem('grid_save', JSON.stringify(gridData));
    }, [gridData])
    
    const highlightedIds = useMemo(()=> {
        //create a new set if there is no grid data or hovered objects are not detected 
        if (!gridData || !hovered) return new Set();
        
        // restrict bounds of the cell group
        const inBounds = ( x, y ) => x >= 0 && y >= 0 && x < gridData.cols && y < gridData.grid.length;
        //use the id on the client end to determine space
        const cellId = (x, y) => `cell_${x}_${y}`;
        
        
        const { x, y } = hovered;
        const set = new Set();
        if (brushSize == 1){
            if(inBounds(x,y)) set.add(cellId(x,y));

            return set;
        }
        if (brushSize == 2){
            const offsets =[
                [0,0], [1,0],
                [0,1], [1,1],
            ];
            for (const [dx, dy] of offsets){
                const nx = x+dx;
                const ny = y+dy;
                if (inBounds(nx, ny)) set.add(cellId(nx,ny));
            }
            return set;
        }
        if (brushSize == 3){
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const nx = x + dx;
                    const ny = y + dy;
                    if (inBounds(nx, ny)) set.add(cellId(nx, ny));
                }

            }
    
            return set;
        }
        return set;
    }, [gridData, hovered, brushSize]);
    
    const placeTile = () => {
        if (!gridData || !hovered || highlightedIds.size === 0) return;
		
		// Prevents UI tool names from being painted onto the cell, which triggers 404 asset errors.
		if (toolbarMode === "main" || toolbarMode === "select" || toolbarMode === "pencil") return;
		
        const updateGrid = gridData.grid.map(row =>
            row.map(cell=>{
                if (highlightedIds.has(cell.id)) {
                    if (toolbarMode === "erase") return {...cell, type:"empty"};
                    return {...cell, type: toolbarMode};
                }
                return cell;
            })
        );
        setGridData({...gridData, grid: updateGrid});
    }

    return(
        <>
        {error && <div className="text-warning-600"> Error: {error}</div>}
        {!gridData ? (
            <div>Loading...</div>
        ): (
            <div className='h-fit w-fit text-neutral-800 p-1' onMouseLeave={()=>setHovered(null)}>
            {gridData.grid.map((row, rowIndex)=>(
                <div key={rowIndex} className='flex'>
                    {row.map((cell) => {
                        const isHighlighted = highlightedIds.has(cell.id);
                        return(
                            <div
                                key = {cell.id}
                                onMouseEnter={()=>setHovered({ x:cell.x, y:cell.y})}
                                onMouseLeave={()=>setHovered(null)}
                                onMouseDown={placeTile}
                                className={[
                                    "aspect-square w-full border border-neutral-400 select-none flex items-center justify-center overflow-hidden",
                                    isHighlighted && "bg-neutral-300 border-brand-400",
                                ].join(" ")}
                            >
                                <Cell type={cell.type} />
                            </div>
                        );
                    })}
                </div>
            ))}
            </div>
        )}
        </>
    )
}

export default Designer;
