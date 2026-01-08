import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Search, Download, CheckCircle, AlertTriangle } from 'lucide-react';
import { trpc } from '@/hooks/useTrpc';
import toast from 'react-hot-toast';

export function ImageAnalysis() {
  const [imageHash, setImageHash] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const analyzeMutation = trpc.features.imageAnalysis.analyzeImage.useMutation({
    onSuccess: (data) => {
      setAnalysisResult(data);
      toast.success('Analysis complete');
    },
    onError: (error) => {
      toast.error(error.message || 'Analysis failed');
    },
  });

  const uploadMutation = trpc.features.imageAnalysis.uploadImage.useMutation({
    onSuccess: (data) => {
      toast.success('Image uploaded successfully');
      setAnalysisResult(data);
    },
    onError: (error) => {
      toast.error(error.message || 'Upload failed');
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // In a real implementation, you would upload the file here
      uploadMutation.mutate({
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        mimeType: selectedFile.type,
      });
    }
  };

  const handleAnalyze = () => {
    if (imageHash) {
      analyzeMutation.mutate({ imageHash });
    } else if (file) {
      uploadMutation.mutate({
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
      });
    } else {
      toast.error('Please provide an image hash or upload a file');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Image Analysis</h1>
          <p className="text-slate-400">Deep analysis of AI-generated images and metadata extraction</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Upload Section */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle>Upload Image</CardTitle>
              <CardDescription className="text-slate-400">
                Upload an image for analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button variant="outline" as="span" className="cursor-pointer">
                    Choose File
                  </Button>
                </label>
                {file && (
                  <p className="mt-4 text-slate-300 text-sm">{file.name}</p>
                )}
              </div>
              <Button onClick={handleAnalyze} className="w-full" disabled={!file && !imageHash}>
                <Search className="w-4 h-4 mr-2" />
                Analyze Image
              </Button>
            </CardContent>
          </Card>

          {/* Hash Search */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle>Search by Hash</CardTitle>
              <CardDescription className="text-slate-400">
                Search for an image by its SHA-256 hash
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Enter SHA-256 hash..."
                value={imageHash}
                onChange={(e) => setImageHash(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
              <Button onClick={handleAnalyze} className="w-full" disabled={!imageHash}>
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Results */}
        {analysisResult && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Analysis Results</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">Detection Results</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded">
                      <span className="text-slate-300">Found in Database</span>
                      {analysisResult.found ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      )}
                    </div>
                    {analysisResult.analysis && (
                      <>
                        <div className="p-3 bg-slate-700/50 rounded">
                          <span className="text-slate-300">Model Type: </span>
                          <span className="text-white font-medium">{analysisResult.analysis.modelType}</span>
                        </div>
                        <div className="p-3 bg-slate-700/50 rounded">
                          <span className="text-slate-300">Confidence: </span>
                          <span className="text-white font-medium">{(analysisResult.analysis.confidence * 100).toFixed(1)}%</span>
                        </div>
                        <div className="p-3 bg-slate-700/50 rounded">
                          <span className="text-slate-300">Risk Level: </span>
                          <span className={`font-medium px-2 py-1 rounded ${
                            analysisResult.analysis.riskLevel === 'red' ? 'bg-red-900/30 text-red-400' :
                            analysisResult.analysis.riskLevel === 'orange' ? 'bg-orange-900/30 text-orange-400' :
                            'bg-green-900/30 text-green-400'
                          }`}>
                            {analysisResult.analysis.riskLevel}
                          </span>
                        </div>
                        <div className="p-3 bg-slate-700/50 rounded">
                          <span className="text-slate-300">Detection Count: </span>
                          <span className="text-white font-medium">{analysisResult.analysis.detectionCount}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Matches</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {analysisResult.matches && analysisResult.matches.length > 0 ? (
                      analysisResult.matches.map((match: any, idx: number) => (
                        <div key={idx} className="p-3 bg-slate-700/50 rounded">
                          <p className="text-sm text-slate-300">Hash: {match.sha256Hash}</p>
                          <p className="text-sm text-slate-400">Model: {match.modelType}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 text-sm">No matches found</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
