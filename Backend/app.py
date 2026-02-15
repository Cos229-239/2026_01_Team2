import os
import json                                                             # Handler for JSON strin conversion for the db
from datetime                       import datetime
from flask                               import Flask, jsonify, request, send_from_directory
from flask_cors                      import CORS                                     # For cross origin resource sharing with frontend
from flask_sqlalchemy         import SQLAlchemy                        # For database management
from flask_restful                  import Api                                        # For api design
from flask_talisman               import Talisman
from flask_migrate                 import Migrate                                 # For db schema version control
# Manages user sesssion states and security
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
# Marshmallow for data validation schemas
from flask_marshmallow      import Marshmallow
from marshmallow                import fields, ValidationError
from werkzeug.exceptions    import HTTPException

from sqlalchemy import MetaData                                                 #SQLite handler(constraint naming conventions)
from sqlalchemy import exc
from sqlalchemy.orm.base import PASSIVE_NO_FETCH
from sqlalchemy.sql import naming
from sqlalchemy.types import Concatenable
from werkzeug.utils import _filename_ascii_strip_re                                                              #Security extensions
from werkzeug.security import generate_password_hash, check_password_hash            # password ecyption helper

app = Flask(__name__)
# This-> sets secret key to sign session cookies (Flask Login requirement)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev_secret_key_123')

# Definition: Naming convention "ValueError: ... " handling
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
Talisman(app, force_https=False)

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
    __tablename__ = 'game_map'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    # Text type to store string type JSON grid
    grid_data = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)        # will use user's system time in future for native stamps

    # Adding user_id Foreign Key to link each map to user
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True) # Backward compatible

    def __repr__(self):
        return f'<GameMap {self.name}>'

# Validation Schemas 'Marshmallow'
#This-> ensures inputs are valid before reaching database logic
class UserSchema(ma.Schema):
    username = fields.String(required=True)
    password = fields.String(required=True)

class GameMapSchema(ma.Schema):
    name = fields.String(required=True)
    grid = fields.List(fields.List(fields.Dict()), required=True)       #<--- 2D array validation



#db file creation  ensuring registration of GameMap
# Old version includes 'db.creat_all()'
#with app.app_context():
   # db.create_all()
#'flask db upgrade' from the terminal to manage table creation

#this-> allows class based routing
api = Api(app)                  # RESTful API wrapper Initialization

# Global Error Handler
#This->Captures and unhandled exceptions(500 errors) and returns JSON instead of HTML
@app.errorhandler(Exception)
def handle_exception(e):
    # Passing HTTP errors (ie: 404, 403)
    if isinstance(e, HTTPException):
        return e
    # JSON return generic
    return jsonify({
        "status": "error",
        "message": "Internal Server Error",
        "error_details": str(e)
        }), 500

#------ ACCOUNT AUTHENTICATION ROUTES ------ /
# Signup creation routing to register users and hash passwords
@app.route('/api/auth/signup', methods=['POST'])
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
        if User.query.filter_by(username=data['username']).first():
            return jsonify({"status": "error", "message": "Username already taken"}), 409

        # Password hasing security before database insert
        hashed_pw = generate_password_hash(data['password'])
        new_user = User(username=data['username'], password_hash=hashed_pw)

        db.session.add(new_user)
        db.session.commit()

        return jsonify({"status": "sucess", "message": "User created sucessfully"}), 201
    except Exception as e:
        db.session.rollback()
        # Global error handler will catch this keeping catch for 'rollback'
        raise e

# Login routing verifies hased credentials and return user context
@app.route('/api/auth/login', methods=['POST'])
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
            return jsonify({
                "status": "sucess",
                "message": "Login successful",
                "user": {"id": user.id, "username": user.username}
                }), 200

        return jsonify({"status": "error", "message": "Invalid username or password"}), 401
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# Logout routing to clear the user session cookie
@app.route('/api/auth/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({"status": "success", "message": "Logged out sucessfully"}), 200

# Session Check routing to let frontend verify if a user is still logged in
@app.route('/api/auth/session', methods=['GET'])
def check_session():
    if current_user.is_authenticated:
        return jsonify({
            "is_logged_in": True,
            "user": {"id": current_user.id, "username": current_user.username}
            }), 200
    return jsonify({"is_logged_in": False}), 200



#------ ASSET SERVING ROUTES-------/
# Replace "empty" types with actual game assests/rules.
@app.route('/assets/<path:filename>')
def serve_assets(filename):
    """Serves files from the assets directory and its subfolder"""
    return send_from_directory(ASSETS_DIR, filename)

@app.route('/api/assets')
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
## Test Trigger 'A': http://127.0.0.1:5000/api/game/init?game_type=standard      <expected return is "total_cells": 400>
# Test Trigger 'B': http://127.0.0.1:5000/api/game/init?game_type=mini              <expected return is "total_cells": 25>
# Test: Place a starting piece in the center #####
# Mapping coordinate system logic (Grid)
# Game Selection Triggers
@app.route('/api/game/init')
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
@app.route('/api/game/save', methods=['POST'])
def save_game_map():
    """Recieves grid and name from frontend and saves to database as JSON string"""
    try:
        data = request.get_json()

        # Validation: Using strict validation via GameMapSchema
        # Checks for name and grid to prevent empty saves replaces manual check commented out   
        #if not data or 'name' not in data or 'grid' not in data:
          #  return jsonify({"status": "error", "message": "Missing map name or grid data"}), 400
        try:
            GameMapSchema().load(data)
        except ValidationError as err:
            return jsonify({"status": "error", "message": err.messages}), 400

        map_name = data['name']
        grid_array = data["grid"]

        #Serialization: Converting the Py list 'grid' into JSON string for the db
        stringified_grid = json.dumps(grid_array)

        # Creating new database recording
        new_map = GameMap(
            name=map_name, grid_data=stringified_grid
        )

        # Auto assigning the map to the logged in user if a session exist
        if current_user.is_authenticated:
            new_map.user_id = current_user.id

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
# Test above SAVE ENDPOINT pasing JSON via POST request to: http://127.0.0.1:5000/api/game/save


#------ LOAD ENDPOINTS------#

# Routing to fetch maps specifically owned by the logged in user
@app.route('/api/game/my-maps', methods=['GET'])
@login_required
def list_user_maps():
    """Returns a list of maps belonging only to the current user"""
    try:
        # Logic: Filter GameMap table by current_user's ID
        user_maps = GameMap.query.filter_by(user_id=current_user.id).all()
        map_list = [{"id": m.id, "name": m.name, "created_at": m.created_at} for m in user_maps]
        return jsonify({"status": "sucess", "maps": map_list})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
  
# Routing Lets the frontend dev create a "Load Menu" by showing all map names in db
@app.route('/api/game/maps', methods=['GET'])
def list_maps():
    """Returns a list of all saved map names and IDs"""
    try:
        maps = GameMap.query.all()
        map_list = [{"id": m.id, "name": m.name, "created_at": m.created_at} for m in maps] 
        return jsonify({"status": "success", "maps": map_list})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

    # Routing to take in specific ID's, find record, converts text back into JSON list for FrontEnd
@app.route('/api/game/load/<int:map_id>', methods=['GET'])
def load_game_map(map_id):
    """Retrieves a specific map and converts the string grid back to a list"""
    try:
        game_map = GameMap.query.get(map_id)
        if not game_map:
            return jsonify({"status": "error", "message": "Map not found"}), 404

        # Converting string from the db back into a JSON list
        parsed_grid = json.loads(game_map.grid_data)

        return jsonify({
            "status": "success",
            "name": game_map.name,
            "grid": parsed_grid
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

#------ UPDATE AND DELETE LOGIC------/
# Routing Overwrite/Update
@app.route('/api/game/update/<int:map_id>', methods=['PUT'])
def update_game_map(map_id):
    """Overwrites an existing map's grid data and name"""
    try:
        data = request.get_json()
        game_map = GameMap.query.get(map_id)

        if not game_map:
            return jsonify({"status": "error", "message": "Map not found"}), 404

        # Security check condition: only the owner can update the map
        if game_map.user_id and game_map.user_id != current_user.id:
            return jsonify({"status": "error", "message": "Unauthorized"}), 403

        #updating fields if provided in request
        if 'name' in data:
            game_map.name = data['name']
        if 'grid' in data:                                                
            game_map.grid_data = json.dumps(data['grid'])

        db.session.commit()
        return jsonify({"status": "success", "message": f"{map_id} updated successfully"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500

# Routing Permanet Deletion
@app.route('/api/game/delete/<int:map_id>', methods=['DELETE'])
def delete_game_map(map_id):
    """Removes a map from the database permanently"""
    try:
        game_map = GameMap.query.get(map_id)
        if not game_map:
            return jsonify({"status": "error", "message": "Map not found"}), 404

        # Security check condition: only owner can delete the map
        if game_map.user_id and game_map.user_id != current_user.id:
            return jsonify({"status": "error", "message": "Unauthorized"}), 403

        db.session.delete(game_map)
        db.session.commit()
        return jsonify({"status": "success", "message": f"Map {map_id} deleted successfully"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500

# Routing Global Deletion
@app.route('/api/game/delete_all', methods=['DELETE'])
def delete_all_maps():
    """Wipes the entire game_map table for environment reset"""
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

# API Dynamic API Endpoint             ---------------------->use: http://127.0.0.1:5000/api/test
# Returns JSON, how we will be communicating with the frontend
# This route will accept both GET (fetching)  and POST (sending/creating)
@app.route('/api/test' , methods=['GET', 'POST'])
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
#This->allows the URL to act as data   using any name after api/game/(name) for example:  http://127.0.0.1:5000/api/game/GTA6
@app.route('/api/game/<name>')
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
    return jsonify({
        "status": "error", 
        "message": "Endpoint not found. Check your URL structure.", 
        "error_details": str(error)
        }), 404

if __name__ == '__main__':
    app.run(debug=True)