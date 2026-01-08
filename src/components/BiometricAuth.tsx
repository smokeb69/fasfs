import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Fingerprint, Eye, AlertTriangle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface BiometricAuthProps {
  onAuthenticated: (method: string, confidence: number) => void;
  requiredConfidence: number;
}

export function BiometricAuth({ onAuthenticated, requiredConfidence }: BiometricAuthProps) {
  const [authMethod, setAuthMethod] = useState<'fingerprint' | 'facial' | 'iris' | 'voice'>('fingerprint');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startFingerprintAuth = async () => {
    setIsAuthenticating(true);

    try {
      // Simulate fingerprint authentication
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockConfidence = Math.random() * 0.3 + 0.7; // 70-100%
      setConfidence(mockConfidence);

      if (mockConfidence >= requiredConfidence) {
        toast.success('Fingerprint authentication successful');
        onAuthenticated('fingerprint', mockConfidence);
      } else {
        toast.error('Fingerprint confidence too low');
      }
    } catch (error) {
      toast.error('Fingerprint authentication failed');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const startFacialAuth = async () => {
    setIsAuthenticating(true);

    try {
      // Access camera for facial recognition
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Simulate facial recognition processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Capture frame for analysis
      if (videoRef.current && canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          // Here would be actual facial recognition processing
        }
      }

      // Stop camera
      stream.getTracks().forEach(track => track.stop());

      const mockConfidence = Math.random() * 0.2 + 0.8; // 80-100%
      setConfidence(mockConfidence);

      if (mockConfidence >= requiredConfidence) {
        toast.success('Facial authentication successful');
        onAuthenticated('facial', mockConfidence);
      } else {
        toast.error('Facial confidence too low');
      }
    } catch (error) {
      toast.error('Facial authentication failed');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const startIrisAuth = async () => {
    setIsAuthenticating(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Simulate iris scanning
      await new Promise(resolve => setTimeout(resolve, 4000));

      stream.getTracks().forEach(track => track.stop());

      const mockConfidence = Math.random() * 0.15 + 0.85; // 85-100%
      setConfidence(mockConfidence);

      if (mockConfidence >= requiredConfidence) {
        toast.success('Iris authentication successful');
        onAuthenticated('iris', mockConfidence);
      } else {
        toast.error('Iris confidence too low');
      }
    } catch (error) {
      toast.error('Iris authentication failed');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const startVoiceAuth = async () => {
    setIsAuthenticating(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Simulate voice recognition
      await new Promise(resolve => setTimeout(resolve, 2500));

      stream.getTracks().forEach(track => track.stop());

      const mockConfidence = Math.random() * 0.25 + 0.75; // 75-100%
      setConfidence(mockConfidence);

      if (mockConfidence >= requiredConfidence) {
        toast.success('Voice authentication successful');
        onAuthenticated('voice', mockConfidence);
      } else {
        toast.error('Voice confidence too low');
      }
    } catch (error) {
      toast.error('Voice authentication failed');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleAuth = () => {
    switch (authMethod) {
      case 'fingerprint':
        startFingerprintAuth();
        break;
      case 'facial':
        startFacialAuth();
        break;
      case 'iris':
        startIrisAuth();
        break;
      case 'voice':
        startVoiceAuth();
        break;
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700 max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-400" />
          Biometric Authentication
        </CardTitle>
        <CardDescription className="text-slate-400">
          Multi-factor biometric verification for enhanced security
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            variant={authMethod === 'fingerprint' ? 'default' : 'outline'}
            onClick={() => setAuthMethod('fingerprint')}
            size="sm"
          >
            <Fingerprint className="w-4 h-4 mr-2" />
            Fingerprint
          </Button>
          <Button
            variant={authMethod === 'facial' ? 'default' : 'outline'}
            onClick={() => setAuthMethod('facial')}
            size="sm"
          >
            <Eye className="w-4 h-4 mr-2" />
            Facial
          </Button>
          <Button
            variant={authMethod === 'iris' ? 'default' : 'outline'}
            onClick={() => setAuthMethod('iris')}
            size="sm"
          >
            <Eye className="w-4 h-4 mr-2" />
            Iris
          </Button>
          <Button
            variant={authMethod === 'voice' ? 'default' : 'outline'}
            onClick={() => setAuthMethod('voice')}
            size="sm"
          >
            Voice
          </Button>
        </div>

        {authMethod === 'facial' || authMethod === 'iris' ? (
          <div className="space-y-2">
            <video
              ref={videoRef}
              className="w-full h-48 bg-slate-900 rounded border"
              muted
            />
            <canvas
              ref={canvasRef}
              className="hidden"
              width="640"
              height="480"
            />
          </div>
        ) : null}

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Required Confidence:</span>
            <span className="text-white">{(requiredConfidence * 100).toFixed(0)}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Current Confidence:</span>
            <span className={`font-medium ${confidence >= requiredConfidence ? 'text-green-400' : 'text-red-400'}`}>
              {(confidence * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                confidence >= requiredConfidence ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{ width: `${confidence * 100}%` }}
            />
          </div>
        </div>

        <Button
          onClick={handleAuth}
          disabled={isAuthenticating}
          className="w-full"
        >
          {isAuthenticating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Authenticating...
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 mr-2" />
              Authenticate
            </>
          )}
        </Button>

        {confidence > 0 && confidence < requiredConfidence && (
          <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-700 rounded">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-400">
              Authentication confidence below required threshold
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
