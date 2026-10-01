from main import app, db
from models.models_users import *
from flask import jsonify, request


@app.route("/auth/login", methods=["POST"])
def login_post():
    data = request.get_json()
    credencial_from_front = data.get("email")
    password_from_front = data.get("password")
    

    user_ath_email = User.query.filter_by(email=credencial_from_front).first()
    user_ath_phone = User.query.filter_by(phone_number=credencial_from_front).first()

    if user_ath_email and user_ath_email.password == password_from_front:
        return jsonify(user_ath_email.to_dict()), 200
    elif user_ath_phone and user_ath_phone.password == password_from_front:
        return jsonify(user_ath_phone.to_dict()), 200
    else:
        return jsonify({"error": "Credencias invalidas"}), 401



@app.route("/auth/register", methods=["POST"])
def register_post():
    data = request.get_json()
    
    email_from_front = data.get("email")
    password_from_front = data.get("password")
    phone_from_front = data.get("phone")
    name_from_front = data.get("name")
    
    new_user = User(email=email_from_front,password=password_from_front,phone_number=phone_from_front,name=name_from_front)
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify(new_user.to_dict()),201
