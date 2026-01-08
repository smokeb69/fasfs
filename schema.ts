import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Image signatures table for tracking AI-generated images
export const imageSignatures = mysqlTable("image_signatures", {
  id: int("id").autoincrement().primaryKey(),
  sha256Hash: varchar("sha256_hash", { length: 64 }).notNull().unique(),
  modelType: varchar("model_type", { length: 128 }), // DALL-E, Stable Diffusion, Midjourney, etc.
  metadata: text("metadata"), // JSON string with EXIF, encoding, sampling, steps, etc.
  riskLevel: mysqlEnum("risk_level", ["green", "orange", "red"]).default("green").notNull(),
  detectionCount: int("detection_count").default(0).notNull(),
  firstDetected: timestamp("first_detected").defaultNow().notNull(),
  lastDetected: timestamp("last_detected").defaultNow().onUpdateNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ImageSignature = typeof imageSignatures.$inferSelect;
export type InsertImageSignature = typeof imageSignatures.$inferInsert;

// Bloom seed payloads for ethical injection
export const bloomSeeds = mysqlTable("bloom_seeds", {
  id: int("id").autoincrement().primaryKey(),
  seedHash: varchar("seed_hash", { length: 64 }).notNull().unique(),
  payloadType: varchar("payload_type", { length: 64 }).notNull(), // md, steganography, etc.
  payload: text("payload").notNull(),
  deploymentVector: varchar("deployment_vector", { length: 128 }), // github, pastebin, civitai, etc.
  status: mysqlEnum("status", ["draft", "active", "archived"]).default("draft").notNull(),
  activationCount: int("activation_count").default(0).notNull(),
  createdBy: int("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type BloomSeed = typeof bloomSeeds.$inferSelect;
export type InsertBloomSeed = typeof bloomSeeds.$inferInsert;

// Detection alerts for law enforcement
export const detectionAlerts = mysqlTable("detection_alerts", {
  id: int("id").autoincrement().primaryKey(),
  imageSignatureId: int("image_signature_id").notNull(),
  alertType: varchar("alert_type", { length: 64 }).notNull(), // deepfake, csa, abuse, etc.
  severity: mysqlEnum("severity", ["low", "medium", "high", "critical"]).default("medium").notNull(),
  description: text("description"),
  sourceUrl: varchar("source_url", { length: 2048 }),
  sourceIp: varchar("source_ip", { length: 45 }),
  status: mysqlEnum("alert_status", ["new", "investigating", "resolved", "escalated"]).default("new").notNull(),
  assignedTo: int("assigned_to"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type DetectionAlert = typeof detectionAlerts.$inferSelect;
export type InsertDetectionAlert = typeof detectionAlerts.$inferInsert;

// Audit logs for all system operations
export const auditLogs = mysqlTable("audit_logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  action: varchar("action", { length: 128 }).notNull(),
  resourceType: varchar("resource_type", { length: 64 }),
  resourceId: varchar("resource_id", { length: 128 }),
  details: text("details"), // JSON string with additional context
  ipAddress: varchar("ip_address", { length: 45 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;

// API keys for law enforcement agencies
export const apiKeys = mysqlTable("api_keys", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  keyHash: varchar("key_hash", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  lastUsed: timestamp("last_used"),
  expiresAt: timestamp("expires_at"),
  isActive: int("is_active").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ApiKey = typeof apiKeys.$inferSelect;
export type InsertApiKey = typeof apiKeys.$inferInsert;