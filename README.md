# BLOOMCRAWLER RIIS - Master Control Dashboard

## 🚀 Quick Start

1. **Start the Server:**
   ```bash
   # Option 1: Use the batch file (Windows)
   run-server.bat

   # Option 2: Manual start
   npx tsx server.ts
   ```
   The server will run on port 5000.

2. **Open Dashboard:**
   - Open `bloomcrawler-dashboard.html` in your browser
   - Or visit `http://localhost:5000` (serves dashboard automatically)

3. **Features Available:**
   - ✅ Live WebSocket monitoring (auto-connects to port 5000)
   - ✅ Real-time crawler activity logs
   - ✅ Live statistics dashboard (10+ metrics)
   - ✅ Advanced Bloom Engine control
   - ✅ REST API fallback when WebSocket fails
   - ✅ Export functionality
   - ✅ Emergency stop controls

## 🔧 WebSocket Connection

The dashboard automatically tries to connect to:
- `http://localhost:5000` (primary)
- `http://localhost:3000` (fallback)
- `http://localhost:3001` (fallback)
- `http://localhost:5173` (fallback)

If connection fails, it will show live stats via REST API every 15 seconds.

## 🎛️ Available Controls

### Quick Actions (Top Bar):
- **Live Stats Toggle** - Show/hide real-time statistics
- **Activity Log Toggle** - Show/hide crawler activity feed
- **Advanced Mode** - Full bloom engine customization panel
- **Emergency Stop** - Halt all autonomous operations
- **Force Reconnect** - Manually reconnect WebSocket

### Advanced Bloom Panel:
- **Generate Seeds** - Create custom bloom seeds with payload types
- **Deploy Seeds** - Deploy to multiple vectors (GitHub, Pastebin, TOR, I2P)
- **Quick Deploy** - One-click deployment to all vectors
- **Live Stats** - Real-time bloom engine statistics

## 📊 Live Statistics Monitored

- **Crawler:** Active crawls, total targets, items processed, processing rate
- **Threats:** Total detected, critical threats, risk score, active monitors
- **Bloom Engine:** Active seeds, deployments, total activations, LLM protection
- **Swarm Crawler:** Active workers, items found, status, success rate
- **Network:** TOR targets, I2P targets, metadata extracted, ISP checks

## 🔌 API Endpoints

- `GET /api/crawler/stats` - Crawler statistics
- `GET /api/threats/live` - Live threat data
- `GET /api/bloom/stats` - Bloom engine statistics
- `GET /api/swarm/stats` - Swarm crawler statistics
- `POST /api/bloom/generate` - Generate new bloom seed
- `POST /api/bloom/deploy` - Deploy bloom seed
- `GET /api/osint/news` - Aggregated OSINT/news feed
- `POST /api/osint/ingest` - Ingest external OSINT items
- `GET /api/sensors/latest` - Recent sensor/geo readings
- `POST /api/sensors/ingest` - Ingest sensor/telemetry
- `GET /api/research/notes` / `POST /api/research/notes` - Analyst notes
- `GET /api/search/unified?q=` - Search OSINT + sensors + alerts

### Environment
Create a `.env` (or set env vars) before start:
```
PORT=5000
JWT_SECRET=change-me
OWNER_OPEN_ID=admin-id
DATABASE_URL=sqlite://./bloomcrawler.db
```

## 🌐 WebSocket Events

The dashboard listens for:
- `crawler-activity` - Real-time crawler operations
- `threat-update` - Threat detection updates
- `swarm-update` - Swarm crawler status
- `system-metrics` - Performance metrics
- `system-status` - System health updates

## 🛠️ Troubleshooting

1. **WebSocket not connecting:**
   - Check if server is running on port 5000
   - Dashboard will fall back to REST API polling

2. **Features not working:**
   - Check browser console for errors
   - Ensure server has all required dependencies

3. **Stats not updating:**
   - WebSocket connection status shown in top-right
   - Green = connected, Red = offline, Yellow = error

## 🎯 System Architecture

- **Frontend:** Single HTML dashboard with WebSocket + REST API
- **Backend:** Node.js/Express server with Socket.IO
- **Database:** SQLite via Drizzle ORM
- **Real-time:** Socket.IO for live updates
- **AI/ML:** Integrated threat detection and analytics

## 🔒 Security Features

- Undetectable crawling with rotating user agents
- Advanced anti-detection measures
- LLM protection for bloom seeds
- Secure WebSocket connections
- CORS protection

---

**Status:** 🟢 FULLY OPERATIONAL - Autonomous cyber intelligence platform ready for deployment.</content>
</xai:function_call"><xai:function_call name="write">
<parameter name="file_path">c:\Users\smoke\Downloads\Website_Project\start.bat