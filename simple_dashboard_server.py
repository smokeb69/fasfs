#!/usr/bin/env python3
"""
Simple Dashboard Server for BLOOMCRAWLER RIIS
Serves the living dashboard and manages npm start process
"""

import os
import sys
import json
import time
import threading
import subprocess
from datetime import datetime
from flask import Flask, render_template_string, jsonify, request
from flask_socketio import SocketIO, emit
import requests

# Initialize Flask app
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

# Global variables
npm_process = None
system_logs = []
active_containers = []
system_webhooks = []
is_npm_running = False

# HTML template for the dashboard
DASHBOARD_HTML = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🔥 BLOOMCRAWLER RIIS - Living Dashboard</title>
    <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
    <style>
        :root {
            --primary: #ff6b6b;
            --secondary: #4ecdc4;
            --dark: #2c3e50;
            --light: #ecf0f1;
            --glass: rgba(255, 255, 255, 0.1);
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', sans-serif; background: var(--dark); color: var(--light); }
        .container { max-width: 1400px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 40px 20px; background: linear-gradient(135deg, #1a252f 0%, #2c3e50 100%); border-radius: 20px; margin-bottom: 30px; }
        .header h1 { font-size: 3rem; background: linear-gradient(45deg, #ff6b6b, #4ecdc4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 20px; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 30px 0; }
        .stat-card { background: var(--glass); border-radius: 15px; padding: 20px; text-align: center; backdrop-filter: blur(10px); }
        .stat-number { font-size: 2rem; color: var(--primary); font-weight: bold; }
        .nav-tab { padding: 10px 20px; background: var(--glass); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: var(--light); cursor: pointer; margin: 5px; }
        .nav-tab.active { background: var(--primary); }
        .container-page { display: none; background: var(--glass); border-radius: 15px; padding: 20px; margin: 20px 0; }
        .container-page.active { display: block; }
        .log-container { background: rgba(0,0,0,0.3); border-radius: 10px; padding: 15px; height: 400px; overflow-y: auto; font-family: monospace; }
        .log-entry { margin: 5px 0; padding: 5px; border-radius: 4px; }
        .log-info { color: #60a5fa; }
        .log-success { color: #34d399; }
        .log-error { color: #f87171; }
        .log-warning { color: #fbbf24; }
        .btn { padding: 10px 20px; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer; margin: 5px; }
        .webhook-item { background: var(--glass); padding: 15px; margin: 10px 0; border-radius: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>🔥 BLOOMCRAWLER RIIS</h1>
            <p>Living Dashboard - Real-Time System Monitor</p>
            <div style="margin-top: 20px;">
                <button class="btn" onclick="startNPM()">🚀 Start BLOOMCRAWLER</button>
                <button class="btn" onclick="stopNPM()">🛑 Stop System</button>
                <span id="npm-status" style="margin-left: 20px; padding: 5px 15px; background: rgba(255,255,255,0.1); border-radius: 20px;">Status: Stopped</span>
            </div>
        </header>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number" id="container-count">0</div>
                <div>Active Containers</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="webhook-count">0</div>
                <div>Active Webhooks</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="log-count">0</div>
                <div>Log Entries</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="npm-pid">-</div>
                <div>NPM Process</div>
            </div>
        </div>

        <div style="display: flex; gap: 10px; margin: 20px 0; overflow-x: auto;">
            <button onclick="showPage('dashboard')" class="nav-tab active" data-page="dashboard">🏠 Dashboard</button>
            <button onclick="showPage('containers')" class="nav-tab" data-page="containers">🌐 Containers</button>
            <button onclick="showPage('webhooks')" class="nav-tab" data-page="webhooks">🔗 Webhooks</button>
            <button onclick="showPage('logs')" class="nav-tab" data-page="logs">📋 System Logs</button>
        </div>

        <div id="dashboard-page" class="container-page active">
            <h3>🏠 System Overview</h3>
            <p>Welcome to the BLOOMCRAWLER RIIS Living Dashboard. This system provides real-time monitoring and control of your cyber intelligence operations.</p>
            <div style="margin-top: 20px;">
                <h4>Features:</h4>
                <ul style="margin-left: 20px;">
                    <li>🔥 Real-time BLOOMCRAWLER RIIS startup monitoring</li>
                    <li>🌐 Dynamic container system for sub-pages</li>
                    <li>🔗 Self-generating webhook management</li>
                    <li>📊 Live statistics and system metrics</li>
                    <li>🚀 One-click npm start integration</li>
                </ul>
            </div>
        </div>

        <div id="containers-page" class="container-page">
            <h3>🌐 Living Container System</h3>
            <p>Dynamic sub-pages that can be created and managed in real-time.</p>
            <button class="btn" onclick="createContainer()">➕ Create Container</button>
            <div id="containers-list" style="margin-top: 20px;"></div>
        </div>

        <div id="webhooks-page" class="container-page">
            <h3>🔗 Webhook Management</h3>
            <p>Create and manage webhooks that automatically trigger on system events.</p>
            <button class="btn" onclick="createWebhook()">➕ Create Webhook</button>
            <div id="webhooks-list" style="margin-top: 20px;"></div>
        </div>

        <div id="logs-page" class="container-page">
            <h3>📋 System Logs</h3>
            <p>Real-time system output and activity monitoring.</p>
            <div class="log-container" id="system-logs"></div>
        </div>
    </div>

    <script>
        const socket = io();
        let currentPage = 'dashboard';

        socket.on('connect', () => {
            console.log('Connected to server');
        });

        socket.on('npm-output', (data) => {
            addLogEntry(data.message, data.level);
        });

        socket.on('npm-status', (data) => {
            document.getElementById('npm-status').textContent = `Status: ${data.status}`;
            document.getElementById('npm-pid').textContent = data.pid || '-';
        });

        socket.on('stats-update', (data) => {
            document.getElementById('container-count').textContent = data.containers;
            document.getElementById('webhook-count').textContent = data.webhooks;
            document.getElementById('log-count').textContent = data.logs;
        });

        function showPage(pageName) {
            document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
            document.querySelector(`[data-page="${pageName}"]`).classList.add('active');

            document.querySelectorAll('.container-page').forEach(page => page.classList.remove('active'));
            document.getElementById(`${pageName}-page`).classList.add('active');

            currentPage = pageName;
        }

        function startNPM() {
            fetch('/api/npm/start', { method: 'POST' })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        addLogEntry('🚀 Starting BLOOMCRAWLER RIIS...', 'info');
                    } else {
                        addLogEntry('❌ Failed to start npm: ' + data.error, 'error');
                    }
                })
                .catch(error => {
                    addLogEntry('❌ Network error: ' + error.message, 'error');
                });
        }

        function stopNPM() {
            fetch('/api/npm/stop', { method: 'POST' })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        addLogEntry('🛑 Stopping BLOOMCRAWLER RIIS...', 'warning');
                    }
                });
        }

        function createContainer() {
            const name = prompt('Enter container name:');
            if (name) {
                fetch('/api/containers/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: name, type: 'custom' })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        addLogEntry(`🌐 Created container: ${name}`, 'success');
                        updateContainers();
                    }
                });
            }
        }

        function createWebhook() {
            const name = prompt('Enter webhook name:');
            const url = prompt('Enter webhook URL:');
            if (name && url) {
                fetch('/api/webhooks/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: name,
                        url: url,
                        eventType: 'general',
                        method: 'POST'
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        addLogEntry(`🔗 Created webhook: ${name}`, 'success');
                        updateWebhooks();
                    }
                });
            }
        }

        function addLogEntry(message, level = 'info') {
            const logsContainer = document.getElementById('system-logs');
            const logEntry = document.createElement('div');
            logEntry.className = `log-entry log-${level}`;
            logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
            logsContainer.appendChild(logEntry);
            logsContainer.scrollTop = logsContainer.scrollHeight;

            // Update log count
            const count = logsContainer.children.length;
            document.getElementById('log-count').textContent = count;
        }

        function updateContainers() {
            fetch('/api/containers/list')
                .then(response => response.json())
                .then(data => {
                    const container = document.getElementById('containers-list');
                    container.innerHTML = data.containers.map(c =>
                        `<div class="webhook-item">${c.name} (${c.type}) - Created: ${new Date(c.created).toLocaleString()}</div>`
                    ).join('');
                });
        }

        function updateWebhooks() {
            fetch('/api/webhooks/list')
                .then(response => response.json())
                .then(data => {
                    const container = document.getElementById('webhooks-list');
                    container.innerHTML = data.webhooks.map(w =>
                        `<div class="webhook-item">${w.name} → ${w.url} (${w.method})</div>`
                    ).join('');
                });
        }

        // Initial updates
        updateContainers();
        updateWebhooks();
    </script>
</body>
</html>"""

@app.route('/')
def dashboard():
    return render_template_string(DASHBOARD_HTML)

@app.route('/health')
def health():
    return jsonify({
        'status': 'healthy',
        'server': 'Simple Dashboard Server',
        'npm_running': is_npm_running,
        'timestamp': datetime.now().isoformat()
    })

# NPM Process Management
@app.route('/api/npm/start', methods=['POST'])
def start_npm():
    global npm_process, is_npm_running

    if is_npm_running:
        return jsonify({'success': False, 'error': 'NPM already running'})

    try:
        # Start npm start in background
        npm_process = subprocess.Popen(
            ['npm', 'start'],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            cwd=os.path.dirname(__file__),
            shell=True
        )

        is_npm_running = True

        # Start monitoring thread
        threading.Thread(target=monitor_npm_output, daemon=True).start()

        socketio.emit('npm-status', {'status': 'Starting', 'pid': npm_process.pid})

        return jsonify({'success': True, 'message': 'NPM started'})

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/npm/stop', methods=['POST'])
def stop_npm():
    global npm_process, is_npm_running

    if npm_process and is_npm_running:
        try:
            npm_process.terminate()
            npm_process.wait(timeout=5)
        except:
            npm_process.kill()

        npm_process = None
        is_npm_running = False

        socketio.emit('npm-status', {'status': 'Stopped', 'pid': None})

        return jsonify({'success': True, 'message': 'NPM stopped'})

    return jsonify({'success': False, 'error': 'NPM not running'})

def monitor_npm_output():
    """Monitor npm process output and send to WebSocket clients"""
    global npm_process, is_npm_running

    if not npm_process:
        return

    try:
        while is_npm_running and npm_process.poll() is None:
            line = npm_process.stdout.readline()
            if line:
                line = line.strip()
                if line:
                    # Determine log level
                    level = 'info'
                    if '[BLOOM]' in line or '[SYSTEM]' in line or '[ELITE]' in line:
                        level = 'info'
                    elif '✅' in line or 'success' in line.lower():
                        level = 'success'
                    elif '❌' in line or 'error' in line.lower() or 'failed' in line.lower():
                        level = 'error'
                    elif '⚠️' in line or 'warning' in line.lower():
                        level = 'warning'

                    # Send to WebSocket clients
                    socketio.emit('npm-output', {
                        'message': line,
                        'level': level,
                        'timestamp': datetime.now().isoformat()
                    })

                    # Also log locally
                    print(f"[{level.upper()}] {line}")

            time.sleep(0.1)

    except Exception as e:
        print(f"NPM monitoring error: {e}")
    finally:
        is_npm_running = False
        socketio.emit('npm-status', {'status': 'Stopped', 'pid': None})

# Container Management
@app.route('/api/containers/create', methods=['POST'])
def create_container():
    try:
        data = request.get_json()
        container_name = data.get('name', 'New Container')
        container_type = data.get('type', 'custom')

        container = {
            'id': f"container_{int(time.time())}",
            'name': container_name,
            'type': container_type,
            'created': datetime.now().isoformat(),
            'active': True
        }

        active_containers.append(container)

        socketio.emit('stats-update', {
            'containers': len(active_containers),
            'webhooks': len(system_webhooks),
            'logs': len(system_logs)
        })

        return jsonify({'success': True, 'container': container})

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/containers/list', methods=['GET'])
def list_containers():
    return jsonify({
        'success': True,
        'containers': active_containers,
        'count': len(active_containers)
    })

# Webhook Management
@app.route('/api/webhooks/create', methods=['POST'])
def create_webhook():
    try:
        data = request.get_json()
        webhook_name = data.get('name', 'New Webhook')
        event_type = data.get('eventType', 'general')
        url = data.get('url', '')
        method = data.get('method', 'POST')

        if not url:
            return jsonify({'success': False, 'error': 'URL is required'}), 400

        webhook = {
            'id': f"webhook_{int(time.time())}",
            'name': webhook_name,
            'eventType': event_type,
            'url': url,
            'method': method,
            'created': datetime.now().isoformat(),
            'active': True,
            'triggered': 0
        }

        system_webhooks.append(webhook)

        socketio.emit('stats-update', {
            'containers': len(active_containers),
            'webhooks': len(system_webhooks),
            'logs': len(system_logs)
        })

        return jsonify({'success': True, 'webhook': webhook})

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/webhooks/list', methods=['GET'])
def list_webhooks():
    return jsonify({
        'success': True,
        'webhooks': system_webhooks,
        'count': len(system_webhooks)
    })

# WebSocket events
@socketio.on('connect')
def handle_connect():
    print('Client connected')
    emit('stats-update', {
        'containers': len(active_containers),
        'webhooks': len(system_webhooks),
        'logs': len(system_logs)
    })

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    print("🚀 Starting Simple BLOOMCRAWLER RIIS Dashboard Server...")
    print("=" * 60)
    print("🌐 Dashboard: http://localhost:5000")
    print("🔌 WebSocket: ws://localhost:5000/socket.io/")
    print("🎯 Features:")
    print("   - Live npm start monitoring")
    print("   - Dynamic container system")
    print("   - Self-generating webhooks")
    print("   - Real-time system logs")
    print("=" * 60)
    print("Press Ctrl+C to stop...")

    try:
        socketio.run(app, host='127.0.0.1', port=5000, debug=True, log_output=True)
    except KeyboardInterrupt:
        print("\n🛑 Shutting down server...")
        if npm_process and is_npm_running:
            print("Stopping npm process...")
            npm_process.terminate()
        sys.exit(0)
