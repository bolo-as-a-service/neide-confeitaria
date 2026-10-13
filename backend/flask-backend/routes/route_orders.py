from main import app
from flask import jsonify, request
from services.service_orders import Service_orders_post,Service_orders_get,Service_get_order_by_id,Service_get_orders_by_name,Service_orders_advance_patch,Service_orders_change_patch

@app.route("/orders", methods=["POST"])
def orders_post():

    new_order = Service_orders_post(request.get_json())
    
    return jsonify(new_order),201


       
@app.route("/orders", methods=["GET"])
def orders_get():
    order = Service_orders_get(request.args.get("status"))

    if not order:
        return [],200
    return jsonify(order), 200



@app.route("/orders/<int:id>", methods=["GET"])
def get_order_by_id(id):
    order = Service_get_order_by_id(id)


    if not order:
        return jsonify({"error" : "Pedido não encontrado"}), 404   
    
    return jsonify(order), 200

    

@app.route("/orders/customer/<string:name>", methods=["GET"])
def get_orders_by_name(name):

    orders = Service_get_orders_by_name(name)

    return jsonify(orders), 200




@app.route("/orders/<int:id>/advance", methods=["PATCH"])
def orders_advance_patch(id):

    table = Service_orders_advance_patch(id)
    
    return jsonify(table),200




@app.route("/orders/<int:id>/status", methods=["PATCH"])
def orders_change_patch(id):

    status = Service_orders_change_patch(request.args.get("status"),id)

    if not status:
        return jsonify({"error" : "status não fornecido ou status não encontrado"}),400
    return jsonify(status),200