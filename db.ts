import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
// @ts-ignore - better-sqlite3 types not available
import Database from "better-sqlite3";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { randomBytes } from "node:crypto";
import { ENV } from "./_core/env.ts";
import {
  users,
  imageSignatures,
  bloomSeeds,
  detectionAlerts,
  auditLogs,
  investigationCases,
  caseEvidence,
  extractedEntities,
  crawlerResults,
  bloomSeedDeployments,
  teamOperations,
  alertAnalysis,
  systemMetrics,
  modelFingerprints,
  osintFeeds,
  sensorReadings,
  researchNotes,
} from "./drizzle/schema.ts";

// Type definitions
export type InsertUser = InferInsertModel<typeof users>;
export type User = InferSelectModel<typeof users>;
export type ImageSignature = InferSelectModel<typeof imageSignatures>;
export type DetectionAlert = InferSelectModel<typeof detectionAlerts>;
export type BloomSeed = InferSelectModel<typeof bloomSeeds>;
export type AuditLog = InferSelectModel<typeof auditLogs>;
export type InvestigationCase = InferSelectModel<typeof investigationCases>;
export type CaseEvidence = InferSelectModel<typeof caseEvidence>;
export type ExtractedEntity = InferSelectModel<typeof extractedEntities>;
export type CrawlerResult = InferSelectModel<typeof crawlerResults>;
export type BloomSeedDeployment = InferSelectModel<typeof bloomSeedDeployments>;
export type TeamOperation = InferSelectModel<typeof teamOperations>;
export type AlertAnalysis = InferSelectModel<typeof alertAnalysis>;
export type SystemMetric = InferSelectModel<typeof systemMetrics>;
export type ModelFingerprint = InferSelectModel<typeof modelFingerprints>;
export type OsintFeed = InferSelectModel<typeof osintFeeds>;
export type SensorReading = InferSelectModel<typeof sensorReadings>;
export type ResearchNote = InferSelectModel<typeof researchNotes>;

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance
export async function getDb(): Promise<ReturnType<typeof drizzle> | null> {
  if (!_db) {
    try {
      const sqlite = new Database('./bloomcrawler.db');
      _db = drizzle(sqlite);

      // Enable foreign keys
      sqlite.pragma('foreign_keys = ON');

      // Ensure supplemental tables exist (lightweight guard for new features)
      sqlite.exec(`
        CREATE TABLE IF NOT EXISTS osint_feeds (
          id TEXT PRIMARY KEY,
          source TEXT,
          title TEXT,
          url TEXT,
          summary TEXT,
          risk TEXT,
          tags TEXT,
          published_at INTEGER,
          created_at INTEGER DEFAULT (strftime('%s','now'))
        );
        CREATE TABLE IF NOT EXISTS sensor_readings (
          id TEXT PRIMARY KEY,
          source TEXT,
          latitude INTEGER,
          longitude INTEGER,
          value_type TEXT,
          value TEXT,
          unit TEXT,
          metadata TEXT,
          timestamp INTEGER DEFAULT (strftime('%s','now')),
          created_at INTEGER DEFAULT (strftime('%s','now'))
        );
        CREATE TABLE IF NOT EXISTS research_notes (
          id TEXT PRIMARY KEY,
          title TEXT,
          body TEXT,
          tags TEXT,
          created_by TEXT,
          created_at INTEGER DEFAULT (strftime('%s','now'))
        );
      `);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    // Generate id from openId if not provided, or use provided id
    const id = user.id || user.openId;
    if (!id) {
      throw new Error("Cannot create user: id or openId must be provided");
    }
    const values: InsertUser = {
      id,
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    // SQLite doesn't support onDuplicateKeyUpdate, use INSERT OR REPLACE
    try {
      await db.insert(users).values(values);
    } catch (error) {
      // If insert fails due to duplicate key, update instead
      const existingUser = await db.select().from(users).where(eq(users.id, id)).limit(1);
      if (existingUser.length > 0) {
        await db.update(users).set(updateSet).where(eq(users.id, id));
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string): Promise<User | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.openId, openId))
      .limit(1);

    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get user:", error);
    return undefined;
  }
}

// Image Signature functions
export async function getImageSignatures(
  limit: number = 50,
  offset: number = 0
): Promise<ImageSignature[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(imageSignatures)
      .limit(limit)
      .offset(offset);
  } catch (error) {
    console.error("[Database] Failed to get image signatures:", error);
    return [];
  }
}

export async function getImageSignatureByHash(
  hash: string
): Promise<ImageSignature | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  try {
    const result = await db
      .select()
      .from(imageSignatures)
      .where(eq(imageSignatures.hash, hash))
      .limit(1);

    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get image signature:", error);
    return undefined;
  }
}

// Detection Alert functions
export async function getDetectionAlerts(
  limit: number = 50,
  offset: number = 0
): Promise<DetectionAlert[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(detectionAlerts)
      .orderBy(desc(detectionAlerts.timeDetected))
      .limit(limit)
      .offset(offset);
  } catch (error) {
    console.error("[Database] Failed to get detection alerts:", error);
    return [];
  }
}

export async function getAlertsBySeverity(
  severity: "low" | "medium" | "high" | "critical"
): Promise<DetectionAlert[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(detectionAlerts)
      .where(eq(detectionAlerts.severity, severity))
      .orderBy(desc(detectionAlerts.timeDetected));
  } catch (error) {
    console.error("[Database] Failed to get alerts by severity:", error);
    return [];
  }
}

// Bloom Seed functions
export async function getActiveBloomSeeds(): Promise<BloomSeed[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(bloomSeeds)
      .where(eq(bloomSeeds.deployed, true))
      .orderBy(desc(bloomSeeds.createdAt));
  } catch (error) {
    console.error("[Database] Failed to get active bloom seeds:", error);
    return [];
  }
}

export async function getBloomSeeds(
  limit: number = 50,
  offset: number = 0
): Promise<BloomSeed[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(bloomSeeds)
      .orderBy(desc(bloomSeeds.createdAt))
      .limit(limit)
      .offset(offset);
  } catch (error) {
    console.error("[Database] Failed to get bloom seeds:", error);
    return [];
  }
}

// Audit Log functions
export async function getAuditLogs(
  limit: number = 50,
  offset: number = 0
): Promise<AuditLog[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(auditLogs)
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit)
      .offset(offset);
  } catch (error) {
    console.error("[Database] Failed to get audit logs:", error);
    return [];
  }
}

export async function logAuditEvent(
  userId: string,
  action: string,
  resource?: string,
  details?: Record<string, unknown>,
  ipAddress?: string
): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    // Generate a unique id for the audit log entry using crypto for better uniqueness
    const timestamp = Date.now();
    const randomBuf = randomBytes(8);
    const randomStr = randomBuf.toString('hex');
    const id = `${timestamp}-${randomStr}`;

    await db.insert(auditLogs).values({
      id,
      userId,
      action,
      resource,
      details: details ? JSON.stringify(details) : undefined,
      ipAddress,
    });
  } catch (error) {
    console.error("[Database] Failed to log audit event:", error);
  }
}

// BLOOMCRAWLER RIIS Database Functions

// Investigation Cases
export async function getInvestigationCases(
  limit: number = 50,
  offset: number = 0,
  status?: string
): Promise<InvestigationCase[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    if (status) {
      return await db.select().from(investigationCases)
        .where(eq(investigationCases.status, status))
        .orderBy(desc(investigationCases.createdAt))
        .limit(limit)
        .offset(offset);
    }
    return await db.select().from(investigationCases)
      .orderBy(desc(investigationCases.createdAt))
      .limit(limit)
      .offset(offset);
  } catch (error) {
    console.error("[Database] Failed to get investigation cases:", error);
    return [];
  }
}

export async function createInvestigationCase(
  caseData: {
    title: string;
    description: string;
    severity: string;
    createdBy: string;
  }
): Promise<InvestigationCase | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const id = `CASE-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const [result] = await db.insert(investigationCases).values({
      id,
      ...caseData,
      status: 'new',
    }).returning();
    return result;
  } catch (error) {
    console.error("[Database] Failed to create investigation case:", error);
    return null;
  }
}

// Case Evidence
export async function addCaseEvidence(
  evidenceData: {
    caseId: string;
    evidenceType: string;
    fileName: string;
    fileHash: string;
    metadata?: string;
    analysisResults?: string;
    uploadedBy: string;
  }
): Promise<CaseEvidence | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const id = `EVIDENCE-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const [result] = await db.insert(caseEvidence).values({
      id,
      ...evidenceData,
    }).returning();
    return result;
  } catch (error) {
    console.error("[Database] Failed to add case evidence:", error);
    return null;
  }
}

// Extracted Entities
export async function getExtractedEntities(
  sourceId?: string,
  sourceType?: string,
  limit: number = 100
): Promise<ExtractedEntity[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    if (sourceId && sourceType) {
      return await db.select().from(extractedEntities)
        .where(and(
          eq(extractedEntities.sourceId, sourceId),
          eq(extractedEntities.sourceType, sourceType)
        ))
        .orderBy(desc(extractedEntities.createdAt))
        .limit(limit);
    }
    return await db.select().from(extractedEntities)
      .orderBy(desc(extractedEntities.createdAt))
      .limit(limit);
  } catch (error) {
    console.error("[Database] Failed to get extracted entities:", error);
    return [];
  }
}

export async function createExtractedEntity(
  entityData: {
    sourceId: string;
    sourceType: string;
    entityType: string;
    entityValue: string;
    confidence: number;
    context?: string;
    metadata?: string;
  }
): Promise<ExtractedEntity | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const id = `ENTITY-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const [result] = await db.insert(extractedEntities).values({
      id,
      ...entityData,
    }).returning();
    return result;
  } catch (error) {
    console.error("[Database] Failed to create extracted entity:", error);
    return null;
  }
}

// Crawler Results
export async function getCrawlerResults(
  limit: number = 50,
  offset: number = 0,
  crawlerType?: string
): Promise<CrawlerResult[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    if (crawlerType) {
      return await db.select().from(crawlerResults)
        .where(eq(crawlerResults.crawlerType, crawlerType))
        .orderBy(desc(crawlerResults.createdAt))
        .limit(limit)
        .offset(offset);
    }
    return await db.select().from(crawlerResults)
      .orderBy(desc(crawlerResults.createdAt))
      .limit(limit)
      .offset(offset);
  } catch (error) {
    console.error("[Database] Failed to get crawler results:", error);
    return [];
  }
}

export async function createCrawlerResult(
  resultData: {
    crawlerType: string;
    targetUrl: string;
    status: string;
    responseTime: number;
    contentType?: string;
    contentSize?: number;
    extractedEntities?: number;
    bloomSeedsFound?: number;
    metadata?: string;
  }
): Promise<CrawlerResult | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const id = `CRAWL-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const [result] = await db.insert(crawlerResults).values({
      id,
      ...resultData,
    }).returning();
    return result;
  } catch (error) {
    console.error("[Database] Failed to create crawler result:", error);
    return null;
  }
}

// Bloom Seed Deployments
export async function getBloomSeedDeployments(
  seedId?: string,
  limit: number = 50
): Promise<BloomSeedDeployment[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    if (seedId) {
      return await db.select().from(bloomSeedDeployments)
        .where(eq(bloomSeedDeployments.seedId, seedId))
        .orderBy(desc(bloomSeedDeployments.createdAt))
        .limit(limit);
    }
    return await db.select().from(bloomSeedDeployments)
      .orderBy(desc(bloomSeedDeployments.createdAt))
      .limit(limit);
  } catch (error) {
    console.error("[Database] Failed to get bloom seed deployments:", error);
    return [];
  }
}

export async function createBloomSeedDeployment(
  deploymentData: {
    seedId: string;
    deploymentVector: string;
    targetUrl: string;
    status?: string;
    metadata?: string;
  }
): Promise<BloomSeedDeployment | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const id = `DEPLOY-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const [result] = await db.insert(bloomSeedDeployments).values({
      id,
      status: deploymentData.status || 'pending',
      activationCount: 0,
      ...deploymentData,
    }).returning();
    return result;
  } catch (error) {
    console.error("[Database] Failed to create bloom seed deployment:", error);
    return null;
  }
}

// Team Operations
export async function getTeamOperations(
  operationType?: string,
  limit: number = 20
): Promise<TeamOperation[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    if (operationType) {
      return await db.select().from(teamOperations)
        .where(eq(teamOperations.operationType, operationType))
        .orderBy(desc(teamOperations.createdAt))
        .limit(limit);
    }
    return await db.select().from(teamOperations)
      .orderBy(desc(teamOperations.createdAt))
      .limit(limit);
  } catch (error) {
    console.error("[Database] Failed to get team operations:", error);
    return [];
  }
}

export async function createTeamOperation(
  operationData: {
    operationName: string;
    operationType: string;
    description: string;
    leadInvestigator: string;
    teamMembers?: string;
  }
): Promise<TeamOperation | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const id = `OP-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const [result] = await db.insert(teamOperations).values({
      id,
      status: 'planning',
      ...operationData,
    }).returning();
    return result;
  } catch (error) {
    console.error("[Database] Failed to create team operation:", error);
    return null;
  }
}

// Alert Analysis
export async function getAlertAnalysis(alertId: string): Promise<AlertAnalysis[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(alertAnalysis).where(eq(alertAnalysis.alertId, alertId));
  } catch (error) {
    console.error("[Database] Failed to get alert analysis:", error);
    return [];
  }
}

export async function createAlertAnalysis(
  analysisData: {
    alertId: string;
    analysisType: string;
    confidence: number;
    findings: string;
    recommendedActions: string;
    analyzedBy: string;
  }
): Promise<AlertAnalysis | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const id = `ANALYSIS-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const [result] = await db.insert(alertAnalysis).values({
      id,
      ...analysisData,
    }).returning();
    return result;
  } catch (error) {
    console.error("[Database] Failed to create alert analysis:", error);
    return null;
  }
}

// System Metrics
export async function logSystemMetric(
  metricData: {
    metricType: string;
    metricName: string;
    metricValue: string;
  }
): Promise<SystemMetric | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const id = `METRIC-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const [result] = await db.insert(systemMetrics).values({
      id,
      ...metricData,
    }).returning();
    return result;
  } catch (error) {
    console.error("[Database] Failed to log system metric:", error);
    return null;
  }
}

export async function getSystemMetrics(
  metricType?: string,
  limit: number = 100
): Promise<SystemMetric[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    if (metricType) {
      return await db.select().from(systemMetrics)
        .where(eq(systemMetrics.metricType, metricType))
        .orderBy(desc(systemMetrics.timestamp))
        .limit(limit);
    }
    return await db.select().from(systemMetrics)
      .orderBy(desc(systemMetrics.timestamp))
      .limit(limit);
  } catch (error) {
    console.error("[Database] Failed to get system metrics:", error);
    return [];
  }
}

// Model Fingerprints
export async function getModelFingerprints(
  modelType?: string,
  limit: number = 50
): Promise<ModelFingerprint[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    if (modelType) {
      return await db.select().from(modelFingerprints)
        .where(eq(modelFingerprints.modelType, modelType))
        .orderBy(desc(modelFingerprints.createdAt))
        .limit(limit);
    }
    return await db.select().from(modelFingerprints)
      .orderBy(desc(modelFingerprints.createdAt))
      .limit(limit);
  } catch (error) {
    console.error("[Database] Failed to get model fingerprints:", error);
    return [];
  }
}

export async function createModelFingerprint(
  fingerprintData: {
    modelName: string;
    modelType: string;
    fingerprint: string;
    accuracy: number;
    dataset: string;
  }
): Promise<ModelFingerprint | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const id = `FINGERPRINT-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const [result] = await db.insert(modelFingerprints).values({
      id,
      ...fingerprintData,
    }).returning();
    return result;
  } catch (error) {
    console.error("[Database] Failed to create model fingerprint:", error);
    return null;
  }
}

// OSINT Feeds
export async function addOsintItems(
  items: {
    source: string;
    title: string;
    url: string;
    summary?: string;
    risk?: string;
    tags?: string[];
    publishedAt?: number;
  }[]
): Promise<number> {
  const db = await getDb();
  if (!db || items.length === 0) return 0;

  const records = items.map((item) => ({
    id: `OSINT-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    source: item.source,
    title: item.title,
    url: item.url,
    summary: item.summary,
    risk: item.risk ?? 'medium',
    tags: item.tags ? JSON.stringify(item.tags) : undefined,
    publishedAt: item.publishedAt ?? Date.now(),
  }));

  try {
    await db.insert(osintFeeds).values(records);
    return records.length;
  } catch (error) {
    console.error("[Database] Failed to insert OSINT items:", error);
    return 0;
  }
}

export async function getOsintFeed(
  limit: number = 50,
  offset: number = 0
): Promise<OsintFeed[]> {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db.select().from(osintFeeds).orderBy(desc(osintFeeds.publishedAt)).limit(limit).offset(offset);
  } catch (error) {
    console.error("[Database] Failed to fetch OSINT feed:", error);
    return [];
  }
}

// Sensor Readings
export async function addSensorReading(reading: {
  source: string;
  latitude?: number;
  longitude?: number;
  valueType: string;
  value: string | number;
  unit?: string;
  metadata?: Record<string, unknown>;
  timestamp?: number;
}): Promise<SensorReading | null> {
  const db = await getDb();
  if (!db) return null;
  try {
    const [result] = await db.insert(sensorReadings).values({
      id: `SENSOR-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      source: reading.source,
      latitude: reading.latitude,
      longitude: reading.longitude,
      valueType: reading.valueType,
      value: String(reading.value),
      unit: reading.unit,
      metadata: reading.metadata ? JSON.stringify(reading.metadata) : undefined,
      timestamp: reading.timestamp ?? Date.now(),
    }).returning();
    return result ?? null;
  } catch (error) {
    console.error("[Database] Failed to add sensor reading:", error);
    return null;
  }
}

export async function getSensorReadings(
  limit: number = 50,
  offset: number = 0
): Promise<SensorReading[]> {
  const db = await getDb();
  if (!db) return [];
  try {
    return await db.select().from(sensorReadings)
      .orderBy(desc(sensorReadings.timestamp))
      .limit(limit)
      .offset(offset);
  } catch (error) {
    console.error("[Database] Failed to fetch sensor readings:", error);
    return [];
  }
}

// Research Notes
export async function createResearchNote(note: {
  title: string;
  body: string;
  tags?: string[];
  createdBy?: string;
}): Promise<ResearchNote | null> {
  const db = await getDb();
  if (!db) return null;
  try {
    const [result] = await db.insert(researchNotes).values({
      id: `NOTE-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: note.title,
      body: note.body,
      tags: note.tags ? JSON.stringify(note.tags) : undefined,
      createdBy: note.createdBy,
    }).returning();
    return result ?? null;
  } catch (error) {
    console.error("[Database] Failed to create research note:", error);
    return null;
  }
}

export async function getResearchNotes(
  limit: number = 50,
  offset: number = 0,
  tag?: string
): Promise<ResearchNote[]> {
  const db = await getDb();
  if (!db) return [];
  try {
    const all = await db.select().from(researchNotes)
      .orderBy(desc(researchNotes.createdAt))
      .limit(limit)
      .offset(offset);
    if (!tag) return all;
    return all.filter((n) => {
      if (!n.tags) return false;
      try {
        const parsed = JSON.parse(n.tags as unknown as string);
        return Array.isArray(parsed) ? parsed.includes(tag) : false;
      } catch {
        return false;
      }
    });
  } catch (error) {
    console.error("[Database] Failed to fetch research notes:", error);
    return [];
  }
}

// Unified search across OSINT, sensors, and alerts
export async function searchIntel(query: string, limit: number = 20): Promise<{
  osint: OsintFeed[];
  sensors: SensorReading[];
  alerts: DetectionAlert[];
}> {
  const db = await getDb();
  if (!db) return { osint: [], sensors: [], alerts: [] };

  const lower = query.toLowerCase();
  try {
    const osint = (await getOsintFeed(limit, 0)).filter((o) =>
      `${o.title ?? ''} ${o.summary ?? ''} ${o.source ?? ''}`.toLowerCase().includes(lower)
    ).slice(0, limit);
    const sensors = (await getSensorReadings(limit, 0)).filter((s) =>
      `${s.source ?? ''} ${s.value ?? ''} ${s.valueType ?? ''}`.toLowerCase().includes(lower)
    ).slice(0, limit);
    const alerts = (await getDetectionAlerts(limit, 0)).filter((a) =>
      `${a.threatName ?? ''} ${a.severity ?? ''}`.toLowerCase().includes(lower)
    ).slice(0, limit);
    return { osint, sensors, alerts };
  } catch (error) {
    console.error("[Database] Unified search failed:", error);
    return { osint: [], sensors: [], alerts: [] };
  }
}
