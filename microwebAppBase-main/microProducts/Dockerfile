FROM python:3.9

WORKDIR /app

COPY requirements.txt .
COPY . .

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5003

CMD ["python", "run.py"]
