from models.models_users import *

def service_login_post(data):

    credencial = data.get("email")
    password = data.get("password")
        
    
    user_email = User.query.filter_by(email=credencial).first()
    user_phone = User.query.filter_by(phone_number=credencial).first()
    
    if user_email and user_email.password == password:
        return user_email.to_dict()
    elif user_phone and user_phone.password == password:
        return user_phone.to_dict()
    else:
        return None



def service_register_post(data):
    email = data.get("email")
    password = data.get("password")
    phone = data.get("phone")
    name = data.get("name")
        
    new_user = User(
        email=email,
        password=password,
        phone_number=phone,
        name=name)
        
    db.session.add(new_user)
    db.session.commit()

    return new_user.to_dict()