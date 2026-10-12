import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { RocketIcons } from './RocketIcons';
import { getRocketColor } from '../data/rocketColors';

export default function SpaceJourney({ rocketId = 'small', rocketColor = 'default', objective, onComplete }) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Launching...');

  const RocketIcon = RocketIcons[rocketId] || RocketIcons.small;
  const color = getRocketColor(rocketColor);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => {
        const next = p + 2;
        if (next >= 100) {
          setStatus('Arrived! 🎉');
          setTimeout(() => onComplete('SUCCESS'), 800);
          clearInterval(timer);
          return 100;
        }
        if (next > 30 && next < 35) setStatus('Leaving orbit...');
        if (next > 60 && next < 65) setStatus('In deep space...');
        if (next > 85 && next < 90) setStatus('Approaching target...');
        return next;
      });
    }, 100);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-gradient-to-b from-black via-space-900 to-black overflow-hidden"
    >
      {/* Stars background */}
      <div className="absolute inset-0">
        {Array.from({ length: 80 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      {/* Target planet */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 text-8xl opacity-80">
        {objective?.icon || '🌙'}
      </div>

      {/* Top HUD */}
      <div className="absolute top-3 left-3 right-3 z-20">
        <div className="backdrop-blur-md bg-black/60 border border-space-accent/40 rounded-2xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-300">🎯 {objective?.name || 'Mission'}</span>
            <span className="text-xs text-space-accent font-bold">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-space-accent to-cyan-300"
            />
          </div>
          <div className="text-[10px] text-center mt-2 text-space-accent font-bold">
            {status}
          </div>
        </div>
      </div>

      {/* Rocket */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{
          y: [-20, 20, -20],
          rotate: [-5, 5, -5],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <RocketIcon size={160} primary={color.primary} secondary={color.secondary} />
      </motion.div>

      {/* Bottom info */}
      <div className="absolute bottom-4 left-3 right-3 z-20">
        <div className="backdrop-blur-md bg-black/60 border border-white/20 rounded-2xl p-3">
          <div className="flex justify-between text-[10px] text-gray-400">
            <span>🚀 Speed: {(progress * 15).toFixed(0)} km/s</span>
            <span>⛽ Fuel: {(100 - progress * 0.8).toFixed(0)}%</span>
          </div>
        </div>
      </div>

      {/* Exit button */}
      <button
        onClick={() => onComplete('PARTIAL')}
        className="absolute top-3 right-3 z-30 px-3 py-1.5 bg-red-500/20 border border-red-400/50 text-red-300 rounded-lg text-[10px] font-bold"
      >
        ✕ Skip
      </button>
    </motion.div>
  );
}
