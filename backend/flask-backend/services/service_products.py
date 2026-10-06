from models.models_product import *




def service_products_get(id):

    if id:
        products_db = Product.query.filter_by(id_category=id).all()
    
    else:
        products_db = Product.query.all()

    return [product.to_dict() for product in products_db]


def service_products_post(data):
    
    new_product = Product(
            name =data.get('name'),
            price =data.get('price'),
            id_category=data.get('categoryId'),
            description=data.get('description'),
            ingredients= data.get('ingredients')
        )
    
    db.session.add(new_product)
    db.session.commit()

    return new_product.to_dict()



def service_get_products_by_id(id) :

    product = Product.query.get(id)

    if not product:
        return None
    return product.to_dict


def service_put_products_by_id(id, data):

    product = Product.query.get_or_404(id)
        
    product.name =data.get('name')
    product.price =data.get('price')
    product.id_category=data.get('categoryId')
    product.description=data.get('description')
    product.ingredients= data.get('ingredients')
            
        
    db.session.add(product)
    db.session.commit()
    
    return product.to_dict()

    


def service_delete_product_by_id(id):

    product = Product.query.get(id)


    if not product:
        return None
    db.session.delete(product)
    db.session.commit()
    return True