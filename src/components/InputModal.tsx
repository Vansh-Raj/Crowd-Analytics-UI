import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { buildUrl } from "../lib/endpoints";

interface Props {
  mode: "live" | "advanced";
  onClose: () => void;
}

function InputModal({ mode, onClose }: Props) {
  const [rtsp, setRtsp] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const start = async () => {
    // ---------- RTSP ----------
    if (rtsp.trim()) {
      navigate(
        `/analytics/${mode}?source=${encodeURIComponent(rtsp)}`
      );
      return;
    }

    // ---------- FILE UPLOAD ----------
    if (file) {
      setLoading(true);

      const form = new FormData();
      form.append("file", file);

      const res = await fetch(buildUrl("/upload"), {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      navigate(
        `/analytics/${mode}?source=${encodeURIComponent(data.path)}`
      );
    }
  };

  const isValid = rtsp.trim().length > 0 || file !== null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-[420px] p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Select Video Source</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <input
          placeholder="RTSP URL (optional)"
          value={rtsp}
          onChange={(e) => setRtsp(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />

        <div className="text-center text-sm text-slate-500">
          OR upload a video
        </div>

        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />

        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 bg-slate-200 py-2 rounded"
          >
            Cancel
          </button>

          <button
            disabled={!isValid || loading}
            onClick={start}
            className="flex-1 bg-blue-600 text-white py-2 rounded disabled:opacity-50"
          >
            {loading ? "Uploading…" : "Start"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default InputModal;
