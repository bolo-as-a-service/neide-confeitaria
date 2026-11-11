from models.models_category import Category


def Service_categorie_get():

    categories = Category.query.all()
    # Talvez validar em caso de erro
    return [categorie.to_dict() for categorie in categories]


# Rota para criar categorias
