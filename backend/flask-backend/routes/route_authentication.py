from main import app
from flask import jsonify, request
from services.service_authentication import Service_login_post, Service_register_post
from extensions.extensions import limiter


@app.route("/auth/login", methods=["POST"])
@limiter.limit("30 per minute")
def login_post():

    login,erro = Service_login_post(request.get_json())
    
    if erro:
        return jsonify({"message" : login}), erro 
    
    return jsonify(login), 200
    


@app.route("/auth/register", methods=["POST"])
@limiter.limit("30 per minute")
def register_post():

    new_user, erro = Service_register_post(request.get_json())
    
    if erro:
        return jsonify({"message" : new_user}), erro 
    
    return jsonify(new_user), 201
