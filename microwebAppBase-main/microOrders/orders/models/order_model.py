# microProducts/products/models/product_model.py
from db.db import db

class Order(db.Model):
    __tablename__ = 'orders' 

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=True)
    price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1) 

    def __init__(self, name, description, price, quantity=1):
        self.name = name
        self.description = description
        self.price = price
        self.quantity = quantity 
