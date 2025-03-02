from flask import Blueprint, request, jsonify
from orders.models.order_model import Order
from products.models.product_model import Product  # ✅ Importamos Product
from db.db import db

order_controller = Blueprint('order_controller', __name__)

@order_controller.route('/api/orders', methods=['GET'])
def get_orders():
    orders = Order.query.all()
    result = []
    for order in orders:
        order_products = [{'id': p.id, 'name': p.name, 'price': p.price, 'quantity': p.quantity} for p in order.products]

        result.append({
            'id': order.id,
            'name': order.name,
            'description': order.description,
            'price': order.price,
            'quantity': order.quantity,
            'products': order_products  # ✅ Incluir productos en la respuesta
        })
    return jsonify(result)

@order_controller.route('/api/orders/<int:order_id>', methods=['GET'])
def get_order(order_id):
    order = Order.query.get_or_404(order_id)
    order_products = [{'id': p.id, 'name': p.name, 'price': p.price, 'quantity': p.quantity} for p in order.products]

    return jsonify({
        'id': order.id,
        'name': order.name,
        'description': order.description,
        'price': order.price,
        'quantity': order.quantity,
        'products': order_products  # ✅ Incluir productos en la respuesta
    })

@order_controller.route('/api/orders', methods=['POST'])
def create_order():
    data = request.json
    selected_products = data.get('products', [])

    if not selected_products:
        return jsonify({'error': 'Debes seleccionar al menos un producto'}), 400

    total_price = sum(p['price'] * p['quantity'] for p in selected_products)

    new_order = Order(
        name=data['user']['name'],
        description=data.get('description', ''),
        price=total_price,
        quantity=sum(p['quantity'] for p in selected_products)
    )

    db.session.add(new_order)
    db.session.commit()

    return jsonify({'message': 'Orden creada exitosamente'}), 201

@order_controller.route('/api/orders/<int:order_id>', methods=['PUT'])
def update_order(order_id):
    order = Order.query.get_or_404(order_id)
    data = request.json
    order.name = data['name']
    order.description = data.get('description', '')
    order.price = data['price']
    order.quantity = data.get('quantity', order.quantity)  

    db.session.commit()
    return jsonify({'message': 'Order updated successfully'})

@order_controller.route('/api/orders/<int:order_id>', methods=['DELETE'])
def delete_order(order_id):
    order = Order.query.get_or_404(order_id)
    db.session.delete(order)
    db.session.commit()
    return jsonify({'message': 'Order deleted successfully'})
