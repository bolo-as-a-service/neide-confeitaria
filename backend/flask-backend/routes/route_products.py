# routes/route_products.py
from flask import Blueprint, jsonify, request
from services.service_products import (
    Service_products_get,
    Service_products_post,
    Service_get_products_by_id,
    Service_put_products_by_id,
    Service_delete_product_by_id,
)

products_blueprint = Blueprint("products", __name__, url_prefix="/products")


@products_blueprint.get("")
def products_get():
    products = Service_products_get(request.args.get("categoryId", type=int))
    return jsonify(products), 200


@products_blueprint.post("")
def products_post():
    return jsonify(Service_products_post(request.get_json())), 201


@products_blueprint.get("/<int:id>")
def get_products_by_id(id):
    return jsonify(Service_get_products_by_id(id)), 200


@products_blueprint.put("/<int:id>")
def put_products_by_id(id):
    return jsonify(Service_put_products_by_id(id, request.get_json())), 200


@products_blueprint.delete("/<int:id>")
def delete_product_by_id(id):
    Service_delete_product_by_id(id)
    return "", 204