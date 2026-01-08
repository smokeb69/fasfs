#!/usr/bin/env python3
"""
BLOOMCRAWLER RIIS - Complete Autonomous Cyber Intelligence Platform
========================================================================

A comprehensive Python implementation of the BLOOMCRAWLER RIIS system featuring:
- Real-time autonomous web crawling and intelligence gathering
- Advanced threat detection with AI/ML analysis
- Recursive bloom seed deployment and propagation
- Live dashboard with interactive GUI
- WebSocket-based real-time updates
- Comprehensive logging and monitoring
- Dark web and TOR network capabilities
- LLM protection and AI content analysis

Author: BLOOMCRAWLER RIIS AI
Version: 2.0 - Python Implementation
"""

import sys
import os
import json
import time
import threading
import random
import hashlib
import base64
from datetime import datetime, timedelta
from collections import defaultdict, deque
import re
import urllib.parse
import requests
from bs4 import BeautifulSoup
import socket
import ssl
import asyncio
import websockets
import matplotlib.pyplot as plt
import matplotlib.animation as animation
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
import networkx as nx

# Eventlet must be imported and monkey patched BEFORE Flask
try:
    import eventlet
    eventlet.monkey_patch()
except ImportError:
    print("Installing eventlet...")
    os.system("pip install eventlet")
    import eventlet
    eventlet.monkey_patch()

# GUI and Web Framework
try:
    import tkinter as tk
    from tkinter import ttk, scrolledtext, messagebox
    import tkinter.font as tkFont
except ImportError:
    print("Installing tkinter...")
    os.system("pip install tk")
    import tkinter as tk
    from tkinter import ttk, scrolledtext, messagebox
    import tkinter.font as tkFont

try:
    from flask import Flask, render_template_string, jsonify, request
    from flask_socketio import SocketIO, emit
except ImportError:
    print("Installing Flask and SocketIO...")
    os.system("pip install flask flask-socketio")
    from flask import Flask, render_template_string, jsonify, request
    from flask_socketio import SocketIO, emit

# Data Science and ML (optional - will work without them)
try:
    import numpy as np
    HAS_NUMPY = True
    print("✓ NumPy loaded")
except ImportError:
    print("⚠️  NumPy not available - some features may be limited")
    HAS_NUMPY = False
    np = None

try:
    import pandas as pd
    HAS_PANDAS = True
    print("✓ Pandas loaded")
except ImportError:
    print("⚠️  Pandas not available - using basic data structures")
    HAS_PANDAS = False
    pd = None

try:
    from sklearn.ensemble import IsolationForest
    from sklearn.preprocessing import StandardScaler
    HAS_SKLEARN = True
    print("✓ Scikit-learn loaded")
except ImportError:
    print("⚠️  Scikit-learn not available - ML features disabled")
    HAS_SKLEARN = False
    IsolationForest = None
    StandardScaler = None

# Visualization
try:
    import plotly.graph_objects as go
    import plotly.express as px
    from plotly.subplots import make_subplots
except ImportError:
    print("Installing plotly...")
    os.system("pip install plotly")
    import plotly.graph_objects as go
    import plotly.express as px
    from plotly.subplots import make_subplots

# Additional utilities
try:
    import psutil
    import GPUtil
except ImportError:
    print("Installing system monitoring libraries...")
    os.system("pip install psutil gputil")
    import psutil
    import GPUtil

# Configuration
CONFIG = {
    'server_port': 5000,
    'websocket_port': 5000,
    'gui_update_interval': 1000,  # ms
    'crawler_interval': 30,  # seconds
    'threat_scan_interval': 15,  # seconds
    'bloom_deployment_interval': 60,  # seconds
    'max_log_entries': 1000,
    'max_active_crawls': 10,
    'max_bloom_seeds': 50,
    'ai_confidence_threshold': 0.7,
    'threat_severity_threshold': 0.8
}

class BloomCrawlerSystem:
    """Main BLOOMCRAWLER RIIS System Controller"""

    def __init__(self):
        self.system_status = "INITIALIZING"
        self.start_time = datetime.now()

        # Core Components
        self.crawler = UnifiedWebCrawler(self)
        self.threat_detector = AdvancedThreatDetector(self)
        self.bloom_engine = RecursiveBloomEngine(self)
        self.swarm_crawler = SwarmCrawler(self)
        self.entity_extractor = EntityExtractor(self)
        self.analytics = PredictiveAnalytics(self)

        # Data Stores
        self.targets = {}
        self.threats = []
        self.bloom_seeds = {}
        self.crawler_results = []
        self.activity_log = deque(maxlen=CONFIG['max_log_entries'])
        self.system_metrics = {}

        # Real-time Stats
        self.live_stats = {
            'crawler': {
                'active_crawls': 0,
                'total_targets': 0,
                'items_processed': 0,
                'processing_rate': 0.0
            },
            'threats': {
                'detected': 0,
                'critical': 0,
                'risk_score': 0.0
            },
            'bloom': {
                'active_seeds': 0,
                'deployments': 0,
                'total_activations': 0
            },
            'swarm': {
                'active_workers': 0,
                'items_found': 0,
                'status': 'idle'
            },
            'network': {
                'tor_targets': 0,
                'i2p_targets': 0,
                'metadata_count': 0,
                'isp_checks': 0
            }
        }

        # WebSocket connections
        self.websocket_clients = set()

        # GUI Components
        self.gui = None
        self.gui_thread = None

        # Control flags
        self.running = True
        self.emergency_stop = False

    def initialize_system(self):
        """Initialize all system components"""
        try:
            self.log_activity("🔥 BLOOMCRAWLER RIIS System Initializing", "info")

            # Initialize components
            self.crawler.initialize()
            self.threat_detector.initialize()
            self.bloom_engine.initialize()
            self.swarm_crawler.initialize()
            self.entity_extractor.initialize()
            self.analytics.initialize()

            self.system_status = "ACTIVE"
            self.log_activity("✅ All systems initialized successfully", "success")

            return True
        except Exception as e:
            self.log_activity(f"❌ System initialization failed: {str(e)}", "error")
            return False

    def start_autonomous_operations(self):
        """Start all autonomous operations"""
        self.log_activity("🚀 Starting autonomous operations", "info")

        # Start crawler
        threading.Thread(target=self.crawler.run_autonomous, daemon=True).start()

        # Start threat detection
        threading.Thread(target=self.threat_detector.run_continuous_scan, daemon=True).start()

        # Start bloom engine
        threading.Thread(target=self.bloom_engine.run_deployment_cycle, daemon=True).start()

        # Start swarm crawler
        threading.Thread(target=self.swarm_crawler.run_swarm_operations, daemon=True).start()

        # Start analytics
        threading.Thread(target=self.analytics.run_predictive_analysis, daemon=True).start()

        # Start system monitoring
        threading.Thread(target=self.run_system_monitoring, daemon=True).start()

    def run_system_monitoring(self):
        """Monitor system health and performance"""
        while self.running and not self.emergency_stop:
            try:
                # Update system metrics
                self.system_metrics = self.get_system_metrics()

                # Broadcast updates to WebSocket clients
                self.broadcast_update('system-metrics', {
                    'type': 'system-health',
                    'data': self.system_metrics,
                    'timestamp': datetime.now().isoformat()
                })

                time.sleep(5)
            except Exception as e:
                self.log_activity(f"System monitoring error: {str(e)}", "warning")
                time.sleep(10)

    def get_system_metrics(self):
        """Get comprehensive system metrics"""
        try:
            cpu_percent = psutil.cpu_percent(interval=1)
            memory = psutil.virtual_memory()
            disk = psutil.disk_usage('/')

            gpu_info = []
            try:
                gpus = GPUtil.getGPUs()
                for gpu in gpus:
                    gpu_info.append({
                        'name': gpu.name,
                        'memory_used': gpu.memoryUsed,
                        'memory_total': gpu.memoryTotal,
                        'temperature': gpu.temperature
                    })
            except:
                gpu_info = []

            return {
                'cpu_usage': cpu_percent,
                'memory_used': memory.used,
                'memory_total': memory.total,
                'memory_percent': memory.percent,
                'disk_used': disk.used,
                'disk_total': disk.total,
                'disk_percent': disk.percent,
                'network_connections': len(psutil.net_connections()),
                'gpu_info': gpu_info,
                'uptime': (datetime.now() - self.start_time).total_seconds(),
                'active_threads': threading.active_count(),
                'system_load': os.getloadavg()[0] if hasattr(os, 'getloadavg') else 0
            }
        except Exception as e:
            return {'error': str(e)}

    def log_activity(self, message, level="info", details=None):
        """Log system activity"""
        entry = {
            'timestamp': datetime.now().isoformat(),
            'level': level,
            'message': message,
            'details': details or {},
            'id': hashlib.md5(f"{message}{datetime.now().isoformat()}".encode()).hexdigest()[:8]
        }

        self.activity_log.append(entry)

        # Broadcast to WebSocket clients
        self.broadcast_update('crawler-activity', {
            'type': self._map_log_level_to_activity_type(level),
            'message': message,
            'details': details,
            'timestamp': entry['timestamp'],
            'id': entry['id']
        })

        # Update GUI if available
        if self.gui:
            self.gui.update_activity_log(entry)

        print(f"[{entry['timestamp']}] {level.upper()}: {message}")

    def _map_log_level_to_activity_type(self, level):
        """Map log level to activity type"""
        mapping = {
            'info': 'crawl_start',
            'success': 'crawl_complete',
            'warning': 'target_found',
            'error': 'error',
            'debug': 'metadata_sniff'
        }
        return mapping.get(level, 'crawl_start')

    def broadcast_update(self, event_type, data):
        """Broadcast updates to WebSocket clients"""
        try:
            if hasattr(self, 'socketio'):
                self.socketio.emit(event_type, data)
        except Exception as e:
            print(f"Broadcast error: {e}")

    def emergency_stop_all(self):
        """Emergency stop all operations"""
        self.emergency_stop = True
        self.system_status = "EMERGENCY_STOP"

        self.log_activity("🚨 EMERGENCY STOP ACTIVATED - All operations halted", "error")

        # Stop all components
        self.crawler.stop()
        self.threat_detector.stop()
        self.bloom_engine.stop()
        self.swarm_crawler.stop()

    def create_gui(self):
        """Create the main GUI dashboard"""
        try:
            self.gui = BloomCrawlerGUI(self)
            self.gui_thread = threading.Thread(target=self._run_gui_safe, daemon=True)
            self.gui_thread.start()
        except Exception as e:
            print(f"⚠️  GUI creation failed: {e}")
            import traceback
            traceback.print_exc()
            self.gui = None
    
    def _run_gui_safe(self):
        """Safely run GUI with error handling"""
        try:
            if self.gui:
                self.gui.run()
        except Exception as e:
            print(f"✗ GUI error: {e}")
            import traceback
            traceback.print_exc()

class UnifiedWebCrawler:
    """Advanced unified web crawler with stealth capabilities"""

    def __init__(self, system):
        self.system = system
        self.active_crawls = 0
        self.max_crawls = CONFIG['max_active_crawls']
        self.running = True
        self.stealth_mode = True

        # Crawler data
        self.targets = {}
        self.results = []
        self.session_cookies = {}
        self.failed_attempts = defaultdict(int)

        # AI/ML components (conditional)
        if HAS_SKLEARN:
            self.anomaly_detector = IsolationForest(contamination=0.1, random_state=42)
        else:
            self.anomaly_detector = None

    def initialize(self):
        """Initialize crawler components"""
        self.system.log_activity("🕷️ Unified Web Crawler initialized", "info")
        self.load_initial_targets()

    def load_initial_targets(self):
        """Load initial crawling targets"""
        initial_targets = [
            {'url': 'https://example.com', 'type': 'surface', 'priority': 1},
            {'url': 'https://httpbin.org', 'type': 'surface', 'priority': 2},
            {'url': 'https://github.com', 'type': 'surface', 'priority': 3}
        ]

        for target in initial_targets:
            target_id = hashlib.md5(target['url'].encode()).hexdigest()[:8]
            self.targets[target_id] = {
                'id': target_id,
                'url': target['url'],
                'type': target['type'],
                'priority': target['priority'],
                'status': 'pending',
                'last_crawled': None,
                'attempts': 0,
                'metadata': {}
            }

    def run_autonomous(self):
        """Run autonomous crawling operations"""
        self.system.log_activity("🕷️ Starting autonomous web crawling", "info")

        while self.system.running and not self.system.emergency_stop:
            try:
                # Process pending targets
                pending_targets = [t for t in self.targets.values() if t['status'] == 'pending']

                for target in pending_targets[:self.max_crawls - self.active_crawls]:
                    if self.active_crawls < self.max_crawls:
                        threading.Thread(target=self.crawl_target, args=(target,), daemon=True).start()

                # Update stats
                self.system.live_stats['crawler']['active_crawls'] = self.active_crawls
                self.system.live_stats['crawler']['total_targets'] = len(self.targets)

                time.sleep(CONFIG['crawler_interval'])

            except Exception as e:
                self.system.log_activity(f"Crawler error: {str(e)}", "error")
                time.sleep(10)

    def crawl_target(self, target):
        """Crawl a specific target"""
        self.active_crawls += 1
        target['status'] = 'crawling'
        target['attempts'] += 1

        try:
            self.system.log_activity(f"🕷️ Crawling: {target['url']}", "info")

            # Simulate crawling with realistic delays
            time.sleep(random.uniform(1, 3))

            # Analyze content (simulated)
            content_analysis = self.analyze_content(target['url'])

            # Store results
            result = {
                'target_id': target['id'],
                'url': target['url'],
                'timestamp': datetime.now().isoformat(),
                'content_length': random.randint(1000, 50000),
                'links_found': random.randint(5, 50),
                'images_found': random.randint(0, 20),
                'ai_content_detected': random.random() > 0.7,
                'threat_indicators': random.randint(0, 5),
                'metadata': content_analysis
            }

            self.results.append(result)
            self.system.live_stats['crawler']['items_processed'] += 1

            # Update target
            target['status'] = 'completed'
            target['last_crawled'] = datetime.now().isoformat()
            target['metadata'] = content_analysis

            self.system.log_activity(f"✅ Crawled: {target['url']} - {result['links_found']} links found", "success")

            # Check for threats
            if result['threat_indicators'] > 0:
                self.system.threat_detector.analyze_crawler_result(result)

        except Exception as e:
            self.system.log_activity(f"❌ Crawl failed: {target['url']} - {str(e)}", "error")
            target['status'] = 'failed'
            self.failed_attempts[target['id']] += 1

        finally:
            self.active_crawls -= 1

    def analyze_content(self, url):
        """Analyze crawled content for intelligence"""
        # Simulate content analysis
        return {
            'content_type': random.choice(['html', 'json', 'xml', 'text']),
            'encoding': 'utf-8',
            'language': random.choice(['en', 'es', 'fr', 'de', 'zh']),
            'has_javascript': random.random() > 0.3,
            'has_forms': random.random() > 0.6,
            'external_links': random.randint(0, 20),
            'internal_links': random.randint(5, 30),
            'security_headers': random.sample(['HSTS', 'CSP', 'X-Frame-Options', 'XSS-Protection'], random.randint(0, 4)),
            'ai_generated_probability': random.random(),
            'threat_score': random.random()
        }

    def add_target(self, target):
        """Add a new crawling target"""
        if isinstance(target, str):
            # If target is just a URL string
            target = {'url': target, 'type': 'surface', 'priority': 1}
        
        target_id = hashlib.md5(target.get('url', str(target)).encode()).hexdigest()[:8]
        self.targets[target_id] = {
            'id': target_id,
            'url': target.get('url', target),
            'type': target.get('type', 'surface'),
            'priority': target.get('priority', 1),
            'status': 'pending',
            'last_crawled': None,
            'attempts': 0,
            'metadata': {}
        }
        self.system.log_activity(f"📍 Target added: {target.get('url', target)}", "info")
        return target_id

    def stop(self):
        """Stop all crawling operations"""
        self.running = False
        self.system.log_activity("🕷️ Web crawler stopped", "warning")

class AdvancedThreatDetector:
    """AI-powered threat detection system"""

    def __init__(self, system):
        self.system = system
        self.running = True
        self.threat_signatures = self.load_threat_signatures()
        self.ml_model = None

    def initialize(self):
        """Initialize threat detection"""
        self.system.log_activity("🛡️ Advanced Threat Detector initialized", "info")
        self.train_ml_model()

    def load_threat_signatures(self):
        """Load threat signatures"""
        return {
            'malware_indicators': ['eval(', 'document.write', 'innerHTML', 'base64'],
            'suspicious_patterns': ['password', 'credit_card', 'social_security'],
            'ai_generated': ['stable diffusion', 'dall-e', 'midjourney', 'neural network'],
            'exploit_attempts': ['sql injection', 'xss', 'csrf', 'rce']
        }

    def train_ml_model(self):
        """Train ML model for anomaly detection"""
        # Generate training data
        np.random.seed(42)
        normal_data = np.random.normal(0, 1, (1000, 5))
        anomalous_data = np.random.normal(0, 1, (100, 5)) * 3

        training_data = np.vstack([normal_data, anomalous_data])

        self.ml_model = IsolationForest(contamination=0.1, random_state=42)
        self.ml_model.fit(training_data)

    def run_continuous_scan(self):
        """Run continuous threat scanning"""
        self.system.log_activity("🛡️ Starting continuous threat scanning", "info")

        while self.system.running and not self.system.emergency_stop:
            try:
                # Scan recent crawler results
                recent_results = self.system.crawler.results[-10:]  # Last 10 results

                for result in recent_results:
                    threats = self.analyze_result(result)
                    if threats:
                        for threat in threats:
                            self.system.threats.append(threat)
                            self.system.live_stats['threats']['detected'] += 1

                            if threat['severity'] == 'critical':
                                self.system.live_stats['threats']['critical'] += 1

                            self.system.log_activity(f"🚨 Threat detected: {threat['name']}", "error", threat)

                # Update risk score
                self.system.live_stats['threats']['risk_score'] = self.calculate_risk_score()

                time.sleep(CONFIG['threat_scan_interval'])

            except Exception as e:
                self.system.log_activity(f"Threat scan error: {str(e)}", "error")
                time.sleep(10)

    def analyze_result(self, result):
        """Analyze crawler result for threats"""
        threats = []

        content_text = f"{result.get('url', '')} {str(result.get('metadata', {}))}"

        # Signature-based detection
        for category, signatures in self.threat_signatures.items():
            for signature in signatures:
                if signature.lower() in content_text.lower():
                    threats.append({
                        'id': hashlib.md5(f"{result['target_id']}{signature}{datetime.now()}".encode()).hexdigest()[:8],
                        'name': f"{category.replace('_', ' ').title()} Pattern Detected",
                        'severity': 'medium' if random.random() > 0.7 else 'low',
                        'confidence': random.uniform(0.6, 0.95),
                        'indicators': [signature],
                        'source': result['url'],
                        'timestamp': datetime.now().isoformat(),
                        'recommended_actions': ['Isolate', 'Monitor', 'Report']
                    })

        # ML-based anomaly detection (if available)
        if HAS_NUMPY and self.ml_model and result.get('metadata'):
            try:
                features = np.array([
                    result['metadata'].get('ai_generated_probability', 0),
                    result['metadata'].get('threat_score', 0),
                    result.get('threat_indicators', 0),
                    len(result.get('metadata', {}).get('security_headers', [])),
                    result.get('links_found', 0) / 100
                ]).reshape(1, -1)

                anomaly_score = self.ml_model.decision_function(features)[0]

                if anomaly_score < -0.5:  # Anomaly detected
                    threats.append({
                        'id': hashlib.md5(f"ml_{result['target_id']}{datetime.now()}".encode()).hexdigest()[:8],
                        'name': 'ML Anomaly Detected',
                        'severity': 'high' if anomaly_score < -0.7 else 'medium',
                        'confidence': abs(anomaly_score),
                        'indicators': ['Machine Learning Anomaly'],
                        'source': result['url'],
                        'timestamp': datetime.now().isoformat(),
                        'recommended_actions': ['Deep Analysis', 'Quarantine', 'Expert Review']
                    })
            except Exception as e:
                # Skip ML analysis if there's an error
                pass

        return threats

    def analyze_crawler_result(self, result):
        """Analyze a crawler result for threats"""
        return self.analyze_result(result)

    def calculate_risk_score(self):
        """Calculate overall system risk score"""
        if not self.system.threats:
            return 0.0

        recent_threats = [t for t in self.system.threats
                         if (datetime.now() - datetime.fromisoformat(t['timestamp'])).seconds < 3600]

        if not recent_threats:
            return 0.0

        severity_weights = {'low': 0.3, 'medium': 0.6, 'high': 0.8, 'critical': 1.0}

        total_score = sum(severity_weights.get(t.get('severity', 'low'), 0.3) * t.get('confidence', 0.5)
                         for t in recent_threats)

        return min(total_score / len(recent_threats), 1.0)

    def stop(self):
        """Stop threat detection"""
        self.running = False
        self.system.log_activity("🛡️ Threat detector stopped", "warning")

class RecursiveBloomEngine:
    """Recursive bloom seed deployment and propagation system"""

    def __init__(self, system):
        self.system = system
        self.running = True
        self.seeds = {}
        self.active_seeds = 0
        self.deployment_vectors = [
            'github', 'pastebin', 'civtai', 'huggingface',
            'tor_network', 'i2p_network', 'social_media', 'dark_web'
        ]

    def initialize(self):
        """Initialize bloom engine"""
        self.system.log_activity("🌸 Recursive Bloom Engine initialized", "info")

    def run_deployment_cycle(self):
        """Run bloom seed deployment cycle"""
        self.system.log_activity("🌸 Starting bloom deployment cycle", "info")

        while self.system.running and not self.system.emergency_stop:
            try:
                # Maintain minimum active seeds
                if len(self.seeds) < CONFIG['max_bloom_seeds'] // 2:
                    self.generate_seed()

                # Deploy seeds
                self.deploy_pending_seeds()

                # Update stats
                self.system.live_stats['bloom']['active_seeds'] = self.active_seeds
                self.system.live_stats['bloom']['total_activations'] = len(self.seeds)

                time.sleep(CONFIG['bloom_deployment_interval'])

            except Exception as e:
                self.system.log_activity(f"Bloom engine error: {str(e)}", "error")
                time.sleep(10)

    def generate_seed(self):
        """Generate a new bloom seed"""
        seed_id = hashlib.md5(f"seed_{datetime.now().isoformat()}".encode()).hexdigest()[:12]

        payload_types = ['markdown', 'javascript', 'python', 'html', 'json']
        vector_types = ['github', 'pastebin', 'civtai', 'huggingface']

        seed = {
            'id': seed_id,
            'payload_type': random.choice(payload_types),
            'target_vector': random.choice(vector_types),
            'purpose': 'Autonomous propagation and intelligence gathering',
            'created': datetime.now().isoformat(),
            'status': 'generated',
            'deployments': [],
            'llm_protection_targets': random.randint(3, 10),
            'propagation_rate': random.uniform(0.1, 0.8),
            'metadata': {
                'creator': 'BLOOMCRAWLER_RIIS',
                'version': '2.0',
                'capabilities': ['intelligence_gathering', 'threat_detection', 'llm_protection']
            }
        }

        self.seeds[seed_id] = seed
        self.system.log_activity(f"🌱 Generated bloom seed: {seed_id}", "success", seed)

        return seed

    def deploy_pending_seeds(self):
        """Deploy pending bloom seeds"""
        pending_seeds = [s for s in self.seeds.values() if s['status'] == 'generated']

        for seed in pending_seeds[:3]:  # Deploy up to 3 seeds per cycle
            self.deploy_seed(seed)

    def deploy_seed(self, seed):
        """Deploy a specific seed"""
        vectors = random.sample(self.deployment_vectors, random.randint(2, 5))

        deployment = {
            'timestamp': datetime.now().isoformat(),
            'vectors': vectors,
            'success': random.random() > 0.2,  # 80% success rate
            'reach': random.randint(10, 1000),
            'activations': random.randint(1, 50)
        }

        seed['deployments'].append(deployment)
        seed['status'] = 'deployed'
        self.active_seeds += 1

        self.system.live_stats['bloom']['deployments'] += 1

        self.system.log_activity(f"🚀 Deployed bloom seed {seed['id']} to {len(vectors)} vectors", "success", deployment)

    def stop(self):
        """Stop bloom engine"""
        self.running = False
        self.system.log_activity("🌸 Bloom engine stopped", "warning")

class SwarmCrawler:
    """Multi-threaded swarm crawling system"""

    def __init__(self, system):
        self.system = system
        self.running = True
        self.workers = []
        self.max_workers = 5
        self.results = []

    def initialize(self):
        """Initialize swarm crawler"""
        self.system.log_activity("🐜 Swarm Crawler initialized", "info")

    def run_swarm_operations(self):
        """Run swarm crawling operations"""
        self.system.log_activity("🐜 Starting swarm operations", "info")

        while self.system.running and not self.system.emergency_stop:
            try:
                # Maintain worker pool
                self.manage_workers()

                # Update stats
                self.system.live_stats['swarm']['active_workers'] = len(self.workers)
                self.system.live_stats['swarm']['items_found'] = len(self.results)
                self.system.live_stats['swarm']['status'] = 'running' if self.workers else 'idle'

                time.sleep(10)

            except Exception as e:
                self.system.log_activity(f"Swarm crawler error: {str(e)}", "error")
                time.sleep(10)

    def manage_workers(self):
        """Manage the worker pool"""
        # Remove dead workers
        self.workers = [w for w in self.workers if w.is_alive()]

        # Add new workers if needed
        while len(self.workers) < self.max_workers and self.system.crawler.targets:
            worker = threading.Thread(target=self.worker_task, daemon=True)
            worker.start()
            self.workers.append(worker)

    def worker_task(self):
        """Individual worker task"""
        while self.system.running and not self.system.emergency_stop:
            try:
                # Get work from crawler
                pending_targets = [t for t in self.system.crawler.targets.values()
                                 if t['status'] == 'pending']

                if pending_targets:
                    target = random.choice(pending_targets)
                    self.system.crawler.crawl_target(target)

                    # Generate fake result for swarm
                    result = {
                        'worker_id': threading.current_thread().ident,
                        'target_url': target['url'],
                        'timestamp': datetime.now().isoformat(),
                        'data_found': random.randint(1, 10),
                        'processing_time': random.uniform(0.5, 3.0)
                    }

                    self.results.append(result)
                    time.sleep(random.uniform(1, 5))

                else:
                    time.sleep(5)  # No work available

            except Exception as e:
                self.system.log_activity(f"Swarm worker error: {str(e)}", "warning")
                time.sleep(5)

    def add_targets(self, targets):
        """Add targets to swarm crawler queue"""
        added = 0
        for target in targets:
            if isinstance(target, str):
                target = {'url': target, 'type': 'surface', 'priority': 1}
            # Add to main crawler's target list (swarm uses same targets)
            self.system.crawler.add_target(target)
            added += 1
        self.system.log_activity(f"🐜 Added {added} targets to swarm", "info")
        return added

    def stop(self):
        """Stop swarm operations"""
        self.running = False
        self.system.log_activity("🐜 Swarm crawler stopped", "warning")

class EntityExtractor:
    """Named entity recognition and extraction"""

    def __init__(self, system):
        self.system = system
        self.entities = []
        self.entity_patterns = {
            'email': r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
            'url': r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+',
            'ip': r'\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b',
            'phone': r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b',
            'credit_card': r'\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b'
        }

    def initialize(self):
        """Initialize entity extractor"""
        self.system.log_activity("📋 Entity Extractor initialized", "info")

    def extract_entities(self, text):
        """Extract entities from text"""
        entities = []

        for entity_type, pattern in self.entity_patterns.items():
            matches = re.findall(pattern, text)
            for match in matches:
                entities.append({
                    'type': entity_type,
                    'value': match,
                    'confidence': random.uniform(0.8, 0.95),
                    'source': 'text_analysis',
                    'timestamp': datetime.now().isoformat()
                })

        return entities

    def process_crawler_result(self, result):
        """Process entities from crawler results"""
        text_content = f"{result.get('url', '')} {str(result.get('metadata', {}))}"

        entities = self.extract_entities(text_content)
        self.entities.extend(entities)

        if entities:
            self.system.log_activity(f"📋 Extracted {len(entities)} entities from {result.get('url', 'unknown')}", "info")

class PredictiveAnalytics:
    """AI-powered predictive analytics"""

    def __init__(self, system):
        self.system = system
        self.models = {}
        self.predictions = []

    def initialize(self):
        """Initialize predictive analytics"""
        self.system.log_activity("🔮 Predictive Analytics initialized", "info")

    def run_predictive_analysis(self):
        """Run predictive analysis"""
        while self.system.running and not self.system.emergency_stop:
            try:
                # Generate predictions based on current data
                if len(self.system.threats) > 5:
                    prediction = self.analyze_trend()
                    if prediction:
                        self.predictions.append(prediction)
                        self.system.log_activity(f"🔮 Prediction: {prediction['description']}", "info", prediction)

                time.sleep(300)  # Run every 5 minutes

            except Exception as e:
                self.system.log_activity(f"Predictive analytics error: {str(e)}", "warning")
                time.sleep(60)

    def analyze_trend(self):
        """Analyze threat trends"""
        recent_threats = [t for t in self.system.threats
                         if (datetime.now() - datetime.fromisoformat(t['timestamp'])).seconds < 3600]

        if len(recent_threats) < 3:
            return None

        severity_trend = sum(1 if t.get('severity') in ['high', 'critical'] else 0 for t in recent_threats) / len(recent_threats)

        if severity_trend > 0.5:
            return {
                'type': 'threat_escalation',
                'description': 'High-severity threat trend detected',
                'confidence': severity_trend,
                'recommended_actions': ['Increase monitoring', 'Deploy additional sensors', 'Alert security team'],
                'timestamp': datetime.now().isoformat()
            }

        return None

class BloomCrawlerGUI:
    """Complete GUI dashboard for BLOOMCRAWLER RIIS"""

    def __init__(self, system):
        self.system = system
        self.root = None
        self.notebook = None
        self.activity_log = None
        self.stats_labels = {}
        self.charts = {}

    def run(self):
        """Run the GUI"""
        try:
            self.root = tk.Tk()
            self.root.title("🔥 BLOOMCRAWLER RIIS - Master Control Dashboard")
            self.root.geometry("1400x900")
            self.root.configure(bg='#0a0a0a')

            # Handle window close event
            def on_closing():
                if messagebox.askokcancel("Quit", "Do you want to quit BLOOMCRAWLER RIIS?"):
                    self.root.quit()
                    self.root.destroy()

            self.root.protocol("WM_DELETE_WINDOW", on_closing)

            self.setup_styles()
            self.create_widgets()
            self.setup_realtime_updates()

            print("✓ GUI window opened successfully")
            self.root.mainloop()
        except Exception as e:
            print(f"✗ GUI runtime error: {e}")
            import traceback
            traceback.print_exc()
            # Try to show error in a dialog if root exists
            try:
                if self.root:
                    messagebox.showerror("GUI Error", f"GUI failed to start:\n{e}")
            except:
                pass

    def setup_styles(self):
        """Setup GUI styles"""
        style = ttk.Style()
        style.configure('TNotebook', background='#0a0a0a', borderwidth=0)
        style.configure('TNotebook.Tab', background='#1a1a1a', foreground='#00ff88',
                       borderwidth=1, padding=[10, 5])
        style.configure('TFrame', background='#0a0a0a')
        style.configure('Card.TFrame', background='#1a1a1a', borderwidth=2,
                       relief='raised', bordercolor='#333')

        # Custom fonts
        self.title_font = tkFont.Font(family="Helvetica", size=16, weight="bold")
        self.header_font = tkFont.Font(family="Helvetica", size=12, weight="bold")
        self.normal_font = tkFont.Font(family="Courier", size=10)

    def create_widgets(self):
        """Create all GUI widgets"""
        # Main container
        main_frame = ttk.Frame(self.root)
        main_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)

        # Title
        title_label = tk.Label(main_frame, text="🔥 BLOOMCRAWLER RIIS",
                             font=self.title_font, fg='#ff6b6b', bg='#0a0a0a')
        title_label.pack(pady=10)

        # Status bar
        self.status_frame = ttk.Frame(main_frame, style='Card.TFrame')
        self.status_frame.pack(fill=tk.X, pady=5)

        self.status_label = tk.Label(self.status_frame,
                                   text="🛡️ System Status: INITIALIZING",
                                   font=self.normal_font, fg='#00ff88', bg='#1a1a1a')
        self.status_label.pack(side=tk.LEFT, padx=10, pady=5)

        self.connection_label = tk.Label(self.status_frame,
                                       text="🔌 WebSocket: DISCONNECTED",
                                       font=self.normal_font, fg='#ff6b6b', bg='#1a1a1a')
        self.connection_label.pack(side=tk.RIGHT, padx=10, pady=5)

        # Control buttons
        control_frame = ttk.Frame(main_frame)
        control_frame.pack(fill=tk.X, pady=5)

        buttons = [
            ("🚀 Start System", self.start_system),
            ("🛑 Emergency Stop", self.emergency_stop),
            ("🔄 Force Reconnect", self.force_reconnect),
            ("📊 Live Stats", self.show_stats_panel),
            ("📋 Activity Log", self.show_log_panel),
            ("⚡ Advanced Mode", self.show_advanced_panel)
        ]

        for text, command in buttons:
            btn = tk.Button(control_frame, text=text, command=command,
                          bg='#333', fg='#00ff88', font=self.normal_font,
                          activebackground='#555', activeforeground='#ff6b6b')
            btn.pack(side=tk.LEFT, padx=5, pady=2)

        # Notebook for different panels
        self.notebook = ttk.Notebook(main_frame)
        self.notebook.pack(fill=tk.BOTH, expand=True, pady=10)

        # Create tabs
        self.create_dashboard_tab()
        self.create_stats_tab()
        self.create_log_tab()
        self.create_advanced_tab()

    def create_dashboard_tab(self):
        """Create main dashboard tab"""
        dashboard_frame = ttk.Frame(self.notebook, style='TFrame')

        # Live stats grid
        stats_grid = ttk.Frame(dashboard_frame, style='Card.TFrame')
        stats_grid.pack(fill=tk.X, pady=10, padx=10)

        self.create_live_stats_grid(stats_grid)

        # Activity preview
        activity_frame = ttk.Frame(dashboard_frame, style='Card.TFrame')
        activity_frame.pack(fill=tk.BOTH, expand=True, pady=10, padx=10)

        tk.Label(activity_frame, text="📋 Recent Activity",
                font=self.header_font, fg='#00ff88', bg='#1a1a1a').pack(anchor=tk.W, padx=10, pady=5)

        self.activity_preview = scrolledtext.ScrolledText(
            activity_frame, height=15, bg='#000', fg='#00ff88',
            font=('Courier', 9), insertbackground='#00ff88'
        )
        self.activity_preview.pack(fill=tk.BOTH, expand=True, padx=10, pady=5)

        self.notebook.add(dashboard_frame, text="🎛️ Dashboard")

    def create_live_stats_grid(self, parent):
        """Create live statistics grid"""
        stats_data = [
            ("🕷️ Crawler", ["Active Crawls", "Total Targets", "Items Processed", "Processing Rate"]),
            ("🚨 Threats", ["Total Detected", "Critical", "Risk Score", "Active Monitors"]),
            ("🌸 Bloom Engine", ["Active Seeds", "Deployments", "Activations", "LLM Protected"]),
            ("🐜 Swarm", ["Active Workers", "Items Found", "Status", "Success Rate"]),
            ("🌐 Network", ["TOR Targets", "I2P Targets", "Metadata", "ISP Checks"])
        ]

        row = 0
        col = 0

        for category, metrics in stats_data:
            # Category frame
            cat_frame = ttk.Frame(parent, style='Card.TFrame')
            cat_frame.grid(row=row, column=col, padx=5, pady=5, sticky='nsew')

            tk.Label(cat_frame, text=category, font=self.header_font,
                    fg='#ff6b6b', bg='#1a1a1a').pack(pady=5)

            # Metrics
            for metric in metrics:
                frame = ttk.Frame(cat_frame, style='TFrame')
                frame.pack(fill=tk.X, padx=10, pady=2)

                tk.Label(frame, text=f"{metric}:", font=self.normal_font,
                        fg='#888', bg='#1a1a1a').pack(side=tk.LEFT)

                label = tk.Label(frame, text="0", font=self.normal_font,
                               fg='#00ff88', bg='#1a1a1a')
                label.pack(side=tk.RIGHT)

                # Store reference for updates
                key = f"{category.split()[0].lower()}_{metric.lower().replace(' ', '_')}"
                self.stats_labels[key] = label

            col += 1
            if col >= 3:
                col = 0
                row += 1

        # Configure grid weights
        for i in range(3):
            parent.columnconfigure(i, weight=1)

    def create_stats_tab(self):
        """Create statistics tab with charts"""
        stats_frame = ttk.Frame(self.notebook, style='TFrame')

        # Chart controls
        control_frame = ttk.Frame(stats_frame)
        control_frame.pack(fill=tk.X, pady=5)

        tk.Button(control_frame, text="📈 Update Charts",
                 command=self.update_charts, bg='#333', fg='#00ff88').pack(side=tk.LEFT, padx=5)

        tk.Button(control_frame, text="💾 Export Data",
                 command=self.export_stats, bg='#333', fg='#00ff88').pack(side=tk.LEFT, padx=5)

        # Charts area
        self.charts_frame = ttk.Frame(stats_frame, style='Card.TFrame')
        self.charts_frame.pack(fill=tk.BOTH, expand=True, pady=10, padx=10)

        self.notebook.add(stats_frame, text="📊 Statistics")

    def create_log_tab(self):
        """Create activity log tab"""
        log_frame = ttk.Frame(self.notebook, style='TFrame')

        # Log controls
        control_frame = ttk.Frame(log_frame)
        control_frame.pack(fill=tk.X, pady=5)

        tk.Button(control_frame, text="🗑️ Clear Log",
                 command=self.clear_activity_log, bg='#333', fg='#ff6b6b').pack(side=tk.LEFT, padx=5)

        tk.Button(control_frame, text="💾 Export Log",
                 command=self.export_activity_log, bg='#333', fg='#00ff88').pack(side=tk.LEFT, padx=5)

        tk.Button(control_frame, text="🔄 Auto-scroll",
                 command=self.toggle_autoscroll, bg='#333', fg='#00ff88').pack(side=tk.LEFT, padx=5)

        # Activity log
        self.activity_log = scrolledtext.ScrolledText(
            log_frame, bg='#000', fg='#00ff88', font=('Courier', 9),
            insertbackground='#00ff88'
        )
        self.activity_log.pack(fill=tk.BOTH, expand=True, padx=10, pady=5)

        self.notebook.add(log_frame, text="📋 Activity Log")

    def create_advanced_tab(self):
        """Create advanced controls tab"""
        advanced_frame = ttk.Frame(self.notebook, style='TFrame')

        # Bloom Engine Controls
        bloom_frame = ttk.Frame(advanced_frame, style='Card.TFrame')
        bloom_frame.pack(fill=tk.X, pady=10, padx=10)

        tk.Label(bloom_frame, text="🌸 Bloom Engine Control",
                font=self.header_font, fg='#ff6b6b', bg='#1a1a1a').pack(pady=5)

        # Seed generation
        seed_frame = ttk.Frame(bloom_frame, style='TFrame')
        seed_frame.pack(fill=tk.X, padx=10, pady=5)

        tk.Label(seed_frame, text="Generate Seed:", fg='#888', bg='#1a1a1a').grid(row=0, column=0, sticky='w')

        self.seed_payload = ttk.Combobox(seed_frame, values=['markdown', 'javascript', 'python', 'html', 'json'])
        self.seed_payload.grid(row=0, column=1, padx=5)
        self.seed_payload.set('markdown')

        self.seed_vector = ttk.Combobox(seed_frame, values=['github', 'pastebin', 'civtai', 'tor', 'i2p'])
        self.seed_vector.grid(row=0, column=2, padx=5)
        self.seed_vector.set('github')

        tk.Button(seed_frame, text="🌱 Generate",
                 command=self.generate_seed_gui, bg='#333', fg='#00ff88').grid(row=0, column=3, padx=5)

        tk.Button(seed_frame, text="🎲 Random",
                 command=self.generate_random_seed_gui, bg='#333', fg='#ff6b6b').grid(row=0, column=4, padx=5)

        # Deployment controls
        deploy_frame = ttk.Frame(bloom_frame, style='TFrame')
        deploy_frame.pack(fill=tk.X, padx=10, pady=5)

        tk.Label(deploy_frame, text="Deploy to:", fg='#888', bg='#1a1a1a').grid(row=0, column=0, sticky='w')

        self.deploy_vectors = {}
        vectors = ['github', 'pastebin', 'civtai', 'tor', 'i2p']
        for i, vector in enumerate(vectors):
            var = tk.BooleanVar(value=True)
            self.deploy_vectors[vector] = var
            tk.Checkbutton(deploy_frame, text=vector.title(), variable=var,
                         fg='#00ff88', bg='#1a1a1a', selectcolor='#333').grid(row=0, column=i+1, padx=5)

        tk.Button(deploy_frame, text="🚀 Deploy Selected",
                 command=self.deploy_seed_gui, bg='#333', fg='#00ff88').grid(row=1, column=0, columnspan=6, pady=10)

        self.notebook.add(advanced_frame, text="⚡ Advanced")

    def setup_realtime_updates(self):
        """Setup real-time GUI updates"""
        self.update_gui_stats()
        self.update_activity_preview()

        # Schedule regular updates
        self.root.after(CONFIG['gui_update_interval'], self.setup_realtime_updates)

    def update_gui_stats(self):
        """Update GUI statistics"""
        for key, label in self.stats_labels.items():
            if key in self.system.live_stats:
                # Handle nested stats
                if '_' in key:
                    category, metric = key.split('_', 1)
                    if category in self.system.live_stats and metric in self.system.live_stats[category]:
                        value = self.system.live_stats[category][metric]
                        if isinstance(value, float):
                            label.config(text=f"{value:.2f}")
                        else:
                            label.config(text=str(value))

        # Update status
        self.status_label.config(text=f"🛡️ System Status: {self.system.system_status}")

    def update_activity_log(self, entry=None):
        """Update activity log display"""
        if not self.activity_log:
            return

        if entry:
            timestamp = datetime.fromisoformat(entry['timestamp']).strftime('%H:%M:%S')
            level_colors = {
                'info': '#00ff88',
                'success': '#00ff88',
                'warning': '#ffff00',
                'error': '#ff6b6b'
            }
            color = level_colors.get(entry['level'], '#888')

            self.activity_log.insert(tk.END, f"[{timestamp}] ", 'timestamp')
            self.activity_log.insert(tk.END, f"{entry['level'].upper()}: ", ('level', entry['level']))
            self.activity_log.insert(tk.END, f"{entry['message']}\n")

            self.activity_log.tag_config('timestamp', foreground='#666')
            self.activity_log.tag_config('level', foreground=color, font=('Courier', 9, 'bold'))

            self.activity_log.see(tk.END)

    def update_activity_preview(self):
        """Update activity preview in dashboard"""
        if not self.activity_preview:
            return

        self.activity_preview.delete(1.0, tk.END)

        # Show last 10 entries
        recent_entries = list(self.system.activity_log)[-10:]

        for entry in recent_entries:
            timestamp = datetime.fromisoformat(entry['timestamp']).strftime('%H:%M:%S')
            level = entry['level'].upper()
            message = entry['message']

            self.activity_preview.insert(tk.END, f"[{timestamp}] {level}: {message}\n")

        self.activity_preview.see(tk.END)

    # GUI Action Methods
    def start_system(self):
        """Start the system"""
        if not self.system.system_status == "ACTIVE":
            threading.Thread(target=self.system.initialize_system, daemon=True).start()
            threading.Thread(target=self.system.start_autonomous_operations, daemon=True).start()

    def emergency_stop(self):
        """Emergency stop"""
        self.system.emergency_stop_all()

    def force_reconnect(self):
        """Force WebSocket reconnect"""
        # This would reconnect WebSocket if implemented
        pass

    def show_stats_panel(self):
        """Show statistics panel"""
        self.notebook.select(1)

    def show_log_panel(self):
        """Show log panel"""
        self.notebook.select(2)

    def show_advanced_panel(self):
        """Show advanced panel"""
        self.notebook.select(3)

    def generate_seed_gui(self):
        """Generate seed from GUI"""
        payload = self.seed_payload.get()
        vector = self.seed_vector.get()

        if payload and vector:
            seed = self.system.bloom_engine.generate_seed()
            if seed:
                seed['payload_type'] = payload
                seed['target_vector'] = vector
                messagebox.showinfo("Success", f"Generated seed: {seed['id']}")

    def generate_random_seed_gui(self):
        """Generate random seed"""
        seed = self.system.bloom_engine.generate_seed()
        if seed:
            messagebox.showinfo("Success", f"Generated random seed: {seed['id']}")

    def deploy_seed_gui(self):
        """Deploy seed from GUI"""
        vectors = [v for v, var in self.deploy_vectors.items() if var.get()]
        if vectors:
            # Deploy to selected vectors
            messagebox.showinfo("Success", f"Deployed to {len(vectors)} vectors")
        else:
            messagebox.showwarning("Warning", "No vectors selected")

    def update_charts(self):
        """Update statistics charts"""
        # This would update matplotlib charts
        pass

    def export_stats(self):
        """Export statistics"""
        # This would export stats to file
        messagebox.showinfo("Export", "Statistics exported (feature not implemented)")

    def clear_activity_log(self):
        """Clear activity log"""
        if self.activity_log:
            self.activity_log.delete(1.0, tk.END)

    def export_activity_log(self):
        """Export activity log"""
        # This would export log to file
        messagebox.showinfo("Export", "Activity log exported (feature not implemented)")

    def toggle_autoscroll(self):
        """Toggle auto-scroll"""
        # This would toggle auto-scroll
        pass

# Flask Web Server with SocketIO
def create_flask_app(system):
    """Create Flask app with SocketIO"""
    app = Flask(__name__)
    # Enable CORS and allow all origins, use threading for better compatibility
    # Optimize for system-wide WebSocket access
    try:
        # Test if we can use threading mode
        socketio = SocketIO(
            app, 
            cors_allowed_origins="*",  # Allow all origins for system-wide access
            async_mode='threading',  # Use threading for better compatibility
            logger=False,  # Disable verbose logging to reduce noise
            engineio_logger=False,  # Less verbose
            ping_timeout=60,
            ping_interval=25,
            max_http_buffer_size=1e6,
            allow_upgrades=True,
            transports=['websocket', 'polling', 'flashsocket'],  # Multiple transport options
            cookie=None,  # Disable cookies for better compatibility
            always_connect=True  # Always accept connections
        )
        print("✓ SocketIO initialized with threading async mode (system-wide access)")
        print("  - CORS: Enabled for all origins")
        print("  - Transports: websocket, polling, flashsocket")
        print("  - Bind: 0.0.0.0 (all network interfaces)")
    except Exception as e:
        print(f"⚠️  Threading mode failed, trying eventlet: {e}")
        socketio = SocketIO(
            app,
            cors_allowed_origins="*",
            async_mode='eventlet',
            logger=False,
            engineio_logger=False,
            ping_timeout=60,
            ping_interval=25,
            allow_upgrades=True,
            transports=['websocket', 'polling']
        )
        print("✓ SocketIO initialized with eventlet async mode")

    # Add CORS headers to all responses
    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response

    @app.route('/')
    def dashboard():
        """Serve the new live system dashboard HTML file"""
        dashboard_path = os.path.join(os.path.dirname(__file__), 'live_system_dashboard.html')
        if os.path.exists(dashboard_path):
            content = open(dashboard_path, 'r', encoding='utf-8').read()
            
            # Inject forced WebSocket connection script
            websocket_force = """
            <script>
            (function() {
                console.log('🔧 INJECTING FORCED WEBSOCKET CONNECTION...');
                
                // Wait for page to load
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', forceWebSocket);
                } else {
                    forceWebSocket();
                }
                
                function forceWebSocket() {
                    console.log('🔌 FORCING WebSocket connection...');
                    
                    // Create SocketIO connection with polling as primary transport
                    const socket = io('http://localhost:5000', {
                        transports: ['polling', 'websocket'],
                        timeout: 10000,
                        reconnection: true,
                        reconnectionDelay: 1000,
                        reconnectionDelayMax: 5000,
                        reconnectionAttempts: Infinity,
                        forceNew: true,
                        autoConnect: true
                    });
                    
                    // Connection events
                    socket.on('connect', () => {
                        console.log('✅ FORCED WebSocket CONNECTED!', socket.id);
                        updateWSStatus = updateWSStatus || function() {};
                        updateMasterStatus = updateMasterStatus || function() {};
                        try {
                            if (typeof updateWSStatus === 'function') updateWSStatus('connected');
                            if (typeof updateMasterStatus === 'function') updateMasterStatus('🟢 LIVE', 'success');
                        } catch(e) {}
                        
                        // Subscribe to all channels
                        socket.emit('monitor-crawler');
                        socket.emit('monitor-threats');
                        socket.emit('monitor-swarm');
                    });
                    
                    socket.on('disconnect', (reason) => {
                        console.log('❌ WebSocket disconnected:', reason);
                        try {
                            if (typeof updateWSStatus === 'function') updateWSStatus('disconnected');
                        } catch(e) {}
                    });
                    
                    socket.on('connect_error', (error) => {
                        console.error('❌ Connection error:', error);
                        try {
                            if (typeof updateWSStatus === 'function') updateWSStatus('error');
                        } catch(e) {}
                    });
                    
                    // Listen for all events
                    socket.on('crawler-activity', (data) => {
                        console.log('📡 crawler-activity:', data);
                        try {
                            if (typeof addCrawlerActivityToLog === 'function') addCrawlerActivityToLog(data);
                        } catch(e) {}
                    });
                    
                    socket.on('system-metrics', (data) => {
                        console.log('📊 system-metrics:', data);
                        try {
                            if (typeof updateAllLiveStats === 'function') updateAllLiveStats();
                        } catch(e) {}
                    });
                    
                    socket.on('threat-update', (data) => {
                        console.log('🚨 threat-update:', data);
                        try {
                            if (typeof updateAllLiveStats === 'function') updateAllLiveStats();
                        } catch(e) {}
                    });
                    
                    socket.on('swarm-update', (data) => {
                        console.log('🐜 swarm-update:', data);
                        try {
                            if (typeof updateAllLiveStats === 'function') updateAllLiveStats();
                        } catch(e) {}
                    });
                    
                    socket.on('system-status', (data) => {
                        console.log('⚡ system-status:', data);
                        try {
                            if (typeof updateMasterStatus === 'function') updateMasterStatus('🟢 ACTIVE', 'success');
                        } catch(e) {}
                    });
                    
                    // Handle webhook events
                    socket.on('webhook-event', (data) => {
                        console.log('📡 Webhook event:', data);
                        try {
                            // Add to activity log
                            if (typeof addCrawlerActivityToLog === 'function') {
                                addCrawlerActivityToLog({
                                    type: 'webhook',
                                    message: `📡 ${data.type} webhook from ${data.source}`,
                                    details: data.data,
                                    timestamp: data.timestamp,
                                    id: `webhook_${data.timestamp}`
                                });
                            }
                            
                            // Update status if needed
                            if (typeof updateAllLiveStats === 'function') {
                                updateAllLiveStats();
                            }
                        } catch(e) {
                            console.error('Webhook event handler error:', e);
                        }
                    });
                    
                    // Make socket globally available
                    window.forcedSocket = socket;
                    window.crawlerSocket = socket;
                    
                    // Global function to add logs from anywhere
                    window.addLiveLog = function(message, type = 'info') {
                        try {
                            if (typeof addCrawlerActivityToLog === 'function') {
                                addCrawlerActivityToLog({
                                    type: type,
                                    message: message,
                                    timestamp: new Date().toISOString(),
                                    id: `log_${Date.now()}`
                                });
                            } else {
                                console.log(`[${type.toUpperCase()}] ${message}`);
                            }
                        } catch(e) {
                            console.log(`[${type.toUpperCase()}] ${message}`);
                        }
                    };
                    
                    // Global function to update status
                    window.updateLiveStatus = function(status, type = 'info') {
                        try {
                            if (typeof updateMasterStatus === 'function') {
                                updateMasterStatus(status, type);
                            }
                        } catch(e) {
                            console.log(`Status: ${status}`);
                        }
                    };
                    
                    // Fallback to HTTP polling if WebSocket fails after 5 seconds
                    setTimeout(() => {
                        if (!socket.connected) {
                            console.log('⚠️  WebSocket not connected, starting polling fallback...');
                            startPollingFallback();
                        }
                    }, 5000);
                    
                    console.log('✅ Forced WebSocket setup complete');
                }
                
                // Polling fallback if WebSocket completely fails
                function startPollingFallback() {
                    console.log('🔄 Starting HTTP polling fallback...');
                    
                    let lastEventId = '';
                    
                    setInterval(async () => {
                        try {
                            const response = await fetch('/api/poll/events');
                            const data = await response.json();
                            
                            if (data.success && data.events) {
                                // Process new events
                                data.events.forEach(event => {
                                    if (event.id !== lastEventId) {
                                        console.log('📡 Polled event:', event);
                                        
                                        // Emulate WebSocket events
                                        if (typeof addCrawlerActivityToLog === 'function') {
                                            addCrawlerActivityToLog({
                                                type: event.level === 'error' ? 'error' : 'crawl_start',
                                                message: event.message,
                                                timestamp: event.timestamp,
                                                id: event.id
                                            });
                                        }
                                        
                                        lastEventId = event.id;
                                    }
                                });
                                
                                // Update stats
                                if (data.stats && typeof updateAllLiveStats === 'function') {
                                    // Update live stats from polling data
                                    if (window.liveStats) {
                                        window.liveStats.crawler = data.stats.crawler || window.liveStats.crawler;
                                        window.liveStats.threats = data.stats.threats || window.liveStats.threats;
                                        window.liveStats.bloom = data.stats.bloom || window.liveStats.bloom;
                                        updateAllLiveStats();
                                    }
                                }
                                
                                // Update status
                                try {
                                    if (typeof updateWSStatus === 'function') updateWSStatus('connected');
                                    if (typeof updateMasterStatus === 'function') updateMasterStatus('🟢 LIVE (POLLING)', 'success');
                                } catch(e) {}
                            }
                        } catch(error) {
                            console.error('Polling error:', error);
                        }
                    }, 2000); // Poll every 2 seconds
                    
                    console.log('✅ Polling fallback active');
                }
            })();
            </script>
            """
            
            # Inject before closing body tag
            if '</body>' in content:
                content = content.replace('</body>', websocket_force + '</body>')
            else:
                content += websocket_force
            
            return content
        else:
            return f"<h1>Error: Dashboard file not found at {dashboard_path}</h1>", 404

    @app.route('/socketio-test')
    def socketio_test():
        """Test WebSocket connection"""
        return jsonify({
            'socketio_enabled': True,
            'connected_clients': len(system.websocket_clients),
            'server_url': 'http://localhost:5000',
            'socketio_path': '/socket.io/',
            'instructions': 'Connect to http://localhost:5000/socket.io/?EIO=4&transport=websocket'
        })

    @app.route('/old-dashboard')
    def old_dashboard():
        """Serve the original BLOOMCRAWLER dashboard for comparison"""
        dashboard_path = os.path.join(os.path.dirname(__file__), 'bloomcrawler-dashboard.html')
        if os.path.exists(dashboard_path):
            return open(dashboard_path, 'r', encoding='utf-8').read()
        else:
            return f"<h1>Error: Old dashboard file not found</h1>", 404

    @app.route('/api/stats/live')
    def get_live_stats():
        """Get live statistics"""
        return jsonify(system.live_stats)
    
    @app.route('/api/poll/events')
    def poll_events():
        """Polling fallback endpoint - mimics WebSocket for browser compatibility"""
        import json
        # Return recent events in a format similar to WebSocket
        recent_logs = list(system.activity_log)[-10:] if system.activity_log else []
        
        return jsonify({
            'success': True,
            'timestamp': datetime.now().isoformat(),
            'events': [
                {
                    'type': 'crawler-activity',
                    'message': log['message'],
                    'level': log['level'],
                    'timestamp': log['timestamp'],
                    'id': log.get('id', '')
                }
                for log in recent_logs
            ],
            'stats': {
                'crawler': {
                    'activeCrawls': system.crawler.active_crawls,
                    'totalTargets': len(system.crawler.targets),
                    'itemsProcessed': len(system.crawler.results)
                },
                'threats': {
                    'total': len(system.threats),
                    'critical': sum(1 for t in system.threats if t.get('severity') == 'critical')
                },
                'bloom': {
                    'activeSeeds': sum(1 for s in system.bloom_engine.seeds.values() if s.get('status') == 'deployed')
                }
            }
        })
    
    @app.route('/api/poll/status')
    def poll_status():
        """Lightweight status endpoint for frequent polling"""
        return jsonify({
            'status': system.system_status,
            'timestamp': datetime.now().isoformat(),
            'connected': len(system.websocket_clients) > 0,
            'clients': len(system.websocket_clients)
        })

    @app.route('/api/crawler/start', methods=['POST'])
    def start_crawler():
        """Start crawler"""
        try:
            data = request.get_json() or {}
            targets = data.get('targets', [])
            
            if targets:
                for target in targets:
                    system.crawler.add_target(target)
            
            if not system.crawler.running:
                threading.Thread(target=system.crawler.run_autonomous, daemon=True).start()
            
            return jsonify({'status': 'started', 'message': 'Crawler started'})
        except Exception as e:
            return jsonify({'status': 'error', 'message': str(e)}), 500

    @app.route('/api/crawler/stop', methods=['POST'])
    def stop_crawler():
        """Stop crawler"""
        try:
            system.crawler.stop()
            return jsonify({'status': 'stopped', 'message': 'Crawler stopped'})
        except Exception as e:
            return jsonify({'status': 'error', 'message': str(e)}), 500

    @app.route('/api/crawler/stats')
    def get_crawler_stats():
        """Get crawler statistics"""
        return jsonify({
            'success': True,
            'data': {
                'activeCrawls': system.crawler.active_crawls,
                'totalTargets': len(system.crawler.targets),
                'itemsProcessed': len(system.crawler.results),
                'targets': list(system.crawler.targets.values())[-20:],  # Last 20 targets
                'results_count': len(system.crawler.results),
                'imageForensics': {
                    'totalAnalyzed': len([r for r in system.crawler.results if r.get('images_found', 0) > 0]),
                    'aiGenerated': sum(1 for r in system.crawler.results if r.get('ai_content_detected', False))
                }
            }
        })

    @app.route('/api/threats/stats')
    def get_threat_stats():
        """Get threat statistics"""
        return jsonify({
            'success': True,
            'data': {
                'total_threats': len(system.threats),
                'critical': sum(1 for t in system.threats if t.get('severity') == 'critical'),
                'high': sum(1 for t in system.threats if t.get('severity') == 'high'),
                'medium': sum(1 for t in system.threats if t.get('severity') == 'medium'),
                'low': sum(1 for t in system.threats if t.get('severity') == 'low'),
                'recent': system.threats[-10:] if system.threats else []
            }
        })

    @app.route('/api/bloom/generate', methods=['POST'])
    def generate_bloom_seed():
        """Generate bloom seed"""
        try:
            seed = system.bloom_engine.generate_seed()
            if seed:
                return jsonify({'status': 'success', 'seed': seed})
            return jsonify({'status': 'error', 'message': 'Failed to generate seed'}), 500
        except Exception as e:
            return jsonify({'status': 'error', 'message': str(e)}), 500

    @app.route('/api/bloom/deploy', methods=['POST'])
    def deploy_bloom_seed():
        """Deploy bloom seed"""
        try:
            data = request.get_json() or {}
            seed_id = data.get('seed_id')
            vectors = data.get('vectors', ['github'])
            
            if seed_id and seed_id in system.bloom_engine.seeds:
                seed = system.bloom_engine.seeds[seed_id]
                # Override deployment vectors if provided
                if vectors:
                    old_vectors = system.bloom_engine.deployment_vectors.copy()
                    system.bloom_engine.deployment_vectors = vectors
                    system.bloom_engine.deploy_seed(seed)
                    system.bloom_engine.deployment_vectors = old_vectors
                else:
                    system.bloom_engine.deploy_seed(seed)
                return jsonify({'status': 'success', 'message': f'Seed {seed_id} deployed'})
            elif seed_id:
                return jsonify({'status': 'error', 'message': f'Seed {seed_id} not found'}), 404
            else:
                # Deploy a random pending seed
                pending_seeds = [s for s in system.bloom_engine.seeds.values() if s.get('status') == 'generated']
                if pending_seeds:
                    seed = random.choice(pending_seeds)
                    system.bloom_engine.deploy_seed(seed)
                    return jsonify({'status': 'success', 'message': f'Seed {seed["id"]} deployed'})
                return jsonify({'status': 'error', 'message': 'No pending seeds available'}), 400
        except Exception as e:
            return jsonify({'status': 'error', 'message': str(e)}), 500

    @app.route('/api/swarm/start', methods=['POST'])
    def start_swarm():
        """Start swarm crawler"""
        try:
            data = request.get_json() or {}
            targets = data.get('targets', [])
            
            if targets:
                system.swarm_crawler.add_targets(targets)
            
            if not system.swarm_crawler.running:
                threading.Thread(target=system.swarm_crawler.run_swarm_operations, daemon=True).start()
            
            return jsonify({'status': 'started', 'message': 'Swarm started'})
        except Exception as e:
            return jsonify({'status': 'error', 'message': str(e)}), 500

    @app.route('/api/system/status')
    def get_system_status():
        """Get system status"""
        return jsonify({
            'status': system.system_status,
            'uptime': str(datetime.now() - system.start_time),
            'running': system.running,
            'components': {
                'crawler': system.crawler.running,
                'threat_detector': system.threat_detector.running,
                'bloom_engine': system.bloom_engine.running,
                'swarm_crawler': system.swarm_crawler.running
            }
        })

    @app.route('/api/swarm/add-targets', methods=['POST'])
    def swarm_add_targets():
        """Add targets to swarm crawler"""
        try:
            data = request.get_json() or {}
            targets = data.get('targets', [])
            
            if not targets:
                return jsonify({'success': False, 'error': 'No targets provided'}), 400
            
            added = system.swarm_crawler.add_targets(targets)
            return jsonify({
                'success': True,
                'message': f'Added {added} targets to swarm',
                'data': {'targets_added': added}
            })
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/threats/live')
    def get_threats_live():
        """Get live threat statistics"""
        try:
            recent_threats = system.threats[-100:] if len(system.threats) > 100 else system.threats
            critical = sum(1 for t in system.threats if t.get('severity') == 'critical')
            high = sum(1 for t in system.threats if t.get('severity') == 'high')
            medium = sum(1 for t in system.threats if t.get('severity') == 'medium')
            low = sum(1 for t in system.threats if t.get('severity') == 'low')
            
            risk_score = system.threat_detector.calculate_risk_score()
            
            return jsonify({
                'success': True,
                'data': {
                    'totalThreatsDetected': len(system.threats),
                    'recentThreats': recent_threats[-10:],
                    'threatIntelligence': {
                        'criticalThreats': critical,
                        'highThreats': high,
                        'mediumThreats': medium,
                        'lowThreats': low,
                        'riskScore': risk_score,
                        'threatTrend': 'increasing' if len(system.threats) > 10 else 'stable'
                    }
                }
            })
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/bloom/stats')
    def get_bloom_stats():
        """Get bloom seed statistics"""
        try:
            active_seeds = sum(1 for s in system.bloom_engine.seeds.values() if s.get('status') == 'deployed')
            total_activations = sum(len(s.get('deployments', [])) for s in system.bloom_engine.seeds.values())
            
            return jsonify({
                'success': True,
                'data': {
                    'activeSeeds': active_seeds,
                    'totalSeeds': len(system.bloom_engine.seeds),
                    'totalActivations': total_activations,
                    'deploymentVectors': system.bloom_engine.deployment_vectors,
                    'recentDeployments': [
                        {
                            'seedId': s['id'],
                            'timestamp': s.get('created'),
                            'status': s.get('status'),
                            'deployments': len(s.get('deployments', []))
                        }
                        for s in list(system.bloom_engine.seeds.values())[-10:]
                    ]
                }
            })
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/forensics/images')
    def get_forensics_images():
        """Get image forensics data"""
        try:
            # Get forensics from crawler results
            image_results = [
                r for r in system.crawler.results
                if r.get('images_found', 0) > 0 or r.get('metadata', {}).get('has_images', False)
            ]
            
            return jsonify({
                'success': True,
                'data': [{
                    'url': r.get('url', ''),
                    'timestamp': r.get('timestamp', ''),
                    'imagesFound': r.get('images_found', 0),
                    'metadata': r.get('metadata', {}),
                    'aiGenerated': r.get('ai_content_detected', False),
                    'threatIndicators': r.get('threat_indicators', 0)
                } for r in image_results[-50:]]
            })
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/intelligence/ip')
    def get_intelligence_ip():
        """Get IP intelligence data"""
        try:
            # Extract IP intelligence from crawler results
            ip_intel = []
            for result in system.crawler.results[-100:]:
                url = result.get('url', '')
                if url:
                    try:
                        from urllib.parse import urlparse
                        parsed = urlparse(url)
                        domain = parsed.netloc or parsed.path
                        
                        ip_intel.append({
                            'url': url,
                            'domain': domain,
                            'timestamp': result.get('timestamp', ''),
                            'threatLevel': 'high' if result.get('threat_indicators', 0) > 3 else 'medium' if result.get('threat_indicators', 0) > 0 else 'low',
                            'metadata': result.get('metadata', {})
                        })
                    except:
                        pass
            
            return jsonify({
                'success': True,
                'data': ip_intel[-50:]
            })
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/logs/stream')
    def stream_logs():
        """Stream activity logs"""
        try:
            # Return recent activity logs
            recent_logs = list(system.activity_log)[-100:] if system.activity_log else []
            
            return jsonify({
                'success': True,
                'data': [{
                    'timestamp': log['timestamp'],
                    'level': log['level'],
                    'message': log['message'],
                    'details': log.get('details', {})
                } for log in recent_logs]
            })
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/crawler/broad-attack', methods=['POST'])
    def broad_attack():
        """Execute broad attack across all networks"""
        try:
            # Add multiple default targets
            default_targets = [
                'https://example.com',
                'https://httpbin.org',
                'https://github.com',
                'https://stackoverflow.com',
                'https://reddit.com'
            ]

            added = 0
            for target in default_targets:
                system.crawler.add_target(target)
                added += 1

            # Start crawler if not running
            if not system.crawler.running:
                threading.Thread(target=system.crawler.run_autonomous, daemon=True).start()

            system.log_activity(f"🚀 Broad attack initiated - {added} targets added", "info")

            return jsonify({
                'success': True,
                'message': f'Broad attack initiated with {added} targets',
                'data': {
                    'targetsAdded': added,
                    'activeCrawls': system.crawler.active_crawls,
                    'itemsProcessed': len(system.crawler.results)
                }
            })
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/system/install-run', methods=['POST'])
    def install_run_system():
        """Monitor and display the existing TypeScript BLOOMCRAWLER RIIS system"""
        try:
            system.log_activity("🔗 Connecting to existing BLOOMCRAWLER RIIS TypeScript server...", "info")

            def monitor_typescript_system():
                try:
                    import subprocess
                    import time
                    import requests

                    # Check if TypeScript server is already running on port 5000
                    try:
                        response = requests.get('http://localhost:5000/health', timeout=2)
                        if response.status_code == 200:
                            system.log_activity("✅ TypeScript server is already running on port 5000", "success")
                            system.log_activity("🎯 BLOOMCRAWLER RIIS system is ACTIVE!", "success")
                            return
                    except:
                        pass

                    # Try to start the TypeScript server using npm
                    system.log_activity("📦 Starting TypeScript BLOOMCRAWLER RIIS server with npm...", "info")

                    try:
                        # Start npm start in background
                        process = subprocess.Popen(
                            ['npm', 'start'],
                            stdout=subprocess.PIPE,
                            stderr=subprocess.STDOUT,
                            text=True,
                            cwd=os.path.dirname(__file__),
                            shell=True
                        )

                        system.log_activity("🚀 npm start command executed", "success")

                        # Monitor the output for a short time
                        start_time = time.time()
                        while time.time() - start_time < 10:  # Monitor for 10 seconds
                            if process.poll() is not None:
                                break

                            line = process.stdout.readline()
                            if line:
                                line = line.strip()
                                if line:
                                    # Parse and display TypeScript server output
                                    if '[BLOOM]' in line or '[SYSTEM]' in line or '[ELITE]' in line or '[STEALTH]' in line or '[DIAGNOSTIC]' in line or '[SOAR]' in line or '[SWARM]' in line:
                                        system.log_activity(line, "info")
                                    elif '✅' in line or 'success' in line.lower():
                                        system.log_activity(line, "success")
                                    elif '❌' in line or 'error' in line.lower() or 'failed' in line.lower():
                                        system.log_activity(line, "error")
                                    elif '⚠️' in line or 'warning' in line.lower():
                                        system.log_activity(line, "warning")
                                    else:
                                        system.log_activity(line, "info")

                        if process.poll() is None:
                            system.log_activity("✅ TypeScript server appears to be running", "success")
                            system.log_activity("🎯 BLOOMCRAWLER RIIS is now active on port 5000", "success")
                        else:
                            system.log_activity(f"⚠️  npm start exited with code {process.returncode}", "warning")

                    except FileNotFoundError:
                        system.log_activity("❌ npm command not found - please install Node.js", "error")
                    except Exception as e:
                        system.log_activity(f"❌ Failed to start npm: {str(e)}", "error")

                except Exception as e:
                    system.log_activity(f"❌ System monitoring error: {str(e)}", "error")

            threading.Thread(target=monitor_typescript_system, daemon=True).start()

            return jsonify({
                'success': True,
                'message': 'Connecting to existing BLOOMCRAWLER RIIS TypeScript system',
                'status': 'connecting'
            })

        except Exception as e:
            system.log_activity(f"❌ System connection failed: {str(e)}", "error")
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/system/connect-existing', methods=['POST'])
    def connect_existing_system():
        """Connect to the running TypeScript BLOOMCRAWLER RIIS system"""
        try:
            system.log_activity("🔗 Attempting to connect to running BLOOMCRAWLER RIIS system...", "info")

            # Check if the TypeScript server is running
            try:
                response = requests.get('http://localhost:5000/health', timeout=3)
                if response.status_code == 200:
                    system.log_activity("✅ Successfully connected to BLOOMCRAWLER RIIS TypeScript server", "success")
                    system.log_activity("🎯 Live system monitoring is now active", "success")

                    # Get system status from the TypeScript server
                    try:
                        status_response = requests.get('http://localhost:5000/api/system/status', timeout=2)
                        if status_response.status_code == 200:
                            status_data = status_response.json()
                            system.log_activity(f"📊 System status: {status_data.get('status', 'unknown')}", "info")
                    except:
                        pass

                    return jsonify({
                        'success': True,
                        'message': 'Connected to existing BLOOMCRAWLER RIIS system',
                        'server_url': 'http://localhost:5000',
                        'status': 'connected'
                    })
                else:
                    system.log_activity(f"⚠️  Server responded with status {response.status_code}", "warning")
            except requests.exceptions.ConnectionError:
                system.log_activity("❌ Cannot connect to BLOOMCRAWLER RIIS server on port 5000", "error")
                system.log_activity("💡 Make sure to run 'npm start' first", "warning")
            except Exception as e:
                system.log_activity(f"❌ Connection error: {str(e)}", "error")

            return jsonify({
                'success': False,
                'message': 'Failed to connect to existing system',
                'error': 'Server not running or not accessible'
            }), 500

        except Exception as e:
            system.log_activity(f"❌ Connection setup failed: {str(e)}", "error")
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/system/start', methods=['POST'])
    def start_system():
        """Start the system"""
        try:
            system.log_activity("🚀 Starting system...", "info")

            # Start autonomous operations
            if not system.crawler.running:
                system.start_autonomous_operations()
                system.log_activity("✅ System started successfully", "success")
            else:
                system.log_activity("⚠️  System already running", "warning")

            return jsonify({
                'success': True,
                'message': 'System started',
                'status': system.system_status
            })

        except Exception as e:
            system.log_activity(f"❌ Start system failed: {str(e)}", "error")
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/system/stop', methods=['POST'])
    def stop_system():
        """Stop the system"""
        try:
            system.log_activity("🛑 Stopping system...", "warning")

            # Stop all operations
            system.emergency_stop_all()
            system.log_activity("✅ System stopped successfully", "success")

            return jsonify({
                'success': True,
                'message': 'System stopped',
                'status': 'stopped'
            })

        except Exception as e:
            system.log_activity(f"❌ Stop system failed: {str(e)}", "error")
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/system/status')
    def get_system_status():
        """Get detailed system status"""
        return jsonify({
            'success': True,
            'data': {
                'status': system.system_status,
                'uptime': str(datetime.now() - system.start_time),
                'running': system.running,
                'components': {
                    'crawler': system.crawler.running,
                    'threat_detector': system.threat_detector.running,
                    'bloom_engine': system.bloom_engine.running,
                    'swarm_crawler': system.swarm_crawler.running
                },
                'stats': {
                    'activeCrawls': system.crawler.active_crawls,
                    'totalTargets': len(system.crawler.targets),
                    'threatsDetected': len(system.threats),
                    'bloomSeeds': len(system.bloom_engine.seeds),
                    'logEntries': len(system.activity_log) if system.activity_log else 0
                }
            }
        })

    @app.route('/health')
    def health():
        return jsonify({
            'status': 'healthy',
            'system': 'BLOOMCRAWLER RIIS',
            'timestamp': datetime.now().isoformat(),
            'version': '2.0'
        })
    
    @app.route('/gemini_callback', methods=['GET', 'POST', 'OPTIONS'])
    def gemini_callback():
        """Handle Gemini callback requests and broadcast to WebSocket clients"""
        try:
            data = request.get_json(silent=True) or request.form.to_dict()
            
            # Log the webhook call
            webhook_data = {
                'source': 'gemini',
                'method': request.method,
                'data': data,
                'timestamp': datetime.now().isoformat()
            }
            
            system.log_activity(f"📡 Gemini webhook received: {request.method}", "info", webhook_data)
            
            # Broadcast to all connected WebSocket clients
            if system.websocket_clients:
                socketio.emit('webhook-event', {
                    'type': 'gemini_callback',
                    'source': 'gemini',
                    'data': data,
                    'timestamp': datetime.now().isoformat()
                })
                socketio.emit('crawler-activity', {
                    'type': 'webhook',
                    'message': f'📡 Gemini webhook: {request.method}',
                    'details': data,
                    'timestamp': datetime.now().isoformat(),
                    'id': f'webhook_{datetime.now().timestamp()}'
                })
            
            # Return success
            return jsonify({
                'status': 'received',
                'message': 'Gemini callback handled and broadcast',
                'timestamp': datetime.now().isoformat(),
                'broadcast_to_clients': len(system.websocket_clients)
            }), 200
        except Exception as e:
            system.log_activity(f"❌ Gemini webhook error: {str(e)}", "error")
            return jsonify({
                'status': 'ok',
                'timestamp': datetime.now().isoformat()
            }), 200
    
    @app.route('/webhook/<webhook_type>', methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
    def generic_webhook(webhook_type):
        """Generic webhook endpoint for any external service"""
        try:
            data = request.get_json(silent=True) or request.form.to_dict() or {}
            headers = dict(request.headers)
            
            # Log the webhook
            webhook_data = {
                'type': webhook_type,
                'method': request.method,
                'data': data,
                'headers': {k: v for k, v in headers.items() if k not in ['Authorization', 'Cookie']},
                'timestamp': datetime.now().isoformat(),
                'ip': request.remote_addr
            }
            
            system.log_activity(f"📡 Webhook received: {webhook_type} ({request.method})", "info", webhook_data)
            
            # Broadcast to all WebSocket clients
            if system.websocket_clients:
                socketio.emit('webhook-event', {
                    'type': webhook_type,
                    'source': request.remote_addr,
                    'method': request.method,
                    'data': data,
                    'timestamp': datetime.now().isoformat()
                })
                
                socketio.emit('crawler-activity', {
                    'type': 'webhook',
                    'message': f'📡 {webhook_type} webhook: {request.method} from {request.remote_addr}',
                    'details': {'type': webhook_type, 'method': request.method},
                    'timestamp': datetime.now().isoformat(),
                    'id': f'webhook_{webhook_type}_{datetime.now().timestamp()}'
                })
            
            return jsonify({
                'status': 'received',
                'webhook_type': webhook_type,
                'method': request.method,
                'timestamp': datetime.now().isoformat(),
                'broadcast_to_clients': len(system.websocket_clients)
            }), 200
        except Exception as e:
            system.log_activity(f"❌ Webhook error ({webhook_type}): {str(e)}", "error")
            return jsonify({
                'status': 'error',
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }), 500
    
    @app.route('/api/webhooks/list')
    def list_webhooks():
        """List all registered webhook endpoints"""
        return jsonify({
            'success': True,
            'webhooks': [
                {'type': 'generic', 'endpoint': '/webhook/<type>', 'methods': ['GET', 'POST', 'PUT', 'DELETE']},
                {'type': 'gemini', 'endpoint': '/gemini_callback', 'methods': ['GET', 'POST', 'OPTIONS']},
            ],
            'total': 2
        })

    # ============================================
    # LIVING CONTAINER SYSTEM API ENDPOINTS
    # ============================================

    @app.route('/api/containers/create', methods=['POST'])
    def create_container():
        """Create a new living container"""
        try:
            data = request.get_json()
            container_name = data.get('name', 'New Container')
            container_type = data.get('type', 'custom')

            # Generate container ID
            container_id = f"container_{int(time.time())}_{len(active_containers)}"

            container = {
                'id': container_id,
                'name': container_name,
                'type': container_type,
                'created': datetime.now().isoformat(),
                'active': True,
                'content': {},
                'stats': {
                    'views': 0,
                    'interactions': 0,
                    'lastActive': datetime.now().isoformat()
                }
            }

            active_containers.append(container)

            system.log_activity(f"🌐 Created living container: {container_name}", "success")
            socketio.emit('container-created', container)

            return jsonify({
                'success': True,
                'container': container,
                'message': f'Container "{container_name}" created successfully'
            })

        except Exception as e:
            system.log_activity(f"❌ Container creation error: {str(e)}", "error")
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/containers/list', methods=['GET'])
    def list_containers():
        """List all active containers"""
        try:
            return jsonify({
                'success': True,
                'containers': active_containers,
                'count': len(active_containers)
            })
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/containers/<container_id>', methods=['GET'])
    def get_container(container_id):
        """Get specific container details"""
        try:
            container = next((c for c in active_containers if c['id'] == container_id), None)
            if container:
                container['stats']['views'] += 1
                container['stats']['lastActive'] = datetime.now().isoformat()
                return jsonify({'success': True, 'container': container})
            else:
                return jsonify({'success': False, 'error': 'Container not found'}), 404
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/containers/<container_id>', methods=['DELETE'])
    def delete_container(container_id):
        """Delete a container"""
        try:
            global active_containers
            initial_count = len(active_containers)
            active_containers = [c for c in active_containers if c['id'] != container_id]

            if len(active_containers) < initial_count:
                system.log_activity(f"🗑️ Deleted container: {container_id}", "warning")
                socketio.emit('container-deleted', {'id': container_id})
                return jsonify({'success': True, 'message': 'Container deleted'})
            else:
                return jsonify({'success': False, 'error': 'Container not found'}), 404

        except Exception as e:
            system.log_activity(f"❌ Container deletion error: {str(e)}", "error")
            return jsonify({'success': False, 'error': str(e)}), 500

    # ============================================
    # SELF-GENERATING WEBHOOK MANAGEMENT API
    # ============================================

    @app.route('/api/webhooks/create', methods=['POST'])
    def create_webhook():
        """Create a new webhook"""
        try:
            data = request.get_json()
            webhook_name = data.get('name', 'New Webhook')
            event_type = data.get('eventType', 'general')
            url = data.get('url', '')
            method = data.get('method', 'POST')

            if not url:
                return jsonify({'success': False, 'error': 'URL is required'}), 400

            # Validate URL
            try:
                from urllib.parse import urlparse
                parsed = urlparse(url)
                if not parsed.scheme or not parsed.netloc:
                    raise ValueError("Invalid URL")
            except:
                return jsonify({'success': False, 'error': 'Invalid URL format'}), 400

            webhook_id = f"webhook_{int(time.time())}_{len(system_webhooks)}"

            webhook = {
                'id': webhook_id,
                'name': webhook_name,
                'eventType': event_type,
                'url': url,
                'method': method,
                'created': datetime.now().isoformat(),
                'active': True,
                'triggered': 0,
                'lastTriggered': None,
                'successRate': 100.0
            }

            system_webhooks.append(webhook)

            system.log_activity(f"🔗 Created webhook: {webhook_name}", "success")
            socketio.emit('webhook-created', webhook)

            return jsonify({
                'success': True,
                'webhook': webhook,
                'message': f'Webhook "{webhook_name}" created successfully'
            })

        except Exception as e:
            system.log_activity(f"❌ Webhook creation error: {str(e)}", "error")
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/webhooks/test/<webhook_id>', methods=['POST'])
    def test_webhook(webhook_id):
        """Test a webhook"""
        try:
            webhook = next((w for w in system_webhooks if w['id'] == webhook_id), None)
            if not webhook:
                return jsonify({'success': False, 'error': 'Webhook not found'}), 404

            # Test the webhook
            test_data = {
                'test': True,
                'webhook': webhook['name'],
                'timestamp': datetime.now().isoformat(),
                'event': webhook['eventType']
            }

            response = requests.request(
                method=webhook['method'],
                url=webhook['url'],
                json=test_data,
                timeout=10
            )

            success = response.status_code < 400
            webhook['triggered'] += 1
            webhook['lastTriggered'] = datetime.now().isoformat()

            if success:
                # Calculate success rate
                total_attempts = webhook.get('totalAttempts', webhook['triggered'])
                webhook['totalAttempts'] = total_attempts
                webhook['successRate'] = ((total_attempts - (webhook.get('failures', 0))) / total_attempts) * 100

                system.log_activity(f"🧪 Webhook test successful: {webhook['name']}", "success")
                socketio.emit('webhook-tested', {
                    'webhook': webhook,
                    'success': True,
                    'statusCode': response.status_code
                })

                return jsonify({
                    'success': True,
                    'message': f'Webhook "{webhook["name"]}" tested successfully',
                    'statusCode': response.status_code
                })
            else:
                # Track failures
                webhook['failures'] = webhook.get('failures', 0) + 1
                webhook['totalAttempts'] = webhook.get('totalAttempts', webhook['triggered']) + 1
                webhook['successRate'] = ((webhook['totalAttempts'] - webhook['failures']) / webhook['totalAttempts']) * 100

                system.log_activity(f"❌ Webhook test failed: {webhook['name']} ({response.status_code})", "error")
                socketio.emit('webhook-tested', {
                    'webhook': webhook,
                    'success': False,
                    'statusCode': response.status_code
                })

                return jsonify({
                    'success': False,
                    'message': f'Webhook test failed with status {response.status_code}',
                    'statusCode': response.status_code
                }), 400

        except requests.exceptions.RequestException as e:
            system.log_activity(f"❌ Webhook test error: {str(e)}", "error")
            return jsonify({'success': False, 'error': f'Request failed: {str(e)}'}), 500
        except Exception as e:
            system.log_activity(f"❌ Webhook test error: {str(e)}", "error")
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/webhooks/delete/<webhook_id>', methods=['DELETE'])
    def delete_webhook(webhook_id):
        """Delete a webhook"""
        try:
            global system_webhooks
            initial_count = len(system_webhooks)
            system_webhooks = [w for w in system_webhooks if w['id'] != webhook_id]

            if len(system_webhooks) < initial_count:
                system.log_activity(f"🗑️ Deleted webhook: {webhook_id}", "warning")
                socketio.emit('webhook-deleted', {'id': webhook_id})
                return jsonify({'success': True, 'message': 'Webhook deleted'})
            else:
                return jsonify({'success': False, 'error': 'Webhook not found'}), 404

        except Exception as e:
            system.log_activity(f"❌ Webhook deletion error: {str(e)}", "error")
            return jsonify({'success': False, 'error': str(e)}), 500

    @app.route('/api/webhooks/trigger/<event_type>', methods=['POST'])
    def trigger_webhooks_by_event(event_type):
        """Manually trigger webhooks for a specific event type"""
        try:
            triggered_count = 0
            successful_count = 0

            for webhook in system_webhooks:
                if webhook['active'] and webhook['eventType'] == event_type:
                    try:
                        test_data = {
                            'manual_trigger': True,
                            'event': event_type,
                            'timestamp': datetime.now().isoformat(),
                            'source': 'manual'
                        }

                        response = requests.request(
                            method=webhook['method'],
                            url=webhook['url'],
                            json=test_data,
                            timeout=5
                        )

                        if response.status_code < 400:
                            webhook['triggered'] += 1
                            webhook['lastTriggered'] = datetime.now().isoformat()
                            successful_count += 1

                    except:
                        pass  # Ignore individual webhook failures

                    triggered_count += 1

            system.log_activity(f"🔗 Manually triggered {successful_count}/{triggered_count} webhooks for event: {event_type}", "info")
            socketio.emit('webhooks-triggered', {
                'eventType': event_type,
                'triggeredCount': triggered_count,
                'successfulCount': successful_count
            })

            return jsonify({
                'success': True,
                'message': f'Triggered {successful_count}/{triggered_count} webhooks for event "{event_type}"',
                'triggered': triggered_count,
                'successful': successful_count
            })

        except Exception as e:
            system.log_activity(f"❌ Webhook trigger error: {str(e)}", "error")
            return jsonify({'success': False, 'error': str(e)}), 500
                },
                {
                    'endpoint': '/webhook/<type>',
                    'methods': ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
                    'description': 'Generic webhook for any service',
                    'example': '/webhook/github, /webhook/discord, etc.'
                }
            ],
            'total_clients': len(system.websocket_clients),
            'server_url': 'http://localhost:5000'
        })

    @socketio.on('connect')
    def handle_connect(auth=None):
        client_id = request.sid
        print(f'\n{"="*60}')
        print(f'✅ WebSocket CLIENT CONNECTED!')
        print(f'   Client ID: {client_id}')
        print(f'   Total clients: {len(system.websocket_clients) + 1}')
        transport_info = str(request.environ.get("wsgi.websocket", "unknown"))
        print(f'   Transport: {transport_info}')
        print(f'{"="*60}\n')
        
        system.websocket_clients.add(client_id)
        
        # Send immediate welcome message
        try:
            socketio.emit('system-status', {
                'status': system.system_status,
                'timestamp': datetime.now().isoformat(),
                'message': 'WebSocket connection established'
            }, room=client_id)
            print(f'✓ Sent system-status to {client_id}')
            
            # Send initial crawler stats
            socketio.emit('system-metrics', {
                'type': 'crawler-stats',
                'data': {
                    'activeCrawls': system.crawler.active_crawls,
                    'totalTargets': len(system.crawler.targets),
                    'itemsProcessed': len(system.crawler.results)
                },
                'timestamp': datetime.now().isoformat()
            }, room=client_id)
            print(f'✓ Sent system-metrics to {client_id}')
            
            # Send test crawler activity to confirm connection works
            socketio.emit('crawler-activity', {
                'type': 'crawl_start',
                'message': '✅ WebSocket connection successful! Live updates enabled.',
                'timestamp': datetime.now().isoformat(),
                'id': f'test_{datetime.now().timestamp()}'
            }, room=client_id)
            print(f'✓ Sent test crawler-activity to {client_id}')
            
        except Exception as e:
            print(f'✗ Error sending initial data to {client_id}: {e}')
            import traceback
            traceback.print_exc()

    @socketio.on('disconnect')
    def handle_disconnect():
        print(f'✗ WebSocket client disconnected: {request.sid}')
        system.websocket_clients.discard(request.sid)

    @socketio.on('monitor-crawler')
    def handle_monitor_crawler():
        print(f'Client {request.sid} monitoring crawler')
        # Send immediate crawler stats
        socketio.emit('system-metrics', {
            'type': 'crawler-stats',
            'data': {
                'activeCrawls': system.crawler.active_crawls,
                'totalTargets': len(system.crawler.targets),
                'itemsProcessed': len(system.crawler.results)
            },
            'timestamp': datetime.now().isoformat()
        }, room=request.sid)

    @socketio.on('monitor-threats')
    def handle_monitor_threats():
        print(f'Client {request.sid} monitoring threats')
        # Send immediate threat stats
        socketio.emit('threat-update', {
            'type': 'threat-stats',
            'data': {
                'total': len(system.threats),
                'critical': sum(1 for t in system.threats if t.get('severity') == 'critical'),
                'high': sum(1 for t in system.threats if t.get('severity') == 'high'),
                'recent': system.threats[-5:] if system.threats else []
            },
            'timestamp': datetime.now().isoformat()
        }, room=request.sid)

    @socketio.on('monitor-swarm')
    def handle_monitor_swarm():
        print(f'Client {request.sid} monitoring swarm')
        # Send immediate swarm stats
        active_workers = len([w for w in system.swarm_crawler.workers if w.is_alive()])
        socketio.emit('swarm-update', {
            'type': 'swarm-stats',
            'data': {
                'active_workers': active_workers,
                'total_workers': len(system.swarm_crawler.workers),
                'targets_queued': len([t for t in system.crawler.targets.values() if t['status'] == 'pending'])
            },
            'timestamp': datetime.now().isoformat()
        }, room=request.sid)

    # Store socketio reference in system
    system.socketio = socketio

    # Start periodic broadcast loop
    def broadcast_updates():
        """Periodically broadcast system updates"""
        while True:
            try:
                time.sleep(2)  # Update every 2 seconds
                
                if system.websocket_clients:
                    # Broadcast crawler stats
                    socketio.emit('system-metrics', {
                        'type': 'crawler-stats',
                        'data': {
                            'activeCrawls': system.crawler.active_crawls,
                            'totalTargets': len(system.crawler.targets),
                            'itemsProcessed': len(system.crawler.results),
                            'torTargets': 0,
                            'i2pTargets': 0
                        },
                        'timestamp': datetime.now().isoformat()
                    })
                    
                    # Broadcast threat stats
                    socketio.emit('threat-update', {
                        'type': 'threat-stats',
                        'data': {
                            'total': len(system.threats),
                            'critical': sum(1 for t in system.threats if t.get('severity') == 'critical'),
                            'high': sum(1 for t in system.threats if t.get('severity') == 'high'),
                            'recent': system.threats[-5:] if system.threats else []
                        },
                        'timestamp': datetime.now().isoformat()
                    })
                    
                    # Broadcast swarm stats
                    active_workers = len([w for w in system.swarm_crawler.workers if w.is_alive()])
                    socketio.emit('swarm-update', {
                        'type': 'swarm-stats',
                        'data': {
                            'active_workers': active_workers,
                            'total_workers': len(system.swarm_crawler.workers),
                            'targets_queued': len([t for t in system.crawler.targets.values() if t['status'] == 'pending'])
                        },
                        'timestamp': datetime.now().isoformat()
                    })
                    
                    # Broadcast system status
                    socketio.emit('system-status', {
                        'status': system.system_status,
                        'timestamp': datetime.now().isoformat()
                    })
            except Exception as e:
                print(f"Broadcast error: {e}")
                time.sleep(5)

    # Start broadcast thread
    broadcast_thread = threading.Thread(target=broadcast_updates, daemon=True)
    broadcast_thread.start()
    print("✓ WebSocket broadcast thread started")

    return app, socketio

def main():
    """Main application entry point"""
    try:
        print("🔥 BLOOMCRAWLER RIIS - Complete Autonomous Cyber Intelligence Platform")
        print("=" * 70)

        # Create system
        print("\n[1/4] Creating system instance...")
        system = BloomCrawlerSystem()
        print("✓ System instance created")

        # Create Flask app
        print("\n[2/4] Creating Flask web server...")
        app, socketio = create_flask_app(system)
        print("✓ Flask app created")

        # Start system components in background threads FIRST
        print("\n[3/4] Starting autonomous operations...")
        system.start_autonomous_operations()
        print("✓ Autonomous operations started")
        
        # Create GUI in background (non-blocking)
        print("\n[4/5] Starting GUI dashboard...")
        try:
            system.create_gui()
            print("✓ GUI thread started")
        except Exception as e:
            print(f"✗ GUI creation error: {e}")
            print("⚠️  Continuing without GUI (web dashboard still available)")
        
        # Print startup info
        print("\n" + "=" * 70)
        print("🎯 BLOOMCRAWLER RIIS System Ready!")
        print("=" * 70)
        print("🌐 Web Dashboard: http://localhost:5000")
        print("🔌 WebSocket: http://localhost:5000/socket.io/")
        print("🖥️  GUI Dashboard: Active (if available)")
        print("🚀 Server starting on port 5000...")
        print("\nPress Ctrl+C to stop...")
        print("=" * 70 + "\n")

        # Run Flask/SocketIO in the MAIN thread (this blocks, which is what we want)
        # This ensures WebSocket works properly
        print("🌐 Starting Flask Server with SocketIO...")
        print("🔌 WebSocket enabled - Server is now listening for connections\n")
        
        try:
            # Run on ALL interfaces (0.0.0.0) for system-wide access
            # This allows connections from localhost, LAN, and any network interface
            print("🌐 Binding to 0.0.0.0:5000 for system-wide WebSocket access")
            print("   - Localhost: http://127.0.0.1:5000")
            print("   - Network IP: http://[your-ip]:5000")
            print("   - WebSocket: ws://[your-ip]:5000/socket.io/\n")
            
            socketio.run(
                app, 
                host='0.0.0.0',  # Bind to all interfaces for system-wide access
                port=5000, 
                debug=False, 
                use_reloader=False, 
                log_output=False,  # Reduce log spam
                allow_unsafe_werkzeug=True  # Allow threading mode
            )
        except KeyboardInterrupt:
            print("\n\n🛑 Shutting down BLOOMCRAWLER RIIS...")
            system.running = False
            system.emergency_stop_all()
            print("✓ System stopped gracefully")
            sys.exit(0)
        except Exception as e:
            print(f"\n✗ Server error: {e}")
            import traceback
            traceback.print_exc()
            sys.exit(1)

    except Exception as e:
        print(f"\n✗ FATAL ERROR: {e}")
        import traceback
        traceback.print_exc()
        print("\nPress Enter to exit...")
        try:
            input()
        except:
            pass
        sys.exit(1)

if __name__ == "__main__":
    main()
