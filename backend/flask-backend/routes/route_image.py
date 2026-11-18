from flask import Blueprint
from services.service_image import service_images_upload,service_images_send_file

images_blueprint = Blueprint("images", __name__, url_prefix="/images")

@images_blueprint.post("/upload")
def images_upload():
    return service_images_upload(), 201

@images_blueprint.get('/uploads/<path:filename>')
def images_send_file(filename):
    return service_images_send_file(filename),200