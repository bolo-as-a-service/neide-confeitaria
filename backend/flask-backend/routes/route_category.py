from main import app
from flask import jsonify
from services.service_category import Service_categorie_get


@app.route("/categories", methods=["GET"])
def categories_get():
    categories = Service_categorie_get()
    return jsonify(categories),200