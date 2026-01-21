# Importing Flask and JSON creator
from flask import Flask, jsonify
# Importing Cross Origin Requests (CORS) 
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, origins="*") # Setup for all origins currently (TBD for production)


@app.route("/map", methods = ['GET'])
def map():
    # uses flask internal jsonify dictionary transformer
    return jsonify(
        {
            "Map Layout":
                {
                    "Layout Title": "My Layout",
                    "Map Title": "Clash of Clans",
                    "Layers": 1,
                    "Map Data":
                        {
                            "Grid":
                                {
                                    "Layer Name": "Layer 1",
                                    "Grid Tiles": 
                                        {
                                            "Grass":
                                                {
                                                    "building": False,
                                                    "properties": 
                                                        {
                                                            "traversable": True,
                                                            "defense": 0
                                                        },
                                                    "color":
                                                        {
                                                            "hex": "#a6b946"
                                                        },
                                                },
                                             "Town Hall 3":
                                                 {
                                                     "building": True,
                                                     "properties":
                                                         {
                                                             "traversable": False,
                                                             "defense": 10,
                                                         },
                                                     "color":
                                                         {
                                                             "hex":"#ffb735"
                                                         }
                                                         
                                                 }
                                        },
                                    "Grid Data":
                                        {
                                            "occupyingTiles":[0,1], # using grid tiles to look for what tiles are being found NS
                                            "gridArray":
                                                [
                                                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
                                                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
                                                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
                                                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
                                                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
                                                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
                                                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
                                                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
                                                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
                                                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
                                                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
                                                    [0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,],
                                                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
                                                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
                                                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
                                                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
                                                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
                                                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
                                                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
                                                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
                                                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
                                                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
                                                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
                                                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
                                                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
                                                ] # nested array of tiles NS
                                            
                                        }
                                }                        
                        }
                }
        }
    )

if __name__ == '__main__':
    app.run(debug=True, port=8080)