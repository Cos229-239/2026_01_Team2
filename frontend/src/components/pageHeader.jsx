

export default function PageHeader({ gameName, path }){
    return(
        <div>
            <div>
                {path}
            </div>
            <div className='text-3xl text-neutral-700'>
                {gameName}
            </div>
        </div>
    )
}