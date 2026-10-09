import { motion, AnimatePresence } from 'framer-motion';

export default function Spacecraft({ selectedComponents = [], objective }) {
  const has = (id) => selectedComponents.includes(id);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.svg
        viewBox="0 0 200 300"
        className="w-48 h-72 drop-shadow-[0_0_30px_rgba(0,212,255,0.4)]"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <defs>
          <linearGradient id="bodyG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e8e8e8" />
            <stop offset="50%" stopColor="#b0b0b0" />
            <stop offset="100%" stopColor="#707070" />
          </linearGradient>
          <linearGradient id="flameG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffdd00" />
            <stop offset="40%" stopColor="#ff6600" />
            <stop offset="100%" stopColor="#ff0000" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Solar Panels */}
        <AnimatePresence>
          {has('solar_panel') && (
            <motion.g
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <rect x="10" y="120" width="50" height="30" rx="3" fill="#1a5fb4" stroke="#0a3a70" strokeWidth="1.5" />
              <line x1="10" y1="130" x2="60" y2="130" stroke="#0a3a70" strokeWidth="0.8" />
              <line x1="10" y1="140" x2="60" y2="140" stroke="#0a3a70" strokeWidth="0.8" />
              <line x1="25" y1="120" x2="25" y2="150" stroke="#0a3a70" strokeWidth="0.8" />
              <line x1="45" y1="120" x2="45" y2="150" stroke="#0a3a70" strokeWidth="0.8" />

              <rect x="140" y="120" width="50" height="30" rx="3" fill="#1a5fb4" stroke="#0a3a70" strokeWidth="1.5" />
              <line x1="140" y1="130" x2="190" y2="130" stroke="#0a3a70" strokeWidth="0.8" />
              <line x1="140" y1="140" x2="190" y2="140" stroke="#0a3a70" strokeWidth="0.8" />
              <line x1="155" y1="120" x2="155" y2="150" stroke="#0a3a70" strokeWidth="0.8" />
              <line x1="175" y1="120" x2="175" y2="150" stroke="#0a3a70" strokeWidth="0.8" />
            </motion.g>
          )}
        </AnimatePresence>

        {/* RTG */}
        <AnimatePresence>
          {has('rtg') && (
            <motion.g
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <circle cx="100" cy="100" r="15" fill="#c0c0c0" stroke="#666" strokeWidth="1.5" />
              <circle cx="100" cy="100" r="6" fill="#ffcc00" />
              <circle cx="100" cy="100" r="3" fill="#ff6600" />
              <circle cx="100" cy="100" r="22" fill="#ffcc00" opacity="0.2" />
            </motion.g>
          )}
        </AnimatePresence>

        {/* Main Body */}
        <path
          d="M100 40 C120 70 125 130 120 190 L80 190 C75 130 80 70 100 40 Z"
          fill="url(#bodyG)"
          stroke="#555"
          strokeWidth="1.5"
        />

        {/* Body stripes */}
        <rect x="80" y="100" width="40" height="3" fill="#cc3333" />
        <rect x="80" y="150" width="40" height="3" fill="#cc3333" />

        {/* Cockpit window */}
        <circle cx="100" cy="80" r="10" fill="#0a0e1a" stroke="#00d4ff" strokeWidth="2" />
        <circle cx="97" cy="77" r="3" fill="#00d4ff" opacity="0.6" />

        {/* Camera */}
        <AnimatePresence>
          {has('camera') && (
            <motion.g
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <rect x="115" y="95" width="14" height="10" rx="2" fill="#333" stroke="#666" />
              <circle cx="122" cy="100" r="4" fill="#00d4ff" />
              <circle cx="122" cy="100" r="2" fill="#fff" />
            </motion.g>
          )}
        </AnimatePresence>

        {/* Spectrometer */}
        <AnimatePresence>
          {has('spectrometer') && (
            <motion.g
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <rect x="70" y="115" width="16" height="12" rx="2" fill="#4a4a5a" stroke="#888" />
              <line x1="73" y1="120" x2="73" y2="124" stroke="#ff0000" strokeWidth="1" />
              <line x1="76" y1="120" x2="76" y2="124" stroke="#ffff00" strokeWidth="1" />
              <line x1="79" y1="120" x2="79" y2="124" stroke="#00ff00" strokeWidth="1" />
              <line x1="82" y1="120" x2="82" y2="124" stroke="#00ddff" strokeWidth="1" />
            </motion.g>
          )}
        </AnimatePresence>

        {/* Radiometer */}
        <AnimatePresence>
          {has('radiometer') && (
            <motion.g
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <circle cx="100" cy="140" r="8" fill="#222" stroke="#666" />
              <circle cx="100" cy="140" r="4" fill="#0a0e1a" />
              <line x1="100" y1="140" x2="105" y2="137" stroke="#ff3333" strokeWidth="1.5" />
              <circle cx="100" cy="140" r="1.5" fill="#00d4ff" />
            </motion.g>
          )}
        </AnimatePresence>

        {/* High Gain Antenna */}
        <AnimatePresence>
          {has('high_gain_antenna') && (
            <motion.g
              initial={{ scale: 0, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, y: -20 }}
            >
              <line x1="100" y1="30" x2="100" y2="15" stroke="#666" strokeWidth="2" />
              <ellipse cx="100" cy="10" rx="14" ry="8" fill="#ddd" stroke="#666" strokeWidth="1.5" />
              <ellipse cx="100" cy="10" rx="8" ry="4" fill="#aaa" />
              <circle cx="100" cy="10" r="2" fill="#00d4ff" />
            </motion.g>
          )}
        </AnimatePresence>

        {/* Medium Gain Antenna */}
        <AnimatePresence>
          {has('medium_gain_antenna') && !has('high_gain_antenna') && (
            <motion.g
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <line x1="100" y1="30" x2="100" y2="20" stroke="#666" strokeWidth="1.5" />
              <ellipse cx="100" cy="15" rx="10" ry="6" fill="#ddd" stroke="#666" />
              <circle cx="100" cy="15" r="1.5" fill="#00d4ff" />
            </motion.g>
          )}
        </AnimatePresence>

        {/* Drill */}
        <AnimatePresence>
          {has('drill') && (
            <motion.g
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <rect x="95" y="195" width="10" height="18" fill="#c0c0c0" stroke="#666" />
              <path d="M95 213 L100 225 L105 213 Z" fill="#c0c0c0" stroke="#666" />
            </motion.g>
          )}
        </AnimatePresence>

        {/* Heat Shield */}
        <AnimatePresence>
          {has('heat_shield') && (
            <motion.g
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <ellipse cx="100" cy="230" rx="30" ry="6" fill="#4a4a5a" stroke="#888" strokeWidth="1.5" />
              <ellipse cx="100" cy="230" rx="20" ry="3" fill="#2a2a3a" />
            </motion.g>
          )}
        </AnimatePresence>

        {/* Propulsion */}
        <AnimatePresence>
          {has('propulsion') && (
            <motion.g
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <rect x="88" y="190" width="24" height="14" rx="3" fill="#888" stroke="#555" />
              <rect x="88" y="194" width="24" height="2" fill="#cc3333" />
            </motion.g>
          )}
        </AnimatePresence>

        {/* Flame - only if has propulsion */}
        {has('propulsion') && (
          <motion.g
            animate={{
              opacity: [0.6, 1, 0.6],
              scaleY: [0.9, 1.1, 0.9],
            }}
            transition={{ duration: 0.4, repeat: Infinity }}
            style={{ transformOrigin: '100px 220px' }}
          >
            <path d="M92 205 L100 245 L108 205 Z" fill="url(#flameG)" />
            <path d="M96 205 L100 235 L104 205 Z" fill="#ffdd00" opacity="0.9" />
          </motion.g>
        )}
      </motion.svg>

      {/* Empty state */}
      {selectedComponents.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-gray-500 text-xs text-center px-4">
            Tap parts below to build
          </p>
        </div>
      )}
    </div>
  );
}
