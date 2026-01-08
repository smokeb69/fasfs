console.log('Starting BLOOMCRAWLER RIIS Simple Server...');

const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');

console.log('Express loaded:', typeof express);

const app = express();
const PORT = 5000;

console.log('Server configured for port:', PORT);

// Basic middleware
app.use(express.json());
// Security & CORS
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(cors({ origin: '*'}));
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Type, Authorization, X-Requested-With, X-RateLimit-Limit, X-RateLimit-Remaining');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') return res.status(200).end();
  next();
});

// Serve the dashboard
app.get('/', (req, res) => {
  console.log('Serving dashboard from:', path.join(__dirname, 'bloomcrawler-dashboard.html'));
  const filePath = path.join(__dirname, 'bloomcrawler-dashboard.html');
  console.log('Full path:', filePath);
  console.log('File exists:', require('fs').existsSync(filePath));

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error serving dashboard:', err);
      res.status(500).send('Error loading dashboard: ' + err.message);
    } else {
      console.log('Dashboard served successfully');
    }
  });
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!', timestamp: new Date().toISOString() });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    system: 'BLOOMCRAWLER RIIS',
    activation: 'ULTIMATE_FULL'
  });
});

// Basic API endpoints
app.get('/api/crawler/stats', (req, res) => {
  res.json({
    success: true,
    system: 'BLOOMCRAWLER RIIS',
    data: {
      activeCrawls: Math.floor(Math.random() * 5),
      totalTargets: Math.floor(Math.random() * 1000),
      itemsProcessed: Math.floor(Math.random() * 500),
      processingRate: Math.random() * 10,
      system: 'Enhanced Dark Web Crawler with AI Detection and Stealth Features'
    }
  });
});

app.get('/api/threats/live', (req, res) => {
  res.json({
    success: true,
    data: {
      activeMonitoring: true,
      totalThreatsDetected: Math.floor(Math.random() * 50),
      threatIntelligence: {
        criticalThreats: Math.floor(Math.random() * 10),
        riskScore: Math.random() * 100
      }
    }
  });
});

app.get('/api/bloom/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      activeSeeds: Math.floor(Math.random() * 10),
      totalActivations: Math.floor(Math.random() * 100),
      llmProtection: { activeLLMProtections: Math.floor(Math.random() * 20) }
    }
  });
});

app.get('/api/swarm/stats', (req, res) => {
  res.json({
    success: true,
    system: 'BLOOMCRAWLER RIIS',
    data: {
      workers: Array(Math.floor(Math.random() * 5)).fill({}),
      results: Array(Math.floor(Math.random() * 20)).fill({}),
      isRunning: Math.random() > 0.5,
      system: 'Advanced Swarm Crawler'
    }
  });
});

app.get('/api/darkweb/targets', (req, res) => {
  res.json({
    success: true,
    data: {
      torTargets: Math.floor(Math.random() * 50),
      i2pTargets: Math.floor(Math.random() * 30)
    }
  });
});

// Forensics APIs
app.get('/api/forensics/images', (req, res) => {
  res.json({
    success: true,
    count: Math.floor(Math.random() * 100),
    data: Array(5).fill(0).map((_, i) => ({ id: i + 1, status: 'analyzed' }))
  });
});

app.get('/api/forensics/ai-images', (req, res) => {
  res.json({
    success: true,
    count: Math.floor(Math.random() * 50),
    data: Array(5).fill(0).map((_, i) => ({ id: i + 1, detected: Math.random() > 0.5 }))
  });
});

app.get('/api/forensics/llm-detections', (req, res) => {
  res.json({
    success: true,
    count: Math.floor(Math.random() * 40)
  });
});

app.post('/api/forensics/analyze-image', (req, res) => {
  res.status(200).json({ success: true, received: true });
});

// Containers and Webhooks
app.get('/api/containers/list', (req, res) => {
  res.json({ success: true, containers: [] });
});

app.get('/api/webhooks/list', (req, res) => {
  res.json({ success: true, webhooks: [] });
});

// System status
app.get('/api/system/status', (req, res) => {
  res.json({
    success: true,
    data: {
      components: {
        api: 'ok',
        database: 'ok',
        websocket: 'ok'
      }
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    system: 'BLOOMCRAWLER RIIS',
    activation: 'SIMPLE_MODE'
  });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 BLOOMCRAWLER RIIS Simple Server running on port ${PORT}`);
  console.log(`🌐 Dashboard: http://localhost:${PORT}`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/test`);
}).on('error', (err) => {
  console.error('Server failed to start:', err);
  process.exit(1);
});

// Handle server errors
server.on('error', (err) => {
  console.error('Server error:', err);
});

// For testing, don't exit on SIGINT
process.on('SIGINT', () => {
  console.log('SIGINT received - ignoring for testing');
});

// Keep server alive for testing
setTimeout(() => {
  console.log('Server has been running for 30 seconds');
}, 30000);
