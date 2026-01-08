import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Shield,
  Network,
  Activity,
  Cpu,
  BarChart3,
  AlertTriangle,
  Globe,
  Zap,
  Users,
  Target,
  Play,
  Square,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Wifi,
  WifiOff,
  MapPin,
  FileText,
  Search
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useWebSocket, useThreatMonitoring, useSystemMonitoring } from '@/hooks/useWebSocket';

interface SystemStats {
  threatDetection: {
    activeThreats: number;
    criticalThreats: number;
    riskScore: number;
    totalDetected: number;
  };
  swarmCrawler: {
    totalWorkers: number;
    activeWorkers: number;
    targetsCompleted: number;
    itemsFound: number;
    bloomSeedsDeployed: number;
    averageSpeed: number;
  };
  predictiveAnalytics: {
    forecastsGenerated: number;
    highProbability: number;
    activeModels: number;
  };
  graphDatabase: {
    nodeCount: number;
    edgeCount: number;
    connectedComponents: number;
  };
  soarAutomation: {
    activePlaybooks: number;
    executions: number;
    successful: number;
  };
  bloomEngine: {
    activeSeeds: number;
    totalActivations: number;
    deploymentVectors: number;
  };
}

export function MasterDashboard() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [osintFeed, setOsintFeed] = useState<any[]>([]);
  const [sensors, setSensors] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [noteForm, setNoteForm] = useState({ title: '', body: '', tags: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ osint: any[]; sensors: any[]; alerts: any[] }>({ osint: [], sensors: [], alerts: [] });
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  // WebSocket hooks for real-time updates
  const { isConnected: wsConnected } = useWebSocket();
  const { threatUpdates, activeThreatCount } = useThreatMonitoring();
  const { systemMetrics } = useSystemMonitoring();

  const API_BASE = 'http://localhost:5000/api';

  // Fetch all system statistics
  useEffect(() => {
    const fetchAllStats = async () => {
      try {
        const [
          threatResponse,
          swarmResponse,
          predictiveResponse,
          graphResponse,
          soarResponse,
          bloomResponse
        ] = await Promise.allSettled([
          fetch(`${API_BASE}/threats/live`),
          fetch(`${API_BASE}/swarm/stats`),
          fetch(`${API_BASE}/analytics/predictive`),
          fetch(`${API_BASE}/graph/stats`),
          fetch(`${API_BASE}/soar/stats`),
          fetch(`${API_BASE}/bloom/stats`) // We'll need to add this endpoint
        ]);

        const threatData = threatResponse.status === 'fulfilled' ? threatResponse.value : null;
        const swarmData = swarmResponse.status === 'fulfilled' ? swarmResponse.value : null;
        const predictiveData = predictiveResponse.status === 'fulfilled' ? predictiveResponse.value : null;
        const graphData = graphResponse.status === 'fulfilled' ? graphResponse.value : null;
        const soarData = soarResponse.status === 'fulfilled' ? soarResponse.value : null;
        const bloomData = bloomResponse.status === 'fulfilled' ? bloomResponse.value : null;

        // Mock data for systems without endpoints
        const systemStats: SystemStats = {
          threatDetection: threatData ? {
            activeThreats: threatData.data?.threatIntelligence?.activeThreats || 0,
            criticalThreats: threatData.data?.threatIntelligence?.criticalThreats || 0,
            riskScore: threatData.data?.threatIntelligence?.riskScore || 0,
            totalDetected: threatData.data?.totalThreatsDetected || 0
          } : { activeThreats: 0, criticalThreats: 0, riskScore: 0, totalDetected: 0 },

          swarmCrawler: swarmData ? swarmData.data : {
            totalWorkers: 0, activeWorkers: 0, targetsCompleted: 0,
            itemsFound: 0, bloomSeedsDeployed: 0, averageSpeed: 0
          },

          predictiveAnalytics: predictiveData ? {
            forecastsGenerated: predictiveData.data?.length || 0,
            highProbability: predictiveData.data?.filter((f: any) => f.probability > 0.5).length || 0,
            activeModels: 2
          } : { forecastsGenerated: 0, highProbability: 0, activeModels: 2 },

          graphDatabase: graphData ? {
            nodeCount: graphData.data?.nodeCount || 0,
            edgeCount: graphData.data?.edgeCount || 0,
            connectedComponents: graphData.data?.connectedComponents || 0
          } : { nodeCount: 0, edgeCount: 0, connectedComponents: 0 },

          soarAutomation: soarData ? {
            activePlaybooks: soarData.data?.totalPlaybooks || 0,
            executions: soarData.data?.totalExecutions || 0,
            successful: soarData.data?.successfulExecutions || 0
          } : { activePlaybooks: 0, executions: 0, successful: 0 },

          bloomEngine: {
            activeSeeds: 5, // From server logs
            totalActivations: 0,
            deploymentVectors: 7
          }
        };

        setStats(systemStats);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch system stats:', error);
        setIsLoading(false);
      }
    };

    fetchAllStats();
    const interval = setInterval(fetchAllStats, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // OSINT / sensors / notes
  useEffect(() => {
    const load = async () => {
      try {
        const [osintRes, sensorRes, notesRes] = await Promise.all([
          fetch(`${API_BASE}/osint/news`).then(r => r.json()).catch(() => null),
          fetch(`${API_BASE}/sensors/latest`).then(r => r.json()).catch(() => null),
          fetch(`${API_BASE}/research/notes`).then(r => r.json()).catch(() => null),
        ]);
        setOsintFeed(osintRes?.data ?? []);
        setSensors(sensorRes?.data ?? []);
        setNotes(notesRes?.data ?? []);
      } catch (error) {
        console.warn('Failed to load OSINT/sensors/notes', error);
      }
    };
    load();
    const id = setInterval(load, 15000);
    return () => clearInterval(id);
  }, []);

  const handleAddNote = async () => {
    if (!noteForm.title || !noteForm.body) {
      toast({ title: 'Note needs a title and body', variant: 'destructive' });
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/research/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: noteForm.title,
          body: noteForm.body,
          tags: noteForm.tags ? noteForm.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
          createdBy: 'analyst',
        })
      });
      const data = await res.json();
      if (data?.data) {
        setNotes([data.data, ...notes].slice(0, 10));
        setNoteForm({ title: '', body: '', tags: '' });
        toast({ title: 'Note saved' });
      }
    } catch (error) {
      toast({ title: 'Failed to save note', variant: 'destructive' });
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(`${API_BASE}/search/unified?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setSearchResults(data?.data ?? { osint: [], sensors: [], alerts: [] });
    } catch (error) {
      toast({ title: 'Search failed', variant: 'destructive' });
    } finally {
      setIsSearching(false);
    }
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getRiskColor = (score: number) => {
    if (score >= 7) return 'text-red-400';
    if (score >= 4) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getRiskBg = (score: number) => {
    if (score >= 7) return 'bg-red-500/10 border-red-500/20';
    if (score >= 4) return 'bg-yellow-500/10 border-yellow-500/20';
    return 'bg-green-500/10 border-green-500/20';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 mx-auto mb-4 animate-spin text-blue-400" />
          <h2 className="text-xl font-semibold">Loading BLOOMCRAWLER RIIS Systems...</h2>
          <p className="text-slate-400 mt-2">Initializing all advanced components</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <Shield className="w-10 h-10 text-blue-400" />
              BLOOMCRAWLER RIIS - Master Control
            </h1>
            <div className="flex items-center gap-4">
              {/* Real-time connection status */}
              <div className="flex items-center gap-2">
                {wsConnected ? (
                  <Wifi className="w-5 h-5 text-green-400" />
                ) : (
                  <WifiOff className="w-5 h-5 text-red-400" />
                )}
                <span className={`text-sm ${wsConnected ? 'text-green-400' : 'text-red-400'}`}>
                  {wsConnected ? 'LIVE' : 'OFFLINE'}
                </span>
              </div>
              {/* Real-time threat counter */}
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span className="text-sm text-red-400">
                  Threats: {activeThreatCount}
                </span>
              </div>
            </div>
          </div>
          <p className="text-slate-400">Unified Command & Control Dashboard with Real-time Monitoring</p>
        </div>

        {/* System Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Threat Detection */}
          <Card className={`bg-slate-800/50 border-slate-700 ${getRiskBg(stats?.threatDetection.riskScore || 0)}`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className={`w-5 h-5 ${getRiskColor(stats?.threatDetection.riskScore || 0)}`} />
                Threat Detection
              </CardTitle>
              <CardDescription>Real-time threat monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Active Threats</span>
                  <span className="font-semibold text-red-400">{activeThreatCount || stats?.threatDetection.activeThreats || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Critical Alerts</span>
                  <span className="font-semibold text-orange-400">{stats?.threatDetection.criticalThreats}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Risk Score</span>
                  <span className={`font-semibold ${getRiskColor(stats?.threatDetection.riskScore || 0)}`}>
                    {stats?.threatDetection.riskScore.toFixed(1)}
                  </span>
                </div>
                {/* Real-time threat indicator */}
                {threatUpdates.length > 0 && (
                  <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span className="text-xs text-red-400">
                        Latest: {threatUpdates[0].threat.threatName} ({threatUpdates[0].threat.severity})
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Swarm Crawler */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Network className="w-5 h-5 text-blue-400" />
                Swarm Crawler
              </CardTitle>
              <CardDescription>Multi-threaded crawling engine</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Active Workers</span>
                  <span className="font-semibold text-green-400">{stats?.swarmCrawler.activeWorkers}/{stats?.swarmCrawler.totalWorkers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Items Found</span>
                  <span className="font-semibold text-blue-400">{stats?.swarmCrawler.itemsFound.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Speed</span>
                  <span className="font-semibold text-purple-400">{stats?.swarmCrawler.averageSpeed.toFixed(1)}/s</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bloom Engine */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="w-5 h-5 text-yellow-400" />
                Bloom Engine
              </CardTitle>
              <CardDescription>Recursive seed deployment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Active Seeds</span>
                  <span className="font-semibold text-green-400">{stats?.bloomEngine.activeSeeds}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Deployments</span>
                  <span className="font-semibold text-blue-400">{stats?.bloomEngine.deploymentVectors}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Activations</span>
                  <span className="font-semibold text-purple-400">{stats?.bloomEngine.totalActivations}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Predictive Analytics */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                Analytics
              </CardTitle>
              <CardDescription>ML-powered forecasting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Forecasts</span>
                  <span className="font-semibold text-blue-400">{stats?.predictiveAnalytics.forecastsGenerated}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">High Risk</span>
                  <span className="font-semibold text-red-400">{stats?.predictiveAnalytics.highProbability}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Active Models</span>
                  <span className="font-semibold text-green-400">{stats?.predictiveAnalytics.activeModels}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Graph Database */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Globe className="w-5 h-5 text-pink-400" />
                Graph Database
              </CardTitle>
              <CardDescription>Entity relationships</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Nodes</span>
                  <span className="font-semibold text-blue-400">{stats?.graphDatabase.nodeCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Edges</span>
                  <span className="font-semibold text-green-400">{stats?.graphDatabase.edgeCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Components</span>
                  <span className="font-semibold text-purple-400">{stats?.graphDatabase.connectedComponents}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SOAR Automation */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Cpu className="w-5 h-5 text-orange-400" />
                SOAR Automation
              </CardTitle>
              <CardDescription>Incident response</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Playbooks</span>
                  <span className="font-semibold text-blue-400">{stats?.soarAutomation.activePlaybooks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Executions</span>
                  <span className="font-semibold text-green-400">{stats?.soarAutomation.executions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Success Rate</span>
                  <span className="font-semibold text-purple-400">
                    {stats?.soarAutomation.executions ?
                      ((stats.soarAutomation.successful / stats.soarAutomation.executions) * 100).toFixed(1) + '%'
                      : '0%'
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-16 bg-blue-600 hover:bg-blue-700 flex flex-col items-center gap-2">
              <Play className="w-6 h-6" />
              <span className="text-sm">Start Swarm</span>
            </Button>
            <Button className="h-16 bg-red-600 hover:bg-red-700 flex flex-col items-center gap-2">
              <Square className="w-6 h-6" />
              <span className="text-sm">Stop All</span>
            </Button>
            <Button className="h-16 bg-green-600 hover:bg-green-700 flex flex-col items-center gap-2">
              <RefreshCw className="w-6 h-6" />
              <span className="text-sm">Refresh</span>
            </Button>
            <Button className="h-16 bg-purple-600 hover:bg-purple-700 flex flex-col items-center gap-2">
              <Shield className="w-6 h-6" />
              <span className="text-sm">Defense Mode</span>
            </Button>
          </div>
        </div>

        {/* Live Intel & Sensors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-400" />
                Live OSINT / News
              </CardTitle>
              <CardDescription>Aggregated open-source intelligence feed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 max-h-80 overflow-y-auto">
              {osintFeed.slice(0, 8).map((item) => (
                <div key={item.id} className="p-3 bg-slate-700/40 rounded border border-slate-700/80">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <div className="text-sm font-semibold text-blue-100">{item.title}</div>
                      <div className="text-xs text-slate-400 mt-1">{item.summary ?? 'No summary'}</div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded bg-slate-900 border border-slate-700 uppercase">
                      {item.source || 'feed'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-2 flex gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700">{item.risk ?? 'medium'}</span>
                    {item.tags && (
                      <span className="text-slate-500">Tags: {Array.isArray(item.tags) ? item.tags.join(', ') : item.tags}</span>
                    )}
                  </div>
                </div>
              ))}
              {osintFeed.length === 0 && (
                <div className="text-sm text-slate-400">No OSINT items yet.</div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-400" />
                Sensors / Geo Overlay
              </CardTitle>
              <CardDescription>Recent field inputs and telemetry</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-32 rounded bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700 mb-3 flex items-center justify-center text-xs text-slate-500">
                Map/heat overlay placeholder (plug map provider as needed)
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {sensors.slice(0, 6).map((s) => (
                  <div key={s.id} className="p-2 bg-slate-700/40 rounded border border-slate-700/80">
                    <div className="flex justify-between text-sm text-slate-100">
                      <span>{s.source}</span>
                      <span className="text-slate-400">{s.valueType}: {s.value}{s.unit ? ` ${s.unit}` : ''}</span>
                    </div>
                    {(s.latitude || s.longitude) && (
                      <div className="text-xs text-slate-500">Lat {s.latitude ?? '-'} / Lon {s.longitude ?? '-'}</div>
                    )}
                  </div>
                ))}
                {sensors.length === 0 && <div className="text-sm text-slate-400">No sensor inputs yet.</div>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Research Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-yellow-300" />
                Analyst Notes
              </CardTitle>
              <CardDescription>Capture findings and observations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-2">
                <input
                  className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white"
                  placeholder="Title"
                  value={noteForm.title}
                  onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                />
                <textarea
                  className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white min-h-[80px]"
                  placeholder="Body"
                  value={noteForm.body}
                  onChange={(e) => setNoteForm({ ...noteForm, body: e.target.value })}
                />
                <input
                  className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white"
                  placeholder="Tags (comma separated)"
                  value={noteForm.tags}
                  onChange={(e) => setNoteForm({ ...noteForm, tags: e.target.value })}
                />
                <Button onClick={handleAddNote}>Save Note</Button>
              </div>
              <div className="space-y-2 max-h-52 overflow-y-auto">
                {notes.slice(0, 6).map((n) => (
                  <div key={n.id} className="p-2 bg-slate-700/40 rounded border border-slate-700/80">
                    <div className="text-sm font-semibold text-blue-100">{n.title}</div>
                    <div className="text-xs text-slate-400 line-clamp-3">{n.body}</div>
                    {n.tags && (
                      <div className="text-[11px] text-slate-500 mt-1">Tags: {Array.isArray(n.tags) ? n.tags.join(', ') : n.tags}</div>
                    )}
                  </div>
                ))}
                {notes.length === 0 && <div className="text-sm text-slate-400">No notes yet.</div>}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-cyan-300" />
                Unified Search
              </CardTitle>
              <CardDescription>Search OSINT, sensors, and alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <input
                  className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white"
                  placeholder="Search keywords"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={isSearching}>
                  {isSearching ? 'Searching...' : 'Go'}
                </Button>
              </div>
              <div className="space-y-2 max-h-52 overflow-y-auto text-sm">
                {searchResults.osint.length === 0 && searchResults.sensors.length === 0 && searchResults.alerts.length === 0 && (
                  <div className="text-slate-500">Results will appear here.</div>
                )}
                {searchResults.osint.slice(0, 3).map((o) => (
                  <div key={o.id} className="p-2 bg-slate-700/40 rounded border border-slate-700/80">
                    <div className="text-slate-100">OSINT: {o.title}</div>
                    <div className="text-[11px] text-slate-500">{o.summary}</div>
                  </div>
                ))}
                {searchResults.sensors.slice(0, 3).map((s) => (
                  <div key={s.id} className="p-2 bg-slate-700/40 rounded border border-slate-700/80">
                    <div className="text-slate-100">Sensor: {s.source}</div>
                    <div className="text-[11px] text-slate-500">{s.valueType}: {s.value}</div>
                  </div>
                ))}
                {searchResults.alerts.slice(0, 3).map((a) => (
                  <div key={a.id} className="p-2 bg-slate-700/40 rounded border border-slate-700/80">
                    <div className="text-slate-100">Alert: {a.threatName}</div>
                    <div className="text-[11px] text-slate-500">Severity: {a.severity}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Logs */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-400" />
              System Activity
            </CardTitle>
            <CardDescription>Real-time system logs and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              <div className="flex items-start gap-3 p-3 bg-slate-700/50 rounded">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                <div>
                  <div className="text-sm font-semibold text-green-400">System Online</div>
                  <div className="text-xs text-slate-400">All BLOOMCRAWLER RIIS systems operational</div>
                </div>
              </div>

              {stats?.swarmCrawler.activeWorkers > 0 && (
                <div className="flex items-start gap-3 p-3 bg-blue-500/10 rounded">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <div>
                    <div className="text-sm font-semibold text-blue-400">Swarm Active</div>
                    <div className="text-xs text-slate-400">
                      {stats.swarmCrawler.activeWorkers} workers processing targets
                    </div>
                  </div>
                </div>
              )}

              {stats?.threatDetection.activeThreats > 0 && (
                <div className="flex items-start gap-3 p-3 bg-red-500/10 rounded">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                  <div>
                    <div className="text-sm font-semibold text-red-400">Threat Detected</div>
                    <div className="text-xs text-slate-400">
                      {stats.threatDetection.activeThreats} active threats being monitored
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 p-3 bg-slate-700/50 rounded">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                <div>
                  <div className="text-sm font-semibold text-purple-400">Bloom Engine</div>
                  <div className="text-xs text-slate-400">
                    {stats?.bloomEngine.activeSeeds} seeds deployed across networks
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

