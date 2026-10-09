import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { playClick, playLaunchSound } from '../utils/sounds';

export default function CockpitView({ objective, onClose }) {
  const [speed, setSpeed] = useState(0);
  const [fuel, setFuel] = useState(100);
  const [steer, setSteer] = useState({ x: 0, y: 0 });
  const [stars, setStars] = useState([]);
  const [planets, setPlanets] = useState([]);
  const [distance, setDistance] = useState(15000);
  const [message, setMessage] = useState('Initializing systems...');
  const throttleRef = useRef(null);

  // Generate stars at 3 depths
  useEffect(() => {
    const layers = [
      { count: 80, sizeRange: [1, 2], speed: 0.15, depth: 0.3, opacity: 0.5 },
      { count: 60, sizeRange: [1, 2.5], speed: 0.35, depth: 0.6, opacity: 0.75 },
      { count: 40, sizeRange: [2, 3.5], speed: 0.7, depth: 1, opacity: 1 },
    ];

    const allStars = [];
    layers.forEach((layer, layerIdx) => {
      for (let i = 0; i < layer.count; i++) {
        allStars.push({
          id: `${layerIdx}-${i}`,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: layer.sizeRange[0] + Math.random() * (layer.sizeRange[1] - layer.sizeRange[0]),
          speed: layer.speed,
          depth: layer.depth,
          opacity: layer.opacity,
        });
      }
    });
    setStars(allStars);

    // Add planets in distance
    const planetsList = [
      { id: 'moon', icon: '🌙', name: 'Moon', x: 50, y: 30, scale: 0.4, color: '#d4c9a8' },
      { id: 'earth', icon: '🌍', name: 'Earth', x: 20, y: 60, scale: 0.6, color: '#2d7fc4' },
      { id: 'mars', icon: '🔴', name: 'Mars', x: 75, y: 45, scale: 0.5, color: '#c1440e' },
      { id: 'jupiter', icon: '🟤', name: 'Jupiter', x: 35, y: 20, scale: 0.35, color: '#d8a978' },
    ];
    setPlanets(planetsList);
  }, []);

  // Main simulation loop
  useEffect(() => {
    const targetSpeed = throttleRef.current || 0;
    const interval = setInterval(() => {
      setSpeed((s) => {
        const diff = targetSpeed - s;
        if (Math.abs(diff) < 5) return targetSpeed;
        return s + diff * 0.1;
      });

      if (speed > 0) {
        // Stars move down (parallax)
        setStars((prev) => prev.map((star) => {
          let newY = star.y + star.speed * (speed / 100) * 3;
          let newX = star.x + steer.x * star.depth * 0.3;
          if (newY > 110) newY = -10;
          if (newX > 110) newX = -10;
          if (newX < -10) newX = 110;
          return { ...star, y: newY, x: newX };
        }));

        // Fuel consumption
        setFuel((f) => Math.max(0, f - speed / 30000));

        // Distance decrease
        setDistance((d) => Math.max(0, d - speed * 0.05));
      }
    }, 50);

    return () => clearInterval(interval);
  }, [speed, steer]);

  // Target arrival check
  useEffect(() => {
    if (distance <= 100 && message !== 'Arriving...') {
      setMessage('🌙 Approaching ' + (objective?.name || 'Target') + '!');
      setTimeout(() => onClose(), 3000);
    } else if (distance < 3000 && message !== 'Close!') {
      setMessage('Target in sight...');
    } else if (distance < 8000 && message !== 'Almost there') {
      setMessage('Halfway there...');
    }
  }, [distance, message, onClose, objective]);

  const handleThrottle = (value) => {
    throttleRef.current = value;
    playClick();
  };

  const handleSteer = (direction) => {
    playClick();
    const deltas = {
      left: { x: -0.5, y: 0 },
      right: { x: 0.5, y: 0 },
      up: { x: 0, y: -0.5 },
      down: { x: 0, y: 0.5 },
    };
    setSteer(deltas[direction]);
    setTimeout(() => setSteer({ x: 0, y: 0 }), 300);
  };

  const speedPct = Math.min(100, speed / 10);
  const distanceKm = Math.round(distance);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] overflow-hidden bg-black"
    >
      {/* ==== COCKPIT WINDOW ==== */}
      <div className="absolute inset-0" style={{ perspective: '1000px' }}>
        
        {/* Deep space background */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, #0a1230 0%, #03060f 60%, #000 100%)',
            transform: `translateX(${-steer.x * 20}px) translateY(${-steer.y * 20}px)`,
            transition: 'transform 0.3s ease-out',
          }}
        />

        {/* Stars layers */}
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              boxShadow: star.size > 2 ? `0 0 ${star.size * 3}px rgba(200, 220, 255, 0.8)` : 'none',
              transition: 'left 0.1s linear, top 0.05s linear',
            }}
          />
        ))}

        {/* Planets */}
        {planets.map((planet) => {
          const scale = planet.scale * (1 + (15000 - distance) / 10000);
          return (
            <motion.div
              key={planet.id}
              className="absolute rounded-full"
              style={{
                left: `${planet.x}%`,
                top: `${planet.y}%`,
                width: `${100 * scale}px`,
                height: `${100 * scale}px`,
                background: `radial-gradient(circle at 30% 30%, ${planet.color}ee, ${planet.color}88 60%, #000 100%)`,
                boxShadow: `0 0 ${60 * scale}px ${planet.color}80, inset -20px -20px 40px rgba(0,0,0,0.7)`,
                transform: 'translate(-50%, -50%)',
              }}
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="text-center mt-2 text-[10px] font-bold text-white/70">
                {planet.icon}
              </div>
            </motion.div>
          );
        })}

        {/* Sun light in corner */}
        <div
          className="absolute -top-10 -left-10 w-40 h-40 rounded-full"
          style={{
            background: 'radial-gradient(circle, #ffcc44 0%, #ff8800 40%, transparent 70%)',
            filter: 'blur(20px)',
            opacity: 0.6,
          }}
        />

        {/* Cockpit window frame */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="frameG" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1a2340" />
              <stop offset="100%" stopColor="#0a0e1a" />
            </linearGradient>
          </defs>
          {/* Top frame */}
          <path d="M 0,0 L 100,0 L 100,8 Q 50,12 0,8 Z" fill="url(#frameG)" />
          {/* Bottom frame (dashboard) */}
          <path d="M 0,78 Q 50,74 100,78 L 100,100 L 0,100 Z" fill="url(#frameG)" />
          {/* Left frame */}
          <path d="M 0,0 L 6,0 Q 3,50 6,100 L 0,100 Z" fill="url(#frameG)" />
          {/* Right frame */}
          <path d="M 100,0 L 94,0 Q 97,50 94,100 L 100,100 Z" fill="url(#frameG)" />
        </svg>

        {/* Cockpit strut (middle beam) */}
        <div
          className="absolute left-1/2 top-0 bottom-20 w-1 bg-gradient-to-b from-gray-700 to-gray-900 pointer-events-none"
          style={{ boxShadow: '0 0 10px rgba(0,0,0,0.7)' }}
        />
      </div>

      {/* ==== TOP HUD ==== */}
      <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-20 pointer-events-none">
        <div className="bg-black/60 backdrop-blur-md border border-cyan-400/30 rounded-xl px-3 py-2">
          <div className="text-[9px] text-gray-400">MISSION</div>
          <div className="text-xs font-bold text-space-accent">{objective?.name || 'Lunar'}</div>
          <div className="text-[10px] text-gray-300 mt-1">{message}</div>
        </div>
        <button
          onClick={onClose}
          className="pointer-events-auto bg-red-500/20 backdrop-blur-md border border-red-400/50 text-red-300 rounded-xl px-3 py-2 text-xs font-bold"
        >
          ✕ EXIT
        </button>
      </div>

      {/* ==== DASHBOARD ==== */}
      <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black via-gray-900/95 to-transparent pt-8 pb-3 px-3">
        <div className="max-w-2xl mx-auto">
          {/* Instrument gauges */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-black/60 backdrop-blur-md border border-cyan-400/30 rounded-xl p-2">
              <div className="text-[8px] text-gray-400 text-center">SPEED</div>
              <div className="text-base font-bold text-cyan-300 text-center">
                {Math.round(speed)} <span className="text-[9px]">km/h</span>
              </div>
              <div className="h-1 bg-gray-800 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-400 to-cyan-200 transition-all" style={{ width: `${speedPct}%` }} />
              </div>
            </div>
            <div className="bg-black/60 backdrop-blur-md border border-yellow-400/30 rounded-xl p-2">
              <div className="text-[8px] text-gray-400 text-center">FUEL</div>
              <div className={`text-base font-bold text-center ${fuel < 30 ? 'text-red-400' : 'text-yellow-300'}`}>
                {Math.round(fuel)}<span className="text-[9px]">%</span>
              </div>
              <div className="h-1 bg-gray-800 rounded-full mt-1 overflow-hidden">
                <div className={`h-full transition-all ${fuel < 30 ? 'bg-red-500' : 'bg-gradient-to-r from-yellow-500 to-yellow-300'}`} style={{ width: `${fuel}%` }} />
              </div>
            </div>
            <div className="bg-black/60 backdrop-blur-md border border-green-400/30 rounded-xl p-2">
              <div className="text-[8px] text-gray-400 text-center">DISTANCE</div>
              <div className="text-base font-bold text-green-300 text-center">
                {distanceKm.toLocaleString()}<span className="text-[9px]">km</span>
              </div>
              <div className="h-1 bg-gray-800 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-green-300 transition-all" style={{ width: `${100 - Math.min(100, distance / 150)}%` }} />
              </div>
            </div>
          </div>

          {/* Control buttons */}
          <div className="flex items-center justify-center gap-2">
            {/* Steering pad */}
            <div className="grid grid-cols-3 grid-rows-2 gap-1 w-32">
              <div />
              <button
                onTouchStart={() => handleSteer('up')}
                className="bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 rounded-lg py-2 text-lg active:bg-cyan-500/40"
              >
                ↑
              </button>
              <div />
              <button
                onTouchStart={() => handleSteer('left')}
                className="bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 rounded-lg py-2 text-lg active:bg-cyan-500/40"
              >
                ←
              </button>
              <button
                onTouchStart={() => handleSteer('down')}
                className="bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 rounded-lg py-2 text-lg active:bg-cyan-500/40"
              >
                ↓
              </button>
              <button
                onTouchStart={() => handleSteer('right')}
                className="bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 rounded-lg py-2 text-lg active:bg-cyan-500/40"
              >
                →
              </button>
            </div>

            {/* Throttle */}
            <div className="flex flex-col gap-1">
              <button
                onTouchStart={() => handleThrottle(100)}
                onTouchEnd={() => handleThrottle(0)}
                onMouseDown={() => handleThrottle(100)}
                onMouseUp={() => handleThrottle(0)}
                onMouseLeave={() => handleThrottle(0)}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl px-6 py-4 font-bold text-sm shadow-lg shadow-orange-500/40 active:scale-95 transition-transform"
              >
                🔥 THROTTLE
              </button>
              <button
                onTouchStart={() => handleThrottle(-50)}
                onMouseDown={() => handleThrottle(-50)}
                className="bg-white/10 border border-white/20 text-white rounded-lg py-1 text-[10px]"
              >
                ⬇ REVERSE
              </button>
            </div>
          </div>

          {/* Status hint */}
          <div className="text-center text-[9px] text-gray-500 mt-2">
            Hold THROTTLE to accelerate · Use arrows to steer
          </div>
        </div>
      </div>

      {/* Warning overlays */}
      <AnimatePresence>
        {fuel < 15 && fuel > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute top-20 left-1/2 -translate-x-1/2 bg-red-500/20 border-2 border-red-500/60 rounded-xl px-4 py-2 text-red-300 text-xs font-bold"
          >
            ⚠ LOW FUEL
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
