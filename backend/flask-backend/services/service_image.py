from flask import send_file, jsonify, request, send_from_directory
from werkzeug.utils import secure_filename
from utils.error_message import AppError
from utils.validate_user import validateUser

url_images_folder = "/images/uploads"
images_folder = 'uploads'
allowed_extensions = {'png', 'jpg', 'jpeg'}

def service_images_upload():

    validateUser()

    if 'file' not in request.files:
        raise AppError("INVALID_IMAGE")

    file = request.files['file']

    filename = secure_filename(file.filename)

    if not filename:
        raise AppError("INVALID_IMAGE")
    
    ext = filename.rsplit(".", 1)[-1].lower()

    if not ext or ext not in allowed_extensions:
        raise AppError("INVALID_IMAGE")
    
    file.save(f'{images_folder}/{filename}')
    return jsonify({"url": f"{url_images_folder}/{filename}"})

       

def service_images_send_file(filename):

    return send_from_directory(images_folder,filename) 