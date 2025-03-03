from flask import Flask, render_template
from flask_cors import CORS

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://192.168.100.3:5001", "http://localhost:5001"])
app.config.from_object('config.Config')

# Ruta para renderizar el template index.html
@app.route('/')
def home():
    return render_template('index.html')

# Ruta para renderizar el template users.html
@app.route('/users')
def users():
    return render_template('users.html')

@app.route('/editUser/<string:id>')
def edit_user(id):
    print("id recibido",id)
    return render_template('editUser.html', id=id)

@app.route('/products')
def products():
    return render_template('products.html')

@app.route('/editProduct/<string:id>')
def edit_product(id):
    return render_template('editProduct.html', id=id)

@app.route('/orders')
def orders():
    return render_template('orders.html')

@app.route('/ordersDetails')
def ordersDetials():
    return render_template('orderDetails.html')

@app.route('/editOrder/<string:id>')
def edit_order(id):
    return render_template('editOrder.html', id=id)

from flask import Flask, request, jsonify

from flask import Flask, jsonify

@app.route('/api/login', methods=['OPTIONS'])
def preflight():
    response = jsonify({'message': 'CORS preflight successful'})
    response.headers['Access-Control-Allow-Origin'] = 'http://192.168.100.3:5001'
    response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response, 200

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')


if __name__ == '__main__':
    app.run()
