/**
 * Advanced Relationship Graph Database & Analysis
 * Graph-based entity relationship mapping with community detection
 */

export interface GraphNode {
  id: string;
  label: string;
  type: 'person' | 'organization' | 'location' | 'threat' | 'resource';
  properties: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface GraphEdge {
  id: string;
  sourceId: string;
  targetId: string;
  type: 'works_for' | 'located_in' | 'associated_with' | 'communicates_with' | 'owns' | 'controls';
  weight: number;
  properties: Record<string, any>;
  createdAt: Date;
}

export interface GraphStatistics {
  nodeCount: number;
  edgeCount: number;
  nodeTypes: Record<string, number>;
  edgeTypes: Record<string, number>;
  averageDegree: number;
  connectedComponents: number;
  diameter: number;
}

export interface Community {
  id: string;
  nodes: string[];
  density: number;
  centralNode: string;
  properties: Record<string, any>;
}

export class GraphDatabase {
  private nodes: Map<string, GraphNode> = new Map();
  private edges: Map<string, GraphEdge> = new Map();
  private adjacencyList: Map<string, Set<string>> = new Map();

  async addNode(node: Omit<GraphNode, 'createdAt' | 'updatedAt'>): Promise<GraphNode> {
    const fullNode: GraphNode = {
      ...node,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.nodes.set(node.id, fullNode);
    this.adjacencyList.set(node.id, new Set());

    console.log(`[GRAPH] ➕ Added node: ${node.label} (${node.type})`);
    return fullNode;
  }

  async addEdge(edge: Omit<GraphEdge, 'createdAt'>): Promise<GraphEdge> {
    const fullEdge: GraphEdge = {
      ...edge,
      createdAt: new Date()
    };

    this.edges.set(edge.id, fullEdge);

    // Update adjacency list
    if (!this.adjacencyList.has(edge.sourceId)) {
      this.adjacencyList.set(edge.sourceId, new Set());
    }
    if (!this.adjacencyList.has(edge.targetId)) {
      this.adjacencyList.set(edge.targetId, new Set());
    }

    this.adjacencyList.get(edge.sourceId)!.add(edge.targetId);
    this.adjacencyList.get(edge.targetId)!.add(edge.sourceId);

    console.log(`[GRAPH] ➡️ Added edge: ${edge.sourceId} -> ${edge.targetId} (${edge.type})`);
    return fullEdge;
  }

  async findShortestPath(startId: string, endId: string): Promise<string[]> {
    console.log(`[GRAPH] 🛣️ Finding path from ${startId} to ${endId}`);

    const visited = new Set<string>();
    const queue: { node: string; path: string[] }[] = [{ node: startId, path: [startId] }];

    while (queue.length > 0) {
      const { node, path } = queue.shift()!;

      if (node === endId) {
        return path;
      }

      if (visited.has(node)) continue;
      visited.add(node);

      const neighbors = this.adjacencyList.get(node) || new Set();
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          queue.push({ node: neighbor, path: [...path, neighbor] });
        }
      }
    }

    return []; // No path found
  }

  async getNodeNeighborhood(nodeId: string, depth: number = 1): Promise<GraphNode[]> {
    const visited = new Set<string>();
    const result: GraphNode[] = [];
    const queue: { node: string; currentDepth: number }[] = [{ node: nodeId, currentDepth: 0 }];

    while (queue.length > 0) {
      const { node, currentDepth } = queue.shift()!;

      if (currentDepth > depth || visited.has(node)) continue;
      visited.add(node);

      const nodeData = this.nodes.get(node);
      if (nodeData) {
        result.push(nodeData);
      }

      if (currentDepth < depth) {
        const neighbors = this.adjacencyList.get(node) || new Set();
        for (const neighbor of neighbors) {
          queue.push({ node: neighbor, currentDepth: currentDepth + 1 });
        }
      }
    }

    return result;
  }

  async calculateCentrality(): Promise<Record<string, number>> {
    console.log('[GRAPH] 📊 Calculating node centrality');

    const centrality: Record<string, number> = {};

    for (const nodeId of this.nodes.keys()) {
      const degree = (this.adjacencyList.get(nodeId) || new Set()).size;
      centrality[nodeId] = degree;
    }

    return centrality;
  }

  async getStatistics(): Promise<GraphStatistics> {
    const nodeTypes: Record<string, number> = {};
    const edgeTypes: Record<string, number> = {};

    for (const node of this.nodes.values()) {
      nodeTypes[node.type] = (nodeTypes[node.type] || 0) + 1;
    }

    for (const edge of this.edges.values()) {
      edgeTypes[edge.type] = (edgeTypes[edge.type] || 0) + 1;
    }

    const totalDegree = Array.from(this.adjacencyList.values())
      .reduce((sum, neighbors) => sum + neighbors.size, 0);
    const averageDegree = this.nodes.size > 0 ? totalDegree / this.nodes.size : 0;

    return {
      nodeCount: this.nodes.size,
      edgeCount: this.edges.size,
      nodeTypes,
      edgeTypes,
      averageDegree,
      connectedComponents: this.calculateConnectedComponents(),
      diameter: this.calculateDiameter()
    };
  }

  private calculateConnectedComponents(): number {
    const visited = new Set<string>();
    let components = 0;

    for (const nodeId of this.nodes.keys()) {
      if (!visited.has(nodeId)) {
        components++;
        this.dfs(nodeId, visited);
      }
    }

    return components;
  }

  private dfs(nodeId: string, visited: Set<string>): void {
    visited.add(nodeId);
    const neighbors = this.adjacencyList.get(nodeId) || new Set();

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        this.dfs(neighbor, visited);
      }
    }
  }

  private calculateDiameter(): number {
    let maxDistance = 0;

    for (const startNode of this.nodes.keys()) {
      for (const endNode of this.nodes.keys()) {
        if (startNode !== endNode) {
          const path = this.findShortestPath(startNode, endNode);
          if (path.length > maxDistance) {
            maxDistance = path.length - 1; // -1 because path includes start node
          }
        }
      }
    }

    return maxDistance;
  }
}

export class CommunityDetector {
  private graph: GraphDatabase;

  constructor(graph: GraphDatabase) {
    this.graph = graph;
  }

  async detectCommunities(): Promise<Community[]> {
    console.log('[COMMUNITY] 🔍 Detecting communities in graph');

    const communities: Community[] = [];
    const nodeIds = Array.from(this.graph['nodes'].keys());
    const processed = new Set<string>();

    for (const nodeId of nodeIds) {
      if (processed.has(nodeId)) continue;

      const community = await this.findCommunity(nodeId, processed);
      if (community.nodes.length > 0) {
        communities.push(community);
      }
    }

    return communities;
  }

  private async findCommunity(seedNode: string, processed: Set<string>): Promise<Community> {
    const communityNodes = new Set<string>();
    const queue = [seedNode];
    let centralNode = seedNode;
    let maxConnections = 0;

    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      if (processed.has(nodeId) || communityNodes.has(nodeId)) continue;

      communityNodes.add(nodeId);
      processed.add(nodeId);

      // Check connections
      const neighbors = this.graph['adjacencyList'].get(nodeId) || new Set();
      if (neighbors.size > maxConnections) {
        maxConnections = neighbors.size;
        centralNode = nodeId;
      }

      // Add connected nodes with high similarity
      for (const neighbor of neighbors) {
        if (!communityNodes.has(neighbor)) {
          queue.push(neighbor);
        }
      }
    }

    const density = this.calculateDensity(Array.from(communityNodes));

    return {
      id: `community_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      nodes: Array.from(communityNodes),
      density,
      centralNode,
      properties: { size: communityNodes.size, maxConnections }
    };
  }

  private calculateDensity(nodes: string[]): number {
    let totalConnections = 0;
    let possibleConnections = 0;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        possibleConnections++;
        const neighbors = this.graph['adjacencyList'].get(nodes[i]) || new Set();
        if (neighbors.has(nodes[j])) {
          totalConnections++;
        }
      }
    }

    return possibleConnections > 0 ? totalConnections / possibleConnections : 0;
  }
}

export class CentralityAnalyzer {
  private graph: GraphDatabase;

  constructor(graph: GraphDatabase) {
    this.graph = graph;
  }

  async calculateBetweennessCentrality(): Promise<Record<string, number>> {
    console.log('[CENTRALITY] 📊 Calculating betweenness centrality');

    const centrality: Record<string, number> = {};
    const nodeIds = Array.from(this.graph['nodes'].keys());

    for (const nodeId of nodeIds) {
      centrality[nodeId] = 0;
    }

    // Calculate shortest paths between all pairs
    for (let i = 0; i < nodeIds.length; i++) {
      for (let j = i + 1; j < nodeIds.length; j++) {
        const startNode = nodeIds[i];
        const endNode = nodeIds[j];

        const paths = await this.findAllShortestPaths(startNode, endNode);

        if (paths.length > 0) {
          // Distribute centrality among intermediate nodes
          for (const path of paths) {
            for (let k = 1; k < path.length - 1; k++) {
              centrality[path[k]] += 1 / paths.length;
            }
          }
        }
      }
    }

    return centrality;
  }

  private async findAllShortestPaths(startId: string, endId: string): Promise<string[][]> {
    const paths: string[][] = [];
    const visited = new Set<string>();
    const queue: { node: string; path: string[] }[] = [{ node: startId, path: [startId] }];

    while (queue.length > 0) {
      const { node, path } = queue.shift()!;

      if (node === endId) {
        paths.push(path);
        continue;
      }

      if (visited.has(node)) continue;
      visited.add(node);

      const neighbors = this.graph['adjacencyList'].get(node) || new Set();
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor) && !path.includes(neighbor)) {
          queue.push({ node: neighbor, path: [...path, neighbor] });
        }
      }
    }

    return paths;
  }

  async identifyKeyPlayers(threshold: number = 0.1): Promise<GraphNode[]> {
    console.log(`[KEY_PLAYERS] 👑 Identifying key players (threshold: ${threshold})`);

    const centrality = await this.calculateBetweennessCentrality();
    const keyNodes: GraphNode[] = [];

    const maxCentrality = Math.max(...Object.values(centrality));

    for (const [nodeId, score] of Object.entries(centrality)) {
      const normalizedScore = maxCentrality > 0 ? score / maxCentrality : 0;

      if (normalizedScore >= threshold) {
        const node = this.graph['nodes'].get(nodeId);
        if (node) {
          keyNodes.push(node);
        }
      }
    }

    return keyNodes.sort((a, b) => centrality[b.id] - centrality[a.id]);
  }
}
