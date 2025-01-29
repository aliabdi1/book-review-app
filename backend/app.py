from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///books.db'
db = SQLAlchemy(app)
CORS(app)


@app.route("/")
def home():
    return jsonify({"message": "Welcome to the Book API!"})

if __name__ == '__main__':
    app.run(debug=True)
