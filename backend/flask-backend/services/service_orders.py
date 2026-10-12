from models.models_orders import *
from models.models_users import *
from datetime import datetime
from flask import request

def service_orders_post(data):

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

    return new_order.to_dict()


def service_orders_get(status_product):
     
    if status_product:
        orders = Orders.query.filter(Orders.status==status_product).filter(Orders.status.not_in(["CANCELADO", "ENTREGUE"])).all()
    else:
        orders = Orders.query.filter(Orders.status.not_in(["CANCELADO", "ENTREGUE"])).all()

    if not orders:
        return None
    return [order.to_dict() for order in orders]


def service_get_order_by_id(id):
    order = Orders.query.get(id)

    if not order:
        return None
    return order.to_dict()


def service_get_orders_by_name(name) :

    orders = Orders.query.filter(User.name.ilike(f"%{name}%")).all()

    if not orders:
        return []
    else:
        return [order.to_dict() for order in orders]


def service_orders_advance_patch(id) :

    order = Orders.query.get_or_404(id)

    if order.status == "PENDING":
        order.status = "APROVADO"
    
    if order.status == "APROVADO":
        order.status = "FAZENDO"
            
    if order.status == "FAZENDO":
        order.status = "PRONTO"

    if order.status == "PRONTO":
        order.status == "ENTREGUE"

    db.session.commit()
    return order.to_dict()

    

def service_orders_change_patch(status,id):
    
    if not status:
        return None
        
    order = Orders.query.get_or_404(id)
   
    order.status = status
    
    db.session.commit()
    print(status)
    return order.to_dict()




