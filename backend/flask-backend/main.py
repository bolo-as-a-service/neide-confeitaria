from flask import Flask
from flask_cors import CORS
from db import db


from extensions.extensions import flask_bcrypt , flask_jwt , limiter



app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


db.init_app(app)


from seed import Tables

from routes.route_products import *
from routes.route_category import *
from routes.route_authentication import *
from routes.route_orders import *

from services.service_products import *



if __name__ == "__main__":
    
    with app.app_context():
        db.create_all()
        Tables()   
                
        limiter.init_app(app)
        flask_bcrypt.init_app(app)
        flask_jwt.init_app(app)
            
    app.run(debug=True)