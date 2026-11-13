from extensions.extensions import flask_bcrypt, flask_jwt, limiter
from flask_jwt_extended import JWTManager
from utils.error_message import AppError
from flask import Flask, jsonify
from dotenv import load_dotenv
from datetime import timedelta
from flask_cors import CORS
from db import db

import os

load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

app = Flask(__name__)

#CORS aceita requisicao somente do front CORS_ORINGINS(esta no .env) ou do padrao 5000
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

CORS(
    app,
    #CORS aceita requisição para todas as rotas(/*) de origem "origins"
    resources={r"/*" : {"origins": origins}},
    #CORS aceita requisição para os seguintes methodos
    methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    #CORS aceita que mandem JSON (Content-Type) e TOKEN (Authorization)
    allow_headers=["Content-Type", "Authorization"],
    #CORS nao aceita que mandem cookies
    supports_credentials=False,
    #O navegador guarda a resposta no 10 min, antes de perguntar de novo
    max_age=600,
)

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

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
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
