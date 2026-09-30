from main import app, db
from models.models_cardapio import *
from flask import jsonify, request



@app.route("/products", methods=['GET'])
def products_get():
    category_id_from_front = request.args.get("categoryId", type=int)
    
    if category_id_from_front :
        products_db = Product.query.filter_by(id_category=category_id_from_front).all()

    else:
        products_db = Product.query.all()

    products_json = []

    for p in products_db:
        products_json.append(p.to_dict())


    return jsonify(products_json)

@app.route("/products", methods=['POST'])
def products_post():
    data = request.get_json()

    new_product = Product(
        name =data.get('name'),
        price =data.get('price'),
        id_category=data.get('categoryId')
        
    )

    db.session.add(new_product)
    db.session.commit()

    return jsonify(new_product.to_dict()), 201


@app.route("/products/<int:id>", methods=['GET'])
def products_by_id_get(id):
    get_product_by_id = Product.query.get(id)

    if not get_product_by_id:
        return jsonify({"error": "Produto não encontrado"})
    return jsonify(get_product_by_id.to_dict())


