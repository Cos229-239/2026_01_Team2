import { useEffect, useState } from 'react'
import axios from "axios";


function Designer(){
    const [ gridData, setGridData ] = useState(null);
    const [ error, setError ] = useState(null);

    //example get response from the backend of flask
    const fetchAPI = async () => {
        const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

        try {
            const res = await axios.get(`${API_BASE}/api/game/init`);
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

    return (
        <>
            {error && <div className = "text-warning-600">Error: {error}</div>}
            {!gridData ? (
                <div>Loading...</div>): (
                    <div className='text-neutral-800 p-4'>
                        {gridData.grid.map((row, rowId) => (
                            <div key={rowId} className='flex'>
                                {row.map((cell) =>(
                                    <div key={cell.id} className='p-2 border h-1/20 w-1/20 hover:bg-neutral-400'>
                                        {cell.type}
                                        </div>
                                ))}
                                </div>
                        ))}
                    </div>
                )
            }
        </>
    )
}

export default Designer;
