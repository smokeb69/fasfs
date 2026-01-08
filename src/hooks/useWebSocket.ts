import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface WebSocketHookOptions {
  url?: string;
  autoConnect?: boolean;
}

interface SystemStatus {
  status: string;
  timestamp: string;
  activeSystems: string[];
}

interface ThreatUpdate {
  threat: any;
  totalDetected: number;
  systemLoad: number;
  timestamp: string;
}

interface SystemMetrics {
  type: string;
  data: any;
  performance: any;
  timestamp: string;
}

export function useWebSocket(options: WebSocketHookOptions = {}) {
  const { url = 'http://localhost:5000', autoConnect = true } = options;
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [threatUpdates, setThreatUpdates] = useState<ThreatUpdate[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics[]>([]);

  useEffect(() => {
    if (!autoConnect) return;

    // Create socket connection
    socketRef.current = io(url, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
    });

    const socket = socketRef.current;

    // Connection events
    socket.on('connect', () => {
      console.log('[WEBSOCKET] 🔌 Connected to server');
      setIsConnected(true);

      // Subscribe to threat monitoring
      socket.emit('monitor-threats');
      // Subscribe to swarm monitoring
      socket.emit('monitor-swarm');
    });

    socket.on('disconnect', () => {
      console.log('[WEBSOCKET] ❌ Disconnected from server');
      setIsConnected(false);
    });

    // System status updates
    socket.on('system-status', (data: SystemStatus) => {
      console.log('[WEBSOCKET] 📊 System status update:', data);
      setSystemStatus(data);
    });

    // Threat updates
    socket.on('threat-update', (data: ThreatUpdate) => {
      console.log('[WEBSOCKET] 🛡️ Threat update:', data);
      setThreatUpdates(prev => [data, ...prev.slice(0, 9)]); // Keep last 10
    });

    // System metrics updates
    socket.on('system-metrics', (data: SystemMetrics) => {
      console.log('[WEBSOCKET] 📈 System metrics:', data);
      setSystemMetrics(prev => [data, ...prev.slice(0, 19)]); // Keep last 20
    });

    // Subscription confirmation
    socket.on('subscription-confirmed', (data: any) => {
      console.log('[WEBSOCKET] ✅ Subscription confirmed:', data);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [url, autoConnect]);

  // Manual connection control
  const connect = () => {
    if (!socketRef.current) {
      socketRef.current = io(url);
    }
  };

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  };

  // Send custom events
  const emit = (event: string, data?: any) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit(event, data);
    }
  };

  return {
    isConnected,
    systemStatus,
    threatUpdates,
    systemMetrics,
    connect,
    disconnect,
    emit,
    socket: socketRef.current,
  };
}

// Specialized hook for threat monitoring
export function useThreatMonitoring() {
  const { isConnected, threatUpdates, systemStatus } = useWebSocket();

  return {
    isConnected,
    threatUpdates,
    systemStatus,
    activeThreatCount: threatUpdates.length > 0 ? threatUpdates[0].totalDetected : 0,
    latestThreat: threatUpdates[0] || null,
  };
}

// Specialized hook for system monitoring
export function useSystemMonitoring() {
  const { isConnected, systemMetrics } = useWebSocket();

  const getLatestMetrics = (type: string) => {
    return systemMetrics.filter(m => m.type === type)[0] || null;
  };

  return {
    isConnected,
    systemMetrics,
    getLatestMetrics,
    crawlerStats: getLatestMetrics('crawler-stats'),
  };
}
