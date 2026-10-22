from main import app
from flask import jsonify, request
from services.service_authentication import Service_login_post, Service_register_post
from extensions.extensions import limiter


@app.route("/auth/login", methods=["POST"])
@limiter.limit("30 per minute")
def login_post():

    message_login,status_error = Service_login_post(request.get_json())
    
    if status_error:
        return jsonify({"error" : message_login}), status_error
    
    return jsonify(message_login), 200
    


@app.route("/auth/register", methods=["POST"])
@limiter.limit("30 per minute")
def register_post():

    message_new_user, status_error = Service_register_post(request.get_json())
    
    if status_error:
        return jsonify({"error" : message_new_user}), status_error
    
    return jsonify(message_new_user), 201
