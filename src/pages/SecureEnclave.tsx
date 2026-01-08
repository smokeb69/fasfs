import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Shield, Key, Database, Network, AlertTriangle } from 'lucide-react';
import { BiometricAuth } from '@/components/BiometricAuth';
import toast from 'react-hot-toast';

export function SecureEnclave() {
  const [accessLevel, setAccessLevel] = useState<'standard' | 'elevated' | 'critical'>('standard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showBiometric, setShowBiometric] = useState(false);
  const [secureData, setSecureData] = useState<any>(null);

  const handleBiometricAuth = (method: string, confidence: number) => {
    const requiredConfidence = accessLevel === 'critical' ? 0.95 :
                              accessLevel === 'elevated' ? 0.85 : 0.75;

    if (confidence >= requiredConfidence) {
      setIsAuthenticated(true);
      setShowBiometric(false);
      loadSecureData();
      toast.success(`Authenticated via ${method} (${(confidence * 100).toFixed(1)}% confidence)`);
    } else {
      toast.error('Authentication confidence insufficient for access level');
    }
  };

  const loadSecureData = () => {
    // Simulate loading sensitive data based on access level
    const mockData = {
      standard: {
        caseFiles: ['Case_2025_001.pdf', 'Case_2025_002.pdf'],
        evidence: ['evidence_001.jpg', 'evidence_002.mp4'],
        accessLogs: []
      },
      elevated: {
        ...secureData?.standard,
        classifiedReports: ['classified_report_q1.pdf', 'intelligence_brief.pdf'],
        witnessStatements: ['witness_001.pdf', 'witness_002.pdf'],
        chainOfCustody: []
      },
      critical: {
        ...secureData?.elevated,
        nuclearOptions: ['contingency_plan_alpha.pdf', 'emergency_protocols.pdf'],
        internationalAssets: ['asset_deployment_plan.pdf'],
        executiveOrders: ['eo_2025_001.pdf', 'eo_2025_002.pdf']
      }
    };

    setSecureData(mockData[accessLevel]);
  };

  const handleSecureOperation = (operation: string) => {
    if (!isAuthenticated) {
      toast.error('Authentication required');
      return;
    }

    // Simulate secure operations
    toast.success(`Secure operation "${operation}" executed`);
  };

  const getRequiredConfidence = () => {
    switch (accessLevel) {
      case 'critical': return 0.95;
      case 'elevated': return 0.85;
      default: return 0.75;
    }
  };

  if (showBiometric) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8">
        <BiometricAuth
          onAuthenticated={handleBiometricAuth}
          requiredConfidence={getRequiredConfidence()}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Secure Enclave</h1>
          <p className="text-slate-400">Ultra-secure access to classified law enforcement data</p>
        </div>

        {/* Access Level Selection */}
        <Card className="bg-slate-800 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-400" />
              Access Level Configuration
            </CardTitle>
            <CardDescription className="text-slate-400">
              Select security clearance level (requires biometric authentication)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <button
                onClick={() => setAccessLevel('standard')}
                className={`p-4 rounded-lg border transition-colors ${
                  accessLevel === 'standard'
                    ? 'bg-blue-900/30 border-blue-500'
                    : 'bg-slate-700 border-slate-600 hover:bg-slate-600'
                }`}
              >
                <Lock className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                <h3 className="font-semibold">Standard</h3>
                <p className="text-sm text-slate-400">Basic case files & evidence</p>
                <p className="text-xs text-slate-500 mt-2">75% confidence required</p>
              </button>

              <button
                onClick={() => setAccessLevel('elevated')}
                className={`p-4 rounded-lg border transition-colors ${
                  accessLevel === 'elevated'
                    ? 'bg-orange-900/30 border-orange-500'
                    : 'bg-slate-700 border-slate-600 hover:bg-slate-600'
                }`}
              >
                <Shield className="w-6 h-6 mx-auto mb-2 text-orange-400" />
                <h3 className="font-semibold">Elevated</h3>
                <p className="text-sm text-slate-400">Classified reports & intelligence</p>
                <p className="text-xs text-slate-500 mt-2">85% confidence required</p>
              </button>

              <button
                onClick={() => setAccessLevel('critical')}
                className={`p-4 rounded-lg border transition-colors ${
                  accessLevel === 'critical'
                    ? 'bg-red-900/30 border-red-500'
                    : 'bg-slate-700 border-slate-600 hover:bg-slate-600'
                }`}
              >
                <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-red-400" />
                <h3 className="font-semibold">Critical</h3>
                <p className="text-sm text-slate-400">Nuclear options & executive orders</p>
                <p className="text-xs text-slate-500 mt-2">95% confidence required</p>
              </button>
            </div>

            {!isAuthenticated ? (
              <Button onClick={() => setShowBiometric(true)} className="w-full">
                <Key className="w-4 h-4 mr-2" />
                Authenticate for {accessLevel} Access
              </Button>
            ) : (
              <div className="flex items-center gap-2 p-4 bg-green-900/20 border border-green-700 rounded">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-medium">
                  Authenticated for {accessLevel} access
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Secure Operations */}
        {isAuthenticated && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-400" />
                  Secure Data Access
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {secureData && Object.entries(secureData).map(([category, items]: [string, any]) => (
                    <div key={category} className="p-3 bg-slate-700/50 rounded">
                      <h4 className="font-medium text-blue-400 capitalize mb-2">
                        {category.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <div className="space-y-1">
                        {items.map((item: string, idx: number) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <span className="text-slate-300">{item}</span>
                            <Button variant="ghost" size="sm">
                              Access
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="w-5 h-5 text-green-400" />
                  Secure Operations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    onClick={() => handleSecureOperation('Execute Emergency Protocol')}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Execute Emergency Protocol
                  </Button>

                  <Button
                    onClick={() => handleSecureOperation('Deploy International Assets')}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Network className="w-4 h-4 mr-2" />
                    Deploy International Assets
                  </Button>

                  <Button
                    onClick={() => handleSecureOperation('Access Executive Communications')}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Key className="w-4 h-4 mr-2" />
                    Access Executive Communications
                  </Button>

                  <Button
                    onClick={() => handleSecureOperation('Initiate Chain of Command')}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Initiate Chain of Command
                  </Button>

                  <Button
                    onClick={() => handleSecureOperation('Activate Dead Man Switch')}
                    className="w-full justify-start bg-red-900 hover:bg-red-800"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Activate Dead Man Switch
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Security Status */}
        <Card className="bg-slate-800 border-slate-700 mt-6">
          <CardHeader>
            <CardTitle>Security Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                  isAuthenticated ? 'bg-green-400' : 'bg-red-400'
                }`} />
                <p className="text-sm text-slate-400">Authentication</p>
                <p className="text-sm font-medium">
                  {isAuthenticated ? 'Active' : 'Required'}
                </p>
              </div>

              <div className="text-center">
                <div className="w-3 h-3 rounded-full mx-auto mb-2 bg-yellow-400" />
                <p className="text-sm text-slate-400">Encryption</p>
                <p className="text-sm font-medium">AES-256-GCM</p>
              </div>

              <div className="text-center">
                <div className="w-3 h-3 rounded-full mx-auto mb-2 bg-blue-400" />
                <p className="text-sm text-slate-400">Access Level</p>
                <p className="text-sm font-medium capitalize">{accessLevel}</p>
              </div>

              <div className="text-center">
                <div className="w-3 h-3 rounded-full mx-auto mb-2 bg-purple-400" />
                <p className="text-sm text-slate-400">Session</p>
                <p className="text-sm font-medium">Encrypted</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
