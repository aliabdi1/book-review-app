from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS


app = Flask(__name__)
import os

basedir = os.path.abspath(os.path.dirname(__file__))
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(basedir, "instance", "books.db")

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)
CORS(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False, unique=True)
    email = db.Column(db.String(120), nullable=False, unique=True)
    password_hash = db.Column(db.String(255), nullable=False)
    reviews = db.relationship("Review", backref="user", lazy=True)
    favorite_books = db.relationship("UserBook", backref="user", lazy=True)

class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    author = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    reviews = db.relationship('Review', backref='book', lazy=True)

class UserBook(db.Model):  # Many-to-Many between User & Books
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey("book.id"), nullable=False)
    status = db.Column(db.String(50), nullable=False)
    
class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    rating = db.Column(db.Integer, nullable=False)  # Rating from 1 to 5
    content = db.Column(db.Text, nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

# ✅ User CRUD
@app.route("/users", methods=["POST"])
def create_user():
    data = request.json
    new_user = User(username=data["username"], email=data["email"], password_hash=data["password"])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User created!"}), 201

@app.route("/users", methods=["GET"])
def get_users():
    users = User.query.all()
    return jsonify([{"id": u.id, "username": u.username} for u in users])

# ✅ UserBook CRUD (many-to-many)
@app.route("/userbooks", methods=["POST"])
def add_userbook():
    data = request.json
    new_entry = UserBook(
        user_id=data["user_id"],
        book_id=data["book_id"],
        status=data["status"]  # e.g., "read", "want-to-read"
    )
    db.session.add(new_entry)
    db.session.commit()
    return jsonify({"message": "Book added to user!"}), 201

@app.route("/", methods=["GET"])
def Home():
    return jsonify({"message": "Welcome to the Book Review API!"})

# ✅ Route to get all books
@app.route("/books", methods=["GET"])
def get_books():
    books = Book.query.all()
    return jsonify([{"id": book.id, "title": book.title, "author": book.author, "description": book.description} for book in books])

# ✅ Route to get a specific book by ID
@app.route("/books/<int:id>", methods=["GET"])
def get_book_by_id(id):
    book = Book.query.get(id)
    if not book:
        return jsonify({"error": "Book not found"}), 404
    return jsonify({"id": book.id, "title": book.title, "author": book.author, "description": book.description})

# ✅ Route to get reviews for a specific book
@app.route("/reviews/<int:book_id>", methods=["GET"])
def get_reviews(book_id):
    reviews = Review.query.filter_by(book_id=book_id).all()
 
    return jsonify([{"id": review.id, "rating": review.rating, "content": review.content} for review in reviews])

@app.route("/books", methods=["POST"])
def add_book():
    data = request.json
    if not data.get("title") or not data.get("author") or not data.get("description"):
        return jsonify({"error": "Missing fields"}), 400

    new_book = Book(title=data["title"], author=data["author"], description=data["description"])
    db.session.add(new_book)
    db.session.commit()
    return jsonify({"message": "Book added successfully!"}), 201


@app.route("/books/<int:id>", methods=["PUT"])
def update_book(id):
    data = request.json
    book = Book.query.get(id)
    if not book:
        return jsonify({"error": "Book not found"}), 404
    book.title = data["title"]
    book.author = data["author"]
    book.description = data["description"]
    db.session.commit()
    return jsonify({"message": "Book updated successfully!"})

@app.route("/books/<int:id>", methods=["DELETE"])
def delete_book(id):
    book = Book.query.get(id)
    if not book:
        return jsonify({"error": "Book not found"}), 404

    db.session.delete(book)
    db.session.commit()
    return jsonify({"message": "Book deleted successfully!"}), 200

# ✅ Route to add a review
@app.route("/reviews", methods=["POST"])
def add_review():
    data = request.json
    user_id = get_jwt_identity()  # Assuming you're using Flask-JWT-Extended
    new_review = Review(content=data["content"], rating=data["rating"], book_id=data["book_id"])
    db.session.add(new_review)
    db.session.commit()  # ✅ FIXED: Added missing commit
    return jsonify({"message": "Review added successfully!"})

@app.route("/register", methods=["POST"])
def register():
    data = request.json
    hashed_password = bcrypt.generate_password_hash(data["password"]).decode("utf-8")
    new_user = User(username=data["username"], email=data["email"], password_hash=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User registered successfully!"}), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    user = User.query.filter_by(email=data["email"]).first()
    if user and bcrypt.check_password_hash(user.password_hash, data["password"]):
        access_token = create_access_token(identity=user.id)
        return jsonify({"access_token": access_token, "message": "Login successful!"})
    return jsonify({"error": "Invalid credentials"}), 401


if __name__ == "__main__":
    app.run(debug=True, port=5002)
