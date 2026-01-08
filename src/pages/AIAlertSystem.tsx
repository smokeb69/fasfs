import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Brain, Plus, Target, Activity } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function AIAlertSystem() {
  const [ruleName, setRuleName] = useState('');
  const [keywords, setKeywords] = useState('');
  const [ruleType, setRuleType] = useState('keyword');

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">AI Alert System</h1>
          <p className="text-slate-400">Configure intelligent alert rules and patterns</p>
        </div>

        <Tabs defaultValue="rules" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="rules">Alert Rules</TabsTrigger>
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
            <TabsTrigger value="testing">Rule Testing</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="rules">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Alert Rules
                  </CardTitle>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Rule
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Deepfake Detection Rule</h3>
                      <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded-full text-xs border border-green-700">
                        Active
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mb-2">Triggers on deepfake pattern detection</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Test</Button>
                      <Button variant="destructive" size="sm">Delete</Button>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">CSAM Content Rule</h3>
                      <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded-full text-xs border border-green-700">
                        Active
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mb-2">Detects child safety violations</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Test</Button>
                      <Button variant="destructive" size="sm">Delete</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="keywords">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>Keyword Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Add Keywords</label>
                  <Input
                    placeholder="Enter keywords separated by commas"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <Button>Add Keywords</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="testing">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>Rule Testing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Test Sample</label>
                  <textarea
                    placeholder="Enter sample text or data to test rules..."
                    className="w-full h-32 p-3 bg-slate-700 border border-slate-600 rounded-md text-white"
                  />
                </div>
                <Button>
                  <Target className="w-4 h-4 mr-2" />
                  Run Test
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Rule Effectiveness Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <p className="text-sm text-slate-400 mb-1">Total Rules</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <p className="text-sm text-slate-400 mb-1">Active Rules</p>
                    <p className="text-2xl font-bold text-green-400">10</p>
                  </div>
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <p className="text-sm text-slate-400 mb-1">Alerts Triggered</p>
                    <p className="text-2xl font-bold text-blue-400">1,234</p>
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
