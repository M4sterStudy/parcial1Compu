# microOrders/orders/controllers/order_controller.py
from flask import Blueprint, request, jsonify
from orders.models.order_model import Order
from db.db import db
import requests
from flask_cors import CORS

order_controller = Blueprint('order_controller', __name__)

# Habilitar CORS después de definir el Blueprint
CORS(order_controller, supports_credentials=True)

# URL de los microservicios
PRODUCTS_API_URL = "http://192.168.100.3:5003/api/products"
USERS_API_URL = "http://192.168.100.3:5002/api/users"

##############################
# 0. Obtener lista de productos desde microProducts
##############################
@order_controller.route('/api/orders/products', methods=['GET'])
def get_products_from_microproducts():
    """
    Llama a microProducts y devuelve la lista de productos para que el frontend
    los muestre en la página de órdenes (sin depender directamente de microProducts).
    """
    try:
        response = requests.get(PRODUCTS_API_URL)
        if response.status_code == 200:
            return jsonify(response.json()), 200
        else:
            return jsonify({'message': 'Error al obtener productos'}), response.status_code
    except Exception as e:
        return jsonify({'message': f'Error en la solicitud a microProducts: {str(e)}'}), 500

##############################
# 1. Obtener todas las órdenes
##############################
@order_controller.route('/api/orders', methods=['GET'])
def get_all_orders():
    orders = Order.query.all()
    result = []
    for order in orders:
        result.append({
            'id': order.id,
            'username': order.username,
            'email': order.email,
            'saleTotal': float(order.saleTotal),
            'date': order.date.strftime('%Y-%m-%d %H:%M:%S')
        })
    return jsonify(result)

##############################
# 2. Obtener una orden específica
##############################
@order_controller.route('/api/orders/<int:order_id>', methods=['GET'])
def get_order(order_id):
    order = Order.query.get_or_404(order_id)
    return jsonify({
        'id': order.id,
        'username': order.username,
        'email': order.email,
        'saleTotal': float(order.saleTotal),
        'date': order.date.strftime('%Y-%m-%d %H:%M:%S')
    })

##############################
# 3. Crear una nueva orden (POST)
##############################
@order_controller.route('/api/orders', methods=['POST'])
def create_order():
    """
    Crea una nueva orden.
    - Recibe un JSON con 'username' y 'products'.
    - Busca el email del usuario en microUsers usando ?username=...
    - Verifica stock con microProducts y recalcula el total.
    - Actualiza el stock en microProducts si hay suficiente stock.
    - Crea la orden en la base de datos.
    """
    data = request.get_json()

    # 3.1 Obtener username (viene del frontend)
    user_name = data.get('username')
    if not user_name:
        return jsonify({'message': 'Información de usuario inválida'}), 400

    # 3.2 Obtener el email desde microUsers
    user_response = requests.get(f"{USERS_API_URL}/{user_name}")  # Se usa el nuevo endpoint

    if user_response.status_code != 200:
        return jsonify({'message': 'Usuario no encontrado en microUsers'}), 400

    user_data = user_response.json()  # Ahora es un solo usuario, no una lista
    user_email = user_data.get('email')

    if not user_email:
        return jsonify({'message': 'No se pudo obtener el email del usuario'}), 400


    # 3.3 Validar lista de productos
    products = data.get('products')
    if not products or not isinstance(products, list):
        return jsonify({'message': 'Falta o es inválida la información de los productos'}), 400

    # 3.4 Verificar que haya stock suficiente y recalcular total
    total_sale = 0.0
    updated_products = []

    for item in products:
        product_id = item.get('id')
        quantity = item.get('quantity', 0)

        # Obtener producto desde microProducts
        response = requests.get(f"{PRODUCTS_API_URL}/{product_id}")
        if response.status_code != 200:
            return jsonify({'message': f'Error al obtener producto {product_id}'}), 400

        product_data = response.json()
        if product_data['amount'] < quantity:
            return jsonify({'message': f'No hay suficiente stock para {product_data["name"]}'}), 400

        # Sumar al total
        total_sale += product_data['price'] * quantity

        # Preparar producto con nueva cantidad
        updated_products.append({
            'id': product_id,
            'name': product_data['name'],
            'amount': product_data['amount'] - quantity,
            'price': product_data['price']
        })

    # 3.5 Actualizar inventario de productos en microProducts
    for product in updated_products:
        update_response = requests.put(f"{PRODUCTS_API_URL}/{product['id']}", json={
            'name': product['name'],
            'amount': product['amount'],
            'price': product['price']
        })
        if update_response.status_code != 200:
            return jsonify({'message': f'Error al actualizar stock de {product["name"]}'}), 500

    # 3.6 Crear y guardar la orden
    new_order = Order(username=user_name, email=user_email, saleTotal=total_sale)
    db.session.add(new_order)
    db.session.commit()

    return jsonify({'message': 'Orden creada exitosamente', 'order_id': new_order.id}), 201

##############################
# 4. Eliminar una orden (DELETE)
##############################
@order_controller.route('/api/orders/<int:order_id>', methods=['DELETE'])
def delete_order(order_id):
    order = Order.query.get(order_id)
    
    if not order:
        return jsonify({'message': 'Orden no encontrada'}), 404

    db.session.delete(order)
    db.session.commit()

    return jsonify({'message': 'Orden eliminada exitosamente'}), 200
