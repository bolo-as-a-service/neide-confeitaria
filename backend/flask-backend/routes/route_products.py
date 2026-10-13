from main import app
from services.service_products import Service_products_get,Service_products_post,Service_get_products_by_id,Service_put_products_by_id,Service_delete_product_by_id
from flask import jsonify, request



@app.route("/products", methods=['GET'])
def products_get():

    list_products = Service_products_get(request.args.get("categoryId", type=int))

    return jsonify(list_products),200



@app.route("/products", methods=['POST'])
def products_post():

    new_product = Service_products_post(request.get_json()) 

    return jsonify(new_product), 201



@app.route("/products/<int:id>", methods=['GET'])
def get_products_by_id(id):

    product_by_id = Service_get_products_by_id(id)

    if not product_by_id:
        return jsonify({"error" : "Produto não encontrado"}),404

    return jsonify(product_by_id),200


@app.route(("/products/<int:id>"), methods=['PUT'])
def put_products_by_id(id):

    product_put = Service_put_products_by_id(id, request.get_json())

    return jsonify(product_put),200


@app.route("/products/<int:id>",methods=['DELETE'])
def delete_product_by_id(id):

    deleteConfirmation = Service_delete_product_by_id(id)

    if deleteConfirmation == None:
        return {"Error" : "Produto não encontrado"},404
    return '',204
