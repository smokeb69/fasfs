import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Globe, Shield, Users, MessageSquare, AlertTriangle, CheckCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import toast from 'react-hot-toast';

interface LawEnforcementAgency {
  id: string;
  name: string;
  country: string;
  type: 'national' | 'international' | 'regional';
  capabilities: string[];
  trustLevel: 'high' | 'medium' | 'low';
  lastContact: Date;
  activeCases: number;
}

export function InternationalIntegration() {
  const [selectedAgency, setSelectedAgency] = useState<string>('');
  const [communicationType, setCommunicationType] = useState<'secure' | 'standard' | 'emergency'>('secure');

  const agencies: LawEnforcementAgency[] = [
    {
      id: 'fbi',
      name: 'Federal Bureau of Investigation',
      country: 'United States',
      type: 'national',
      capabilities: ['Cybercrime', 'Counterterrorism', 'Financial Crimes'],
      trustLevel: 'high',
      lastContact: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      activeCases: 15
    },
    {
      id: 'interpol',
      name: 'International Criminal Police Organization',
      country: 'International',
      type: 'international',
      capabilities: ['Global Crime', 'Terrorism', 'Organized Crime'],
      trustLevel: 'high',
      lastContact: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      activeCases: 47
    },
    {
      id: 'europol',
      name: 'European Union Agency for Law Enforcement Cooperation',
      country: 'European Union',
      type: 'regional',
      capabilities: ['EU Crime', 'Cybercrime', 'Human Trafficking'],
      trustLevel: 'high',
      lastContact: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      activeCases: 23
    },
    {
      id: 'mi5',
      name: 'MI5 Security Service',
      country: 'United Kingdom',
      type: 'national',
      capabilities: ['Counterintelligence', 'Terrorism', 'Espionage'],
      trustLevel: 'high',
      lastContact: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      activeCases: 8
    },
    {
      id: 'cisa',
      name: 'Cybersecurity and Infrastructure Security Agency',
      country: 'United States',
      type: 'national',
      capabilities: ['Cybersecurity', 'Critical Infrastructure', 'Information Sharing'],
      trustLevel: 'high',
      lastContact: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      activeCases: 31
    }
  ];

  const handleSecureCommunication = async () => {
    if (!selectedAgency) {
      toast.error('Please select an agency');
      return;
    }

    toast.success(`Secure communication initiated with ${agencies.find(a => a.id === selectedAgency)?.name}`);
  };

  const handleIntelligenceSharing = async (agencyId: string) => {
    const agency = agencies.find(a => a.id === agencyId);
    toast.success(`Intelligence shared with ${agency?.name}`);
  };

  const handleJointOperation = async (agencyId: string) => {
    const agency = agencies.find(a => a.id === agencyId);
    toast.success(`Joint operation request sent to ${agency?.name}`);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">International Law Enforcement Integration</h1>
          <p className="text-slate-400">Secure cross-border collaboration and intelligence sharing</p>
        </div>

        <Tabs defaultValue="agencies" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="agencies">Partner Agencies</TabsTrigger>
            <TabsTrigger value="communication">Secure Communication</TabsTrigger>
            <TabsTrigger value="intelligence">Intelligence Sharing</TabsTrigger>
            <TabsTrigger value="operations">Joint Operations</TabsTrigger>
            <TabsTrigger value="treaties">International Treaties</TabsTrigger>
          </TabsList>

          <TabsContent value="agencies">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agencies.map((agency) => (
                <Card key={agency.id} className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{agency.name}</CardTitle>
                        <CardDescription className="text-slate-400">{agency.country}</CardDescription>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs ${
                        agency.trustLevel === 'high' ? 'bg-green-900/30 text-green-400' :
                        agency.trustLevel === 'medium' ? 'bg-yellow-900/30 text-yellow-400' :
                        'bg-red-900/30 text-red-400'
                      }`}>
                        {agency.trustLevel} trust
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-slate-400 mb-1">Capabilities:</p>
                        <div className="flex flex-wrap gap-1">
                          {agency.capabilities.slice(0, 2).map((cap, idx) => (
                            <span key={idx} className="px-2 py-1 bg-slate-700 rounded text-xs">
                              {cap}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Active Cases:</span>
                        <span className="text-white">{agency.activeCases}</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Last Contact:</span>
                        <span className="text-white">
                          {agency.lastContact.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleIntelligenceSharing(agency.id)}
                        >
                          Share Intel
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleJointOperation(agency.id)}
                        >
                          Joint Op
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="communication">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                  Secure International Communication
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Encrypted communication channels with international partners
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Agency</label>
                    <select
                      value={selectedAgency}
                      onChange={(e) => setSelectedAgency(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                    >
                      <option value="">Choose partner agency...</option>
                      {agencies.map((agency) => (
                        <option key={agency.id} value={agency.id}>
                          {agency.name} ({agency.country})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Communication Priority</label>
                    <div className="flex gap-2">
                      {(['standard', 'secure', 'emergency'] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => setCommunicationType(type)}
                          className={`px-4 py-2 rounded capitalize text-sm ${
                            communicationType === type
                              ? type === 'emergency'
                                ? 'bg-red-900/30 border-red-500 text-red-400'
                                : 'bg-blue-900/30 border-blue-500 text-blue-400'
                              : 'bg-slate-700 border-slate-600'
                          } border`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    placeholder="Enter secure message..."
                    className="w-full h-32 p-3 bg-slate-700 border border-slate-600 rounded-md text-white"
                  />
                </div>

                <Button onClick={handleSecureCommunication} className="w-full">
                  <Shield className="w-4 h-4 mr-2" />
                  Send Secure Communication
                </Button>

                <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-slate-700">
                  <div className="text-center">
                    <div className="w-3 h-3 rounded-full mx-auto mb-2 bg-green-400" />
                    <p className="text-sm text-slate-400">End-to-End Encryption</p>
                    <p className="text-xs text-green-400">Active</p>
                  </div>
                  <div className="text-center">
                    <div className="w-3 h-3 rounded-full mx-auto mb-2 bg-blue-400" />
                    <p className="text-sm text-slate-400">Zero-Knowledge Proof</p>
                    <p className="text-xs text-blue-400">Enabled</p>
                  </div>
                  <div className="text-center">
                    <div className="w-3 h-3 rounded-full mx-auto mb-2 bg-purple-400" />
                    <p className="text-sm text-slate-400">Quantum Resistant</p>
                    <p className="text-xs text-purple-400">Future-Ready</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="intelligence">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-green-400" />
                  Intelligence Sharing Platform
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Secure sharing of intelligence with international partners
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="p-4 bg-slate-700/50 rounded text-center">
                      <p className="text-2xl font-bold text-green-400">247</p>
                      <p className="text-sm text-slate-400">Shared Intelligence</p>
                    </div>
                    <div className="p-4 bg-slate-700/50 rounded text-center">
                      <p className="text-2xl font-bold text-blue-400">89</p>
                      <p className="text-sm text-slate-400">Active Partnerships</p>
                    </div>
                    <div className="p-4 bg-slate-700/50 rounded text-center">
                      <p className="text-2xl font-bold text-orange-400">156</p>
                      <p className="text-sm text-slate-400">Joint Operations</p>
                    </div>
                    <div className="p-4 bg-slate-700/50 rounded text-center">
                      <p className="text-2xl font-bold text-purple-400">99.7%</p>
                      <p className="text-sm text-slate-400">Uptime</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Recent Intelligence Shares</h3>
                    {[
                      { agency: 'INTERPOL', type: 'Terrorism Intel', time: '2 hours ago', status: 'delivered' },
                      { agency: 'FBI', type: 'Cybercrime Report', time: '4 hours ago', status: 'delivered' },
                      { agency: 'MI5', type: 'Counterintelligence', time: '6 hours ago', status: 'delivered' }
                    ].map((share, idx) => (
                      <div key={idx} className="p-3 bg-slate-700/50 rounded flex justify-between items-center">
                        <div>
                          <p className="font-medium">{share.agency} - {share.type}</p>
                          <p className="text-sm text-slate-400">{share.time}</p>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="operations">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-400" />
                  Joint Operations Center
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Coordinate international joint operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Active Joint Operations</h3>
                      <div className="space-y-3">
                        <div className="p-4 bg-slate-700/50 rounded">
                          <h4 className="font-medium">Operation Dark Web Nexus</h4>
                          <p className="text-sm text-slate-400 mb-2">Multi-agency dark web investigation</p>
                          <div className="flex justify-between text-sm">
                            <span>Partners: FBI, INTERPOL, EUROPOL</span>
                            <span className="text-green-400">Active</span>
                          </div>
                        </div>

                        <div className="p-4 bg-slate-700/50 rounded">
                          <h4 className="font-medium">Operation Crypto Shield</h4>
                          <p className="text-sm text-slate-400 mb-2">Cryptocurrency crime prevention</p>
                          <div className="flex justify-between text-sm">
                            <span>Partners: CISA, EUROPOL</span>
                            <span className="text-yellow-400">Planning</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Operation Templates</h3>
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full justify-start">
                          <Shield className="w-4 h-4 mr-2" />
                          Cybercrime Investigation
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Counterterrorism Operation
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Globe className="w-4 h-4 mr-2" />
                          Human Trafficking Rescue
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Users className="w-4 h-4 mr-2" />
                          Organized Crime Task Force
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full">
                    <Users className="w-4 h-4 mr-2" />
                    Initiate New Joint Operation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="treaties">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-yellow-400" />
                  International Legal Framework
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Legal agreements and treaties governing international cooperation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Active Treaties</h3>
                      <div className="space-y-3">
                        <div className="p-3 bg-slate-700/50 rounded">
                          <h4 className="font-medium">Budapest Convention</h4>
                          <p className="text-sm text-slate-400">Cybercrime cooperation treaty</p>
                          <p className="text-xs text-green-400 mt-1">64 countries signed</p>
                        </div>

                        <div className="p-3 bg-slate-700/50 rounded">
                          <h4 className="font-medium">MLA Agreements</h4>
                          <p className="text-sm text-slate-400">Mutual Legal Assistance</p>
                          <p className="text-xs text-green-400 mt-1">45 bilateral agreements</p>
                        </div>

                        <div className="p-3 bg-slate-700/50 rounded">
                          <h4 className="font-medium">INTERPOL Constitution</h4>
                          <p className="text-sm text-slate-400">International police cooperation</p>
                          <p className="text-xs text-green-400 mt-1">195 member countries</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Legal Compliance</h3>
                      <div className="space-y-3">
                        <div className="p-3 bg-green-900/20 border border-green-700 rounded">
                          <h4 className="font-medium text-green-400">GDPR Compliant</h4>
                          <p className="text-sm text-slate-400">European data protection standards</p>
                        </div>

                        <div className="p-3 bg-green-900/20 border border-green-700 rounded">
                          <h4 className="font-medium text-green-400">CLOUD Act Ready</h4>
                          <p className="text-sm text-slate-400">US cross-border data access</p>
                        </div>

                        <div className="p-3 bg-green-900/20 border border-green-700 rounded">
                          <h4 className="font-medium text-green-400">MLAT Compliant</h4>
                          <p className="text-sm text-slate-400">Mutual legal assistance treaties</p>
                        </div>
                      </div>
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
