from db import db
from models.models_orders import Orders, Items
from models.models_users import User
from models.models_product import Product
from datetime import datetime
from utils.error_message import AppError
from flask_jwt_extended import get_jwt_identity
from utils.validate_user import validateUser


def Service_orders_post(data):
    id_user = get_jwt_identity()

    delivery_date = None
    if data.get("deliveryDateTime"):
        try:
            delivery_date = datetime.fromisoformat(
                data.get("deliveryDateTime").replace("Z", "+00:00")
            )
        except ValueError:
            pass

    new_order = Orders(
        customer_name=data.get("customerName"),
        customer_phone=data.get("phone"),
        delivery=data.get("delivery"),
        address=data.get("address"),
        latitude=data.get("latitude"),
        longitude=data.get("longitude"),
        observation=data.get("observation"),
        deliveryDateTime=delivery_date,
    )

    if id_user :
        new_order.id_user = id_user

    items_list = data.get("items", [])

    for item in items_list:
        product_id = item.get("productId")
        product = Product.query.get(product_id)

        new_itens = Items(
            quantity=item.get("quantity"),
            observation=item.get("observation"),
            id_product=product.id_product,
            unit_price=product.price,
        )

        new_order.items.append(new_itens)

    db.session.add(new_order)
    db.session.commit()

    return new_order.to_dict()



def Service_orders_get(status_product):

    validateUser()

    if status_product:
        orders = (
            Orders.query.filter(Orders.status == status_product)
            .all()
        )
    else:
        orders = Orders.query.all()

    if not orders:
        return None
    return [order.to_dict() for order in orders]


def Service_get_order_by_id(id):

    validateUser()

    order = Orders.query.get(id)

    if not order:
        raise AppError("ORDER_DONT_EXISTS")
    return order.to_dict()


def Service_get_my_orders():
    id_user = get_jwt_identity()
    orders = Orders.query.filter(Orders.id_user == id_user).all()
    if not orders:
        return []
    else:
        return [order.to_dict() for order in orders]


def Service_orders_advance_patch(id):

    validateUser()

    order = Orders.query.get_or_404(id)

    if order.status == "PENDING":
        order.status = "APROVADO"

    elif order.status == "APROVADO":
        order.status = "FAZENDO"

    elif order.status == "FAZENDO":
        order.status = "PRONTO"

    elif order.status == "PRONTO":
        order.status = "ENTREGUE"

    db.session.commit()
    return order.to_dict()


def Service_orders_change_patch(status, id):

    validateUser()

    if not status:
        raise AppError("STATUS_ORDER_NOT_FOUND")
    # VERIFICAR SE O ID DO PEDIDO EXISTE ANTES DE TENTAR ALGO SE NAO DA 404.
    order = Orders.query.get_or_404(id)

    order.status = status

    db.session.commit()
    return order.to_dict()
