

export default function PageHeader({ gameName, path }){
    return(
        <>
            <div className='text-xl text-neutral-400'>
                {path}
            </div>
            <div className='text-3xl text-neutral-500'>
                {gameName}
            </div>
        </>
    )
}