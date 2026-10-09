import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { planets } from '../data/planets';
import { playPlanetDiscover, playClick } from '../utils/sounds';

export default function SpaceJourney({ objective, rocket, onComplete }) {
  const containerRef = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [visited, setVisited] = useState([]);
  const [progress, setProgress] = useState(0);

  // Simulated spacecraft position (moves across the map)
  const spacecraftPos = {
    x: 0.5 - offset.x / 2000,
    y: 0.5 - offset.y / 2000,
  };

  // Calculate progress toward objective
  useEffect(() => {
    const objMap = { lunar: 'moon', mars: 'mars', earth: 'earth' };
    const target = planets.find((p) => p.id === objMap[objective?.id]);
    if (!target) return;

    const dx = target.x - 0.5;
    const dy = target.y - 0.5;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const currentDist = Math.sqrt(
      Math.pow(target.x - spacecraftPos.x, 2) +
        Math.pow(target.y - spacecraftPos.y, 2)
    );
    const p = Math.max(0, Math.min(100, ((distance - currentDist) / distance) * 100));
    setProgress(p);

    if (currentDist < 0.08 && !visited.includes(target.id)) {
      setVisited((v) => [...v, target.id]);
      setTimeout(() => onComplete(progress > 50 ? 'SUCCESS' : 'PARTIAL'), 1500);
    }
  }, [offset, objective, visited, progress, onComplete]);

  // Touch handlers
  const handleTouchStart = (e) => {
    setDragging(true);
    setStart({ x: e.touches[0].clientX - offset.x, y: e.touches[0].clientY - offset.y });
  };

  const handleTouchMove = (e) => {
    if (!dragging) return;
    setOffset({
      x: e.touches[0].clientX - start.x,
      y: e.touches[0].clientY - start.y,
    });
  };

  const handleTouchEnd = () => setDragging(false);

  // Mouse handlers (for desktop)
  const handleMouseDown = (e) => {
    setDragging(true);
    setStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    setOffset({
      x: e.clientX - start.x,
      y: e.clientY - start.y,
    });
  };

  const handleMouseUp = () => setDragging(false);

  const handlePlanetClick = (planet) => {
    setSelectedPlanet(planet);
    if (!visited.includes(planet.id)) {
      playPlanetDiscover();
      setVisited((v) => [...v, planet.id]);
    } else {
      playClick();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black overflow-hidden select-none"
    >
      {/* Deep space background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, #0a1230 0%, #04060f 50%, #000 100%)',
        }}
      />

      {/* Draggable universe container */}
      <div
        ref={containerRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'none' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Static stars layer */}
        <div className="absolute inset-0" style={{ transform: `translate(${offset.x * 0.3}px, ${offset.y * 0.3}px)` }}>
          {Array.from({ length: 150 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 2 + 0.5,
                height: Math.random() * 2 + 0.5,
                left: `${Math.random() * 200 - 50}%`,
                top: `${Math.random() * 200 - 50}%`,
                opacity: Math.random() * 0.7 + 0.3,
              }}
            />
          ))}
        </div>

        {/* Planets layer */}
        <div className="absolute inset-0" style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}>
          {planets.map((planet) => (
            <PlanetSprite
              key={planet.id}
              planet={planet}
              onClick={handlePlanetClick}
              visited={visited.includes(planet.id)}
            />
          ))}

          {/* Objective marker */}
          <ObjectiveMarker objective={objective} />
        </div>

        {/* Spacecraft (fixed to center) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg width="50" height="80" viewBox="0 0 80 140">
              <defs>
                <linearGradient id="sjBody" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f0f0f0" />
                  <stop offset="100%" stopColor="#909090" />
                </linearGradient>
                <linearGradient id="sjFlame" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fff200" />
                  <stop offset="40%" stopColor="#ff8800" />
                  <stop offset="100%" stopColor="#ff0000" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M40 5 L55 40 L25 40 Z" fill="#cc3333" />
              <rect x="25" y="40" width="30" height="60" rx="3" fill="url(#sjBody)" />
              <circle cx="40" cy="50" r="6" fill="#0a0e1a" stroke="#00d4ff" strokeWidth="2" />
              <path d="M25 90 L15 110 L25 105 Z" fill="#cc3333" />
              <path d="M55 90 L65 110 L55 105 Z" fill="#cc3333" />
              <motion.path
                d="M30 100 L40 135 L50 100 Z"
                fill="url(#sjFlame)"
                animate={{ scaleY: [0.9, 1.2, 0.9] }}
                transition={{ duration: 0.2, repeat: Infinity }}
                style={{ transformOrigin: '40px 100px' }}
              />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Exit button */}
      <button
        onClick={() => onComplete("PARTIAL")}
        className="absolute top-3 right-3 z-30 px-3 py-1.5 bg-space-danger/20 border border-space-danger/50 text-space-danger rounded-lg text-xs font-bold"
      >
        ✕ Skip Journey
      </button>

      {/* HUD - top */}
      <div className="absolute top-4 left-4 right-4 pointer-events-none">
        <div className="backdrop-blur-md bg-black/50 border border-white/20 rounded-2xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-300">
              🎯 {objective?.icon} {objective?.name}
            </span>
            <span className="text-xs text-space-accent font-bold">
              {Math.round(progress)}% complete
            </span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-space-accent to-cyan-300"
            />
          </div>
        </div>
      </div>

      {/* HUD - bottom */}
      <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
        <div className="backdrop-blur-md bg-black/50 border border-white/20 rounded-2xl p-3 flex items-center justify-between">
          <div className="text-[10px] text-gray-400">
            🖐️ Drag to explore · Tap planets for info
          </div>
          <div className="flex gap-1">
            {planets.slice(0, 6).map((p) => (
              <div
                key={p.id}
                className={`w-1.5 h-1.5 rounded-full ${
                  visited.includes(p.id) ? 'bg-space-success' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Planet info modal */}
      <AnimatePresence>
        {selectedPlanet && (
          <PlanetInfo
            planet={selectedPlanet}
            onClose={() => setSelectedPlanet(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function PlanetSprite({ planet, onClick, visited }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, delay: Math.random() * 0.5 }}
      className="absolute cursor-pointer"
      style={{
        left: `${planet.x * 100}%`,
        top: `${planet.y * 100}%`,
        transform: 'translate(-50%, -50%)',
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick(planet);
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <div
        className="rounded-full relative"
        style={{
          width: planet.size,
          height: planet.size,
          background: `radial-gradient(circle at 30% 30%, ${planet.color}ee, ${planet.color}88 60%, #000 100%)`,
          boxShadow: `0 0 60px ${planet.color}80, inset -20px -20px 40px rgba(0,0,0,0.7)`,
        }}
      >
        {/* Ring for Saturn */}
        {planet.hasRing && (
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-4"
            style={{
              width: planet.size * 1.8,
              height: planet.size * 0.6,
              borderColor: `${planet.color}60`,
              transform: 'translate(-50%, -50%) rotate(-20deg)',
            }}
          />
        )}
        {/* Visited indicator */}
        {visited && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-space-success rounded-full border-2 border-black flex items-center justify-center text-[10px]">
            ✓
          </div>
        )}
      </div>
      <div className="text-center mt-2 text-xs text-white font-bold drop-shadow-lg">
        {planet.icon} {planet.name}
      </div>
    </motion.div>
  );
}

function ObjectiveMarker({ objective }) {
  const map = { lunar: 'moon', mars: 'mars', earth: 'earth' };
  const target = planets.find((p) => p.id === map[objective?.id]);
  if (!target) return null;

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${target.x * 100}%`,
        top: `${target.y * 100}%`,
        transform: 'translate(-50%, -50%)',
      }}
      animate={{ scale: [1, 1.15, 1], opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <div
        className="rounded-full border-2 border-dashed border-space-accent"
        style={{ width: target.size * 2, height: target.size * 2 }}
      />
    </motion.div>
  );
}

function PlanetInfo({ planet, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-[70] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.85, y: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-space-800/95 border border-white/20 rounded-3xl p-5 max-w-md w-full"
      >
        <div className="text-center mb-4">
          <div className="text-6xl mb-2">{planet.icon}</div>
          <h2 className="text-2xl font-bold text-space-accent">{planet.name}</h2>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
          <div className="bg-white/5 rounded-lg p-2">
            <div className="text-[10px] text-gray-500">DIAMETER</div>
            <div className="font-bold text-space-accent">{planet.diameter}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-2">
            <div className="text-[10px] text-gray-500">TEMP</div>
            <div className="font-bold text-space-accent">{planet.temperature}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-2">
            <div className="text-[10px] text-gray-500">DISTANCE</div>
            <div className="font-bold text-space-accent">{planet.distance}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-2">
            <div className="text-[10px] text-gray-500">MOONS</div>
            <div className="font-bold text-space-accent">{planet.moons}</div>
          </div>
        </div>

        <div className="bg-space-warning/10 border border-space-warning/30 rounded-xl p-3 mb-3 text-xs">
          <div className="font-bold text-space-warning mb-1">💡 Did you know?</div>
          <div className="text-gray-300">{planet.fact}</div>
        </div>

        <div className="text-xs mb-4">
          <div className="text-gray-500 mb-1">🛰️ NASA Missions:</div>
          <div className="flex flex-wrap gap-1">
            {planet.nasaMissions.map((m) => (
              <span key={m} className="bg-space-accent/20 text-space-accent px-2 py-0.5 rounded-full text-[10px]">
                {m}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-r from-space-accent to-cyan-400 text-space-900 rounded-xl font-bold text-sm"
        >
          CONTINUE EXPLORING 🚀
        </button>
      </motion.div>
    </motion.div>
  );
}
