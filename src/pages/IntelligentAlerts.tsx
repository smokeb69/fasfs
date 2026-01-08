import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, TrendingDown, Minus, Target } from 'lucide-react';
import { trpc } from '@/hooks/useTrpc';

export function IntelligentAlerts() {
  const { data: analysis } = trpc.features.intelligentAlerts.analyzeAlerts.useQuery();

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Intelligent Alerts</h1>
          <p className="text-slate-400">AI-powered alert analysis and recommendations</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-2xl">{analysis?.totalAlerts || 0}</CardTitle>
              <CardDescription className="text-slate-300">Total Alerts Analyzed</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-2xl">{analysis?.patterns?.length || 0}</CardTitle>
              <CardDescription className="text-slate-300">Patterns Detected</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-2xl">{analysis?.recommendations?.length || 0}</CardTitle>
              <CardDescription className="text-slate-300">Recommendations</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Detection Patterns
              </CardTitle>
              <CardDescription className="text-slate-400">
                AI-identified threat patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis?.patterns?.map((pattern: any, idx: number) => (
                  <div key={idx} className="p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{pattern.pattern}</span>
                      <div className="flex items-center gap-2">
                        {pattern.trend === 'up' ? (
                          <TrendingUp className="w-5 h-5 text-red-400" />
                        ) : pattern.trend === 'down' ? (
                          <TrendingDown className="w-5 h-5 text-green-400" />
                        ) : (
                          <Minus className="w-5 h-5 text-yellow-400" />
                        )}
                        <span className="text-2xl font-bold">{pattern.count}</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(pattern.count / (analysis?.totalAlerts || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Recommendations
              </CardTitle>
              <CardDescription className="text-slate-400">
                AI-generated action recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysis?.recommendations?.map((rec: string, idx: number) => (
                  <div key={idx} className="p-4 bg-slate-700/50 rounded-lg flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                    <p className="text-slate-300">{rec}</p>
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
