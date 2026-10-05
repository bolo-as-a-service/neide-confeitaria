from main import app, db
from flask import jsonify, request
from services.service_order import *

@app.route("/orders", methods=["POST"])
def orders_post():

    new_order = service_orders_post(request.get_json())
    
    return jsonify(new_order),201


       
@app.route("/orders", methods=["GET"])
def orders_get():
    order = service_orders_get(request.args.get("status"))

    return jsonify(order), 200



@app.route("/orders/<int:id>", methods=["GET"])
def get_order_by_id(id):
    order = service_get_order_by_id(id)

    if not order:
        return jsonify({"error" : "Pedido não encontrado"}), 404   
    
    return jsonify(order), 200

    

@app.route("/orders/customer/<string:name>", methods=["GET"])
def get_orders_by_name(name):

    orders = service_get_orders_by_name(name)

    return orders, 200




@app.route("/orders/<int:id>/advance", methods=["PATCH"])
def orders_advance_patch(id):

    table = service_orders_advance_patch(id)
    
    return jsonify(table),200




@app.route("/orders/<int:id>/status", methods=["PATCH"])
def orders_change_patch(id):

    status = service_orders_change_patch(request.args.get("status"),id)

    if not status:
        return jsonify({"error" : "status não fornecido ou status não encontrado"})
    return jsonify(status),200