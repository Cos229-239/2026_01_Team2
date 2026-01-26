import { useEffect } from 'react'
import axios from "axios";
import Sidebar from './components/sidebar';
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    Divider,
    Input
} from "@heroui/react";


function App() {
  //example get response from the backend of flask
  const fetchAPI = async () => {
    const response = await axios.get("http://localhost:5000/map");
    console.log(response.data);
  }
  //this runs the function based on an action (in this case, the function being run is only run once at the beginning. '[]' would be the action or function being called)
  useEffect (() => {
    fetchAPI()
  },[])
  // nothing is returned at the moment but will be populated after gathering the information
  return (
    <>
      <main className='h-screen w-screen flex-row bg-neutral-100'>
        <div className='grid grid-flow-col grid-cols-3 gap-4'> {/*top layer*/}
            <Sidebar />
          <div className='text-center place-content-center'>
              <div className='text-2xl'>This React Page is Working</div>
          </div>
        </div>
      </main>
    </>
  )
}

export default App
