from main import app, db
from models.models_product import *
from services.service_products import *
from flask import jsonify, request



@app.route("/products", methods=['GET'])
def products_get():

    list_products = service_products_get(request.args.get("categoryId", type=int))

    return jsonify(list_products),200



@app.route("/products", methods=['POST'])
def products_post():

    new_product = service_products_post(request.get_json()) 

    return jsonify(new_product), 201



@app.route("/products/<int:id>", methods=['GET'])
def get_products_by_id(id):

    product_by_id = service_get_products_by_id(id)

    if not product_by_id:
        return jsonify({"error" : "Produto não encontrado"}),404

    return jsonify(product_by_id),200


