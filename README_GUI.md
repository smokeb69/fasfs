# BLOOMCRAWLER RIIS - All-Encompassing GUI

## 🚀 Access Points

### Primary Entry Point - Master Dashboard
**URL**: http://localhost:5173/master-dashboard
- **Unified Command & Control Dashboard**
- Real-time overview of ALL systems
- Quick action controls
- System-wide statistics and monitoring

### System-Specific Interfaces

#### 1. Swarm Control Panel
**URL**: http://localhost:5173/swarm-control
- Multi-threaded distributed crawling
- Worker management and monitoring
- Target configuration and priority settings
- Real-time crawling statistics

#### 2. Home Dashboard
**URL**: http://localhost:5173/
- Quick access to all major features
- System status overview
- Navigation to specialized tools

#### 3. System Monitor
**URL**: http://localhost:5173/dashboard
- Individual system monitoring
- Performance metrics
- Alert management

## 🖥️ GUI Features

### Master Dashboard Features
- **Real-time System Statistics**: Threat detection, swarm crawler, bloom engine, predictive analytics, graph database, SOAR automation
- **Risk Assessment**: Color-coded risk levels (Green/Yellow/Red)
- **Quick Actions**: Start/Stop swarm, system refresh, defense mode activation
- **Live Activity Feed**: Real-time system logs and notifications
- **Worker Status**: Multi-threaded processing monitoring
- **Performance Metrics**: Speed, throughput, success rates

### Swarm Control Features
- **Target Management**: Add/remove crawling targets with priorities
- **Worker Pool**: Monitor active/idle workers with real-time status
- **Progress Tracking**: Live progress bars and completion statistics
- **Network Types**: TOR, I2P, Surface Web, Deep Web, Social Media support
- **Bloom Seed Deployment**: Automatic seed distribution during crawling

### Navigation System
- **Responsive Design**: Works on desktop and mobile
- **Dark Theme**: Military-grade security aesthetic
- **Intuitive Icons**: Clear visual indicators for each system
- **Quick Access Cards**: One-click access to major functions

## 🔧 Backend API Endpoints

The GUI connects to these backend APIs:

### Core Systems
- `GET /api/threats/live` - Real-time threat monitoring
- `GET /api/swarm/stats` - Swarm crawler statistics
- `GET /api/analytics/predictive` - ML forecasting data
- `GET /api/graph/stats` - Entity relationship data
- `GET /api/soar/stats` - Automation statistics
- `GET /api/bloom/stats` - Bloom engine data

### Swarm Control
- `POST /api/swarm/start` - Initiate swarm crawling
- `POST /api/swarm/add-targets` - Add new targets
- `POST /api/swarm/stop` - Stop all crawling

### Health & Monitoring
- `GET /health` - System health check
- `GET /api/crawler/stats` - Unified crawler stats

## 🎯 Key Capabilities

### Multi-Threading & Performance
- **Worker Pool**: Up to CPU core count concurrent workers
- **Async Processing**: Non-blocking operations
- **Priority Queue**: High-priority targets processed first
- **Resource Management**: Automatic worker lifecycle

### Advanced Analytics
- **Predictive Modeling**: Threat forecasting with ML
- **Entity Extraction**: Named entity recognition
- **Relationship Mapping**: Graph database integration
- **Risk Assessment**: Real-time threat scoring

### Swarm Intelligence
- **Distributed Crawling**: Multi-network simultaneous scanning
- **Bloom Seed Deployment**: Recursive payload distribution
- **Adaptive Targeting**: Dynamic priority adjustment
- **Failure Recovery**: Automatic worker restart

### Security & Automation
- **SOAR Integration**: Automated incident response
- **Real-time Alerts**: Instant threat notifications
- **Graph Analysis**: Entity relationship mapping
- **Forensic Tools**: Advanced investigation capabilities

## 🚦 Getting Started

1. **Start Backend**: `npm start` (Port 5000)
2. **Start Frontend**: `npm run dev` (Port 5173)
3. **Access GUI**: http://localhost:5173/master-dashboard
4. **Monitor Systems**: All data updates in real-time

## 🎮 Control Interface

### Master Dashboard Controls
- **System Cards**: Click to view detailed metrics
- **Quick Actions**: One-click system controls
- **Activity Feed**: Live system notifications
- **Worker Status**: Real-time processing indicators

### Swarm Control Interface
- **Target Form**: Add URLs with network type selection
- **Worker Monitor**: Live worker status and task assignment
- **Statistics Panel**: Performance metrics and completion rates
- **Control Buttons**: Start/Stop swarm operations

The GUI provides a comprehensive, unified interface for controlling and monitoring all BLOOMCRAWLER RIIS systems with military-grade security aesthetics and real-time data visualization.
