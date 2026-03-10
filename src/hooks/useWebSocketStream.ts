import { useEffect, useRef, useState } from "react";

export function useWebSocketStream(
  endpoint: string,
  source: string
) {
  const wsRef = useRef<WebSocket | null>(null);

  const [processedFrame, setProcessedFrame] = useState<string | null>(null);
  const [count, setCount] = useState<number | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!endpoint || !source) return;

    const ws = new WebSocket(endpoint);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      setError(null);
      ws.send(JSON.stringify({ source }));
    };

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.frame) {
          setProcessedFrame(
            `data:image/jpeg;base64,${data.frame}`
          );
        }
        if (typeof data.count === "number") {
          setCount(data.count);
        }
      } catch { void 0; }
    };

    ws.onerror = () => setError("WebSocket error");
    ws.onclose = () => setConnected(false);

    return () => ws.close();
  }, [endpoint, source]);

  return {
    processedFrame,
    count,
    connected,
    error,
  };
}
