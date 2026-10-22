from models.models_users import User
from extensions.extensions import flask_bcrypt
from db import db


def Service_login_post(data):

    if not data:
        return "Preencha todos os campos", 400 

    for campo in ['email', 'password']:
        if not data.get(campo):
            return "Preencha todos os campos", 400 

    credencial = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=credencial).first()

    if not user:
        user = User.query.filter_by(phone_number=credencial).first()

    if user and flask_bcrypt.check_password_hash(user.password, password):
        return user.to_dict(), 201

    elif "@" in credencial or ".com" in credencial:
        return "Email ou senha invalidos", 400 #TEMPORARIO, O CORRETO SERIA RETORNAR 401

    elif "9" in credencial and ("1" or "2" or "3" or "4" or "5" or "6" or "7" or "8" or "0") in credencial:
        return "Telefone ou senha invalidos", 400 #TEMPORARIO, O CORRETO SERIA RETORNAR 401

    else:
        return "Credencial ou senha invalidos", 400 #TEMPORARIO, O CORRETO SERIA RETORNAR 401

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

    if "@" not in email :
        return "Formato de email incorreto", 422
    if ' ' in password:
        return "A senha não pode conter espaços", 400

    if len(password) >= 30:
        return "A senha deve ter no maximo 30 caracteres", 422  

    if len(password) < 6:
        return "A senha deve ter no minimo 6 caracteres", 422

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
   

    db.session.add(new_user)
    db.session.commit()

    

    return new_user.to_dict(), None