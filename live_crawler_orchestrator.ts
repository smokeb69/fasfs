/**
 * Live Crawler Orchestrator
 * Real-time web crawling coordination and management
 */

import { UnifiedWebCrawler } from './darkweb_crawler';
import { NamedEntityRecognizer } from './entity_extraction';
import { ThreatForecaster } from './predictive_analytics';

export interface CrawlJob {
  id: string;
  type: 'surface' | 'darkweb' | 'social' | 'intelligence';
  target: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  startTime?: Date;
  endTime?: Date;
  results?: any[];
  error?: string;
}

export interface CrawlResult {
  url: string;
  content: string;
  metadata: Record<string, any>;
  entities: any[];
  threats: any[];
  timestamp: Date;
  source: string;
}

export class LiveCrawlerOrchestrator {
  private crawler = new UnifiedWebCrawler();
  private entityRecognizer = new NamedEntityRecognizer();
  private threatForecaster = new ThreatForecaster();
  private activeJobs: Map<string, CrawlJob> = new Map();
  private jobQueue: CrawlJob[] = [];
  private maxConcurrentJobs: number = 5;

  constructor() {
    this.startJobProcessor();
    this.startRealTimeMonitoring();
  }

  async submitCrawlJob(job: Omit<CrawlJob, 'id' | 'status' | 'progress'>): Promise<string> {
    const crawlJob: CrawlJob = {
      ...job,
      id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      progress: 0
    };

    this.jobQueue.push(crawlJob);
    console.log(`[ORCHESTRATOR] 📋 Submitted crawl job: ${crawlJob.id} (${crawlJob.type})`);

    return crawlJob.id;
  }

  private async startJobProcessor(): Promise<void> {
    console.log('[ORCHESTRATOR] 🚀 Starting job processor');

    setInterval(async () => {
      const runningJobs = Array.from(this.activeJobs.values())
        .filter(job => job.status === 'running').length;

      if (runningJobs < this.maxConcurrentJobs && this.jobQueue.length > 0) {
        const job = this.jobQueue.shift()!;
        await this.executeCrawlJob(job);
      }
    }, 5000); // Check every 5 seconds
  }

  private async executeCrawlJob(job: CrawlJob): Promise<void> {
    job.status = 'running';
    job.startTime = new Date();
    this.activeJobs.set(job.id, job);

    console.log(`[ORCHESTRATOR] ▶️ Executing job: ${job.id}`);

    try {
      const results = await this.performCrawl(job);

      job.status = 'completed';
      job.endTime = new Date();
      job.progress = 100;
      job.results = results;

      console.log(`[ORCHESTRATOR] ✅ Job completed: ${job.id} (${results.length} results)`);

    } catch (error) {
      job.status = 'failed';
      job.endTime = new Date();
      job.error = error instanceof Error ? error.message : 'Unknown error';

      console.error(`[ORCHESTRATOR] ❌ Job failed: ${job.id}`, error);
    }
  }

  private async performCrawl(job: CrawlJob): Promise<CrawlResult[]> {
    const results: CrawlResult[] = [];

    // Simulate crawling progress
    const steps = 10;
    for (let i = 1; i <= steps; i++) {
      job.progress = (i / steps) * 100;
      await new Promise(resolve => setTimeout(resolve, 500));

      // Generate mock crawl result
      const result: CrawlResult = {
        url: `${job.target}/page${i}`,
        content: `Mock crawled content from ${job.target} page ${i}`,
        metadata: {
          title: `Page ${i}`,
          size: Math.floor(Math.random() * 10000),
          lastModified: new Date(Date.now() - Math.random() * 86400000)
        },
        entities: [],
        threats: [],
        timestamp: new Date(),
        source: job.type
      };

      // Extract entities if content analysis is enabled
      if (job.type !== 'darkweb') {
        result.entities = await this.entityRecognizer.extractEntities(result.content);
      }

      results.push(result);
    }

    return results;
  }

  private async startRealTimeMonitoring(): Promise<void> {
    console.log('[ORCHESTRATOR] 📊 Starting real-time monitoring');

    setInterval(async () => {
      const stats = await this.getCrawlStats();

      // Auto-scale based on queue length
      if (this.jobQueue.length > 10) {
        this.maxConcurrentJobs = Math.min(this.maxConcurrentJobs + 1, 10);
        console.log(`[ORCHESTRATOR] 📈 Increased concurrent jobs to ${this.maxConcurrentJobs}`);
      } else if (this.jobQueue.length < 2 && this.maxConcurrentJobs > 3) {
        this.maxConcurrentJobs = Math.max(this.maxConcurrentJobs - 1, 3);
        console.log(`[ORCHESTRATOR] 📉 Decreased concurrent jobs to ${this.maxConcurrentJobs}`);
      }

      // Clean up old completed jobs
      const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
      for (const [jobId, job] of this.activeJobs) {
        if (job.status === 'completed' && job.endTime && job.endTime < cutoff) {
          this.activeJobs.delete(jobId);
        }
      }

    }, 30000); // Every 30 seconds
  }

  async getCrawlStats(): Promise<any> {
    const jobs = Array.from(this.activeJobs.values());
    const stats = {
      totalJobs: jobs.length,
      pendingJobs: jobs.filter(j => j.status === 'pending').length,
      runningJobs: jobs.filter(j => j.status === 'running').length,
      completedJobs: jobs.filter(j => j.status === 'completed').length,
      failedJobs: jobs.filter(j => j.status === 'failed').length,
      queuedJobs: this.jobQueue.length,
      averageCompletionTime: this.calculateAverageCompletionTime(jobs),
      successRate: this.calculateSuccessRate(jobs),
      currentLoad: (jobs.filter(j => j.status === 'running').length / this.maxConcurrentJobs) * 100
    };

    return stats;
  }

  private calculateAverageCompletionTime(jobs: CrawlJob[]): number {
    const completedJobs = jobs.filter(j => j.status === 'completed' && j.startTime && j.endTime);
    if (completedJobs.length === 0) return 0;

    const totalTime = completedJobs.reduce((sum, job) => {
      return sum + (job.endTime!.getTime() - job.startTime!.getTime());
    }, 0);

    return totalTime / completedJobs.length;
  }

  private calculateSuccessRate(jobs: CrawlJob[]): number {
    const completedJobs = jobs.filter(j => j.status === 'completed' || j.status === 'failed').length;
    if (completedJobs === 0) return 0;

    const successfulJobs = jobs.filter(j => j.status === 'completed').length;
    return (successfulJobs / completedJobs) * 100;
  }

  async getJobStatus(jobId: string): Promise<CrawlJob | null> {
    return this.activeJobs.get(jobId) || null;
  }

  async cancelJob(jobId: string): Promise<boolean> {
    const job = this.activeJobs.get(jobId);
    if (job && job.status === 'running') {
      job.status = 'failed';
      job.error = 'Cancelled by user';
      job.endTime = new Date();
      console.log(`[ORCHESTRATOR] 🛑 Cancelled job: ${jobId}`);
      return true;
    }
    return false;
  }

  async getJobQueue(): Promise<CrawlJob[]> {
    return [...this.jobQueue];
  }

  async prioritizeJob(jobId: string, priority: CrawlJob['priority']): Promise<boolean> {
    const jobIndex = this.jobQueue.findIndex(j => j.id === jobId);
    if (jobIndex !== -1) {
      this.jobQueue[jobIndex].priority = priority;
      // Sort queue by priority
      this.jobQueue.sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
      console.log(`[ORCHESTRATOR] ⭐ Prioritized job: ${jobId} to ${priority}`);
      return true;
    }
    return false;
  }
}

/**
 * Real-time Crawl Monitor
 */
export class RealTimeCrawlMonitor {
  private orchestrator: LiveCrawlerOrchestrator;
  private subscribers: ((stats: any) => void)[] = [];

  constructor(orchestrator: LiveCrawlerOrchestrator) {
    this.orchestrator = orchestrator;
    this.startMonitoring();
  }

  private startMonitoring(): void {
    setInterval(async () => {
      const stats = await this.orchestrator.getCrawlStats();
      this.notifySubscribers(stats);
    }, 10000); // Every 10 seconds
  }

  subscribe(callback: (stats: any) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  private notifySubscribers(stats: any): void {
    this.subscribers.forEach(callback => {
      try {
        callback(stats);
      } catch (error) {
        console.error('[MONITOR] Error notifying subscriber:', error);
      }
    });
  }
}

/**
 * Intelligent Crawl Scheduler
 */
export class IntelligentCrawlScheduler {
  private orchestrator: LiveCrawlerOrchestrator;
  private scheduledJobs: Map<string, NodeJS.Timeout> = new Map();

  constructor(orchestrator: LiveCrawlerOrchestrator) {
    this.orchestrator = orchestrator;
    this.startIntelligentScheduling();
  }

  private startIntelligentScheduling(): void {
    // Schedule regular crawls for high-priority targets
    this.scheduleRecurringCrawl('surface_web', 'https://example.com', 'high', 60 * 60 * 1000); // Every hour
    this.scheduleRecurringCrawl('social_media', 'https://twitter.com/search', 'medium', 30 * 60 * 1000); // Every 30 min
    this.scheduleRecurringCrawl('intelligence', 'intelligence_feeds', 'critical', 15 * 60 * 1000); // Every 15 min

    console.log('[SCHEDULER] 📅 Intelligent crawl scheduling activated');
  }

  private scheduleRecurringCrawl(type: string, target: string, priority: CrawlJob['priority'], interval: number): void {
    const jobId = `recurring_${type}_${Date.now()}`;

    const timeout = setInterval(async () => {
      await this.orchestrator.submitCrawlJob({
        type: type as any,
        target,
        priority
      });
    }, interval);

    this.scheduledJobs.set(jobId, timeout);
  }

  stopAllScheduledCrawls(): void {
    for (const timeout of this.scheduledJobs.values()) {
      clearInterval(timeout);
    }
    this.scheduledJobs.clear();
    console.log('[SCHEDULER] 🛑 All scheduled crawls stopped');
  }
}

// Global instances
export const crawlerOrchestrator = new LiveCrawlerOrchestrator();
export const crawlMonitor = new RealTimeCrawlMonitor(crawlerOrchestrator);
export const crawlScheduler = new IntelligentCrawlScheduler(crawlerOrchestrator);
