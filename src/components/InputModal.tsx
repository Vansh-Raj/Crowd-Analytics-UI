import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Video, Link as LinkIcon } from 'lucide-react';

interface InputModalProps {
  mode: 'live' | 'advanced';
  onClose: () => void;
}

function InputModal({ mode, onClose }: InputModalProps) {
  const [inputType, setInputType] = useState<'file' | 'rtsp'>('rtsp');
  const [rtspUrl, setRtspUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (inputType === 'rtsp' && rtspUrl) {
      navigate(`/analytics/${mode}`, { state: { source: rtspUrl } });
    } else if (inputType === 'file' && selectedFile) {
      const fileUrl = URL.createObjectURL(selectedFile);
      navigate(`/analytics/${mode}`, { state: { source: fileUrl, isFile: true } });
    }
  };

  const isValid = (inputType === 'rtsp' && rtspUrl) || (inputType === 'file' && selectedFile);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h3 className="text-2xl font-bold text-slate-900">
            Configure Video Source
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex gap-4">
            <button
              onClick={() => setInputType('rtsp')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                inputType === 'rtsp'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <LinkIcon className="w-5 h-5 inline-block mr-2" />
              RTSP Stream
            </button>
            <button
              onClick={() => setInputType('file')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                inputType === 'file'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Video className="w-5 h-5 inline-block mr-2" />
              Upload File
            </button>
          </div>

          {inputType === 'rtsp' ? (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                RTSP URL
              </label>
              <input
                type="text"
                value={rtspUrl}
                onChange={(e) => setRtspUrl(e.target.value)}
                placeholder="rtsp://example.com/stream"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
              <p className="mt-2 text-sm text-slate-500">
                Enter the RTSP stream URL for live video analysis
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Video File
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="mt-2 text-sm text-slate-500">
                Upload a video file for analysis
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3 p-6 border-t border-slate-200">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-lg font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
              isValid
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            Start Analysis
          </button>
        </div>
      </div>
    </div>
  );
}

export default InputModal;
