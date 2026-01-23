from flask                      import Flask, jsonify, request
from flask_cors             import CORS                                     # For cross origin resource sharing with frontend
from flask_sqlalchemy import SQLAlchemy                        # For database management
from flask_restful import Api                                                 # For api design
from flask_talisman import Talisman                                    #Security extensions

app = Flask(__name__)
# CORS initialization enables Cors for all routes
# This-> allows the <\Vercel frontend\> to communicate with the </Render backend/>
CORS(app)

# Talisman sets security headers
# forces default set below
#this-> allows us to keep testing locally on the http://127.0.0.1 ip "addy"
Talisman(app, force_https=False)

# DATA CONFIG:
#Creating local SQLite file name: 'database.db' 
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)                    #database initialization

#this-> allows class based routing
api = Api(app)                  # RESTful API wrapper Initialization

# Bridge point to Phase 7 card: Logic Implementation
# Helper for Phase 7
# replace "empty" types with actual game assests/rules.
def generate_grid(rows, cols):
    grid = []
    for r in range(rows):
        for c in range(cols):
            grid.append({
                "x": c,
                "y": r,
                "type": "empty",
                "id": f"cell_{c}_{r}"            #Unique ID for react key
            })
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
        rows = 5
        cols = 5
    elif game_type == 'standard':
        rows = 20
        cols = 20
    else:
        # If a pick and not in databased
        return jsonify({"error": "Unkonwn game type"}), 400
    
    # Helper call for grid gen
    cells = generate_grid(rows, cols)

    return jsonify({
        "selected_game": game_type,
        "grid_size": f"{rows}x{cols}",
        "total_cells": len(cells),
        "cells": cells,
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