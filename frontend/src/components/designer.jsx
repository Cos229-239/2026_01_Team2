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
    // console.log(response.data);
    };
    //this runs the function based on an action (in this case, the function being run is only run once at the beginning. '[]' would be the action or function being called)
    useEffect (() => {
    fetchAPI();
    },[])
    // console.log(response.data)
    return (
        <div className="outline-1 overflow-hidden outline-neutral-300 rounded-md">
            {error && <div className = "text-warning-600">Error: {error}</div>}
            {!gridData ? (
                <div>Loading...</div>): (
                    <div>{gridData.data.grid_size}</div>
                )
            }
        </div>
    )
}

export default Designer;