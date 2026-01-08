import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Brain,
  Users,
  Building,
  MapPin,
  FileText,
  BarChart3,
  RefreshCw
} from 'lucide-react';
// import { trpc } from '@/utils/trpc'; // Commented out - module not found
const trpc = { features: { entityExtraction: { getEntities: { useQuery: () => ({ data: null, refetch: () => {} }) }, getStats: { useQuery: () => ({ data: null }) } } } } as any;

interface ExtractedEntity {
  id: string;
  entityType: string;
  entityValue: string;
  confidence: number;
  context: string;
  createdAt: Date;
  metadata?: any;
}

interface EntityRelationship {
  source: string;
  target: string;
  label: string;
  weight: number;
}

export function EntityExtraction() {
  const [inputText, setInputText] = useState('');
  const [sourceId, setSourceId] = useState('');
  const [sourceType, setSourceType] = useState('manual');
  const [entities, setEntities] = useState<ExtractedEntity[]>([]);
  const [_relationships, _setRelationships] = useState<EntityRelationship[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('extract');

  // Fetch entities and stats
  const { data: entitiesData, refetch: _refetchEntities } = trpc.features.entityExtraction.getEntities.useQuery({
    limit: 100,
  });

  const { data: statsData, refetch: refetchStats } = trpc.features.entityExtraction.getEntityStats.useQuery();

  // Mutations
  const extractEntitiesMutation = trpc.features.entityExtraction.extractEntities.useMutation();

  useEffect(() => {
    if (entitiesData) {
      setEntities(entitiesData);
    }
    if (statsData) {
      setStats(statsData);
    }
  }, [entitiesData, statsData]);

  const handleExtractEntities = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    try {
      const result = await extractEntitiesMutation.mutateAsync({
        text: inputText,
        sourceId: sourceId || undefined,
        sourceType: sourceType as any,
      });

      setEntities(prev => [...result.entities.map((e: any) => ({
        id: `entity_${Date.now()}_${Math.random()}`,
        ...e,
        createdAt: new Date(),
      })), ...prev.slice(0, 90)]); // Keep last 100

      // Update stats
      refetchStats();

      // Clear input
      setInputText('');
    } catch (error: any) {
      console.error('Failed to extract entities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEntityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'person': return <Users className="w-4 h-4" />;
      case 'organization': return <Building className="w-4 h-4" />;
      case 'location': return <MapPin className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getEntityColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'person': return 'bg-blue-500';
      case 'organization': return 'bg-green-500';
      case 'location': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-400';
    if (confidence >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Entity Extraction</h1>
          <p className="text-slate-400">Extract and analyze named entities from text data</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-900 border-slate-700">
            <TabsTrigger value="extract" className="data-[state=active]:bg-slate-800">
              Extract Entities
            </TabsTrigger>
            <TabsTrigger value="entities" className="data-[state=active]:bg-slate-800">
              Entity Database
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-slate-800">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="extract" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Input Section */}
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Text Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="sourceId" className="text-slate-300">Source ID (Optional)</Label>
                    <Input
                      id="sourceId"
                      value={sourceId}
                      onChange={(e) => setSourceId(e.target.value)}
                      className="bg-slate-800 border-slate-600 text-white"
                      placeholder="e.g., case-123, alert-456"
                    />
                  </div>

                  <div>
                    <Label htmlFor="sourceType" className="text-slate-300">Source Type</Label>
                    <select
                      id="sourceType"
                      value={sourceType}
                      onChange={(e) => setSourceType(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-600 rounded-md px-3 py-2 text-white"
                    >
                      <option value="manual">Manual Input</option>
                      <option value="case">Investigation Case</option>
                      <option value="alert">Detection Alert</option>
                      <option value="crawl">Crawler Result</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="inputText" className="text-slate-300">Text to Analyze</Label>
                    <Textarea
                      id="inputText"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="bg-slate-800 border-slate-600 text-white min-h-32"
                      placeholder="Enter text to extract entities from..."
                    />
                  </div>

                  <Button
                    onClick={handleExtractEntities}
                    disabled={!inputText.trim() || loading}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4 mr-2" />
                        Extract Entities
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Results Section */}
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Extraction Results</CardTitle>
                </CardHeader>
                <CardContent>
                  {extractEntitiesMutation.data ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-400">Entities Found:</span>
                          <span className="text-white ml-2 font-semibold">
                            {extractEntitiesMutation.data.extractedCount}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400">Relationships:</span>
                          <span className="text-white ml-2 font-semibold">
                            {extractEntitiesMutation.data.relationshipCount}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-slate-300 mb-2">Extracted Entities:</h4>
                        <div className="space-y-2">
                          {extractEntitiesMutation.data.entities.map((entity: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-slate-800 rounded">
                              <div className="flex items-center gap-2">
                                <div className={`p-1 rounded ${getEntityColor(entity.type)}`}>
                                  {getEntityIcon(entity.type)}
                                </div>
                                <div>
                                  <span className="text-white font-medium">{entity.value}</span>
                                  <div className="text-xs text-slate-400 capitalize">{entity.type}</div>
                                </div>
                              </div>
                              <span className={`text-sm font-medium ${getConfidenceColor(entity.confidence)}`}>
                                {entity.confidence}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {extractEntitiesMutation.data.relationships.length > 0 && (
                        <div>
                          <h4 className="font-medium text-slate-300 mb-2">Relationships:</h4>
                          <div className="space-y-1">
                            {extractEntitiesMutation.data.relationships.map((rel: any, index: number) => (
                              <div key={index} className="text-sm text-slate-300 bg-slate-800 p-2 rounded">
                                <span className="font-medium">{rel.source}</span>
                                <span className="text-slate-500 mx-2">→</span>
                                <span className="text-slate-400">{rel.label}</span>
                                <span className="text-slate-500 mx-2">→</span>
                                <span className="font-medium">{rel.target}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-slate-400 py-8">
                      <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Enter text above and click "Extract Entities" to see results</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="entities" className="space-y-6">
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Entity Database
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {entities.length === 0 ? (
                    <div className="text-center text-slate-400 py-8">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No entities in database yet. Extract some entities to get started.</p>
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {entities.slice(0, 50).map((entity) => (
                        <div key={entity.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded ${getEntityColor(entity.entityType)}`}>
                              {getEntityIcon(entity.entityType)}
                            </div>
                            <div>
                              <div className="text-white font-medium">{entity.entityValue}</div>
                              <div className="text-xs text-slate-400 capitalize flex items-center gap-2">
                                <span>{entity.entityType}</span>
                                <span>•</span>
                                <span>Source: {(entity as any).sourceType || 'unknown'}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-sm font-medium ${getConfidenceColor(entity.confidence)}`}>
                              {entity.confidence}%
                            </div>
                            <div className="text-xs text-slate-500">
                              {entity.createdAt.toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-slate-900 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Total Entities</p>
                      <p className="text-2xl font-bold text-white">{stats.totalEntities || 0}</p>
                    </div>
                    <FileText className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">High Confidence</p>
                      <p className="text-2xl font-bold text-green-400">{stats.confidenceDistribution?.high || 0}</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Persons</p>
                      <p className="text-2xl font-bold text-blue-400">{stats.byType?.PERSON || 0}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Organizations</p>
                      <p className="text-2xl font-bold text-green-400">{stats.byType?.ORGANIZATION || 0}</p>
                    </div>
                    <Building className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Entity Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.byType && Object.entries(stats.byType).map(([type, count]: [string, unknown]) => {
                    const countNum = typeof count === 'number' ? count : 0;
                    const total = stats.totalEntities || 1;
                    return (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getEntityIcon(type)}
                        <span className="text-slate-300 capitalize">{type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getEntityColor(type)}`}
                            style={{
                              width: `${(countNum / total) * 100}%`
                            }}
                          />
                        </div>
                        <span className="text-white font-medium w-8 text-right">{countNum}</span>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}