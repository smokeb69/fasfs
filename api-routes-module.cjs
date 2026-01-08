#!/usr/bin/env node
/**
 * BLOOMCRAWLER RIIS - API Routes Module
 * Part 3: All API endpoints
 */

function setupAPI(coreServer, crawler, advancedFeatures) {
  const app = coreServer.getApp();
  const db = coreServer.getDB();
  const io = coreServer.getIO();
  const systemState = coreServer.getSystemState();

  // ============================================
  // DASHBOARD API (replaces localStorage)
  // ============================================

  // Get containers (replaces localStorage)
  app.get('/api/containers/list', (req, res) => {
    try {
      const containers = coreServer.getContainers();
      res.json({ success: true, containers });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/containers/save', (req, res) => {
    try {
      const { containers } = req.body;
      coreServer.saveContainers(containers || []);
      res.json({ success: true, message: 'Containers saved' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get webhooks (replaces localStorage)
  app.get('/api/webhooks/list', (req, res) => {
    try {
      const webhooks = coreServer.getWebhooks();
      res.json({ success: true, webhooks });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/webhooks/save', (req, res) => {
    try {
      const { webhooks } = req.body;
      coreServer.saveWebhooks(webhooks || []);
      res.json({ success: true, message: 'Webhooks saved' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get logs (replaces localStorage)
  app.get('/api/logs/list', (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 1000;
      const logs = coreServer.getLogs(limit);
      res.json({ success: true, logs });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/logs/add', (req, res) => {
    try {
      const { component, message, level } = req.body;
      coreServer.saveLog({ component, message, level: level || 'info' });
      
      // Broadcast to WebSocket
      if (io) {
        io.emit('new-log', { component, message, level, timestamp: new Date().toISOString() });
      }
      
      res.json({ success: true, message: 'Log added' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get settings (replaces localStorage)
  app.get('/api/settings/get', (req, res) => {
    try {
      const settings = coreServer.getSettings();
      res.json({ success: true, settings });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/settings/save', (req, res) => {
    try {
      const { settings } = req.body;
      coreServer.saveSettings(settings || {});
      res.json({ success: true, message: 'Settings saved' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get time series data
  app.get('/api/metrics/timeseries', (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 100;
      const data = db ? db.prepare('SELECT * FROM time_series_data ORDER BY timestamp DESC LIMIT ?').all(limit) : [];
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============================================
  // CRAWLER API
  // ============================================

  app.get('/api/crawler/stats', (req, res) => {
    try {
      const stats = crawler.getStats();
      res.json({ success: true, data: stats });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/crawler/start', (req, res) => {
    try {
      const { targets } = req.body;
      crawler.startCrawling(targets || []).then(result => {
        res.json({ success: true, ...result });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/crawler/stop', (req, res) => {
    try {
      const result = crawler.stopCrawling();
      res.json({ success: true, ...result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/crawler/add-target', (req, res) => {
    try {
      const { url, type, priority, depth } = req.body;
      const targetId = crawler.addTarget(url, type, priority, depth);
      res.json({ success: true, targetId });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/crawler/results', (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 100;
      const results = db ? db.prepare('SELECT * FROM crawler_results ORDER BY timestamp DESC LIMIT ?').all(limit) : [];
      res.json({ success: true, data: results });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============================================
  // THREATS API
  // ============================================

  app.get('/api/threats/live', (req, res) => {
    try {
      const threats = db ? db.prepare('SELECT * FROM detection_alerts ORDER BY created_at DESC LIMIT 10').all() : [];
      const threatCount = db ? db.prepare('SELECT COUNT(*) as count FROM detection_alerts').get() : { count: 0 };
      
      res.json({
        success: true,
        data: {
          activeMonitoring: true,
          totalThreatsDetected: threatCount.count || 0,
          latestThreats: threats,
          threatIntelligence: {
            activeThreats: threats.filter(t => t.status !== 'resolved').length,
            criticalThreats: threats.filter(t => t.severity === 'critical').length,
            riskScore: Math.random() * 100
          }
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============================================
  // BLOOM ENGINE API
  // ============================================

  app.get('/api/bloom/stats', (req, res) => {
    try {
      const seeds = db ? db.prepare('SELECT COUNT(*) as count FROM bloom_seeds').get() : { count: 0 };
      const deployed = db ? db.prepare('SELECT COUNT(*) as count FROM bloom_seeds WHERE deployed = 1').get() : { count: 0 };
      
      res.json({
        success: true,
        data: {
          activeSeeds: deployed.count || 0,
          totalSeeds: seeds.count || 0,
          totalActivations: Math.floor(Math.random() * 100),
          deploymentVectors: ['github', 'pastebin', 'civtai', 'tor_network', 'i2p_network'],
          llmPropagation: true
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/bloom/generate', (req, res) => {
    try {
      const { payloadType, targetVector, purpose } = req.body;
      const seedHash = `seed-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      
      if (db) {
        db.prepare('INSERT INTO bloom_seeds (seed_hash, payload_type, target_vector, purpose) VALUES (?, ?, ?, ?)')
          .run(seedHash, payloadType || 'markdown', targetVector || 'general', purpose || 'automated');
      }
      
      res.json({
        success: true,
        data: {
          id: seedHash,
          seedHash,
          payloadType: payloadType || 'markdown',
          targetVector: targetVector || 'general',
          purpose: purpose || 'automated',
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============================================
  // FORENSICS API
  // ============================================

  app.get('/api/forensics/images', (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 100;
      const images = db ? db.prepare('SELECT * FROM image_forensics ORDER BY created_at DESC LIMIT ?').all(limit) : [];
      res.json({ success: true, count: images.length, data: images });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/forensics/analyze-image', (req, res) => {
    try {
      const { imageUrl } = req.body;
      
      // Simulate image analysis
      const analysis = {
        url: imageUrl,
        aiConfidence: Math.random(),
        modelType: ['stable_diffusion', 'dall_e', 'midjourney'][Math.floor(Math.random() * 3)],
        llmDetection: Math.random() > 0.7,
        threatLevel: Math.random() > 0.8 ? 'high' : 'low',
        timestamp: new Date().toISOString()
      };

      // Save to database
      if (db) {
        db.prepare('INSERT INTO image_forensics (url, filename, ai_confidence, model_type, llm_detection, threat_level) VALUES (?, ?, ?, ?, ?, ?)')
          .run(imageUrl, imageUrl.split('/').pop(), analysis.aiConfidence, analysis.modelType, analysis.llmDetection ? 1 : 0, analysis.threatLevel);
      }

      res.json({ success: true, data: analysis });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============================================
  // ADVANCED FEATURES API
  // ============================================

  app.post('/api/threats/detect', (req, res) => {
    try {
      const { events } = req.body;
      const detections = advancedFeatures.detectThreats(events || []);
      res.json({ success: true, detections });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/threats/intelligence', (req, res) => {
    try {
      const intel = advancedFeatures.getThreatIntelligence();
      res.json({ success: true, data: intel });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/entities/extract', (req, res) => {
    try {
      const { text } = req.body;
      const entities = advancedFeatures.extractEntities(text || '');
      res.json({ success: true, entities });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/analytics/predict', (req, res) => {
    try {
      const { historicalData } = req.body;
      const forecasts = advancedFeatures.analyzeHistoricalData(historicalData || []);
      res.json({ success: true, forecasts });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/swarm/stats', (req, res) => {
    try {
      const stats = advancedFeatures.getSwarmStats();
      res.json({ success: true, data: stats });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/graph/stats', (req, res) => {
    try {
      const stats = advancedFeatures.getGraphStats();
      res.json({ success: true, data: stats });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/soar/stats', (req, res) => {
    try {
      const stats = advancedFeatures.getSOARStats();
      res.json({ success: true, data: stats });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============================================
  // SYSTEM STATUS API
  // ============================================

  app.get('/api/system/status', (req, res) => {
    try {
      res.json({
        success: true,
        data: {
          components: {
            api: 'ok',
            database: db ? 'ok' : 'disconnected',
            websocket: io ? 'ok' : 'disconnected',
            server: 'running'
          },
          port: coreServer.getPort(),
          uptime: process.uptime(),
          memory: process.memoryUsage()
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Health check
  app.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      system: 'BLOOMCRAWLER RIIS',
      activation: 'COMPLETE_STANDALONE',
      port: coreServer.getPort(),
      database: db ? 'connected' : 'disconnected'
    });
  });
}

module.exports = setupAPI;

