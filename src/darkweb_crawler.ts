import { EventEmitter } from 'events';
import { createConnection } from 'net';
import { SocksClient } from 'socks';
import https from 'https';
import http from 'http';
import { URL } from 'url';
import fs from 'fs';
import path from 'path';

interface DarkWebTarget {
  id: string;
  url: string;
  type: 'tor' | 'i2p' | 'freenet';
  priority: number;
  depth: number;
  status: 'pending' | 'crawling' | 'completed' | 'failed';
  discovered: Date;
  lastAttempt?: Date;
  errorCount: number;
}

interface CrawlResult {
  url: string;
  title?: string;
  content: string;
  links: string[];
  images: string[];
  metadata: Record<string, any>;
  timestamp: Date;
  responseTime: number;
  statusCode: number;
  contentType: string;
  size: number;
}

interface LLMMetadata {
  modelName?: string;
  modelVersion?: string;
  generationTool?: string;
  parameters?: Record<string, any>;
  confidence: number;
  detectionMethod: string;
  timestamp: Date;
}

interface ImageForensicsResult {
  url: string;
  isAIGenerated: boolean;
  confidence: number;
  llmMetadata?: LLMMetadata;
  artifacts: string[];
  analysisTimestamp: Date;
  fileMetadata: Record<string, any>;
}

interface IPIntelligence {
  ip: string;
  hostname?: string;
  country?: string;
  region?: string;
  city?: string;
  isp?: string;
  organization?: string;
  threatScore: number;
  reputation: 'clean' | 'suspicious' | 'malicious';
  lastSeen: Date;
  associatedDomains: string[];
  openPorts: number[];
  services: string[];
  metadata: Record<string, any>;
}

interface MetadataResult {
  url: string;
  title?: string;
  description?: string;
  keywords?: string[];
  author?: string;
  publishedDate?: Date;
  modifiedDate?: Date;
  language?: string;
  contentType?: string;
  encoding?: string;
  server?: string;
  framework?: string;
  cms?: string;
  analytics?: string[];
  socialMedia?: string[];
  emails?: string[];
  phoneNumbers?: string[];
  addresses?: string[];
  geolocation?: {
    latitude?: number;
    longitude?: number;
    accuracy?: number;
  };
  securityHeaders?: Record<string, string>;
  certificates?: {
    issuer: string;
    subject: string;
    validFrom: Date;
    validTo: Date;
    fingerprint: string;
  }[];
  technologies?: string[];
  vulnerabilities?: string[];
  extractedIPs?: string[];
  extractedMetadata: Record<string, any>;
}

export class UnifiedWebCrawler extends EventEmitter {
  private targets: Map<string, DarkWebTarget> = new Map();
  private results: Map<string, CrawlResult> = new Map();
  private imageForensics: Map<string, ImageForensicsResult> = new Map();
  private ipIntelligence: Map<string, IPIntelligence> = new Map();
  private metadataCache: Map<string, MetadataResult> = new Map();
  private activeCrawls: Set<string> = new Set();
  private maxConcurrency = 10;
  private crawlTimeout = 30000;
  private torProxy = { host: '127.0.0.1', port: 9050 };
  private i2pProxy = { host: '127.0.0.1', port: 4447 };
  private stealthMode = true;

  // Undetectable crawling features
  private userAgents: string[] = [];
  private requestDelays: number[] = [];
  private sessionCookies: Map<string, string> = new Map();
  private lastRequestTime: Map<string, number> = new Map();
  private failedAttempts: Map<string, number> = new Map();

  constructor() {
    super();
    this.initializeStealthFeatures();
    this.setupEventHandlers();
  }

  /**
   * Initialize undetectable crawling features
   */
  private initializeStealthFeatures(): void {
    // Advanced user agents to mimic real browsers
    this.userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:120.0) Gecko/20100101 Firefox/120.0',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
      'Mozilla/5.0 (iPad; CPU OS 17_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1'
    ];

    // Variable request delays to avoid patterns
    this.requestDelays = [1000, 2000, 3000, 5000, 8000, 13000, 21000];

    console.log('[STEALTH] 🔒 Undetectable crawling features initialized');
  }

  private setupEventHandlers() {
    this.on('crawl-complete', this.onCrawlComplete.bind(this));
    this.on('crawl-error', this.onCrawlError.bind(this));
    this.on('image-found', this.onImageFound.bind(this));
    this.on('llm-detected', this.onLLMDetected.bind(this));
  }

  /**
   * Add targets for dark web crawling
   */
  addTargets(targets: DarkWebTarget[]) {
    for (const target of targets) {
      if (!this.targets.has(target.id)) {
        this.targets.set(target.id, target);
        console.log(`[DARKWEB] 🎯 Added target: ${target.url} (${target.type})`);
      }
    }
  }

  /**
   * Start dark web crawling
   */
  async startCrawling(): Promise<void> {
    console.log('[DARKWEB] 🌑 Starting Dark Web Crawling Operation...');

    // Initialize with known dark web markets and forums
    this.initializeDarkWebTargets();

    // Start crawling loop
    this.crawlLoop();

    // Start metadata analysis
    this.startMetadataAnalysis();
  }

  /**
   * Initialize with known dark web targets
   */
  private initializeDarkWebTargets() {
    const initialTargets: DarkWebTarget[] = [
      // TOR Hidden Services (real examples - in production these would be monitored)
      {
        id: 'tor-example-market',
        url: 'http://example.onion/market',
        type: 'tor',
        priority: 10,
        depth: 3,
        status: 'pending',
        discovered: new Date(),
        errorCount: 0
      },
      {
        id: 'tor-example-forum',
        url: 'http://example.onion/forum',
        type: 'tor',
        priority: 8,
        depth: 2,
        status: 'pending',
        discovered: new Date(),
        errorCount: 0
      },
      // I2P sites
      {
        id: 'i2p-example-site',
        url: 'http://example.i2p',
        type: 'i2p',
        priority: 7,
        depth: 2,
        status: 'pending',
        discovered: new Date(),
        errorCount: 0
      }
    ];

    this.addTargets(initialTargets);
  }

  /**
   * Main crawling loop
   */
  private async crawlLoop() {
    setInterval(async () => {
      if (this.activeCrawls.size >= this.maxConcurrency) {
        return;
      }

      const nextTarget = this.getNextTarget();
      if (nextTarget) {
        this.activeCrawls.add(nextTarget.id);
        this.crawlTarget(nextTarget).finally(() => {
          this.activeCrawls.delete(nextTarget.id);
        });
      }
    }, 1000);
  }

  /**
   * Get next target to crawl
   */
  private getNextTarget(): DarkWebTarget | null {
    const pendingTargets = Array.from(this.targets.values())
      .filter(target => target.status === 'pending')
      .sort((a, b) => b.priority - a.priority);

    return pendingTargets[0] || null;
  }

  /**
   * Crawl a specific target
   */
  private async crawlTarget(target: DarkWebTarget): Promise<void> {
    try {
      target.status = 'crawling';
      target.lastAttempt = new Date();

      console.log(`[DARKWEB] 🔍 Crawling: ${target.url} (${target.type})`);

      const result = await this.performCrawl(target);
      this.results.set(target.url, result);
      target.status = 'completed';

      // Extract new targets from links
      this.extractNewTargets(result.links, target);

      // Analyze images for LLM metadata
      for (const imageUrl of result.images) {
        this.analyzeImageMetadata(imageUrl);
      }

      this.emit('crawl-complete', result);

    } catch (error) {
      target.errorCount++;
      target.status = target.errorCount >= 3 ? 'failed' : 'pending';
      this.emit('crawl-error', { target, error });
    }
  }

  /**
   * Perform the actual HTTP request through appropriate proxy with stealth features
   */
  private async performCrawl(target: DarkWebTarget): Promise<CrawlResult> {
    const startTime = Date.now();

    // Apply intelligent delay for anti-detection
    const delay = this.getIntelligentDelay(target.url);
    if (delay > 0) {
      console.log(`[STEALTH] ⏳ Waiting ${delay}ms before request to ${target.url}`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    return new Promise((resolve, reject) => {
      const url = new URL(target.url);

      // Enhanced stealth headers
      const headers = {
        'User-Agent': this.getRandomUserAgent(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Cache-Control': 'max-age=0',
        'DNT': '1',
      };

      // Add random referrer to mimic browsing behavior
      if (Math.random() > 0.7) {
        headers['Referer'] = this.getRandomReferrer(target.url);
      }

      const options = {
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: url.pathname + url.search,
        method: 'GET',
        timeout: this.crawlTimeout,
        headers
      };

      let request, socksOptions;

      if (target.type === 'tor') {
        // TOR proxy configuration
        socksOptions = {
          proxy: {
            host: this.torProxy.host,
            port: this.torProxy.port,
            type: 5
          },
          command: 'connect',
          destination: {
            host: url.hostname,
            port: url.port || 80
          }
        };
      } else if (target.type === 'i2p') {
        // I2P proxy configuration
        socksOptions = {
          proxy: {
            host: this.i2pProxy.host,
            port: this.i2pProxy.port,
            type: 5
          },
          command: 'connect',
          destination: {
            host: url.hostname,
            port: url.port || 80
          }
        };
      }

      if (socksOptions) {
        // Use SOCKS proxy for dark web
        SocksClient.createConnection(socksOptions, (err, info) => {
          if (err) {
            reject(err);
            return;
          }

          const socket = info.socket;
          const client = url.protocol === 'https:' ? https.request(options) : http.request(options);

          client.on('response', (response) => {
            let data = '';
            response.on('data', chunk => data += chunk);
            response.on('end', () => {
              const result: CrawlResult = {
                url: target.url,
                content: data,
                links: this.extractLinks(data),
                images: this.extractImages(data),
                metadata: this.extractMetadata(data),
                timestamp: new Date(),
                responseTime: Date.now() - startTime,
                statusCode: response.statusCode || 0,
                contentType: response.headers['content-type'] || '',
                size: Buffer.byteLength(data, 'utf8')
              };
              resolve(result);
            });
          });

          client.on('error', reject);
          client.setTimeout(this.crawlTimeout, () => {
            client.destroy();
            reject(new Error('Request timeout'));
          });

          client.end();
        });
      } else {
        // Regular HTTP/HTTPS for surface web
        const client = url.protocol === 'https:' ? https.request(options, (res) => {
          this.handleResponse(res, resolve, reject, target, startTime);
        }) : http.request(options, (res) => {
          this.handleResponse(res, resolve, reject, target, startTime);
        });

        client.on('error', reject);
        client.setTimeout(this.crawlTimeout, () => {
          client.destroy();
          reject(new Error('Request timeout'));
        });

        client.end();
      }
    });
  }

  /**
   * Handle HTTP response with enhanced metadata extraction
   */
  private async handleResponse(res: any, resolve: Function, reject: Function, target: DarkWebTarget, startTime: number) {
    let data = '';
    res.on('data', (chunk: Buffer) => data += chunk);
    res.on('end', async () => {
      try {
        // Extract comprehensive metadata
        const extractedMetadata = this.extractMetadata(target.url, data, res.headers || {});

        // Extract and analyze IPs
        const extractedIPs = extractedMetadata.extractedIPs || [];
        for (const ip of extractedIPs) {
          await this.analyzeIP(ip);
        }

        const result: CrawlResult = {
          url: target.url,
          content: data,
          links: this.extractLinks(data),
          images: this.extractImages(data),
          metadata: extractedMetadata,
          timestamp: new Date(),
          responseTime: Date.now() - startTime,
          statusCode: res.statusCode || 0,
          contentType: res.headers['content-type'] || '',
          size: Buffer.byteLength(data, 'utf8')
        };

        // Update stealth tracking
        this.lastRequestTime.set(target.url, Date.now());
        this.failedAttempts.set(target.url, 0); // Reset on success

        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
    res.on('error', reject);
  }

  /**
   * Extract links from HTML content
   */
  private extractLinks(html: string): string[] {
    const linkRegex = /href=["']([^"']+)["']/g;
    const links: string[] = [];
    let match;

    while ((match = linkRegex.exec(html)) !== null) {
      const link = match[1];
      if (this.isValidDarkWebLink(link)) {
        links.push(link);
      }
    }

    return links;
  }

  /**
   * Extract images from HTML content
   */
  private extractImages(html: string): string[] {
    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/g;
    const images: string[] = [];
    let match;

    while ((match = imgRegex.exec(html)) !== null) {
      images.push(match[1]);
    }

    return images;
  }

  /**
   * Extract metadata from HTML
   */
  private extractMetadata(html: string): Record<string, any> {
    const metadata: Record<string, any> = {};

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) {
      metadata.title = titleMatch[1].trim();
    }

    // Extract meta tags
    const metaRegex = /<meta[^>]+name=["']([^"']+)["'][^>]+content=["']([^"']+)["'][^>]*>/g;
    let match;
    while ((match = metaRegex.exec(html)) !== null) {
      metadata[match[1]] = match[2];
    }

    return metadata;
  }

  /**
   * Check if link is a valid dark web link
   */
  private isValidDarkWebLink(link: string): boolean {
    return link.includes('.onion') || link.includes('.i2p') || link.startsWith('/');
  }

  /**
   * Extract new targets from discovered links
   */
  private extractNewTargets(links: string[], sourceTarget: DarkWebTarget) {
    for (const link of links) {
      if (!this.targets.has(link) && sourceTarget.depth > 0) {
        const type = link.includes('.onion') ? 'tor' : link.includes('.i2p') ? 'i2p' : 'freenet';
        const newTarget: DarkWebTarget = {
          id: `discovered-${Date.now()}-${Math.random()}`,
          url: link,
          type: type as any,
          priority: Math.max(1, sourceTarget.priority - 1),
          depth: sourceTarget.depth - 1,
          status: 'pending',
          discovered: new Date(),
          errorCount: 0
        };

        this.addTargets([newTarget]);
      }
    }
  }

  /**
   * Analyze image metadata for LLM detection
   */
  private async analyzeImageMetadata(imageUrl: string): Promise<void> {
    try {
      console.log(`[FORENSICS] 🔍 Analyzing image metadata: ${imageUrl}`);

      // Download image
      const imageData = await this.downloadImage(imageUrl);
      if (!imageData) return;

      // Analyze metadata
      const forensicsResult = await this.performImageForensics(imageUrl, imageData);
      this.imageForensics.set(imageUrl, forensicsResult);

      if (forensicsResult.isAIGenerated) {
        this.emit('llm-detected', forensicsResult);
      }

      this.emit('image-found', forensicsResult);

    } catch (error) {
      console.error(`[FORENSICS] Error analyzing image ${imageUrl}:`, error);
    }
  }

  /**
   * Download image data
   */
  private async downloadImage(url: string): Promise<Buffer | null> {
    return new Promise((resolve) => {
      const parsedUrl = new URL(url);
      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || 80,
        path: parsedUrl.pathname,
        method: 'GET',
        timeout: 10000
      };

      const req = http.request(options, (res) => {
        if (res.statusCode !== 200) {
          resolve(null);
          return;
        }

        const chunks: Buffer[] = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => resolve(Buffer.concat(chunks)));
      });

      req.on('error', () => resolve(null));
      req.setTimeout(10000, () => {
        req.destroy();
        resolve(null);
      });

      req.end();
    });
  }

  /**
   * Perform comprehensive image forensics analysis
   */
  private async performImageForensics(url: string, imageData: Buffer): Promise<ImageForensicsResult> {
    const result: ImageForensicsResult = {
      url,
      isAIGenerated: false,
      confidence: 0,
      artifacts: [],
      analysisTimestamp: new Date(),
      fileMetadata: {}
    };

    try {
      // Extract EXIF and metadata
      const metadata = this.extractImageMetadata(imageData);
      result.fileMetadata = metadata;

      // Analyze for AI generation artifacts
      const aiAnalysis = this.analyzeAIGenerationArtifacts(imageData, metadata);
      result.isAIGenerated = aiAnalysis.isAIGenerated;
      result.confidence = aiAnalysis.confidence;
      result.artifacts = aiAnalysis.artifacts;

      // Detect specific LLM if AI-generated
      if (result.isAIGenerated) {
        result.llmMetadata = this.detectLLM(metadata, aiAnalysis);
      }

    } catch (error) {
      console.error(`[FORENSICS] Analysis error for ${url}:`, error);
    }

    return result;
  }

  /**
   * Extract image metadata
   */
  private extractImageMetadata(imageData: Buffer): Record<string, any> {
    const metadata: Record<string, any> = {};

    // Basic file analysis
    metadata.fileSize = imageData.length;
    metadata.magicBytes = imageData.subarray(0, 8).toString('hex');

    // Extract EXIF-like data (simplified)
    const exifData = this.extractEXIFData(imageData);
    metadata.exif = exifData;

    // Check for AI generation markers
    metadata.aiMarkers = this.detectAIMarkers(imageData);

    return metadata;
  }

  /**
   * Extract EXIF data from image
   */
  private extractEXIFData(imageData: Buffer): Record<string, any> {
    const exif: Record<string, any> = {};

    // Look for EXIF header
    const exifHeader = imageData.indexOf(Buffer.from([0xFF, 0xE1]));
    if (exifHeader !== -1) {
      // Extract software information
      const softwareOffset = exifHeader + 10;
      if (softwareOffset < imageData.length) {
        const software = imageData.subarray(softwareOffset, softwareOffset + 50);
        const softwareStr = software.toString('ascii').replace(/\0/g, '').trim();
        if (softwareStr) {
          exif.software = softwareStr;
        }
      }
    }

    return exif;
  }

  /**
   * Detect AI generation markers
   */
  private detectAIMarkers(imageData: Buffer): string[] {
    const markers: string[] = [];

    // Check for common AI artifacts
    const dataStr = imageData.toString('ascii', 0, Math.min(1000, imageData.length));

    // Stable Diffusion markers
    if (dataStr.includes('Stable Diffusion') || dataStr.includes('sd-metadata')) {
      markers.push('Stable Diffusion detected');
    }

    // DALL-E markers
    if (dataStr.includes('DALL-E') || dataStr.includes('OpenAI')) {
      markers.push('DALL-E detected');
    }

    // Midjourney markers
    if (dataStr.includes('Midjourney') || dataStr.includes('--ar')) {
      markers.push('Midjourney detected');
    }

    // Check for parameter patterns
    if (/\b\d+:\d+\b/.test(dataStr)) {
      markers.push('Aspect ratio parameters detected');
    }

    return markers;
  }

  /**
   * Analyze for AI generation artifacts
   */
  private analyzeAIGenerationArtifacts(imageData: Buffer, metadata: Record<string, any>): {
    isAIGenerated: boolean;
    confidence: number;
    artifacts: string[];
  } {
    let confidence = 0;
    const artifacts: string[] = [];

    // Check metadata for AI indicators
    if (metadata.aiMarkers?.length > 0) {
      confidence += 40;
      artifacts.push(...metadata.aiMarkers);
    }

    // Check EXIF software
    if (metadata.exif?.software) {
      const software = metadata.exif.software.toLowerCase();
      if (software.includes('stable diffusion') || software.includes('automatic1111')) {
        confidence += 50;
        artifacts.push('Stable Diffusion software detected');
      } else if (software.includes('dall-e') || software.includes('openai')) {
        confidence += 50;
        artifacts.push('DALL-E software detected');
      } else if (software.includes('midjourney')) {
        confidence += 50;
        artifacts.push('Midjourney software detected');
      }
    }

    // Analyze pixel patterns (simplified)
    const pixelAnalysis = this.analyzePixelPatterns(imageData);
    if (pixelAnalysis.hasAIPatterns) {
      confidence += pixelAnalysis.confidence;
      artifacts.push(...pixelAnalysis.artifacts);
    }

    return {
      isAIGenerated: confidence > 30,
      confidence: Math.min(100, confidence),
      artifacts
    };
  }

  /**
   * Analyze pixel patterns for AI artifacts
   */
  private analyzePixelPatterns(imageData: Buffer): {
    hasAIPatterns: boolean;
    confidence: number;
    artifacts: string[];
  } {
    const artifacts: string[] = [];
    let confidence = 0;

    // Simple pattern analysis (in production, use more sophisticated algorithms)
    // Look for unnatural color distributions
    const colorStats = this.calculateColorStatistics(imageData);
    if (colorStats.entropy > 0.95) {
      artifacts.push('High color entropy detected');
      confidence += 10;
    }

    // Check for grid-like artifacts
    if (this.detectGridArtifacts(imageData)) {
      artifacts.push('Grid artifacts detected');
      confidence += 15;
    }

    // Look for frequency domain anomalies
    if (this.detectFrequencyAnomalies(imageData)) {
      artifacts.push('Frequency domain anomalies');
      confidence += 10;
    }

    return {
      hasAIPatterns: confidence > 20,
      confidence,
      artifacts
    };
  }

  /**
   * Calculate color statistics
   */
  private calculateColorStatistics(imageData: Buffer): { entropy: number } {
    // Simplified entropy calculation
    const frequencies: Record<number, number> = {};
    for (let i = 0; i < Math.min(1000, imageData.length); i++) {
      frequencies[imageData[i]] = (frequencies[imageData[i]] || 0) + 1;
    }

    let entropy = 0;
    const total = Object.values(frequencies).reduce((a, b) => a + b, 0);

    for (const count of Object.values(frequencies)) {
      const p = count / total;
      entropy -= p * Math.log2(p);
    }

    return { entropy: entropy / 8 }; // Normalize to 0-1
  }

  /**
   * Detect grid-like artifacts
   */
  private detectGridArtifacts(imageData: Buffer): boolean {
    // Simplified grid detection (look for repeating patterns)
    let gridScore = 0;
    const sampleSize = Math.min(1000, imageData.length);

    for (let i = 8; i < sampleSize; i++) {
      if (imageData[i] === imageData[i - 8]) {
        gridScore++;
      }
    }

    return gridScore > sampleSize * 0.1;
  }

  /**
   * Detect frequency domain anomalies
   */
  private detectFrequencyAnomalies(imageData: Buffer): boolean {
    // Simplified frequency analysis
    let anomalyScore = 0;
    const sampleSize = Math.min(1000, imageData.length);

    for (let i = 1; i < sampleSize; i++) {
      const diff = Math.abs(imageData[i] - imageData[i - 1]);
      if (diff > 200) { // Large jumps indicate potential artifacts
        anomalyScore++;
      }
    }

    return anomalyScore > sampleSize * 0.05;
  }

  /**
   * Detect specific LLM from metadata
   */
  private detectLLM(metadata: Record<string, any>, aiAnalysis: any): LLMMetadata | undefined {
    const llmDetection: LLMMetadata = {
      confidence: aiAnalysis.confidence,
      detectionMethod: 'metadata_analysis',
      timestamp: new Date()
    };

    // Check for specific model indicators
    if (metadata.aiMarkers) {
      for (const marker of metadata.aiMarkers) {
        if (marker.includes('Stable Diffusion')) {
          llmDetection.modelName = 'Stable Diffusion';
          llmDetection.generationTool = 'Automatic1111 or similar';
          this.extractStableDiffusionParams(metadata, llmDetection);
        } else if (marker.includes('DALL-E')) {
          llmDetection.modelName = 'DALL-E';
          llmDetection.generationTool = 'OpenAI';
        } else if (marker.includes('Midjourney')) {
          llmDetection.modelName = 'Midjourney';
          llmDetection.generationTool = 'Midjourney Bot';
        }
      }
    }

    return Object.keys(llmDetection).length > 3 ? llmDetection : undefined;
  }

  /**
   * Extract Stable Diffusion parameters
   */
  private extractStableDiffusionParams(metadata: Record<string, any>, llmDetection: LLMMetadata) {
    // Look for parameter patterns in metadata
    const dataStr = JSON.stringify(metadata).toLowerCase();

    // Extract steps
    const stepsMatch = dataStr.match(/steps[:\s]+(\d+)/);
    if (stepsMatch) {
      llmDetection.parameters = llmDetection.parameters || {};
      llmDetection.parameters.steps = parseInt(stepsMatch[1]);
    }

    // Extract CFG scale
    const cfgMatch = dataStr.match(/cfg[:\s]+([\d.]+)/);
    if (cfgMatch) {
      llmDetection.parameters = llmDetection.parameters || {};
      llmDetection.parameters.cfgScale = parseFloat(cfgMatch[1]);
    }

    // Extract model version
    if (dataStr.includes('sd_1.5')) {
      llmDetection.modelVersion = '1.5';
    } else if (dataStr.includes('sd_2.1')) {
      llmDetection.modelVersion = '2.1';
    }
  }

  /**
   * Get random user agent for stealth crawling
   */
  private getRandomUserAgent(): string {
    return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
  }

  /**
   * Generate random referrer to mimic browsing behavior
   */
  private getRandomReferrer(currentUrl: string): string {
    const referrers = [
      'https://www.google.com/',
      'https://www.bing.com/',
      'https://duckduckgo.com/',
      'https://github.com/',
      'https://stackoverflow.com/',
      'https://news.ycombinator.com/',
      'https://reddit.com/',
      'https://twitter.com/',
      'https://facebook.com/',
      'https://linkedin.com/'
    ];

    // Sometimes use internal referrer (another page on same domain)
    if (Math.random() > 0.5) {
      try {
        const url = new URL(currentUrl);
        return `${url.protocol}//${url.hostname}/`;
      } catch {
        // Fall back to external referrer
      }
    }

    return referrers[Math.floor(Math.random() * referrers.length)];
  }

  /**
   * Start metadata analysis loop
   */
  private startMetadataAnalysis() {
    setInterval(() => {
      // Analyze newly discovered images
      const pendingImages = Array.from(this.results.values())
        .flatMap(result => result.images)
        .filter(img => !this.imageForensics.has(img));

      for (const imageUrl of pendingImages.slice(0, 5)) { // Process 5 at a time
        this.analyzeImageMetadata(imageUrl);
      }
    }, 10000); // Every 10 seconds
  }

  /**
   * Event handlers
   */
  private onCrawlComplete(result: CrawlResult) {
    console.log(`[DARKWEB] ✅ Crawled: ${result.url} (${result.responseTime}ms, ${result.size} bytes)`);

    // Log findings
    if (result.links.length > 0) {
      console.log(`[DARKWEB] 🔗 Found ${result.links.length} links`);
    }

    if (result.images.length > 0) {
      console.log(`[DARKWEB] 🖼️ Found ${result.images.length} images`);
    }
  }

  private onCrawlError(data: { target: DarkWebTarget; error: Error }) {
    console.error(`[DARKWEB] ❌ Failed to crawl ${data.target.url}: ${data.error.message}`);
  }

  private onImageFound(result: ImageForensicsResult) {
    console.log(`[FORENSICS] 🖼️ Image analyzed: ${result.url} - AI Generated: ${result.isAIGenerated} (${result.confidence}%)`);
  }

  private onLLMDetected(result: ImageForensicsResult) {
    if (result.llmMetadata) {
      console.log(`[LLM] 🤖 LLM Detected: ${result.llmMetadata.modelName} (${result.llmMetadata.confidence}%)`);
    }
  }

  /**
   * Get random user agent for stealth crawling
   */
  private getRandomUserAgent(): string {
    return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
  }

  /**
   * Get intelligent delay for anti-detection
   */
  private getIntelligentDelay(domain: string): number {
    const lastRequest = this.lastRequestTime.get(domain) || 0;
    const timeSinceLast = Date.now() - lastRequest;
    const failedCount = this.failedAttempts.get(domain) || 0;

    // Exponential backoff for failed domains
    if (failedCount > 0) {
      return Math.min(60000 * Math.pow(2, failedCount), 300000); // Max 5 minutes
    }

    // Fibonacci-like delay pattern to avoid detection
    const baseDelay = this.requestDelays[Math.floor(Math.random() * this.requestDelays.length)];
    const adaptiveDelay = timeSinceLast < 5000 ? baseDelay * 2 : baseDelay;

    return adaptiveDelay;
  }

  /**
   * Extract IPs from text content
   */
  private extractIPs(text: string): string[] {
    const ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g;
    const matches = text.match(ipRegex) || [];
    return [...new Set(matches)]; // Remove duplicates
  }

  /**
   * Analyze IP intelligence
   */
  private async analyzeIP(ip: string): Promise<IPIntelligence> {
    // Check if we already have intelligence for this IP
    if (this.ipIntelligence.has(ip)) {
      return this.ipIntelligence.get(ip)!;
    }

    // Simulate IP intelligence gathering (in real implementation, use services like IPInfoDB, MaxMind, etc.)
    const intelligence: IPIntelligence = {
      ip,
      hostname: await this.reverseLookup(ip),
      country: 'Unknown', // Would use GeoIP service
      region: 'Unknown',
      city: 'Unknown',
      isp: 'Unknown',
      organization: 'Unknown',
      threatScore: Math.random() * 100,
      reputation: Math.random() > 0.8 ? 'malicious' : Math.random() > 0.6 ? 'suspicious' : 'clean',
      lastSeen: new Date(),
      associatedDomains: [],
      openPorts: [],
      services: [],
      metadata: {
        firstSeen: new Date(),
        scanCount: 0,
        tags: []
      }
    };

    this.ipIntelligence.set(ip, intelligence);
    return intelligence;
  }

  /**
   * Reverse DNS lookup (simulated)
   */
  private async reverseLookup(ip: string): Promise<string | undefined> {
    // In real implementation, would use DNS reverse lookup
    // For now, return undefined to indicate no hostname found
    return undefined;
  }

  /**
   * Extract comprehensive metadata from content
   */
  private extractMetadata(url: string, html: string, headers: Record<string, string>): MetadataResult {
    const $ = cheerio.load(html);

    const metadata: MetadataResult = {
      url,
      title: $('title').text().trim() || $('h1').first().text().trim(),
      description: $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content'),
      keywords: $('meta[name="keywords"]').attr('content')?.split(',').map(k => k.trim()),
      author: $('meta[name="author"]').attr('content') || $('meta[property="article:author"]').attr('content'),
      publishedDate: this.parseDate($('meta[property="article:published_time"]').attr('content')) ||
                    this.parseDate($('time[datetime]').attr('datetime')),
      modifiedDate: this.parseDate($('meta[property="article:modified_time"]').attr('content')),
      language: $('html').attr('lang') || $('meta[name="language"]').attr('content'),
      contentType: headers['content-type'],
      encoding: headers['content-encoding'] || 'utf-8',
      server: headers['server'],
      framework: this.detectFramework($, headers),
      cms: this.detectCMS($, headers),
      analytics: this.detectAnalytics($),
      socialMedia: this.detectSocialMedia($),
      emails: this.extractEmails(html),
      phoneNumbers: this.extractPhoneNumbers(html),
      addresses: this.extractAddresses(html),
      geolocation: this.extractGeolocation($),
      securityHeaders: this.extractSecurityHeaders(headers),
      certificates: [], // Would require SSL certificate inspection
      technologies: this.detectTechnologies($, headers),
      vulnerabilities: [], // Would require vulnerability scanning
      extractedIPs: this.extractIPs(html),
      extractedMetadata: {}
    };

    this.metadataCache.set(url, metadata);
    return metadata;
  }

  /**
   * Parse date from various formats
   */
  private parseDate(dateStr?: string): Date | undefined {
    if (!dateStr) return undefined;
    try {
      return new Date(dateStr);
    } catch {
      return undefined;
    }
  }

  /**
   * Detect web framework
   */
  private detectFramework($: cheerio.CheerioAPI, headers: Record<string, string>): string | undefined {
    const server = headers['server']?.toLowerCase();
    const poweredBy = headers['x-powered-by']?.toLowerCase();

    if (server?.includes('nginx')) return 'Nginx';
    if (server?.includes('apache')) return 'Apache';
    if (poweredBy?.includes('express')) return 'Express.js';
    if (poweredBy?.includes('django')) return 'Django';
    if ($('meta[name="generator"]').attr('content')?.toLowerCase().includes('wordpress')) return 'WordPress';

    return undefined;
  }

  /**
   * Detect CMS
   */
  private detectCMS($: cheerio.CheerioAPI, headers: Record<string, string>): string | undefined {
    if ($('meta[name="generator"]').attr('content')?.toLowerCase().includes('wordpress')) return 'WordPress';
    if ($('.joomla').length > 0 || $('meta[name="generator"]').attr('content')?.includes('Joomla')) return 'Joomla';
    if ($('#drupal').length > 0 || $('meta[name="generator"]').attr('content')?.includes('Drupal')) return 'Drupal';

    return undefined;
  }

  /**
   * Detect analytics services
   */
  private detectAnalytics($: cheerio.CheerioAPI): string[] {
    const analytics: string[] = [];

    // Google Analytics
    if ($('script[src*="googletagmanager.com"]').length > 0 ||
        $('script:contains("gtag")').length > 0 ||
        $('script:contains("GA_MEASUREMENT_ID")').length > 0) {
      analytics.push('Google Analytics');
    }

    // Facebook Pixel
    if ($('script:contains("fbq")').length > 0) {
      analytics.push('Facebook Pixel');
    }

    // Other analytics
    if ($('script[src*="hotjar.com"]').length > 0) analytics.push('Hotjar');
    if ($('script[src*="segment.com"]').length > 0) analytics.push('Segment');

    return analytics;
  }

  /**
   * Detect social media integrations
   */
  private detectSocialMedia($: cheerio.CheerioAPI): string[] {
    const social: string[] = [];

    if ($('a[href*="facebook.com"]').length > 0) social.push('Facebook');
    if ($('a[href*="twitter.com"]').length > 0) social.push('Twitter');
    if ($('a[href*="instagram.com"]').length > 0) social.push('Instagram');
    if ($('a[href*="linkedin.com"]').length > 0) social.push('LinkedIn');

    return social;
  }

  /**
   * Extract email addresses
   */
  private extractEmails(text: string): string[] {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const matches = text.match(emailRegex) || [];
    return [...new Set(matches)];
  }

  /**
   * Extract phone numbers
   */
  private extractPhoneNumbers(text: string): string[] {
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    const matches = text.match(phoneRegex) || [];
    return [...new Set(matches)];
  }

  /**
   * Extract addresses (basic implementation)
   */
  private extractAddresses(text: string): string[] {
    // This is a simplified address extraction - in practice, would use NLP
    const addressPatterns = [
      /\d+\s+[A-Za-z0-9\s,.-]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Way|Place|Pl|Court|Ct)\s*,?\s*[A-Za-z\s]+,?\s*\d{5}/gi
    ];

    const addresses: string[] = [];
    for (const pattern of addressPatterns) {
      const matches = text.match(pattern) || [];
      addresses.push(...matches);
    }

    return [...new Set(addresses)];
  }

  /**
   * Extract geolocation from meta tags
   */
  private extractGeolocation($: cheerio.CheerioAPI): { latitude?: number; longitude?: number; accuracy?: number } | undefined {
    const lat = $('meta[property="place:location:latitude"]').attr('content') ||
                $('meta[name="geo.position"]').attr('content')?.split(';')[0];
    const lng = $('meta[property="place:location:longitude"]').attr('content') ||
                $('meta[name="geo.position"]').attr('content')?.split(';')[1];

    if (lat && lng) {
      return {
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        accuracy: 1000 // Default accuracy in meters
      };
    }

    return undefined;
  }

  /**
   * Extract security headers
   */
  private extractSecurityHeaders(headers: Record<string, string>): Record<string, string> {
    const securityHeaders: Record<string, string> = {};

    const securityHeaderNames = [
      'x-frame-options', 'x-content-type-options', 'x-xss-protection',
      'content-security-policy', 'strict-transport-security', 'x-robots-tag',
      'referrer-policy', 'permissions-policy', 'cross-origin-embedder-policy',
      'cross-origin-opener-policy', 'cross-origin-resource-policy'
    ];

    for (const header of securityHeaderNames) {
      if (headers[header]) {
        securityHeaders[header] = headers[header];
      }
    }

    return securityHeaders;
  }

  /**
   * Detect technologies from headers and content
   */
  private detectTechnologies($: cheerio.CheerioAPI, headers: Record<string, string>): string[] {
    const technologies: string[] = [];

    // Server technologies
    if (headers['server']) technologies.push(headers['server']);

    // JavaScript frameworks
    if ($('script[src*="jquery"]').length > 0) technologies.push('jQuery');
    if ($('script[src*="react"]').length > 0) technologies.push('React');
    if ($('script[src*="vue"]').length > 0) technologies.push('Vue.js');
    if ($('script[src*="angular"]').length > 0) technologies.push('Angular');

    // CSS frameworks
    if ($('link[href*="bootstrap"]').length > 0) technologies.push('Bootstrap');
    if ($('link[href*="tailwind"]').length > 0) technologies.push('Tailwind CSS');

    return technologies;
  }

  /**
   * Get crawling statistics
   */
  getCrawlingStats() {
    return {
      totalTargets: this.targets.size,
      activeCrawls: this.activeCrawls.size,
      completedCrawls: Array.from(this.targets.values()).filter(t => t.status === 'completed').length,
      failedCrawls: Array.from(this.targets.values()).filter(t => t.status === 'failed').length,
      itemsProcessed: this.results.size,
      imagesAnalyzed: this.imageForensics.size,
      aiImagesDetected: Array.from(this.imageForensics.values()).filter(r => r.isAIGenerated).length,
      metadataExtracted: this.metadataCache.size,
      ipIntelligence: this.ipIntelligence.size,
      stealthMode: this.stealthMode,
      successRate: this.results.size > 0 ? (this.results.size / this.targets.size) * 100 : 0,
      averageResponseTime: this.calculateAverageResponseTime(),
      lastActivity: this.getLastActivityTime()
    };
  }

  /**
   * Calculate average response time
   */
  private calculateAverageResponseTime(): number {
    const results = Array.from(this.results.values());
    if (results.length === 0) return 0;

    const totalTime = results.reduce((sum, result) => sum + result.responseTime, 0);
    return Math.round(totalTime / results.length);
  }

  /**
   * Get last activity timestamp
   */
  private getLastActivityTime(): Date {
    const timestamps = Array.from(this.results.values()).map(r => r.timestamp);
    if (timestamps.length === 0) return new Date();

    return new Date(Math.max(...timestamps.map(t => t.getTime())));
  }

  /**
   * Get IP intelligence data
   */
  getIPIntelligence(): IPIntelligence[] {
    return Array.from(this.ipIntelligence.values());
  }

  /**
   * Get metadata results
   */
  getMetadata(): MetadataResult[] {
    return Array.from(this.metadataCache.values());
  }

  /**
   * Get all crawl results
   */
  getResults(): CrawlResult[] {
    return Array.from(this.results.values());
  }

  /**
   * Get image forensics results
   */
  getImageForensics(): ImageForensicsResult[] {
    return Array.from(this.imageForensics.values());
  }

  /**
   * Get AI-generated images
   */
  getAIGeneratedImages(): ImageForensicsResult[] {
    return Array.from(this.imageForensics.values()).filter(r => r.isAIGenerated);
  }

  /**
   * Get LLM detection results
   */
  getLLMDetections(): ImageForensicsResult[] {
    return Array.from(this.imageForensics.values()).filter(r => r.llmMetadata !== undefined);
  }

  /**
   * Get image forensics results
   */
  getImageForensics(): ImageForensicsResult[] {
    return Array.from(this.imageForensics.values());
  }

  /**
   * Get AI-generated images only
   */
  getAIGeneratedImages(): ImageForensicsResult[] {
    return Array.from(this.imageForensics.values()).filter(r => r.isAIGenerated);
  }

  /**
   * Get IP intelligence data
   */
  getIPIntelligence(): IPIntelligence[] {
    return Array.from(this.ipIntelligence.values());
  }

  /**
   * Get extracted metadata
   */
  getMetadata(): MetadataResult[] {
    return Array.from(this.metadataCache.values());
  }
}
