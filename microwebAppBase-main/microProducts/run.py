# microProducts/run.py
from products.views import app

if __name__ == '__main__':
    # Corre la aplicación en el puerto 5003
    app.run(host='0.0.0.0', port=5003)
