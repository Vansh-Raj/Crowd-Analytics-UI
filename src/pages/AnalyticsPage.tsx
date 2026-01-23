import { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useWebSocketStream } from '../hooks/useWebSocketStream';
import CountGraph from '../components/CountGraph';

interface DataPoint {
  timestamp: number;
  count: number;
}

function AnalyticsPage() {
  const { mode } = useParams<{ mode: 'live' | 'advanced' }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { source, isFile } = location.state || {};

  const [countHistory, setCountHistory] = useState<DataPoint[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  const endpoint = mode === 'live'
    ? 'ws://localhost:8000/ws/live'
    : 'ws://localhost:8000/ws/advanced';

  const { processedFrame, count, isConnected, error } = useWebSocketStream(endpoint, source);

  useEffect(() => {
    if (!source) {
      navigate('/');
    }
  }, [source, navigate]);

  useEffect(() => {
    if (isFile && videoRef.current && source) {
      videoRef.current.src = source;
      videoRef.current.play();
    }
  }, [isFile, source]);

  useEffect(() => {
    if (count !== undefined) {
      setCountHistory(prev => {
        const newHistory = [...prev, { timestamp: Date.now(), count }];
        return newHistory.slice(-50);
      });
    }
  }, [count]);

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
            <div className="h-6 w-px bg-slate-600" />
            <h1 className="text-xl font-bold text-white">
              {mode === 'live' ? 'Live Detection' : 'Advanced Analytics'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-slate-300">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 m-4 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="p-6">
        <div className="grid grid-cols-2 gap-6 max-w-7xl mx-auto">
          <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
            <div className="bg-slate-700 px-4 py-2 border-b border-slate-600">
              <h2 className="text-sm font-semibold text-white">Raw Video Feed</h2>
            </div>
            <div className="aspect-video bg-black flex items-center justify-center">
              {isFile ? (
                <video
                  ref={videoRef}
                  className="w-full h-full object-contain"
                  controls
                  loop
                />
              ) : (
                <div className="text-slate-500 text-center">
                  <p>RTSP Stream</p>
                  <p className="text-xs mt-2 text-slate-600">{source}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
            <div className="bg-slate-700 px-4 py-2 border-b border-slate-600">
              <h2 className="text-sm font-semibold text-white">Processed Output</h2>
            </div>
            <div className="aspect-video bg-black flex items-center justify-center">
              {processedFrame ? (
                <img
                  src={processedFrame}
                  alt="Processed frame"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-slate-500">
                  {isConnected ? 'Processing...' : 'Waiting for connection...'}
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
            <div className="bg-slate-700 px-4 py-2 border-b border-slate-600">
              <h2 className="text-sm font-semibold text-white">Current Count</h2>
            </div>
            <div className="aspect-video flex items-center justify-center">
              <div className="text-center">
                <div className="text-7xl font-bold text-blue-400 mb-2">
                  {count}
                </div>
                <div className="text-slate-400 text-lg">
                  {mode === 'live' ? 'People Detected' : 'Estimated Count'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
            <div className="bg-slate-700 px-4 py-2 border-b border-slate-600">
              <h2 className="text-sm font-semibold text-white">Count Over Time</h2>
            </div>
            <div className="aspect-video flex items-center justify-center p-4">
              <CountGraph data={countHistory} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;
