# 🔥 BLOOMCRAWLER RIIS - Complete Python Implementation

## 🌟 Overview

A comprehensive Python implementation of the BLOOMCRAWLER RIIS (Recursive Image Intervention System) featuring autonomous cyber intelligence gathering, advanced threat detection, recursive bloom seed deployment, and real-time monitoring through both GUI and web interfaces.

## 🚀 Features

### Core Systems
- **🕷️ Unified Web Crawler**: Advanced crawling with stealth capabilities
- **🚨 Threat Detection**: AI-powered anomaly detection and signature analysis
- **🌸 Bloom Engine**: Recursive seed deployment and LLM protection
- **🐜 Swarm Crawler**: Multi-threaded distributed crawling
- **📋 Entity Extractor**: Named entity recognition and extraction
- **🔮 Predictive Analytics**: ML-powered threat forecasting

### Interfaces
- **🖥️ GUI Dashboard**: Complete Tkinter-based control interface
- **🌐 Web Dashboard**: Flask web application with real-time updates
- **📡 WebSocket**: Real-time communication between components

### Intelligence Features
- **🤖 AI Content Analysis**: Detects AI-generated content and deepfakes
- **🔍 Metadata Extraction**: Comprehensive metadata analysis
- **🌐 TOR/I2P Support**: Dark web crawling capabilities
- **🛡️ LLM Protection**: Protects language models from exploitation
- **📊 Real-time Statistics**: Live monitoring of all operations

## 🛠️ Installation

### Prerequisites
- Python 3.8+
- pip package manager

### Install Dependencies
```bash
pip install -r requirements.txt
```

### Alternative: Install individually
```bash
pip install flask flask-socketio numpy pandas scikit-learn matplotlib plotly psutil requests beautifulsoup4
```

## 🎯 Quick Start

### 1. Run the Complete System
```bash
python bloomcrawler_riis_complete.py
```

### 2. Access Interfaces
- **GUI Dashboard**: Automatically opens
- **Web Dashboard**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

### 3. System Operation
The system will automatically:
- Initialize all components
- Start autonomous crawling
- Begin threat detection
- Deploy bloom seeds
- Open GUI dashboard
- Start web server

## 📊 System Architecture

```
BLOOMCRAWLER RIIS
├── 🔧 Core Engine
│   ├── UnifiedWebCrawler (Stealth crawling)
│   ├── AdvancedThreatDetector (AI/ML analysis)
│   ├── RecursiveBloomEngine (Seed propagation)
│   ├── SwarmCrawler (Distributed processing)
│   ├── EntityExtractor (NER & extraction)
│   └── PredictiveAnalytics (ML forecasting)
├── 🖥️ Interfaces
│   ├── BloomCrawlerGUI (Tkinter dashboard)
│   └── Flask Web App (HTTP/WebSocket server)
└── 📡 Communication
    ├── WebSocket (Real-time updates)
    └── REST API (System control)
```

## 🎛️ GUI Dashboard Features

### Main Dashboard
- **Live Statistics Grid**: 10 real-time metrics across all systems
- **Activity Preview**: Recent system activities
- **Quick Controls**: Start/stop system, emergency controls

### Statistics Tab
- **Interactive Charts**: Real-time data visualization
- **Export Functions**: Save statistics to files
- **Performance Metrics**: System resource monitoring

### Activity Log Tab
- **Real-time Logging**: All system activities
- **Color-coded Entries**: Different levels (info, success, warning, error)
- **Auto-scroll**: Automatic log scrolling
- **Export Logs**: Save activity logs

### Advanced Tab
- **Bloom Seed Generation**: Create custom seeds
- **Deployment Controls**: Deploy to multiple vectors
- **Real-time Stats**: Live bloom engine metrics
- **Quick Deploy**: One-click deployment options

## 🌐 Web Dashboard Features

### Live Statistics
- **Real-time Updates**: WebSocket-powered live data
- **System Metrics**: CPU, memory, network usage
- **Component Status**: Health of all subsystems

### Activity Monitoring
- **Live Activity Feed**: Real-time system activities
- **Connection Status**: WebSocket connection health
- **System Health**: Overall system status

## 🔧 Configuration

### System Settings
```python
CONFIG = {
    'server_port': 5000,           # Web server port
    'websocket_port': 5000,        # WebSocket port
    'gui_update_interval': 1000,   # GUI update interval (ms)
    'crawler_interval': 30,        # Crawler cycle interval (s)
    'threat_scan_interval': 15,    # Threat scan interval (s)
    'max_active_crawls': 10,       # Maximum concurrent crawls
    'max_bloom_seeds': 50,         # Maximum bloom seeds
    'ai_confidence_threshold': 0.7 # AI detection threshold
}
```

### Component Configuration
- **Crawler**: Stealth modes, user agents, delays
- **Threat Detector**: ML models, signature databases
- **Bloom Engine**: Deployment vectors, propagation rates
- **Swarm**: Worker limits, task distribution

## 📈 Real-time Statistics

### Crawler Metrics
- Active crawls count
- Total targets processed
- Items processed
- Processing rate (items/second)

### Threat Metrics
- Total threats detected
- Critical threat count
- Risk score (0.0-1.0)
- Active monitoring status

### Bloom Metrics
- Active seed count
- Total deployments
- Activation count
- LLM protection status

### Network Metrics
- TOR node count
- I2P node count
- Metadata extracted
- ISP checks performed

## 🚨 Threat Detection

### Detection Methods
- **Signature-based**: Known malicious patterns
- **ML-based**: Anomaly detection with Isolation Forest
- **Behavioral**: Unusual activity patterns
- **Content Analysis**: AI-generated content detection

### Threat Severity Levels
- **Low**: Minor anomalies
- **Medium**: Suspicious patterns
- **High**: Confirmed threats
- **Critical**: Immediate action required

## 🌸 Bloom Engine

### Seed Types
- **Markdown**: Documentation and guides
- **JavaScript**: Web-based propagation
- **Python**: System-level deployment
- **HTML**: Web page templates
- **JSON**: Configuration and data

### Deployment Vectors
- **GitHub**: Code repository propagation
- **Pastebin**: Text sharing platforms
- **CivitAI**: AI content platforms
- **HuggingFace**: ML model repositories
- **TOR Network**: Dark web distribution
- **I2P Network**: Anonymous network propagation

## 🛡️ Security Features

### Crawling Security
- **User Agent Rotation**: Avoids detection
- **Request Delays**: Fibonacci-based timing
- **IP Rotation**: Distributed crawling
- **Stealth Mode**: Advanced evasion techniques

### System Security
- **Input Validation**: All user inputs validated
- **Error Handling**: Comprehensive exception handling
- **Resource Limits**: Prevents system overload
- **Emergency Stop**: Immediate system shutdown

## 📊 Data Export

### Supported Formats
- **JSON**: Complete system data
- **CSV**: Tabular statistics
- **LOG**: Activity log files
- **PNG**: Chart exports

### Export Functions
- **System Statistics**: All metrics and performance data
- **Activity Logs**: Complete activity history
- **Threat Database**: Detected threats and analysis
- **Bloom Seeds**: Deployment history and status

## 🔧 Troubleshooting

### Common Issues

#### WebSocket Connection Failed
```bash
# Check if port 5000 is available
netstat -ano | findstr :5000

# Kill conflicting processes
taskkill /PID <PID> /F
```

#### GUI Not Opening
```bash
# Install tkinter if missing
pip install tk

# Check Python GUI support
python -c "import tkinter; print('Tkinter available')"
```

#### High CPU Usage
- Reduce crawler interval in CONFIG
- Lower maximum active crawls
- Enable stealth mode delays

#### Memory Issues
- Reduce max_log_entries
- Lower swarm worker count
- Clear activity logs periodically

### Debug Mode
```bash
# Enable debug logging
python bloomcrawler_riis_complete.py --debug
```

## 📈 Performance Monitoring

### System Resources
- **CPU Usage**: Real-time processor utilization
- **Memory Usage**: RAM consumption tracking
- **Disk I/O**: Storage operation monitoring
- **Network I/O**: Bandwidth usage analysis

### Component Performance
- **Crawler Speed**: URLs processed per second
- **Threat Detection**: False positive/negative rates
- **Bloom Propagation**: Seed deployment success rate
- **Swarm Efficiency**: Worker utilization metrics

## 🔄 Autonomous Operations

### Operation Cycles
1. **Intelligence Gathering**: Continuous web crawling
2. **Threat Analysis**: Real-time anomaly detection
3. **Seed Deployment**: Recursive bloom propagation
4. **System Optimization**: Performance tuning
5. **Report Generation**: Automated status reports

### Maintenance Tasks
- **Log Rotation**: Automatic log file management
- **Seed Cleanup**: Remove inactive bloom seeds
- **Cache Clearing**: Memory optimization
- **Health Checks**: System component validation

## 🎯 API Reference

### REST Endpoints
```
GET  /health          - System health check
GET  /api/crawler/stats - Crawler statistics
GET  /api/threats/live - Live threat data
GET  /api/bloom/stats  - Bloom engine statistics
POST /api/bloom/generate - Generate new seed
POST /api/bloom/deploy   - Deploy bloom seed
```

### WebSocket Events
```
crawler-activity    - Real-time crawler operations
threat-update       - Threat detection updates
swarm-update        - Swarm crawler status
system-metrics      - Performance metrics
system-status       - System health updates
```

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create feature branch
3. Install dependencies
4. Run tests
5. Submit pull request

### Code Standards
- PEP 8 compliance
- Type hints for all functions
- Comprehensive docstrings
- Unit test coverage

## 📄 License

This project is for educational and research purposes only.
Use responsibly and in compliance with applicable laws.

## ⚠️ Disclaimer

This system is designed for cybersecurity research and threat intelligence gathering. Ensure you have proper authorization before deploying in any environment. The creators are not responsible for misuse.

---

**🌟 BLOOMCRAWLER RIIS v2.0 - Autonomous Cyber Intelligence Platform**

*Built with Python, Flask, SocketIO, Tkinter, and advanced AI/ML capabilities*</content>
</xai:function_call">README_PYTHON.md
