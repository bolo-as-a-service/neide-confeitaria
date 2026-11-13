ERRORS = {
    #AUTH_ERRORS
    "EMPTY_FIELDS" : ("Preencha todos os campos,", 400 ),
    "WRONG_DATA_EMAIL_OR_PASSWORD" : ("Email ou senha invalidos", 400), #TEMPORARIO, O CORRETO SERIA RETORNAR 401
    "WRONG_DATA_EMAIL_OR_PHONE" : ("Credencial ou senha invalidos", 400),  #TEMPORARIO, O CORRETO SERIA RETORNAR 401
    "WRONG_PHONE_NUMBER" : ("Numero de telefone invalido", 422),
    "WRONG_EMAIL_FORMAT" : ("Formato de email incorreto", 422),
    "PASSWORD_TOO_LONG": ("A senha deve ter no maximo 30 caracteres", 422),
    "PASSWORD_TOO_SHORT": ("A senha deve ter no minimo 6 caracteres", 422),
    "PHONE_ALREADY_EXISTS" : ("Já existe uma conta registrada com este telefone", 409),
    "EMAIL_ALREADY_EXISTS" : ("Já existe uma conta registrada com este e-mail", 409),
    #ORDER_ERRORS
    ("ORDER_DONT_EXISTS") : ("Pedido não encontrado", 404),
    ("STATUS_ORDER_NOT_FOUND") : ("Status não fornecido ou status não encontrado", 404),
    #PRODUCT_ERRORS
    ("PRODUCT_DONT_EXISTS") : ("O Produto não encontrado", 404),
    #JWT_ERROR
    ("NOT_AUTHORIZED") : ("Sem autorização", 400) #TEMPORARIO, O CORRETO SERIA RETORNAR 401
}

class AppError(Exception):
    def __init__(self, code: str):
        message, status = ERRORS[code]
        super().__init__(message)
        self.code = code
        self.message = message
        self.status = status