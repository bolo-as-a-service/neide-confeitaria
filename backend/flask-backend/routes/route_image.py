from flask import Blueprint, jsonify, request,send_file
from werkzeug.utils import secure_filename
import os

images_blueprint = Blueprint("images", __name__, url_prefix="/images")

images_folder = 'uploads'
allowed_extensions = {'png', 'jpg', 'jpeg', 'webp'}



def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

@images_blueprint.post("/upload")
def images_upload():

    

    if 'file' not in request.files:
        return jsonify({"error": "Nenhum arquivo enviado"}), 400

    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "Nome do arquivo vazio"}), 400

    if file and allowed_file(file.filename):

        filename = secure_filename(file.filename)

        os.makedirs(images_folder, exist_ok=True)
        
        file.save(f'{images_folder}/{filename}')

        urlimg = "/images/uploads"

        return jsonify({
            "url": f"{urlimg}/{filename}"
        }), 201

    else:
        return jsonify({"error" : f"{urlimg}/{filename}"}), 400


@images_blueprint.get('/uploads/<path:filename>')
def serve_uploaded_file(filename):
    
    return send_file(f"{images_folder}/{filename}")