import { useState } from 'react';
import { Activity, Users } from 'lucide-react';
import InputModal from '../components/InputModal';

function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'live' | 'advanced' | null>(null);

  const handleCardClick = (mode: 'live' | 'advanced') => {
    setSelectedMode(mode);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedMode(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            Live Crowd Analytics Platform
          </h1>
          <p className="text-xl text-slate-300">
            Real-time crowd monitoring and analysis powered by AI
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div
            onClick={() => handleCardClick('live')}
            className="group bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="bg-white/20 p-6 rounded-full group-hover:bg-white/30 transition-all duration-300">
                <Users className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white">Live Detection</h2>
              <p className="text-blue-100 text-lg">
                Real-time person detection using YOLO for instant crowd counting
                and tracking
              </p>
              <div className="pt-4">
                <span className="inline-block bg-white/20 px-6 py-3 rounded-full text-white font-semibold group-hover:bg-white group-hover:text-blue-600 transition-all duration-300">
                  Start Live Analysis
                </span>
              </div>
            </div>
          </div>

          <div
            onClick={() => handleCardClick('advanced')}
            className="group bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="bg-white/20 p-6 rounded-full group-hover:bg-white/30 transition-all duration-300">
                <Activity className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white">Advanced Analytics</h2>
              <p className="text-purple-100 text-lg">
                Dense crowd estimation using SASNet for accurate counting in
                high-density scenarios
              </p>
              <div className="pt-4">
                <span className="inline-block bg-white/20 px-6 py-3 rounded-full text-white font-semibold group-hover:bg-white group-hover:text-purple-600 transition-all duration-300">
                  Start Advanced Analysis
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && selectedMode && (
        <InputModal mode={selectedMode} onClose={handleModalClose} />
      )}
    </div>
  );
}

export default LandingPage;
