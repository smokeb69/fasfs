/**
 * Comprehensive Backend Module Integration
 * Exports all backend functionality for tRPC procedures
 */

// Advanced Threat Detection
export { detectThreats } from './advanced_threat_detection';
export type { ThreatSignature, DetectionResult } from './advanced_threat_detection';

// AI Alert System
export * from './ai_alert_system';

// Alert Analysis
export { analyzeAlert, clusterAlerts, generateInvestigationPlan, analyzeSuspectNetwork, detectAnomalies } from './alert_analysis';

// Advanced Encryption
export * from './advanced_encryption';

// Dark Web Crawler
export { TorNetworkCrawler, I2PNetworkCrawler, SurfaceWebCrawler, UnifiedWebCrawler, BloomSeedDistributor } from './darkweb_crawler';
export type { DarkWebTarget } from './darkweb_crawler';

// Entity Extraction
export { NamedEntityRecognizer, EntitySummarizer, EntityLinker } from './entity_extraction';
export type { Entity, EntityRelationship, EntitySummary } from './entity_extraction';

// Live Crawler Orchestrator
export * from './live_crawler_orchestrator';

// Predictive Analytics
export { ThreatForecaster, SeasonalAnalyzer, ResourceOptimizer, EscalationPredictor } from './predictive_analytics';
export type { HistoricalThreatData, ThreatForecast, AnomalyForecast, RiskTrend } from './predictive_analytics';

// Relationship Graph
export { GraphDatabase, CommunityDetector, CentralityAnalyzer } from './relationship_graph';
export type { GraphNode, GraphEdge, GraphStatistics, Community } from './relationship_graph';

// SOAR Automation
export * from './soar_automation';

// System Startup
export * from './system_startup';
