from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager

flask_bcrypt = Bcrypt()
flask_jwt = JWTManager()


from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    key_func=get_remote_address,
)
