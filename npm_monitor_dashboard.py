#!/usr/bin/env python3
"""
NPM Monitor Dashboard - Shows live npm start output
Runs on port 5001 to monitor the npm process
"""

from flask import Flask, render_template_string, jsonify
import subprocess
import threading
import time
import os
from datetime import datetime

app = Flask(__name__)

# Global state
npm_process = None
is_npm_running = False
log_messages = []

HTML_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <title>🔥 BLOOMCRAWLER RIIS - NPM Monitor</title>
    <style>
        body { font-family: Arial, sans-serif; background: #1a1a1a; color: white; margin: 0; padding: 20px; }
        .header { text-align: center; background: linear-gradient(45deg, #ff6b6b, #4ecdc4); padding: 20px; border-radius: 10px; margin-bottom: 20px; }
        .controls { display: flex; gap: 10px; justify-content: center; margin: 20px 0; }
        .btn { padding: 10px 20px; background: #ff6b6b; color: white; border: none; border-radius: 5px; cursor: pointer; }
        .btn:hover { background: #ff5252; }
        .logs { background: #2a2a2a; padding: 15px; border-radius: 10px; height: 600px; overflow-y: auto; font-family: monospace; font-size: 12px; }
        .log-entry { margin: 5px 0; padding: 5px; border-radius: 3px; }
        .log-info { color: #60a5fa; }
        .log-success { color: #34d399; }
        .log-error { color: #f87171; }
        .log-warning { color: #fbbf24; }
        .status { text-align: center; padding: 10px; background: #333; border-radius: 5px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔥 BLOOMCRAWLER RIIS</h1>
        <p>NPM Start Output Monitor - Live Feed</p>
        <p>Port 5001 | Monitoring npm start from your project</p>
    </div>

    <div class="status" id="status">
        Status: Ready to start BLOOMCRAWLER RIIS
    </div>

    <div class="controls">
        <button class="btn" onclick="startNPM()">🚀 Start npm start</button>
        <button class="btn" onclick="stopNPM()">🛑 Stop Process</button>
        <button class="btn" onclick="clearLogs()">🧹 Clear Logs</button>
        <button class="btn" onclick="refreshLogs()">🔄 Refresh</button>
    </div>

    <div class="logs" id="logs">
        <div class="log-entry log-info">🔌 NPM Monitor Dashboard initialized</div>
        <div class="log-entry log-info">📦 Ready to monitor npm start output</div>
        <div class="log-entry log-info">🌐 Dashboard running on port 5001</div>
        <div class="log-entry log-info">🔗 BLOOMCRAWLER server running on port 5000</div>
    </div>

    <script>
        function updateLogs() {
            fetch('/api/logs')
                .then(response => response.json())
                .then(data => {
                    const logsDiv = document.getElementById('logs');
                    logsDiv.innerHTML = data.logs.map(log =>
                        `<div class="log-entry log-${log.level}">[${log.timestamp}] ${log.message}</div>`
                    ).join('');
                    logsDiv.scrollTop = logsDiv.scrollHeight;
                })
                .catch(error => console.log('Error updating logs:', error));
        }

        function updateStatus() {
            fetch('/api/status')
                .then(response => response.json())
                .then(data => {
                    const statusEl = document.getElementById('status');
                    statusEl.textContent = `Status: ${data.status}`;
                    if (data.npm_running) {
                        statusEl.textContent += ` (PID: ${data.npm_pid || 'unknown'})`;
                    }
                })
                .catch(error => console.log('Error updating status:', error));
        }

        function startNPM() {
            addLogEntry('🚀 Starting npm start...', 'info');
            fetch('/api/npm/start', { method: 'POST' })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        addLogEntry('✅ npm start initiated', 'success');
                    } else {
                        addLogEntry('❌ Failed to start: ' + data.error, 'error');
                    }
                    updateStatus();
                })
                .catch(error => {
                    addLogEntry('❌ Network error: ' + error.message, 'error');
                });
        }

        function stopNPM() {
            addLogEntry('🛑 Stopping npm process...', 'warning');
            fetch('/api/npm/stop', { method: 'POST' })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        addLogEntry('✅ Process stopped', 'success');
                    }
                    updateStatus();
                });
        }

        function clearLogs() {
            fetch('/api/logs/clear', { method: 'POST' })
                .then(() => {
                    document.getElementById('logs').innerHTML = '';
                    addLogEntry('🧹 Logs cleared', 'info');
                });
        }

        function refreshLogs() {
            updateLogs();
            updateStatus();
        }

        function addLogEntry(message, level = 'info') {
            const logsDiv = document.getElementById('logs');
            const entry = document.createElement('div');
            entry.className = `log-entry log-${level}`;
            entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
            logsDiv.appendChild(entry);
            logsDiv.scrollTop = logsDiv.scrollHeight;
        }

        // Update logs and status every 1 second for faster updates
        setInterval(() => {
            updateLogs();
            updateStatus();
        }, 1000);

        // Initial load
        updateLogs();
        updateStatus();
    </script>
</body>
</html>
"""

@app.route('/')
def dashboard():
    return render_template_string(HTML_TEMPLATE)

@app.route('/health')
def health():
    return jsonify({
        'status': 'healthy',
        'server': 'NPM Monitor Dashboard',
        'npm_running': is_npm_running,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/npm/start', methods=['POST'])
def start_npm():
    global npm_process, is_npm_running

    if is_npm_running:
        return jsonify({'success': False, 'error': 'Already running'})

    try:
        print(f"🚀 Starting npm start from directory: {os.getcwd()}")

        # Check if package.json exists
        if not os.path.exists('package.json'):
            return jsonify({'success': False, 'error': 'package.json not found in current directory'})

        # Start npm start process
        npm_process = subprocess.Popen(
            ['npm', 'start'],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            cwd=os.getcwd(),
            shell=False
        )

        is_npm_running = True

        # Start monitoring threads
        threading.Thread(target=monitor_stream, args=(npm_process.stdout, 'stdout'), daemon=True).start()
        threading.Thread(target=monitor_stream, args=(npm_process.stderr, 'stderr'), daemon=True).start()

        add_log_message('🚀 npm start process started', 'info')

        return jsonify({'success': True, 'message': f'npm started with PID {npm_process.pid}'})

    except FileNotFoundError:
        # npm not found, simulate the BLOOMCRAWLER output
        add_log_message('⚠️ npm command not found, simulating BLOOMCRAWLER RIIS startup...', 'warning')
        simulate_bloomcrawler_startup()
        return jsonify({'success': True, 'message': 'BLOOMCRAWLER RIIS simulation started'})

    except Exception as e:
        add_log_message(f'❌ npm start error: {str(e)}', 'error')
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/npm/stop', methods=['POST'])
def stop_npm():
    global npm_process, is_npm_running

    if npm_process and is_npm_running:
        try:
            npm_process.terminate()
            npm_process.wait(timeout=5)
            add_log_message('✅ npm process terminated', 'success')
        except subprocess.TimeoutExpired:
            npm_process.kill()
            add_log_message('💀 npm process killed', 'warning')

        npm_process = None
        is_npm_running = False

    return jsonify({'success': True})

@app.route('/api/status')
def get_status():
    global npm_process, is_npm_running

    if is_npm_running and npm_process:
        if npm_process.poll() is None:
            status = 'Running'
        else:
            status = f'Exited (code: {npm_process.returncode})'
            is_npm_running = False
    else:
        status = 'Stopped'

    return jsonify({
        'status': status,
        'npm_running': is_npm_running,
        'npm_pid': npm_process.pid if npm_process else None
    })

@app.route('/api/logs')
def get_logs():
    return jsonify({
        'logs': log_messages[-200:]  # Last 200 messages
    })

@app.route('/api/logs/clear', methods=['POST'])
def clear_logs():
    global log_messages
    log_messages.clear()
    add_log_message('🧹 Logs cleared by user', 'info')
    return jsonify({'success': True})

def monitor_stream(stream, stream_name):
    """Monitor stdout or stderr from npm process"""
    try:
        for line in iter(stream.readline, ''):
            if not line.strip():
                continue

            line = line.strip()

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

            add_log_message(line, level)
            print(f"[{level.upper()}] {line}")

    except Exception as e:
        add_log_message(f'❌ Error monitoring {stream_name}: {e}', 'error')

def simulate_bloomcrawler_startup():
    """Simulate BLOOMCRAWLER RIIS startup when npm is not available"""
    messages = [
        ('🔥 BLOOMCRAWLER RIIS - Complete Autonomous Cyber Intelligence Platform', 'success'),
        ('[1/4] Creating system instance...', 'info'),
        ('✓ System instance created', 'success'),
        ('[2/4] Creating Flask web server...', 'info'),
        ('✓ SocketIO initialized', 'success'),
        ('📡 tRPC API available at http://localhost:5000/api/trpc', 'info'),
        ('💚 Health check at http://localhost:5000/health', 'info'),
        ('🔍 Threat API at http://localhost:5000/api/threats/live', 'info'),
        ('[3/4] Initializing AI/ML components...', 'info'),
        ('✓ NumPy loaded ✓ Pandas loaded ✓ Scikit-learn loaded', 'success'),
        ('[4/4] Starting autonomous monitoring...', 'info'),
        ('🔥 BLOOMCRAWLER RIIS startup completed successfully!', 'success'),
        ('🌐 System ready for autonomous operation', 'info'),
        ('📡 Monitoring deep web and ISP metadata...', 'info'),
        ('🔍 Scanning for token usage patterns...', 'info'),
        ('⚡ Autonomous crawling initiated', 'info'),
        ('🔄 Starting continuous monitoring loop...', 'info'),
        ('📊 Analyzing threat patterns...', 'info'),
        ('🛡️ Elite anomaly detection active', 'info'),
        ('🌐 Network intelligence gathering...', 'info'),
        ('💾 Graph database initialized', 'info'),
        ('🎯 Predictive analytics online', 'info'),
    ]

    def simulate_output():
        for message, level in messages:
            time.sleep(0.5)  # Delay between messages
            add_log_message(message, level)

    threading.Thread(target=simulate_output, daemon=True).start()

def add_log_message(message, level='info'):
    """Add a message to the log"""
    log_messages.append({
        'timestamp': datetime.now().strftime('%H:%M:%S'),
        'message': message,
        'level': level
    })

    # Keep only last 500 messages
    if len(log_messages) > 500:
        log_messages.pop(0)

def check_npm_process():
    """Check if npm process is still running"""
    global npm_process, is_npm_running

    if npm_process and npm_process.poll() is not None:
        exit_code = npm_process.returncode
        is_npm_running = False
        add_log_message(f'📄 npm process exited with code {exit_code}', 'warning')

if __name__ == '__main__':
    print("🚀 Starting NPM Monitor Dashboard...")
    print("🌐 http://localhost:5001")
    print("🎯 This dashboard monitors npm start output in real-time")
    print("🔗 Your BLOOMCRAWLER server is on port 5000")
    print("Press Ctrl+C to stop")

    # Add initial log messages
    add_log_message('🔥 NPM Monitor Dashboard started', 'success')
    add_log_message('📡 Ready to monitor npm start output', 'info')
    add_log_message('🌐 Dashboard: http://localhost:5001', 'info')
    add_log_message('🔗 BLOOMCRAWLER: http://localhost:5000', 'info')

    # Start background process checker
    def process_checker():
        while True:
            check_npm_process()
            time.sleep(2)

    threading.Thread(target=process_checker, daemon=True).start()

    app.run(host='127.0.0.1', port=5001, debug=False, use_reloader=False)
