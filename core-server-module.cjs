#!/usr/bin/env node
/**
 * BLOOMCRAWLER RIIS - Core Server Module
 * Part 1: Core server with database storage (replaces localStorage)
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { Server } = require('socket.io');
const Database = require('better-sqlite3');

class CoreServer {
  constructor() {
    this.app = express();
    this.server = null;
    this.io = null;
    this.db = null;
    this.PORT = 5000;
    this.systemState = {
      containers: [],
      webhooks: [],
      logs: [],
      settings: {},
      metrics: {
        threatsDetected: 0,
        dataPoints: 0,
        operationsRunning: 0
      }
    };
  }

  // Initialize database (replaces localStorage)
  initDatabase() {
    const dbPath = path.join(__dirname, 'bloomcrawler.db');
    
    try {
      if (fs.existsSync(dbPath)) {
        this.db = new Database(dbPath);
        console.log('✓ Database connected:', dbPath);
      } else {
        this.db = new Database(dbPath);
        this.createTables();
        console.log('✓ New database created:', dbPath);
      }
      return true;
    } catch (error) {
      console.error('✗ Database error:', error.message);
      return false;
    }
  }

  createTables() {
    this.db.exec(`
      -- Core system tables
      CREATE TABLE IF NOT EXISTS containers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        type TEXT,
        status TEXT,
        config TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS webhooks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        url TEXT,
        method TEXT,
        headers TEXT,
        enabled INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS system_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        component TEXT,
        message TEXT,
        level TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS system_settings (
        key TEXT PRIMARY KEY,
        value TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS time_series_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        threats INTEGER,
        data_points INTEGER,
        operations INTEGER
      );

      CREATE TABLE IF NOT EXISTS alert_queue (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        component TEXT,
        message TEXT,
        level TEXT,
        acknowledged INTEGER DEFAULT 0,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Image signatures and detection
      CREATE TABLE IF NOT EXISTS image_signatures (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        hash TEXT UNIQUE,
        risk_level TEXT,
        signature_data TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS detection_alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        signature_id INTEGER,
        severity TEXT,
        status TEXT,
        details TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (signature_id) REFERENCES image_signatures(id)
      );

      -- Bloom engine
      CREATE TABLE IF NOT EXISTS bloom_seeds (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        seed_hash TEXT UNIQUE,
        payload_type TEXT,
        target_vector TEXT,
        purpose TEXT,
        metadata TEXT,
        deployed INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Crawler targets and results
      CREATE TABLE IF NOT EXISTS crawler_targets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        url TEXT,
        type TEXT,
        priority INTEGER,
        depth INTEGER,
        status TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS crawler_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        target_id INTEGER,
        url TEXT,
        content TEXT,
        links TEXT,
        images TEXT,
        metadata TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (target_id) REFERENCES crawler_targets(id)
      );

      -- Image forensics
      CREATE TABLE IF NOT EXISTS image_forensics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        url TEXT,
        filename TEXT,
        ai_confidence REAL,
        model_type TEXT,
        llm_detection INTEGER,
        metadata TEXT,
        threat_level TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- IP intelligence
      CREATE TABLE IF NOT EXISTS ip_intelligence (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ip TEXT UNIQUE,
        reputation REAL,
        threat_score REAL,
        geolocation TEXT,
        last_seen DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Metadata extraction
      CREATE TABLE IF NOT EXISTS metadata_extraction (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        url TEXT,
        title TEXT,
        description TEXT,
        keywords TEXT,
        emails TEXT,
        phones TEXT,
        extracted_data TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Swarm workers
      CREATE TABLE IF NOT EXISTS swarm_workers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        worker_id TEXT UNIQUE,
        status TEXT,
        tasks_completed INTEGER DEFAULT 0,
        last_activity DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  getAssetPath(filename) {
    const possiblePaths = [
      path.join(__dirname, filename),
      path.join(process.cwd(), filename),
      path.join(__dirname, '..', filename),
      path.join(__dirname, 'dist', filename),
    ];

    for (const filePath of possiblePaths) {
      if (fs.existsSync(filePath)) {
        return filePath;
      }
    }
    return possiblePaths[0];
  }

  // Database methods (replace localStorage)
  saveContainers(containers) {
    if (!this.db) return;
    const stmt = this.db.prepare('DELETE FROM containers');
    stmt.run();
    
    const insert = this.db.prepare('INSERT INTO containers (name, type, status, config) VALUES (?, ?, ?, ?)');
    const insertMany = this.db.transaction((items) => {
      for (const item of items) {
        insert.run(item.name || '', item.type || '', item.status || 'active', JSON.stringify(item.config || {}));
      }
    });
    insertMany(containers);
  }

  getContainers() {
    if (!this.db) return [];
    return this.db.prepare('SELECT * FROM containers ORDER BY created_at DESC').all();
  }

  saveWebhooks(webhooks) {
    if (!this.db) return;
    const stmt = this.db.prepare('DELETE FROM webhooks');
    stmt.run();
    
    const insert = this.db.prepare('INSERT INTO webhooks (url, method, headers, enabled) VALUES (?, ?, ?, ?)');
    const insertMany = this.db.transaction((items) => {
      for (const item of items) {
        insert.run(item.url || '', item.method || 'POST', JSON.stringify(item.headers || {}), item.enabled ? 1 : 0);
      }
    });
    insertMany(webhooks);
  }

  getWebhooks() {
    if (!this.db) return [];
    return this.db.prepare('SELECT * FROM webhooks ORDER BY created_at DESC').all();
  }

  saveLog(log) {
    if (!this.db) return;
    const stmt = this.db.prepare('INSERT INTO system_logs (component, message, level) VALUES (?, ?, ?)');
    stmt.run(log.component || 'SYSTEM', log.message || '', log.level || 'info');
    
    // Keep only last 10000 logs
    const deleteOld = this.db.prepare('DELETE FROM system_logs WHERE id NOT IN (SELECT id FROM system_logs ORDER BY timestamp DESC LIMIT 10000)');
    deleteOld.run();
  }

  getLogs(limit = 1000) {
    if (!this.db) return [];
    return this.db.prepare('SELECT * FROM system_logs ORDER BY timestamp DESC LIMIT ?').all(limit);
  }

  saveSettings(settings) {
    if (!this.db) return;
    const insert = this.db.prepare('INSERT OR REPLACE INTO system_settings (key, value) VALUES (?, ?)');
    for (const [key, value] of Object.entries(settings)) {
      insert.run(key, JSON.stringify(value));
    }
  }

  getSettings() {
    if (!this.db) return {};
    const rows = this.db.prepare('SELECT key, value FROM system_settings').all();
    const settings = {};
    for (const row of rows) {
      try {
        settings[row.key] = JSON.parse(row.value);
      } catch (e) {
        settings[row.key] = row.value;
      }
    }
    return settings;
  }

  // Find available port
  async findAvailablePort(startPort = 5000, maxAttempts = 100) {
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

  // Setup middleware
  setupMiddleware() {
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '50mb' }));

    // CORS
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      if (req.method === 'OPTIONS') {
        res.sendStatus(200);
      } else {
        next();
      }
    });

    // Serve static files
    const distPath = this.getAssetPath('dist');
    if (fs.existsSync(distPath)) {
      this.app.use(express.static(distPath));
    }
  }

  async start() {
    try {
      // Initialize database
      this.initDatabase();

      // Find port
      this.PORT = await this.findAvailablePort(5000);
      console.log(`✓ Found available port: ${this.PORT}`);

      // Setup middleware
      this.setupMiddleware();

      // Create HTTP server
      this.server = http.createServer(this.app);

      // Initialize Socket.IO
      this.io = new Server(this.server, {
        cors: { origin: '*', methods: ['GET', 'POST'] }
      });

      this.setupWebSocket();

      // Start listening
      this.server.listen(this.PORT, () => {
        console.log(`🚀 Server running on port: ${this.PORT}`);
        console.log(`🌐 Dashboard: http://localhost:${this.PORT}`);
      });

      return true;
    } catch (error) {
      console.error('✗ Failed to start server:', error);
      return false;
    }
  }

  setupWebSocket() {
    this.io.on('connection', (socket) => {
      console.log(`✓ Client connected: ${socket.id}`);

      socket.emit('system-status', {
        status: 'connected',
        timestamp: new Date().toISOString(),
        port: this.PORT
      });

      // Broadcast updates
      const interval = setInterval(() => {
        socket.emit('system-metrics', {
          threats: this.systemState.metrics.threatsDetected,
          dataPoints: this.systemState.metrics.dataPoints,
          operations: this.systemState.metrics.operationsRunning,
          timestamp: new Date().toISOString()
        });
      }, 5000);

      socket.on('disconnect', () => {
        clearInterval(interval);
      });
    });
  }

  getApp() {
    return this.app;
  }

  getIO() {
    return this.io;
  }

  getDB() {
    return this.db;
  }

  getPort() {
    return this.PORT;
  }

  getSystemState() {
    return this.systemState;
  }
}

module.exports = CoreServer;

