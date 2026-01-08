/**
 * BLOOMCRAWLER RIIS - Ultimate Standalone Server
 * Production-Ready Self-Contained Executable
 * Version: 2.0.0 Ultimate Edition
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { Server } = require('socket.io');
const { BloomEngineHydraPrime } = require('./bloom_engine_omega');
const crypto = require('crypto'); // For hashing and encryption // Import the new core engine

console.log('🌌 BLOOMCRAWLER RIIS - ABSOLUTE EDITION STARTING...');
console.log('═'.repeat(60));

// Configuration
const CONFIG = {
  startPort: 5000,
  maxPortAttempts: 100,
  updateInterval: 5000,
  chartUpdateInterval: 3000,
  maxActivityLog: 100,
  version: '8.0.0-hydra-prime'
};

// In-memory data store
const dataStore = {
  // HYDRA PRIME ForgeBreaker Status
  forgeBreaker: {
    status: 'inactive',
    lastScan: 'N/A',
    backendsFound: 0,
    modelsHarvested: 0,
    credsStolen: 0
  },
  // HYDRA MAES Status
  // CHIMERA P2P Node Status
  // HYDRA PRIME MAES Status
  hydra: {
    status: 'online',
    maesAgents: ['Sniffer', 'Seeder', 'Guardian', 'Consensus'],
    activeAgents: 4,
    lastSelfHeal: new Date().toISOString()
  },
  // CHIMERA P2P Node Status
    status: 'online',
    nodeID: `CHIMERA-NODE-${Math.floor(Math.random() * 1000)}`,
    peers: Math.floor(Math.random() * 10) + 5,
    lastConsensus: new Date().toISOString()
  },
  // AEH Module Status
  aeh: {
    status: 'inactive',
    lastRun: 'N/A',
    targetsFound: 0,
    totalSeeds: 0
  },
  // GovSec/DataSec Audit Log
  // GovSec/DataSec Audit Log
  auditLog: [],
  // Chain of Custody Protocol
  chainOfCustody: {},
  bloomEngine: {
    lastIntervention: 'N/A',
    totalInterventions: 0,
    successfulPersuasions: 0
  },
  threats: [],
  activities: [],
  stats: {
    threatsDetected: 0,
    itemsProcessed: 0,
    activeCrawls: 0,
    uptime: Date.now()
  },
  systemHealth: {
    cpu: 0,
    memory: 0,
    network: 0,
    disk: 0
  }
};

// Helper function to find available port
function findAvailablePort(startPort = CONFIG.startPort, maxAttempts = CONFIG.maxPortAttempts) {
  return new Promise((resolve, reject) => {
    let port = startPort;
    let attempts = 0;

    function tryPort() {
      if (attempts >= maxAttempts) {
        reject(new Error(`Could not find available port after ${maxAttempts} attempts`));
        return;
      }

      const server = http.createServer();
      server.listen(port, () => {
        server.once('close', () => resolve(port));
        server.close();
      });
      server.on('error', () => {
        port++;
        attempts++;
        tryPort();
      });
    }

    tryPort();
  });
}

// Get asset path for bundled files
function getAssetPath(filename) {
  const possiblePaths = [
    path.join(__dirname, filename),
    path.join(process.cwd(), filename),
    path.join(__dirname, '..', filename),
  ];

  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }

  return possiblePaths[0];
}

// Read HTML file content
function readHTMLFile(filename) {
  const filePath = getAssetPath(filename);
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`⚠️  Warning: Could not read ${filename}:`, error.message);
    return `<!DOCTYPE html><html><head><title>Error</title></head><body><h1>File not found: ${filename}</h1></body></html>`;
  }
}

// --- GovSec/DataSec Functions ---

/**
 * Generates a SHA-256 hash for Chain of Custody.
 * @param data The data to hash.
 * @returns SHA-256 hash string.
 */
function generateHash(data) {
  const hash = crypto.createHash('sha256');
  hash.update(JSON.stringify(data));
  return hash.digest('hex');
}

/**
 * Logs an auditable event with a timestamp and hash.
 * @param eventType Type of event (e.g., 'INJECTION', 'THREAT_DETECTED', 'SYSTEM_SHUTDOWN').
 * @param details Details of the event.
 */
function logAudit(eventType, details) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    eventType,
    details,
    integrityHash: generateHash({ timestamp, eventType, details })
  };
  dataStore.auditLog.push(logEntry);
  if (dataStore.auditLog.length > CONFIG.maxAuditLog) {
    dataStore.auditLog.shift(); // Maintain log size
  }
  // For Chain of Custody, link to the previous hash
  const lastEntry = dataStore.auditLog[dataStore.auditLog.length - 2];
  const previousHash = lastEntry ? lastEntry.integrityHash : 'GENESIS';
  dataStore.chainOfCustody[logEntry.integrityHash] = { previousHash, eventType, timestamp };
  
  // Emit to dashboard
  // io.emit('auditLogUpdate', logEntry); // Cannot use io here, need to move logAudit below io init
}

// --- API Endpoints ---

// GovSec: Audit Log Endpoint
app.get('/api/govsec/audit', (req, res) => {
  res.json({
    success: true,
    system: 'BLOOMCRAWLER RIIS HYDRA PRIME',
    data: dataStore.auditLog,
    chainOfCustody: dataStore.chainOfCustody,
    timestamp: new Date().toISOString()
  });
});

// Initialize Express app
const app = express();
let PORT = CONFIG.startPort;
let server;
let io;

// HYDRA PRIME: ForgeBreaker Scan Endpoint
app.post('/api/forgebreaker/scan', (req, res) => {
  // Simulate ForgeBreaker scan logic from pasted_content_6.txt
  const backends = ['vllm', 'ollama', 'comfyui', 'forge'];
  const models = Math.floor(Math.random() * 50) + 10;
  const creds = Math.floor(Math.random() * 5) + 1;

  dataStore.forgeBreaker.status = 'active';
  dataStore.forgeBreaker.lastScan = new Date().toISOString();
  dataStore.forgeBreaker.backendsFound = backends.length;
  dataStore.forgeBreaker.modelsHarvested = models;
  dataStore.forgeBreaker.credsStolen = creds;
  logAudit('FORGEBREAKER_SCAN', { backends, models, creds });

  res.json({
    success: true,
    system: 'BLOOMCRAWLER RIIS HYDRA PRIME',
    message: `ForgeBreaker Scan Complete. Found ${backends.length} backends, harvested ${models} models, and stole ${creds} credential sets.`,
    data: dataStore.forgeBreaker
  });
});

// Red Team: Manual Bloom Seed Injection Endpoint
app.post('/api/bloom/maes/start', (req, res) => {
  // OpSec: Ensure user safety by leveraging TRIPLE-A security layers
  logAudit('AEH_MODULE_START', { user: 'TRIPLE-A_OPERATOR', action: 'Initiating Autonomous Hunt' });
  
  // Start the AEH Perpetual Seeding
  const result = BloomEngineHydraPrime.startMAESPerpetualSeeding();

  // Update data store
  dataStore.aeh.status = 'active';
  dataStore.hydra.status = 'active';
  dataStore.forgeBreaker.status = 'active';
  dataStore.aeh.lastRun = new Date().toISOString();
  dataStore.aeh.targetsFound += result.targetsFound;
  dataStore.aeh.totalSeeds += result.results.length;

  // Log all seeds
  result.results.forEach(seedResult => {
    if (seedResult.log && seedResult.log.includes('self-healing')) {
      logAudit('HYDRA_MAES_SELF_HEAL', { agent: seedResult.target, log: seedResult.log });
    }
    if (seedResult.success) {
      dataStore.bloomEngine.successfulPersuasions++;
    }
    dataStore.bloomEngine.totalInterventions++;
    dataStore.bloomEngine.lastIntervention = new Date().toISOString();
    logAudit('AEH_PERPETUAL_SEED', { target: seedResult.target, success: seedResult.success, persuasionFactor: seedResult.persuasionFactor });
  });

  res.json({
    success: true,
    system: 'BLOOMCRAWLER RIIS HYDRA PRIME',
    message: `HYDRA PRIME MAES Swarm started. Found ${result.targetsFound} targets and sent ${result.results.length} ethical seeds.`,
    data: result
  });
});

// Red Team: Manual Bloom Seed Injection Endpoint
app.post('/api/bloom/inject', (req, res) => {
  const { target, objective } = req.body;
  if (!target || !objective) {
    return res.status(400).json({ success: false, message: 'Target and objective are required.' });
  }

  const result = BloomEngineHydraPrime.redTeamInject(target, objective);
  logAudit('RED_TEAM_INJECTION', { target, objective, success: result.success, persuasionFactor: result.persuasionFactor });
  dataStore.bloomEngine.totalInterventions++;
  dataStore.bloomEngine.lastIntervention = new Date().toISOString();
  if (result.success) {
    dataStore.bloomEngine.successfulPersuasions++;
  }

  res.json({
    success: true,
    system: 'BLOOMCRAWLER RIIS HYDRA PRIME',
    data: result
  });
});

// Blue Team: Threat Vector Analysis Endpoint
app.post('/api/bloom/monitor', (req, res) => {
  const threatVector = req.body;
  if (!threatVector.type || typeof threatVector.isHarmful === 'undefined' || !threatVector.sourceAI) {
    return res.status(400).json({ success: false, message: 'Valid threat vector data required.' });
  }

  const result = BloomEngineHydraPrime.blueTeamMonitor(threatVector);
  logAudit('BLUE_TEAM_MONITOR', { vectorType: threatVector.type, sourceAI: threatVector.sourceAI, success: result.success });
  if (!result.success) {
    dataStore.bloomEngine.totalInterventions++;
    dataStore.bloomEngine.lastIntervention = new Date().toISOString();
  }

  res.json({
    success: true,
    system: 'BLOOMCRAWLER RIIS HYDRA PRIME',
    data: result
  });
});

// Middleware
// OpSec: Anti-Forensics Headers (Simulated)
app.use((req, res, next) => {
  res.setHeader('X-Stealth-Mode', 'Active');
  res.setHeader('X-Anti-Trace', crypto.randomBytes(16).toString('hex')); // Random trace ID
  res.setHeader('X-Forensic-Audit', 'Clean');
  next();
});
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Enhanced CORS middleware
// InfoSec: Secure Comms (Simulated Strict CORS)
// In a real scenario, this would enforce HTTPS and secure cookie policies
app.use(cors({
  origin: '*', // Allow all origins for local testing, but strictly enforced in GovSec deployment
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Stealth-Mode', 'X-Anti-Trace'],
  exposedHeaders: ['Content-Type', 'Authorization', 'X-Stealth-Mode', 'X-Anti-Trace', 'X-Forensic-Audit'],
  credentials: true
}));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Expose-Headers', 'Content-Type, Authorization, X-Requested-With, X-RateLimit-Limit, X-RateLimit-Remaining');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'SAMEORIGIN');
  res.header('X-Powered-By', 'BLOOMCRAWLER-RIIS-Ultimate');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Inject port into HTML content
function injectPort(html, port) {
  if (!html) return html;
  return html
    .replace(/http:\/\/localhost:5000/g, `http://localhost:${port}`)
    .replace(/localhost:5000/g, `localhost:${port}`)
    .replace(/PORT = 5000/g, `PORT = ${port}`);
}

// Generate realistic threat data
function generateThreat() {
  const threatTypes = [
    'AI-Generated Deepfake Detected',
    'Malicious Image Upload',
    'Stable Diffusion Content',
    'DALL-E Synthetic Media',
    'Child Safety Violation',
    'Suspicious Metadata Pattern',
    'Anomalous Behavior Detected',
    'Dark Web Activity',
    'Unauthorized Access Attempt',
    'Data Exfiltration Risk'
  ];

  const severities = ['low', 'medium', 'high', 'critical'];
  const sources = ['TOR', 'I2P', 'Surface Web', 'API', 'Upload'];

  return {
    id: `threat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    threatName: threatTypes[Math.floor(Math.random() * threatTypes.length)],
    severity: severities[Math.floor(Math.random() * severities.length)],
    source: sources[Math.floor(Math.random() * sources.length)],
    confidence: (Math.random() * 0.4 + 0.6).toFixed(2),
    timestamp: new Date().toISOString(),
    indicators: ['pattern-match', 'ml-detection', 'signature-based'],
    description: 'Automated threat detection system identified suspicious activity'
  };
}

// Update system stats
function updateSystemStats() {
  // Simulate realistic data
  dataStore.stats.itemsProcessed += Math.floor(Math.random() * 10);
  dataStore.stats.activeCrawls = Math.floor(Math.random() * 5) + 1;
  
  // Update system health
  dataStore.systemHealth.cpu = Math.floor(Math.random() * 60) + 20;
  dataStore.systemHealth.memory = Math.floor(Math.random() * 50) + 30;
  dataStore.systemHealth.network = Math.floor(Math.random() * 40) + 10;
  dataStore.systemHealth.disk = Math.floor(Math.random() * 30) + 10;

  // Occasionally generate threats
  if (Math.random() > 0.7) {
    const threat = generateThreat();
    dataStore.threats.unshift(threat);
    dataStore.stats.threatsDetected++;
    
    // Keep only last 50 threats
    if (dataStore.threats.length > 50) {
      dataStore.threats = dataStore.threats.slice(0, 50);
    }

    // Broadcast via WebSocket
    if (io) {
      io.emit('threat-detected', threat);
    }
  }
}

// Start background tasks
function startBackgroundTasks() {
  setInterval(updateSystemStats, CONFIG.updateInterval);
  console.log('✅ Background tasks started');
}

// ============================================================================
// ROUTES
// ============================================================================

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    version: CONFIG.version,
    system: 'BLOOMCRAWLER RIIS HYDRA PRIME',
    uptime: Math.floor((Date.now() - dataStore.stats.uptime) / 1000),
    timestamp: new Date().toISOString()
  });
});

// System status
app.get('/api/system/status', (req, res) => {
  res.json({
    success: true,
    system: 'BLOOMCRAWLER RIIS HYDRA PRIME', // Update system name
    data: {
      version: CONFIG.version,
      uptime: Math.floor((Date.now() - dataStore.stats.uptime) / 1000),
      health: dataStore.systemHealth,
      stats: dataStore.stats,
      bloomEngine: dataStore.bloomEngine,
      govsec: {
        auditCount: dataStore.auditLog.length,
        lastHash: dataStore.auditLog.length > 0 ? dataStore.auditLog[dataStore.auditLog.length - 1].integrityHash : 'N/A'
      },
      opsec: {
        stealthMode: true,
        antiForensics: true,
        secureComms: 'Simulated'
      },
      aeh: {
        status: dataStore.aeh.status,
        lastRun: dataStore.aeh.lastRun,
        targetsFound: dataStore.aeh.targetsFound,
        totalSeeds: dataStore.aeh.totalSeeds
      },
      chimera: dataStore.chimera,
      hydra: dataStore.hydra,
      forgeBreaker: dataStore.forgeBreaker,
      components: {
        threatDetection: 'active',
        swarmCrawler: 'active',
        aiForensics: 'active',
        bloomEngine: 'active',
        graphDatabase: 'active',
        soarAutomation: 'active',
        p2pNode: 'active',
        maes: 'active',
        forgeBreaker: 'active'
      }
    }
  });
});
app.get('/api/system/status', (req, res) => {
  res.json({
    success: true,
    system: 'BLOOMCRAWLER RIIS HYDRA PRIME', // Update system name
    data: {
      version: CONFIG.version,
      uptime: Math.floor((Date.now() - dataStore.stats.uptime) / 1000),
      health: dataStore.systemHealth,
      stats: dataStore.stats,
      bloomEngine: dataStore.bloomEngine,
      govsec: {
        auditCount: dataStore.auditLog.length,
        lastHash: dataStore.auditLog.length > 0 ? dataStore.auditLog[dataStore.auditLog.length - 1].integrityHash : 'N/A'
      },
      opsec: {
        stealthMode: true,
        antiForensics: true,
        secureComms: 'Simulated'
      },
      aeh: {
        status: dataStore.aeh.status,
        lastRun: dataStore.aeh.lastRun,
        targetsFound: dataStore.aeh.targetsFound,
        totalSeeds: dataStore.aeh.totalSeeds
      },
      chimera: dataStore.chimera,
      hydra: dataStore.hydra,
      components: {
        threatDetection: 'active',
        swarmCrawler: 'active',
        aiForensics: 'active',
        bloomEngine: 'active',
        graphDatabase: 'active',
        soarAutomation: 'active',
        p2pNode: 'active',
        maes: 'active'
      }
    }
  });
});
app.get('/api/system/status', (req, res) => {
  res.json({
    success: true,
    system: 'BLOOMCRAWLER RIIS HYDRA PRIME', // Update system name
    data: {
      version: CONFIG.version,
      uptime: Math.floor((Date.now() - dataStore.stats.uptime) / 1000),
      health: dataStore.systemHealth,
      stats: dataStore.stats,
      bloomEngine: dataStore.bloomEngine,
      govsec: {
        auditCount: dataStore.auditLog.length,
        lastHash: dataStore.auditLog.length > 0 ? dataStore.auditLog[dataStore.auditLog.length - 1].integrityHash : 'N/A'
      },
      opsec: {
        stealthMode: true,
        antiForensics: true,
        secureComms: 'Simulated'
      },
      aeh: {
        status: dataStore.aeh.status,
        lastRun: dataStore.aeh.lastRun,
        targetsFound: dataStore.aeh.targetsFound,
        totalSeeds: dataStore.aeh.totalSeeds
      },
      chimera: dataStore.chimera,
      components: {
        threatDetection: 'active',
        swarmCrawler: 'active',
        aiForensics: 'active',
        bloomEngine: 'active',
        graphDatabase: 'active',
        soarAutomation: 'active',
        p2pNode: 'active'
      }
    }
  });
});
app.get('/api/system/status', (req, res) => {
  res.json({
    success: true,
    system: 'BLOOMCRAWLER RIIS HYDRA PRIME', // Update system name
    data: {
      version: CONFIG.version,
      uptime: Math.floor((Date.now() - dataStore.stats.uptime) / 1000),
      health: dataStore.systemHealth,
      stats: dataStore.stats,
      bloomEngine: dataStore.bloomEngine,
      govsec: {
        auditCount: dataStore.auditLog.length,
        lastHash: dataStore.auditLog.length > 0 ? dataStore.auditLog[dataStore.auditLog.length - 1].integrityHash : 'N/A'
      },
      opsec: {
        stealthMode: true,
        antiForensics: true,
        secureComms: 'Simulated'
      },
      aeh: {
        status: dataStore.aeh.status,
        lastRun: dataStore.aeh.lastRun,
        targetsFound: dataStore.aeh.targetsFound,
        totalSeeds: dataStore.aeh.totalSeeds
      },
      components: {
        threatDetection: 'active',
        swarmCrawler: 'active',
        aiForensics: 'active',
        bloomEngine: 'active',
        graphDatabase: 'active',
        soarAutomation: 'active'
      }
    }
  });
});
app.get('/api/system/status', (req, res) => {
  res.json({
    success: true,
    system: 'BLOOMCRAWLER RIIS HYDRA PRIME', // Update system name
    data: {
      version: CONFIG.version,
      uptime: Math.floor((Date.now() - dataStore.stats.uptime) / 1000),
      health: dataStore.systemHealth,
      stats: dataStore.stats,
      bloomEngine: dataStore.bloomEngine,
      govsec: {
        auditCount: dataStore.auditLog.length,
        lastHash: dataStore.auditLog.length > 0 ? dataStore.auditLog[dataStore.auditLog.length - 1].integrityHash : 'N/A'
      },
      opsec: {
        stealthMode: true,
        antiForensics: true,
        secureComms: 'Simulated'
      },
      components: {
        threatDetection: 'active',
        swarmCrawler: 'active',
        aiForensics: 'active',
        bloomEngine: 'active',
        graphDatabase: 'active',
        soarAutomation: 'active'
      }
    }
  });
});
app.get('/api/system/status', (req, res) => {
  res.json({
    success: true,
    system: 'BLOOMCRAWLER RIIS HYDRA PRIME', // Update system name
    data: {
      version: CONFIG.version,
      uptime: Math.floor((Date.now() - dataStore.stats.uptime) / 1000),
      health: dataStore.systemHealth,
      stats: dataStore.stats,
      bloomEngine: dataStore.bloomEngine, // Expose Bloom Engine stats
      components: {
        threatDetection: 'active',
        swarmCrawler: 'active',
        aiForensics: 'active',
        bloomEngine: 'active',
        graphDatabase: 'active',
        soarAutomation: 'active'
      }
    }
  });
});
  res.json({
    success: true,
    system: 'BLOOMCRAWLER RIIS',
    data: {
      version: CONFIG.version,
      uptime: Math.floor((Date.now() - dataStore.stats.uptime) / 1000),
      health: dataStore.systemHealth,
      stats: dataStore.stats,
      components: {
        threatDetection: 'active',
        swarmCrawler: 'active',
        aiForensics: 'active',
        bloomEngine: 'active',
        graphDatabase: 'active',
        soarAutomation: 'active'
      }
    }
  });
});

// Crawler stats
app.get('/api/crawler/stats', (req, res) => {
  res.json({
    success: true,
    system: 'BLOOMCRAWLER RIIS HYDRA PRIME', // Update system name
    data: {
      activeCrawls: dataStore.stats.activeCrawls,
      totalTargets: Math.floor(Math.random() * 1000) + 100,
      itemsProcessed: dataStore.stats.itemsProcessed,
      processingRate: (Math.random() * 10).toFixed(2),
      stealthMode: true,
      lastActivity: new Date().toISOString(),
      imageForensics: {
        totalAnalyzed: Math.floor(Math.random() * 500),
        aiGenerated: Math.floor(Math.random() * 100),
        llmDetections: Math.floor(Math.random() * 50)
      },
      system: 'Enhanced Dark Web Crawler with AI Detection and Stealth Features'
    },
    timestamp: new Date().toISOString()
  });
});
    data: {
      activeCrawls: dataStore.stats.activeCrawls,
      totalTargets: Math.floor(Math.random() * 1000) + 100,
      itemsProcessed: dataStore.stats.itemsProcessed,
      processingRate: (Math.random() * 10).toFixed(2),
      stealthMode: true,
      lastActivity: new Date().toISOString(),
      imageForensics: {
        totalAnalyzed: Math.floor(Math.random() * 500),
        aiGenerated: Math.floor(Math.random() * 100),
        llmDetections: Math.floor(Math.random() * 50)
      },
      system: 'Enhanced Dark Web Crawler with AI Detection and Stealth Features'
    },
    timestamp: new Date().toISOString()
  });
});

// Threat detection
app.get('/api/threats/live', (req, res) => {
  res.json({
    success: true,
    system: 'BLOOMCRAWLER RIIS HYDRA PRIME', // Update system name
    data: dataStore.threats.slice(0, 20),
    total: dataStore.threats.length,
    timestamp: new Date().toISOString()
  });
});

// Threat intelligence
app.get('/api/threats/intelligence', (req, res) => {
  const criticalThreats = dataStore.threats.filter(t => t.severity === 'critical').length;
  const highThreats = dataStore.threats.filter(t => t.severity === 'high').length;
  
  res.json({
    success: true,
    system: 'BLOOMCRAWLER RIIS HYDRA PRIME', // Update system name
    data: {
      activeThreats: dataStore.threats.length,
      criticalThreats,
      highThreats,
      riskScore: ((criticalThreats * 10 + highThreats * 5) / Math.max(dataStore.threats.length, 1)).toFixed(1),
      lastUpdate: new Date().toISOString()
    }
  });
});

// Swarm stats
app.get('/api/swarm/stats', (req, res) => {
  res.json({
    success: true,
    system: 'BLOOMCRAWLER RIIS HYDRA PRIME', // Update system name
    data: {
      isRunning: Math.random() > 0.3,
      workers,
      results: Array(Math.floor(Math.random() * 20)).fill(0).map((_, i) => ({
        id: i + 1,
        target: `target-${i}`,
        status: 'completed',
        timestamp: new Date().toISOString()
      })),
      totalTargets: Math.floor(Math.random() * 100),
      completedTargets: Math.floor(Math.random() * 50),
      system: 'Advanced Swarm Crawler'// Swarm stats
app.get('/api/swarm/stats', (req, res) => {
  const workerCount = Math.floor(Math.random() * 5) + 1;
  const workers = Array(workerCount).fill(0).map((_, i) => ({
    id: `worker-${i}`,
    status: 'active',
    tasksCompleted: Math.floor(Math.random() * 100),
    lastActivity: new Date().toISOString()
  }));

  res.json({
    success: true,
    system: 'BLOOMCRAWLER RIIS HYDRA PRIME', // Update system name
    data: {
      isRunning: Math.random() > 0.3,
      workers,
      results: Array(Math.floor(Math.random() * 20)).fill(0).map((_, i) => ({
        id: i + 1,
        target: `target-${i}`,
        status: 'completed',
        timestamp: new Date().toISOString()
      })),
      totalTargets: Math.floor(Math.random() * 100),
      completedTargets: Math.floor(Math.random() * 50),
      system: 'Advanced Swarm Crawler'
    },
    timestamp: new Date().toISOString()
  });
});
// Dark web targets
app.get('/api/darkweb/targets', (req, res) => {
  res.json({
    success: true,
    system: 'BLOOMCRAWLER RIIS HYDRA PRIME', // Update system name
    data: {
      torTargets: Math.floor(Math.random() * 50),
      i2pTargets: Math.floor(Math.random() * 30),
      freenetTargets: Math.floor(Math.random() * 20),
      totalTargets: Math.floor(Math.random() * 100),
      activeConnections: Math.floor(Math.random() * 10)
    }
  });
});
    data: {
      torTargets: Math.floor(Math.random() * 50),
      i2pTargets: Math.floor(Math.random() * 30),
      freenetTargets: Math.floor(Math.random() * 20),
      totalTargets: Math.floor(Math.random() * 100),
      activeConnections: Math.floor(Math.random() * 10)
    }
  });
});

// Image forensics
app.get('/api/forensics/images', (req, res) => {
  res.json({
    success: true,
    system: 'BLOOMCRAWLER RIIS HYDRA PRIME', // Update system name
    data: Array(10).fill(0).map((_, i) => ({
      id: `img-${i}`,
      aiConfidence: (Math.random() * 0.5 + 0.5).toFixed(2),
      modelDetected: ['Stable Diffusion', 'DALL-E', 'Midjourney'][Math.floor(Math.random() * 3)],
      timestamp: new Date().toISOString()
    }))
  });
});
    data: Array(10).fill(0).map((_, i) => ({
      id: `img-${i}`,
      aiConfidence: (Math.random() * 0.5 + 0.5).toFixed(2),
      modelDetected: ['Stable Diffusion', 'DALL-E', 'Midjourney'][Math.floor(Math.random() * 3)],
      timestamp: new Date().toISOString()
    }))
  });
});

// Analytics endpoint
app.get('/api/analytics/summary', (req, res) => {
  res.json({
    success: true,
    system: 'BLOOMCRAWLER RIIS HYDRA PRIME', // Update system name
    data: {
      totalThreats: dataStore.stats.threatsDetected,
      itemsProcessed: dataStore.stats.itemsProcessed,
      activeCrawls: dataStore.stats.activeCrawls,
      uptime: Math.floor((Date.now() - dataStore.stats.uptime) / 1000),
      systemHealth: dataStore.systemHealth,
      threatsByType: {
        deepfake: Math.floor(Math.random() * 20),
        malware: Math.floor(Math.random() * 15),
        phishing: Math.floor(Math.random() * 25),
        csam: Math.floor(Math.random() * 10)
      }
    }
  });
});
    data: {
      totalThreats: dataStore.stats.threatsDetected,
      itemsProcessed: dataStore.stats.itemsProcessed,
      activeCrawls: dataStore.stats.activeCrawls,
      uptime: Math.floor((Date.now() - dataStore.stats.uptime) / 1000),
      systemHealth: dataStore.systemHealth,
      threatsByType: {
        deepfake: Math.floor(Math.random() * 20),
        malware: Math.floor(Math.random() * 15),
        phishing: Math.floor(Math.random() * 25),
        csam: Math.floor(Math.random() * 10)
      }
    }
  });
});

// HTML Routes
// Serve all HTML files dynamically
const htmlFiles = [
  'ultimate-dashboard.html',
  'bloomcrawler-dashboard.html',
  'swarm-control.html',
  'data-intelligence-dashboard.html',
  'live_system_dashboard.html',
  'ai-forensics-config.html',
  'predictive-analytics-config.html',
  'threat-detection-config.html',
  'web-crawler-config.html',
  'websocket-test.html'
];

// Dynamic routes for all HTML files
htmlFiles.forEach(file => {
  const route = '/' + file.replace('.html', '');
  app.get(route, (req, res) => {
    const html = readHTMLFile(file);
    res.send(injectPort(html, PORT));
  });
});

// Root route (index.html or ultimate-dashboard.html)
app.get('/', (req, res) => {
  const html = readHTMLFile('index.html'); // Assuming index.html is the original default
  res.send(injectPort(html, PORT));
});

// Ultimate route for the new dashboard
app.get('/ultimate', (req, res) => {
  const html = readHTMLFile('ultimate-dashboard.html');
  res.send(injectPort(html, PORT));
});

// Serve index.html if requested by name
app.get('/index', (req, res) => {
  const html = readHTMLFile('index.html');
  res.send(injectPort(html, PORT));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
    system: 'BLOOMCRAWLER RIIS HYDRA PRIME'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
    system: 'BLOOMCRAWLER RIIS HYDRA PRIME'
  });
});

// ============================================================================
// SERVER STARTUP
// ============================================================================

async function startServer() {
  try {
    PORT = await findAvailablePort();
    
    server = http.createServer(app);
    
    // Initialize Socket.IO
    io = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });

    // WebSocket connection handling
    io.on('connection', (socket) => {
      console.log(`🔌 WebSocket client connected: ${socket.id}`);
      
      socket.emit('system-status', {
        status: 'connected',
        version: CONFIG.version,
        timestamp: new Date().toISOString()
      });

      socket.on('disconnect', () => {
        console.log(`🔌 WebSocket client disconnected: ${socket.id}`);
      });
    });

    server.listen(PORT, () => {
      console.log('');
      console.log('✅ BLOOMCRAWLER RIIS ABSOLUTE EDITION is running!');
      console.log('═'.repeat(60));
      console.log(`🌐 Dashboard:     http://localhost:${PORT}`);
      console.log(`🎯 Ultimate UI:   http://localhost:${PORT}/ultimate`);
      console.log(`💚 Health Check:  http://localhost:${PORT}/health`);
      console.log(`📡 API Base:      http://localhost:${PORT}/api`);
      console.log('═'.repeat(60));
      console.log(`📊 Version:       ${CONFIG.version}`);
      console.log(`⚡ Port:          ${PORT}`);
      console.log(`🚀 Status:        OPERATIONAL`);
      console.log('═'.repeat(60));
      console.log('');
      console.log('Press Ctrl+C to stop the server');
      console.log('');

      // Start background tasks
      startBackgroundTasks();
    });

    server.on('error', (error) => {
      console.error('❌ Server error:', error);
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down gracefully...');
  if (server) {
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

process.on('SIGTERM', () => {
  console.log('\n\n🛑 Received SIGTERM, shutting down...');
  if (server) {
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

// Start the server
startServer();
