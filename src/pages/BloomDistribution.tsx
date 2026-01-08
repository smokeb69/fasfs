import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, TrendingUp, Activity, Target } from 'lucide-react';
import { trpc } from '@/hooks/useTrpc';
import { formatDate } from '@/lib/utils';

export function BloomDistribution() {
  const { data: seeds } = trpc.features.bloomSeed.getActiveSeeds.useQuery();
  const { data: stats } = trpc.features.bloomSeed.getSeedStats.useQuery();

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Bloom Distribution</h1>
          <p className="text-slate-400">Monitor and manage bloom seed deployments</p>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-400">{stats?.totalSeeds || 0}</CardTitle>
              <CardDescription className="text-slate-300">Total Seeds</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-2xl text-green-400">{stats?.activeSeeds || 0}</CardTitle>
              <CardDescription className="text-slate-300">Active Seeds</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-400">{stats?.deployedSeeds || 0}</CardTitle>
              <CardDescription className="text-slate-300">Deployed Seeds</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-2xl text-orange-400">{stats?.totalActivations || 0}</CardTitle>
              <CardDescription className="text-slate-300">Total Activations</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Active Seeds */}
        <Card className="bg-slate-800 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle>Active Bloom Seeds</CardTitle>
            <CardDescription className="text-slate-400">
              Currently active and deployed seeds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {seeds && seeds.length > 0 ? (
                seeds.map((seed: any) => (
                  <div key={seed.seedHash} className="p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Database className="w-5 h-5 text-blue-400" />
                          <h3 className="font-semibold">{seed.payloadType.toUpperCase()}</h3>
                          <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded-full text-xs border border-green-700">
                            {seed.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 font-mono mb-2">{seed.seedHash}</p>
                        <div className="flex gap-4 text-sm text-slate-300">
                          <span>Activations: {seed.activationCount}</span>
                          <span>Created: {formatDate(seed.timestamp)}</span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {seed.deploymentVectors.map((vector: string, idx: number) => (
                            <span key={idx} className="px-2 py-1 bg-slate-600 rounded text-xs">
                              {vector}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Target className="w-4 h-4 mr-2" />
                          Deploy
                        </Button>
                        <Button variant="outline" size="sm">
                          <Activity className="w-4 h-4 mr-2" />
                          Stats
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-400">
                  <Database className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No active bloom seeds</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Generate New Seed */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>Generate New Bloom Seed</CardTitle>
            <CardDescription className="text-slate-400">
              Create a new ethical bloom seed for deployment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button>Go to Generator</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
