from extensions.extensions import flask_bcrypt, flask_jwt, limiter
from flask_jwt_extended import JWTManager
from utils.error_message import AppError
from flask import Flask, jsonify
from datetime import timedelta
from flask_cors import CORS
from db import db

import os


app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)
limiter.init_app(app)
flask_bcrypt.init_app(app)
flask_jwt.init_app(app)

from seed import Tables
from routes.route_authentication import auth_blueprint
from routes.route_category import category_blueprint
from routes.route_orders import orders_blueprint
from routes.route_products import products_blueprint

app.register_blueprint(auth_blueprint)
app.register_blueprint(products_blueprint)
app.register_blueprint(category_blueprint)
app.register_blueprint(orders_blueprint)

app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY") #necessita .env (Exemplo: JWT_SECRET_KEY = "PaoDeQueijo")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes = 15)


jwt = JWTManager(app)

@app.errorhandler(AppError)
def handle_app_error(e):
    return jsonify({"error": e.message}), e.status


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        Tables()
    app.run(debug=True)
