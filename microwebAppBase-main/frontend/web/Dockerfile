# Usa Python 3.9 como base
FROM python:3.9

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos del frontend al contenedor
COPY . /app

# Instala las dependencias si tienes un archivo requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Expone el puerto 5001 para la aplicación Flask
EXPOSE 5001

# Comando para ejecutar Flask
CMD ["python", "run.py"]

