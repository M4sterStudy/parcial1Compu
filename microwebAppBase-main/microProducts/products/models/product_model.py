# microProducts/products/models/product_model.py
from db.db import db

class Product(db.Model):
    __tablename__ = 'products' 

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Integer, default=0)
    price = db.Column(db.Float, nullable=False)

    def __init__(self, name, amount, price):
        self.name = name
        self.amount = amount
        self.price = price
