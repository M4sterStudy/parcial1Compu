# microProducts/products/views.py
from flask import Flask, jsonify
from flask_cors import CORS
from flask_consulate import Consul
from products.controllers.product_controller import product_controller
from db.db import db

app = Flask(__name__)
CORS(app)
app.config.from_object('config.Config')

# Inicializar la base de datos
db.init_app(app)

# Inicializar Consul
consul = Consul(app=app)
consul.apply_remote_config(namespace='products-service/')

# Endpoint de Health Check
@app.route('/healthcheck', methods=['GET'])
def health_check():
    """
    Endpoint que Consul usará para verificar el estado del microservicio.
    """
    return jsonify(status="OK", service="products-service"), 200

# Registrar Blueprint
app.register_blueprint(product_controller)

# Registrar el servicio en Consul
consul.register_service(
    name="products-service",
    interval="10s",  # Cada 10 segundos Consul verificará el estado
    tags=["flask", "products"],
    port=5003,
    httpcheck="http://microproducts:5003/healthcheck"
)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003)
