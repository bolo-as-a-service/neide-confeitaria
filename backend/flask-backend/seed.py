from db import db

from models.models_category import Category
from models.models_product import Product
from models.models_users import User
from models.models_orders import Orders,Items
from extensions.extensions import flask_bcrypt

def Tables():
    if Category.query.count() == 0:
            
        db.session.add_all([
                Category(id_category=1, name="Bolos caseiros"),
                Category(id_category=2, name="Bolos vulcão"),
                Category(id_category=3, name="Bolos Diet")
            ])
        db.session.commit()

    
    if Product.query.count() == 0:
        db.session.add_all([
                Product(name="Bolo de Cenoura", price=65.00, id_category=1, ingredients=["Farinha", "Cenoura", "Chocolate"], description="Bolo de Cenoura com cobertura de chocolate fofinho", image_url="/images/uploads/BoloCenoura.jpg"),
                Product(name="Bolo de Fubá", price=55.00, id_category=1, ingredients=["Fubá", "Leite", "Ovos"], description="Bolo de Fubá fofinho", image_url="/images/uploads/BoloFuba.jpg"),
                Product(name="Bolo de Coco", price=58.00, id_category=1, ingredients=["Coco", "Farinha", "Leite"], description="Bolo de Coco fofinho", image_url="/images/uploads/BoloCoco.jpg"),
                Product(name="Bolo de laranja", price=50.00, id_category=1, ingredients=["Laranja", "Farinha", "Leite"], description="Bolo de laranja fofinho", image_url="/images/uploads/BoloLaranja.jpg"),
                Product(name="Bolo de Banana", price=32.00, id_category=1, ingredients=["Banana", "Farinha", "Leite"], description="Bolo de Banana fofinho", image_url="/images/uploads/BoloBanana.jpg"),
                
                Product(name="Bolo Vulcão de Brigadeiro", price=75.00, id_category=2, ingredients=["Chocolate", "Leite Condensado", "Creme de Leite", "Farinha"], description="Massa fofinha de chocolate com muita cobertura cremosa de brigadeiro gourmet", image_url="/images/uploads/VulcaoBrigadeiro.jpg"),
                Product(name="Bolo Vulcão de Ninho com Nutella", price=85.00, id_category=2, ingredients=["Leite Ninho", "Nutella", "Farinha", "Leite"], description="Massa branca fofinha transbordando creme de Leite Ninho com calda de Nutella", image_url="/images/uploads/VulcaoNinho.jpg"),
                Product(name="Bolo Vulcão de Cenoura", price=70.00, id_category=2, ingredients=["Cenoura", "Chocolate", "Farinha", "Ovos"], description="O clássico bolo de cenoura com uma avalanche de brigadeiro cremoso", image_url="/images/uploads/VulcaoCenoura.jpg"),
                Product(name="Bolo Vulcão de Prestígio", price=78.00, id_category=2, ingredients=["Chocolate", "Coco", "Leite Condensado", "Farinha"], description="Massa de chocolate bem molhadinha com cobertura cremosa de beijinho de coco", image_url="/images/uploads/VulcaoPrestigio.jpg"),
                Product(name="Bolo Vulcão de Churros", price=75.00, id_category=2, ingredients=["Doce de Leite", "Canela", "Farinha", "Leite"], description="Massa aromatizada com canela e bastante cobertura de doce de leite cremoso", image_url="/images/uploads/VulcaoChurros.jpg"),
                Product(name="Bolo Vulcão de Limão", price=68.00, id_category=2, ingredients=["Limão", "Leite Condensado", "Creme de Leite", "Farinha"], description="Massa cítrica levinha com mousse cremosa de limão e raspas", image_url="/images/uploads/VulcaoLimao.jpg"),

                Product(name="Bolo Diet de Chocolate", price=72.00, id_category=3, ingredients=["Farinha Integral", "Cacau 100%", "Adoçante Culinário", "Ovos"], description="Bolo de chocolate fofinho e saboroso, zero adição de açúcar", image_url="/images/uploads/DietChocolate.png"),
                Product(name="Bolo Diet de Banana com Aveia", price=65.00, id_category=3, ingredients=["Banana", "Aveia", "Canela", "Ovos"], description="Bolo natural adoçado com a própria fruta e toque de canela, zero açúcar", image_url="/images/uploads/DietBanana.jpg"),
                Product(name="Bolo Diet de Maçã com Nozes", price=75.00, id_category=3, ingredients=["Maçã", "Nozes", "Farinha Integral", "Adoçante Culinário"], description="Massa úmida com pedaços de maçã e crocância das nozes, zero açúcar", image_url="/images/uploads/DietMaca.jpg"),
                Product(name="Bolo Diet de Laranja", price=62.00, id_category=3, ingredients=["Laranja", "Farinha Integral", "Adoçante Culinário", "Ovos"], description="Bolo cítrico fofinho feito com suco natural de laranja, zero adição de açúcar", image_url="/images/uploads/DietLaranja.png")
            ])
        db.session.commit()


    if User.query.count() == 0:
            db.session.add_all(
                 [
                      User(email="neide@gmail.com",name=("Neide"),phone_number=("11986803971"), password=(flask_bcrypt.generate_password_hash("neide123").decode("utf-8")), role=("ADMIN")),
                      User(email="teste@gmail.com",name=("Teste"),phone_number=("11986803972"), password=(flask_bcrypt.generate_password_hash("teste123").decode("utf-8")), role=("USER"))
                 ])
            db.session.commit()


    if Orders.query.count() == 0:
            db.session.add_all([
                Orders(
                    customer_name="Teste",
                    customer_phone="11988887777",
                    delivery=True,
                    address="Rua das Flores, 100",
                    latitude=-22.9500,
                    longitude=-46.5400,
                    observation="Entregar na portaria",
                    items=[
                    Items(id_product=1, quantity=2, unit_price=55.00, observation="Bem embalado")
                    ])
            ])
            db.session.commit()