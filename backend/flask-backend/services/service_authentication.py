from flask_jwt_extended import create_access_token
from extensions.extensions import flask_bcrypt
from utils.error_message import AppError
from models.models_users import User
from db import db
import re


def Service_register_post(data):

    if not data:
        raise AppError("EMPTY_FIELDS")

    for campo in ["email", "password", "phone", "name"]:
        if not data.get(campo):
            raise AppError("EMPTY_FIELDS")

    email = data.get("email")
    password = data.get("password")
    name = data.get("name")

    phone = data.get("phone")

    phone_caracters = set("0123456789+()- ")
    if not all(char in phone_caracters for char in phone):
        raise AppError("WRONG_PHONE_NUMBER")

    standardised_phone = re.sub(r"[^0-9]", "", phone)

    if len(standardised_phone) < 10 or len(standardised_phone) > 11:
        raise AppError("WRONG_PHONE_NUMBER")

    if "@" not in email:
        raise AppError("WRONG_EMAIL_FORMAT")

    if " " in password:
        raise AppError("PASSWORD_HAS_SPACES")

    if len(password) >= 30:
        raise AppError("PASSWORD_TOO_LONG")

    if len(password) < 6:
        raise AppError("PASSWORD_TOO_SHORT")

    if User.query.filter_by(phone_number=standardised_phone).first():
        raise AppError("PHONE_ALREADY_EXISTS")

    if User.query.filter_by(email=email).first():
        raise AppError("EMAIL_ALREADY_EXISTS")

    hashed_password = flask_bcrypt.generate_password_hash(password).decode("utf-8")

    new_user = User(
        email=email,
        password=hashed_password,
        phone_number=standardised_phone,
        name=name,
    )

    db.session.add(new_user)
    db.session.commit()

    return new_user.to_dict()


def Service_login_post(data):

    if not data:
        raise AppError("EMPTY_FIELDS")

    for campo in ["email", "password"]:
        if not data.get(campo):
            raise AppError("EMPTY_FIELDS")

    credencial = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=credencial).first()

    if not user:
        phone_caracters = set("0123456789+()- ")

        if not all(char in phone_caracters for char in credencial):
            pass

        standardised_phone = re.sub(r"[^0-9]", "", credencial)
        user = User.query.filter_by(phone_number=standardised_phone).first()

    if not user or not flask_bcrypt.check_password_hash(user.password, password):

        if "@" in credencial or ".com" in credencial:
            raise AppError("WRONG_DATA_EMAIL_OR_PASSWORD")

        raise AppError("WRONG_DATA_EMAIL_OR_PHONE")

    token = create_access_token(identity=str(user.id_user))

    return token, user.to_dict()
