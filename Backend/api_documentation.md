Team 2: Game Editor API Documentation

Status: Persistence Layer (Phase 4) Complete

/*This document serves as the technical handoff between the Backend and Frontend. */

********* 1. Server Connectivity

Base URL: http://127.0.0.1:5000

CORS: Enabled for all origins (supports Vercel/Localhost).

Security: Talisman is active (force_https=False for local dev).

*********  2. Asset Management

Get Asset Manifest

GET /api/assets

Purpose: Scans backend/assets/ subfolders.

Return: Object where keys are categories and values are filename arrays.

Example Use: manifest.ground.map(img => ...)

******* 3. Grid Operations

Initialize New Grid

GET /api/game/init?game_type=standard

Query Params: game_type (mini = 5x5, standard = 20x20)

Note: Returns a raw 2D array of "empty" cell objects with unique IDs.

******** 4. Persistence (CRUD)

Save Map (Create)

POST /api/game/save

Body: { "name": "string", "grid": [[Object]] }

Success: 201 Created

List Maps (Read All)

GET /api/game/maps

Usage: Returns a list of all saved map metadata.

Response Format:

{
    "status": "success",
    "maps": [
        {
            "id": 1,
            "name": "Level 1",
            "created_at": "Sat, 07 Feb 2026 23:00:00 GMT"
        }
    ]
}


Load Map (Read One)

GET /api/game/load/<int:map_id>

Usage: Fetches the full 2D grid array for the requested ID.

Response Format:

{
    "status": "success",
    "name": "Level 1",
    "grid": [[{ "id": "cell_0_0", "type": "empty", "x": 0, "y": 0 }, ...]]
}


*******Update Map (Overwrite)

PUT /api/game/update/<int:map_id>

Body: { "name": "optional", "grid": [[optional]] }

Purpose: Overwrites the existing record.

*********Delete Map (Remove)

DELETE /api/game/delete/<int:map_id>

Success: 200 OK

****5. Maintenance Operations

Delete All Maps (Global Reset)

DELETE /api/game/delete_all

Purpose: Wipes the entire database table. Use with caution.

Success: Returns count of deleted rows.


Error Handling

The backend will always return JSON on errors:

{   
    "status": "error",
    "message": "Detailed error explanation",
    "error_details": "System trace"
}

