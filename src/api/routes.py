"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import request, jsonify, Blueprint
from api.models import User
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import  jwt_required, create_access_token, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash

api = Blueprint('api', __name__)

@api.route('/signup', methods=['POST'])
def signup():
    
    # Datos de la tabla "users"
    full_name = request.json.get('full_name')
    email = request.json.get('email')
    password = request.json.get('password')

    
    if not full_name:
        return jsonify({ "msg": "Full name information is required"}), 422
    
    if not email:
        return jsonify({ "msg": "email is required"}), 422

    if not password:
        return jsonify({ "msg": "Password is required"}), 422

    user = User.query.filter_by(email=email).first()

    if user:
        return jsonify({ "msg": "User already exists"}), 400

    
    user = User()
    user.full_name = full_name
    user.email = email
    user.password = generate_password_hash(password)
    user.save()
    
    # Token sin vencimiento
    access_token = create_access_token(identity=user.id)

    data = {
        "access_token": access_token,
        "user": user.serialize()
    }
    

    return jsonify(data), 200


@api.route('/login', methods=['POST'])
def signin():
    email = request.json.get('email')
    password = request.json.get('password')

    if not email:
        return jsonify({ "msg": "email is required"}), 422

    if not password:
        return jsonify({ "msg": "Password is required"}), 422

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({ "msg": "email/Password are incorrects"}), 401

    if not check_password_hash(user.password, password):
        return jsonify({ "msg": "email/Password are incorrects"}), 401
    
    access_token = create_access_token(identity=user.id)

    data = {
        "access_token": access_token,
        "user": user.serialize()
    }

    return jsonify(data), 200

@api.route('/private', methods=['GET'])
@jwt_required()
def private_route():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({"msg": "User not found"}), 404
    
    return jsonify(user=user.serialize()), 200

@api.route('/', methods=['GET'])
def home():
    return "home"