from models.extensions import db

class User(db.Model):
    id_user = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(150), nullable=False)
    password = db.Column(db.String(100),nullable=False)

    def to_dict(self):
        return{
            "id" : self.id_user,
            "email" : self.email,
            "phone" : self.phone_number,
            "name": self.name
        }