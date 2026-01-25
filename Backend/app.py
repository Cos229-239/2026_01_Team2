from flask import Flask
app = Flask(__name__)

@app.route('/')
def home():
    return "Team 2 Flask Server is Running!"

if __name__ == '__main__':
    app.run(debug=True)