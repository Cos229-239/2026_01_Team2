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