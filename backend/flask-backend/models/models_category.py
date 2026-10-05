from db import db

class Category(db.Model):
    id_category = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

    products = db.relationship('Product', backref='category', lazy=True)

    def to_dict(self):
        return {
            "id_category": self.id_category,
            "name": self.name
        }

