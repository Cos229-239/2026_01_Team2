from operator import imatmul
import os
from flask                          import Flask, jsonify, request, send_from_directory
from flask_cors                 import CORS                                     # For cross origin resource sharing with frontend
from flask_sqlalchemy     import SQLAlchemy                        # For database management
from flask_restful              import Api                                        # For api design
from flask_talisman          import Talisman
from sqlalchemy.orm.base import PASSIVE_NO_FETCH
from sqlalchemy.types import Concatenable
from werkzeug.utils import _filename_ascii_strip_re                               #Security extensions

app = Flask(__name__)
# CORS initialization enables Cors for all routes
# This-> allows the <\Vercel frontend\> to communicate with the </Render backend/>
CORS(app)

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

# Database initialization
db = SQLAlchemy(app) 
#db file creation and force placement to bypass need for 'class' 
with app.app_context():
    db.create_all()

#this-> allows class based routing
api = Api(app)                  # RESTful API wrapper Initialization


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
# Insurance: frontend always receives JSON even on a 404 erro message
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
