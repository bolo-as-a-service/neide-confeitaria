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

    user = User.query.filter_by(email=credencial).first()

    if not user:
        user = User.query.filter_by(phone_number=credencial).first()

    if user and flask_bcrypt.check_password_hash(user.password, password):
        return user.to_dict(), None

    if "@" in credencial or ".com" in credencial:
        return "Email ou senha invalidos", 401

    return "Telefone ou senha invalidos", 401


def Service_register_post(data):

    if not data:
        return "Não podem haver campos vazios", 400

    for campo in ['email', 'password', 'phone', 'name']:
        if not data.get(campo):
            return "Não podem haver campos vazios", 400

    email = data.get('email')
    password = data.get('password')
    phone = data.get('phone')
    name = data.get('name')

    if ' ' in password:
        return "A senha não pode conter espaços", 400

    if len(password) >= 30:
        return "A senha deve ter no maximo 30 caracteres", 409

    if len(password) < 6:
        return "A senha deve ter no minimo 6 caracteres", 409

    if User.query.filter_by(phone_number=phone).first():
        return "Já existe uma conta registrada com este telefone", 409

    if User.query.filter_by(email=email).first():
        return "Já existe uma conta registrada com este e-mail", 409

    hashed_password = flask_bcrypt.generate_password_hash(password).decode("utf-8")

    new_user = User(
        email=email,
        password=hashed_password,
        phone_number=phone,
        name=name
    )
    print("1")

    db.session.add(new_user)
    db.session.commit()

    

    return new_user.to_dict(), None