from flask_bcrypt import Bcrypt
from flask_jwt_extended import *
from utils.error_message import AppError
from models.models_users import *


# Talvez seja possivel revomer isso daqui pois jwt ja esta registrado no app
# Mas nao sei se é possivel utilizar o as funcoes do jwt que foram registrado no app.
# jwt = JWTManager(app)
flask_bcrypt = Bcrypt()
flask_jwt = JWTManager()



from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    key_func=get_remote_address,
)