from flask import Blueprint, jsonify, request
from services.service_authentication import Service_login_post, Service_register_post, Service_me_get
from flask_jwt_extended import jwt_required
from extensions.extensions import limiter

auth_blueprint = Blueprint("auth", __name__, url_prefix="/auth")


@auth_blueprint.post("/login")
@limiter.limit("30 per minute")
def login_post():

    token , user = Service_login_post(request.get_json())

    return jsonify({"token" : token, "user" : user}), 200


@auth_blueprint.post("/register")
@limiter.limit("30 per minute")
def register_post():
    return jsonify(Service_register_post(request.get_json())), 201


@auth_blueprint.get("/me")
@limiter.limit("30 per minute")
@jwt_required()
def me_get():

    user = Service_me_get()

    return jsonify({"user" : user}), 200



