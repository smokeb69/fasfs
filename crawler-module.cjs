#!/usr/bin/env node
/**
 * BLOOMCRAWLER RIIS - Crawler Module
 * Part 2: Complete web crawling and scanning capabilities
 */

const http = require('http');
const https = require('https');
const { URL } = require('url');

class WebCrawler {
  constructor(db, io) {
    this.db = db;
    this.io = io;
    this.targets = new Map();
    this.isRunning = false;
    this.activeCrawls = 0;
    this.maxConcurrent = 10;
    this.userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
    ];
  }

  // Add target for scanning
  addTarget(url, type = 'surface', priority = 1, depth = 1) {
    const targetId = `target-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const target = {
      id: targetId,
      url,
      type,
      priority,
      depth,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    this.targets.set(targetId, target);

    // Save to database
    if (this.db) {
      const stmt = this.db.prepare('INSERT INTO crawler_targets (url, type, priority, depth, status) VALUES (?, ?, ?, ?, ?)');
      stmt.run(url, type, priority, depth, 'pending');
    }

    return targetId;
  }

  // Scan single URL
  async scanUrl(url, depth = 1) {
    try {
      const parsedUrl = new URL(url);
      const protocol = parsedUrl.protocol === 'https:' ? https : http;

      return new Promise((resolve, reject) => {
        const options = {
          hostname: parsedUrl.hostname,
          port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
          path: parsedUrl.pathname + parsedUrl.search,
          method: 'GET',
          headers: {
            'User-Agent': this.userAgents[Math.floor(Math.random() * this.userAgents.length)],
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive'
          },
          timeout: 10000
        };

        const req = protocol.request(options, (res) => {
          let data = '';

          res.on('data', (chunk) => {
            data += chunk;
          });

          res.on('end', () => {
            const result = {
              url,
              statusCode: res.statusCode,
              headers: res.headers,
              content: data.substring(0, 100000), // Limit content size
              links: this.extractLinks(data, url),
              images: this.extractImages(data, url),
              metadata: this.extractMetadata(data, res.headers),
              size: data.length,
              timestamp: new Date().toISOString()
            };

            // Save to database
            if (this.db) {
              const targetStmt = this.db.prepare('SELECT id FROM crawler_targets WHERE url = ? LIMIT 1');
              const target = targetStmt.get(url);
              
              if (target) {
                const resultStmt = this.db.prepare('INSERT INTO crawler_results (target_id, url, content, links, images, metadata) VALUES (?, ?, ?, ?, ?, ?)');
                resultStmt.run(
                  target.id,
                  url,
                  result.content,
                  JSON.stringify(result.links),
                  JSON.stringify(result.images),
                  JSON.stringify(result.metadata)
                );
              }
            }

            // Emit progress
            if (this.io) {
              this.io.emit('crawler-progress', {
                url,
                status: 'completed',
                result
              });
            }

            resolve(result);
          });
        });

        req.on('error', (error) => {
          reject(error);
        });

        req.on('timeout', () => {
          req.destroy();
          reject(new Error('Request timeout'));
        });

        req.end();
      });
    } catch (error) {
      console.error(`Error scanning ${url}:`, error.message);
      throw error;
    }
  }

  // Extract links from HTML
  extractLinks(html, baseUrl) {
    const links = [];
    const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>/gi;
    let match;

    while ((match = linkRegex.exec(html)) !== null) {
      try {
        const link = new URL(match[1], baseUrl).href;
        if (!links.includes(link)) {
          links.push(link);
        }
      } catch (e) {
        // Invalid URL, skip
      }
    }

    return links;
  }

  // Extract images from HTML
  extractImages(html, baseUrl) {
    const images = [];
    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
    let match;

    while ((match = imgRegex.exec(html)) !== null) {
      try {
        const imgUrl = new URL(match[1], baseUrl).href;
        if (!images.includes(imgUrl)) {
          images.push(imgUrl);
        }
      } catch (e) {
        // Invalid URL, skip
      }
    }

    return images;
  }

  // Extract metadata from HTML and headers
  extractMetadata(html, headers) {
    const metadata = {
      title: this.extractTitle(html),
      description: this.extractMeta(html, 'description'),
      keywords: this.extractMeta(html, 'keywords'),
      author: this.extractMeta(html, 'author'),
      emails: this.extractEmails(html),
      phones: this.extractPhones(html),
      server: headers['server'] || '',
      contentType: headers['content-type'] || '',
      lastModified: headers['last-modified'] || '',
      technologies: this.detectTechnologies(html, headers)
    };

    // Save metadata to database
    if (this.db) {
      const stmt = this.db.prepare('INSERT INTO metadata_extraction (url, title, description, keywords, emails, phones, extracted_data) VALUES (?, ?, ?, ?, ?, ?, ?)');
      stmt.run(
        metadata.url || '',
        metadata.title || '',
        metadata.description || '',
        metadata.keywords || '',
        JSON.stringify(metadata.emails || []),
        JSON.stringify(metadata.phones || []),
        JSON.stringify(metadata)
      );
    }

    return metadata;
  }

  extractTitle(html) {
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    return titleMatch ? titleMatch[1].trim() : '';
  }

  extractMeta(html, name) {
    const metaRegex = new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i');
    const match = html.match(metaRegex);
    return match ? match[1].trim() : '';
  }

  extractEmails(html) {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const matches = html.match(emailRegex) || [];
    return [...new Set(matches)]; // Remove duplicates
  }

  extractPhones(html) {
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    const matches = html.match(phoneRegex) || [];
    return [...new Set(matches)]; // Remove duplicates
  }

  detectTechnologies(html, headers) {
    const technologies = [];

    // Detect frameworks
    if (html.includes('react') || html.includes('__REACT')) technologies.push('React');
    if (html.includes('angular') || html.includes('ng-app')) technologies.push('Angular');
    if (html.includes('vue') || html.includes('v-bind')) technologies.push('Vue.js');
    if (html.includes('wordpress') || html.includes('wp-content')) technologies.push('WordPress');
    if (html.includes('jquery')) technologies.push('jQuery');

    // Detect from headers
    if (headers['x-powered-by']) {
      technologies.push(headers['x-powered-by']);
    }
    if (headers['server']) {
      technologies.push(headers['server']);
    }

    return technologies;
  }

  // Start crawling
  async startCrawling(targets = []) {
    if (this.isRunning) {
      return { error: 'Crawler already running' };
    }

    this.isRunning = true;
    this.activeCrawls = 0;

    // Add targets
    for (const target of targets) {
      this.addTarget(target.url, target.type || 'surface', target.priority || 1, target.depth || 1);
    }

    // Process targets
    const pendingTargets = Array.from(this.targets.values()).filter(t => t.status === 'pending');
    
    for (const target of pendingTargets) {
      while (this.activeCrawls >= this.maxConcurrent) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      this.activeCrawls++;
      target.status = 'crawling';

      this.scanUrl(target.url, target.depth)
        .then((result) => {
          target.status = 'completed';
          this.activeCrawls--;
        })
        .catch((error) => {
          target.status = 'failed';
          this.activeCrawls--;
          console.error(`Crawl failed for ${target.url}:`, error.message);
        });
    }

    this.isRunning = false;
    return { success: true, message: 'Crawling started' };
  }

  // Get statistics
  getStats() {
    const totalTargets = this.targets.size;
    const completed = Array.from(this.targets.values()).filter(t => t.status === 'completed').length;
    const failed = Array.from(this.targets.values()).filter(t => t.status === 'failed').length;
    const pending = Array.from(this.targets.values()).filter(t => t.status === 'pending').length;

    return {
      activeCrawls: this.activeCrawls,
      totalTargets,
      completed,
      failed,
      pending,
      isRunning: this.isRunning,
      lastActivity: new Date().toISOString()
    };
  }

  // Stop crawling
  stopCrawling() {
    this.isRunning = false;
    return { success: true, message: 'Crawling stopped' };
  }
}

module.exports = WebCrawler;

