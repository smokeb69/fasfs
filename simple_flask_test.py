#!/usr/bin/env python3
"""Simple Flask test server"""

from flask import Flask
from datetime import datetime

app = Flask(__name__)

@app.route('/')
def home():
    return '<h1>BLOOMCRAWLER RIIS Test Server</h1><p>Server is running!</p>'

@app.route('/health')
def health():
    return {
        'status': 'healthy',
        'server': 'Simple Flask Test',
        'timestamp': datetime.now().isoformat()
    }

if __name__ == '__main__':
    print("🚀 Starting simple Flask test server...")
    print("🌐 http://localhost:5000")
    app.run(host='127.0.0.1', port=5000, debug=True)
