import { useState, useEffect } from "react"
import {
    Button,
    Navbar,
    NavbarContent,
    NavbarItem,
} from "@heroui/react"

export default function Toolbar({toolbarMode, setToolbarMode, setBrushSize}){
    const toolItems = {
        "Tools":[
            {"id":0, "name":"Select", "toolName":"select"},
            // {"id":1, "name":"Move", "toolname":"move"},
            {"id":1, "name":"Pencil", "toolname":"pencil"},
            // {"id":3, "name":"Bucket", "toolname":"bucket"},
            // {"id":4, "name":"Polygon", "toolname": "polygon"},
            // {"id":5, "name":"Text", "toolname":"text"},
            // {"id":6, "name":"Erase", "toolname":"erase"}
        ],
        "Assets":[
            "Structures"
        ],
        "Select":[
            {"id":0, "name": "1x1", "brushSize": 1 },
            {"id":1, "name": "2x2", "brushSize": 2 },
            {"id":2, "name": "3x3", "brushSize": 3 },
            
        ]

    }


    const renderView = (currentView) => {
        switch (currentView) {
            case "main":
                return (

                        <div>
                            {
                                toolItems.Tools.map(
                                    (tool) => (
                                        <Button 
                                            id={tool.id} 
                                            className="data-[pressed=true]:scale-100 text-xl h-20 w-full justify-start" 
                                            onClick={()=>{setToolbarMode(tool.toolName)}}
                                            >
                                                {tool.name}
                                        </Button>
                                    )
                                )
                            }

                        </div>

                    )
            case "select":
                return (
                    <div>
                        <Button className="text-lrg" onClick={()=>{setToolbarMode("main")}}>Back</Button>
                    {
                        toolItems.Select.map(
                            (tool) => (
                                <Button 
                                id={tool.id} 
                                className="data-[pressed=true]:scale-100 text-xl h-20 w-full justify-start"
                                onClick={()=>setBrushSize(tool.brushSize)}
                                >
                                        {tool.name}
                                </Button>
                            )
                        )
                    }

                </div>

                )
            case "pencil":
                return (
                    <div>
                        <Button className="text-lrg" onClick={()=>{setToolbarMode("main")}}>Back</Button>
                        {
                            //set the brush size to 1x1
                            //update the toolbar on the toolbar to 
                        }
                    </div>
                )
        }
    }

    useEffect(()=>{
        console.log(toolbarMode);
    }, [setToolbarMode])

    return (
            <div className='place-content-center w-fit'>
            <div className="h-full bg-neutral-300 rounded-bl-md rounded-tl-md pt-4 pb-4 place-content-center">
            {renderView(toolbarMode)}
            </div>
            </div>
    )

    }

{/*

    // return (
    //     <div className='place-content-center'>
    //     <div className="h-fit w-fit bg-neutral-300 rounded-bl-md rounded-tl-md pt-4 pb-4 place-content-center">
            
    //         <div>
    //             {
    //                 toolItems.Tools.map(
    //                     (tool) => (
    //                         <Button id={tool.id} className="data-[pressed=true]:scale-100 text-xl h-20 w-full justify-start">{tool.name}</Button>
    //                     )
    //                 )
    //             }

    //         </div>
            
    //     </div>
    //     </div>
    // )
*/}
