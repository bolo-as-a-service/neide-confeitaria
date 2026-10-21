from models.models_users import User
from extensions.extensions import flask_bcrypt
from db import db


def Service_login_post(data):

    if not data:
        return "empty_label"

    for campo in ['email', 'password']:
        if not data.get(campo):
            return "empty_label"

    credencial = data.get("email")
    password = data.get("password")

    if ' ' in password:
        return "password_has_spaces"

    user = User.query.filter_by(email=credencial).first()

    if not user:
        user = User.query.filter_by(phone_number=credencial).first()

    if user and flask_bcrypt.check_password_hash(user.password, password):
        return user.to_dict()

    if "@" in credencial or ".com" in credencial:
        return "email_password_wrong"

    return "phone_password_wrong" 


def Service_register_post(data):

    if not data:
        return "empty_label"

    for campo in ['email', 'password', 'phone', 'name']:
        if not data.get(campo):
            return "empty_label"

    email = data.get('email')
    password = data.get('password')
    phone = data.get('phone')
    name = data.get('name')

    if ' ' in password:
        return "password_has_spaces"

    if len(password) >= 30:
        return "password_so_long"

    if len(password) < 6:
        return "password_so_short"

    if User.query.filter_by(phone_number=phone).first():
        return "phone_already_exists"

    if User.query.filter_by(email=email).first():
        return "email_already_exists"

    hashed_password = flask_bcrypt.generate_password_hash(password).decode("utf-8")

    new_user = User(
        email=email,
        password=hashed_password,
        phone_number=phone,
        name=name
    )

    db.session.add(new_user)
    db.session.commit()

    return new_user.to_dict()