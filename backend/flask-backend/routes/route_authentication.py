from main import app, db
from models.models_users import *
from flask import jsonify, request
from services.service_authentication import *


@app.route("/auth/login", methods=["POST"])
def login_post():

    login = service_login_post(request.get_json())
    
    if not login:
        return jsonify({"error": "Credencias invalidas"}), 401
    else:
        return jsonify(login), 200



@app.route("/auth/register", methods=["POST"])
def register_post():

    new_user = service_register_post(request.get_json())
    
    return jsonify(new_user),201
