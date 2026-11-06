from flask import Blueprint, jsonify, request
from services.service_authentication import Service_login_post, Service_register_post
from extensions.extensions import limiter

auth_blueprint = Blueprint("auth", __name__, url_prefix="/auth")


@auth_blueprint.post("/login")
@limiter.limit("30 per minute")
def login_post():
    return jsonify(Service_login_post(request.get_json())), 200


@auth_blueprint.post("/register")
@limiter.limit("30 per minute")
def register_post():
    return jsonify(Service_register_post(request.get_json())), 201
