from flask import Flask
from flask_cors import CORS
from models.extensions import db


app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

from models.models_cardapio import *
from routes.route_products import *
from routes.route_category import *
from routes.route_authentication import *
from routes.route_orders import *


if __name__ == "__main__":
    with app.app_context():
        db.create_all()

        if Category.query.count() == 0:
            
            db.session.add_all([
                Category(id_category=1, name="Bolos"),
                Category(id_category=2, name="Doces e Sobremesas"),
                Category(id_category=3, name="Salgados")
            ])
            db.session.commit()

    
        if Product.query.count() == 0:
    
            db.session.add_all([
                Product(name="Bolo de Chocolate com Morango", price=55.00, id_category=1),
                Product(name="Bolo de Cenoura com Calda de Chocolate", price=40.00, id_category=1),
                Product(name="Bolo Red Velvet", price=67.00, id_category=1),
                Product(name="Bolo de Ninho com Nutella", price=70.00, id_category=1),
                Product(name="Bolo Formigueiro Caseiro", price=32.00, id_category=1),
                Product(name="Bolo de Limão Siciliano", price=48.00, id_category=1),
                
                Product(name="Brigadeiro Gourmet (Caixa com 6)", price=20.00, id_category=2),
                Product(name="Beijinho Tradicional (Caixa com 6)", price=18.00, id_category=2),
                Product(name="Fatia de Torta Holandesa", price=15.00, id_category=2),
                Product(name="Pudim de Leite Condensado (Fatia)", price=12.00, id_category=2),
                Product(name="Brownie de Chocolate com Nozes", price=14.00, id_category=2),
                Product(name="Coxinha de Doce de Leite com Churros", price=10.00, id_category=2),
                
                Product(name="Coxinha de Frango com Catupiry", price=8.50, id_category=3),
                Product(name="Empada de Palmito", price=9.00, id_category=3),
                Product(name="Quiche de Alho-Poró", price=12.50, id_category=3),
                Product(name="Esfiha de Carne", price=8.00, id_category=3),
                Product(name="Pão de Queijo Recheado", price=10.00, id_category=3)
            ])
            db.session.commit()

        if User.query.count() == 0:
            db.session.add_all(
                 [
                      User(email="neide@gmail.com",name=("Neide"),phone_number=("11986803971"), password=("neide123"))

                 ]
            )
            db.session.commit()

        if Orders.query.count() == 0:
            db.session.add_all([
                Orders(
                    customer_name="Carlos Silva",
                    customer_phone="11988887777",
                    delivery=True,
                    address="Rua das Flores, 100",
                    latitude=-22.9500,
                    longitude=-46.5400,
                    observation="Entregar na portaria",
                    status="PENDING",
                    items=[
                        Items(id_product=1, quantity=2, unit_price=55.00, observation="Bem embalado")
                    ]
                )
            ])
            db.session.commit()
            
    app.run(debug=True)