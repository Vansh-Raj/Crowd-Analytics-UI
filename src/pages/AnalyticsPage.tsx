import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { useWebSocketStream } from "../hooks/useWebSocketStream";
import CountGraph from "../components/CountGraph";
import { buildUrl, buildWs } from "../lib/endpoints";

interface DataPoint {
  timestamp: number;
  count: number;
}

function AnalyticsPage() {
  const { mode } = useParams<{ mode: "live" | "advanced" }>();
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const source = params.get("source");

  useEffect(() => {
    if (!source) navigate("/");
  }, [source, navigate]);

  const endpoint = buildWs(mode === "advanced" ? "/advanced" : "/live");

  const {
    processedFrame,
    count,
    connected,
    error,
  } = useWebSocketStream(endpoint, source!);

  const [history, setHistory] = useState<DataPoint[]>([]);

  useEffect(() => {
    if (typeof count === "number") {
      setHistory((h) => [
        ...h.slice(-49),
        { timestamp: Date.now(), count },
      ]);
    }
  }, [count]);

 return (
  <div className="min-h-screen bg-slate-900 text-white">
    {/* Header */}
    <header className="bg-slate-800 px-6 py-4 flex justify-between items-center">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-slate-300 hover:text-white"
      >
        <ArrowLeft />
        Back
      </button>

      <span className="text-sm">
        {connected ? "🟢 Connected" : "🔴 Disconnected"}
      </span>
    </header>

    <div className="p-6 grid grid-cols-2 gap-6 max-w-7xl mx-auto">
      {/* VIDEO + OVERLAY */}
      <div className="relative bg-black aspect-video rounded-lg overflow-hidden border border-slate-700">
        {source ? (
          <img
            src={buildUrl(`/mjpeg?source=${encodeURIComponent(source)}`)}
            alt="Original video stream"
            className="absolute inset-0 w-full h-full object-contain"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-500">
            No source
          </div>
        )}

        {processedFrame && (
          <img
            src={processedFrame}
            alt="Processed overlay"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          />
        )}
      </div>

      {/* COUNT */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center aspect-video">
        <div className="text-center">
          <div className="text-7xl font-bold text-blue-400">
            {typeof count === "number" ? count : "--"}
          </div>
          <div className="text-slate-400 mt-2">
            {mode === "live"
              ? "People Detected"
              : "Estimated Count"}
          </div>
        </div>
      </div>

      {/* SOURCE */}
      <div className="bg-black aspect-video rounded-lg overflow-hidden border border-slate-700">
      {source && source.startsWith("/tmp/") ? (
        // ✅ Local uploaded video → TRUE playback
        <video
          src={buildUrl(`/video?path=${encodeURIComponent(source)}`)}
          controls
          autoPlay
          muted
          playsInline
          className="w-full h-full object-contain"
        />
      ) : (
        // ✅ RTSP → MJPEG fallback
        <img
          src={buildUrl(`/mjpeg?source=${encodeURIComponent(source ?? "")}`)}
          alt="Live stream"
          className="w-full h-full object-contain"
        />
      )}
    </div>
      {/* GRAPH */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 aspect-video">
        <CountGraph data={history} />
      </div>
    </div>

    {error && (
      <div className="m-4 p-3 bg-red-500/10 text-red-400 text-sm rounded-lg">
        {error}
      </div>
    )}
  </div>
);
}

export default AnalyticsPage;
