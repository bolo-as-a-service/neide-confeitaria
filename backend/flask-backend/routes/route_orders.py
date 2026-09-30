from main import app, db
from datetime import datetime
from models.models_cardapio import *
from models.models_orders import *
from flask import jsonify, request

@app.route("/orders", methods=["POST"])
def orders_post():
    data = request.get_json()

    delivery_date = None
    if data.get("deliveryDateTime"):
        try:
            delivery_date = datetime.fromisoformat(data.get("deliveryDateTime").replace("Z", "+00:00"))
        except ValueError:
            pass


    new_order = Orders(
        customer_name = data.get("customerName"),
        customer_phone = data.get("phone"),
        delivery = data.get("delivery"),

        address = data.get("address"),
        latitude = data.get("latitude"),
        longitude = data.get("longitude"),

        observation = data.get("observation"),
        deliveryDateTime = delivery_date
    )

    items_list = data.get("items", [])
    
    
    for i in items_list:
        product_id = i.get("productId")
        product = Product.query.get(product_id)


        new_itens = Items(
            quantity = i.get("quantity"),
            observation = i.get("observation"),
            id_product = product.id_product,
            unit_price = product.price
        )

        new_order.items.append(new_itens)

    db.session.add(new_order)
    db.session.commit()
    return jsonify(new_order.to_dict()),201


       
@app.route("/orders", methods=["GET"])
def orders_get():
    front_status = request.args.get("status")

    if front_status:
        orders = Orders.query.filter_by(status=front_status).all()
    else:
        orders = Orders.query.all()

    return jsonify([o.to_dict() for o in orders]), 200



@app.route("/orders/<int:id>", methods=["GET"])
def orders_get_by_id(id):
    by_id = Orders.query.get(id)

    if not by_id:
        return jsonify({"error" : "Pedido não encontrado"}), 404
    else:
        return jsonify(by_id.to_dict()), 200

    

@app.route("/orders/customer/<string:name>", methods=["GET"])
def orders_get_by_name(name):
    orders = Orders.query.filter(Orders.customer_name.ilike(f"%{name}%")).all()

    if not orders:
            return jsonify([]), 200
    else:
        return jsonify([o.to_dict() for o in orders]), 200



@app.route("/orders/<int:id>/advance", methods=["PATCH"])
def orders_advance_patch(id):

    table = Orders.query.get_or_404(id)

    if table.status == "PENDING":
        table.status = "PREPARING"
    
    elif table.status == "PREPARING":
        table.status = "COMPLETED"
            
    elif table.status == "COMPLETED":
        table.status = "DELIVERING"

    db.session.commit()
    return jsonify(table.to_dict()),200

@app.route("/orders/<int:id>/status", methods=["PATCH"])
def orders_change_patch(id):

    front_status = request.args.get("status")

    if not front_status:
        return jsonify({"error": "Status não fornecido"}), 400
    
    table = Orders.query.get_or_404(id)
    
    table.status = front_status

    db.session.commit()
    return jsonify(table.to_dict()),200