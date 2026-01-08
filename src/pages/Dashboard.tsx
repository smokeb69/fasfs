import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle, CheckCircle2, XCircle, TrendingUp, Activity, Shield } from 'lucide-react';
import { trpc } from '@/hooks/useTrpc';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface LiveThreatData {
  latestThreats: any[];
  totalThreatsDetected: number;
  threatIntelligence: {
    activeThreats: number;
    criticalThreats: number;
    topIndicators: string[];
    riskScore: number;
  };
  lastUpdate: string;
  activeMonitoring: boolean;
}

export function Dashboard() {
  const [refreshing, setRefreshing] = useState(false);
  const [liveThreats, setLiveThreats] = useState<LiveThreatData | null>(null);
  const [threatHistory, setThreatHistory] = useState<any[]>([]);

  const { data: stats, refetch } = trpc.dashboard.getStats.useQuery();

  // Fetch live threat data
  const fetchLiveThreats = async () => {
    try {
      const response = await fetch('/api/threats/live');
      const data = await response.json();
      if (data.success) {
        setLiveThreats(data.data);

        // Add to history for trend visualization
        setThreatHistory(prev => {
          const newEntry = {
            time: new Date().toLocaleTimeString(),
            threats: data.data.totalThreatsDetected,
            critical: data.data.threatIntelligence.criticalThreats,
            riskScore: data.data.threatIntelligence.riskScore
          };
          return [...prev.slice(-9), newEntry]; // Keep last 10 entries
        });
      }
    } catch (error) {
      console.error('Failed to fetch live threats:', error);
    }
  };

  // Auto-refresh live threats every 10 seconds
  useEffect(() => {
    fetchLiveThreats();
    const interval = setInterval(fetchLiveThreats, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const riskData = stats ? [
    { name: 'Green', value: stats.riskDistribution.green, color: '#22c55e' },
    { name: 'Orange', value: stats.riskDistribution.orange, color: '#f97316' },
    { name: 'Red', value: stats.riskDistribution.red, color: '#ef4444' },
  ] : [];

  const weeklyTrend = [
    { day: 'Mon', threats: 45 },
    { day: 'Tue', threats: 52 },
    { day: 'Wed', threats: 48 },
    { day: 'Thu', threats: 61 },
    { day: 'Fri', threats: 55 },
    { day: 'Sat', threats: 49 },
    { day: 'Sun', threats: 43 },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-slate-400">Real-time threat monitoring and statistics</p>
          </div>
          <Button onClick={handleRefresh} disabled={refreshing} variant="outline">
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-3xl text-blue-400">
                {liveThreats?.totalThreatsDetected.toLocaleString() || '0'}
              </CardTitle>
              <CardDescription className="text-slate-300">Live Threats Detected</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-3xl text-red-400">
                {liveThreats?.threatIntelligence.activeThreats.toLocaleString() || '0'}
              </CardTitle>
              <CardDescription className="text-slate-300">Active Threats</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-3xl text-orange-400">
                {liveThreats?.threatIntelligence.criticalThreats.toLocaleString() || '0'}
              </CardTitle>
              <CardDescription className="text-slate-300">Critical Threats</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Activity className={`w-5 h-5 ${liveThreats?.activeMonitoring ? 'text-green-400' : 'text-red-400'}`} />
                <CardTitle className={`text-3xl ${liveThreats?.threatIntelligence.riskScore > 70 ? 'text-red-400' : liveThreats?.threatIntelligence.riskScore > 40 ? 'text-orange-400' : 'text-green-400'}`}>
                  {liveThreats?.threatIntelligence.riskScore.toFixed(1) || '0.0'}
                </CardTitle>
              </div>
              <CardDescription className="text-slate-300">Risk Score</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Live Threat Monitoring Status */}
        {liveThreats && (
          <Card className="bg-slate-800 border-slate-700 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                Live Threat Monitoring Active
              </CardTitle>
              <CardDescription className="text-slate-400">
                Advanced threat detection running every 15 seconds
                <span className="ml-2 text-xs text-green-400">
                  Last update: {new Date(liveThreats.lastUpdate).toLocaleTimeString()}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-3 h-3 rounded-full mx-auto mb-2 bg-green-400 animate-pulse" />
                  <p className="text-sm text-slate-400">Pattern Detection</p>
                  <p className="text-sm font-medium text-green-400">Active</p>
                </div>
                <div className="text-center">
                  <div className="w-3 h-3 rounded-full mx-auto mb-2 bg-blue-400 animate-pulse" />
                  <p className="text-sm text-slate-400">Anomaly Analysis</p>
                  <p className="text-sm font-medium text-blue-400">Active</p>
                </div>
                <div className="text-center">
                  <div className="w-3 h-3 rounded-full mx-auto mb-2 bg-purple-400 animate-pulse" />
                  <p className="text-sm text-slate-400">Behavioral Monitoring</p>
                  <p className="text-sm font-medium text-purple-400">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle>Risk Distribution</CardTitle>
              <CardDescription className="text-slate-400">Threat level breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {riskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle>Weekly Trend</CardTitle>
              <CardDescription className="text-slate-400">Threat patterns over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                  <Bar dataKey="threats" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Threat Trend Chart */}
        {threatHistory.length > 0 && (
          <Card className="bg-slate-800 border-slate-700 mb-6">
            <CardHeader>
              <CardTitle>Live Threat Trends</CardTitle>
              <CardDescription className="text-slate-400">
                Real-time threat detection patterns over the last 10 monitoring cycles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={threatHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="threats"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Total Threats"
                  />
                  <Line
                    type="monotone"
                    dataKey="critical"
                    stroke="#ef4444"
                    strokeWidth={2}
                    name="Critical Threats"
                  />
                  <Line
                    type="monotone"
                    dataKey="riskScore"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    name="Risk Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Live Threat Alerts */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>Live Threat Alerts</CardTitle>
            <CardDescription className="text-slate-400">
              Real-time threat detections from advanced monitoring system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {liveThreats?.latestThreats && liveThreats.latestThreats.length > 0 ? (
                liveThreats.latestThreats.slice(0, 5).map((threat: any, i: number) => (
                  <div key={threat.threatId || i} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <AlertTriangle className={`w-5 h-5 ${
                        threat.severity === 'critical' ? 'text-red-400' :
                        threat.severity === 'high' ? 'text-orange-400' :
                        'text-yellow-400'
                      }`} />
                      <div>
                        <p className="font-medium">{threat.threatName}</p>
                        <p className="text-sm text-slate-400">
                          {threat.indicators?.join(', ') || 'Multiple indicators'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        threat.severity === 'critical' ? 'bg-red-900/30 text-red-400 border border-red-700' :
                        threat.severity === 'high' ? 'bg-orange-900/30 text-orange-400 border border-orange-700' :
                        'bg-yellow-900/30 text-yellow-400 border border-yellow-700'
                      }`}>
                        {threat.severity} ({(threat.confidence * 100).toFixed(0)}%)
                      </span>
                      <Button variant="ghost" size="sm">Details</Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 mx-auto mb-4 opacity-50 text-slate-400" />
                  <p className="text-slate-400">No threats detected yet. Monitoring active...</p>
                  <p className="text-xs text-slate-500 mt-2">
                    Advanced threat detection scans every 15 seconds
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
