import { useEffect } from 'react'
import axios from "axios";
import Sidebar from './components/sidebar';


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
      <main className='h-screen w-screen flex-row align-center bg-neutral-100'>
        <div className='grid grid-flow-col grid-cols-12 gap-4'> {/*top layer*/}
          <div className='col-span-2'> {/* Will be moved into the child component */}
            <Sidebar />
          </div>
          <div className='flex col-span-10 row-span-1'>
            <div className='w-full'> {/* keep this within the parent for all contnt */}
              <h1 className='text-2xl'>This React Page is Working</h1>
            </div>
          </div>

        </div>
      </main>
    </>
  )
}

export default App
