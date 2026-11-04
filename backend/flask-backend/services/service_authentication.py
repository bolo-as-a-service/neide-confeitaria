from models.models_users import User
from extensions.extensions import flask_bcrypt
from db import db
import re

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
        phone_caracters = set("0123456789+()- ")
            
        if not all(char in phone_caracters for char in credencial):
            pass
                
        standardised_phone = re.sub(r'[^0-9]','', credencial)
        user = User.query.filter_by(phone_number=standardised_phone).first()

    if user and flask_bcrypt.check_password_hash(user.password, password):
        return user.to_dict(), None

    elif "@" in credencial or ".com" in credencial:
        return "Email ou senha invalidos", 400 #TEMPORARIO, O CORRETO SERIA RETORNAR 401

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
    name = data.get('name')

    phone = data.get('phone')

    phone_caracters = set("0123456789+()- ")
    
    if not all(char in phone_caracters for char in phone):
        return "Numero de telefone invalido", 422
        
    standardised_phone = re.sub(r'[^0-9]','', phone)

    if len(standardised_phone) < 10 or len(standardised_phone) > 11:
        return "Numero de telefone invalido", 422

    if "@" not in email :
        return "Formato de email incorreto", 422
    if ' ' in password:
        return "A senha não pode conter espaços", 400

    if len(password) >= 30:
        return "A senha deve ter no maximo 30 caracteres", 422  

    if len(password) < 6:
        return "A senha deve ter no minimo 6 caracteres", 422

    if User.query.filter_by(phone_number=standardised_phone).first():
        return "Já existe uma conta registrada com este telefone", 409

    if User.query.filter_by(email=email).first():
        return "Já existe uma conta registrada com este e-mail", 409

    hashed_password = flask_bcrypt.generate_password_hash(password).decode("utf-8")

    new_user = User(
        email=email,
        password=hashed_password,
        phone_number=standardised_phone ,
        name=name
    )
   

    db.session.add(new_user)
    db.session.commit()

    

    return new_user.to_dict(), None