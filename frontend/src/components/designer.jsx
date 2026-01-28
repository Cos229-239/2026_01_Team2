import { useEffect, useState } from 'react'
import axios from "axios";


function Designer(){
    const [ gridData, setGridData ] = useState(null);
    const [ error, setError ] = useState(null);

    //example get response from the backend of flask
    const fetchAPI = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/game/init");
            setGridData(res);
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
        <div className="">
            {error && <div className = "text-warning-600">Error: {error}</div>}
            {!gridData ? (
                <div>Loading...</div>): (
                    <div className='text-neutral-800 p-4'>
                        {
                            gridData.data.cells.map((row, rowIdx)=>(
                                <div id={rowIdx}> {JSON.stringify(row)} </div>
                            )
                            )
                        }
                    </div>
                )
            }
        </div>
    )
}

export default Designer;