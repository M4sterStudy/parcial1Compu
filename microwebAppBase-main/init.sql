CREATE DATABASE IF NOT EXISTS myflaskapp;
USE myflaskapp;

CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    username VARCHAR(255),
    password VARCHAR(255)
);

INSERT INTO users VALUES
(null, "juan", "juan@gmail.com", "juan", "123"),
(null, "maria", "maria@gmail.com", "maria", "456");

CREATE TABLE IF NOT EXISTS products (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    amount INT(9),
    price FLOAT NOT NULL
);

INSERT INTO products (name, amount, price)
VALUES
('Laptop', 7, 650.99),
('Smartphone', 8, 299.50),
('Auriculares', 10, 45.00);

CREATE TABLE IF NOT EXISTS orders (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    saleTotal DECIMAL(10,2),
    date DATETIME DEFAULT CURRENT_TIMESTAMP
);
