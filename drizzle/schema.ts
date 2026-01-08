import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  openId: text('open_id').unique(),
  email: text('email'),
  name: text('name'),
  avatar: text('avatar'),
  loginMethod: text('login_method'),
  role: text('role'),
  lastSignedIn: integer('last_signed_in', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

export const imageSignatures = sqliteTable('image_signatures', {
  id: text('id').primaryKey(),
  hash: text('hash').unique(),
  signature: text('signature'),
  modelType: text('model_type'),
  confidence: integer('confidence'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

export const bloomSeeds = sqliteTable('bloom_seeds', {
  id: text('id').primaryKey(),
  payloadType: text('payload_type'),
  targetVector: text('target_vector'),
  purpose: text('purpose'),
  hash: text('hash'),
  deployed: integer('deployed', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

export const detectionAlerts = sqliteTable('detection_alerts', {
  id: text('id').primaryKey(),
  threatId: text('threat_id'),
  threatName: text('threat_name'),
  severity: text('severity'),
  confidence: integer('confidence'),
  indicators: text('indicators'),
  affectedResources: text('affected_resources'),
  recommendedActions: text('recommended_actions'),
  timeDetected: integer('time_detected', { mode: 'timestamp' }),
});

export const auditLogs = sqliteTable('audit_logs', {
  id: text('id').primaryKey(),
  userId: text('user_id'),
  action: text('action'),
  resource: text('resource'),
  details: text('details'),
  ipAddress: text('ip_address'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

export const apiKeys = sqliteTable('api_keys', {
  id: text('id').primaryKey(),
  userId: text('user_id'),
  keyHash: text('key_hash'),
  name: text('name'),
  permissions: text('permissions'),
  expiresAt: integer('expires_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// BLOOMCRAWLER RIIS Specific Tables

export const investigationCases = sqliteTable('investigation_cases', {
  id: text('id').primaryKey(),
  title: text('title'),
  description: text('description'),
  severity: text('severity'), // low, medium, high, critical
  status: text('status'), // new, investigating, contained, resolved, closed
  assignedTo: text('assigned_to'),
  createdBy: text('created_by'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  resolvedAt: integer('resolved_at', { mode: 'timestamp' }),
});

export const caseEvidence = sqliteTable('case_evidence', {
  id: text('id').primaryKey(),
  caseId: text('case_id'),
  evidenceType: text('evidence_type'), // image, document, log, network
  fileName: text('file_name'),
  fileHash: text('file_hash'),
  metadata: text('metadata'), // JSON metadata
  analysisResults: text('analysis_results'), // JSON analysis results
  uploadedBy: text('uploaded_by'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

export const extractedEntities = sqliteTable('extracted_entities', {
  id: text('id').primaryKey(),
  sourceId: text('source_id'), // case or alert ID
  sourceType: text('source_type'), // case, alert, crawl
  entityType: text('entity_type'), // person, organization, location, etc.
  entityValue: text('entity_value'),
  confidence: integer('confidence'), // 0-100
  context: text('context'), // surrounding text
  metadata: text('metadata'), // JSON additional data
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

export const crawlerResults = sqliteTable('crawler_results', {
  id: text('id').primaryKey(),
  crawlerType: text('crawler_type'), // tor, i2p, surface, deepweb
  targetUrl: text('target_url'),
  status: text('status'), // success, failed, timeout
  responseTime: integer('response_time'), // milliseconds
  contentType: text('content_type'),
  contentSize: integer('content_size'), // bytes
  extractedEntities: integer('extracted_entities'),
  bloomSeedsFound: integer('bloom_seeds_found'),
  metadata: text('metadata'), // JSON crawl metadata
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

export const bloomSeedDeployments = sqliteTable('bloom_seed_deployments', {
  id: text('id').primaryKey(),
  seedId: text('seed_id'),
  deploymentVector: text('deployment_vector'), // github, pastebin, civtai, etc.
  targetUrl: text('target_url'),
  status: text('status'), // pending, deployed, active, failed
  activationCount: integer('activation_count').default(0),
  lastActivation: integer('last_activation', { mode: 'timestamp' }),
  metadata: text('metadata'), // JSON deployment data
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

export const teamOperations = sqliteTable('team_operations', {
  id: text('id').primaryKey(),
  operationName: text('operation_name'),
  operationType: text('operation_type'), // red, blue, gray
  status: text('status'), // planning, active, completed, cancelled
  description: text('description'),
  leadInvestigator: text('lead_investigator'),
  teamMembers: text('team_members'), // JSON array of user IDs
  startDate: integer('start_date', { mode: 'timestamp' }),
  endDate: integer('end_date', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

export const alertAnalysis = sqliteTable('alert_analysis', {
  id: text('id').primaryKey(),
  alertId: text('alert_id'),
  analysisType: text('analysis_type'), // pattern, similarity, correlation
  confidence: integer('confidence'), // 0-100
  findings: text('findings'), // JSON analysis results
  recommendedActions: text('recommended_actions'), // JSON recommendations
  analyzedBy: text('analyzed_by'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

export const systemMetrics = sqliteTable('system_metrics', {
  id: text('id').primaryKey(),
  metricType: text('metric_type'), // cpu, memory, alerts, crawls
  metricName: text('metric_name'),
  metricValue: text('metric_value'), // Store as string for flexibility
  timestamp: integer('timestamp', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

export const modelFingerprints = sqliteTable('model_fingerprints', {
  id: text('id').primaryKey(),
  modelName: text('model_name'),
  modelType: text('model_type'), // stable_diffusion, dalle, midjourney
  fingerprint: text('fingerprint'), // JSON fingerprint data
  accuracy: integer('accuracy'), // 0-100
  dataset: text('dataset'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// OSINT / Sensor / Research
export const osintFeeds = sqliteTable('osint_feeds', {
  id: text('id').primaryKey(),
  source: text('source'),
  title: text('title'),
  url: text('url'),
  summary: text('summary'),
  risk: text('risk'),
  tags: text('tags'), // JSON array
  publishedAt: integer('published_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

export const sensorReadings = sqliteTable('sensor_readings', {
  id: text('id').primaryKey(),
  source: text('source'),
  latitude: integer('latitude'),
  longitude: integer('longitude'),
  valueType: text('value_type'),
  value: text('value'),
  unit: text('unit'),
  metadata: text('metadata'), // JSON
  timestamp: integer('timestamp', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

export const researchNotes = sqliteTable('research_notes', {
  id: text('id').primaryKey(),
  title: text('title'),
  body: text('body'),
  tags: text('tags'), // JSON array
  createdBy: text('created_by'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});