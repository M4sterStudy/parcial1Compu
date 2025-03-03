# microOrders/orders/models/order_model.py
from db.db import db
from datetime import datetime

class Order(db.Model):
    __tablename__ = 'orders' 

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False)  # Usuario que realizó la orden
    email = db.Column(db.String(255), nullable=False)  # Email del usuario
    saleTotal = db.Column(db.Float, nullable=False)  # Total de la venta
    date = db.Column(db.DateTime, default=datetime.utcnow)  # Fecha y hora de la orden

    def __init__(self, username, email, saleTotal):
        self.username = username
        self.email = email
        self.saleTotal = saleTotal
