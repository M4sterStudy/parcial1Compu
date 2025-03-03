from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash  # Para encriptar y verificar contraseñas
from users.models.user_model import Users
from db.db import db

user_controller = Blueprint('user_controller', __name__)

@user_controller.route('/api/users', methods=['GET'])
def get_users():
    print("listado de usuarios")
    users = Users.query.all()
    result = []
    for user in users:
        result.append({
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'username': user.username
        })
    return jsonify(result), 200

@user_controller.route('/api/users/<string:username>', methods=['GET'])
def get_user_by_username(username):
    print(f"Obteniendo usuario con username: {username}")
    user = Users.query.filter_by(username=username).first()
    
    if not user:
        return jsonify({'message': 'Usuario no encontrado'}), 404

    return jsonify({
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'username': user.username
    }), 200


@user_controller.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    print("obteniendo usuario")
    user = Users.query.get_or_404(user_id)
    return jsonify({
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'username': user.username
    }), 200

@user_controller.route('/api/users', methods=['POST'])
def create_user():
    print("creando usuario")
    data = request.json
    if not data:
        return jsonify({'message': 'No data provided'}), 400

    name = data.get('name')
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')

    # Validamos que los campos necesarios existan
    if not name or not email or not username or not password:
        return jsonify({'message': 'Missing required fields'}), 400

    # (Opcional, pero recomendado para producción) Encriptar la contraseña antes de guardarla
    # hashed_password = generate_password_hash(password)
    # new_user = Users(name=name, email=email, username=username, password=hashed_password)
    new_user = Users(name=name, email=email, username=username, password=password)
    
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created successfully'}), 201

@user_controller.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    print("actualizando usuario")
    user = Users.query.get_or_404(user_id)
    data = request.json
    if not data:
        return jsonify({'message': 'No data provided'}), 400

    name = data.get('name')
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')

    if not name or not email or not username or not password:
        return jsonify({'message': 'Missing required fields'}), 400

    user.name = name
    user.email = email
    user.username = username
    # user.password = generate_password_hash(password)  # Recomendado para producción
    user.password = password
    db.session.commit()

    return jsonify({'message': 'User updated successfully'}), 200

@user_controller.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    print("eliminando usuario")
    user = Users.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted successfully'}), 200

@user_controller.route('/api/login', methods=['POST'])
def login():
    data = request.json
    if not data:
        return jsonify({'message': 'No data provided'}), 400

    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Missing username or password'}), 400

    user = Users.query.filter_by(username=username).first()
    if not user or user.password != password:
        return jsonify({'message': 'Invalid username or password'}), 401

    # En lugar de usar session, solo devuelve una respuesta de éxito
    return jsonify({'message': 'Login successful', 'user_id': user.id, 'username': user.username}), 200

