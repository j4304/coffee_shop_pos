import os
import psycopg2
from flask import Flask, jsonify
from flask_cors import CORS 

app = Flask(__name__)

frontend_url = os.environ.get('FRONTEND_URL')

if frontend_url:
    CORS(app, origins=[frontend_url])
else:
    CORS(app) 

def get_db_connection():
    conn_string = os.environ.get('DATABASE_URL')
    try:
        conn = psycopg2.connect(conn_string)
        return conn
    except Exception as e:
        print(f"Error connecting to database: {e}")
        return None

@app.route('/')
def index():
    conn = get_db_connection()
    if conn:
        conn.close()
        return jsonify(message="Success: Backend is running and connected to Neon DB!")
    else:
        return jsonify(message="Error: Backend is running but FAILED to connect to DB."), 500

if __name__ == '__main__':
    app.run(debug=True)