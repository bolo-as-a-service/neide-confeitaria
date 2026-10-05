from main import app
from models.models_category import *
from flask import jsonify
from services.service_category import *

@app.route("/categories", methods=["GET"])
def categories_get():
    categories = service_categorie_get()
    return jsonify(categories),200