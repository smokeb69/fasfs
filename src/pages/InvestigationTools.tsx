import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, User, Clock, Upload, Search, FileText, Camera } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function InvestigationTools() {
  const [geolocation, setGeolocation] = useState({ lat: '', lon: '' });
  const [suspectData, setSuspectData] = useState({ name: '', description: '' });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Investigation Tools</h1>
          <p className="text-slate-400">Comprehensive forensic analysis and investigation capabilities</p>
        </div>

        <Tabs defaultValue="geolocation" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="geolocation">Geolocation</TabsTrigger>
            <TabsTrigger value="suspect">Suspect Profiling</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="facial">Facial Recognition</TabsTrigger>
            <TabsTrigger value="metadata">Metadata Forensics</TabsTrigger>
            <TabsTrigger value="deepfake">Deepfake Detection</TabsTrigger>
          </TabsList>

          <TabsContent value="geolocation">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Geolocation Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Latitude"
                    value={geolocation.lat}
                    onChange={(e) => setGeolocation({ ...geolocation, lat: e.target.value })}
                    className="bg-slate-700 border-slate-600"
                  />
                  <Input
                    placeholder="Longitude"
                    value={geolocation.lon}
                    onChange={(e) => setGeolocation({ ...geolocation, lon: e.target.value })}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <Button>Track Location</Button>
                <div className="mt-4 h-64 bg-slate-700 rounded-lg flex items-center justify-center">
                  <p className="text-slate-400">Map visualization would appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suspect">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Suspect Profiling
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Suspect Name"
                  value={suspectData.name}
                  onChange={(e) => setSuspectData({ ...suspectData, name: e.target.value })}
                  className="bg-slate-700 border-slate-600"
                />
                <textarea
                  placeholder="Description"
                  value={suspectData.description}
                  onChange={(e) => setSuspectData({ ...suspectData, description: e.target.value })}
                  className="w-full h-32 p-3 bg-slate-700 border border-slate-600 rounded-md text-white"
                />
                <Button>Create Profile</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Timeline Visualization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-2 border-slate-600 pl-4 space-y-4">
                    <div>
                      <p className="font-semibold">2025-01-15 10:30 AM</p>
                      <p className="text-slate-400 text-sm">Alert created</p>
                    </div>
                    <div>
                      <p className="font-semibold">2025-01-15 11:00 AM</p>
                      <p className="text-slate-400 text-sm">Investigation started</p>
                    </div>
                    <div>
                      <p className="font-semibold">2025-01-15 2:30 PM</p>
                      <p className="text-slate-400 text-sm">Evidence collected</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="facial">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Facial Recognition
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="facial-upload"
                  />
                  <label htmlFor="facial-upload">
                    <Button variant="outline" as="span">Upload Image</Button>
                  </label>
                </div>
                {uploadedFile && (
                  <Button>Run Facial Recognition</Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metadata">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Metadata Forensics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="metadata-upload"
                  />
                  <label htmlFor="metadata-upload">
                    <Button variant="outline" as="span">Upload File</Button>
                  </label>
                </div>
                {uploadedFile && (
                  <>
                    <Button>Extract Metadata</Button>
                    <div className="mt-4 p-4 bg-slate-700 rounded-lg">
                      <pre className="text-sm text-slate-300">
                        {JSON.stringify({
                          filename: uploadedFile.name,
                          size: uploadedFile.size,
                          type: uploadedFile.type,
                          lastModified: new Date(uploadedFile.lastModified).toISOString(),
                        }, null, 2)}
                      </pre>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deepfake">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Deepfake Detection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="deepfake-upload"
                  />
                  <label htmlFor="deepfake-upload">
                    <Button variant="outline" as="span">Upload Media</Button>
                  </label>
                </div>
                {uploadedFile && (
                  <Button>Analyze for Deepfake</Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
