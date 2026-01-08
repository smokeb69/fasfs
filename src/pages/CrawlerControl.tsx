import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Play, Square, RefreshCw, Activity } from 'lucide-react';
import { trpc } from '@/hooks/useTrpc';
import toast from 'react-hot-toast';

export function CrawlerControl() {
  const [selectedType, setSelectedType] = useState<'surface' | 'darkweb' | 'social'>('surface');
  const { data: status, refetch } = trpc.features.crawlerControl.getStatus.useQuery();
  
  const startMutation = trpc.features.crawlerControl.startCrawler.useMutation({
    onSuccess: () => {
      toast.success('Crawler started');
      refetch();
    },
  });

  const stopMutation = trpc.features.crawlerControl.stopCrawler.useMutation({
    onSuccess: () => {
      toast.success('Crawler stopped');
      refetch();
    },
  });

  const handleStart = () => {
    startMutation.mutate({
      crawlerType: selectedType,
      targetScope: 'global',
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Crawler Control</h1>
          <p className="text-slate-400">Manage web crawler operations</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <Bot className="w-8 h-8 text-blue-400 mb-2" />
              <CardTitle className="text-2xl">{status?.crawlersActive || 0}</CardTitle>
              <CardDescription className="text-slate-300">Active Crawlers</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <Activity className="w-8 h-8 text-green-400 mb-2" />
              <CardTitle className="text-2xl">{status?.itemsProcessed?.toLocaleString() || 0}</CardTitle>
              <CardDescription className="text-slate-300">Items Processed</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <RefreshCw className="w-8 h-8 text-purple-400 mb-2" />
              <CardTitle className="text-2xl">{(status?.successRate || 0) * 100}%</CardTitle>
              <CardDescription className="text-slate-300">Success Rate</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle>Start Crawler</CardTitle>
              <CardDescription className="text-slate-400">
                Configure and start a new crawler instance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Crawler Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as any)}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                >
                  <option value="surface">Surface Web</option>
                  <option value="darkweb">Dark Web</option>
                  <option value="social">Social Media</option>
                </select>
              </div>
              <Button onClick={handleStart} className="w-full" disabled={startMutation.isLoading}>
                <Play className="w-4 h-4 mr-2" />
                Start Crawler
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle>Crawler Status</CardTitle>
              <CardDescription className="text-slate-400">
                Current crawler operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div>
                    <p className="font-semibold">Status</p>
                    <p className="text-sm text-slate-400">{status?.status || 'unknown'}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    status?.status === 'running' ? 'bg-green-900/30 text-green-400 border border-green-700' :
                    'bg-red-900/30 text-red-400 border border-red-700'
                  }`}>
                    {status?.status || 'Stopped'}
                  </span>
                </div>
                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <p className="text-sm text-slate-400">Last Update</p>
                  <p className="font-semibold">
                    {status?.lastUpdate ? new Date(status.lastUpdate).toLocaleString() : 'Never'}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => stopMutation.mutate({ crawlerId: 'current' })}
                  disabled={status?.status !== 'running'}
                >
                  <Square className="w-4 h-4 mr-2" />
                  Stop Crawler
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
