/**
 * Advanced Swarm Crawler - Multi-Threaded Distributed Crawling Engine
 * High-performance parallel crawling with async/await concurrency simulation
 */

import * as os from 'os';

export interface SwarmTarget {
  id: string;
  url: string;
  type: 'tor' | 'i2p' | 'surface' | 'deepweb' | 'social';
  priority: number;
  depth: number;
  status: 'pending' | 'crawling' | 'completed' | 'failed';
}

export interface SwarmWorker {
  id: string;
  status: 'idle' | 'working' | 'error';
  currentTarget: SwarmTarget | null;
  tasksCompleted: number;
  startTime: Date;
  promise?: Promise<any>;
}

export interface SwarmStats {
  totalWorkers: number;
  activeWorkers: number;
  idleWorkers: number;
  targetsQueued: number;
  targetsCompleted: number;
  targetsFailed: number;
  itemsFound: number;
  bloomSeedsDeployed: number;
  averageSpeed: number; // items per second
  uptime: number; // seconds
}

export class AdvancedSwarmCrawler {
  private workers: Map<string, SwarmWorker> = new Map();
  private targetQueue: SwarmTarget[] = [];
  private completedTargets: SwarmTarget[] = [];
  private failedTargets: SwarmTarget[] = [];
  private maxWorkers: number;
  private isRunning: boolean = false;
  private startTime: Date = new Date();
  private totalItemsFound: number = 0;
  private bloomSeedsDeployed: number = 0;

  constructor(maxWorkers?: number) {
    // Use CPU cores for optimal performance, with a minimum of 2
    this.maxWorkers = maxWorkers || Math.max(2, os.cpus().length - 1);
    console.log(`[SWARM] 🚀 Initializing Advanced Swarm Crawler with ${this.maxWorkers} workers`);
  }

  /**
   * Start the swarm crawling system
   */
  async startSwarm(targets: SwarmTarget[]): Promise<void> {
    if (this.isRunning) {
      console.warn('[SWARM] ⚠️ Swarm is already running');
      return;
    }

    this.isRunning = true;
    this.startTime = new Date();
    this.targetQueue = [...targets];

    console.log(`[SWARM] 🌐 Starting swarm with ${targets.length} targets`);

    // Spawn workers (simulated with async tasks)
    for (let i = 0; i < this.maxWorkers; i++) {
      this.spawnWorker(`worker-${i + 1}`);
    }

    // Start processing queue
    this.processQueue();

    // Start monitoring
    this.startMonitoring();
  }

  /**
   * Spawn a new worker (simulated with async)
   */
  private spawnWorker(workerId: string): void {
    const swarmWorker: SwarmWorker = {
      id: workerId,
      status: 'idle',
      currentTarget: null,
      tasksCompleted: 0,
      startTime: new Date()
    };

    this.workers.set(workerId, swarmWorker);
    console.log(`[SWARM] ✅ Spawned worker ${workerId}`);
  }

  /**
   * Simulate crawling a target
   */
  private async crawlTarget(target: SwarmTarget): Promise<{ itemsFound: number; seedsDeployed: number }> {
    // Simulate crawling time based on target type
    const crawlDelays: Record<string, number> = {
      tor: 3000,
      i2p: 2500,
      surface: 2000,
      deepweb: 3500,
      social: 1500
    };

    const delay = crawlDelays[target.type] || 2000;
    
    // Simulate progress in chunks
    const chunks = 4;
    for (let i = 0; i < chunks; i++) {
      await new Promise(resolve => setTimeout(resolve, delay / chunks));
    }

    // Simulate finding items
    const itemsFound = Math.floor(Math.random() * 100) + 10;
    
    // Simulate bloom seed deployment
    const seedsDeployed = target.type === 'surface' ? 1 : Math.floor(Math.random() * 3);

    return { itemsFound, seedsDeployed };
  }

  /**
   * Process the target queue
   */
  private processQueue(): void {
    setInterval(() => {
      if (!this.isRunning) return;

      // Assign tasks to idle workers
      for (const [workerId, worker] of this.workers) {
        if (worker.status === 'idle' && this.targetQueue.length > 0) {
          this.assignNextTask(workerId);
        }
      }
    }, 100); // Check every 100ms
  }

  /**
   * Assign next task to a worker
   */
  private assignNextTask(workerId: string): void {
    const worker = this.workers.get(workerId);
    if (!worker || worker.status !== 'idle' || this.targetQueue.length === 0) {
      return;
    }

    // Get highest priority target
    const target = this.targetQueue.shift();
    if (!target) return;

    target.status = 'crawling';
    worker.status = 'working';
    worker.currentTarget = target;

    // Start crawling task
    worker.promise = this.crawlTarget(target).then((result) => {
      worker.status = 'idle';
      worker.currentTarget = null;
      worker.tasksCompleted++;

      target.status = 'completed';
      this.completedTargets.push(target);

      this.totalItemsFound += result.itemsFound;
      this.bloomSeedsDeployed += result.seedsDeployed;

      console.log(`[SWARM] ✅ Worker ${workerId} completed ${target.url}: ${result.itemsFound} items, ${result.seedsDeployed} seeds`);

      // Get next task
      this.assignNextTask(workerId);
    }).catch((error) => {
      worker.status = 'idle';
      target.status = 'failed';
      this.failedTargets.push(target);
      worker.currentTarget = null;

      console.error(`[SWARM] ❌ Worker ${workerId} failed on ${target.url}:`, error);

      // Get next task
      this.assignNextTask(workerId);
    });

    console.log(`[SWARM] 🎯 Assigned ${target.url} to ${workerId}`);
  }

  /**
   * Start monitoring and reporting
   */
  private startMonitoring(): void {
    setInterval(() => {
      if (!this.isRunning) return;

      const stats = this.getStats();
      const activeCount = stats.activeWorkers;
      const completedCount = stats.targetsCompleted;

      if (activeCount > 0 || completedCount > 0) {
        console.log(`[SWARM] 📊 Active: ${activeCount}/${stats.totalWorkers} | Completed: ${completedCount} | Speed: ${stats.averageSpeed.toFixed(1)}/s`);
      }
    }, 5000); // Report every 5 seconds
  }

  /**
   * Get current swarm statistics
   */
  getStats(): SwarmStats {
    const activeWorkers = Array.from(this.workers.values()).filter(w => w.status === 'working').length;
    const idleWorkers = Array.from(this.workers.values()).filter(w => w.status === 'idle').length;
    const uptime = (Date.now() - this.startTime.getTime()) / 1000; // seconds

    const totalCompleted = this.completedTargets.length;
    const averageSpeed = uptime > 0 ? this.totalItemsFound / uptime : 0;

    return {
      totalWorkers: this.workers.size,
      activeWorkers,
      idleWorkers,
      targetsQueued: this.targetQueue.length,
      targetsCompleted: totalCompleted,
      targetsFailed: this.failedTargets.length,
      itemsFound: this.totalItemsFound,
      bloomSeedsDeployed: this.bloomSeedsDeployed,
      averageSpeed,
      uptime
    };
  }

  /**
   * Get detailed worker status
   */
  getWorkerStatus(): SwarmWorker[] {
    return Array.from(this.workers.values());
  }

  /**
   * Add new targets to the queue
   */
  addTargets(targets: SwarmTarget[]): void {
    // Sort by priority (higher first)
    targets.sort((a, b) => b.priority - a.priority);
    this.targetQueue.push(...targets);
    console.log(`[SWARM] ➕ Added ${targets.length} new targets to queue`);
  }

  /**
   * Stop the swarm
   */
  async stopSwarm(): Promise<void> {
    console.log('[SWARM] 🛑 Stopping swarm...');
    this.isRunning = false;

    // Wait for active workers to complete their current tasks
    const activeWorkers = Array.from(this.workers.values()).filter(w => w.status === 'working');
    if (activeWorkers.length > 0) {
      console.log(`[SWARM] ⏳ Waiting for ${activeWorkers.length} workers to complete...`);
      await Promise.allSettled(activeWorkers.map(w => w.promise || Promise.resolve()));
    }

    this.workers.clear();

    console.log('[SWARM] ✅ Swarm stopped');
  }

  /**
   * Get crawling results
   */
  getResults(): {
    completed: SwarmTarget[];
    failed: SwarmTarget[];
    queued: SwarmTarget[];
  } {
    return {
      completed: this.completedTargets,
      failed: this.failedTargets,
      queued: this.targetQueue
    };
  }
}

