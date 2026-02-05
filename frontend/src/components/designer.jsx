import { useEffect, useState, useMemo } from 'react'
import axios from "axios";


function Designer({brushSize}){
    const [ gridData, setGridData ] = useState(null);
    const [ error, setError ] = useState(null);

    const [hovered, setHovered] = useState(null);

    
    
    
    //example get response from the backend of flask
    const fetchAPI = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/game/init");
            setGridData(res.data);
        } catch (err) {
            setError(err?.message ?? "request failed");
            console.error(err);
        }
    };
    //this runs the function based on an action (in this case, the function being run is only run once at the beginning. '[]' would be the action or function being called)
    useEffect (() => {
        fetchAPI();
    },[])
    
    
    const highlightedIds = useMemo(()=> {
        if (!gridData || !hovered) return new Set();
        const cols = gridData.cols;
        const rows = gridData.grid.length;
        
        const inBounds = ( x, y ) => x >= 0 && y >= 0 && x < cols && y < rows;
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
    

    return(
        <>
        {error && <div className="text-warning-600"> Error: {error}</div>}
        {!gridData ? (
            <div>Loading...</div>
        ): (
            <div className='text-neutral-800 p-1' onMouseLeave={()=>setHovered(null)}>
            {gridData.grid.map((row)=>(
                <div key={`row_${row[0]?.y ?? Math.random()}}`} className='flex'>
                    {row.map((cell) => {
                        const isHighlighted = highlightedIds.has(cell.id);
                        return(
                            <div
                                key = {cell.id}
                                onMouseEnter={()=>setHovered({ x:cell.x, y:cell.y})}
                                onMouseLeave={()=>setHovered(null)}
                                className={[
                                    "p-2  border border-neutral-300 select-none",
                                    isHighlighted? "bg-neutral-300 border-brand-400": "", 
                                ].join(" ")}
                                
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
    // return (
    //     <div className='outline-1 outline-neutral-300 rounded-md overflow-auto'>
    //         {error && <div className = "text-warning-600">Error: {error}</div>}
    //         {!gridData ? (
    //             <div>Loading...</div>) : (
    //                 <div className='text-neutral-800 p-4'>
    //                     {gridData.grid.map((row, rowId) => (
    //                         <div key={rowId} className='flex'>
    //                             {row.map((cell) =>(
    //                                 <div key={cell.id} className='p-2 border h-1/20 w-1/20 hover:bg-neutral-400'>
    //                                     {cell.type}
    //                                     </div>
    //                             ))}
    //                             </div>
    //                     ))}
    //                 </div>
    //             )
    //         }
    //     </div>
    // )
}

export default Designer;