from flask import Flask
from flask_cors import CORS
from db import db


app = Flask(__name__)
CORS(app)


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


db.init_app(app)


from models.tables import *

from routes.route_products import *
from routes.route_category import *
from routes.route_authentication import *
from routes.route_orders import *

from services.service_products import *



if __name__ == "__main__":
    
    with app.app_context():
        db.create_all()
        Tables()   
            
    app.run(debug=True)