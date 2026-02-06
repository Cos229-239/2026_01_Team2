export default function Cell(){
    //accepts cell grid position, selected state, and asset list
    const assets = [];
    

    return (
            {
                assets.map({asset, assetId} => (
                    <div 
                        key={assetId}
                        className='relative'
                        >
                            <img src=""></img>
                    </div>
                    )
                )
                }
            )
        }