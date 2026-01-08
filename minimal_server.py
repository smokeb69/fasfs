#!/usr/bin/env python3
"""
Minimal BLOOMCRAWLER RIIS Dashboard Server
Just serves the dashboard and monitors npm start
"""

from flask import Flask, render_template_string
from flask_socketio import SocketIO
import subprocess
import threading
import time
import os
from datetime import datetime

app = Flask(__name__)
socketio = SocketIO(app, async_mode='threading', cors_allowed_origins="*")

# Global state
npm_process = None
is_npm_running = False

HTML_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <title>🔥 BLOOMCRAWLER RIIS - Living Dashboard</title>
    <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
    <style>
        body { font-family: Arial, sans-serif; background: #1a1a1a; color: white; margin: 0; padding: 20px; }
        .header { text-align: center; background: linear-gradient(45deg, #ff6b6b, #4ecdc4); padding: 20px; border-radius: 10px; margin-bottom: 20px; }
        .controls { display: flex; gap: 10px; justify-content: center; margin: 20px 0; }
        .btn { padding: 10px 20px; background: #ff6b6b; color: white; border: none; border-radius: 5px; cursor: pointer; }
        .btn:hover { background: #ff5252; }
        .logs { background: #2a2a2a; padding: 15px; border-radius: 10px; height: 400px; overflow-y: auto; font-family: monospace; }
        .log-entry { margin: 5px 0; padding: 5px; border-radius: 3px; }
        .log-info { color: #60a5fa; }
        .log-success { color: #34d399; }
        .log-error { color: #f87171; }
        .status { text-align: center; padding: 10px; background: #333; border-radius: 5px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔥 BLOOMCRAWLER RIIS</h1>
        <p>Living Dashboard - Real-Time System Monitor</p>
    </div>

    <div class="status" id="status">
        Status: Ready to start BLOOMCRAWLER RIIS
    </div>

    <div class="controls">
        <button class="btn" onclick="startBLOOMCRAWLER()">🚀 Start BLOOMCRAWLER RIIS</button>
        <button class="btn" onclick="stopSystem()">🛑 Stop System</button>
        <button class="btn" onclick="clearLogs()">🧹 Clear Logs</button>
    </div>

    <div class="logs" id="logs">
        <div class="log-entry log-info">🔌 Dashboard initialized - Ready for BLOOMCRAWLER RIIS startup</div>
        <div class="log-entry log-info">📦 npm start monitoring enabled</div>
        <div class="log-entry log-info">🌐 WebSocket connection established</div>
    </div>

    <script>
        const socket = io();

        socket.on('npm-output', (data) => {
            addLogEntry(data.message, data.level);
        });

        socket.on('npm-status', (data) => {
            document.getElementById('status').textContent = `Status: ${data.status}`;
        });

        function startBLOOMCRAWLER() {
            addLogEntry('🚀 Starting BLOOMCRAWLER RIIS...', 'info');
            fetch('/api/npm/start', { method: 'POST' })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        addLogEntry('✅ BLOOMCRAWLER RIIS startup initiated', 'success');
                    } else {
                        addLogEntry('❌ Failed to start: ' + data.error, 'error');
                    }
                })
                .catch(error => {
                    addLogEntry('❌ Network error: ' + error.message, 'error');
                });
        }

        function stopSystem() {
            addLogEntry('🛑 Stopping system...', 'warning');
            fetch('/api/npm/stop', { method: 'POST' })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        addLogEntry('✅ System stopped', 'success');
                    }
                });
        }

        function clearLogs() {
            document.getElementById('logs').innerHTML = '';
            addLogEntry('🧹 Logs cleared', 'info');
        }

        function addLogEntry(message, level = 'info') {
            const logsDiv = document.getElementById('logs');
            const entry = document.createElement('div');
            entry.className = `log-entry log-${level}`;
            entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
            logsDiv.appendChild(entry);
            logsDiv.scrollTop = logsDiv.scrollHeight;
        }
    </script>
</body>
</html>
"""

@app.route('/')
def dashboard():
    return render_template_string(HTML_TEMPLATE)

@app.route('/health')
def health():
    return {
        'status': 'healthy',
        'server': 'Minimal BLOOMCRAWLER RIIS Dashboard',
        'npm_running': is_npm_running,
        'timestamp': datetime.now().isoformat()
    }

@app.route('/api/npm/start', methods=['POST'])
def start_npm():
    global npm_process, is_npm_running

    if is_npm_running:
        return {'success': False, 'error': 'Already running'}

    try:
        print(f"🚀 Starting npm from directory: {os.path.dirname(__file__)}")

        # Make sure we're in the right directory and npm is available
        cwd = os.path.dirname(__file__)
        print(f"📂 Working directory: {cwd}")

        # Check if package.json exists
        package_json = os.path.join(cwd, 'package.json')
        if not os.path.exists(package_json):
            return {'success': False, 'error': 'package.json not found in current directory'}

        npm_process = subprocess.Popen(
            ['npm', 'start'],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,  # Capture stderr separately
            text=True,
            cwd=cwd,
            shell=False,  # Don't use shell on Windows
            bufsize=1,    # Line buffered
            universal_newlines=True
        )

        is_npm_running = True
        socketio.emit('npm-status', {'status': 'Starting BLOOMCRAWLER RIIS', 'pid': npm_process.pid})

        # Send initial status
        socketio.emit('npm-output', {
            'message': f'🚀 Starting npm process (PID: {npm_process.pid})',
            'level': 'info'
        })

        # Start monitoring threads for both stdout and stderr
        threading.Thread(target=monitor_npm_output, args=(npm_process.stdout, 'stdout'), daemon=True).start()
        threading.Thread(target=monitor_npm_output, args=(npm_process.stderr, 'stderr'), daemon=True).start()

        return {'success': True, 'message': f'NPM started with PID {npm_process.pid}'}

    except Exception as e:
        print(f"❌ NPM start error: {e}")
        return {'success': False, 'error': str(e)}

@app.route('/api/npm/stop', methods=['POST'])
def stop_npm():
    global npm_process, is_npm_running

    if npm_process and is_npm_running:
        try:
            print(f"🛑 Terminating npm process (PID: {npm_process.pid})")
            npm_process.terminate()

            # Wait a bit for graceful shutdown
            try:
                npm_process.wait(timeout=5)
                print("✅ NPM process terminated gracefully")
            except subprocess.TimeoutExpired:
                print("⚠️  NPM process didn't terminate gracefully, killing...")
                npm_process.kill()
                npm_process.wait()
                print("💀 NPM process killed")

        except Exception as e:
            print(f"❌ Error stopping npm process: {e}")

        npm_process = None
        is_npm_running = False
        socketio.emit('npm-status', {'status': 'Stopped'})
        socketio.emit('npm-output', {
            'message': '🛑 BLOOMCRAWLER RIIS stopped by user',
            'level': 'warning'
        })

    return {'success': True}

@app.route('/api/npm/status', methods=['GET'])
def get_npm_status():
    global npm_process, is_npm_running

    status = {
        'running': is_npm_running,
        'pid': npm_process.pid if npm_process else None,
        'exit_code': npm_process.returncode if npm_process and npm_process.poll() is not None else None
    }

    return {'success': True, 'status': status}

def monitor_npm_output(stream, stream_type):
    """Monitor npm output from a specific stream (stdout/stderr)"""
    global is_npm_running

    try:
        for line in iter(stream.readline, ''):
            if not is_npm_running:
                break

            line = line.strip()
            if line:
                # Determine log level
                level = 'info'
                if '[BLOOM]' in line or '[SYSTEM]' in line or '[ELITE]' in line:
                    level = 'info'
                elif '✅' in line or 'success' in line.lower() or '✓' in line:
                    level = 'success'
                elif '❌' in line or 'error' in line.lower() or '✗' in line:
                    level = 'error'
                elif '⚠️' in line or 'warning' in line.lower():
                    level = 'warning'

                # Send to dashboard
                socketio.emit('npm-output', {
                    'message': line,
                    'level': level,
                    'stream': stream_type
                })

                # Also print to server console
                print(f"[{level.upper()}] {line}")

        # Stream ended
        if is_npm_running:
            socketio.emit('npm-output', {
                'message': f'📄 {stream_type.upper()} stream ended',
                'level': 'warning'
            })

    except Exception as e:
        print(f"❌ Error monitoring {stream_type}: {e}")
        socketio.emit('npm-output', {
            'message': f'❌ Error monitoring {stream_type}: {e}',
            'level': 'error'
        })

def check_npm_process():
    """Check if npm process is still running"""
    global npm_process, is_npm_running

    if npm_process and npm_process.poll() is not None:
        # Process has ended
        exit_code = npm_process.returncode
        is_npm_running = False

        status_msg = f'Stopped (exit code: {exit_code})'
        if exit_code == 0:
            socketio.emit('npm-status', {'status': 'Completed Successfully'})
            socketio.emit('npm-output', {
                'message': '✅ BLOOMCRAWLER RIIS startup completed successfully!',
                'level': 'success'
            })
        else:
            socketio.emit('npm-status', {'status': f'Failed (exit code: {exit_code})'})
            socketio.emit('npm-output', {
                'message': f'❌ BLOOMCRAWLER RIIS startup failed with exit code {exit_code}',
                'level': 'error'
            })

        npm_process = None

def process_monitor():
    """Background thread to monitor npm process status"""
    while True:
        try:
            check_npm_process()
            time.sleep(1)  # Check every second
        except Exception as e:
            print(f"❌ Process monitor error: {e}")
            time.sleep(5)

if __name__ == '__main__':
    print("🚀 Starting Minimal BLOOMCRAWLER RIIS Dashboard...")
    print("🌐 http://localhost:5000")
    print("🎯 This server will capture and display npm start output in real-time")
    print("Press Ctrl+C to stop")

    # Start background process monitor
    monitor_thread = threading.Thread(target=process_monitor, daemon=True)
    monitor_thread.start()
    print("✅ Background process monitor started")

    socketio.run(app, host='127.0.0.1', port=5000, debug=False, log_output=False)
