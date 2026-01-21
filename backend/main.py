from flask import Flask, jsonify

app = Flask(__name__)
@app.route("/", methods = ['GET'])
def home():
    return "Team 2 Flask Server is Running!"

if __name__ == '__main__':
    app.run(debug=True, port=8080)