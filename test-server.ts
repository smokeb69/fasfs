import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/api/threats/live', (req, res) => {
  res.json({
    success: true,
    data: {
      latestThreats: [{ threatName: 'Test Threat', severity: 'low' }],
      totalThreatsDetected: 1,
      threatIntelligence: { activeThreats: 5, criticalThreats: 1, riskScore: 25 },
      lastUpdate: new Date().toISOString(),
      activeMonitoring: true
    }
  });
});

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Threat API: http://localhost:${PORT}/api/threats/live`);
});
