from db import db
from models.models_product import Product
from models.models_users import User
from utils.error_message import AppError

from utils.validate_user import validateUser


def Service_products_get(id):

    if id:
        products_db = Product.query.filter_by(id_category=id).all()
    else:
        products_db = Product.query.all()

    return [product.to_dict() for product in products_db]


def Service_products_post(data):

    validateUser()
    

    new_product = Product(
        image_url=data.get("imageUrl"),
        name=data.get("name"),
        price=data.get("price"),
        id_category=data["category"]["id"],
        description=data.get("description"),
        ingredients=data.get("ingredients"),
    )

    db.session.add(new_product)
    db.session.commit()

    return new_product.to_dict()


def Service_get_products_by_id(id):

    product = Product.query.get(id)

    if not product:
        raise AppError("PRODUCT_DONT_EXISTS")
    return product.to_dict()


def Service_put_products_by_id(id, data):

    validateUser()

    product = Product.query.get(id)

    if not product:
        raise AppError("PRODUCT_DONT_EXISTS")

    product.name = data.get("name")
    product.price = data.get("price")
    product.id_category = data["category"]["id"]
    product.description = data.get("description")
    product.ingredients = data.get("ingredients")

    db.session.add(product)
    db.session.commit()

    return product.to_dict()


def Service_delete_product_by_id(id):

    validateUser()

    product = Product.query.get(id)

    if not product:
        raise AppError("PRODUCT_DONT_EXISTS")
    db.session.delete(product)
    db.session.commit()
    return True

def Service_toggle_product(id):
    
    validateUser()

    product = Product.query.get(id)

    if not product:
        raise AppError("PRODUCT_DONT_EXISTS")

    if product.available == True:
        product.available = False
    else:
        product.available = True
    print(product.available)
    db.session.add(product)
    db.session.commit()

    return product.to_dict()