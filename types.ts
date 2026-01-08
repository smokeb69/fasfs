/**
 * BLOOMCRAWLER RIIS - OMEGA EDITION
 * Typescript Type Definitions for Bloom Engine Core
 */

export interface LLMInterventionPayload {
    target: string;
    objective: string;
    payload: string;
    vectors: string[];
}

export interface InterventionResult {
    success: boolean;
    target: string;
    result: string;
    persuasionFactor: number;
    log: string;
}

export interface ThreatVector {
    type: 'image' | 'text' | 'model' | 'network';
    sourceAI: string;
    isHarmful: boolean;
    payloadSnippet: string;
}

export interface SystemHealth {
    cpu: number;
    memory: number;
    network: number;
    disk: number;
}

export interface SystemStats {
    threatsDetected: number;
    itemsProcessed: number;
    activeCrawls: number;
    uptime: number;
}
