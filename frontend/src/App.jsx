import Sidebar from './components/sidebar';
import Designer from './components/designer';

function App() {



  // console.log(gridData);
  // nothing is returned at the moment but will be populated after gathering the information
  return (
    <>
      <main className='h-screen w-screen flex-row align-center bg-neutral-100'>
        <div className='flex'> {/*top layer*/}
          <div className='col-span-2'> {/* Will be moved into the child component */}
            <Sidebar />
          </div>
          <div className='h-full w-full p-4'>
            <div> {/* keep this within the parent for all contnt */}
              <h1 className='text-2xl'>This React Page is Working</h1>
            </div>
            <div className=''>
              <Designer />
            </div>
          </div>

        </div>
      </main>
    </>
  )
}

export default App
