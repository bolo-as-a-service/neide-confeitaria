from models.models_category import *

def service_categorie_get():

    categories = Category.query.all()

    return [categorie.to_dict() for categorie in categories]