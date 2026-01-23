import { useEffect, useRef, useState } from 'react';

interface WebSocketMessage {
  frame?: string;
  count?: number;
  error?: string;
}

export function useWebSocketStream(endpoint: string, source: string) {
  const [processedFrame, setProcessedFrame] = useState<string>('');
  const [count, setCount] = useState<number>(0);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string>('');
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(endpoint);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      ws.send(source);
    };

    ws.onmessage = (event) => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data);

        if (data.frame) {
          setProcessedFrame(`data:image/jpeg;base64,${data.frame}`);
        }

        if (data.count !== undefined) {
          setCount(data.count);
        }

        if (data.error) {
          setError(data.error);
        }
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
      }
    };

    ws.onerror = (event) => {
      console.error('WebSocket error:', event);
      setError('Connection error occurred');
      setIsConnected(false);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [endpoint, source]);

  return { processedFrame, count, isConnected, error };
}
