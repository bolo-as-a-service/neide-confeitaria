from main import app, db
from models.models_users import *
from flask import jsonify, request
from services.service_authentication import *


@app.route("/auth/login", methods=["POST"])
def login_post():

    login = service_login_post(request.get_json())
    
    if login == "email_password_wrong":
        return jsonify({"error": "Email ou senha invalidos"}), 401
    
    if login == "phone_password_wrong":
        return jsonify({"error": "Telefone ou senha invalidos"}), 401
    
    return jsonify(login), 200



@app.route("/auth/register", methods=["POST"])
def register_post():

    new_user = service_register_post(request.get_json())

    if new_user == "email_already_exists":
        return jsonify({"error" : "Já existe uma conta registrada com este e-mail. "}), 409
    
    if new_user == "phone_already_exists":
        return jsonify({"error" : "Já existe uma conta registrada com este telefone. "}), 409

    if new_user == "password_so_long":
        return jsonify({"error" : "A senha deve ter no maximo 30 caracteres"}), 409

    if new_user == "password_so_short":
        return jsonify({"error" : "A senha deve ter no minimo 6 caracteres"}), 409
    return jsonify(new_user),201
