*** RECENT CHANGES (02/19/2026 - Production Polish) ***
- Rate Limiting: Auth endpoints are now protected against brute force. The frontend
 	must handle 429 Too Many Requests status codes.
- Strict Validation: Marshmallow now enforces database constraints (Usernames max 50 chars,     Map names max 100 chars).
- Map Visibility: GET /api/v1/game/maps now dynamically filters map visibility based on login state.
- Health Check: Added /api/v1/health for monitoring system uptime.

1. Server Connectivity
- Base URL: http://127.0.0.1:5000
- Version Prefix: All endpoints begin with /api/v1/...
- CORS: Enabled for all origins (supports Vercel/Localhost).
- Security: Talisman is active. A Content Security Policy (CSP) is active. External assets must be     proxied via the /assets route.
- Cookies Cookie security dynamically adapts. In production,
 	SameSite=None and Secure=True are strictly enforced for cross-site requests.

2. Asset Management
- Assets are served dynamically. Do not hardcode external image URLs.
- Get Asset Manifest
- GET /api/v1/assets
- Purpose: Scans Backend/assets/ subfolders.
- Return: Object where keys are categories and values are filename arrays.
- Example Use: manifest.ground.map(img => ...)
     Fetch Specific Asset
- GET /api/v1/assets/<category>/<filename.png>

3. Grid Operations
Initialize New Grid
- GET /api/v1/game/init?game_type=standard
- Query Params: game_type (mini = 5x5, standard = 20x20)
- Note: Returns a raw 2D array of "empty" cell objects with unique IDs.

4. Persistence (CRUD)
- Save Map (Create)
- POST /api/v1/game/save
- Auth: Requires Login.
- Body: { "name": "string", "grid": [[Object]] }
- Validation name cannot exceed 100 characters. Returns 400
 	if exceeded.
- Success: 201 Created

List Maps (Read All for Load Menu)
- GET /api/v1/game/maps
- Visibility Rules * Anonymous Users: Only see "legacy/public"
 	maps (unowned).
 		- Logged-in Users: See "legacy/public" maps AND their own private maps.
*Response Format:
 	{
 		"status": "success",
 		"maps": [{"id": 1, "name": "Level 1", "created_at": "..."}]
 	}
Load Map (Read One)
- GET /api/v1/game/load/int:map\_id
- Auth: Requires ownership if the map is private.
- Response: Fetches the full 2D grid array for the requested ID.
Update Map (Overwrite)
- PUT /api/v1/game/update/int:map\_id
- Auth: Requires Login AND Ownership.
- Body: { "name": "optional", "grid": [[optional]] }
- Validation: name cannot exceed 100 chars.
Delete Map (Remove)
- DELETE /api/v1/game/delete/int:map\_id
- Auth: Requires Login AND Ownership.
- Success: 200 OK

5. Maintenance & Monitoring
- Health Check
- GET /api/v1/health
- Purpose: Verifies API and Database uptime for hosting platforms (Render/Vercel).
- Response: { "status": "ok", "service": "backend", "db": "ok" }
    Delete All Maps (Global Reset)
- DELETE /api/v1/game/delete_all
- Purpose: Wipes the entire database table.
- Security: Operation is strictly blocked (403 Forbidden) in Production environments.

!*** Be aware *** ! VERSION CONTROL
Load/Save schema has v2 implemented the following will be need when migrated to v2: (minimal v2 implements strategy (fast + safe)
        1. Create v2 = Blueprint("v2", __name__)
        2. Add only new endpoints there:
            - /game/validate-placement
            - (optional) /game/apply-placement </ If you want backend-authoritative updates
        3. Keep save/load routes identical for now (or reuse v1 handlers), but DO NOT CHANGE v1 behavior
        4. Update THIS api_documentation to read:
            - "v2 adds placement validition with brush footprints and rules_config"
            - "v1 remains unchanged/deprecated later"

6. Authentication & Sessions
Signup
- POST /api/v1/auth/signup
- Body: { "username": "...", "password": "..." }
- Validation: username max 50 chars.
- Rate Limit: 10 requests per minute.
Login
- POST /api/v1/auth/login
- Body: { "username": "...", "password": "..." }
- Rate Limit: 5 requests per minute.
Logout
- POST /api/v1/auth/logout
- Auth: Requires login. Clears session cookie.
Session Check
- GET /api/v1/auth/session
- Note: Returns login status and current user object. Call on app mount to sync state.
- Rate Limit: 60 requests per minute.
List My Maps
- GET /api/v1/game/my-maps
- Note: Returns only the maps owned by the logged-in user.

7. Frontend Implementation Requirements (CRITICAL)
AXIOS Configuration
The frontend MUST set the following in all API requests to ensure the session cookie is
transmitted correctly:

 		// Globally in Axios
 		axios.defaults.withCredentials = true;

Cookie Handling
- The Backend issues a HttpOnly session cookie upon login.
- NO manual cookie storage is needed in React. * The browser will handle it automatically
 	as long as withCredentials: true is enabled.

8. Error Handling Reference
The backend will always return JSON on errors (even 404s and 500s).

    {

 		"status": "error",
 		"message": "Detailed error explanation",
 		"error_details": "System trace (if applicable)"
    }


Frontend Action Matrix
Status Code Message Trigger Frontend Requirement

- 400 Bad Request ValidationError Display field error message (e.g., "Name too long").
- 401 Unauthorized Invalid username or password Clear login state, prompt user to retry.
- 403 Forbidden Unauthorized: You don't own map
 		Disable 'Save' button or redirect to Home.

- 404 Not Found Map not found Redirect to the Load Menu / Home screen.
- 409 Conflict Username already taken Highlight username field as invalid in Signup form.
- 429 Too Many Requests Rate limit exceeded Trigger cooldown timer / disable submit buttons for 60s