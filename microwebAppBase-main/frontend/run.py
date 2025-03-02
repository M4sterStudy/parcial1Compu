from flask import Flask, render_template
from web.views import app

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=5001)
