import { useState, useEffect } from "react"
import {
    Button,
    Navbar,
    NavbarContent,
    NavbarItem,
} from "@heroui/react"

export default function Toolbar(){
    const toolItems = {
        "Tools":[
            {"id":0, "name":"Select"},
            {"id":1, "name":"Move"},
            {"id":2, "name":"Pencil"},
            {"id":3, "name":"Bucket"},
            {"id":4, "name":"Polygon"},
            {"id":5, "name":"Text"},
            {"id":6, "name":"Erase"}
        ],
        "Assets":[
            "Structures"
        ],

    }

    return (
        <div className='place-content-center'>
        <div className="h-11/12 w-sm bg-neutral-300 rounded-bl-md rounded-tl-md pt-4 pb-4 place-content-center">
            <div>
                {
                    toolItems.Tools.map(
                        (tool) => (
                            <Button id={tool.id} className="flex text-xl h-20 w-full justify-start pl-10">{tool.name}</Button>
                        )
                    )
                }

            </div>
            
        </div>
        </div>
    )
}