from models.models_category import Category

def Service_categorie_get():

    categories = Category.query.all()

    return [categorie.to_dict() for categorie in categories]