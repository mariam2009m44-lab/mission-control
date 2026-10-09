import { motion } from 'framer-motion';
import { useState } from 'react';
import { playClick } from '../utils/sounds';

export default function ExploreSpace({ onClose }) {
  const [loaded, setLoaded] = useState(false);
  const [currentView, setCurrentView] = useState('solar-system');

  const views = [
    {
      id: 'solar-system',
      name: 'Solar System',
      icon: '🌌',
      url: 'https://eyes.nasa.gov/apps/solar-system/#/home',
      description: 'Explore planets, moons, and spacecraft in real time',
    },
    {
      id: 'earth',
      name: 'Earth',
      icon: '🌍',
      url: 'https://eyes.nasa.gov/apps/solar-system/#/earth',
      description: 'See Earth from space with live satellite positions',
    },
    {
      id: 'mars',
      name: 'Mars',
      icon: '🔴',
      url: 'https://eyes.nasa.gov/apps/solar-system/#/mars',
      description: 'Fly over Mars surface and visit rovers',
    },
    {
      id: 'moon',
      name: 'Moon',
      icon: '🌙',
      url: 'https://eyes.nasa.gov/apps/solar-system/#/moon',
      description: 'Explore our Moon and upcoming Artemis sites',
    },
    {
      id: 'jupiter',
      name: 'Jupiter',
      icon: '🪐',
      url: 'https://eyes.nasa.gov/apps/solar-system/#/jupiter',
      description: 'Visit Jupiter and its moons Io, Europa, Ganymede',
    },
    {
      id: 'iss',
      name: 'ISS Live',
      icon: '🛰️',
      url: 'https://eyes.nasa.gov/apps/solar-system/#/iss',
      description: 'Track the International Space Station in real time',
    },
  ];

  const current = views.find((v) => v.id === currentView) || views[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-[90] flex flex-col"
    >
      {/* Header */}
      <div className="backdrop-blur-md bg-black/60 border-b border-white/10 px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌌</span>
          <div>
            <div className="text-xs font-bold text-white">NASA's Eyes</div>
            <div className="text-[9px] text-gray-400">Real-time 3D Solar System</div>
          </div>
        </div>
        <button
          onClick={() => {
            playClick();
            onClose();
          }}
          className="text-xs px-3 py-1 bg-space-danger/20 border border-space-danger/50 text-space-danger rounded-lg hover:bg-space-danger/30"
        >
          ✕ Exit
        </button>
      </div>

      {/* View selector */}
      <div className="backdrop-blur-md bg-black/40 border-b border-white/10 px-2 py-2">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {views.map((v) => (
            <button
              key={v.id}
              onClick={() => {
                playClick();
                setCurrentView(v.id);
                setLoaded(false);
              }}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg border transition-all text-xs flex items-center gap-1.5 ${
                currentView === v.id
                  ? 'bg-space-accent/30 border-space-accent text-white'
                  : 'bg-white/5 border-white/10 text-gray-300 hover:border-space-accent/50'
              }`}
            >
              <span>{v.icon}</span>
              <span className="whitespace-nowrap">{v.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Info bar */}
      <div className="bg-black/30 px-3 py-1.5 border-b border-white/5">
        <div className="text-[10px] text-gray-400 flex items-center gap-2">
          <span className="text-space-accent">{current.icon}</span>
          <span>{current.description}</span>
        </div>
      </div>

      {/* NASA Eyes iframe */}
      <div className="flex-1 relative bg-black">
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="text-5xl mb-4"
            >
              🛰️
            </motion.div>
            <p className="text-sm text-gray-300">Loading NASA's Eyes...</p>
            <p className="text-[10px] text-gray-500 mt-1">This may take a moment</p>
          </div>
        )}
        <iframe
          key={currentView}
          src={current.url}
          title="NASA's Eyes"
          className="w-full h-full border-0"
          allow="fullscreen; geolocation; autoplay"
          onLoad={() => setLoaded(true)}
        />
      </div>

      {/* Bottom hint */}
      <div className="bg-black/60 border-t border-white/10 px-3 py-2">
        <div className="text-[9px] text-gray-500 text-center">
          🖱️ Drag to rotate · Scroll to zoom · Click objects for info
        </div>
      </div>
    </motion.div>
  );
}
