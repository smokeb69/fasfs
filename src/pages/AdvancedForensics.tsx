import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Search, Download, FileText, HardDrive, Wifi, Cpu, Globe } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import toast from 'react-hot-toast';

export function AdvancedForensics() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const analyzeFile = async () => {
    if (!uploadedFile) {
      toast.error('Please upload a file first');
      return;
    }

    setIsAnalyzing(true);

    try {
      // Simulate advanced forensic analysis
      await new Promise(resolve => setTimeout(resolve, 3000));

      const mockResults = {
        fileMetadata: {
          name: uploadedFile.name,
          size: uploadedFile.size,
          type: uploadedFile.type,
          lastModified: new Date(uploadedFile.lastModified).toISOString(),
          hash: `sha256_${Math.random().toString(36).substr(2, 16)}`
        },
        exifData: {
          camera: 'Unknown Camera Model',
          timestamp: '2025-01-15T10:30:00Z',
          location: '40.7128°N, 74.0060°W',
          software: 'Unknown Software v1.0'
        },
        networkArtifacts: [
          { type: 'IP Address', value: '192.168.1.100', confidence: 0.95 },
          { type: 'Domain', value: 'suspicious-domain.com', confidence: 0.87 },
          { type: 'MAC Address', value: '00:1B:44:11:3A:B7', confidence: 0.92 }
        ],
        steganography: {
          detected: Math.random() > 0.5,
          technique: 'LSB Substitution',
          confidence: 0.78,
          hiddenDataSize: Math.floor(Math.random() * 1024)
        },
        malwareAnalysis: {
          signatures: ['Trojan.Generic', 'Backdoor.Win32'],
          behavior: ['Network communication', 'File system access'],
          riskLevel: 'High',
          confidence: 0.91
        },
        timeline: [
          { timestamp: '2025-01-15T08:00:00Z', event: 'File created', source: 'filesystem' },
          { timestamp: '2025-01-15T09:30:00Z', event: 'File modified', source: 'application' },
          { timestamp: '2025-01-15T10:00:00Z', event: 'Network access', source: 'system' }
        ],
        integrity: {
          checksums: {
            md5: Math.random().toString(36).substr(2, 16),
            sha1: Math.random().toString(36).substr(2, 20),
            sha256: Math.random().toString(36).substr(2, 32)
          },
          verification: 'Passed',
          chainOfCustody: 'Maintained'
        }
      };

      setAnalysisResults(mockResults);
      toast.success('Advanced forensic analysis completed');
    } catch (error) {
      toast.error('Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Advanced Digital Forensics</h1>
          <p className="text-slate-400">Military-grade forensic analysis and evidence preservation</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle>File Upload & Analysis</CardTitle>
              <CardDescription className="text-slate-400">
                Upload evidence for comprehensive forensic examination
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="forensic-upload"
                  accept="*/*"
                />
                <label htmlFor="forensic-upload">
                  <Button variant="outline" as="span" className="cursor-pointer">
                    Choose Evidence File
                  </Button>
                </label>
                {uploadedFile && (
                  <p className="mt-4 text-slate-300 text-sm">
                    Selected: {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)
                  </p>
                )}
              </div>

              <Button
                onClick={analyzeFile}
                disabled={!uploadedFile || isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Start Forensic Analysis
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle>Analysis Tools</CardTitle>
              <CardDescription className="text-slate-400">
                Specialized forensic analysis capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" size="sm" className="flex-col h-16">
                  <HardDrive className="w-5 h-5 mb-1" />
                  <span className="text-xs">Disk Imaging</span>
                </Button>
                <Button variant="outline" size="sm" className="flex-col h-16">
                  <Wifi className="w-5 h-5 mb-1" />
                  <span className="text-xs">Network Forensics</span>
                </Button>
                <Button variant="outline" size="sm" className="flex-col h-16">
                  <Cpu className="w-5 h-5 mb-1" />
                  <span className="text-xs">Memory Analysis</span>
                </Button>
                <Button variant="outline" size="sm" className="flex-col h-16">
                  <Globe className="w-5 h-5 mb-1" />
                  <span className="text-xs">Cloud Forensics</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Results */}
        {analysisResults && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Forensic Analysis Results</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="metadata" className="w-full">
                <TabsList className="bg-slate-700 border-slate-600">
                  <TabsTrigger value="metadata">Metadata</TabsTrigger>
                  <TabsTrigger value="network">Network</TabsTrigger>
                  <TabsTrigger value="stegano">Steganography</TabsTrigger>
                  <TabsTrigger value="malware">Malware</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="integrity">Integrity</TabsTrigger>
                </TabsList>

                <TabsContent value="metadata">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      File Metadata
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {Object.entries(analysisResults.fileMetadata).map(([key, value]) => (
                        <div key={key} className="p-3 bg-slate-700/50 rounded">
                          <span className="text-slate-400 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                          <p className="text-white font-mono text-sm">{String(value)}</p>
                        </div>
                      ))}
                    </div>

                    <h3 className="text-lg font-semibold mt-6">EXIF Data</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {Object.entries(analysisResults.exifData).map(([key, value]) => (
                        <div key={key} className="p-3 bg-slate-700/50 rounded">
                          <span className="text-slate-400 text-sm capitalize">{key}:</span>
                          <p className="text-white">{String(value)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="network">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Network Artifacts</h3>
                    <div className="space-y-3">
                      {analysisResults.networkArtifacts.map((artifact: any, idx: number) => (
                        <div key={idx} className="p-3 bg-slate-700/50 rounded flex justify-between items-center">
                          <div>
                            <span className="font-medium">{artifact.type}:</span>
                            <span className="ml-2 text-blue-400">{artifact.value}</span>
                          </div>
                          <span className="text-sm text-slate-400">
                            {(artifact.confidence * 100).toFixed(0)}% confidence
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="stegano">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Steganography Analysis</h3>
                    <div className="p-4 bg-slate-700/50 rounded">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-slate-400">Hidden data detected:</span>
                        <span className={`px-2 py-1 rounded text-sm ${
                          analysisResults.steganography.detected
                            ? 'bg-red-900/30 text-red-400'
                            : 'bg-green-900/30 text-green-400'
                        }`}>
                          {analysisResults.steganography.detected ? 'YES' : 'NO'}
                        </span>
                      </div>

                      {analysisResults.steganography.detected && (
                        <div className="space-y-2">
                          <p><span className="text-slate-400">Technique:</span> {analysisResults.steganography.technique}</p>
                          <p><span className="text-slate-400">Confidence:</span> {(analysisResults.steganography.confidence * 100).toFixed(1)}%</p>
                          <p><span className="text-slate-400">Hidden data size:</span> {analysisResults.steganography.hiddenDataSize} bytes</p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="malware">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Malware Analysis</h3>
                    <div className="p-4 bg-red-900/20 border border-red-700 rounded">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-slate-400">Risk Level:</span>
                        <span className="px-2 py-1 bg-red-900/30 text-red-400 rounded">
                          {analysisResults.malwareAnalysis.riskLevel}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Signatures:</h4>
                          <ul className="text-sm space-y-1">
                            {analysisResults.malwareAnalysis.signatures.map((sig: string, idx: number) => (
                              <li key={idx} className="text-red-400">• {sig}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Behavior:</h4>
                          <ul className="text-sm space-y-1">
                            {analysisResults.malwareAnalysis.behavior.map((beh: string, idx: number) => (
                              <li key={idx} className="text-yellow-400">• {beh}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <p className="text-sm text-slate-400 mt-3">
                        Analysis Confidence: {(analysisResults.malwareAnalysis.confidence * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="timeline">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Timeline Analysis</h3>
                    <div className="space-y-3">
                      {analysisResults.timeline.map((event: any, idx: number) => (
                        <div key={idx} className="flex items-start gap-4 p-3 bg-slate-700/50 rounded">
                          <div className="w-3 h-3 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="font-medium">{event.event}</p>
                            <p className="text-sm text-slate-400">
                              {new Date(event.timestamp).toLocaleString()} • {event.source}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="integrity">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Data Integrity & Chain of Custody</h3>

                    <div className="p-4 bg-slate-700/50 rounded">
                      <h4 className="font-medium mb-3">Checksums</h4>
                      <div className="space-y-2 font-mono text-sm">
                        <p><span className="text-slate-400">MD5:</span> {analysisResults.integrity.checksums.md5}</p>
                        <p><span className="text-slate-400">SHA-1:</span> {analysisResults.integrity.checksums.sha1}</p>
                        <p><span className="text-slate-400">SHA-256:</span> {analysisResults.integrity.checksums.sha256}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-green-900/20 border border-green-700 rounded">
                        <h4 className="font-medium mb-2 text-green-400">Verification Status</h4>
                        <p className="text-green-400">{analysisResults.integrity.verification}</p>
                      </div>

                      <div className="p-4 bg-blue-900/20 border border-blue-700 rounded">
                        <h4 className="font-medium mb-2 text-blue-400">Chain of Custody</h4>
                        <p className="text-blue-400">{analysisResults.integrity.chainOfCustody}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
