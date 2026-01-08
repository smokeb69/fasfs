import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Network, Download, Settings, Search } from 'lucide-react';
import { trpc } from '@/hooks/useTrpc';

export function RelationshipGraph() {
  const { data: graphData } = trpc.features.entityExtraction.getRelationships.useQuery();

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Relationship Graph</h1>
            <p className="text-slate-400">Visualize connections and relationships between entities</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-2xl">{graphData?.nodes?.length || 0}</CardTitle>
              <CardDescription className="text-slate-300">Nodes</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-2xl">{graphData?.edges?.length || 0}</CardTitle>
              <CardDescription className="text-slate-300">Edges</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-2xl">3</CardTitle>
              <CardDescription className="text-slate-300">Communities</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-2xl">42%</CardTitle>
              <CardDescription className="text-slate-300">Connectivity</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="bg-slate-800 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="w-5 h-5" />
              Graph Visualization
            </CardTitle>
            <CardDescription className="text-slate-400">
              Interactive relationship network
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96 bg-slate-700 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Network className="w-16 h-16 mx-auto mb-4 opacity-50 text-slate-400" />
                <p className="text-slate-400">Graph visualization would appear here</p>
                <p className="text-slate-500 text-sm mt-2">
                  {graphData?.nodes?.length || 0} nodes, {graphData?.edges?.length || 0} edges
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle>Nodes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {graphData?.nodes?.map((node: any) => (
                  <div key={node.id} className="p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{node.label}</span>
                      <span className="px-2 py-1 bg-blue-900/30 text-blue-400 rounded text-xs">
                        {node.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle>Edges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {graphData?.edges?.map((edge: any, idx: number) => (
                  <div key={idx} className="p-3 bg-slate-700/50 rounded-lg flex items-center gap-2">
                    <span className="font-medium">{edge.source}</span>
                    <Network className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-400 text-sm">{edge.label}</span>
                    <Network className="w-4 h-4 text-slate-400" />
                    <span className="font-medium">{edge.target}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
