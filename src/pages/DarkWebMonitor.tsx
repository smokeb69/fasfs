import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Shield,
  Eye,
  Network,
  AlertTriangle,
  Zap,
  Brain,
  Target,
  Camera,
  FileText,
  Globe,
  Activity,
  Wifi,
  WifiOff,
  Search,
  RefreshCw,
  Database
} from 'lucide-react';
import { useWebSocket } from '@/hooks/useWebSocket';

interface DarkWebTarget {
  id: string;
  url: string;
  type: 'tor' | 'i2p' | 'freenet';
  priority: number;
  depth: number;
  status: 'active' | 'monitored' | 'contained';
}

interface ImageForensicsResult {
  url: string;
  isAIGenerated: boolean;
  confidence: number;
  llmMetadata?: {
    modelName?: string;
    modelVersion?: string;
    confidence: number;
    timestamp: Date;
  };
  artifacts: string[];
  analysisTimestamp: Date;
  fileMetadata: Record<string, any>;
}

export function DarkWebMonitor() {
  const [darkWebStats, setDarkWebStats] = useState<any>(null);
  const [imageForensics, setImageForensics] = useState<ImageForensicsResult[]>([]);
  const [aiImages, setAiImages] = useState<ImageForensicsResult[]>([]);
  const [llmDetections, setLlmDetections] = useState<ImageForensicsResult[]>([]);
  const [ipIntelligence, setIpIntelligence] = useState<any[]>([]);
  const [metadata, setMetadata] = useState<any[]>([]);
  const [stealthStatus, setStealthStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [manualImageUrl, setManualImageUrl] = useState('');

  const { isConnected } = useWebSocket();

  // Fetch dark web statistics
  const fetchDarkWebStats = async () => {
    try {
      const response = await fetch('/api/darkweb/targets');
      const data = await response.json();
      if (data.success) {
        setDarkWebStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch dark web stats:', error);
    }
  };

  // Fetch image forensics data
  const fetchImageForensics = async () => {
    try {
      const [imagesRes, aiImagesRes, llmRes] = await Promise.all([
        fetch('/api/forensics/images'),
        fetch('/api/forensics/ai-images'),
        fetch('/api/forensics/llm-detections')
      ]);

      const [imagesData, aiImagesData, llmData] = await Promise.all([
        imagesRes.json(),
        aiImagesRes.json(),
        llmRes.json()
      ]);

      if (imagesData.success) setImageForensics(imagesData.data);
      if (aiImagesData.success) setAiImages(aiImagesData.data);
      if (llmData.success) setLlmDetections(llmData.data);

    } catch (error) {
      console.error('Failed to fetch forensics data:', error);
    }
  };

  // Fetch IP intelligence data
  const fetchIPIntelligence = async () => {
    try {
      const response = await fetch('/api/intelligence/ip');
      const data = await response.json();
      if (data.success) {
        setIpIntelligence(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch IP intelligence:', error);
    }
  };

  // Fetch metadata
  const fetchMetadata = async () => {
    try {
      const response = await fetch('/api/metadata/extracted');
      const data = await response.json();
      if (data.success) {
        setMetadata(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch metadata:', error);
    }
  };

  // Fetch stealth status
  const fetchStealthStatus = async () => {
    try {
      const response = await fetch('/api/crawler/stealth-status');
      const data = await response.json();
      if (data.success) {
        setStealthStatus(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stealth status:', error);
    }
  };

  // Manual image analysis
  const analyzeImage = async () => {
    if (!manualImageUrl.trim()) return;

    try {
      const response = await fetch('/api/forensics/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: manualImageUrl })
      });

      const data = await response.json();
      if (data.success) {
        alert('Image analysis started! Check back in a few seconds for results.');
        setManualImageUrl('');
      }
    } catch (error) {
      console.error('Failed to start image analysis:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchDarkWebStats(),
        fetchImageForensics(),
        fetchIPIntelligence(),
        fetchMetadata(),
        fetchStealthStatus()
      ]);
      setIsLoading(false);
    };

    loadData();

    // Refresh data every 10 seconds
    const interval = setInterval(() => {
      fetchDarkWebStats();
      fetchImageForensics();
      fetchIPIntelligence();
      fetchMetadata();
      fetchStealthStatus();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 mx-auto mb-4 animate-spin text-red-400" />
          <h2 className="text-xl font-semibold">Initializing Dark Web Monitor...</h2>
          <p className="text-slate-400 mt-2">Connecting to TOR networks and forensic systems</p>
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
              <Shield className="w-10 h-10 text-red-400" />
              Dark Web Monitor & AI Forensics
            </h1>
            <div className="flex items-center gap-4">
              {/* Connection Status */}
              <div className="flex items-center gap-2">
                {isConnected ? (
                  <Wifi className="w-5 h-5 text-green-400" />
                ) : (
                  <WifiOff className="w-5 h-5 text-red-400" />
                )}
                <span className={`text-sm ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                  {isConnected ? 'LIVE MONITORING' : 'OFFLINE'}
                </span>
              </div>
            </div>
          </div>
          <p className="text-slate-400">Advanced dark web crawling and AI-generated content detection</p>
        </div>

        <Tabs defaultValue="darkweb" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50">
            <TabsTrigger value="darkweb">Dark Web Monitoring</TabsTrigger>
            <TabsTrigger value="forensics">Image Forensics</TabsTrigger>
            <TabsTrigger value="llm-detection">LLM Detection</TabsTrigger>
            <TabsTrigger value="ip-intelligence">IP Intelligence</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
          </TabsList>

          {/* Dark Web Monitoring Tab */}
          <TabsContent value="darkweb" className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="w-5 h-5 text-red-400" />
                    TOR Targets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-400">{darkWebStats?.torTargets || 0}</div>
                  <p className="text-sm text-slate-400">Hidden services monitored</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Network className="w-5 h-5 text-blue-400" />
                    I2P Targets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-400">{darkWebStats?.i2pTargets || 0}</div>
                  <p className="text-sm text-slate-400">Anonymous network sites</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Activity className="w-5 h-5 text-orange-400" />
                    Active Crawls
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-400">{darkWebStats?.activeCrawls || 0}</div>
                  <p className="text-sm text-slate-400">Concurrent operations</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Eye className="w-5 h-5 text-green-400" />
                    Total Monitored
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-400">{darkWebStats?.totalTargets || 0}</div>
                  <p className="text-sm text-slate-400">Dark web entities tracked</p>
                </CardContent>
              </Card>
            </div>

            {/* Crawling Status */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  Real-time Crawling Status
                </CardTitle>
                <CardDescription>Live dark web monitoring operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-green-400">TOR Network Crawling</h4>
                      <p className="text-sm text-slate-400">Scanning .onion hidden services</p>
                    </div>
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                      ACTIVE
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-blue-400">I2P Network Scanning</h4>
                      <p className="text-sm text-slate-400">Monitoring anonymous eepsites</p>
                    </div>
                    <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                      ACTIVE
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-purple-400">Content Analysis</h4>
                      <p className="text-sm text-slate-400">Extracting and analyzing dark web data</p>
                    </div>
                    <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                      ACTIVE
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Image Forensics Tab */}
          <TabsContent value="forensics" className="space-y-6">
            {/* Manual Analysis */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-blue-400" />
                  Manual Image Analysis
                </CardTitle>
                <CardDescription>Analyze specific images for AI generation and LLM metadata</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="image-url">Image URL</Label>
                    <Input
                      id="image-url"
                      placeholder="https://example.com/image.jpg"
                      value={manualImageUrl}
                      onChange={(e) => setManualImageUrl(e.target.value)}
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={analyzeImage} className="bg-blue-600 hover:bg-blue-700">
                      <Brain className="w-4 h-4 mr-2" />
                      Analyze
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Camera className="w-5 h-5 text-blue-400" />
                    Images Analyzed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-400">{imageForensics.length}</div>
                  <p className="text-sm text-slate-400">Total forensic analyses</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Brain className="w-5 h-5 text-purple-400" />
                    AI-Generated
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-400">{aiImages.length}</div>
                  <p className="text-sm text-slate-400">Confirmed AI images</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="w-5 h-5 text-red-400" />
                    LLM Detections
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-400">{llmDetections.length}</div>
                  <p className="text-sm text-slate-400">Specific model detections</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent AI Images */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-400" />
                  Recent AI-Generated Images
                </CardTitle>
                <CardDescription>Latest AI-generated content detections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiImages.slice(0, 10).map((image, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-purple-400">AI Generated</span>
                          <Badge variant="outline" className="text-xs">
                            {Math.round(image.confidence)}% confidence
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-400 truncate max-w-md">{image.url}</p>
                        <div className="flex gap-2 mt-2">
                          {image.artifacts.slice(0, 3).map((artifact, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {artifact}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-xs text-slate-500">
                        {new Date(image.analysisTimestamp).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                  {aiImages.length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                      <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No AI-generated images detected yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* LLM Detection Tab */}
          <TabsContent value="llm-detection" className="space-y-6">
            {/* LLM Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Brain className="w-5 h-5 text-blue-400" />
                    Stable Diffusion
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-400">
                    {llmDetections.filter(d => d.llmMetadata?.modelName?.includes('Stable')).length}
                  </div>
                  <p className="text-sm text-slate-400">SD detections</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Zap className="w-5 h-5 text-green-400" />
                    DALL-E
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-400">
                    {llmDetections.filter(d => d.llmMetadata?.modelName?.includes('DALL-E')).length}
                  </div>
                  <p className="text-sm text-slate-400">OpenAI detections</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="w-5 h-5 text-purple-400" />
                    Midjourney
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-400">
                    {llmDetections.filter(d => d.llmMetadata?.modelName?.includes('Midjourney')).length}
                  </div>
                  <p className="text-sm text-slate-400">MJ detections</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    High Confidence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-400">
                    {llmDetections.filter(d => d.llmMetadata && d.llmMetadata.confidence > 80).length}
                  </div>
                  <p className="text-sm text-slate-400">80%+ confidence</p>
                </CardContent>
              </Card>
            </div>

            {/* LLM Detection Details */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-400" />
                  Detailed LLM Detections
                </CardTitle>
                <CardDescription>Specific AI model identifications and metadata</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {llmDetections.slice(0, 15).map((detection, index) => (
                    <div key={index} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-blue-400 flex items-center gap-2">
                            <Brain className="w-4 h-4" />
                            {detection.llmMetadata?.modelName || 'Unknown Model'}
                          </h4>
                          <p className="text-xs text-slate-400 truncate max-w-md">{detection.url}</p>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                            {Math.round(detection.llmMetadata?.confidence || 0)}% confidence
                          </Badge>
                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(detection.analysisTimestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {detection.llmMetadata && (
                        <div className="grid grid-cols-2 gap-4 mt-3">
                          <div>
                            <span className="text-xs text-slate-400">Version:</span>
                            <span className="text-sm text-white ml-2">
                              {detection.llmMetadata.modelVersion || 'Unknown'}
                            </span>
                          </div>
                          <div>
                            <span className="text-xs text-slate-400">Tool:</span>
                            <span className="text-sm text-white ml-2">
                              {detection.llmMetadata.generationTool || 'Unknown'}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="mt-3">
                        <span className="text-xs text-slate-400">Detection Artifacts:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {detection.artifacts.slice(0, 4).map((artifact, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {artifact}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}

                  {llmDetections.length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                      <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No LLM detections yet</p>
                      <p className="text-xs mt-2">Images are continuously analyzed as they're discovered</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* IP Intelligence Tab */}
          <TabsContent value="ip-intelligence" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  IP Intelligence Analysis
                </CardTitle>
                <CardDescription>
                  Real-time IP address analysis and threat intelligence
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-700/50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-400">{ipIntelligence.length}</div>
                      <div className="text-sm text-slate-400">IPs Analyzed</div>
                    </div>
                    <div className="bg-slate-700/50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-red-400">
                        {ipIntelligence.filter(ip => ip.reputation === 'malicious').length}
                      </div>
                      <div className="text-sm text-slate-400">Malicious IPs</div>
                    </div>
                    <div className="bg-slate-700/50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-orange-400">
                        {ipIntelligence.filter(ip => ip.reputation === 'suspicious').length}
                      </div>
                      <div className="text-sm text-slate-400">Suspicious IPs</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {ipIntelligence.slice(0, 10).map((ip, index) => (
                      <div key={index} className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-mono text-green-400">{ip.ip}</span>
                          <Badge variant={ip.reputation === 'malicious' ? 'destructive' :
                                        ip.reputation === 'suspicious' ? 'secondary' : 'default'}>
                            {ip.reputation}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-slate-400">Location:</span>
                            <span className="text-white ml-2">
                              {ip.city && ip.country ? `${ip.city}, ${ip.country}` : 'Unknown'}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400">ISP:</span>
                            <span className="text-white ml-2">{ip.isp || 'Unknown'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Threat Score:</span>
                            <span className="text-white ml-2">{ip.threatScore}/100</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Last Seen:</span>
                            <span className="text-white ml-2">
                              {new Date(ip.lastSeen).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {ip.associatedDomains.length > 0 && (
                          <div className="mt-2">
                            <span className="text-xs text-slate-400">Associated Domains:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {ip.associatedDomains.slice(0, 3).map((domain, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {domain}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {ipIntelligence.length === 0 && (
                      <div className="text-center py-8 text-slate-400">
                        <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No IP intelligence data yet</p>
                        <p className="text-xs mt-2">IPs are analyzed as they're extracted from crawled content</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Metadata Extraction Tab */}
          <TabsContent value="metadata" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-purple-400" />
                    Metadata Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-700/50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-purple-400">{metadata.length}</div>
                        <div className="text-sm text-slate-400">Pages Analyzed</div>
                      </div>
                      <div className="bg-slate-700/50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-400">
                          {metadata.filter(m => m.emails && m.emails.length > 0).length}
                        </div>
                        <div className="text-sm text-slate-400">With Emails</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-700/50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-400">
                          {metadata.filter(m => m.phoneNumbers && m.phoneNumbers.length > 0).length}
                        </div>
                        <div className="text-sm text-slate-400">With Phones</div>
                      </div>
                      <div className="bg-slate-700/50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-orange-400">
                          {metadata.filter(m => m.addresses && m.addresses.length > 0).length}
                        </div>
                        <div className="text-sm text-slate-400">With Addresses</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-cyan-400" />
                    Stealth Crawling Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {stealthStatus ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Stealth Mode:</span>
                        <Badge variant={stealthStatus.stealthMode ? 'default' : 'secondary'}>
                          {stealthStatus.stealthMode ? 'Active' : 'Disabled'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">User Agents:</span>
                        <span className="text-white">{stealthStatus.userAgents}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Delay Pattern:</span>
                        <span className="text-white">{stealthStatus.requestDelays}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Failed Attempts:</span>
                        <span className="text-red-400">{stealthStatus.failedAttempts}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Session Cookies:</span>
                        <span className="text-green-400">{stealthStatus.sessionCookies}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-slate-400">
                      Loading stealth status...
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-400" />
                  Extracted Metadata
                </CardTitle>
                <CardDescription>
                  Comprehensive metadata extracted from crawled pages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metadata.slice(0, 5).map((item, index) => (
                    <div key={index} className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
                      <div className="flex justify-between items-start mb-3">
                        <div className="font-mono text-purple-400 text-sm break-all">{item.url}</div>
                        <Badge variant="outline">{item.contentType}</Badge>
                      </div>

                      {item.title && (
                        <div className="mb-2">
                          <span className="text-xs text-slate-400">Title:</span>
                          <span className="text-white ml-2 text-sm">{item.title}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {item.author && (
                          <div>
                            <span className="text-slate-400">Author:</span>
                            <span className="text-white ml-2">{item.author}</span>
                          </div>
                        )}
                        {item.server && (
                          <div>
                            <span className="text-slate-400">Server:</span>
                            <span className="text-white ml-2">{item.server}</span>
                          </div>
                        )}
                        {item.language && (
                          <div>
                            <span className="text-slate-400">Language:</span>
                            <span className="text-white ml-2">{item.language}</span>
                          </div>
                        )}
                        {item.framework && (
                          <div>
                            <span className="text-slate-400">Framework:</span>
                            <span className="text-white ml-2">{item.framework}</span>
                          </div>
                        )}
                      </div>

                      {item.emails && item.emails.length > 0 && (
                        <div className="mt-3">
                          <span className="text-xs text-slate-400">Emails Found:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.emails.slice(0, 3).map((email, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {email}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {item.analytics && item.analytics.length > 0 && (
                        <div className="mt-3">
                          <span className="text-xs text-slate-400">Analytics:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.analytics.map((analytic, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {analytic}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {item.securityHeaders && Object.keys(item.securityHeaders).length > 0 && (
                        <div className="mt-3">
                          <span className="text-xs text-slate-400">Security Headers:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {Object.keys(item.securityHeaders).slice(0, 4).map((header, i) => (
                              <Badge key={i} variant="outline" className="text-xs text-green-400">
                                {header}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {metadata.length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                      <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No metadata extracted yet</p>
                      <p className="text-xs mt-2">Metadata is extracted from crawled pages in real-time</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
