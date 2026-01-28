import { useState, useEffect } from "react"
import {
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
        <div className="h-11/12 w-sm bg-neutral-300 rounded-bl-md rounded-tl-md pt-4 pb-4 place-content-center">
            <div>
                {
                    toolItems.Tools.map(
                        (tool) => (
                            <div id={tool.id} className="text-xl pl-4 p-5 ">{tool.name}</div>
                        )
                    )
                }

            </div>
            
        </div>
    )
}