import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Shield,
  AlertTriangle,
  Target,
  Search,
  Filter,
  Eye,
  Activity,
  Brain,
  Users,
  Lock,
  Wifi,
  Cloud,
  Smartphone,
  Database,
  Phone,
  CreditCard,
  Bug,
  TrendingUp,
  BarChart3,
  PieChart,
  LineChart,
  WifiOff,
} from 'lucide-react';
// import { trpc } from '@/utils/trpc'; // Commented out - module not found
import { useWebSocket, useThreatMonitoring } from '@/hooks/useWebSocket';

interface AttackVector {
  id: string;
  name: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  indicators: string[];
  mitigation: string[];
  detectionRate: number;
  activeIncidents: number;
  lastDetected: Date | string;
  status: 'active' | 'monitored' | 'contained';
}

const ATTACK_VECTORS: AttackVector[] = [
  {
    "id": "attack-vector-1",
    "name": "AI Threats Attack 1",
    "category": "AI Threats",
    "severity": "low",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 69.9,
    "activeIncidents": 3780,
    "lastDetected": new Date("2025-01-20T21:33:43.594Z"),
    "status": "monitored"
  },
  {
    "id": "attack-vector-2",
    "name": "AI Threats Attack 2",
    "category": "AI Threats",
    "severity": "critical",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 57.5,
    "activeIncidents": 496,
    "lastDetected": "2025-07-03T12:42:39.082Z",
    "status": "active"
  },
  {
    "id": "attack-vector-3",
    "name": "AI Threats Attack 3",
    "category": "AI Threats",
    "severity": "medium",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 24.5,
    "activeIncidents": 4179,
    "lastDetected": "2024-12-24T22:59:22.167Z",
    "status": "active"
  },
  {
    "id": "attack-vector-4",
    "name": "AI Threats Attack 4",
    "category": "AI Threats",
    "severity": "critical",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 65.3,
    "activeIncidents": 518,
    "lastDetected": "2025-09-27T07:35:45.941Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-5",
    "name": "AI Threats Attack 5",
    "category": "AI Threats",
    "severity": "high",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 39.7,
    "activeIncidents": 4248,
    "lastDetected": "2024-11-08T11:47:49.458Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-6",
    "name": "AI Threats Attack 6",
    "category": "AI Threats",
    "severity": "medium",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 48.5,
    "activeIncidents": 1100,
    "lastDetected": "2025-09-22T07:22:20.997Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-7",
    "name": "AI Threats Attack 7",
    "category": "AI Threats",
    "severity": "critical",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 42.7,
    "activeIncidents": 2428,
    "lastDetected": "2025-04-05T13:45:13.499Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-8",
    "name": "AI Threats Attack 8",
    "category": "AI Threats",
    "severity": "critical",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 27.5,
    "activeIncidents": 3404,
    "lastDetected": "2025-10-23T20:13:52.294Z",
    "status": "active"
  },
  {
    "id": "attack-vector-9",
    "name": "AI Threats Attack 9",
    "category": "AI Threats",
    "severity": "critical",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 36.7,
    "activeIncidents": 2292,
    "lastDetected": "2024-11-20T14:56:24.600Z",
    "status": "active"
  },
  {
    "id": "attack-vector-10",
    "name": "AI Threats Attack 10",
    "category": "AI Threats",
    "severity": "low",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 59.1,
    "activeIncidents": 876,
    "lastDetected": "2025-01-20T11:55:37.648Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-11",
    "name": "AI Threats Attack 11",
    "category": "AI Threats",
    "severity": "critical",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 51.1,
    "activeIncidents": 1328,
    "lastDetected": "2024-11-09T21:22:33.224Z",
    "status": "active"
  },
  {
    "id": "attack-vector-12",
    "name": "AI Threats Attack 12",
    "category": "AI Threats",
    "severity": "low",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 62.8,
    "activeIncidents": 2712,
    "lastDetected": "2025-02-15T00:03:06.312Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-13",
    "name": "AI Threats Attack 13",
    "category": "AI Threats",
    "severity": "high",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 79.5,
    "activeIncidents": 2072,
    "lastDetected": "2025-02-20T07:14:44.451Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-14",
    "name": "AI Threats Attack 14",
    "category": "AI Threats",
    "severity": "low",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 41.8,
    "activeIncidents": 2344,
    "lastDetected": "2024-12-27T14:30:31.090Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-15",
    "name": "AI Threats Attack 15",
    "category": "AI Threats",
    "severity": "critical",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 57.4,
    "activeIncidents": 339,
    "lastDetected": "2025-07-06T15:38:48.584Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-16",
    "name": "AI Threats Attack 16",
    "category": "AI Threats",
    "severity": "critical",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 22.2,
    "activeIncidents": 416,
    "lastDetected": "2024-12-10T03:09:38.787Z",
    "status": "active"
  },
  {
    "id": "attack-vector-17",
    "name": "AI Threats Attack 17",
    "category": "AI Threats",
    "severity": "medium",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 21,
    "activeIncidents": 1168,
    "lastDetected": "2024-11-10T07:12:40.849Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-18",
    "name": "AI Threats Attack 18",
    "category": "AI Threats",
    "severity": "critical",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 37.5,
    "activeIncidents": 4196,
    "lastDetected": "2025-02-04T00:46:00.516Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-19",
    "name": "AI Threats Attack 19",
    "category": "AI Threats",
    "severity": "high",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 51,
    "activeIncidents": 130,
    "lastDetected": "2025-10-25T06:13:05.973Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-20",
    "name": "AI Threats Attack 20",
    "category": "AI Threats",
    "severity": "low",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 69.9,
    "activeIncidents": 3539,
    "lastDetected": "2025-08-14T11:32:43.665Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-21",
    "name": "AI Threats Attack 21",
    "category": "AI Threats",
    "severity": "critical",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 64.6,
    "activeIncidents": 1444,
    "lastDetected": "2025-02-11T17:48:58.043Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-22",
    "name": "AI Threats Attack 22",
    "category": "AI Threats",
    "severity": "critical",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 37.2,
    "activeIncidents": 1003,
    "lastDetected": "2025-06-15T08:58:41.015Z",
    "status": "active"
  },
  {
    "id": "attack-vector-23",
    "name": "AI Threats Attack 23",
    "category": "AI Threats",
    "severity": "high",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 51.2,
    "activeIncidents": 4903,
    "lastDetected": "2025-03-11T01:39:05.561Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-24",
    "name": "AI Threats Attack 24",
    "category": "AI Threats",
    "severity": "high",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 23.8,
    "activeIncidents": 3326,
    "lastDetected": "2024-12-07T19:12:10.779Z",
    "status": "active"
  },
  {
    "id": "attack-vector-25",
    "name": "AI Threats Attack 25",
    "category": "AI Threats",
    "severity": "medium",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 26.9,
    "activeIncidents": 89,
    "lastDetected": "2025-06-26T08:37:02.053Z",
    "status": "active"
  },
  {
    "id": "attack-vector-26",
    "name": "AI Threats Attack 26",
    "category": "AI Threats",
    "severity": "high",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 52.9,
    "activeIncidents": 2287,
    "lastDetected": "2024-12-10T09:16:16.891Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-27",
    "name": "AI Threats Attack 27",
    "category": "AI Threats",
    "severity": "medium",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 31.7,
    "activeIncidents": 4263,
    "lastDetected": "2025-06-10T06:29:30.120Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-28",
    "name": "AI Threats Attack 28",
    "category": "AI Threats",
    "severity": "critical",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 39.3,
    "activeIncidents": 1056,
    "lastDetected": "2025-02-06T03:08:49.328Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-29",
    "name": "AI Threats Attack 29",
    "category": "AI Threats",
    "severity": "low",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 64.5,
    "activeIncidents": 3748,
    "lastDetected": "2024-11-24T07:01:35.562Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-30",
    "name": "AI Threats Attack 30",
    "category": "AI Threats",
    "severity": "medium",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 71.6,
    "activeIncidents": 162,
    "lastDetected": "2024-10-30T13:48:06.242Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-31",
    "name": "AI Threats Attack 31",
    "category": "AI Threats",
    "severity": "low",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 68.2,
    "activeIncidents": 1787,
    "lastDetected": "2025-06-21T05:50:36.920Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-32",
    "name": "AI Threats Attack 32",
    "category": "AI Threats",
    "severity": "medium",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 27.7,
    "activeIncidents": 1637,
    "lastDetected": "2025-06-07T07:51:53.350Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-33",
    "name": "AI Threats Attack 33",
    "category": "AI Threats",
    "severity": "low",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 40.2,
    "activeIncidents": 2392,
    "lastDetected": "2025-03-14T22:49:15.237Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-34",
    "name": "AI Threats Attack 34",
    "category": "AI Threats",
    "severity": "medium",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 50.6,
    "activeIncidents": 757,
    "lastDetected": "2024-11-10T05:52:15.517Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-35",
    "name": "AI Threats Attack 35",
    "category": "AI Threats",
    "severity": "low",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 52.1,
    "activeIncidents": 3834,
    "lastDetected": "2025-03-26T03:31:06.253Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-36",
    "name": "AI Threats Attack 36",
    "category": "AI Threats",
    "severity": "medium",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 28.8,
    "activeIncidents": 4849,
    "lastDetected": "2025-10-12T17:01:54.420Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-37",
    "name": "AI Threats Attack 37",
    "category": "AI Threats",
    "severity": "medium",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 33.5,
    "activeIncidents": 1442,
    "lastDetected": "2025-10-29T07:57:33.307Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-38",
    "name": "AI Threats Attack 38",
    "category": "AI Threats",
    "severity": "critical",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 77.4,
    "activeIncidents": 1880,
    "lastDetected": "2025-08-17T11:01:09.745Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-39",
    "name": "AI Threats Attack 39",
    "category": "AI Threats",
    "severity": "critical",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 65,
    "activeIncidents": 2557,
    "lastDetected": "2025-07-23T10:59:07.078Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-40",
    "name": "AI Threats Attack 40",
    "category": "AI Threats",
    "severity": "high",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 59.8,
    "activeIncidents": 229,
    "lastDetected": "2025-04-18T22:42:49.267Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-41",
    "name": "AI Threats Attack 41",
    "category": "AI Threats",
    "severity": "high",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 53.7,
    "activeIncidents": 2543,
    "lastDetected": "2025-01-15T21:44:39.553Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-42",
    "name": "AI Threats Attack 42",
    "category": "AI Threats",
    "severity": "high",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 70.3,
    "activeIncidents": 1149,
    "lastDetected": "2025-01-17T14:10:18.835Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-43",
    "name": "AI Threats Attack 43",
    "category": "AI Threats",
    "severity": "low",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 63,
    "activeIncidents": 3372,
    "lastDetected": "2025-05-29T10:29:17.077Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-44",
    "name": "AI Threats Attack 44",
    "category": "AI Threats",
    "severity": "critical",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 37.5,
    "activeIncidents": 1855,
    "lastDetected": "2025-02-26T03:27:49.899Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-45",
    "name": "AI Threats Attack 45",
    "category": "AI Threats",
    "severity": "low",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 77.5,
    "activeIncidents": 850,
    "lastDetected": "2025-08-05T11:41:59.392Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-46",
    "name": "AI Threats Attack 46",
    "category": "AI Threats",
    "severity": "medium",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 29.8,
    "activeIncidents": 168,
    "lastDetected": "2025-09-27T07:58:17.765Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-47",
    "name": "AI Threats Attack 47",
    "category": "AI Threats",
    "severity": "critical",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 29.9,
    "activeIncidents": 3116,
    "lastDetected": "2025-08-14T02:37:19.087Z",
    "status": "active"
  },
  {
    "id": "attack-vector-48",
    "name": "AI Threats Attack 48",
    "category": "AI Threats",
    "severity": "critical",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 53.8,
    "activeIncidents": 4822,
    "lastDetected": "2025-08-09T00:37:48.316Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-49",
    "name": "AI Threats Attack 49",
    "category": "AI Threats",
    "severity": "critical",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 55.3,
    "activeIncidents": 1849,
    "lastDetected": "2025-07-05T09:49:59.174Z",
    "status": "active"
  },
  {
    "id": "attack-vector-50",
    "name": "AI Threats Attack 50",
    "category": "AI Threats",
    "severity": "medium",
    "description": "Real-world ai threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for AI Threats",
      "Behavioral pattern in AI Threats",
      "Network signature of AI Threats"
    ],
    "mitigation": [
      "Security control for AI Threats",
      "Monitoring solution for AI Threats",
      "Response procedure for AI Threats"
    ],
    "detectionRate": 30.4,
    "activeIncidents": 4586,
    "lastDetected": "2025-05-26T17:18:38.015Z",
    "status": "active"
  },
  {
    "id": "attack-vector-51",
    "name": "Child Exploitation Attack 1",
    "category": "Child Exploitation",
    "severity": "medium",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 71.1,
    "activeIncidents": 2853,
    "lastDetected": "2025-04-03T19:10:23.482Z",
    "status": "active"
  },
  {
    "id": "attack-vector-52",
    "name": "Child Exploitation Attack 2",
    "category": "Child Exploitation",
    "severity": "critical",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 79,
    "activeIncidents": 1196,
    "lastDetected": "2025-04-11T14:17:45.865Z",
    "status": "active"
  },
  {
    "id": "attack-vector-53",
    "name": "Child Exploitation Attack 3",
    "category": "Child Exploitation",
    "severity": "high",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 31.7,
    "activeIncidents": 1650,
    "lastDetected": "2025-07-31T13:57:34.632Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-54",
    "name": "Child Exploitation Attack 4",
    "category": "Child Exploitation",
    "severity": "low",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 76.7,
    "activeIncidents": 4170,
    "lastDetected": "2025-05-25T22:10:32.496Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-55",
    "name": "Child Exploitation Attack 5",
    "category": "Child Exploitation",
    "severity": "low",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 21.5,
    "activeIncidents": 1305,
    "lastDetected": "2025-04-17T20:21:01.167Z",
    "status": "active"
  },
  {
    "id": "attack-vector-56",
    "name": "Child Exploitation Attack 6",
    "category": "Child Exploitation",
    "severity": "critical",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 42.4,
    "activeIncidents": 3345,
    "lastDetected": "2025-09-03T15:36:45.537Z",
    "status": "active"
  },
  {
    "id": "attack-vector-57",
    "name": "Child Exploitation Attack 7",
    "category": "Child Exploitation",
    "severity": "low",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 64.6,
    "activeIncidents": 2181,
    "lastDetected": "2024-12-21T09:09:01.070Z",
    "status": "active"
  },
  {
    "id": "attack-vector-58",
    "name": "Child Exploitation Attack 8",
    "category": "Child Exploitation",
    "severity": "medium",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 75.2,
    "activeIncidents": 898,
    "lastDetected": "2025-09-15T15:15:20.313Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-59",
    "name": "Child Exploitation Attack 9",
    "category": "Child Exploitation",
    "severity": "medium",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 60.6,
    "activeIncidents": 457,
    "lastDetected": "2025-10-24T04:14:22.945Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-60",
    "name": "Child Exploitation Attack 10",
    "category": "Child Exploitation",
    "severity": "critical",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 57,
    "activeIncidents": 1033,
    "lastDetected": "2025-06-21T10:30:37.067Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-61",
    "name": "Child Exploitation Attack 11",
    "category": "Child Exploitation",
    "severity": "high",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 75.9,
    "activeIncidents": 1931,
    "lastDetected": "2024-12-15T22:31:48.727Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-62",
    "name": "Child Exploitation Attack 12",
    "category": "Child Exploitation",
    "severity": "medium",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 68.8,
    "activeIncidents": 348,
    "lastDetected": "2025-10-27T10:09:18.027Z",
    "status": "active"
  },
  {
    "id": "attack-vector-63",
    "name": "Child Exploitation Attack 13",
    "category": "Child Exploitation",
    "severity": "low",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 25.5,
    "activeIncidents": 1597,
    "lastDetected": "2025-01-29T14:11:31.556Z",
    "status": "active"
  },
  {
    "id": "attack-vector-64",
    "name": "Child Exploitation Attack 14",
    "category": "Child Exploitation",
    "severity": "high",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 57.5,
    "activeIncidents": 3723,
    "lastDetected": "2025-02-04T16:23:34.262Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-65",
    "name": "Child Exploitation Attack 15",
    "category": "Child Exploitation",
    "severity": "medium",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 73.8,
    "activeIncidents": 1955,
    "lastDetected": "2025-08-08T20:44:15.784Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-66",
    "name": "Child Exploitation Attack 16",
    "category": "Child Exploitation",
    "severity": "critical",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 31.3,
    "activeIncidents": 4129,
    "lastDetected": "2025-09-29T04:18:49.695Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-67",
    "name": "Child Exploitation Attack 17",
    "category": "Child Exploitation",
    "severity": "critical",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 36.4,
    "activeIncidents": 2072,
    "lastDetected": "2025-09-22T22:45:21.038Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-68",
    "name": "Child Exploitation Attack 18",
    "category": "Child Exploitation",
    "severity": "medium",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 28.8,
    "activeIncidents": 3925,
    "lastDetected": "2025-04-23T06:40:41.277Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-69",
    "name": "Child Exploitation Attack 19",
    "category": "Child Exploitation",
    "severity": "low",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 41.7,
    "activeIncidents": 2818,
    "lastDetected": "2025-01-24T07:50:01.993Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-70",
    "name": "Child Exploitation Attack 20",
    "category": "Child Exploitation",
    "severity": "high",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 77.5,
    "activeIncidents": 4255,
    "lastDetected": "2025-01-08T11:40:06.379Z",
    "status": "active"
  },
  {
    "id": "attack-vector-71",
    "name": "Child Exploitation Attack 21",
    "category": "Child Exploitation",
    "severity": "low",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 29.7,
    "activeIncidents": 3231,
    "lastDetected": "2025-04-26T06:53:39.067Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-72",
    "name": "Child Exploitation Attack 22",
    "category": "Child Exploitation",
    "severity": "medium",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 49.2,
    "activeIncidents": 1520,
    "lastDetected": "2025-06-24T09:02:24.130Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-73",
    "name": "Child Exploitation Attack 23",
    "category": "Child Exploitation",
    "severity": "critical",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 61.9,
    "activeIncidents": 767,
    "lastDetected": "2024-12-29T04:38:01.321Z",
    "status": "active"
  },
  {
    "id": "attack-vector-74",
    "name": "Child Exploitation Attack 24",
    "category": "Child Exploitation",
    "severity": "critical",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 30.4,
    "activeIncidents": 1047,
    "lastDetected": "2025-10-28T18:56:41.382Z",
    "status": "active"
  },
  {
    "id": "attack-vector-75",
    "name": "Child Exploitation Attack 25",
    "category": "Child Exploitation",
    "severity": "medium",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 64.1,
    "activeIncidents": 4940,
    "lastDetected": "2025-10-28T03:34:22.651Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-76",
    "name": "Child Exploitation Attack 26",
    "category": "Child Exploitation",
    "severity": "critical",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 47.4,
    "activeIncidents": 1176,
    "lastDetected": "2025-02-22T06:02:38.481Z",
    "status": "active"
  },
  {
    "id": "attack-vector-77",
    "name": "Child Exploitation Attack 27",
    "category": "Child Exploitation",
    "severity": "high",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 68.9,
    "activeIncidents": 2448,
    "lastDetected": "2025-08-02T17:45:06.290Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-78",
    "name": "Child Exploitation Attack 28",
    "category": "Child Exploitation",
    "severity": "high",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 74.6,
    "activeIncidents": 4901,
    "lastDetected": "2025-07-18T17:55:11.501Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-79",
    "name": "Child Exploitation Attack 29",
    "category": "Child Exploitation",
    "severity": "critical",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 63.3,
    "activeIncidents": 1021,
    "lastDetected": "2024-11-21T17:07:43.835Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-80",
    "name": "Child Exploitation Attack 30",
    "category": "Child Exploitation",
    "severity": "low",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 76.8,
    "activeIncidents": 259,
    "lastDetected": "2024-11-17T00:51:07.405Z",
    "status": "active"
  },
  {
    "id": "attack-vector-81",
    "name": "Child Exploitation Attack 31",
    "category": "Child Exploitation",
    "severity": "critical",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 75.7,
    "activeIncidents": 1191,
    "lastDetected": "2025-02-13T15:46:09.214Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-82",
    "name": "Child Exploitation Attack 32",
    "category": "Child Exploitation",
    "severity": "high",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 65.5,
    "activeIncidents": 1387,
    "lastDetected": "2025-03-22T13:27:38.079Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-83",
    "name": "Child Exploitation Attack 33",
    "category": "Child Exploitation",
    "severity": "critical",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 54.7,
    "activeIncidents": 3694,
    "lastDetected": "2024-11-03T08:07:20.388Z",
    "status": "active"
  },
  {
    "id": "attack-vector-84",
    "name": "Child Exploitation Attack 34",
    "category": "Child Exploitation",
    "severity": "low",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 58.3,
    "activeIncidents": 2812,
    "lastDetected": "2024-11-16T09:41:03.014Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-85",
    "name": "Child Exploitation Attack 35",
    "category": "Child Exploitation",
    "severity": "critical",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 34.3,
    "activeIncidents": 2362,
    "lastDetected": "2024-10-31T00:10:44.893Z",
    "status": "active"
  },
  {
    "id": "attack-vector-86",
    "name": "Child Exploitation Attack 36",
    "category": "Child Exploitation",
    "severity": "high",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 74.3,
    "activeIncidents": 4112,
    "lastDetected": "2025-04-16T04:48:58.633Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-87",
    "name": "Child Exploitation Attack 37",
    "category": "Child Exploitation",
    "severity": "critical",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 57.8,
    "activeIncidents": 29,
    "lastDetected": "2025-04-08T17:52:23.917Z",
    "status": "active"
  },
  {
    "id": "attack-vector-88",
    "name": "Child Exploitation Attack 38",
    "category": "Child Exploitation",
    "severity": "medium",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 34.3,
    "activeIncidents": 3942,
    "lastDetected": "2025-08-19T21:27:01.890Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-89",
    "name": "Child Exploitation Attack 39",
    "category": "Child Exploitation",
    "severity": "critical",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 55.5,
    "activeIncidents": 3754,
    "lastDetected": "2025-05-31T02:35:44.502Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-90",
    "name": "Child Exploitation Attack 40",
    "category": "Child Exploitation",
    "severity": "critical",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 33.9,
    "activeIncidents": 4955,
    "lastDetected": "2025-03-08T19:05:54.855Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-91",
    "name": "Child Exploitation Attack 41",
    "category": "Child Exploitation",
    "severity": "medium",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 71.6,
    "activeIncidents": 3036,
    "lastDetected": "2025-01-12T02:50:33.503Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-92",
    "name": "Child Exploitation Attack 42",
    "category": "Child Exploitation",
    "severity": "low",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 37.2,
    "activeIncidents": 2121,
    "lastDetected": "2025-05-31T10:06:14.196Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-93",
    "name": "Child Exploitation Attack 43",
    "category": "Child Exploitation",
    "severity": "high",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 66.1,
    "activeIncidents": 4747,
    "lastDetected": "2024-12-01T00:19:41.511Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-94",
    "name": "Child Exploitation Attack 44",
    "category": "Child Exploitation",
    "severity": "critical",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 45.9,
    "activeIncidents": 4830,
    "lastDetected": "2025-04-25T06:25:36.521Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-95",
    "name": "Child Exploitation Attack 45",
    "category": "Child Exploitation",
    "severity": "medium",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 70.8,
    "activeIncidents": 3576,
    "lastDetected": "2025-06-16T09:45:42.310Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-96",
    "name": "Child Exploitation Attack 46",
    "category": "Child Exploitation",
    "severity": "low",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 72.2,
    "activeIncidents": 511,
    "lastDetected": "2025-10-08T18:34:27.030Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-97",
    "name": "Child Exploitation Attack 47",
    "category": "Child Exploitation",
    "severity": "medium",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 76.2,
    "activeIncidents": 4179,
    "lastDetected": "2025-03-21T05:40:31.727Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-98",
    "name": "Child Exploitation Attack 48",
    "category": "Child Exploitation",
    "severity": "high",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 57.2,
    "activeIncidents": 2181,
    "lastDetected": "2025-10-25T20:50:23.190Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-99",
    "name": "Child Exploitation Attack 49",
    "category": "Child Exploitation",
    "severity": "low",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 78,
    "activeIncidents": 3681,
    "lastDetected": "2025-04-12T06:25:54.053Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-100",
    "name": "Child Exploitation Attack 50",
    "category": "Child Exploitation",
    "severity": "critical",
    "description": "Real-world child exploitation attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Child Exploitation",
      "Behavioral pattern in Child Exploitation",
      "Network signature of Child Exploitation"
    ],
    "mitigation": [
      "Security control for Child Exploitation",
      "Monitoring solution for Child Exploitation",
      "Response procedure for Child Exploitation"
    ],
    "detectionRate": 70.1,
    "activeIncidents": 1961,
    "lastDetected": "2025-01-04T02:42:55.130Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-101",
    "name": "Malware Attack 1",
    "category": "Malware",
    "severity": "critical",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 79.5,
    "activeIncidents": 3373,
    "lastDetected": "2024-11-30T02:51:51.691Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-102",
    "name": "Malware Attack 2",
    "category": "Malware",
    "severity": "medium",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 57,
    "activeIncidents": 3544,
    "lastDetected": "2025-07-04T17:42:04.665Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-103",
    "name": "Malware Attack 3",
    "category": "Malware",
    "severity": "high",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 68.4,
    "activeIncidents": 414,
    "lastDetected": "2025-02-22T08:55:21.002Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-104",
    "name": "Malware Attack 4",
    "category": "Malware",
    "severity": "low",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 49.8,
    "activeIncidents": 3815,
    "lastDetected": "2025-09-12T17:18:33.872Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-105",
    "name": "Malware Attack 5",
    "category": "Malware",
    "severity": "medium",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 26,
    "activeIncidents": 3736,
    "lastDetected": "2025-06-02T15:27:56.875Z",
    "status": "active"
  },
  {
    "id": "attack-vector-106",
    "name": "Malware Attack 6",
    "category": "Malware",
    "severity": "critical",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 59.6,
    "activeIncidents": 3012,
    "lastDetected": "2024-12-07T17:00:38.057Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-107",
    "name": "Malware Attack 7",
    "category": "Malware",
    "severity": "high",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 76,
    "activeIncidents": 1510,
    "lastDetected": "2024-12-03T22:19:27.773Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-108",
    "name": "Malware Attack 8",
    "category": "Malware",
    "severity": "medium",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 52.3,
    "activeIncidents": 424,
    "lastDetected": "2025-05-06T02:30:45.724Z",
    "status": "active"
  },
  {
    "id": "attack-vector-109",
    "name": "Malware Attack 9",
    "category": "Malware",
    "severity": "medium",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 58.4,
    "activeIncidents": 986,
    "lastDetected": "2025-09-17T19:32:15.017Z",
    "status": "active"
  },
  {
    "id": "attack-vector-110",
    "name": "Malware Attack 10",
    "category": "Malware",
    "severity": "medium",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 61,
    "activeIncidents": 4063,
    "lastDetected": "2025-03-27T10:49:36.064Z",
    "status": "active"
  },
  {
    "id": "attack-vector-111",
    "name": "Malware Attack 11",
    "category": "Malware",
    "severity": "medium",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 42.9,
    "activeIncidents": 2764,
    "lastDetected": "2025-06-01T20:33:23.008Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-112",
    "name": "Malware Attack 12",
    "category": "Malware",
    "severity": "high",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 23.4,
    "activeIncidents": 3863,
    "lastDetected": "2024-11-19T09:53:46.854Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-113",
    "name": "Malware Attack 13",
    "category": "Malware",
    "severity": "medium",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 78.4,
    "activeIncidents": 3200,
    "lastDetected": "2025-02-08T18:28:48.391Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-114",
    "name": "Malware Attack 14",
    "category": "Malware",
    "severity": "critical",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 27.9,
    "activeIncidents": 1880,
    "lastDetected": "2025-02-28T10:35:49.601Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-115",
    "name": "Malware Attack 15",
    "category": "Malware",
    "severity": "medium",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 30.5,
    "activeIncidents": 4293,
    "lastDetected": "2025-09-07T21:39:17.527Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-116",
    "name": "Malware Attack 16",
    "category": "Malware",
    "severity": "high",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 44.7,
    "activeIncidents": 4026,
    "lastDetected": "2025-04-20T21:56:19.952Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-117",
    "name": "Malware Attack 17",
    "category": "Malware",
    "severity": "medium",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 23,
    "activeIncidents": 4903,
    "lastDetected": "2025-03-15T22:28:40.850Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-118",
    "name": "Malware Attack 18",
    "category": "Malware",
    "severity": "high",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 48.7,
    "activeIncidents": 121,
    "lastDetected": "2025-05-09T18:51:51.749Z",
    "status": "active"
  },
  {
    "id": "attack-vector-119",
    "name": "Malware Attack 19",
    "category": "Malware",
    "severity": "critical",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 69.1,
    "activeIncidents": 1714,
    "lastDetected": "2025-10-15T19:07:35.059Z",
    "status": "active"
  },
  {
    "id": "attack-vector-120",
    "name": "Malware Attack 20",
    "category": "Malware",
    "severity": "high",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 24.2,
    "activeIncidents": 1865,
    "lastDetected": "2025-08-15T19:31:30.501Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-121",
    "name": "Malware Attack 21",
    "category": "Malware",
    "severity": "high",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 39.6,
    "activeIncidents": 1609,
    "lastDetected": "2025-06-25T11:05:56.035Z",
    "status": "active"
  },
  {
    "id": "attack-vector-122",
    "name": "Malware Attack 22",
    "category": "Malware",
    "severity": "medium",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 46,
    "activeIncidents": 790,
    "lastDetected": "2025-10-13T05:39:46.197Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-123",
    "name": "Malware Attack 23",
    "category": "Malware",
    "severity": "critical",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 40.2,
    "activeIncidents": 4453,
    "lastDetected": "2025-09-24T08:12:16.127Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-124",
    "name": "Malware Attack 24",
    "category": "Malware",
    "severity": "medium",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 51.3,
    "activeIncidents": 2003,
    "lastDetected": "2025-03-16T12:26:57.356Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-125",
    "name": "Malware Attack 25",
    "category": "Malware",
    "severity": "high",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 50.1,
    "activeIncidents": 4424,
    "lastDetected": "2024-12-20T19:01:44.117Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-126",
    "name": "Malware Attack 26",
    "category": "Malware",
    "severity": "high",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 39,
    "activeIncidents": 4250,
    "lastDetected": "2025-08-18T18:15:08.878Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-127",
    "name": "Malware Attack 27",
    "category": "Malware",
    "severity": "critical",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 46.1,
    "activeIncidents": 4873,
    "lastDetected": "2025-06-27T00:07:42.267Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-128",
    "name": "Malware Attack 28",
    "category": "Malware",
    "severity": "low",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 21.5,
    "activeIncidents": 2859,
    "lastDetected": "2025-02-14T16:28:29.742Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-129",
    "name": "Malware Attack 29",
    "category": "Malware",
    "severity": "critical",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 21.7,
    "activeIncidents": 1165,
    "lastDetected": "2024-12-11T21:54:29.673Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-130",
    "name": "Malware Attack 30",
    "category": "Malware",
    "severity": "critical",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 63.7,
    "activeIncidents": 3071,
    "lastDetected": "2024-11-01T03:40:17.742Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-131",
    "name": "Malware Attack 31",
    "category": "Malware",
    "severity": "high",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 67.3,
    "activeIncidents": 3819,
    "lastDetected": "2025-09-02T14:28:58.561Z",
    "status": "active"
  },
  {
    "id": "attack-vector-132",
    "name": "Malware Attack 32",
    "category": "Malware",
    "severity": "critical",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 78,
    "activeIncidents": 134,
    "lastDetected": "2025-08-31T10:28:19.766Z",
    "status": "active"
  },
  {
    "id": "attack-vector-133",
    "name": "Malware Attack 33",
    "category": "Malware",
    "severity": "low",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 58.7,
    "activeIncidents": 3443,
    "lastDetected": "2025-05-03T15:02:41.938Z",
    "status": "active"
  },
  {
    "id": "attack-vector-134",
    "name": "Malware Attack 34",
    "category": "Malware",
    "severity": "critical",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 22.3,
    "activeIncidents": 1348,
    "lastDetected": "2025-02-07T16:31:58.713Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-135",
    "name": "Malware Attack 35",
    "category": "Malware",
    "severity": "critical",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 32.9,
    "activeIncidents": 3831,
    "lastDetected": "2025-01-22T15:39:56.698Z",
    "status": "active"
  },
  {
    "id": "attack-vector-136",
    "name": "Malware Attack 36",
    "category": "Malware",
    "severity": "medium",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 52.4,
    "activeIncidents": 3470,
    "lastDetected": "2025-08-08T18:31:58.634Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-137",
    "name": "Malware Attack 37",
    "category": "Malware",
    "severity": "high",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 30.4,
    "activeIncidents": 3771,
    "lastDetected": "2025-09-17T01:15:10.469Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-138",
    "name": "Malware Attack 38",
    "category": "Malware",
    "severity": "low",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 43.5,
    "activeIncidents": 1602,
    "lastDetected": "2025-09-23T04:02:49.936Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-139",
    "name": "Malware Attack 39",
    "category": "Malware",
    "severity": "low",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 20.8,
    "activeIncidents": 2888,
    "lastDetected": "2024-12-13T06:19:56.393Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-140",
    "name": "Malware Attack 40",
    "category": "Malware",
    "severity": "low",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 22.8,
    "activeIncidents": 2483,
    "lastDetected": "2025-07-03T11:03:30.538Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-141",
    "name": "Malware Attack 41",
    "category": "Malware",
    "severity": "medium",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 75,
    "activeIncidents": 2102,
    "lastDetected": "2025-02-09T09:23:49.094Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-142",
    "name": "Malware Attack 42",
    "category": "Malware",
    "severity": "medium",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 59.2,
    "activeIncidents": 4772,
    "lastDetected": "2024-11-13T09:51:07.084Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-143",
    "name": "Malware Attack 43",
    "category": "Malware",
    "severity": "medium",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 47.2,
    "activeIncidents": 3556,
    "lastDetected": "2025-09-29T06:19:38.244Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-144",
    "name": "Malware Attack 44",
    "category": "Malware",
    "severity": "critical",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 49.9,
    "activeIncidents": 2024,
    "lastDetected": "2024-12-21T21:31:08.283Z",
    "status": "active"
  },
  {
    "id": "attack-vector-145",
    "name": "Malware Attack 45",
    "category": "Malware",
    "severity": "medium",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 43.6,
    "activeIncidents": 1946,
    "lastDetected": "2024-12-07T17:56:01.179Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-146",
    "name": "Malware Attack 46",
    "category": "Malware",
    "severity": "medium",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 43.3,
    "activeIncidents": 4883,
    "lastDetected": "2024-11-05T15:49:53.963Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-147",
    "name": "Malware Attack 47",
    "category": "Malware",
    "severity": "medium",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 36.3,
    "activeIncidents": 4538,
    "lastDetected": "2025-02-10T10:20:15.746Z",
    "status": "active"
  },
  {
    "id": "attack-vector-148",
    "name": "Malware Attack 48",
    "category": "Malware",
    "severity": "high",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 69.6,
    "activeIncidents": 4711,
    "lastDetected": "2025-03-02T05:21:41.542Z",
    "status": "active"
  },
  {
    "id": "attack-vector-149",
    "name": "Malware Attack 49",
    "category": "Malware",
    "severity": "medium",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 64.6,
    "activeIncidents": 1135,
    "lastDetected": "2025-08-04T22:33:05.660Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-150",
    "name": "Malware Attack 50",
    "category": "Malware",
    "severity": "low",
    "description": "Real-world malware attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Malware",
      "Behavioral pattern in Malware",
      "Network signature of Malware"
    ],
    "mitigation": [
      "Security control for Malware",
      "Monitoring solution for Malware",
      "Response procedure for Malware"
    ],
    "detectionRate": 76.2,
    "activeIncidents": 4181,
    "lastDetected": "2025-08-11T12:42:34.401Z",
    "status": "active"
  },
  {
    "id": "attack-vector-151",
    "name": "Network Attacks Attack 1",
    "category": "Network Attacks",
    "severity": "medium",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 51.3,
    "activeIncidents": 2628,
    "lastDetected": "2024-12-10T16:56:50.611Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-152",
    "name": "Network Attacks Attack 2",
    "category": "Network Attacks",
    "severity": "low",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 73.8,
    "activeIncidents": 2918,
    "lastDetected": "2025-02-21T19:55:11.351Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-153",
    "name": "Network Attacks Attack 3",
    "category": "Network Attacks",
    "severity": "low",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 68.8,
    "activeIncidents": 2983,
    "lastDetected": "2024-10-31T20:43:00.762Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-154",
    "name": "Network Attacks Attack 4",
    "category": "Network Attacks",
    "severity": "low",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 72.9,
    "activeIncidents": 1054,
    "lastDetected": "2024-11-08T03:26:53.947Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-155",
    "name": "Network Attacks Attack 5",
    "category": "Network Attacks",
    "severity": "critical",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 51.6,
    "activeIncidents": 892,
    "lastDetected": "2025-06-21T14:12:55.393Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-156",
    "name": "Network Attacks Attack 6",
    "category": "Network Attacks",
    "severity": "critical",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 71.9,
    "activeIncidents": 3386,
    "lastDetected": "2024-11-03T15:42:59.708Z",
    "status": "active"
  },
  {
    "id": "attack-vector-157",
    "name": "Network Attacks Attack 7",
    "category": "Network Attacks",
    "severity": "medium",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 41.1,
    "activeIncidents": 156,
    "lastDetected": "2025-03-06T04:53:17.091Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-158",
    "name": "Network Attacks Attack 8",
    "category": "Network Attacks",
    "severity": "low",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 49.9,
    "activeIncidents": 949,
    "lastDetected": "2025-08-13T07:53:04.564Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-159",
    "name": "Network Attacks Attack 9",
    "category": "Network Attacks",
    "severity": "low",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 63.2,
    "activeIncidents": 4523,
    "lastDetected": "2025-03-14T17:25:51.365Z",
    "status": "active"
  },
  {
    "id": "attack-vector-160",
    "name": "Network Attacks Attack 10",
    "category": "Network Attacks",
    "severity": "medium",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 20.5,
    "activeIncidents": 4345,
    "lastDetected": "2025-07-01T13:33:02.658Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-161",
    "name": "Network Attacks Attack 11",
    "category": "Network Attacks",
    "severity": "medium",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 75.5,
    "activeIncidents": 3407,
    "lastDetected": "2025-04-08T13:19:18.198Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-162",
    "name": "Network Attacks Attack 12",
    "category": "Network Attacks",
    "severity": "high",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 71.8,
    "activeIncidents": 1115,
    "lastDetected": "2024-10-31T20:23:30.117Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-163",
    "name": "Network Attacks Attack 13",
    "category": "Network Attacks",
    "severity": "medium",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 75,
    "activeIncidents": 1484,
    "lastDetected": "2025-10-26T01:07:29.124Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-164",
    "name": "Network Attacks Attack 14",
    "category": "Network Attacks",
    "severity": "high",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 33.8,
    "activeIncidents": 783,
    "lastDetected": "2025-01-11T14:48:10.362Z",
    "status": "active"
  },
  {
    "id": "attack-vector-165",
    "name": "Network Attacks Attack 15",
    "category": "Network Attacks",
    "severity": "high",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 27.1,
    "activeIncidents": 1172,
    "lastDetected": "2024-12-13T22:22:07.997Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-166",
    "name": "Network Attacks Attack 16",
    "category": "Network Attacks",
    "severity": "high",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 69,
    "activeIncidents": 424,
    "lastDetected": "2025-09-26T15:27:43.391Z",
    "status": "active"
  },
  {
    "id": "attack-vector-167",
    "name": "Network Attacks Attack 17",
    "category": "Network Attacks",
    "severity": "low",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 58.5,
    "activeIncidents": 3580,
    "lastDetected": "2025-08-12T12:00:37.194Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-168",
    "name": "Network Attacks Attack 18",
    "category": "Network Attacks",
    "severity": "critical",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 43.7,
    "activeIncidents": 1105,
    "lastDetected": "2025-09-10T02:18:00.601Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-169",
    "name": "Network Attacks Attack 19",
    "category": "Network Attacks",
    "severity": "low",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 75.5,
    "activeIncidents": 2028,
    "lastDetected": "2025-04-21T12:06:01.268Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-170",
    "name": "Network Attacks Attack 20",
    "category": "Network Attacks",
    "severity": "high",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 76.6,
    "activeIncidents": 321,
    "lastDetected": "2025-09-15T14:54:31.620Z",
    "status": "active"
  },
  {
    "id": "attack-vector-171",
    "name": "Network Attacks Attack 21",
    "category": "Network Attacks",
    "severity": "medium",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 62,
    "activeIncidents": 4968,
    "lastDetected": "2025-04-08T01:42:22.729Z",
    "status": "active"
  },
  {
    "id": "attack-vector-172",
    "name": "Network Attacks Attack 22",
    "category": "Network Attacks",
    "severity": "medium",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 20.8,
    "activeIncidents": 3179,
    "lastDetected": "2025-01-01T20:58:10.644Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-173",
    "name": "Network Attacks Attack 23",
    "category": "Network Attacks",
    "severity": "low",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 54.4,
    "activeIncidents": 1914,
    "lastDetected": "2024-12-17T07:46:10.453Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-174",
    "name": "Network Attacks Attack 24",
    "category": "Network Attacks",
    "severity": "medium",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 49,
    "activeIncidents": 112,
    "lastDetected": "2024-11-15T14:47:33.243Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-175",
    "name": "Network Attacks Attack 25",
    "category": "Network Attacks",
    "severity": "low",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 52.3,
    "activeIncidents": 4967,
    "lastDetected": "2025-07-18T23:42:00.084Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-176",
    "name": "Network Attacks Attack 26",
    "category": "Network Attacks",
    "severity": "high",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 22.2,
    "activeIncidents": 2320,
    "lastDetected": "2025-05-16T23:37:32.889Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-177",
    "name": "Network Attacks Attack 27",
    "category": "Network Attacks",
    "severity": "medium",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 62.2,
    "activeIncidents": 151,
    "lastDetected": "2025-06-30T21:36:04.280Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-178",
    "name": "Network Attacks Attack 28",
    "category": "Network Attacks",
    "severity": "critical",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 44.7,
    "activeIncidents": 3770,
    "lastDetected": "2025-10-08T11:07:43.135Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-179",
    "name": "Network Attacks Attack 29",
    "category": "Network Attacks",
    "severity": "medium",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 33,
    "activeIncidents": 4287,
    "lastDetected": "2025-05-01T15:30:30.396Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-180",
    "name": "Network Attacks Attack 30",
    "category": "Network Attacks",
    "severity": "critical",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 65.2,
    "activeIncidents": 419,
    "lastDetected": "2025-09-13T08:19:02.453Z",
    "status": "active"
  },
  {
    "id": "attack-vector-181",
    "name": "Network Attacks Attack 31",
    "category": "Network Attacks",
    "severity": "medium",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 74.9,
    "activeIncidents": 2562,
    "lastDetected": "2025-02-01T20:18:55.398Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-182",
    "name": "Network Attacks Attack 32",
    "category": "Network Attacks",
    "severity": "low",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 27,
    "activeIncidents": 2259,
    "lastDetected": "2024-11-19T17:35:20.788Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-183",
    "name": "Network Attacks Attack 33",
    "category": "Network Attacks",
    "severity": "high",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 66.6,
    "activeIncidents": 2947,
    "lastDetected": "2025-03-26T22:47:52.206Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-184",
    "name": "Network Attacks Attack 34",
    "category": "Network Attacks",
    "severity": "critical",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 54.3,
    "activeIncidents": 2406,
    "lastDetected": "2025-02-13T10:31:14.688Z",
    "status": "active"
  },
  {
    "id": "attack-vector-185",
    "name": "Network Attacks Attack 35",
    "category": "Network Attacks",
    "severity": "low",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 34.3,
    "activeIncidents": 3434,
    "lastDetected": "2025-06-08T04:30:48.122Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-186",
    "name": "Network Attacks Attack 36",
    "category": "Network Attacks",
    "severity": "high",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 69.1,
    "activeIncidents": 643,
    "lastDetected": "2025-01-29T22:52:33.355Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-187",
    "name": "Network Attacks Attack 37",
    "category": "Network Attacks",
    "severity": "high",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 28.9,
    "activeIncidents": 4502,
    "lastDetected": "2024-11-09T03:38:16.418Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-188",
    "name": "Network Attacks Attack 38",
    "category": "Network Attacks",
    "severity": "critical",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 23.7,
    "activeIncidents": 1077,
    "lastDetected": "2025-02-18T14:54:21.795Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-189",
    "name": "Network Attacks Attack 39",
    "category": "Network Attacks",
    "severity": "high",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 63.1,
    "activeIncidents": 4904,
    "lastDetected": "2025-09-03T21:32:06.531Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-190",
    "name": "Network Attacks Attack 40",
    "category": "Network Attacks",
    "severity": "critical",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 74.9,
    "activeIncidents": 4460,
    "lastDetected": "2025-08-11T23:56:18.431Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-191",
    "name": "Network Attacks Attack 41",
    "category": "Network Attacks",
    "severity": "critical",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 73.8,
    "activeIncidents": 2204,
    "lastDetected": "2025-06-04T04:03:06.368Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-192",
    "name": "Network Attacks Attack 42",
    "category": "Network Attacks",
    "severity": "low",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 25.5,
    "activeIncidents": 3529,
    "lastDetected": "2025-08-13T19:16:05.192Z",
    "status": "active"
  },
  {
    "id": "attack-vector-193",
    "name": "Network Attacks Attack 43",
    "category": "Network Attacks",
    "severity": "high",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 31.8,
    "activeIncidents": 3888,
    "lastDetected": "2025-08-01T11:27:04.859Z",
    "status": "active"
  },
  {
    "id": "attack-vector-194",
    "name": "Network Attacks Attack 44",
    "category": "Network Attacks",
    "severity": "high",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 78.3,
    "activeIncidents": 3717,
    "lastDetected": "2025-01-17T09:47:15.491Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-195",
    "name": "Network Attacks Attack 45",
    "category": "Network Attacks",
    "severity": "low",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 58.3,
    "activeIncidents": 2187,
    "lastDetected": "2025-10-05T21:30:09.813Z",
    "status": "active"
  },
  {
    "id": "attack-vector-196",
    "name": "Network Attacks Attack 46",
    "category": "Network Attacks",
    "severity": "high",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 57.6,
    "activeIncidents": 632,
    "lastDetected": "2024-11-09T09:07:53.607Z",
    "status": "active"
  },
  {
    "id": "attack-vector-197",
    "name": "Network Attacks Attack 47",
    "category": "Network Attacks",
    "severity": "high",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 61.2,
    "activeIncidents": 112,
    "lastDetected": "2025-07-18T00:46:31.685Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-198",
    "name": "Network Attacks Attack 48",
    "category": "Network Attacks",
    "severity": "low",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 28.7,
    "activeIncidents": 4509,
    "lastDetected": "2025-01-29T10:05:15.260Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-199",
    "name": "Network Attacks Attack 49",
    "category": "Network Attacks",
    "severity": "low",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 45.7,
    "activeIncidents": 2811,
    "lastDetected": "2024-11-02T08:47:38.421Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-200",
    "name": "Network Attacks Attack 50",
    "category": "Network Attacks",
    "severity": "critical",
    "description": "Real-world network attacks attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Network Attacks",
      "Behavioral pattern in Network Attacks",
      "Network signature of Network Attacks"
    ],
    "mitigation": [
      "Security control for Network Attacks",
      "Monitoring solution for Network Attacks",
      "Response procedure for Network Attacks"
    ],
    "detectionRate": 71,
    "activeIncidents": 2153,
    "lastDetected": "2024-11-16T03:16:48.989Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-201",
    "name": "Social Engineering Attack 1",
    "category": "Social Engineering",
    "severity": "high",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 26.3,
    "activeIncidents": 1300,
    "lastDetected": "2024-12-14T16:57:44.748Z",
    "status": "active"
  },
  {
    "id": "attack-vector-202",
    "name": "Social Engineering Attack 2",
    "category": "Social Engineering",
    "severity": "low",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 52.9,
    "activeIncidents": 1714,
    "lastDetected": "2025-02-16T10:36:02.247Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-203",
    "name": "Social Engineering Attack 3",
    "category": "Social Engineering",
    "severity": "critical",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 46,
    "activeIncidents": 4842,
    "lastDetected": "2025-07-24T08:42:17.060Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-204",
    "name": "Social Engineering Attack 4",
    "category": "Social Engineering",
    "severity": "high",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 49.5,
    "activeIncidents": 3062,
    "lastDetected": "2025-01-26T03:59:27.304Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-205",
    "name": "Social Engineering Attack 5",
    "category": "Social Engineering",
    "severity": "critical",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 32.5,
    "activeIncidents": 3666,
    "lastDetected": "2025-01-05T06:18:32.216Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-206",
    "name": "Social Engineering Attack 6",
    "category": "Social Engineering",
    "severity": "medium",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 50.5,
    "activeIncidents": 2660,
    "lastDetected": "2025-08-13T02:36:51.852Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-207",
    "name": "Social Engineering Attack 7",
    "category": "Social Engineering",
    "severity": "high",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 48,
    "activeIncidents": 754,
    "lastDetected": "2025-04-20T07:04:33.737Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-208",
    "name": "Social Engineering Attack 8",
    "category": "Social Engineering",
    "severity": "critical",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 74.4,
    "activeIncidents": 924,
    "lastDetected": "2025-10-16T14:00:20.225Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-209",
    "name": "Social Engineering Attack 9",
    "category": "Social Engineering",
    "severity": "low",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 42.4,
    "activeIncidents": 4007,
    "lastDetected": "2025-05-06T21:46:20.028Z",
    "status": "active"
  },
  {
    "id": "attack-vector-210",
    "name": "Social Engineering Attack 10",
    "category": "Social Engineering",
    "severity": "medium",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 40.1,
    "activeIncidents": 3467,
    "lastDetected": "2024-12-28T18:16:51.005Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-211",
    "name": "Social Engineering Attack 11",
    "category": "Social Engineering",
    "severity": "high",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 45.8,
    "activeIncidents": 2216,
    "lastDetected": "2025-09-01T10:41:07.202Z",
    "status": "active"
  },
  {
    "id": "attack-vector-212",
    "name": "Social Engineering Attack 12",
    "category": "Social Engineering",
    "severity": "low",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 26.4,
    "activeIncidents": 606,
    "lastDetected": "2025-05-17T07:15:55.067Z",
    "status": "active"
  },
  {
    "id": "attack-vector-213",
    "name": "Social Engineering Attack 13",
    "category": "Social Engineering",
    "severity": "critical",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 54.4,
    "activeIncidents": 3433,
    "lastDetected": "2025-04-28T19:50:21.675Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-214",
    "name": "Social Engineering Attack 14",
    "category": "Social Engineering",
    "severity": "high",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 43.3,
    "activeIncidents": 1504,
    "lastDetected": "2025-04-08T01:32:40.520Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-215",
    "name": "Social Engineering Attack 15",
    "category": "Social Engineering",
    "severity": "critical",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 32.2,
    "activeIncidents": 2650,
    "lastDetected": "2025-02-22T02:32:36.229Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-216",
    "name": "Social Engineering Attack 16",
    "category": "Social Engineering",
    "severity": "high",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 67.5,
    "activeIncidents": 799,
    "lastDetected": "2025-09-17T11:39:36.269Z",
    "status": "active"
  },
  {
    "id": "attack-vector-217",
    "name": "Social Engineering Attack 17",
    "category": "Social Engineering",
    "severity": "critical",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 32.3,
    "activeIncidents": 2438,
    "lastDetected": "2025-04-10T14:36:29.972Z",
    "status": "active"
  },
  {
    "id": "attack-vector-218",
    "name": "Social Engineering Attack 18",
    "category": "Social Engineering",
    "severity": "critical",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 24.4,
    "activeIncidents": 807,
    "lastDetected": "2025-04-08T17:56:09.436Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-219",
    "name": "Social Engineering Attack 19",
    "category": "Social Engineering",
    "severity": "high",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 45.1,
    "activeIncidents": 1190,
    "lastDetected": "2025-02-03T15:23:29.647Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-220",
    "name": "Social Engineering Attack 20",
    "category": "Social Engineering",
    "severity": "high",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 65.4,
    "activeIncidents": 3688,
    "lastDetected": "2024-12-27T13:08:08.557Z",
    "status": "active"
  },
  {
    "id": "attack-vector-221",
    "name": "Social Engineering Attack 21",
    "category": "Social Engineering",
    "severity": "medium",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 53.2,
    "activeIncidents": 343,
    "lastDetected": "2025-07-30T05:56:11.217Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-222",
    "name": "Social Engineering Attack 22",
    "category": "Social Engineering",
    "severity": "critical",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 69.6,
    "activeIncidents": 3083,
    "lastDetected": "2025-05-02T00:21:32.615Z",
    "status": "active"
  },
  {
    "id": "attack-vector-223",
    "name": "Social Engineering Attack 23",
    "category": "Social Engineering",
    "severity": "critical",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 28.5,
    "activeIncidents": 4259,
    "lastDetected": "2024-12-14T17:30:28.638Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-224",
    "name": "Social Engineering Attack 24",
    "category": "Social Engineering",
    "severity": "high",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 47.1,
    "activeIncidents": 4860,
    "lastDetected": "2025-05-10T10:36:20.963Z",
    "status": "active"
  },
  {
    "id": "attack-vector-225",
    "name": "Social Engineering Attack 25",
    "category": "Social Engineering",
    "severity": "low",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 38.6,
    "activeIncidents": 2130,
    "lastDetected": "2025-02-23T06:48:26.073Z",
    "status": "active"
  },
  {
    "id": "attack-vector-226",
    "name": "Social Engineering Attack 26",
    "category": "Social Engineering",
    "severity": "low",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 21.1,
    "activeIncidents": 1256,
    "lastDetected": "2024-11-10T22:36:18.238Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-227",
    "name": "Social Engineering Attack 27",
    "category": "Social Engineering",
    "severity": "low",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 66.7,
    "activeIncidents": 39,
    "lastDetected": "2025-03-24T02:05:40.142Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-228",
    "name": "Social Engineering Attack 28",
    "category": "Social Engineering",
    "severity": "medium",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 73.5,
    "activeIncidents": 4325,
    "lastDetected": "2025-02-12T22:00:36.557Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-229",
    "name": "Social Engineering Attack 29",
    "category": "Social Engineering",
    "severity": "high",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 49.9,
    "activeIncidents": 538,
    "lastDetected": "2024-12-19T18:07:56.655Z",
    "status": "active"
  },
  {
    "id": "attack-vector-230",
    "name": "Social Engineering Attack 30",
    "category": "Social Engineering",
    "severity": "critical",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 63.1,
    "activeIncidents": 4929,
    "lastDetected": "2025-10-08T05:27:23.611Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-231",
    "name": "Social Engineering Attack 31",
    "category": "Social Engineering",
    "severity": "low",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 43.5,
    "activeIncidents": 729,
    "lastDetected": "2025-09-04T02:40:34.063Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-232",
    "name": "Social Engineering Attack 32",
    "category": "Social Engineering",
    "severity": "critical",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 52.5,
    "activeIncidents": 3037,
    "lastDetected": "2025-09-03T11:28:29.404Z",
    "status": "active"
  },
  {
    "id": "attack-vector-233",
    "name": "Social Engineering Attack 33",
    "category": "Social Engineering",
    "severity": "medium",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 47.8,
    "activeIncidents": 2117,
    "lastDetected": "2025-09-28T05:50:53.745Z",
    "status": "active"
  },
  {
    "id": "attack-vector-234",
    "name": "Social Engineering Attack 34",
    "category": "Social Engineering",
    "severity": "medium",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 38.1,
    "activeIncidents": 1874,
    "lastDetected": "2024-12-26T17:13:28.000Z",
    "status": "active"
  },
  {
    "id": "attack-vector-235",
    "name": "Social Engineering Attack 35",
    "category": "Social Engineering",
    "severity": "medium",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 67.3,
    "activeIncidents": 1640,
    "lastDetected": "2024-11-29T11:20:59.582Z",
    "status": "active"
  },
  {
    "id": "attack-vector-236",
    "name": "Social Engineering Attack 36",
    "category": "Social Engineering",
    "severity": "high",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 55.7,
    "activeIncidents": 1876,
    "lastDetected": "2025-02-24T03:40:00.582Z",
    "status": "active"
  },
  {
    "id": "attack-vector-237",
    "name": "Social Engineering Attack 37",
    "category": "Social Engineering",
    "severity": "medium",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 66.2,
    "activeIncidents": 3950,
    "lastDetected": "2025-02-14T21:06:46.655Z",
    "status": "active"
  },
  {
    "id": "attack-vector-238",
    "name": "Social Engineering Attack 38",
    "category": "Social Engineering",
    "severity": "medium",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 39.9,
    "activeIncidents": 4031,
    "lastDetected": "2025-02-09T23:42:21.183Z",
    "status": "active"
  },
  {
    "id": "attack-vector-239",
    "name": "Social Engineering Attack 39",
    "category": "Social Engineering",
    "severity": "high",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 76.9,
    "activeIncidents": 4119,
    "lastDetected": "2025-09-12T22:03:41.372Z",
    "status": "active"
  },
  {
    "id": "attack-vector-240",
    "name": "Social Engineering Attack 40",
    "category": "Social Engineering",
    "severity": "low",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 23.6,
    "activeIncidents": 4243,
    "lastDetected": "2025-04-07T23:40:28.509Z",
    "status": "active"
  },
  {
    "id": "attack-vector-241",
    "name": "Social Engineering Attack 41",
    "category": "Social Engineering",
    "severity": "medium",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 77.2,
    "activeIncidents": 3680,
    "lastDetected": "2025-07-13T10:36:27.443Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-242",
    "name": "Social Engineering Attack 42",
    "category": "Social Engineering",
    "severity": "high",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 44.9,
    "activeIncidents": 139,
    "lastDetected": "2025-02-25T02:58:39.726Z",
    "status": "active"
  },
  {
    "id": "attack-vector-243",
    "name": "Social Engineering Attack 43",
    "category": "Social Engineering",
    "severity": "high",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 41.4,
    "activeIncidents": 2647,
    "lastDetected": "2025-02-03T04:39:44.021Z",
    "status": "active"
  },
  {
    "id": "attack-vector-244",
    "name": "Social Engineering Attack 44",
    "category": "Social Engineering",
    "severity": "high",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 72,
    "activeIncidents": 3773,
    "lastDetected": "2025-07-16T17:50:55.846Z",
    "status": "active"
  },
  {
    "id": "attack-vector-245",
    "name": "Social Engineering Attack 45",
    "category": "Social Engineering",
    "severity": "critical",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 49.7,
    "activeIncidents": 343,
    "lastDetected": "2025-03-07T23:16:34.973Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-246",
    "name": "Social Engineering Attack 46",
    "category": "Social Engineering",
    "severity": "critical",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 26.3,
    "activeIncidents": 1774,
    "lastDetected": "2025-05-11T12:11:58.679Z",
    "status": "active"
  },
  {
    "id": "attack-vector-247",
    "name": "Social Engineering Attack 47",
    "category": "Social Engineering",
    "severity": "medium",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 37.7,
    "activeIncidents": 3974,
    "lastDetected": "2025-03-08T03:06:38.098Z",
    "status": "active"
  },
  {
    "id": "attack-vector-248",
    "name": "Social Engineering Attack 48",
    "category": "Social Engineering",
    "severity": "high",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 38.4,
    "activeIncidents": 4036,
    "lastDetected": "2025-03-21T20:52:01.532Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-249",
    "name": "Social Engineering Attack 49",
    "category": "Social Engineering",
    "severity": "critical",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 73,
    "activeIncidents": 1579,
    "lastDetected": "2025-07-08T19:33:00.794Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-250",
    "name": "Social Engineering Attack 50",
    "category": "Social Engineering",
    "severity": "critical",
    "description": "Real-world social engineering attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Social Engineering",
      "Behavioral pattern in Social Engineering",
      "Network signature of Social Engineering"
    ],
    "mitigation": [
      "Security control for Social Engineering",
      "Monitoring solution for Social Engineering",
      "Response procedure for Social Engineering"
    ],
    "detectionRate": 51,
    "activeIncidents": 4915,
    "lastDetected": "2025-05-27T06:38:36.314Z",
    "status": "active"
  },
  {
    "id": "attack-vector-251",
    "name": "Data Breaches Attack 1",
    "category": "Data Breaches",
    "severity": "critical",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 74.2,
    "activeIncidents": 883,
    "lastDetected": "2025-08-09T22:30:47.815Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-252",
    "name": "Data Breaches Attack 2",
    "category": "Data Breaches",
    "severity": "low",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 75.2,
    "activeIncidents": 3368,
    "lastDetected": "2025-04-12T12:59:11.652Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-253",
    "name": "Data Breaches Attack 3",
    "category": "Data Breaches",
    "severity": "high",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 22.4,
    "activeIncidents": 2729,
    "lastDetected": "2025-08-29T06:33:48.961Z",
    "status": "active"
  },
  {
    "id": "attack-vector-254",
    "name": "Data Breaches Attack 4",
    "category": "Data Breaches",
    "severity": "medium",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 34,
    "activeIncidents": 31,
    "lastDetected": "2025-05-22T03:13:58.986Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-255",
    "name": "Data Breaches Attack 5",
    "category": "Data Breaches",
    "severity": "medium",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 35.4,
    "activeIncidents": 504,
    "lastDetected": "2024-12-31T22:08:56.452Z",
    "status": "active"
  },
  {
    "id": "attack-vector-256",
    "name": "Data Breaches Attack 6",
    "category": "Data Breaches",
    "severity": "low",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 78.2,
    "activeIncidents": 2562,
    "lastDetected": "2025-09-19T06:49:47.691Z",
    "status": "active"
  },
  {
    "id": "attack-vector-257",
    "name": "Data Breaches Attack 7",
    "category": "Data Breaches",
    "severity": "medium",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 65.7,
    "activeIncidents": 2817,
    "lastDetected": "2025-07-25T09:19:50.095Z",
    "status": "active"
  },
  {
    "id": "attack-vector-258",
    "name": "Data Breaches Attack 8",
    "category": "Data Breaches",
    "severity": "high",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 24.2,
    "activeIncidents": 4754,
    "lastDetected": "2025-10-06T11:18:13.538Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-259",
    "name": "Data Breaches Attack 9",
    "category": "Data Breaches",
    "severity": "critical",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 77.6,
    "activeIncidents": 2460,
    "lastDetected": "2025-01-24T09:28:08.314Z",
    "status": "active"
  },
  {
    "id": "attack-vector-260",
    "name": "Data Breaches Attack 10",
    "category": "Data Breaches",
    "severity": "low",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 71,
    "activeIncidents": 1,
    "lastDetected": "2025-01-31T12:45:02.092Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-261",
    "name": "Data Breaches Attack 11",
    "category": "Data Breaches",
    "severity": "low",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 46.4,
    "activeIncidents": 3601,
    "lastDetected": "2025-09-14T12:18:21.905Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-262",
    "name": "Data Breaches Attack 12",
    "category": "Data Breaches",
    "severity": "high",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 63.5,
    "activeIncidents": 3030,
    "lastDetected": "2024-12-18T23:40:39.791Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-263",
    "name": "Data Breaches Attack 13",
    "category": "Data Breaches",
    "severity": "low",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 21.2,
    "activeIncidents": 1758,
    "lastDetected": "2025-03-11T04:47:06.956Z",
    "status": "active"
  },
  {
    "id": "attack-vector-264",
    "name": "Data Breaches Attack 14",
    "category": "Data Breaches",
    "severity": "low",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 73.6,
    "activeIncidents": 1291,
    "lastDetected": "2025-04-14T20:23:39.393Z",
    "status": "active"
  },
  {
    "id": "attack-vector-265",
    "name": "Data Breaches Attack 15",
    "category": "Data Breaches",
    "severity": "high",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 54,
    "activeIncidents": 123,
    "lastDetected": "2024-12-02T16:33:51.987Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-266",
    "name": "Data Breaches Attack 16",
    "category": "Data Breaches",
    "severity": "medium",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 63.7,
    "activeIncidents": 2584,
    "lastDetected": "2025-04-19T05:42:08.654Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-267",
    "name": "Data Breaches Attack 17",
    "category": "Data Breaches",
    "severity": "critical",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 34.6,
    "activeIncidents": 2700,
    "lastDetected": "2025-09-08T22:18:37.459Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-268",
    "name": "Data Breaches Attack 18",
    "category": "Data Breaches",
    "severity": "low",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 26.5,
    "activeIncidents": 168,
    "lastDetected": "2025-03-23T16:36:25.480Z",
    "status": "active"
  },
  {
    "id": "attack-vector-269",
    "name": "Data Breaches Attack 19",
    "category": "Data Breaches",
    "severity": "critical",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 41.9,
    "activeIncidents": 2226,
    "lastDetected": "2025-01-10T22:27:40.890Z",
    "status": "active"
  },
  {
    "id": "attack-vector-270",
    "name": "Data Breaches Attack 20",
    "category": "Data Breaches",
    "severity": "critical",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 62.5,
    "activeIncidents": 2866,
    "lastDetected": "2024-11-03T08:45:14.737Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-271",
    "name": "Data Breaches Attack 21",
    "category": "Data Breaches",
    "severity": "high",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 53.6,
    "activeIncidents": 509,
    "lastDetected": "2025-02-08T19:09:08.340Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-272",
    "name": "Data Breaches Attack 22",
    "category": "Data Breaches",
    "severity": "low",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 52.6,
    "activeIncidents": 2602,
    "lastDetected": "2025-10-08T02:24:08.403Z",
    "status": "active"
  },
  {
    "id": "attack-vector-273",
    "name": "Data Breaches Attack 23",
    "category": "Data Breaches",
    "severity": "low",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 58.5,
    "activeIncidents": 4949,
    "lastDetected": "2025-10-18T01:20:05.602Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-274",
    "name": "Data Breaches Attack 24",
    "category": "Data Breaches",
    "severity": "high",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 50.9,
    "activeIncidents": 4960,
    "lastDetected": "2025-05-26T21:39:04.247Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-275",
    "name": "Data Breaches Attack 25",
    "category": "Data Breaches",
    "severity": "medium",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 57,
    "activeIncidents": 4408,
    "lastDetected": "2025-06-17T04:27:26.791Z",
    "status": "active"
  },
  {
    "id": "attack-vector-276",
    "name": "Data Breaches Attack 26",
    "category": "Data Breaches",
    "severity": "critical",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 65.7,
    "activeIncidents": 818,
    "lastDetected": "2025-02-06T17:40:58.235Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-277",
    "name": "Data Breaches Attack 27",
    "category": "Data Breaches",
    "severity": "critical",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 39.4,
    "activeIncidents": 4813,
    "lastDetected": "2025-10-29T12:16:26.315Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-278",
    "name": "Data Breaches Attack 28",
    "category": "Data Breaches",
    "severity": "high",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 54.7,
    "activeIncidents": 4320,
    "lastDetected": "2025-06-04T01:37:24.992Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-279",
    "name": "Data Breaches Attack 29",
    "category": "Data Breaches",
    "severity": "low",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 22.1,
    "activeIncidents": 910,
    "lastDetected": "2024-12-28T20:56:27.065Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-280",
    "name": "Data Breaches Attack 30",
    "category": "Data Breaches",
    "severity": "medium",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 27.2,
    "activeIncidents": 523,
    "lastDetected": "2025-06-30T13:41:06.504Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-281",
    "name": "Data Breaches Attack 31",
    "category": "Data Breaches",
    "severity": "medium",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 64.8,
    "activeIncidents": 1118,
    "lastDetected": "2025-05-03T08:49:40.168Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-282",
    "name": "Data Breaches Attack 32",
    "category": "Data Breaches",
    "severity": "critical",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 37.6,
    "activeIncidents": 4700,
    "lastDetected": "2025-08-02T12:54:57.610Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-283",
    "name": "Data Breaches Attack 33",
    "category": "Data Breaches",
    "severity": "critical",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 76.8,
    "activeIncidents": 4885,
    "lastDetected": "2025-05-14T02:43:45.836Z",
    "status": "active"
  },
  {
    "id": "attack-vector-284",
    "name": "Data Breaches Attack 34",
    "category": "Data Breaches",
    "severity": "critical",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 58.7,
    "activeIncidents": 1201,
    "lastDetected": "2024-11-14T12:37:31.033Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-285",
    "name": "Data Breaches Attack 35",
    "category": "Data Breaches",
    "severity": "high",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 64.9,
    "activeIncidents": 3857,
    "lastDetected": "2025-06-19T03:37:15.558Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-286",
    "name": "Data Breaches Attack 36",
    "category": "Data Breaches",
    "severity": "medium",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 48.6,
    "activeIncidents": 3705,
    "lastDetected": "2025-04-23T15:11:54.659Z",
    "status": "active"
  },
  {
    "id": "attack-vector-287",
    "name": "Data Breaches Attack 37",
    "category": "Data Breaches",
    "severity": "critical",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 67.9,
    "activeIncidents": 4857,
    "lastDetected": "2025-04-16T14:28:14.128Z",
    "status": "active"
  },
  {
    "id": "attack-vector-288",
    "name": "Data Breaches Attack 38",
    "category": "Data Breaches",
    "severity": "medium",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 44.5,
    "activeIncidents": 3114,
    "lastDetected": "2025-03-17T23:06:01.524Z",
    "status": "active"
  },
  {
    "id": "attack-vector-289",
    "name": "Data Breaches Attack 39",
    "category": "Data Breaches",
    "severity": "medium",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 56.3,
    "activeIncidents": 334,
    "lastDetected": "2025-04-04T02:51:01.549Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-290",
    "name": "Data Breaches Attack 40",
    "category": "Data Breaches",
    "severity": "medium",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 23,
    "activeIncidents": 1976,
    "lastDetected": "2025-09-24T19:03:17.002Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-291",
    "name": "Data Breaches Attack 41",
    "category": "Data Breaches",
    "severity": "critical",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 33.2,
    "activeIncidents": 858,
    "lastDetected": "2025-05-21T20:18:03.836Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-292",
    "name": "Data Breaches Attack 42",
    "category": "Data Breaches",
    "severity": "critical",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 27,
    "activeIncidents": 2158,
    "lastDetected": "2025-03-03T21:00:55.464Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-293",
    "name": "Data Breaches Attack 43",
    "category": "Data Breaches",
    "severity": "medium",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 57,
    "activeIncidents": 2339,
    "lastDetected": "2025-01-13T12:54:03.644Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-294",
    "name": "Data Breaches Attack 44",
    "category": "Data Breaches",
    "severity": "low",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 25.5,
    "activeIncidents": 2378,
    "lastDetected": "2025-05-24T08:18:15.721Z",
    "status": "active"
  },
  {
    "id": "attack-vector-295",
    "name": "Data Breaches Attack 45",
    "category": "Data Breaches",
    "severity": "critical",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 76.7,
    "activeIncidents": 2097,
    "lastDetected": "2025-02-01T07:58:59.610Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-296",
    "name": "Data Breaches Attack 46",
    "category": "Data Breaches",
    "severity": "high",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 65.1,
    "activeIncidents": 4462,
    "lastDetected": "2025-01-21T23:39:49.166Z",
    "status": "active"
  },
  {
    "id": "attack-vector-297",
    "name": "Data Breaches Attack 47",
    "category": "Data Breaches",
    "severity": "high",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 22.8,
    "activeIncidents": 1727,
    "lastDetected": "2025-03-27T08:19:44.165Z",
    "status": "active"
  },
  {
    "id": "attack-vector-298",
    "name": "Data Breaches Attack 48",
    "category": "Data Breaches",
    "severity": "critical",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 34.6,
    "activeIncidents": 1160,
    "lastDetected": "2025-03-24T13:11:15.135Z",
    "status": "active"
  },
  {
    "id": "attack-vector-299",
    "name": "Data Breaches Attack 49",
    "category": "Data Breaches",
    "severity": "high",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 27.1,
    "activeIncidents": 1884,
    "lastDetected": "2025-08-05T19:54:38.026Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-300",
    "name": "Data Breaches Attack 50",
    "category": "Data Breaches",
    "severity": "medium",
    "description": "Real-world data breaches attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Data Breaches",
      "Behavioral pattern in Data Breaches",
      "Network signature of Data Breaches"
    ],
    "mitigation": [
      "Security control for Data Breaches",
      "Monitoring solution for Data Breaches",
      "Response procedure for Data Breaches"
    ],
    "detectionRate": 57.6,
    "activeIncidents": 3510,
    "lastDetected": "2025-02-28T23:14:25.196Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-301",
    "name": "IoT Threats Attack 1",
    "category": "IoT Threats",
    "severity": "low",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 45.2,
    "activeIncidents": 1195,
    "lastDetected": "2025-04-05T06:10:00.722Z",
    "status": "active"
  },
  {
    "id": "attack-vector-302",
    "name": "IoT Threats Attack 2",
    "category": "IoT Threats",
    "severity": "high",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 52.1,
    "activeIncidents": 3100,
    "lastDetected": "2025-05-29T16:49:28.839Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-303",
    "name": "IoT Threats Attack 3",
    "category": "IoT Threats",
    "severity": "critical",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 41.9,
    "activeIncidents": 1462,
    "lastDetected": "2025-07-17T15:34:48.480Z",
    "status": "active"
  },
  {
    "id": "attack-vector-304",
    "name": "IoT Threats Attack 4",
    "category": "IoT Threats",
    "severity": "low",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 45.5,
    "activeIncidents": 2366,
    "lastDetected": "2025-09-24T02:34:05.321Z",
    "status": "active"
  },
  {
    "id": "attack-vector-305",
    "name": "IoT Threats Attack 5",
    "category": "IoT Threats",
    "severity": "high",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 28.8,
    "activeIncidents": 1172,
    "lastDetected": "2024-11-15T01:50:54.271Z",
    "status": "active"
  },
  {
    "id": "attack-vector-306",
    "name": "IoT Threats Attack 6",
    "category": "IoT Threats",
    "severity": "low",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 67.3,
    "activeIncidents": 1976,
    "lastDetected": "2024-11-06T22:23:43.781Z",
    "status": "active"
  },
  {
    "id": "attack-vector-307",
    "name": "IoT Threats Attack 7",
    "category": "IoT Threats",
    "severity": "low",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 28.2,
    "activeIncidents": 2375,
    "lastDetected": "2024-11-02T16:10:16.497Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-308",
    "name": "IoT Threats Attack 8",
    "category": "IoT Threats",
    "severity": "low",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 41.6,
    "activeIncidents": 2466,
    "lastDetected": "2025-06-19T16:34:48.212Z",
    "status": "active"
  },
  {
    "id": "attack-vector-309",
    "name": "IoT Threats Attack 9",
    "category": "IoT Threats",
    "severity": "critical",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 61.8,
    "activeIncidents": 193,
    "lastDetected": "2025-07-05T04:25:20.625Z",
    "status": "active"
  },
  {
    "id": "attack-vector-310",
    "name": "IoT Threats Attack 10",
    "category": "IoT Threats",
    "severity": "low",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 77.6,
    "activeIncidents": 1601,
    "lastDetected": "2025-03-06T23:05:49.371Z",
    "status": "active"
  },
  {
    "id": "attack-vector-311",
    "name": "IoT Threats Attack 11",
    "category": "IoT Threats",
    "severity": "medium",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 74.5,
    "activeIncidents": 4182,
    "lastDetected": "2025-08-18T07:21:59.868Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-312",
    "name": "IoT Threats Attack 12",
    "category": "IoT Threats",
    "severity": "critical",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 70.3,
    "activeIncidents": 4886,
    "lastDetected": "2025-04-19T09:01:19.951Z",
    "status": "active"
  },
  {
    "id": "attack-vector-313",
    "name": "IoT Threats Attack 13",
    "category": "IoT Threats",
    "severity": "medium",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 32.2,
    "activeIncidents": 3354,
    "lastDetected": "2025-01-25T17:00:47.814Z",
    "status": "active"
  },
  {
    "id": "attack-vector-314",
    "name": "IoT Threats Attack 14",
    "category": "IoT Threats",
    "severity": "critical",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 33.4,
    "activeIncidents": 3747,
    "lastDetected": "2025-10-10T19:47:39.006Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-315",
    "name": "IoT Threats Attack 15",
    "category": "IoT Threats",
    "severity": "low",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 41.9,
    "activeIncidents": 1774,
    "lastDetected": "2025-10-09T03:51:19.504Z",
    "status": "active"
  },
  {
    "id": "attack-vector-316",
    "name": "IoT Threats Attack 16",
    "category": "IoT Threats",
    "severity": "medium",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 52,
    "activeIncidents": 1693,
    "lastDetected": "2025-06-13T20:06:22.435Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-317",
    "name": "IoT Threats Attack 17",
    "category": "IoT Threats",
    "severity": "high",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 78.8,
    "activeIncidents": 2614,
    "lastDetected": "2025-03-06T03:43:18.373Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-318",
    "name": "IoT Threats Attack 18",
    "category": "IoT Threats",
    "severity": "low",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 67.4,
    "activeIncidents": 1938,
    "lastDetected": "2025-08-06T13:34:56.961Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-319",
    "name": "IoT Threats Attack 19",
    "category": "IoT Threats",
    "severity": "high",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 66.8,
    "activeIncidents": 2460,
    "lastDetected": "2024-10-30T00:06:36.569Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-320",
    "name": "IoT Threats Attack 20",
    "category": "IoT Threats",
    "severity": "medium",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 40.1,
    "activeIncidents": 1028,
    "lastDetected": "2025-08-28T01:31:40.696Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-321",
    "name": "IoT Threats Attack 21",
    "category": "IoT Threats",
    "severity": "medium",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 22.3,
    "activeIncidents": 4775,
    "lastDetected": "2025-01-24T06:38:54.398Z",
    "status": "active"
  },
  {
    "id": "attack-vector-322",
    "name": "IoT Threats Attack 22",
    "category": "IoT Threats",
    "severity": "medium",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 63.2,
    "activeIncidents": 1474,
    "lastDetected": "2025-06-30T12:43:26.592Z",
    "status": "active"
  },
  {
    "id": "attack-vector-323",
    "name": "IoT Threats Attack 23",
    "category": "IoT Threats",
    "severity": "high",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 61.5,
    "activeIncidents": 777,
    "lastDetected": "2025-03-08T15:54:40.410Z",
    "status": "active"
  },
  {
    "id": "attack-vector-324",
    "name": "IoT Threats Attack 24",
    "category": "IoT Threats",
    "severity": "medium",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 72.4,
    "activeIncidents": 3716,
    "lastDetected": "2025-06-07T21:15:20.202Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-325",
    "name": "IoT Threats Attack 25",
    "category": "IoT Threats",
    "severity": "low",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 31.9,
    "activeIncidents": 775,
    "lastDetected": "2025-08-09T23:12:49.496Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-326",
    "name": "IoT Threats Attack 26",
    "category": "IoT Threats",
    "severity": "low",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 75.4,
    "activeIncidents": 1704,
    "lastDetected": "2025-01-29T10:44:26.633Z",
    "status": "active"
  },
  {
    "id": "attack-vector-327",
    "name": "IoT Threats Attack 27",
    "category": "IoT Threats",
    "severity": "high",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 60.8,
    "activeIncidents": 4646,
    "lastDetected": "2025-05-24T02:13:54.233Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-328",
    "name": "IoT Threats Attack 28",
    "category": "IoT Threats",
    "severity": "medium",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 42.9,
    "activeIncidents": 4336,
    "lastDetected": "2025-04-27T02:43:51.628Z",
    "status": "active"
  },
  {
    "id": "attack-vector-329",
    "name": "IoT Threats Attack 29",
    "category": "IoT Threats",
    "severity": "low",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 71.4,
    "activeIncidents": 4527,
    "lastDetected": "2025-03-01T22:18:11.727Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-330",
    "name": "IoT Threats Attack 30",
    "category": "IoT Threats",
    "severity": "medium",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 31.9,
    "activeIncidents": 2596,
    "lastDetected": "2025-05-06T07:18:32.959Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-331",
    "name": "IoT Threats Attack 31",
    "category": "IoT Threats",
    "severity": "low",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 48.1,
    "activeIncidents": 120,
    "lastDetected": "2025-01-01T02:16:06.729Z",
    "status": "active"
  },
  {
    "id": "attack-vector-332",
    "name": "IoT Threats Attack 32",
    "category": "IoT Threats",
    "severity": "high",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 69.3,
    "activeIncidents": 4149,
    "lastDetected": "2025-04-11T13:04:49.012Z",
    "status": "active"
  },
  {
    "id": "attack-vector-333",
    "name": "IoT Threats Attack 33",
    "category": "IoT Threats",
    "severity": "medium",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 38.4,
    "activeIncidents": 4112,
    "lastDetected": "2024-11-12T10:45:15.610Z",
    "status": "active"
  },
  {
    "id": "attack-vector-334",
    "name": "IoT Threats Attack 34",
    "category": "IoT Threats",
    "severity": "critical",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 29.4,
    "activeIncidents": 2628,
    "lastDetected": "2024-12-15T21:59:35.970Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-335",
    "name": "IoT Threats Attack 35",
    "category": "IoT Threats",
    "severity": "low",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 56.8,
    "activeIncidents": 4170,
    "lastDetected": "2024-11-16T00:16:23.966Z",
    "status": "active"
  },
  {
    "id": "attack-vector-336",
    "name": "IoT Threats Attack 36",
    "category": "IoT Threats",
    "severity": "high",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 60.3,
    "activeIncidents": 282,
    "lastDetected": "2025-09-29T01:25:13.472Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-337",
    "name": "IoT Threats Attack 37",
    "category": "IoT Threats",
    "severity": "high",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 78.9,
    "activeIncidents": 1032,
    "lastDetected": "2025-09-22T07:49:00.706Z",
    "status": "active"
  },
  {
    "id": "attack-vector-338",
    "name": "IoT Threats Attack 38",
    "category": "IoT Threats",
    "severity": "medium",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 22.2,
    "activeIncidents": 4312,
    "lastDetected": "2025-08-04T11:08:29.901Z",
    "status": "active"
  },
  {
    "id": "attack-vector-339",
    "name": "IoT Threats Attack 39",
    "category": "IoT Threats",
    "severity": "critical",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 75.9,
    "activeIncidents": 2905,
    "lastDetected": "2025-03-23T21:54:30.601Z",
    "status": "active"
  },
  {
    "id": "attack-vector-340",
    "name": "IoT Threats Attack 40",
    "category": "IoT Threats",
    "severity": "low",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 39.2,
    "activeIncidents": 2225,
    "lastDetected": "2025-07-23T03:03:03.557Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-341",
    "name": "IoT Threats Attack 41",
    "category": "IoT Threats",
    "severity": "low",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 56,
    "activeIncidents": 2680,
    "lastDetected": "2025-09-15T20:15:34.494Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-342",
    "name": "IoT Threats Attack 42",
    "category": "IoT Threats",
    "severity": "critical",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 23.6,
    "activeIncidents": 3239,
    "lastDetected": "2024-11-27T04:54:05.908Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-343",
    "name": "IoT Threats Attack 43",
    "category": "IoT Threats",
    "severity": "low",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 72.1,
    "activeIncidents": 3366,
    "lastDetected": "2025-08-29T12:45:34.591Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-344",
    "name": "IoT Threats Attack 44",
    "category": "IoT Threats",
    "severity": "critical",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 43,
    "activeIncidents": 345,
    "lastDetected": "2025-02-20T15:55:41.515Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-345",
    "name": "IoT Threats Attack 45",
    "category": "IoT Threats",
    "severity": "critical",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 23.5,
    "activeIncidents": 226,
    "lastDetected": "2025-10-12T04:38:13.553Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-346",
    "name": "IoT Threats Attack 46",
    "category": "IoT Threats",
    "severity": "high",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 36.7,
    "activeIncidents": 30,
    "lastDetected": "2025-05-23T10:17:16.195Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-347",
    "name": "IoT Threats Attack 47",
    "category": "IoT Threats",
    "severity": "critical",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 48.3,
    "activeIncidents": 139,
    "lastDetected": "2024-12-11T05:46:01.809Z",
    "status": "active"
  },
  {
    "id": "attack-vector-348",
    "name": "IoT Threats Attack 48",
    "category": "IoT Threats",
    "severity": "medium",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 62.9,
    "activeIncidents": 207,
    "lastDetected": "2024-12-21T14:48:13.019Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-349",
    "name": "IoT Threats Attack 49",
    "category": "IoT Threats",
    "severity": "medium",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 79.8,
    "activeIncidents": 1822,
    "lastDetected": "2024-11-02T04:40:34.234Z",
    "status": "active"
  },
  {
    "id": "attack-vector-350",
    "name": "IoT Threats Attack 50",
    "category": "IoT Threats",
    "severity": "low",
    "description": "Real-world iot threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for IoT Threats",
      "Behavioral pattern in IoT Threats",
      "Network signature of IoT Threats"
    ],
    "mitigation": [
      "Security control for IoT Threats",
      "Monitoring solution for IoT Threats",
      "Response procedure for IoT Threats"
    ],
    "detectionRate": 52.9,
    "activeIncidents": 386,
    "lastDetected": "2025-10-09T05:20:04.563Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-351",
    "name": "Cloud Threats Attack 1",
    "category": "Cloud Threats",
    "severity": "low",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 38.2,
    "activeIncidents": 4759,
    "lastDetected": "2025-09-11T05:42:02.651Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-352",
    "name": "Cloud Threats Attack 2",
    "category": "Cloud Threats",
    "severity": "low",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 41.7,
    "activeIncidents": 3360,
    "lastDetected": "2025-08-24T04:11:43.575Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-353",
    "name": "Cloud Threats Attack 3",
    "category": "Cloud Threats",
    "severity": "high",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 46.4,
    "activeIncidents": 1463,
    "lastDetected": "2025-05-13T12:49:49.160Z",
    "status": "active"
  },
  {
    "id": "attack-vector-354",
    "name": "Cloud Threats Attack 4",
    "category": "Cloud Threats",
    "severity": "low",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 25.8,
    "activeIncidents": 1699,
    "lastDetected": "2025-10-17T00:16:58.129Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-355",
    "name": "Cloud Threats Attack 5",
    "category": "Cloud Threats",
    "severity": "low",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 41.7,
    "activeIncidents": 4707,
    "lastDetected": "2025-07-06T20:50:16.036Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-356",
    "name": "Cloud Threats Attack 6",
    "category": "Cloud Threats",
    "severity": "critical",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 31.3,
    "activeIncidents": 1729,
    "lastDetected": "2025-01-08T03:36:06.005Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-357",
    "name": "Cloud Threats Attack 7",
    "category": "Cloud Threats",
    "severity": "low",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 63.4,
    "activeIncidents": 2615,
    "lastDetected": "2025-01-23T17:23:52.505Z",
    "status": "active"
  },
  {
    "id": "attack-vector-358",
    "name": "Cloud Threats Attack 8",
    "category": "Cloud Threats",
    "severity": "critical",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 52.5,
    "activeIncidents": 997,
    "lastDetected": "2025-05-28T20:32:06.508Z",
    "status": "active"
  },
  {
    "id": "attack-vector-359",
    "name": "Cloud Threats Attack 9",
    "category": "Cloud Threats",
    "severity": "medium",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 58.2,
    "activeIncidents": 2522,
    "lastDetected": "2024-11-12T13:00:40.367Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-360",
    "name": "Cloud Threats Attack 10",
    "category": "Cloud Threats",
    "severity": "critical",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 26.2,
    "activeIncidents": 4886,
    "lastDetected": "2025-06-03T22:15:49.667Z",
    "status": "active"
  },
  {
    "id": "attack-vector-361",
    "name": "Cloud Threats Attack 11",
    "category": "Cloud Threats",
    "severity": "critical",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 60.8,
    "activeIncidents": 4567,
    "lastDetected": "2024-12-15T03:58:15.924Z",
    "status": "active"
  },
  {
    "id": "attack-vector-362",
    "name": "Cloud Threats Attack 12",
    "category": "Cloud Threats",
    "severity": "medium",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 70.2,
    "activeIncidents": 4978,
    "lastDetected": "2025-07-17T00:16:08.358Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-363",
    "name": "Cloud Threats Attack 13",
    "category": "Cloud Threats",
    "severity": "critical",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 46.7,
    "activeIncidents": 3947,
    "lastDetected": "2025-08-19T11:36:49.364Z",
    "status": "active"
  },
  {
    "id": "attack-vector-364",
    "name": "Cloud Threats Attack 14",
    "category": "Cloud Threats",
    "severity": "critical",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 76.9,
    "activeIncidents": 1853,
    "lastDetected": "2025-04-25T19:53:03.398Z",
    "status": "active"
  },
  {
    "id": "attack-vector-365",
    "name": "Cloud Threats Attack 15",
    "category": "Cloud Threats",
    "severity": "low",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 20.9,
    "activeIncidents": 1919,
    "lastDetected": "2025-10-20T05:24:38.343Z",
    "status": "active"
  },
  {
    "id": "attack-vector-366",
    "name": "Cloud Threats Attack 16",
    "category": "Cloud Threats",
    "severity": "critical",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 35,
    "activeIncidents": 2458,
    "lastDetected": "2025-04-24T02:18:59.082Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-367",
    "name": "Cloud Threats Attack 17",
    "category": "Cloud Threats",
    "severity": "critical",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 76.8,
    "activeIncidents": 4160,
    "lastDetected": "2024-11-13T23:14:25.487Z",
    "status": "active"
  },
  {
    "id": "attack-vector-368",
    "name": "Cloud Threats Attack 18",
    "category": "Cloud Threats",
    "severity": "high",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 75.7,
    "activeIncidents": 2409,
    "lastDetected": "2025-09-24T10:08:45.277Z",
    "status": "active"
  },
  {
    "id": "attack-vector-369",
    "name": "Cloud Threats Attack 19",
    "category": "Cloud Threats",
    "severity": "critical",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 61.8,
    "activeIncidents": 2853,
    "lastDetected": "2025-01-06T10:15:53.476Z",
    "status": "active"
  },
  {
    "id": "attack-vector-370",
    "name": "Cloud Threats Attack 20",
    "category": "Cloud Threats",
    "severity": "critical",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 58.9,
    "activeIncidents": 4545,
    "lastDetected": "2025-07-04T13:39:56.027Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-371",
    "name": "Cloud Threats Attack 21",
    "category": "Cloud Threats",
    "severity": "medium",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 34.5,
    "activeIncidents": 3733,
    "lastDetected": "2025-09-17T20:51:15.349Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-372",
    "name": "Cloud Threats Attack 22",
    "category": "Cloud Threats",
    "severity": "medium",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 61.1,
    "activeIncidents": 1524,
    "lastDetected": "2025-02-27T20:30:26.605Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-373",
    "name": "Cloud Threats Attack 23",
    "category": "Cloud Threats",
    "severity": "critical",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 58.5,
    "activeIncidents": 3662,
    "lastDetected": "2025-02-16T03:50:00.439Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-374",
    "name": "Cloud Threats Attack 24",
    "category": "Cloud Threats",
    "severity": "high",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 27.2,
    "activeIncidents": 1951,
    "lastDetected": "2025-07-12T20:30:01.264Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-375",
    "name": "Cloud Threats Attack 25",
    "category": "Cloud Threats",
    "severity": "critical",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 40.2,
    "activeIncidents": 1503,
    "lastDetected": "2025-09-03T20:56:46.917Z",
    "status": "active"
  },
  {
    "id": "attack-vector-376",
    "name": "Cloud Threats Attack 26",
    "category": "Cloud Threats",
    "severity": "medium",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 45.7,
    "activeIncidents": 2336,
    "lastDetected": "2025-01-29T19:56:54.521Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-377",
    "name": "Cloud Threats Attack 27",
    "category": "Cloud Threats",
    "severity": "critical",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 55.6,
    "activeIncidents": 1895,
    "lastDetected": "2025-03-08T12:10:21.198Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-378",
    "name": "Cloud Threats Attack 28",
    "category": "Cloud Threats",
    "severity": "medium",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 35.9,
    "activeIncidents": 1951,
    "lastDetected": "2024-11-29T01:36:04.407Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-379",
    "name": "Cloud Threats Attack 29",
    "category": "Cloud Threats",
    "severity": "critical",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 20,
    "activeIncidents": 3242,
    "lastDetected": "2025-03-10T00:38:23.942Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-380",
    "name": "Cloud Threats Attack 30",
    "category": "Cloud Threats",
    "severity": "low",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 44.1,
    "activeIncidents": 4398,
    "lastDetected": "2025-01-22T23:32:52.373Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-381",
    "name": "Cloud Threats Attack 31",
    "category": "Cloud Threats",
    "severity": "medium",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 29.3,
    "activeIncidents": 2637,
    "lastDetected": "2025-05-23T04:15:30.692Z",
    "status": "active"
  },
  {
    "id": "attack-vector-382",
    "name": "Cloud Threats Attack 32",
    "category": "Cloud Threats",
    "severity": "medium",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 51.5,
    "activeIncidents": 2927,
    "lastDetected": "2025-03-06T00:08:05.402Z",
    "status": "active"
  },
  {
    "id": "attack-vector-383",
    "name": "Cloud Threats Attack 33",
    "category": "Cloud Threats",
    "severity": "high",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 48.1,
    "activeIncidents": 4027,
    "lastDetected": "2025-02-25T03:19:30.375Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-384",
    "name": "Cloud Threats Attack 34",
    "category": "Cloud Threats",
    "severity": "medium",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 38.8,
    "activeIncidents": 375,
    "lastDetected": "2025-02-17T00:09:13.273Z",
    "status": "active"
  },
  {
    "id": "attack-vector-385",
    "name": "Cloud Threats Attack 35",
    "category": "Cloud Threats",
    "severity": "critical",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 35.6,
    "activeIncidents": 2023,
    "lastDetected": "2025-04-25T09:12:21.950Z",
    "status": "active"
  },
  {
    "id": "attack-vector-386",
    "name": "Cloud Threats Attack 36",
    "category": "Cloud Threats",
    "severity": "critical",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 72.6,
    "activeIncidents": 3434,
    "lastDetected": "2025-07-14T17:04:16.199Z",
    "status": "active"
  },
  {
    "id": "attack-vector-387",
    "name": "Cloud Threats Attack 37",
    "category": "Cloud Threats",
    "severity": "high",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 78.2,
    "activeIncidents": 2617,
    "lastDetected": "2025-07-11T20:39:38.295Z",
    "status": "active"
  },
  {
    "id": "attack-vector-388",
    "name": "Cloud Threats Attack 38",
    "category": "Cloud Threats",
    "severity": "critical",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 75.2,
    "activeIncidents": 4367,
    "lastDetected": "2025-02-01T07:09:13.215Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-389",
    "name": "Cloud Threats Attack 39",
    "category": "Cloud Threats",
    "severity": "low",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 64.4,
    "activeIncidents": 1462,
    "lastDetected": "2025-07-13T13:37:14.324Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-390",
    "name": "Cloud Threats Attack 40",
    "category": "Cloud Threats",
    "severity": "low",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 64.5,
    "activeIncidents": 979,
    "lastDetected": "2025-10-19T11:58:04.760Z",
    "status": "active"
  },
  {
    "id": "attack-vector-391",
    "name": "Cloud Threats Attack 41",
    "category": "Cloud Threats",
    "severity": "low",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 70.5,
    "activeIncidents": 1764,
    "lastDetected": "2025-02-28T00:52:02.530Z",
    "status": "active"
  },
  {
    "id": "attack-vector-392",
    "name": "Cloud Threats Attack 42",
    "category": "Cloud Threats",
    "severity": "medium",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 79.1,
    "activeIncidents": 4381,
    "lastDetected": "2025-05-31T05:28:09.490Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-393",
    "name": "Cloud Threats Attack 43",
    "category": "Cloud Threats",
    "severity": "critical",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 47.3,
    "activeIncidents": 2349,
    "lastDetected": "2024-12-02T01:10:32.222Z",
    "status": "active"
  },
  {
    "id": "attack-vector-394",
    "name": "Cloud Threats Attack 44",
    "category": "Cloud Threats",
    "severity": "high",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 33.7,
    "activeIncidents": 1697,
    "lastDetected": "2025-01-24T11:04:40.053Z",
    "status": "active"
  },
  {
    "id": "attack-vector-395",
    "name": "Cloud Threats Attack 45",
    "category": "Cloud Threats",
    "severity": "critical",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 60.2,
    "activeIncidents": 1422,
    "lastDetected": "2025-04-07T19:50:01.211Z",
    "status": "active"
  },
  {
    "id": "attack-vector-396",
    "name": "Cloud Threats Attack 46",
    "category": "Cloud Threats",
    "severity": "low",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 36.4,
    "activeIncidents": 2451,
    "lastDetected": "2025-09-14T02:09:57.285Z",
    "status": "active"
  },
  {
    "id": "attack-vector-397",
    "name": "Cloud Threats Attack 47",
    "category": "Cloud Threats",
    "severity": "critical",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 67.3,
    "activeIncidents": 2495,
    "lastDetected": "2025-06-26T17:03:47.658Z",
    "status": "active"
  },
  {
    "id": "attack-vector-398",
    "name": "Cloud Threats Attack 48",
    "category": "Cloud Threats",
    "severity": "critical",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 22.5,
    "activeIncidents": 4044,
    "lastDetected": "2025-08-09T05:45:20.830Z",
    "status": "active"
  },
  {
    "id": "attack-vector-399",
    "name": "Cloud Threats Attack 49",
    "category": "Cloud Threats",
    "severity": "medium",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 74.5,
    "activeIncidents": 715,
    "lastDetected": "2025-07-03T18:54:50.617Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-400",
    "name": "Cloud Threats Attack 50",
    "category": "Cloud Threats",
    "severity": "high",
    "description": "Real-world cloud threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Cloud Threats",
      "Behavioral pattern in Cloud Threats",
      "Network signature of Cloud Threats"
    ],
    "mitigation": [
      "Security control for Cloud Threats",
      "Monitoring solution for Cloud Threats",
      "Response procedure for Cloud Threats"
    ],
    "detectionRate": 56.6,
    "activeIncidents": 3375,
    "lastDetected": "2024-10-30T23:51:04.137Z",
    "status": "active"
  },
  {
    "id": "attack-vector-401",
    "name": "Mobile Threats Attack 1",
    "category": "Mobile Threats",
    "severity": "critical",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 62.2,
    "activeIncidents": 4610,
    "lastDetected": "2025-07-17T21:20:22.546Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-402",
    "name": "Mobile Threats Attack 2",
    "category": "Mobile Threats",
    "severity": "medium",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 50.2,
    "activeIncidents": 85,
    "lastDetected": "2025-07-07T02:27:07.073Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-403",
    "name": "Mobile Threats Attack 3",
    "category": "Mobile Threats",
    "severity": "high",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 46.3,
    "activeIncidents": 570,
    "lastDetected": "2024-10-31T20:26:32.555Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-404",
    "name": "Mobile Threats Attack 4",
    "category": "Mobile Threats",
    "severity": "medium",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 67.8,
    "activeIncidents": 1729,
    "lastDetected": "2025-02-06T19:41:16.851Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-405",
    "name": "Mobile Threats Attack 5",
    "category": "Mobile Threats",
    "severity": "medium",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 40.8,
    "activeIncidents": 235,
    "lastDetected": "2025-07-28T06:42:51.030Z",
    "status": "active"
  },
  {
    "id": "attack-vector-406",
    "name": "Mobile Threats Attack 6",
    "category": "Mobile Threats",
    "severity": "low",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 72.5,
    "activeIncidents": 21,
    "lastDetected": "2025-05-18T23:28:25.874Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-407",
    "name": "Mobile Threats Attack 7",
    "category": "Mobile Threats",
    "severity": "critical",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 77.5,
    "activeIncidents": 4906,
    "lastDetected": "2025-07-05T14:27:34.109Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-408",
    "name": "Mobile Threats Attack 8",
    "category": "Mobile Threats",
    "severity": "medium",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 57.8,
    "activeIncidents": 2401,
    "lastDetected": "2025-04-29T16:02:58.473Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-409",
    "name": "Mobile Threats Attack 9",
    "category": "Mobile Threats",
    "severity": "critical",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 67.8,
    "activeIncidents": 3627,
    "lastDetected": "2025-03-13T05:27:17.457Z",
    "status": "active"
  },
  {
    "id": "attack-vector-410",
    "name": "Mobile Threats Attack 10",
    "category": "Mobile Threats",
    "severity": "low",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 68.6,
    "activeIncidents": 4822,
    "lastDetected": "2025-08-16T23:10:01.341Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-411",
    "name": "Mobile Threats Attack 11",
    "category": "Mobile Threats",
    "severity": "medium",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 24.1,
    "activeIncidents": 1737,
    "lastDetected": "2025-10-07T02:42:11.922Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-412",
    "name": "Mobile Threats Attack 12",
    "category": "Mobile Threats",
    "severity": "medium",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 24.1,
    "activeIncidents": 1931,
    "lastDetected": "2025-09-12T11:21:45.278Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-413",
    "name": "Mobile Threats Attack 13",
    "category": "Mobile Threats",
    "severity": "low",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 49.1,
    "activeIncidents": 1972,
    "lastDetected": "2025-05-24T11:34:02.151Z",
    "status": "active"
  },
  {
    "id": "attack-vector-414",
    "name": "Mobile Threats Attack 14",
    "category": "Mobile Threats",
    "severity": "critical",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 20.5,
    "activeIncidents": 3431,
    "lastDetected": "2025-05-12T15:42:29.770Z",
    "status": "active"
  },
  {
    "id": "attack-vector-415",
    "name": "Mobile Threats Attack 15",
    "category": "Mobile Threats",
    "severity": "high",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 68.7,
    "activeIncidents": 1653,
    "lastDetected": "2025-01-27T16:56:09.685Z",
    "status": "active"
  },
  {
    "id": "attack-vector-416",
    "name": "Mobile Threats Attack 16",
    "category": "Mobile Threats",
    "severity": "low",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 56,
    "activeIncidents": 3759,
    "lastDetected": "2024-11-22T16:51:34.615Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-417",
    "name": "Mobile Threats Attack 17",
    "category": "Mobile Threats",
    "severity": "high",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 26.7,
    "activeIncidents": 3779,
    "lastDetected": "2025-06-28T02:18:08.260Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-418",
    "name": "Mobile Threats Attack 18",
    "category": "Mobile Threats",
    "severity": "medium",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 53.2,
    "activeIncidents": 3924,
    "lastDetected": "2025-04-18T09:20:09.088Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-419",
    "name": "Mobile Threats Attack 19",
    "category": "Mobile Threats",
    "severity": "critical",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 35.2,
    "activeIncidents": 2316,
    "lastDetected": "2025-04-19T01:26:56.796Z",
    "status": "active"
  },
  {
    "id": "attack-vector-420",
    "name": "Mobile Threats Attack 20",
    "category": "Mobile Threats",
    "severity": "critical",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 58.5,
    "activeIncidents": 3827,
    "lastDetected": "2025-04-23T22:50:27.236Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-421",
    "name": "Mobile Threats Attack 21",
    "category": "Mobile Threats",
    "severity": "medium",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 24.8,
    "activeIncidents": 3352,
    "lastDetected": "2025-03-15T19:53:52.464Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-422",
    "name": "Mobile Threats Attack 22",
    "category": "Mobile Threats",
    "severity": "medium",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 41.9,
    "activeIncidents": 2812,
    "lastDetected": "2025-01-10T20:31:13.885Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-423",
    "name": "Mobile Threats Attack 23",
    "category": "Mobile Threats",
    "severity": "critical",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 27.9,
    "activeIncidents": 4272,
    "lastDetected": "2025-05-31T05:06:28.344Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-424",
    "name": "Mobile Threats Attack 24",
    "category": "Mobile Threats",
    "severity": "critical",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 22.6,
    "activeIncidents": 1175,
    "lastDetected": "2025-06-22T03:02:22.546Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-425",
    "name": "Mobile Threats Attack 25",
    "category": "Mobile Threats",
    "severity": "medium",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 60.2,
    "activeIncidents": 3339,
    "lastDetected": "2024-12-09T14:56:56.963Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-426",
    "name": "Mobile Threats Attack 26",
    "category": "Mobile Threats",
    "severity": "critical",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 40.1,
    "activeIncidents": 375,
    "lastDetected": "2025-09-28T12:47:58.924Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-427",
    "name": "Mobile Threats Attack 27",
    "category": "Mobile Threats",
    "severity": "low",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 71.9,
    "activeIncidents": 3865,
    "lastDetected": "2025-09-24T23:09:18.001Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-428",
    "name": "Mobile Threats Attack 28",
    "category": "Mobile Threats",
    "severity": "high",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 60.7,
    "activeIncidents": 1218,
    "lastDetected": "2025-08-06T04:59:39.453Z",
    "status": "active"
  },
  {
    "id": "attack-vector-429",
    "name": "Mobile Threats Attack 29",
    "category": "Mobile Threats",
    "severity": "critical",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 62.5,
    "activeIncidents": 1934,
    "lastDetected": "2025-05-24T14:41:10.392Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-430",
    "name": "Mobile Threats Attack 30",
    "category": "Mobile Threats",
    "severity": "low",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 45.6,
    "activeIncidents": 3793,
    "lastDetected": "2025-06-08T06:09:44.833Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-431",
    "name": "Mobile Threats Attack 31",
    "category": "Mobile Threats",
    "severity": "critical",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 22,
    "activeIncidents": 3472,
    "lastDetected": "2025-01-27T13:59:42.823Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-432",
    "name": "Mobile Threats Attack 32",
    "category": "Mobile Threats",
    "severity": "low",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 74.4,
    "activeIncidents": 2783,
    "lastDetected": "2025-01-02T16:40:36.782Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-433",
    "name": "Mobile Threats Attack 33",
    "category": "Mobile Threats",
    "severity": "low",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 68.1,
    "activeIncidents": 994,
    "lastDetected": "2024-11-18T08:57:33.409Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-434",
    "name": "Mobile Threats Attack 34",
    "category": "Mobile Threats",
    "severity": "high",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 45.2,
    "activeIncidents": 4294,
    "lastDetected": "2025-03-14T13:36:09.205Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-435",
    "name": "Mobile Threats Attack 35",
    "category": "Mobile Threats",
    "severity": "high",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 61,
    "activeIncidents": 30,
    "lastDetected": "2025-07-13T09:32:03.266Z",
    "status": "active"
  },
  {
    "id": "attack-vector-436",
    "name": "Mobile Threats Attack 36",
    "category": "Mobile Threats",
    "severity": "high",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 56,
    "activeIncidents": 3492,
    "lastDetected": "2025-03-02T18:13:14.734Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-437",
    "name": "Mobile Threats Attack 37",
    "category": "Mobile Threats",
    "severity": "high",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 24.2,
    "activeIncidents": 4081,
    "lastDetected": "2025-09-14T18:54:36.139Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-438",
    "name": "Mobile Threats Attack 38",
    "category": "Mobile Threats",
    "severity": "high",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 60,
    "activeIncidents": 1869,
    "lastDetected": "2025-09-13T02:47:09.463Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-439",
    "name": "Mobile Threats Attack 39",
    "category": "Mobile Threats",
    "severity": "high",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 56,
    "activeIncidents": 3297,
    "lastDetected": "2025-01-23T12:32:50.361Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-440",
    "name": "Mobile Threats Attack 40",
    "category": "Mobile Threats",
    "severity": "high",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 57.9,
    "activeIncidents": 4590,
    "lastDetected": "2025-10-21T12:26:47.504Z",
    "status": "active"
  },
  {
    "id": "attack-vector-441",
    "name": "Mobile Threats Attack 41",
    "category": "Mobile Threats",
    "severity": "high",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 23.8,
    "activeIncidents": 4235,
    "lastDetected": "2024-12-02T22:29:42.922Z",
    "status": "active"
  },
  {
    "id": "attack-vector-442",
    "name": "Mobile Threats Attack 42",
    "category": "Mobile Threats",
    "severity": "high",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 58.6,
    "activeIncidents": 2753,
    "lastDetected": "2025-10-05T01:53:00.907Z",
    "status": "active"
  },
  {
    "id": "attack-vector-443",
    "name": "Mobile Threats Attack 43",
    "category": "Mobile Threats",
    "severity": "critical",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 63.9,
    "activeIncidents": 1804,
    "lastDetected": "2025-09-01T21:16:40.163Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-444",
    "name": "Mobile Threats Attack 44",
    "category": "Mobile Threats",
    "severity": "high",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 25.6,
    "activeIncidents": 1451,
    "lastDetected": "2025-05-17T02:22:53.517Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-445",
    "name": "Mobile Threats Attack 45",
    "category": "Mobile Threats",
    "severity": "medium",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 75.3,
    "activeIncidents": 2831,
    "lastDetected": "2025-01-07T22:58:12.974Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-446",
    "name": "Mobile Threats Attack 46",
    "category": "Mobile Threats",
    "severity": "critical",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 53.6,
    "activeIncidents": 3661,
    "lastDetected": "2025-08-24T14:19:24.963Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-447",
    "name": "Mobile Threats Attack 47",
    "category": "Mobile Threats",
    "severity": "low",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 43,
    "activeIncidents": 2492,
    "lastDetected": "2025-05-28T10:57:23.104Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-448",
    "name": "Mobile Threats Attack 48",
    "category": "Mobile Threats",
    "severity": "critical",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 26.1,
    "activeIncidents": 3121,
    "lastDetected": "2025-07-19T08:18:23.017Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-449",
    "name": "Mobile Threats Attack 49",
    "category": "Mobile Threats",
    "severity": "critical",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 62.1,
    "activeIncidents": 3820,
    "lastDetected": "2025-07-05T18:14:16.471Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-450",
    "name": "Mobile Threats Attack 50",
    "category": "Mobile Threats",
    "severity": "low",
    "description": "Real-world mobile threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Mobile Threats",
      "Behavioral pattern in Mobile Threats",
      "Network signature of Mobile Threats"
    ],
    "mitigation": [
      "Security control for Mobile Threats",
      "Monitoring solution for Mobile Threats",
      "Response procedure for Mobile Threats"
    ],
    "detectionRate": 37.1,
    "activeIncidents": 4789,
    "lastDetected": "2025-09-24T20:20:24.042Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-451",
    "name": "Physical Security Attack 1",
    "category": "Physical Security",
    "severity": "low",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 71.5,
    "activeIncidents": 835,
    "lastDetected": "2025-02-01T22:51:57.812Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-452",
    "name": "Physical Security Attack 2",
    "category": "Physical Security",
    "severity": "high",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 60.8,
    "activeIncidents": 948,
    "lastDetected": "2025-07-20T10:25:28.628Z",
    "status": "active"
  },
  {
    "id": "attack-vector-453",
    "name": "Physical Security Attack 3",
    "category": "Physical Security",
    "severity": "critical",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 36,
    "activeIncidents": 538,
    "lastDetected": "2025-09-01T03:02:42.629Z",
    "status": "active"
  },
  {
    "id": "attack-vector-454",
    "name": "Physical Security Attack 4",
    "category": "Physical Security",
    "severity": "low",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 26.7,
    "activeIncidents": 2482,
    "lastDetected": "2025-04-18T02:54:33.400Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-455",
    "name": "Physical Security Attack 5",
    "category": "Physical Security",
    "severity": "low",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 74,
    "activeIncidents": 3901,
    "lastDetected": "2024-12-20T16:42:52.366Z",
    "status": "active"
  },
  {
    "id": "attack-vector-456",
    "name": "Physical Security Attack 6",
    "category": "Physical Security",
    "severity": "low",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 25.2,
    "activeIncidents": 1315,
    "lastDetected": "2025-04-28T05:33:09.209Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-457",
    "name": "Physical Security Attack 7",
    "category": "Physical Security",
    "severity": "medium",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 63.2,
    "activeIncidents": 2015,
    "lastDetected": "2025-02-18T16:53:36.306Z",
    "status": "active"
  },
  {
    "id": "attack-vector-458",
    "name": "Physical Security Attack 8",
    "category": "Physical Security",
    "severity": "low",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 25.6,
    "activeIncidents": 4038,
    "lastDetected": "2025-03-25T07:07:27.682Z",
    "status": "active"
  },
  {
    "id": "attack-vector-459",
    "name": "Physical Security Attack 9",
    "category": "Physical Security",
    "severity": "low",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 73,
    "activeIncidents": 3017,
    "lastDetected": "2025-05-21T08:01:48.619Z",
    "status": "active"
  },
  {
    "id": "attack-vector-460",
    "name": "Physical Security Attack 10",
    "category": "Physical Security",
    "severity": "low",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 33.4,
    "activeIncidents": 3998,
    "lastDetected": "2024-12-22T06:35:31.970Z",
    "status": "active"
  },
  {
    "id": "attack-vector-461",
    "name": "Physical Security Attack 11",
    "category": "Physical Security",
    "severity": "medium",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 77.8,
    "activeIncidents": 1103,
    "lastDetected": "2025-07-12T04:54:35.971Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-462",
    "name": "Physical Security Attack 12",
    "category": "Physical Security",
    "severity": "high",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 28.8,
    "activeIncidents": 4572,
    "lastDetected": "2025-06-18T00:17:23.367Z",
    "status": "active"
  },
  {
    "id": "attack-vector-463",
    "name": "Physical Security Attack 13",
    "category": "Physical Security",
    "severity": "low",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 78.1,
    "activeIncidents": 1253,
    "lastDetected": "2025-05-16T20:29:24.520Z",
    "status": "active"
  },
  {
    "id": "attack-vector-464",
    "name": "Physical Security Attack 14",
    "category": "Physical Security",
    "severity": "medium",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 20.8,
    "activeIncidents": 2887,
    "lastDetected": "2025-09-05T01:44:30.157Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-465",
    "name": "Physical Security Attack 15",
    "category": "Physical Security",
    "severity": "low",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 67.3,
    "activeIncidents": 1047,
    "lastDetected": "2025-04-01T22:39:30.026Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-466",
    "name": "Physical Security Attack 16",
    "category": "Physical Security",
    "severity": "medium",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 59.8,
    "activeIncidents": 1498,
    "lastDetected": "2025-10-03T06:02:54.206Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-467",
    "name": "Physical Security Attack 17",
    "category": "Physical Security",
    "severity": "medium",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 74.6,
    "activeIncidents": 4223,
    "lastDetected": "2024-11-03T19:41:30.747Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-468",
    "name": "Physical Security Attack 18",
    "category": "Physical Security",
    "severity": "medium",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 23.1,
    "activeIncidents": 1728,
    "lastDetected": "2025-03-29T04:14:48.843Z",
    "status": "active"
  },
  {
    "id": "attack-vector-469",
    "name": "Physical Security Attack 19",
    "category": "Physical Security",
    "severity": "medium",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 45.6,
    "activeIncidents": 2186,
    "lastDetected": "2025-08-05T05:51:58.253Z",
    "status": "active"
  },
  {
    "id": "attack-vector-470",
    "name": "Physical Security Attack 20",
    "category": "Physical Security",
    "severity": "low",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 64.8,
    "activeIncidents": 3781,
    "lastDetected": "2025-09-23T04:02:07.771Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-471",
    "name": "Physical Security Attack 21",
    "category": "Physical Security",
    "severity": "critical",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 24.2,
    "activeIncidents": 3971,
    "lastDetected": "2025-03-31T23:05:24.982Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-472",
    "name": "Physical Security Attack 22",
    "category": "Physical Security",
    "severity": "medium",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 58,
    "activeIncidents": 1187,
    "lastDetected": "2025-01-30T16:42:10.482Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-473",
    "name": "Physical Security Attack 23",
    "category": "Physical Security",
    "severity": "low",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 61.1,
    "activeIncidents": 3726,
    "lastDetected": "2025-01-16T19:25:16.556Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-474",
    "name": "Physical Security Attack 24",
    "category": "Physical Security",
    "severity": "critical",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 73.3,
    "activeIncidents": 3104,
    "lastDetected": "2025-08-19T03:17:36.815Z",
    "status": "active"
  },
  {
    "id": "attack-vector-475",
    "name": "Physical Security Attack 25",
    "category": "Physical Security",
    "severity": "critical",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 48.2,
    "activeIncidents": 1677,
    "lastDetected": "2025-06-15T00:36:47.229Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-476",
    "name": "Physical Security Attack 26",
    "category": "Physical Security",
    "severity": "medium",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 57.7,
    "activeIncidents": 4116,
    "lastDetected": "2024-12-19T05:15:49.906Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-477",
    "name": "Physical Security Attack 27",
    "category": "Physical Security",
    "severity": "medium",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 42.4,
    "activeIncidents": 663,
    "lastDetected": "2024-12-08T12:55:11.624Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-478",
    "name": "Physical Security Attack 28",
    "category": "Physical Security",
    "severity": "critical",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 36.9,
    "activeIncidents": 2981,
    "lastDetected": "2025-03-21T12:52:30.265Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-479",
    "name": "Physical Security Attack 29",
    "category": "Physical Security",
    "severity": "low",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 32.4,
    "activeIncidents": 1416,
    "lastDetected": "2024-12-08T12:13:09.101Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-480",
    "name": "Physical Security Attack 30",
    "category": "Physical Security",
    "severity": "high",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 27.7,
    "activeIncidents": 2245,
    "lastDetected": "2025-01-11T21:17:50.985Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-481",
    "name": "Physical Security Attack 31",
    "category": "Physical Security",
    "severity": "high",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 67.3,
    "activeIncidents": 238,
    "lastDetected": "2025-03-19T10:59:16.769Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-482",
    "name": "Physical Security Attack 32",
    "category": "Physical Security",
    "severity": "high",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 63.4,
    "activeIncidents": 2733,
    "lastDetected": "2025-04-30T02:01:41.874Z",
    "status": "active"
  },
  {
    "id": "attack-vector-483",
    "name": "Physical Security Attack 33",
    "category": "Physical Security",
    "severity": "low",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 23.1,
    "activeIncidents": 2925,
    "lastDetected": "2024-11-02T08:00:34.104Z",
    "status": "active"
  },
  {
    "id": "attack-vector-484",
    "name": "Physical Security Attack 34",
    "category": "Physical Security",
    "severity": "critical",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 67.4,
    "activeIncidents": 1401,
    "lastDetected": "2024-11-20T15:01:15.095Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-485",
    "name": "Physical Security Attack 35",
    "category": "Physical Security",
    "severity": "low",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 61.8,
    "activeIncidents": 3847,
    "lastDetected": "2025-06-11T03:04:02.980Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-486",
    "name": "Physical Security Attack 36",
    "category": "Physical Security",
    "severity": "medium",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 59.7,
    "activeIncidents": 1422,
    "lastDetected": "2024-12-18T00:35:00.105Z",
    "status": "active"
  },
  {
    "id": "attack-vector-487",
    "name": "Physical Security Attack 37",
    "category": "Physical Security",
    "severity": "high",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 78.5,
    "activeIncidents": 4367,
    "lastDetected": "2025-05-20T05:10:31.162Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-488",
    "name": "Physical Security Attack 38",
    "category": "Physical Security",
    "severity": "medium",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 43.4,
    "activeIncidents": 927,
    "lastDetected": "2025-05-29T16:03:08.154Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-489",
    "name": "Physical Security Attack 39",
    "category": "Physical Security",
    "severity": "critical",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 63.2,
    "activeIncidents": 507,
    "lastDetected": "2024-10-31T11:57:32.094Z",
    "status": "active"
  },
  {
    "id": "attack-vector-490",
    "name": "Physical Security Attack 40",
    "category": "Physical Security",
    "severity": "medium",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 74.5,
    "activeIncidents": 4189,
    "lastDetected": "2025-05-20T23:54:38.394Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-491",
    "name": "Physical Security Attack 41",
    "category": "Physical Security",
    "severity": "low",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 68.1,
    "activeIncidents": 1749,
    "lastDetected": "2024-11-25T11:41:24.821Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-492",
    "name": "Physical Security Attack 42",
    "category": "Physical Security",
    "severity": "medium",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 42,
    "activeIncidents": 729,
    "lastDetected": "2025-02-07T08:23:57.617Z",
    "status": "active"
  },
  {
    "id": "attack-vector-493",
    "name": "Physical Security Attack 43",
    "category": "Physical Security",
    "severity": "high",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 28.6,
    "activeIncidents": 3905,
    "lastDetected": "2025-05-19T15:44:25.843Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-494",
    "name": "Physical Security Attack 44",
    "category": "Physical Security",
    "severity": "critical",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 27.8,
    "activeIncidents": 2014,
    "lastDetected": "2025-01-09T05:36:22.595Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-495",
    "name": "Physical Security Attack 45",
    "category": "Physical Security",
    "severity": "high",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 55.6,
    "activeIncidents": 2676,
    "lastDetected": "2025-06-30T05:35:12.645Z",
    "status": "active"
  },
  {
    "id": "attack-vector-496",
    "name": "Physical Security Attack 46",
    "category": "Physical Security",
    "severity": "medium",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 73.3,
    "activeIncidents": 3299,
    "lastDetected": "2025-05-16T05:27:41.408Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-497",
    "name": "Physical Security Attack 47",
    "category": "Physical Security",
    "severity": "critical",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 44.8,
    "activeIncidents": 4119,
    "lastDetected": "2024-11-11T07:31:13.622Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-498",
    "name": "Physical Security Attack 48",
    "category": "Physical Security",
    "severity": "high",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 40.3,
    "activeIncidents": 1483,
    "lastDetected": "2025-01-10T17:27:40.022Z",
    "status": "active"
  },
  {
    "id": "attack-vector-499",
    "name": "Physical Security Attack 49",
    "category": "Physical Security",
    "severity": "low",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 38.3,
    "activeIncidents": 207,
    "lastDetected": "2025-03-21T14:01:19.693Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-500",
    "name": "Physical Security Attack 50",
    "category": "Physical Security",
    "severity": "medium",
    "description": "Real-world physical security attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Physical Security",
      "Behavioral pattern in Physical Security",
      "Network signature of Physical Security"
    ],
    "mitigation": [
      "Security control for Physical Security",
      "Monitoring solution for Physical Security",
      "Response procedure for Physical Security"
    ],
    "detectionRate": 63.3,
    "activeIncidents": 4911,
    "lastDetected": "2025-02-08T11:34:42.265Z",
    "status": "active"
  },
  {
    "id": "attack-vector-501",
    "name": "Insider Threats Attack 1",
    "category": "Insider Threats",
    "severity": "high",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 79.3,
    "activeIncidents": 1918,
    "lastDetected": "2024-12-29T06:06:18.133Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-502",
    "name": "Insider Threats Attack 2",
    "category": "Insider Threats",
    "severity": "high",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 69.5,
    "activeIncidents": 4605,
    "lastDetected": "2025-03-26T13:33:41.038Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-503",
    "name": "Insider Threats Attack 3",
    "category": "Insider Threats",
    "severity": "low",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 20.3,
    "activeIncidents": 791,
    "lastDetected": "2025-07-31T17:07:26.577Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-504",
    "name": "Insider Threats Attack 4",
    "category": "Insider Threats",
    "severity": "medium",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 70.3,
    "activeIncidents": 3935,
    "lastDetected": "2025-07-17T14:08:46.977Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-505",
    "name": "Insider Threats Attack 5",
    "category": "Insider Threats",
    "severity": "medium",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 34.7,
    "activeIncidents": 4593,
    "lastDetected": "2025-04-30T16:05:52.186Z",
    "status": "active"
  },
  {
    "id": "attack-vector-506",
    "name": "Insider Threats Attack 6",
    "category": "Insider Threats",
    "severity": "low",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 23.2,
    "activeIncidents": 2532,
    "lastDetected": "2025-07-17T12:52:26.425Z",
    "status": "active"
  },
  {
    "id": "attack-vector-507",
    "name": "Insider Threats Attack 7",
    "category": "Insider Threats",
    "severity": "critical",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 55,
    "activeIncidents": 3995,
    "lastDetected": "2025-10-11T18:27:59.795Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-508",
    "name": "Insider Threats Attack 8",
    "category": "Insider Threats",
    "severity": "medium",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 62.6,
    "activeIncidents": 4953,
    "lastDetected": "2024-11-10T18:55:29.991Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-509",
    "name": "Insider Threats Attack 9",
    "category": "Insider Threats",
    "severity": "critical",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 43,
    "activeIncidents": 668,
    "lastDetected": "2024-12-23T00:35:04.600Z",
    "status": "active"
  },
  {
    "id": "attack-vector-510",
    "name": "Insider Threats Attack 10",
    "category": "Insider Threats",
    "severity": "medium",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 21.1,
    "activeIncidents": 2411,
    "lastDetected": "2025-01-16T00:26:41.530Z",
    "status": "active"
  },
  {
    "id": "attack-vector-511",
    "name": "Insider Threats Attack 11",
    "category": "Insider Threats",
    "severity": "critical",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 51,
    "activeIncidents": 44,
    "lastDetected": "2025-07-07T04:41:23.418Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-512",
    "name": "Insider Threats Attack 12",
    "category": "Insider Threats",
    "severity": "high",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 40.7,
    "activeIncidents": 3058,
    "lastDetected": "2024-12-09T11:00:39.318Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-513",
    "name": "Insider Threats Attack 13",
    "category": "Insider Threats",
    "severity": "high",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 62.4,
    "activeIncidents": 1937,
    "lastDetected": "2025-03-17T18:46:34.384Z",
    "status": "active"
  },
  {
    "id": "attack-vector-514",
    "name": "Insider Threats Attack 14",
    "category": "Insider Threats",
    "severity": "medium",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 28.3,
    "activeIncidents": 435,
    "lastDetected": "2025-08-18T10:20:15.391Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-515",
    "name": "Insider Threats Attack 15",
    "category": "Insider Threats",
    "severity": "medium",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 76,
    "activeIncidents": 4918,
    "lastDetected": "2025-05-01T01:33:21.863Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-516",
    "name": "Insider Threats Attack 16",
    "category": "Insider Threats",
    "severity": "low",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 74.9,
    "activeIncidents": 3471,
    "lastDetected": "2025-07-04T12:59:46.539Z",
    "status": "active"
  },
  {
    "id": "attack-vector-517",
    "name": "Insider Threats Attack 17",
    "category": "Insider Threats",
    "severity": "critical",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 22,
    "activeIncidents": 1181,
    "lastDetected": "2025-09-22T11:38:41.315Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-518",
    "name": "Insider Threats Attack 18",
    "category": "Insider Threats",
    "severity": "high",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 26.3,
    "activeIncidents": 2034,
    "lastDetected": "2025-09-19T00:46:45.722Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-519",
    "name": "Insider Threats Attack 19",
    "category": "Insider Threats",
    "severity": "high",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 72.3,
    "activeIncidents": 916,
    "lastDetected": "2025-06-05T02:43:42.734Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-520",
    "name": "Insider Threats Attack 20",
    "category": "Insider Threats",
    "severity": "low",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 78.4,
    "activeIncidents": 2598,
    "lastDetected": "2025-08-04T22:32:52.363Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-521",
    "name": "Insider Threats Attack 21",
    "category": "Insider Threats",
    "severity": "high",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 43.2,
    "activeIncidents": 392,
    "lastDetected": "2025-07-24T12:03:00.859Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-522",
    "name": "Insider Threats Attack 22",
    "category": "Insider Threats",
    "severity": "low",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 31.2,
    "activeIncidents": 2885,
    "lastDetected": "2025-07-04T07:01:57.106Z",
    "status": "active"
  },
  {
    "id": "attack-vector-523",
    "name": "Insider Threats Attack 23",
    "category": "Insider Threats",
    "severity": "critical",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 71.9,
    "activeIncidents": 979,
    "lastDetected": "2024-11-18T05:55:02.094Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-524",
    "name": "Insider Threats Attack 24",
    "category": "Insider Threats",
    "severity": "critical",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 24.6,
    "activeIncidents": 3185,
    "lastDetected": "2025-05-15T02:10:49.291Z",
    "status": "active"
  },
  {
    "id": "attack-vector-525",
    "name": "Insider Threats Attack 25",
    "category": "Insider Threats",
    "severity": "medium",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 62.4,
    "activeIncidents": 2456,
    "lastDetected": "2025-09-10T20:18:38.546Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-526",
    "name": "Insider Threats Attack 26",
    "category": "Insider Threats",
    "severity": "critical",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 61.8,
    "activeIncidents": 346,
    "lastDetected": "2025-04-11T22:21:28.736Z",
    "status": "active"
  },
  {
    "id": "attack-vector-527",
    "name": "Insider Threats Attack 27",
    "category": "Insider Threats",
    "severity": "high",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 58,
    "activeIncidents": 4823,
    "lastDetected": "2025-10-20T02:33:54.233Z",
    "status": "active"
  },
  {
    "id": "attack-vector-528",
    "name": "Insider Threats Attack 28",
    "category": "Insider Threats",
    "severity": "medium",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 29.6,
    "activeIncidents": 3776,
    "lastDetected": "2024-10-31T05:32:39.265Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-529",
    "name": "Insider Threats Attack 29",
    "category": "Insider Threats",
    "severity": "medium",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 58.6,
    "activeIncidents": 1549,
    "lastDetected": "2025-04-30T04:28:57.474Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-530",
    "name": "Insider Threats Attack 30",
    "category": "Insider Threats",
    "severity": "medium",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 24.8,
    "activeIncidents": 4408,
    "lastDetected": "2025-03-02T02:51:08.439Z",
    "status": "active"
  },
  {
    "id": "attack-vector-531",
    "name": "Insider Threats Attack 31",
    "category": "Insider Threats",
    "severity": "low",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 65,
    "activeIncidents": 926,
    "lastDetected": "2025-04-09T17:18:09.708Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-532",
    "name": "Insider Threats Attack 32",
    "category": "Insider Threats",
    "severity": "critical",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 70.2,
    "activeIncidents": 2736,
    "lastDetected": "2025-04-05T22:12:43.647Z",
    "status": "active"
  },
  {
    "id": "attack-vector-533",
    "name": "Insider Threats Attack 33",
    "category": "Insider Threats",
    "severity": "critical",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 30.6,
    "activeIncidents": 885,
    "lastDetected": "2025-08-03T14:19:25.354Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-534",
    "name": "Insider Threats Attack 34",
    "category": "Insider Threats",
    "severity": "critical",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 44.7,
    "activeIncidents": 1363,
    "lastDetected": "2025-06-10T23:05:30.147Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-535",
    "name": "Insider Threats Attack 35",
    "category": "Insider Threats",
    "severity": "critical",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 58.6,
    "activeIncidents": 4360,
    "lastDetected": "2025-04-27T06:49:29.428Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-536",
    "name": "Insider Threats Attack 36",
    "category": "Insider Threats",
    "severity": "critical",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 43.8,
    "activeIncidents": 4216,
    "lastDetected": "2025-07-24T19:14:51.497Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-537",
    "name": "Insider Threats Attack 37",
    "category": "Insider Threats",
    "severity": "critical",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 34,
    "activeIncidents": 1067,
    "lastDetected": "2025-04-12T00:08:32.314Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-538",
    "name": "Insider Threats Attack 38",
    "category": "Insider Threats",
    "severity": "high",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 77.9,
    "activeIncidents": 167,
    "lastDetected": "2025-05-04T06:08:01.503Z",
    "status": "active"
  },
  {
    "id": "attack-vector-539",
    "name": "Insider Threats Attack 39",
    "category": "Insider Threats",
    "severity": "high",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 38.6,
    "activeIncidents": 4116,
    "lastDetected": "2025-06-06T11:51:12.739Z",
    "status": "active"
  },
  {
    "id": "attack-vector-540",
    "name": "Insider Threats Attack 40",
    "category": "Insider Threats",
    "severity": "high",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 22.2,
    "activeIncidents": 2453,
    "lastDetected": "2025-10-28T07:01:45.452Z",
    "status": "active"
  },
  {
    "id": "attack-vector-541",
    "name": "Insider Threats Attack 41",
    "category": "Insider Threats",
    "severity": "low",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 24.3,
    "activeIncidents": 1208,
    "lastDetected": "2025-07-03T14:22:55.383Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-542",
    "name": "Insider Threats Attack 42",
    "category": "Insider Threats",
    "severity": "critical",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 37.8,
    "activeIncidents": 3427,
    "lastDetected": "2025-06-25T08:53:34.767Z",
    "status": "active"
  },
  {
    "id": "attack-vector-543",
    "name": "Insider Threats Attack 43",
    "category": "Insider Threats",
    "severity": "low",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 40.3,
    "activeIncidents": 2791,
    "lastDetected": "2024-12-18T12:49:43.447Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-544",
    "name": "Insider Threats Attack 44",
    "category": "Insider Threats",
    "severity": "low",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 55.7,
    "activeIncidents": 1178,
    "lastDetected": "2025-05-26T20:35:25.801Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-545",
    "name": "Insider Threats Attack 45",
    "category": "Insider Threats",
    "severity": "critical",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 29.5,
    "activeIncidents": 2718,
    "lastDetected": "2025-05-30T07:48:34.885Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-546",
    "name": "Insider Threats Attack 46",
    "category": "Insider Threats",
    "severity": "high",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 54.6,
    "activeIncidents": 113,
    "lastDetected": "2025-01-04T17:28:53.205Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-547",
    "name": "Insider Threats Attack 47",
    "category": "Insider Threats",
    "severity": "critical",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 32.6,
    "activeIncidents": 4003,
    "lastDetected": "2025-02-20T15:04:28.090Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-548",
    "name": "Insider Threats Attack 48",
    "category": "Insider Threats",
    "severity": "medium",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 72.3,
    "activeIncidents": 3984,
    "lastDetected": "2025-05-13T01:54:36.946Z",
    "status": "active"
  },
  {
    "id": "attack-vector-549",
    "name": "Insider Threats Attack 49",
    "category": "Insider Threats",
    "severity": "low",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 47.5,
    "activeIncidents": 3360,
    "lastDetected": "2025-09-04T08:59:21.048Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-550",
    "name": "Insider Threats Attack 50",
    "category": "Insider Threats",
    "severity": "critical",
    "description": "Real-world insider threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Insider Threats",
      "Behavioral pattern in Insider Threats",
      "Network signature of Insider Threats"
    ],
    "mitigation": [
      "Security control for Insider Threats",
      "Monitoring solution for Insider Threats",
      "Response procedure for Insider Threats"
    ],
    "detectionRate": 73.3,
    "activeIncidents": 1102,
    "lastDetected": "2025-07-08T09:29:43.237Z",
    "status": "active"
  },
  {
    "id": "attack-vector-551",
    "name": "Emerging Threats Attack 1",
    "category": "Emerging Threats",
    "severity": "high",
    "description": "Real-world emerging threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Emerging Threats",
      "Behavioral pattern in Emerging Threats",
      "Network signature of Emerging Threats"
    ],
    "mitigation": [
      "Security control for Emerging Threats",
      "Monitoring solution for Emerging Threats",
      "Response procedure for Emerging Threats"
    ],
    "detectionRate": 33.6,
    "activeIncidents": 1863,
    "lastDetected": "2025-05-26T08:40:37.815Z",
    "status": "active"
  },
  {
    "id": "attack-vector-552",
    "name": "Emerging Threats Attack 2",
    "category": "Emerging Threats",
    "severity": "critical",
    "description": "Real-world emerging threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Emerging Threats",
      "Behavioral pattern in Emerging Threats",
      "Network signature of Emerging Threats"
    ],
    "mitigation": [
      "Security control for Emerging Threats",
      "Monitoring solution for Emerging Threats",
      "Response procedure for Emerging Threats"
    ],
    "detectionRate": 49.2,
    "activeIncidents": 3152,
    "lastDetected": "2025-09-22T15:05:02.466Z",
    "status": "active"
  },
  {
    "id": "attack-vector-553",
    "name": "Emerging Threats Attack 3",
    "category": "Emerging Threats",
    "severity": "high",
    "description": "Real-world emerging threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Emerging Threats",
      "Behavioral pattern in Emerging Threats",
      "Network signature of Emerging Threats"
    ],
    "mitigation": [
      "Security control for Emerging Threats",
      "Monitoring solution for Emerging Threats",
      "Response procedure for Emerging Threats"
    ],
    "detectionRate": 50.1,
    "activeIncidents": 4938,
    "lastDetected": "2024-12-14T16:02:43.601Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-554",
    "name": "Emerging Threats Attack 4",
    "category": "Emerging Threats",
    "severity": "high",
    "description": "Real-world emerging threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Emerging Threats",
      "Behavioral pattern in Emerging Threats",
      "Network signature of Emerging Threats"
    ],
    "mitigation": [
      "Security control for Emerging Threats",
      "Monitoring solution for Emerging Threats",
      "Response procedure for Emerging Threats"
    ],
    "detectionRate": 24.4,
    "activeIncidents": 4925,
    "lastDetected": "2025-06-02T10:03:28.084Z",
    "status": "active"
  },
  {
    "id": "attack-vector-555",
    "name": "Emerging Threats Attack 5",
    "category": "Emerging Threats",
    "severity": "medium",
    "description": "Real-world emerging threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Emerging Threats",
      "Behavioral pattern in Emerging Threats",
      "Network signature of Emerging Threats"
    ],
    "mitigation": [
      "Security control for Emerging Threats",
      "Monitoring solution for Emerging Threats",
      "Response procedure for Emerging Threats"
    ],
    "detectionRate": 57.8,
    "activeIncidents": 207,
    "lastDetected": "2025-05-01T08:13:31.486Z",
    "status": "active"
  },
  {
    "id": "attack-vector-556",
    "name": "Emerging Threats Attack 6",
    "category": "Emerging Threats",
    "severity": "medium",
    "description": "Real-world emerging threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Emerging Threats",
      "Behavioral pattern in Emerging Threats",
      "Network signature of Emerging Threats"
    ],
    "mitigation": [
      "Security control for Emerging Threats",
      "Monitoring solution for Emerging Threats",
      "Response procedure for Emerging Threats"
    ],
    "detectionRate": 50.5,
    "activeIncidents": 3409,
    "lastDetected": "2025-08-09T06:35:12.940Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-557",
    "name": "Emerging Threats Attack 7",
    "category": "Emerging Threats",
    "severity": "low",
    "description": "Real-world emerging threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Emerging Threats",
      "Behavioral pattern in Emerging Threats",
      "Network signature of Emerging Threats"
    ],
    "mitigation": [
      "Security control for Emerging Threats",
      "Monitoring solution for Emerging Threats",
      "Response procedure for Emerging Threats"
    ],
    "detectionRate": 27.1,
    "activeIncidents": 2938,
    "lastDetected": "2025-03-02T13:10:12.024Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-558",
    "name": "Emerging Threats Attack 8",
    "category": "Emerging Threats",
    "severity": "high",
    "description": "Real-world emerging threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Emerging Threats",
      "Behavioral pattern in Emerging Threats",
      "Network signature of Emerging Threats"
    ],
    "mitigation": [
      "Security control for Emerging Threats",
      "Monitoring solution for Emerging Threats",
      "Response procedure for Emerging Threats"
    ],
    "detectionRate": 40.7,
    "activeIncidents": 4294,
    "lastDetected": "2025-08-29T02:35:58.376Z",
    "status": "active"
  },
  {
    "id": "attack-vector-559",
    "name": "Emerging Threats Attack 9",
    "category": "Emerging Threats",
    "severity": "low",
    "description": "Real-world emerging threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Emerging Threats",
      "Behavioral pattern in Emerging Threats",
      "Network signature of Emerging Threats"
    ],
    "mitigation": [
      "Security control for Emerging Threats",
      "Monitoring solution for Emerging Threats",
      "Response procedure for Emerging Threats"
    ],
    "detectionRate": 46.8,
    "activeIncidents": 416,
    "lastDetected": "2025-09-12T12:53:25.443Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-560",
    "name": "Emerging Threats Attack 10",
    "category": "Emerging Threats",
    "severity": "medium",
    "description": "Real-world emerging threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Emerging Threats",
      "Behavioral pattern in Emerging Threats",
      "Network signature of Emerging Threats"
    ],
    "mitigation": [
      "Security control for Emerging Threats",
      "Monitoring solution for Emerging Threats",
      "Response procedure for Emerging Threats"
    ],
    "detectionRate": 32.3,
    "activeIncidents": 3046,
    "lastDetected": "2025-06-06T20:19:18.248Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-561",
    "name": "Emerging Threats Attack 11",
    "category": "Emerging Threats",
    "severity": "medium",
    "description": "Real-world emerging threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Emerging Threats",
      "Behavioral pattern in Emerging Threats",
      "Network signature of Emerging Threats"
    ],
    "mitigation": [
      "Security control for Emerging Threats",
      "Monitoring solution for Emerging Threats",
      "Response procedure for Emerging Threats"
    ],
    "detectionRate": 43,
    "activeIncidents": 3677,
    "lastDetected": "2025-06-21T19:42:46.369Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-562",
    "name": "Emerging Threats Attack 12",
    "category": "Emerging Threats",
    "severity": "low",
    "description": "Real-world emerging threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Emerging Threats",
      "Behavioral pattern in Emerging Threats",
      "Network signature of Emerging Threats"
    ],
    "mitigation": [
      "Security control for Emerging Threats",
      "Monitoring solution for Emerging Threats",
      "Response procedure for Emerging Threats"
    ],
    "detectionRate": 35.7,
    "activeIncidents": 4802,
    "lastDetected": "2025-02-04T18:44:23.660Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-563",
    "name": "Emerging Threats Attack 13",
    "category": "Emerging Threats",
    "severity": "medium",
    "description": "Real-world emerging threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Emerging Threats",
      "Behavioral pattern in Emerging Threats",
      "Network signature of Emerging Threats"
    ],
    "mitigation": [
      "Security control for Emerging Threats",
      "Monitoring solution for Emerging Threats",
      "Response procedure for Emerging Threats"
    ],
    "detectionRate": 76.2,
    "activeIncidents": 4329,
    "lastDetected": "2025-06-10T23:30:22.587Z",
    "status": "active"
  },
  {
    "id": "attack-vector-564",
    "name": "Emerging Threats Attack 14",
    "category": "Emerging Threats",
    "severity": "low",
    "description": "Real-world emerging threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Emerging Threats",
      "Behavioral pattern in Emerging Threats",
      "Network signature of Emerging Threats"
    ],
    "mitigation": [
      "Security control for Emerging Threats",
      "Monitoring solution for Emerging Threats",
      "Response procedure for Emerging Threats"
    ],
    "detectionRate": 35.4,
    "activeIncidents": 1059,
    "lastDetected": "2025-10-05T06:12:35.373Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-565",
    "name": "Emerging Threats Attack 15",
    "category": "Emerging Threats",
    "severity": "medium",
    "description": "Real-world emerging threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Emerging Threats",
      "Behavioral pattern in Emerging Threats",
      "Network signature of Emerging Threats"
    ],
    "mitigation": [
      "Security control for Emerging Threats",
      "Monitoring solution for Emerging Threats",
      "Response procedure for Emerging Threats"
    ],
    "detectionRate": 46.4,
    "activeIncidents": 4024,
    "lastDetected": "2025-02-11T16:57:09.830Z",
    "status": "active"
  },
  {
    "id": "attack-vector-566",
    "name": "Emerging Threats Attack 16",
    "category": "Emerging Threats",
    "severity": "critical",
    "description": "Real-world emerging threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Emerging Threats",
      "Behavioral pattern in Emerging Threats",
      "Network signature of Emerging Threats"
    ],
    "mitigation": [
      "Security control for Emerging Threats",
      "Monitoring solution for Emerging Threats",
      "Response procedure for Emerging Threats"
    ],
    "detectionRate": 63.7,
    "activeIncidents": 353,
    "lastDetected": "2024-12-24T20:01:09.268Z",
    "status": "active"
  },
  {
    "id": "attack-vector-567",
    "name": "Emerging Threats Attack 17",
    "category": "Emerging Threats",
    "severity": "critical",
    "description": "Real-world emerging threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Emerging Threats",
      "Behavioral pattern in Emerging Threats",
      "Network signature of Emerging Threats"
    ],
    "mitigation": [
      "Security control for Emerging Threats",
      "Monitoring solution for Emerging Threats",
      "Response procedure for Emerging Threats"
    ],
    "detectionRate": 79.9,
    "activeIncidents": 4012,
    "lastDetected": "2025-06-28T15:22:32.568Z",
    "status": "active"
  },
  {
    "id": "attack-vector-568",
    "name": "Emerging Threats Attack 18",
    "category": "Emerging Threats",
    "severity": "medium",
    "description": "Real-world emerging threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Emerging Threats",
      "Behavioral pattern in Emerging Threats",
      "Network signature of Emerging Threats"
    ],
    "mitigation": [
      "Security control for Emerging Threats",
      "Monitoring solution for Emerging Threats",
      "Response procedure for Emerging Threats"
    ],
    "detectionRate": 51.1,
    "activeIncidents": 1657,
    "lastDetected": "2024-11-23T20:07:52.709Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-569",
    "name": "Emerging Threats Attack 19",
    "category": "Emerging Threats",
    "severity": "low",
    "description": "Real-world emerging threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Emerging Threats",
      "Behavioral pattern in Emerging Threats",
      "Network signature of Emerging Threats"
    ],
    "mitigation": [
      "Security control for Emerging Threats",
      "Monitoring solution for Emerging Threats",
      "Response procedure for Emerging Threats"
    ],
    "detectionRate": 72.6,
    "activeIncidents": 2866,
    "lastDetected": "2025-10-12T09:04:29.224Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-570",
    "name": "Emerging Threats Attack 20",
    "category": "Emerging Threats",
    "severity": "critical",
    "description": "Real-world emerging threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Emerging Threats",
      "Behavioral pattern in Emerging Threats",
      "Network signature of Emerging Threats"
    ],
    "mitigation": [
      "Security control for Emerging Threats",
      "Monitoring solution for Emerging Threats",
      "Response procedure for Emerging Threats"
    ],
    "detectionRate": 48.2,
    "activeIncidents": 4424,
    "lastDetected": "2025-10-19T20:26:28.120Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-571",
    "name": "Emerging Threats Attack 21",
    "category": "Emerging Threats",
    "severity": "medium",
    "description": "Real-world emerging threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Emerging Threats",
      "Behavioral pattern in Emerging Threats",
      "Network signature of Emerging Threats"
    ],
    "mitigation": [
      "Security control for Emerging Threats",
      "Monitoring solution for Emerging Threats",
      "Response procedure for Emerging Threats"
    ],
    "detectionRate": 78.8,
    "activeIncidents": 913,
    "lastDetected": "2025-10-12T01:08:09.037Z",
    "status": "active"
  },
  {
    "id": "attack-vector-572",
    "name": "Emerging Threats Attack 22",
    "category": "Emerging Threats",
    "severity": "low",
    "description": "Real-world emerging threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Emerging Threats",
      "Behavioral pattern in Emerging Threats",
      "Network signature of Emerging Threats"
    ],
    "mitigation": [
      "Security control for Emerging Threats",
      "Monitoring solution for Emerging Threats",
      "Response procedure for Emerging Threats"
    ],
    "detectionRate": 72.9,
    "activeIncidents": 4131,
    "lastDetected": "2024-11-03T04:48:50.780Z",
    "status": "active"
  },
  {
    "id": "attack-vector-573",
    "name": "Emerging Threats Attack 23",
    "category": "Emerging Threats",
    "severity": "high",
    "description": "Real-world emerging threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Emerging Threats",
      "Behavioral pattern in Emerging Threats",
      "Network signature of Emerging Threats"
    ],
    "mitigation": [
      "Security control for Emerging Threats",
      "Monitoring solution for Emerging Threats",
      "Response procedure for Emerging Threats"
    ],
    "detectionRate": 27.2,
    "activeIncidents": 95,
    "lastDetected": "2025-03-19T07:51:21.693Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-574",
    "name": "Emerging Threats Attack 24",
    "category": "Emerging Threats",
    "severity": "low",
    "description": "Real-world emerging threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Emerging Threats",
      "Behavioral pattern in Emerging Threats",
      "Network signature of Emerging Threats"
    ],
    "mitigation": [
      "Security control for Emerging Threats",
      "Monitoring solution for Emerging Threats",
      "Response procedure for Emerging Threats"
    ],
    "detectionRate": 52.6,
    "activeIncidents": 3632,
    "lastDetected": "2025-07-26T17:00:37.133Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-575",
    "name": "Emerging Threats Attack 25",
    "category": "Emerging Threats",
    "severity": "medium",
    "description": "Real-world emerging threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Emerging Threats",
      "Behavioral pattern in Emerging Threats",
      "Network signature of Emerging Threats"
    ],
    "mitigation": [
      "Security control for Emerging Threats",
      "Monitoring solution for Emerging Threats",
      "Response procedure for Emerging Threats"
    ],
    "detectionRate": 45,
    "activeIncidents": 4670,
    "lastDetected": "2025-08-28T01:04:31.425Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-576",
    "name": "Emerging Threats Attack 26",
    "category": "Emerging Threats",
    "severity": "high",
    "description": "Real-world emerging threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Emerging Threats",
      "Behavioral pattern in Emerging Threats",
      "Network signature of Emerging Threats"
    ],
    "mitigation": [
      "Security control for Emerging Threats",
      "Monitoring solution for Emerging Threats",
      "Response procedure for Emerging Threats"
    ],
    "detectionRate": 77.1,
    "activeIncidents": 4462,
    "lastDetected": "2025-07-10T08:15:18.040Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-577",
    "name": "Emerging Threats Attack 27",
    "category": "Emerging Threats",
    "severity": "medium",
    "description": "Real-world emerging threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Emerging Threats",
      "Behavioral pattern in Emerging Threats",
      "Network signature of Emerging Threats"
    ],
    "mitigation": [
      "Security control for Emerging Threats",
      "Monitoring solution for Emerging Threats",
      "Response procedure for Emerging Threats"
    ],
    "detectionRate": 40.7,
    "activeIncidents": 3871,
    "lastDetected": "2025-03-16T18:34:09.161Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-578",
    "name": "Emerging Threats Attack 28",
    "category": "Emerging Threats",
    "severity": "high",
    "description": "Real-world emerging threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Emerging Threats",
      "Behavioral pattern in Emerging Threats",
      "Network signature of Emerging Threats"
    ],
    "mitigation": [
      "Security control for Emerging Threats",
      "Monitoring solution for Emerging Threats",
      "Response procedure for Emerging Threats"
    ],
    "detectionRate": 66.7,
    "activeIncidents": 92,
    "lastDetected": "2025-08-23T16:11:06.684Z",
    "status": "active"
  },
  {
    "id": "attack-vector-579",
    "name": "Emerging Threats Attack 29",
    "category": "Emerging Threats",
    "severity": "low",
    "description": "Real-world emerging threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Emerging Threats",
      "Behavioral pattern in Emerging Threats",
      "Network signature of Emerging Threats"
    ],
    "mitigation": [
      "Security control for Emerging Threats",
      "Monitoring solution for Emerging Threats",
      "Response procedure for Emerging Threats"
    ],
    "detectionRate": 75.2,
    "activeIncidents": 2453,
    "lastDetected": "2025-09-02T06:23:43.602Z",
    "status": "active"
  },
  {
    "id": "attack-vector-580",
    "name": "Emerging Threats Attack 30",
    "category": "Emerging Threats",
    "severity": "high",
    "description": "Real-world emerging threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Emerging Threats",
      "Behavioral pattern in Emerging Threats",
      "Network signature of Emerging Threats"
    ],
    "mitigation": [
      "Security control for Emerging Threats",
      "Monitoring solution for Emerging Threats",
      "Response procedure for Emerging Threats"
    ],
    "detectionRate": 36.3,
    "activeIncidents": 3372,
    "lastDetected": "2025-05-21T21:08:59.429Z",
    "status": "monitored"
  },
  {
    "id": "attack-vector-581",
    "name": "Emerging Threats Attack 31",
    "category": "Emerging Threats",
    "severity": "medium",
    "description": "Real-world emerging threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Emerging Threats",
      "Behavioral pattern in Emerging Threats",
      "Network signature of Emerging Threats"
    ],
    "mitigation": [
      "Security control for Emerging Threats",
      "Monitoring solution for Emerging Threats",
      "Response procedure for Emerging Threats"
    ],
    "detectionRate": 74.2,
    "activeIncidents": 2982,
    "lastDetected": "2024-12-13T06:50:37.806Z",
    "status": "active"
  },
  {
    "id": "attack-vector-582",
    "name": "Emerging Threats Attack 32",
    "category": "Emerging Threats",
    "severity": "high",
    "description": "Real-world emerging threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Emerging Threats",
      "Behavioral pattern in Emerging Threats",
      "Network signature of Emerging Threats"
    ],
    "mitigation": [
      "Security control for Emerging Threats",
      "Monitoring solution for Emerging Threats",
      "Response procedure for Emerging Threats"
    ],
    "detectionRate": 23.7,
    "activeIncidents": 2754,
    "lastDetected": "2025-07-06T01:55:26.704Z",
    "status": "active"
  },
  {
    "id": "attack-vector-583",
    "name": "Emerging Threats Attack 33",
    "category": "Emerging Threats",
    "severity": "high",
    "description": "Real-world emerging threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Emerging Threats",
      "Behavioral pattern in Emerging Threats",
      "Network signature of Emerging Threats"
    ],
    "mitigation": [
      "Security control for Emerging Threats",
      "Monitoring solution for Emerging Threats",
      "Response procedure for Emerging Threats"
    ],
    "detectionRate": 59.6,
    "activeIncidents": 3980,
    "lastDetected": "2025-04-23T22:07:43.285Z",
    "status": "contained"
  },
  {
    "id": "attack-vector-584",
    "name": "Emerging Threats Attack 34",
    "category": "Emerging Threats",
    "severity": "low",
    "description": "Real-world emerging threats attack vector involving sophisticated techniques",
    "indicators": [
      "Technical indicator for Emerging Threats",
      "Behavioral pattern in Emerging Threats",
      "Network signature of Emerging Threats"
    ],
    "mitigation": [
      "Security control for Emerging Threats",
      "Monitoring solution for Emerging Threats",
      "Response procedure for Emerging Threats"
    ],
    "detectionRate": 37.2,
    "activeIncidents": 476,
    "lastDetected": "2025-06-29T02:05:55.286Z",
    "status": "active"
  }
];

const CATEGORIES = [
  'All Vectors',
  'AI Threats',
  'Child Exploitation',
  'Malware',
  'Network Attacks',
  'Social Engineering',
  'Data Breaches',
  'IoT Threats',
  'Cloud Threats',
  'Mobile Threats',
  'Financial Fraud',
  'Physical Security',
  'Insider Threats',
  'Emerging Threats'
];

export function AttackVectors() {
  const [selectedCategory, setSelectedCategory] = useState('All Vectors');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVector, setSelectedVector] = useState<AttackVector | null>(null);
  const { threatUpdates } = useThreatMonitoring();
  const { isConnected } = useWebSocket();

  const filteredVectors = ATTACK_VECTORS.filter(vector => {
    const matchesCategory = selectedCategory === 'All Vectors' || vector.category === selectedCategory;
    const matchesSearch = vector.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vector.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vector.indicators.some(indicator => indicator.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/10 border-green-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-red-400';
      case 'monitored': return 'text-yellow-400';
      case 'contained': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'AI Threats': return <Brain className="w-4 h-4" />;
      case 'Child Exploitation': return <Shield className="w-4 h-4" />;
      case 'Malware': return <Bug className="w-4 h-4" />;
      case 'Network Attacks': return <Wifi className="w-4 h-4" />;
      case 'Social Engineering': return <Users className="w-4 h-4" />;
      case 'Data Breaches': return <Database className="w-4 h-4" />;
      case 'IoT Threats': return <Smartphone className="w-4 h-4" />;
      case 'Cloud Threats': return <Cloud className="w-4 h-4" />;
      case 'Mobile Threats': return <Phone className="w-4 h-4" />;
      case 'Financial Fraud': return <CreditCard className="w-4 h-4" />;
      case 'Physical Security': return <Lock className="w-4 h-4" />;
      case 'Insider Threats': return <Eye className="w-4 h-4" />;
      case 'Emerging Threats': return <TrendingUp className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getStatsByCategory = () => {
    const stats: Record<string, { total: number, critical: number, high: number, active: number }> = {};

    CATEGORIES.forEach(category => {
      if (category === 'All Vectors') return;

      const categoryVectors = ATTACK_VECTORS.filter(v => v.category === category);
      stats[category] = {
        total: categoryVectors.length,
        critical: categoryVectors.filter(v => v.severity === 'critical').length,
        high: categoryVectors.filter(v => v.severity === 'high').length,
        active: categoryVectors.filter(v => v.status === 'active').length
      };
    });

    return stats;
  };

  const categoryStats = getStatsByCategory();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <Target className="w-10 h-10 text-red-400" />
              Attack Vectors Database
              <Badge variant="outline" className="text-blue-400 border-blue-400">
                {ATTACK_VECTORS.length} Vectors
              </Badge>
            </h1>
            <div className="flex items-center gap-4">
              {isConnected ? (
                <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                  <Activity className="w-3 h-3 mr-1" />
                  LIVE MONITORING
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <WifiOff className="w-3 h-3 mr-1" />
                  OFFLINE
                </Badge>
              )}
            </div>
          </div>
          <p className="text-slate-400">Comprehensive database of 494+ cyber attack vectors with real-time monitoring</p>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search attack vectors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-700"
              />
            </div>
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48 bg-slate-800/50 border-slate-700">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {CATEGORIES.map(category => (
                <SelectItem key={category} value={category} className="text-white">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(category)}
                    {category}
                    {category !== 'All Vectors' && (
                      <Badge variant="secondary" className="ml-auto">
                        {categoryStats[category]?.total || 0}
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="vectors">Attack Vectors</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="monitoring">Real-time</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="w-5 h-5 text-red-400" />
                    Total Vectors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{ATTACK_VECTORS.length}</div>
                  <p className="text-sm text-slate-400">Across 13 categories</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    Critical Threats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-400">
                    {ATTACK_VECTORS.filter(v => v.severity === 'critical').length}
                  </div>
                  <p className="text-sm text-slate-400">High-priority vectors</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Activity className="w-5 h-5 text-orange-400" />
                    Active Incidents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-400">
                    {ATTACK_VECTORS.reduce((sum, v) => sum + v.activeIncidents, 0).toLocaleString()}
                  </div>
                  <p className="text-sm text-slate-400">Currently monitored</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    Detection Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-400">
                    {(ATTACK_VECTORS.reduce((sum, v) => sum + v.detectionRate, 0) / ATTACK_VECTORS.length).toFixed(1)}%
                  </div>
                  <p className="text-sm text-slate-400">Average effectiveness</p>
                </CardContent>
              </Card>
            </div>

            {/* Category Breakdown */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>Attack Vector Categories</CardTitle>
                <CardDescription>Detailed breakdown by threat category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(categoryStats).map(([category, stats]) => (
                    <div key={category} className="p-4 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        {getCategoryIcon(category)}
                        <h3 className="font-semibold">{category}</h3>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Total:</span>
                          <span className="text-white">{stats.total}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Critical:</span>
                          <span className="text-red-400">{stats.critical}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">High:</span>
                          <span className="text-orange-400">{stats.high}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Active:</span>
                          <span className="text-green-400">{stats.active}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vectors" className="space-y-6">
            {/* Vector Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVectors.map(vector => (
                <Card
                  key={vector.id}
                  className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedVector(vector)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(vector.category)}
                        <CardTitle className="text-lg">{vector.name}</CardTitle>
                      </div>
                      <Badge className={getSeverityColor(vector.severity)}>
                        {vector.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <CardDescription>{vector.category}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-300 mb-3 line-clamp-2">
                      {vector.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Detection Rate:</span>
                        <span className="text-green-400 font-semibold">{vector.detectionRate}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Active Incidents:</span>
                        <span className="text-orange-400 font-semibold">{vector.activeIncidents}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Status:</span>
                        <span className={`font-semibold ${getStatusColor(vector.status)}`}>
                          {vector.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredVectors.length === 0 && (
              <div className="text-center py-12">
                <Target className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                <h3 className="text-lg font-semibold text-slate-300 mb-2">No attack vectors found</h3>
                <p className="text-slate-400">Try adjusting your search criteria</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Severity Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['critical', 'high', 'medium', 'low'].map(severity => {
                      const count = ATTACK_VECTORS.filter(v => v.severity === severity).length;
                      const percentage = (count / ATTACK_VECTORS.length * 100).toFixed(1);
                      return (
                        <div key={severity} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${
                              severity === 'critical' ? 'bg-red-400' :
                              severity === 'high' ? 'bg-orange-400' :
                              severity === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                            }`} />
                            <span className="capitalize">{severity}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400">{count}</span>
                            <span className="text-slate-300">({percentage}%)</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Status Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['active', 'monitored', 'contained'].map(status => {
                      const count = ATTACK_VECTORS.filter(v => v.status === status).length;
                      const percentage = (count / ATTACK_VECTORS.length * 100).toFixed(1);
                      return (
                        <div key={status} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${
                              status === 'active' ? 'bg-red-400' :
                              status === 'monitored' ? 'bg-yellow-400' : 'bg-green-400'
                            }`} />
                            <span className="capitalize">{status}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400">{count}</span>
                            <span className="text-slate-300">({percentage}%)</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detection Rate Analysis */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="w-5 h-5" />
                  Detection Performance
                </CardTitle>
                <CardDescription>Average detection rates by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(categoryStats).map(([category]) => {
                    const categoryVectors = ATTACK_VECTORS.filter(v => v.category === category);
                    const avgDetectionRate = categoryVectors.reduce((sum, v) => sum + v.detectionRate, 0) / categoryVectors.length;

                    return (
                      <div key={category} className="p-4 bg-slate-700/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          {getCategoryIcon(category)}
                          <h3 className="font-semibold text-sm">{category}</h3>
                        </div>
                        <div className="text-2xl font-bold text-green-400 mb-1">
                          {avgDetectionRate.toFixed(1)}%
                        </div>
                        <div className="text-xs text-slate-400">
                          {categoryVectors.length} vectors monitored
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            {/* Real-time Threat Feed */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-400" />
                  Real-time Threat Feed
                </CardTitle>
                <CardDescription>Live threat detections and attack vector activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {threatUpdates.length > 0 ? (
                    threatUpdates.map((update, index) => (
                      <div key={index} className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                            <span className="font-semibold text-red-400">
                              {update.threat.threatName}
                            </span>
                          </div>
                          <Badge className={getSeverityColor(update.threat.severity)}>
                            {update.threat.severity.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-300 mb-2">
                          {update.threat.description || 'Threat detected in system monitoring'}
                        </p>
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>System Load: {update.systemLoad.toFixed(1)}%</span>
                          <span>{new Date(update.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-400">
                      <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No recent threat activity</p>
                      <p className="text-xs">Monitoring active...</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Live Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Active Monitoring</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {isConnected ? 'ONLINE' : 'OFFLINE'}
                  </div>
                  <p className="text-sm text-slate-400">
                    WebSocket connection status
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Vectors Tracked</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    {ATTACK_VECTORS.length}
                  </div>
                  <p className="text-sm text-slate-400">
                    Real-time monitoring active
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Recent Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-400 mb-2">
                    {threatUpdates.length}
                  </div>
                  <p className="text-sm text-slate-400">
                    Last 10 threat detections
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Vector Detail Modal */}
        {selectedVector && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getCategoryIcon(selectedVector.category)}
                    <div>
                      <h2 className="text-2xl font-bold">{selectedVector.name}</h2>
                      <p className="text-slate-400">{selectedVector.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getSeverityColor(selectedVector.severity)}>
                      {selectedVector.severity.toUpperCase()}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedVector(null)}
                      className="text-slate-400 hover:text-white"
                    >
                      ✕
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-slate-300">{selectedVector.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Detection Indicators</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedVector.indicators.map((indicator, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-blue-400 rounded-full" />
                          <span className="text-slate-300">{indicator}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Mitigation Strategies</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedVector.mitigation.map((strategy, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Shield className="w-4 h-4 text-green-400" />
                          <span className="text-slate-300">{strategy}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-700/30 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {selectedVector.detectionRate}%
                      </div>
                      <div className="text-xs text-slate-400">Detection Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-400">
                        {selectedVector.activeIncidents}
                      </div>
                      <div className="text-xs text-slate-400">Active Incidents</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        {selectedVector.status.toUpperCase()}
                      </div>
                      <div className="text-xs text-slate-400">Status</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        {new Date(selectedVector.lastDetected).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-slate-400">Last Detected</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
