from flask import Blueprint, jsonify
from services.service_category import Service_categorie_get

category_blueprint = Blueprint("categories", __name__, url_prefix="/categories")


@category_blueprint.get("")
def categories_get():
    return jsonify(Service_categorie_get()), 200
