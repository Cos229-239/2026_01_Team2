Team 2: Game Editor API Documentation

Status: Persistence Layer (Phase 4) Complete

/*This document serves as the technical handoff between the Backend and Frontend. */

******// IMPORTANT CHANGES  02/17/2026 //******
    - All endpoints previously at /api/... are now at /api/v1...
    - Examples are below in document

    NEW ASSET ACCESS IS STRICTLY:
    * Assets are served dynamically *
    - Manifest: GET /api/v1/assets
    - GET /api/v1/assets/category/filename.png
    *** 

********* 1. Server Connectivity

Base URL: http://127.0.0.1:5000

CORS: Enabled for all origins (supports Vercel/Localhost).

Security: Talisman is active (force_https=False for local dev).

*********  2. Asset Management

Get Asset Manifest

GET /api/v1/assets

Purpose: Scans Backend/assets/ subfolders.

Return: Object where keys are categories and values are filename arrays.

Example Use: manifest.ground.map(img => ...)

******* 3. Grid Operations

Initialize New Grid

GET /api/v1/game/init?game_type=standard

Query Params: game_type (mini = 5x5, standard = 20x20)

Note: Returns a raw 2D array of "empty" cell objects with unique IDs.

******** 4. Persistence (CRUD)

Save Map (Create)

POST /api/v1/game/save

Body: { "name": "string", "grid": [[Object]] }

Success: 201 Created

List Maps (Read All)

GET /api/v1/game/maps

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

GET /api/v1/game/load/<int:map_id>

Usage: Fetches the full 2D grid array for the requested ID.

Response Format:

{
    "status": "success",
    "name": "Level 1",
    "grid": [[{ "id": "cell_0_0", "type": "empty", "x": 0, "y": 0 }, ...]]
}


*******Update Map (Overwrite)

PUT /api/v1/game/update/<int:map_id>

Body: { "name": "optional", "grid": [[optional]] }

Purpose: Overwrites the existing record.

*********Delete Map (Remove)

DELETE /api/v1/game/delete/<int:map_id>

Success: 200 OK

****5. Maintenance Operations

Delete All Maps (Global Reset)

DELETE /api/v1/game/delete_all

Purpose: Wipes the entire database table. Use with caution.

Success: Returns count of deleted rows.


******Error Handling *****                      Message:                                    Frontend implement

#400 level errors for Frontend
    - 400 Bad Request                  'ValidationError'          
                                                                        ------------>need: F/E to Display field err message 
                                                                        
    - 401 Unauthorized                'Invalid username or password'
                                                                        ------------>need: F/E to Clear login and prompt to retry 
                                                                        
    - 403 Forbidden                       'Unauthorized: You don't own map'
                                                                        ---------->need F/E to: Disable 'Save' button or redirect 
                                                                        
    - 404 Not Found                       'Map not found'
                                                                        --------->need F/E to: Redirect to the load Menu 

    - 409 Conflict                             'User name already taken' 
                                                                        --------->need F/E to: Highlight username field as invalid    

The backend will always return JSON on errors:

{   
    "status": "error",
    "message": "Detailed error explanation",
    "error_details": "System trace"
}
=================================================================================
AUTHENTICATION & SESSION UPDATES
==================================================================================


1. New Auth Endpoints

Signup:

    POST /api/v1/auth/signup

    Body: { "username": "...", "password": "..." }

Login:

    POST /api/v1/auth/login

    Body: { "username": "...", "password": "..." }

    Note: Starts a secure session.

Logout:

    POST /api/v1/auth/logout
    Note: Requires login. Clears session.

Session Check: 

    GET /api/v1/auth/session
    Note: Returns login status and current user object.

2. User-Specific CRUD

List My Maps:

    GET /api/v1/game/my-maps
    Note: Returns only the maps owned by the logged-in user.

Ownership Security:

    PUT /api/v1/game/update/<id> and DELETE /api/game/delete/<id> now verify the user_id.
    Returns 403 Forbidden if a user attempts to edit a map they do not own.
      
3. Frontend Implementation  Requirement (CRITICAL)
    -Axios Configuration: The frontend MUST set:
             'withCredentials: true
                (globally or in individual requests)
    -Cookie Handling:
            -Backend issues a 'HttpOnly' session cookie upon login. No manual cookie storage is needed in React;
            -The browser will handle it automatically if 'wiithCredentials' is enabled.
    -State Sync: 
            Call: '/api/v1/auth/session'  on app mount to restore the user's logged-in state.

4. Backend Prof of life:
    - Database:
            - 'Backend/instance/database.db'
    - Password Security:
        -All passwords stored as Scrypt hashes.
    - Session verified via CURL:
        - 'Set-Cookie' header
            -Confirmed with live testing
   
CORS Update: The frontend must use:

    withCredentials: true 
    in all API requests to ensure the session cookie is transmitted correctly.

