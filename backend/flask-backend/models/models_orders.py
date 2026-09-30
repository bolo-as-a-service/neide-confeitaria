from models.extensions import db
from models.models_cardapio import *

class Orders(db.Model):
    id_orders = db.Column(db.Integer, primary_key=True)
    customer_name = db.Column(db.String(100), nullable=False)
    customer_phone = db.Column(db.String(100), nullable=False)
    delivery = db.Column(db.Boolean, nullable=False)

    address = db.Column(db.String(100), nullable=True)
    latitude= db.Column(db.Float, nullable=True)
    longitude= db.Column(db.Float, nullable=True)

    observation= db.Column(db.String(150), nullable=True)
    status= db.Column(db.String(20), nullable = False, default="PENDING")
    deliveryDateTime= db.Column(db.DateTime, nullable = True)
    createdAt = db.Column(db.DateTime, server_default=db.func.current_timestamp())

    items = db.relationship("Items", backref="order", lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return{
            'id': self.id_orders,
            'customerName': self.customer_name,
            'phone': self.customer_phone,
            'delivery': self.delivery,

            'address': self.address,
            'latitude': self.latitude,
            'longitude': self.longitude,

            'observation': self.observation,
            'status': self.status,
            'deliveryDateTime': self.deliveryDateTime.isoformat() if self.deliveryDateTime else None,
            'createdAt': self.createdAt.isoformat() if self.createdAt else None,

            'items': [item.to_dict() for item in self.items]
            }       


class Items(db.Model):
    id_items = db.Column(db.Integer, primary_key=True)

    id_orders= db.Column(db.Integer, db.ForeignKey('orders.id_orders'), nullable=False)
    id_product= db.Column(db.Integer, db.ForeignKey('product.id_product'), nullable=False)
    unit_price= db.Column(db.Float, nullable = False)

    quantity = db.Column(db.Integer, nullable=False)
    observation = db.Column(db.String(150), nullable=True)

    product = db.relationship('Product')

    def to_dict(self):
        return{
            'id': self.id_items,

            'quantity': self.quantity,
            'unitPrice': self.unit_price,
            'observation': self.observation,

            'product': self.product.to_dict() if self.product else None
        }

