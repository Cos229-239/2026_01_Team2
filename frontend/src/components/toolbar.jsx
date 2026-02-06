import { useState, useEffect } from "react"
import { Button } from "@heroui/react"

export default function Toolbar({ toolbarMode, setToolbarMode, setBrushSize }) {
    const toolItems = {
        "Tools": [
            { "id": 0, "name": "Select", "view": "select" }, // Changed toolname to 'view' for clarity
            { "id": 1, "name": "Move", "view": "move" },
            { "id": 2, "name": "Pencil", "view": "pencil" },
            { "id": 3, "name": "Bucket", "view": "bucket" },
            { "id": 4, "name": "Polygon", "view": "polygon" },
            { "id": 5, "name": "Text", "view": "text" },
            { "id": 6, "name": "Erase", "view": "erase" }
        ],
        "Select": [
            { "id": 0, "name": "1x1", "brushSize": 1 },
            { "id": 1, "name": "2x2", "brushSize": 2 },
            { "id": 2, "name": "3x3", "brushSize": 3 }
        ]
    };

    const renderView = (currentView) => {
        // If we are in 'main' or any tool other than 'select', show the main tool list
        if (currentView === "main" || !toolItems[currentView.charAt(0).toUpperCase() + currentView.slice(1)]) {
            return (
                <div className="flex flex-col gap-2">
                    {toolItems.Tools.map((tool) => (
                        <Button
                            key={tool.id}
                            className="text-xl h-20 w-full justify-start bg-neutral-200 hover:bg-neutral-400"
                            onClick={() => setToolbarMode(tool.view)}
                        >
                            {tool.name}
                        </Button>
                    ))}
                </div>
            );
        }

        // If we clicked 'Select', show the brush sizes
        if (currentView === "select") {
            return (
                <div className="flex flex-col gap-2">
                    <Button
                        color="primary"
                        variant="flat"
                        onClick={() => setToolbarMode("main")}
                    >
                        ← Back to Tools
                    </Button>
                    {toolItems.Select.map((item) => (
                        <Button
                            key={item.id}
                            className="text-xl h-16 w-full"
                            onClick={() => setBrushSize(item.brushSize)}
                        >
                            {item.name} Brush
                        </Button>
                    ))}
                </div>
            );
        }
    };

    return (
        <div className='place-content-center w-full px-2'>
            <div className="h-fit bg-neutral-300 rounded-md p-4 shadow-lg">
                <h3 className="text-center font-bold mb-2 uppercase text-xs text-neutral-600">
                    Mode: {toolbarMode}
                </h3>
                {renderView(toolbarMode)}
            </div>
        </div>
    );
}