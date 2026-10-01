from main import app, db
from models.models_cardapio import *
from flask import jsonify, request

@app.route("/categories", methods=["GET"])
def categories_get():
    categories_db = Category.query.all()
    return jsonify([c.to_dict() for c in categories_db])