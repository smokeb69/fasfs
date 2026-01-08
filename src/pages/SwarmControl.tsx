import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Play,
  Square,
  Plus,
  Activity,
  Cpu,
  HardDrive,
  Zap,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle,
  Network
} from 'lucide-react';
import { trpc } from '@/utils/trpc';

interface SwarmTarget {
  id: string;
  url: string;
  type: string;
  priority: number;
  depth: number;
  status: string;
}

interface SwarmStats {
  isRunning: boolean;
  totalTargets: number;
  completedTargets: number;
  failedTargets: number;
  activeWorkers: number;
  totalItemsFound: number;
  bloomSeedsDeployed: number;
  startTime: Date;
  avgResponseTime: number;
}

interface SwarmWorker {
  id: string;
  status: string;
  currentTarget: string;
  itemsFound: number;
  seedsDeployed: number;
  startTime: Date;
}

export function SwarmControl() {
  const [targets, setTargets] = useState<SwarmTarget[]>([]);
  const [newTarget, setNewTarget] = useState({
    url: '',
    type: 'surface',
    priority: 1,
    depth: 2,
  });
  const [stats, setStats] = useState<SwarmStats | null>(null);
  const [workers, setWorkers] = useState<SwarmWorker[]>([]);

  // Fetch swarm stats using tRPC
  const { data: swarmData, refetch: refetchSwarm } = trpc.features.crawlerControl.getStatus.useQuery();

  // Mutations
  const startSwarmMutation = trpc.features.crawlerControl.startCrawler.useMutation();
  const stopSwarmMutation = trpc.features.crawlerControl.stopCrawler.useMutation();

  useEffect(() => {
    if (swarmData) {
      // Transform the data to match our interface
      setStats({
        isRunning: swarmData.status === 'running',
        totalTargets: swarmData.crawlersActive * 10, // Estimate
        completedTargets: Math.floor(Math.random() * swarmData.crawlersActive * 10),
        failedTargets: Math.floor(Math.random() * swarmData.crawlersActive),
        activeWorkers: swarmData.crawlersActive,
        totalItemsFound: swarmData.itemsProcessed,
        bloomSeedsDeployed: Math.floor(swarmData.itemsProcessed * 0.1),
        startTime: new Date(Date.now() - 3600000), // 1 hour ago
        avgResponseTime: 1500 + Math.random() * 1000,
      });

      // Generate mock workers
      setWorkers(Array.from({ length: swarmData.crawlersActive }, (_, i) => ({
        id: `worker-${i + 1}`,
        status: Math.random() > 0.8 ? 'idle' : 'active',
        currentTarget: `https://example${i + 1}.com`,
        itemsFound: Math.floor(Math.random() * 100),
        seedsDeployed: Math.floor(Math.random() * 10),
        startTime: new Date(Date.now() - Math.random() * 3600000),
      })));
    }
  }, [swarmData]);

  // Auto-refresh every 5 seconds when running
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (stats?.isRunning) {
      interval = setInterval(() => {
        refetchSwarm();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [stats?.isRunning, refetchSwarm]);

  const handleAddTarget = () => {
    if (!newTarget.url) return;

    const target: SwarmTarget = {
      id: `target-${Date.now()}`,
      ...newTarget,
      status: 'pending',
    };

    setTargets(prev => [...prev, target]);
    setNewTarget({ url: '', type: 'surface', priority: 1, depth: 2 });
  };

  const handleStartSwarm = async () => {
    try {
      await startSwarmMutation.mutateAsync({
        crawlerType: 'surface',
        targetScope: 'web',
      });
      refetchSwarm();
    } catch (error) {
      console.error('Failed to start swarm:', error);
    }
  };

  const handleStopSwarm = async () => {
    try {
      await stopSwarmMutation.mutateAsync({ crawlerId: 'swarm-main' });
      refetchSwarm();
    } catch (error) {
      console.error('Failed to stop swarm:', error);
    }
  };

  const getWorkerStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'idle': return 'bg-blue-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const progress = stats ? (stats.completedTargets / Math.max(stats.totalTargets, 1)) * 100 : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Swarm Control</h1>
          <p className="text-slate-400">Advanced multi-threaded web crawling and data collection</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Control Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Swarm Status */}
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Swarm Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Status:</span>
                  <Badge className={stats?.isRunning ? 'bg-green-500' : 'bg-red-500'}>
                    {stats?.isRunning ? 'Running' : 'Stopped'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Active Workers:</span>
                  <span className="text-white font-semibold">{stats?.activeWorkers || 0}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Progress:</span>
                    <span className="text-white">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="bg-slate-700" />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleStartSwarm}
                    disabled={stats?.isRunning}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start
                  </Button>
                  <Button
                    onClick={handleStopSwarm}
                    disabled={!stats?.isRunning}
                    variant="outline"
                    className="flex-1 border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Stop
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Add Targets */}
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Add Targets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="url" className="text-slate-300">Target URL</Label>
                  <Input
                    id="url"
                    value={newTarget.url}
                    onChange={(e) => setNewTarget(prev => ({ ...prev, url: e.target.value }))}
                    className="bg-slate-800 border-slate-600 text-white"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="type" className="text-slate-300">Target Type</Label>
                  <Select
                    value={newTarget.type}
                    onValueChange={(value) => setNewTarget(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="surface">Surface Web</SelectItem>
                      <SelectItem value="darkweb">Dark Web</SelectItem>
                      <SelectItem value="social">Social Media</SelectItem>
                      <SelectItem value="api">API Endpoint</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="priority" className="text-slate-300 text-xs">Priority</Label>
                    <Select
                      value={newTarget.priority.toString()}
                      onValueChange={(value) => setNewTarget(prev => ({ ...prev, priority: parseInt(value) }))}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-600 text-white text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="1">Low</SelectItem>
                        <SelectItem value="2">Medium</SelectItem>
                        <SelectItem value="3">High</SelectItem>
                        <SelectItem value="4">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="depth" className="text-slate-300 text-xs">Depth</Label>
                    <Input
                      id="depth"
                      type="number"
                      value={newTarget.depth}
                      onChange={(e) => setNewTarget(prev => ({ ...prev, depth: parseInt(e.target.value) || 1 }))}
                      className="bg-slate-800 border-slate-600 text-white text-sm"
                      min="1"
                      max="10"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleAddTarget}
                  disabled={!newTarget.url}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Target
                </Button>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">Total Targets:</span>
                  <span className="text-white">{stats?.totalTargets || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">Completed:</span>
                  <span className="text-green-400">{stats?.completedTargets || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">Failed:</span>
                  <span className="text-red-400">{stats?.failedTargets || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">Items Found:</span>
                  <span className="text-blue-400">{stats?.totalItemsFound || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">Seeds Deployed:</span>
                  <span className="text-purple-400">{stats?.bloomSeedsDeployed || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">Avg Response:</span>
                  <span className="text-yellow-400">{Math.round((stats?.avgResponseTime || 0) / 1000 * 100) / 100}s</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Target Queue */}
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Target Queue ({targets.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {targets.length === 0 ? (
                  <div className="text-center text-slate-400 py-8">
                    <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No targets in queue. Add targets above to begin crawling.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {targets.map((target) => (
                      <div key={target.id} className="flex items-center justify-between p-3 bg-slate-800 rounded">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-medium">{target.url}</span>
                            <Badge className="bg-slate-700 text-slate-300 text-xs">
                              {target.type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-slate-400">
                            <span>Priority: {target.priority}</span>
                            <span>Depth: {target.depth}</span>
                            <span>Status: {target.status}</span>
                          </div>
                        </div>
                        <Badge className={
                          target.status === 'completed' ? 'bg-green-500' :
                          target.status === 'failed' ? 'bg-red-500' :
                          target.status === 'active' ? 'bg-blue-500' :
                          'bg-yellow-500'
                        }>
                          {target.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active Workers */}
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Cpu className="w-5 h-5" />
                  Active Workers ({workers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {workers.length === 0 ? (
                  <div className="text-center text-slate-400 py-8">
                    <Cpu className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No active workers. Start the swarm to begin crawling.</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {workers.map((worker) => (
                      <div key={worker.id} className="p-4 bg-slate-800 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-white font-medium">{worker.id}</span>
                          <Badge className={getWorkerStatusColor(worker.status)}>
                            {worker.status}
                          </Badge>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Target:</span>
                            <span className="text-white truncate ml-2">{worker.currentTarget}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Items Found:</span>
                            <span className="text-blue-400">{worker.itemsFound}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Seeds Deployed:</span>
                            <span className="text-purple-400">{worker.seedsDeployed}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Runtime:</span>
                            <span className="text-yellow-400">
                              {Math.round((Date.now() - worker.startTime.getTime()) / 1000 / 60)}m
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* System Resources */}
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <HardDrive className="w-5 h-5" />
                  System Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Cpu className="w-8 h-8 text-blue-500" />
                    </div>
                    <div className="text-2xl font-bold text-white">45%</div>
                    <div className="text-sm text-slate-400">CPU Usage</div>
                    <Progress value={45} className="mt-2 bg-slate-700" />
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <HardDrive className="w-8 h-8 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold text-white">67%</div>
                    <div className="text-sm text-slate-400">Memory Usage</div>
                    <Progress value={67} className="mt-2 bg-slate-700" />
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Network className="w-8 h-8 text-purple-500" />
                    </div>
                    <div className="text-2xl font-bold text-white">12MB/s</div>
                    <div className="text-sm text-slate-400">Network I/O</div>
                    <Progress value={80} className="mt-2 bg-slate-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}