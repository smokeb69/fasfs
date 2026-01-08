import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Shield, Eye, Activity } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function TeamOperations() {
  const [mode, setMode] = useState<'red' | 'blue' | 'gray'>('blue');

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Team Operations</h1>
            <p className="text-slate-400">Red, Blue, and Gray team coordination</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={mode === 'red' ? 'default' : 'outline'}
              onClick={() => setMode('red')}
            >
              <Shield className="w-4 h-4 mr-2" />
              Red Team
            </Button>
            <Button
              variant={mode === 'blue' ? 'default' : 'outline'}
              onClick={() => setMode('blue')}
            >
              <Users className="w-4 h-4 mr-2" />
              Blue Team
            </Button>
            <Button
              variant={mode === 'gray' ? 'default' : 'outline'}
              onClick={() => setMode('gray')}
            >
              <Eye className="w-4 h-4 mr-2" />
              Gray Team
            </Button>
          </div>
        </div>

        <Tabs defaultValue="testing" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="testing">Testing</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="coordination">Coordination</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="testing">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  {mode === 'red' ? 'Red Team' : mode === 'blue' ? 'Blue Team' : 'Gray Team'} Testing Interface
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <h3 className="font-semibold mb-2">Active Operations</h3>
                  <p className="text-slate-400 text-sm">
                    {mode === 'red' && 'Red team penetration testing and security assessments'}
                    {mode === 'blue' && 'Blue team defensive operations and incident response'}
                    {mode === 'gray' && 'Gray team monitoring and analysis'}
                  </p>
                </div>
                <Button>Start New Operation</Button>
                <Button variant="outline">View Logs</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Monitoring Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <p className="text-sm text-slate-400 mb-1">Active Operations</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <p className="text-sm text-slate-400 mb-1">Team Members</p>
                    <p className="text-2xl font-bold">45</p>
                  </div>
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <p className="text-sm text-slate-400 mb-1">Success Rate</p>
                    <p className="text-2xl font-bold text-green-400">94%</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="p-3 bg-slate-700/50 rounded-lg">
                    <p className="font-medium">Operation #1234 - Deepfake Detection Test</p>
                    <p className="text-sm text-slate-400">Started 2 hours ago</p>
                  </div>
                  <div className="p-3 bg-slate-700/50 rounded-lg">
                    <p className="font-medium">Operation #1235 - Network Penetration Test</p>
                    <p className="text-sm text-slate-400">Started 5 hours ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="coordination">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>Team Coordination</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <h3 className="font-semibold mb-2">Communication Channels</h3>
                  <p className="text-slate-400 text-sm">Real-time coordination tools</p>
                </div>
                <Button>Join Channel</Button>
                <Button variant="outline">View Messages</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <p className="text-sm text-slate-400 mb-1">Total Operations</p>
                    <p className="text-2xl font-bold">234</p>
                  </div>
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <p className="text-sm text-slate-400 mb-1">Avg Response Time</p>
                    <p className="text-2xl font-bold">2.3 min</p>
                  </div>
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <p className="text-sm text-slate-400 mb-1">Resolved Issues</p>
                    <p className="text-2xl font-bold text-green-400">189</p>
                  </div>
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <p className="text-sm text-slate-400 mb-1">Pending Issues</p>
                    <p className="text-2xl font-bold text-yellow-400">45</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
