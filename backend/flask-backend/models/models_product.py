from db import db

class Product(db.Model):
    id_product = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    id_category = db.Column(db.Integer,db.ForeignKey('category.id_category'), nullable=False)

    description = db.Column(db.String(255), nullable=True)
    ingredients = db.Column(db.String(255), nullable=True)
    image_url = db.Column(db.String(255), nullable=True)

    

    def to_dict(self):
        return {
            "id": self.id_product,
            "name": self.name,
            "price": self.price,
            "description": self.description,
            "ingredients": self.ingredients,
            "imageUrl": self.image_url,
            "category": {
                "name": self.category.name if self.category else ""
                }
        }   

class Ingredients(db.Model):
    id_ingredients = db.Column(db.Integer, )