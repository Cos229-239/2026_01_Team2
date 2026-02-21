from nt import error, stat
import os
import json                                                             # Handler for JSON strin conversion for the db
from datetime                       import datetime
from functools                       import wraps

from flask                               import Flask, jsonify, message_flashed, request, send_from_directory, Blueprint
from flask_cors                      import CORS                                     # For cross origin resource sharing with frontend
from flask_sqlalchemy         import SQLAlchemy                        # For database management
from flask_restful                  import Api                                        # For api design
from flask_talisman               import Talisman
from flask_migrate                 import Migrate, current                                 # For db schema version control

# Manages user sesssion states and security
from flask_login import (
    LoginManager,
    UserMixin,
    login_user,
    logout_user,
    login_required,
    current_user
)

# Marshmallow for data validation schemas
from flask_marshmallow      import Marshmallow
from marshmallow                import fields, ValidationError, validate
from sqlalchemy.orm.attributes import ScalarObjectAttributeImpl
from werkzeug.exceptions    import HTTPException
from werkzeug.security import generate_password_hash, check_password_hash            # password ecyption helper

from sqlalchemy import MetaData, text, or_                            #SQLite handler(constraint naming conventions)

# Logging imports for file based error logging (pre production prep)
import logging
from logging.handlers import RotatingFileHandler

#Rate limiter imports to protext auth endpoints from brute force
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

app = Flask(__name__)
# Cntralized environment flags {HTTPS, cookies, audits}
ENV_NAME = (os.environ.get("FLASK_ENV") or os.environ.get("ENV")or "").strip().lower()
IS_PROD = ENV_NAME in {"prod", "production"}

# This-> sets secret key to sign session cookies (Flask Login requirement)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev_secret_key_123')

# Definitions: 
# Safety audit to prvent running with dev default secrets
def production_env_audit():
    # Default secret usage detection
    if IS_PROD and app.config.get("SECRET_KEY") == "dev_secret_key_123":
        raise RuntimeError("SECURITY BLOCK: SECRET_KEY is using the dev fallback in production")

    # Esuring DATABASE_URL is not empty in prduction
    if IS_PROD and not os.environ.get("DATABASE_URL"):
        raise RuntimeError("SECURITY BLOCK: DATABASE_URL must be set in production.")
production_env_audit()

# Cookie security tune for cross site sessions
#       Production requires SameSite=None + Secure for cookies to be sent cross site
#       Development uses Lax and non sesure local host HTTP testing
if IS_PROD:
    app.config.update(
        SESSION_COOKIE_SECURE=True,
        SESSION_COOKIE_SAMESITE="None",
        REMEMBER_COOKIE_SECURE=True,
        REMEMBER_COOKIE_SAMESITE="None",
        )
else:
    app.config.update(
        SESSION_COOKIE_SECURE=False,
        SESSION_COOKIE_SAMESITE="Lax",
        REMEMBER_COOKIE_SECURE=False,
        REMEMBER_COOKIE_SAMESITE="Lax",
        )


# Rotating file logger API errors beyond console ouput
LOG_DIR = os.path.join(os.path.abspath(os.path.dirname(__file__)), "logs")
os.makedirs(LOG_DIR, exist_ok=True)

LOG_FILE = os.path.join(LOG_DIR, "api_errors.log")

file_handler = RotatingFileHandler(LOG_FILE, maxBytes=2_000_000, backupCount=5)
file_handler.setLevel(logging.INFO)

file_handler.setFormatter(logging.Formatter( 
    "%(asctime)s | %(levelname)s | %(name)s | %(message)s"
))
app.logger.addHandler(file_handler)
app.logger.setLevel(logging.INFO)
app.logger.propagate = False


# Naming convention "ValueError: ... " handling
convention = {
    "ix": 'ix_%(column_0_label)s', 
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "cd_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}

metadata = MetaData(naming_convention=convention)

# CORS initialization enables Cors for all routes
# This-> allows the <\Vercel frontend\> to communicate with the </Render backend/>
# allows frontend to send/receive session cookies
CORS(app, supports_credentials=True)

# Talisman sets security headers
# forces default set below
#this-> allows us to keep testing locally on the http://127.0.0.1 ip "addy"
# Talisman with CSP and production HTTPS enforcement
# tightens security posture without losing local HTTP dev
csp = {
    "default-src": [" 'self' "],
    "img-src": [" 'self' ", "data:", "https:"],
    "script-src": [" 'self' "],
    "style-src": [" 'self' ", " 'unsafe-inline' "],
    "connect-src": [" 'self' "],
}
Talisman(
    app,
    force_https=IS_PROD,
    content_security_policy=csp,
    strict_transport_security=IS_PROD,
    session_cookie_secure=IS_PROD,
)

# Global limiter instance (default limits can be tuned per route)
limiter = Limiter(
    key_func=get_remote_address,
    app=app,
    default_limits=[],
)

# --- DATA CONFIG ---
# Logic: Use Render's Database if available, otherwise fallback to local SQLite file
database_url = os.environ.get('DATABASE_URL', 'sqlite:///database.db')

# Fix for Render's Postgres URL format (postgres:// -> postgresql://)
if database_url and database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)

app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Path to the 'assets' folder for this script
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
ASSETS_DIR = os.path.join(BASE_DIR, 'assets')

# MIGRATION BASELINE CHECK logs warning if migration aren't present
MIGRATIONS_DIR = os.path.join(BASE_DIR, "migrations")
if not os.path.isdir(MIGRATIONS_DIR):
    app.logger.warning(
    "MIGRATIONS WARNING: 'migrations/' folder not found. Ensure baseline migrations are committed to VCS "
    "so fresh clones can boostrap schema via 'flask db upgrade'. "
    )

# Database initialization
# passing metadata to SQLAlchemy enforcing the naming convention
db = SQLAlchemy(app, metadata=metadata)
   
# Migrate initialization links app and db to migration
# "render_as...." to support SQLite migration
migrate = Migrate(app, db, render_as_batch=True)

# Initilization of Marshmallow schema handler after db.
ma = Marshmallow(app)

# Initialization of LoginManager to handle user 'session' life cycle
login_manager = LoginManager()
login_manager.init_app(app)

# Connection leaks under load prevention via session cleanup
# Ensures scoped sessions are removed at the end of the app context
@app.teardown_appcontext
def cleanup_db_session(exception=None):
    db.session.remove()

# Initialization of Blueprint for Version 1 API
# All routes attached to 'v1' will automatically get the prefix '/api/v1' when registered
v1 = Blueprint('v1', __name__)

#------ AUTH & MAP SCHEMA ------/
# Defining user class to handle accounts and credentials
# UserMixin to User class to provided required Flask Login properties
class User(db.Model, UserMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    # Establishing 'one to many' relationship. user can own multiple maps
    # This-> allows us to call user.maps to see all their user save levels
    maps = db.relationship('GameMap', backref='owner', lazy=True)

    def __repr__(self):
        return f'<User {self.username}>'

# User Loader function allowing Flask Login to reload the user object from the session ID
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# ------ SAVE/LOAD SCHEMA ------/
# Defining GameMap class to generate table
class GameMap(db.Model):
    __tablename__ = 'game_maps_v2'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    # Text type to store string type JSON grid
    grid_data = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)        # will use user's system time in future for native stamps

    # updated at colum for auditing map chages
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Adding user_id Foreign Key to link each map to user
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True) # Backward compatible

    def __repr__(self):
        return f'<GameMap {self.name}>'

# Validation Schemas 'Marshmallow'
#This-> ensures inputs are valid before reaching database logic with char constraints
class UserSchema(ma.Schema):
    username = fields.String(required=True, validate=validate.Length(max=50))
    password = fields.String(required=True)

class GameMapSchema(ma.Schema):
    name = fields.String(required=True, validate=validate.Length(max=100))
    grid = fields.List(fields.List(fields.Dict()), required=True)       #<--- 2D array validation

#db file creation  ensuring registration of GameMap
# Old version includes 'db.creat_all()'
#with app.app_context():
   # db.create_all()
#'flask db upgrade' from the terminal to manage table creation

#this-> allows class based routing
api = Api(v1)                  # RESTful API wrapper Initialization w/v1 Blueprint without overriding

# Global Error Handler
#This->Captures and unhandled exceptions(500 errors) and returns JSON instead of HTML
@app.errorhandler(Exception)
def handle_exception(e):

    # Passing HTTP errors (ie: 404, 403, etc.) instead of default HTML preserving status codes
    if isinstance(e, HTTPException):
        return (
            jsonify(
                {
                    "status": "error",
                    "message": e.name,
                    "error_details": getattr(e, "description", str(e)),
                }  
            ),
            e.code,
        )
    # Ensuring unexpected exceptions are logged for operational visibility.
    app.logger.exception("Unhandled exception: %s", e)
    return (
        jsonify(
            {
                "status": "error",
                "message": "Internal Server Error",
                "error_details": str(e,)
            }
        ),
        500,
    )


# Secondary error handler hook to ensure exceptions get logged to file
@app.errorhandler(500)
def handle_500(error):
    app.logger.exception("Unhandled 500 error: %s", error)
    return jsonify({ "status": "error", "message": "Internal Server Error" }), 500

# Custom Decorator V2. Hardened owndership decorator
#       - Avoiding AttributeError for anonymous users.
#       - Enforces 401 when a map is owned by requester is not logged in.
#       - Injects the loaded map object to avoid duplicate queries in handlers.
def map_owner_required(f):
    """Decorator to ensure the current user owns the map they are trying to access"""
    @wraps(f)
    def decorated_function(map_id, *args, **kwargs):
        game_map = GameMap.query.get(map_id)
        if not game_map:
            return jsonify({"status": "error", "message": "Map not found"}), 404

        # If map has an owner, requre authentication and ownership
        if game_map.user_id:
            if not current_user.is_authenticated:
                return jsonify({"status": "error", "message": "Authentication required"}), 401
            if game_map.user.id != current_user.id:
                return jsonify({"status": "error", "message": "Unauthorized: You do not own this map"}), 403
 
        kwargs["game_map"] = game_map
        return f(map_id, *args, **kwargs)

    return decorated_function

#------ ACCOUNT AUTHENTICATION ROUTES ------ /
# Signup creation routing to register users and hash passwords
#Changed @app.route -> v1.route and removed '/api' prefix (handled by blueprint)
@v1.route('/auth/signup', methods=["POST"])
def signup():
    """Registers a new user with a hashed password"""
    try:
        data = request.get_json()
        # Using Schema to validate input in lieu of manual 'if's'
        try:
            UserSchema().load(data)
        except ValidationError as err:
            return jsonify({"status": "error", "message": err.messages}), 400

        # Database Check to prevent duplication of usernames
        if User.query.filter_by(username=data["username"]).first():
            return jsonify({"status": "error", "message": "Username already taken"}), 409

        # Password hasing security before database insert
        hashed_pw = generate_password_hash(data['password'])
        new_user = User(username=data['username'], password_hash=hashed_pw)

        db.session.add(new_user)
        db.session.commit()

        return jsonify({"status": "success", "message": "User created sucessfully"}), 201
    except Exception as e:
        db.session.rollback()
        # Global error handler will catch this keeping catch for 'rollback'
        raise e

# Login routing verifies hased credentials and return user context
# Changed @app.route -> v1.route
@v1.route('/auth/login', methods=["POST"])
def login():
    """Verifies user credentials and returns a success status"""
    try: 
        data = request.get_json()
        # Using Schema to validate input
        try:
            UserSchema().load(data)
        except ValidationError as err:
            return jsonify({"status": "error", "message": err.messages}), 400

        user = User.query.filter_by(username=data['username']).first()

        # Verifying password hash against the provided string
        if user and check_password_hash(user.password_hash, data['password']):
            # login_user() creates the session cookie for the browser
            login_user(user, remember=True)

            return (
                jsonify(
                    {
                        "status": "success",
                        "message": "Login successful",
                        "user": {"id": user.id, "username": user.username},
                    }
                ),
                200, 
            )

        return jsonify({"status": "error", "message": "Invalid username or password"}), 401
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# Logout routing to clear the user session cookie
# Changed @app.route -> @v1
@v1.route('/auth/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({"status": "success", "message": "Logged out sucessfully"}), 200

# Session Check routing to let frontend verify if a user is still logged in
# @app.route -> @v1
@v1.route('/auth/session', methods=['GET'])
def check_session():
    if current_user.is_authenticated:
        return jsonify({
            "is_logged_in": True,
            "user": {"id": current_user.id, "username": current_user.username}
            }), 200
    return jsonify({"is_logged_in": False}), 200

#------ ASSET SERVING ROUTES-------/
# Replace "empty" types with actual game assests/rules.
# Assets are now under /api/v1/assets
@v1.route('/assets/<path:filename>')
def serve_assets(filename):
    """Serves files from the assets directory and its subfolder"""
    return send_from_directory(ASSETS_DIR, filename)

@v1.route('/assets')
def get_asset_manifest():
    """Scans subFolders and returns a categorized list of images"""
    manifest = {}
    try:
        if not os.path.exists(ASSETS_DIR):
            return jsonify({"assets": {}, "message": "Assets folder missing"}), 200

        # Iterate through subFolders for category's images
        for category in os.listdir(ASSETS_DIR):
            cat_path = os.path.join(ASSETS_DIR, category)
            if os.path.isdir(cat_path):
                # flitering for image files
                images = [f for f in os.listdir(cat_path) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
                if images:
                    manifest[category] = images
        return jsonify({"assets": manifest})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# ----- Grid Logic----------/
def generate_grid(rows, cols):
    grid = []
    for r in range(rows):
        row_data = []                           #This->creates a new list for the current row
        for c in range(cols):
            row_data.append({
                "x": c,
                "y": r,
                "type": "empty",
                "id": f"cell_{c}_{r}"               #Unique ID for react key
            })
        grid.append(row_data)     #This->Appends each completed row to the grid
    return grid

### INTEGRATION PLANNING
## Test Trigger 'A': http://127.0.0.1:5000/api/v1/game/init?game_type=standard      <expected return is "total_cells": 400>
# Test Trigger 'B': http://127.0.0.1:5000/api/v1/game/init?game_type=mini              <expected return is "total_cells": 25>
# Test: Place a starting piece in the center #####
# Mapping coordinate system logic (Grid)
# Game Selection Triggers
# @app.route -> @v1 applied
@v1.route('/game/init')
def initialize_game():
    #Accessor for game_type from the URL (?gmae_type=)
    #Default to standard if nothing is provided
   
    game_type = request.args.get('game_type', 'standard')
    # Dynamic Generation <= 400 cells
    if game_type == 'mini':
        rows, cols  = 5, 5
        
    elif game_type == 'standard':
        rows, cols  = 20, 20
        
    else:
        # If a pick and not in databased
        return jsonify({"error": "Unknown game type"}), 400
    
    # Helper call for grid gen
    grid_data  = generate_grid(rows, cols)

    return jsonify({
        "selected_game": game_type,
        "grid_size": f"{rows}x{cols}",
        "rows": rows,
        "cols": cols,
        "grid": grid_data,                  #This-> is the 2d array return   
        "status": "ready"
})

# ------- SAVE ENDPOINT------/
# @app.route -> @v1 applied
@v1.route('/game/save', methods=['POST'])

# @login_required commented out for dev save fix
#@login_required                             # Requiring authentication to persist maps enables true owner
def save_game_map():
    """Recieves grid and name from frontend and saves to database as JSON string"""
    try:
        data = request.get_json()

        # Validation: Using strict validation via GameMapSchema
        # Checks for name and grid to prevent empty saves replaces manual check commented out
        try:
            GameMapSchema().load(data)
        except ValidationError as err:
            return jsonify({"status": "error", "message": err.messages}), 400

        map_name = data['name']
        grid_array = data['grid']

        #Serialization: Converting the Py list 'grid' into JSON string for the db
        stringified_grid = json.dumps(grid_array)

        # Creating new database recording
        new_map = GameMap(
            name=map_name, grid_data=stringified_grid
        )
        #------ DEV LOGIC: -------/
        #Using current_user.id if logged in, otherwise default to None.
        # With 'login_required', every saved map is owned
        if current_user.is_authenticated:
#------- New code for development-------- # save fix for dev
            new_map.user_id = current_user.id
        else:
            new_map.user_id = None      # Maps saved now will be Public
#-------- END OF DEV LOGIC----------#
        #new_map.user_id = current_user.id              <-------- Uncomment after dev delete dev logic
        db.session.add(new_map)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": f"Map '{map_name}' saved successfully",
            "map_id": new_map.id
            }), 201
    except Exception as e:                      # <-----This error rollback protection
        db.session.rollback()                      # against db integrity failure
        return jsonify({"status": "error", "message": str(e)}), 500

#------ LOAD ENDPOINTS------#
# Routing to fetch maps specifically owned by the logged in user
# @app.route -> @v1 applied
@v1.route('/game/my-maps', methods=['GET'])
@login_required
def list_user_maps():
    """Returns a list of maps belonging only to the current user"""
    try:
        # Logic: Filter GameMap table by current_user's ID
        # Sorting maps by updated at stamp <Newest First>
        user_maps = (
            GameMap.query.filter_by(user_id=current_user.id)
            .order_by(GameMap.updated_at.desc()).all()
        )
        # Updated at to response
        map_list = [{"id": m.id, "name": m.name, "created_at": m.created_at, "updated_at": m.updated_at} for m in user_maps]
        return jsonify({"status": "success", "maps": map_list})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
  
# Routing Lets the frontend dev create a "Load Menu" by showing all map names in db

# @app.route -> @v1 applied
@v1.route('/game/maps', methods=['GET'])
def list_maps():
    """Returns a list of all saved map names and IDs"""
    # Leakage prevention for owned/private maps:
    #       - Anonymous users see only unowned public maps {user_id == NULL}
    #       - Authenticate users see unowned maps and their own maps
    try:
        if current_user.is_authenticated:
            maps = (
                GameMap.query.filter(or_(GameMap.user_id.is_(None), GameMap.user_id == current_user.id))
                .all()
            )
        else:
            maps = GameMap.query.filter(GameMap.user_id.is_(None)).all()

        map_list = [{"id": m.id, "name": m.name, "created_at": m.create_at} for m in maps]
        return jsonify({"status": "success", "maps": map_list})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

    # Routing to take in specific ID's, find record, converts text back into JSON list for FrontEnd
    # @app.route -> @v1 applied
@v1.route('/game/load/<int:map_id>', methods=['GET'])
# Enforcing ownership on load unowned remains accessible
def load_game_map(map_id, game_map=None):
    """Retrieves a specific map and converts the string grid back to a list"""
    try:
        # Converting string from the db back into a JSON list
        # game_map injected by decorator avoiding duplicate db query
        parsed_grid = json.loads(game_map.grid_data)

        return jsonify(
            {
                "status": "success",
                "name": game_map.name,
                "grid": parsed_grid
            }
        )
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

#------ UPDATE AND DELETE LOGIC------/
# Routing Overwrite/Update
# @app.route -> @v1 applied
@v1.route('/game/update/<int:map_id>', methods=['PUT'])
# authentication requirement + ownership to update
@login_required
@map_owner_required
def update_game_map(map_id, game_map=None):
    """Overwrites an existing map's grid data and name"""
    
    # decorator handles the map lookup and ownership checks automatically
    try:
        data = request.get_json() or {}
        
        #updating fields if provided in request
        if 'name' in data:
            # Length constraint validation for update path
            if len(data["name"]) > 100:
                return jsonify({"status": "error",
                                "message": {"name": ["Longer than maximum length 100."]}}), 400
            game_map.name = data['name']

        if 'grid' in data:
            game_map.grid_data = json.dumps(data['grid'])

        db.session.commit()
        return jsonify({"status": "success", "message": f"{map_id} updated successfully"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500

# Routing Permanet Deletion
# @app.route -> @v1 applied
@v1.route('/game/delete/<int:map_id>', methods=['DELETE'])
@login_required
@map_owner_required
def delete_game_map(map_id, game_map=None):
    """Removes a map from the database permanently"""
    # Refactored with @map_owner_required decorator
    try:
       # game_map injection by decorator to avoid duplicate db queries
        db.session.delete(game_map)
        db.session.commit()
        return jsonify({"status": "success", "message": f"Map {map_id} deleted successfully"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500

# Routing Global Deletion
# @app.route -> @v1 applied
@v1.route('/game/delete_all', methods=['DELETE'])
def delete_all_maps():
    """Wipes the entire game_map table for environment reset"""
    # Accidental production wipe Guardrail
    if IS_PROD:
        return jsonify({"status": "error", "message": " Operation no permitted in production"}), 403
    try:
        # SQLAlchemny mass deletion logic
        num_rows_deleted = db.session.query(GameMap).delete()
        db.session.commit()
        return jsonify({
            "status": "success",
            "message": f"All {num_rows_deleted} maps have been deleted",
            "action": "table_wipe"
            })
    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500

# Home routing for general verification
@app.route('/')
def home():
    return "Team 2 Flask Server is Running!"

# API Dynamic API Endpoint             ---------------------->use: http://127.0.0.1:5000/api/v1/test
# Returns JSON, how we will be communicating with the frontend
# This route will accept both GET (fetching)  and POST (sending/creating)
# @app.route -> @v1 applied
@v1.route('/test' , methods=['GET', 'POST'])
def test_endpoint():
    if request.method == 'POST':
        #This->triggers when Frontend SENDS data
        data = request.get_json() if request.is_json else {"info": "No JSON received"}
        return jsonify({
                "status": "success", 
                "message": "POST request received!", 
                "received_data": data
        }), 201                 # std code for 'Created'
    #This->triggers when you visit the url in the browser
    return jsonify({
        "status": "success", 
        "message": "GET request working! Use POST to send data. ", 
        "phase": 6, 
        "inProgress card": 1
     })

# URL Parameter Research
#This->allows the URL to act as data   using any name after api/game/(name) for example:  http://127.0.0.1:5000/api/v1/game/GTA6
# @app.route -> @v1 applied
@v1.route('/game/<name>')
def get_game_data(name):
    #'name' is the </placeholder/> when dev is there 'name' will be used to look up data in a particular database
    return jsonify({
        "game_name": name, 
        "status": "active",
        "message": f"Fetching logic for {name}..."
        })

# Error Handling
# Insurance: frontend always receives JSON even on a 404 error message
# with anything after http://127.0.0.1:5000 for example: http://127.0.0.1:5000/this_is-notReal
@app.errorhandler(404)
def not_found(error):
    return(
        jsonify(
            {
                "status": "error",
                "message": "Endpoint not found. Check your URL structure.",
                "error_details": str(error),
            }
        ),
        404,
    )
   
# Health check endpoint for Render/monitoring uptime verification
@v1.route('/health', methods=['GET'])
def health_check():
    try:
        # db ping lightweight for efficiency
        db.session.execute(text("SELECT 1"))
        return jsonify({
            "status": "ok",
            "service": "backend",
            "version": "v1",
            "db": "ok"
            }), 200
    except Exception as e:
        app.logger.exception("Health check failed: %s", e)
        return jsonify({
            "status": "degraded",
            "service": "backend",
            "version": "v1",
            "db": "error"
            }), 503

# Logging of non 200's responses including 404's. File for operational visibility
@app.after_request
def log_non_success_responses(response):
    if response.status_code >= 400:
        app.logger.warning(
            "HTTP %s | %s %s | ip=%s",
            response.status_code,
            request.method,
            request.path,
            request.remote_addr
        )
    return response

#Guard against accidental Flask app overwrite by Flask instance integrity assersion
from flask import Flask as _FlaskType
if not isinstance(app, _FlaskType):
    raise RuntimeError("CONFIG ERROR: 'app' is not a Flask instance (possible overwrite).")

# Registering the Blueprint with Application
#THIS-> ensures all routes defined on 'v1' are accessible under the /api/v1/prefix
app.register_blueprint(v1, url_prefix='/api/v1')

# Application of strict limits to auth endpoints for 'brute force'
# Signup: moderate limit
signup = limiter.limit("10 per minute")(signup)
# Login: strict limit
login = limiter.limit("5 per minute")(login)
# Session check: light limit
check_session = limiter.limit("60 per minute")(check_session)

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    # This automatically builds/updates tables on the cloud without needing a shell
      
    app.run(debug=True)