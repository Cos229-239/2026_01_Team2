import { useEffect, useState, useMemo } from 'react'
import axios from "axios";


function Designer({brushSize, selectedCell, setSelectedCell}){
    const [ gridData, setGridData ] = useState(null);
    const [ error, setError ] = useState(null);
    const [hovered, setHovered] = useState(null);
    
    //example get response from the backend of flask
    const fetchAPI = async () => {
        const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

        try {
            // Updated to use dynamic API_BASE
            const res = await axios.get(`${API_BASE}/api/game/init`);
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

    const initializeData = async () =>{
        const saved = localStorage.getItem('grid_save');
        if (saved) setGridData(JSON.parse(saved));
        else await fetchAPI();
    }
    
    //this runs the function based on an action (in this case, the function being run is only run once at the beginning. '[]' would be the action or function being called)
    useEffect (() => {
        initializeData();
        if (gridData) localStorage.setItem('grid_save', JSON.stringify(gridData));
    },[])
    
    
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
        const updateGrid = gridData.grid.map(row =>
            row.map(cell=>{
                if (highlightedIds.has(cell.id)) return {...cell, type: "selected"};
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
            <div className='h-full w-full text-neutral-800 p-1' onMouseLeave={()=>setHovered(null)}>
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
                                    "pt-3 pb-3 text-center text-sm w-full border border-neutral-400 select-none",
                                    isHighlighted && "bg-neutral-300 border-brand-400", 
                                ].join(" ")
                                
                            }


                            >
                                {cell.type}
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
