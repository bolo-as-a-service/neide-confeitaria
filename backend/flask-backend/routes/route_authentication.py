from main import app
from flask import jsonify, request
from services.service_authentication import Service_login_post, Service_register_post
from extensions.extensions import limiter


@app.route("/auth/login", methods=["POST"])
@limiter.limit("30 per minute")
def login_post():

    login = Service_login_post(request.get_json())
    
    # Aqui poderiamos fazer uma unica função que chame o Service 
    # e oque ela retorna de texto ja passa direto no return (reposta + erro)
    # ae aqui a gente pode retorna uma unica vez
    
    # response , erro = Service_login_post(request.get_json())
    #if erro:
    #    return jsonify({"message": erro}), 400
    #else:
    #    return jsonify(response), 201
    

    if login == "email_password_wrong":
        return jsonify({"error": "Email ou senha invalidos"}), 401

    if login == "phone_password_wrong":
        return jsonify({"error": "Telefone ou senha invalidos"}), 401

    if login == "empty_label":
        return jsonify({"error": "Não podem haver campos vazios ou invalidos"}), 409
    
    if login == "password_has_spaces":
            return jsonify({"error": "A senha não pode conter espaços"}), 400

    return jsonify(login), 200


@app.route("/auth/register", methods=["POST"])
@limiter.limit("30 per minute")
def register_post():

    new_user = Service_register_post(request.get_json())

    if new_user == "email_already_exists":
        return (
            jsonify({"error": "Já existe uma conta registrada com este e-mail. "}),
            409,
        )

    if new_user == "phone_already_exists":
        return (
            jsonify({"error": "Já existe uma conta registrada com este telefone. "}),
            409,
        )

    if new_user == "password_so_long":
        return jsonify({"error": "A senha deve ter no maximo 30 caracteres"}), 409

    if new_user == "password_so_short":
        return jsonify({"error": "A senha deve ter no minimo 6 caracteres"}), 409

    if new_user == "password_has_spaces":
        return jsonify({"error": "A senha não pode conter espaços"}), 400

    if new_user == "empty_label":
        return jsonify({"error": "Não podem haver campos vazios"}), 409

    return jsonify(new_user), 201
