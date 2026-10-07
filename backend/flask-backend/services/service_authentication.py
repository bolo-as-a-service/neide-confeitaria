from models.models_users import *

def service_login_post(data):

    credencial = data.get("email")
    password = data.get("password")
        
    
    user = User.query.filter_by(email=credencial).first()
    

    if not user :
        user = User.query.filter_by(phone_number=credencial).first()

    if user and user.password == password:
        return user.to_dict()
    
    else:
        if "@" in credencial or ".com" in credencial:
            return "email_password_wrong"
        else:
            return "phone_password_wrong"


def service_register_post(data):
    email = data.get("email")
    password = data.get("password")
    phone = data.get("phone")
    name = data.get("name")


    phone_already_exists= User.query.filter_by(phone_number=phone).first()
    if phone_already_exists:
        return "phone_already_exists"

    email_already_exists = User.query.filter_by(email=email).first()
    if email_already_exists:
        return "email_already_exists"

    if len(password) >= 30:
        return "password_so_long"

    if len(password) < 6:
        return "password_so_short"


    new_user = User(
        email=email,
        password=password,
        phone_number=phone,
        name=name)


    db.session.add(new_user)
    db.session.commit()

    return new_user.to_dict()