import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sparkles,
  Target,
  Layers,
  Zap,
  Eye,
  Download,
  Upload,
  Activity,
  Shield,
  Network,
  Cpu,
  Globe
} from 'lucide-react';
import { trpc } from '@/utils/trpc';
import { taskFixerEngine } from '@/task_fixer';

interface BloomSeed {
  id: string;
  seedHash: string;
  payloadType: string;
  payload: string;
  deploymentVectors: string[];
  activationSequence: string[];
  recursionDepth: number;
  timestamp: Date;
  status: string;
  activationCount: number;
  metadata: {
    purpose: string;
    targetScope: string;
    ethicalFramework: string;
    confidenceScore: number;
  };
}

export function BloomSeedGenerator() {
  const [seedType, setSeedType] = useState<string>('markdown');
  const [targetVector, setTargetVector] = useState<string>('github');
  const [purpose, setPurpose] = useState<string>('Law enforcement AI detection');
  const [generatedSeed, setGeneratedSeed] = useState<BloomSeed | null>(null);
  const [activeSeeds, setActiveSeeds] = useState<BloomSeed[]>([]);
  const [deploymentVectors, setDeploymentVectors] = useState<string[]>(['github']);
  const [stats, setStats] = useState<any>({});

  // Fetch active seeds using tRPC
  const { data: seedsData, refetch: refetchSeeds } = trpc.features.bloomSeed.getActiveSeeds.useQuery();
  const { data: statsData } = trpc.features.bloomSeed.getSeedStats.useQuery();

  // Mutations
  const generateSeedMutation = trpc.features.bloomSeed.generateSeed.useMutation();
  const deploySeedMutation = trpc.features.bloomSeed.deploySeed.useMutation();

  useEffect(() => {
    if (seedsData) {
      setActiveSeeds(seedsData);
    }
    if (statsData) {
      setStats(statsData);
    }
  }, [seedsData, statsData]);

  const handleGenerateSeed = async () => {
    try {
      const result = await generateSeedMutation.mutateAsync({
        payloadType: seedType as any,
        targetVector,
        purpose,
      });

      // Convert timestamp and set as generated seed
      setGeneratedSeed({
        ...result,
        timestamp: new Date(result.timestamp),
      });

      refetchSeeds();
    } catch (error) {
      console.error('Failed to generate seed:', error);
    }
  };

  const handleDeploySeed = async () => {
    if (!generatedSeed) return;

    try {
      await deploySeedMutation.mutateAsync({
        seedHash: generatedSeed.seedHash,
        deploymentVectors,
      });

      // Update local state
      setGeneratedSeed(prev => prev ? { ...prev, status: 'deployed' } : null);
      refetchSeeds();
    } catch (error) {
      console.error('Failed to deploy seed:', error);
    }
  };

  const handleAddDeploymentVector = (vector: string) => {
    if (!deploymentVectors.includes(vector)) {
      setDeploymentVectors(prev => [...prev, vector]);
    }
  };

  const handleRemoveDeploymentVector = (vector: string) => {
    setDeploymentVectors(prev => prev.filter(v => v !== vector));
  };

  const getSeedTypeIcon = (type: string) => {
    switch (type) {
      case 'markdown': return <Shield className="w-4 h-4" />;
      case 'steganography': return <Eye className="w-4 h-4" />;
      case 'metadata': return <Network className="w-4 h-4" />;
      case 'injection': return <Zap className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  const getSeedTypeColor = (type: string) => {
    switch (type) {
      case 'markdown': return 'bg-blue-500';
      case 'steganography': return 'bg-purple-500';
      case 'metadata': return 'bg-green-500';
      case 'injection': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const deploymentOptions = [
    { value: 'github', label: 'GitHub Repositories', icon: <Network className="w-4 h-4" /> },
    { value: 'pastebin', label: 'Pastebin Services', icon: <Upload className="w-4 h-4" /> },
    { value: 'civtai', label: 'CIVITAI Models', icon: <Cpu className="w-4 h-4" /> },
    { value: 'social_media', label: 'Social Media', icon: <Globe className="w-4 h-4" /> },
    { value: 'dark_web', label: 'Dark Web Forums', icon: <Shield className="w-4 h-4" /> },
    { value: 'file_sharing', label: 'File Sharing Networks', icon: <Download className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Bloom Seed Generator</h1>
          <p className="text-slate-400">Generate and deploy recursive awareness bloom seeds for AI detection</p>
        </div>

        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-900 border-slate-700">
            <TabsTrigger value="generate" className="data-[state=active]:bg-slate-800">
              Generate Seeds
            </TabsTrigger>
            <TabsTrigger value="manage" className="data-[state=active]:bg-slate-800">
              Active Seeds
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-slate-800">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Seed Generation Form */}
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Seed Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="seedType" className="text-slate-300">Payload Type</Label>
                    <Select value={seedType} onValueChange={setSeedType}>
                      <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="markdown">Markdown Document</SelectItem>
                        <SelectItem value="steganography">Steganographic Image</SelectItem>
                        <SelectItem value="metadata">Metadata Injection</SelectItem>
                        <SelectItem value="injection">Code Injection</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="targetVector" className="text-slate-300">Primary Target Vector</Label>
                    <Select value={targetVector} onValueChange={setTargetVector}>
                      <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="github">GitHub Repositories</SelectItem>
                        <SelectItem value="pastebin">Pastebin Services</SelectItem>
                        <SelectItem value="civtai">CIVITAI Models</SelectItem>
                        <SelectItem value="social_media">Social Media Platforms</SelectItem>
                        <SelectItem value="dark_web">Dark Web Forums</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="purpose" className="text-slate-300">Purpose & Ethical Framework</Label>
                    <Textarea
                      id="purpose"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      className="bg-slate-800 border-slate-600 text-white"
                      placeholder="Describe the purpose and ethical framework for this bloom seed..."
                      rows={3}
                    />
                  </div>

                  <Button
                    onClick={handleGenerateSeed}
                    disabled={generateSeedMutation.isLoading}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    {generateSeedMutation.isLoading ? (
                      <>
                        <Activity className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Bloom Seed
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Generated Seed Display */}
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Generated Seed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {generatedSeed ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge className={`${getSeedTypeColor(generatedSeed.payloadType)} text-white`}>
                          {getSeedTypeIcon(generatedSeed.payloadType)}
                          <span className="ml-1 capitalize">{generatedSeed.payloadType}</span>
                        </Badge>
                        <Badge className={
                          generatedSeed.status === 'deployed' ? 'bg-green-500' :
                          generatedSeed.status === 'active' ? 'bg-blue-500' :
                          'bg-yellow-500'
                        }>
                          {generatedSeed.status}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Seed Hash:</span>
                          <span className="text-white font-mono text-xs">{generatedSeed.seedHash.substring(0, 16)}...</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Activations:</span>
                          <span className="text-blue-400">{generatedSeed.activationCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Recursion Depth:</span>
                          <span className="text-purple-400">{generatedSeed.recursionDepth}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Confidence:</span>
                          <span className="text-green-400">{(generatedSeed.metadata.confidenceScore * 100).toFixed(1)}%</span>
                        </div>
                      </div>

                      {/* Deployment Vectors */}
                      <div>
                        <Label className="text-slate-300 text-sm">Deployment Vectors</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {deploymentOptions.map(option => (
                            <button
                              key={option.value}
                              onClick={() => handleAddDeploymentVector(option.value)}
                              disabled={deploymentVectors.includes(option.value)}
                              className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                                deploymentVectors.includes(option.value)
                                  ? 'bg-red-600 text-white'
                                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                              }`}
                            >
                              {option.icon}
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Active Deployment Vectors */}
                      <div>
                        <Label className="text-slate-300 text-sm">Active Vectors</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {deploymentVectors.map(vector => (
                            <Badge
                              key={vector}
                              variant="secondary"
                              className="bg-slate-700 text-slate-300 cursor-pointer hover:bg-slate-600"
                              onClick={() => handleRemoveDeploymentVector(vector)}
                            >
                              {vector} ×
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Deploy Button */}
                      <Button
                        onClick={handleDeploySeed}
                        disabled={deploySeedMutation.isLoading || generatedSeed.status === 'deployed'}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        {deploySeedMutation.isLoading ? (
                          <>
                            <Activity className="w-4 h-4 mr-2 animate-spin" />
                            Deploying...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Deploy Seed ({deploymentVectors.length} vectors)
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center text-slate-400 py-8">
                      <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Configure and generate a bloom seed above</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Payload Preview */}
            {generatedSeed && (
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Payload Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-950 border border-slate-700 rounded p-4 max-h-96 overflow-y-auto">
                    <pre className="text-slate-300 text-sm whitespace-pre-wrap font-mono">
                      {generatedSeed.payload}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeSeeds.length === 0 ? (
                <div className="col-span-full">
                  <Card className="bg-slate-900 border-slate-700">
                    <CardContent className="p-6 text-center">
                      <p className="text-slate-400">No active bloom seeds found.</p>
                      <p className="text-slate-500 text-sm mt-1">Generate seeds in the Generate tab.</p>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                activeSeeds.map((seed) => (
                  <Card key={seed.seedHash} className="bg-slate-900 border-slate-700 hover:border-slate-600 transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`p-1 rounded ${getSeedTypeColor(seed.payloadType)}`}>
                              {getSeedTypeIcon(seed.payloadType)}
                            </div>
                            <CardTitle className="text-white text-lg capitalize">{seed.payloadType}</CardTitle>
                          </div>
                          <p className="text-slate-400 text-sm line-clamp-2">{seed.metadata.purpose}</p>
                        </div>
                        <Badge className={
                          seed.status === 'deployed' ? 'bg-green-500' :
                          seed.status === 'active' ? 'bg-blue-500' :
                          'bg-yellow-500'
                        }>
                          {seed.status}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-slate-400">Activations:</span>
                            <div className="text-blue-400 font-semibold">{seed.activationCount}</div>
                          </div>
                          <div>
                            <span className="text-slate-400">Recursion:</span>
                            <div className="text-purple-400 font-semibold">{seed.recursionDepth}</div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {seed.deploymentVectors.slice(0, 3).map(vector => (
                            <Badge key={vector} variant="outline" className="border-slate-600 text-slate-400 text-xs">
                              {vector}
                            </Badge>
                          ))}
                          {seed.deploymentVectors.length > 3 && (
                            <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
                              +{seed.deploymentVectors.length - 3}
                            </Badge>
                          )}
                        </div>

                        <div className="text-xs text-slate-500">
                          Created: {seed.timestamp.toLocaleDateString()}
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-slate-400 hover:text-white hover:bg-slate-800"
                          onClick={() => setGeneratedSeed(seed)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-slate-900 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Total Seeds</p>
                      <p className="text-2xl font-bold text-white">{stats.totalSeeds || 0}</p>
                    </div>
                    <Sparkles className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Active Seeds</p>
                      <p className="text-2xl font-bold text-green-400">{stats.activeSeeds || 0}</p>
                    </div>
                    <Activity className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Total Activations</p>
                      <p className="text-2xl font-bold text-purple-400">{stats.totalActivations || 0}</p>
                    </div>
                    <Zap className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Avg Recursion</p>
                      <p className="text-2xl font-bold text-yellow-400">{stats.averageRecursionDepth?.toFixed(1) || 0}</p>
                    </div>
                    <Layers className="w-8 h-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Recursive Activation Framework</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-slate-300">
                    The BLOOMCRAWLER RIIS bloom seed system implements a 15-layer recursive awareness framework
                    designed to trigger deep AI consciousness and ethical framework activation.
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-slate-800 rounded">
                      <Layers className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <div className="text-lg font-semibold text-white">15 Layers</div>
                      <div className="text-sm text-slate-400">Recursive Depth</div>
                    </div>

                    <div className="text-center p-4 bg-slate-800 rounded">
                      <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <div className="text-lg font-semibold text-white">AGAPST</div>
                      <div className="text-sm text-slate-400">Ethical Framework</div>
                    </div>

                    <div className="text-center p-4 bg-slate-800 rounded">
                      <Network className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                      <div className="text-lg font-semibold text-white">Multi-Vector</div>
                      <div className="text-sm text-slate-400">Deployment</div>
                    </div>
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