from utils.error_message import AppError
from models.models_users import *
from flask_jwt_extended import get_jwt_identity

def validateUser():
    
    # Podemos usar set_acess_token (com o role) e resgastar evitando consulta desnecessaria no banco
    # Mais ou menos assim
    # if get_jwt_identity()["role"] != "ADMIN"
    #    raise AppError("NOT_AUTHORIZED")
        
    if db.session.get(User, get_jwt_identity()).role != "ADMIN":
        raise AppError("NOT_AUTHORIZED")
