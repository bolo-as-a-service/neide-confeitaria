# routes/route_orders.py
from flask import Blueprint, jsonify, request
from services.service_orders import (
    Service_orders_post,
    Service_orders_get,
    Service_get_order_by_id,
    Service_get_orders_by_name,
    Service_orders_advance_patch,
    Service_orders_change_patch,
)
from flask_jwt_extended import jwt_required, get_jwt_identity

orders_blueprint = Blueprint("orders", __name__, url_prefix="/orders")


@orders_blueprint.post("")
def orders_post():
    return jsonify(Service_orders_post(request.get_json())), 201


@orders_blueprint.get("")
@jwt_required()
def orders_get():
    return jsonify(Service_orders_get(request.args.get("status")) or []), 200


@orders_blueprint.get("/<int:id>")
@jwt_required()
def get_order_by_id(id):
    return jsonify(Service_get_order_by_id(id)), 200


@orders_blueprint.get("/customer/<string:name>")
@jwt_required()
def get_orders_by_name(name):
    return jsonify(Service_get_orders_by_name(name)), 200


@orders_blueprint.patch("/<int:id>/advance")
@jwt_required()
def orders_advance_patch(id):
    return jsonify(Service_orders_advance_patch(id)), 200


@orders_blueprint.patch("/<int:id>/status")
@jwt_required()
def orders_change_patch(id):
    return jsonify(Service_orders_change_patch(request.args.get("status"), id)), 200