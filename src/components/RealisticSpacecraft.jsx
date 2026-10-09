import { motion } from 'framer-motion';

export default function RealisticSpacecraft({ type = 'scout', components = [] }) {
  const has = (id) => components.includes(id);

  // ============ SCOUT — Orion-style capsule ============
  const renderScout = () => (
    <svg viewBox="0 0 240 340" className="w-full h-full">
      <defs>
        <linearGradient id="orionTop" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#b8b8b8" />
          <stop offset="50%" stopColor="#f5f5f5" />
          <stop offset="100%" stopColor="#a0a0a0" />
        </linearGradient>
        <linearGradient id="orionBot" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3a3a4a" />
          <stop offset="50%" stopColor="#5a5a6a" />
          <stop offset="100%" stopColor="#2a2a3a" />
        </linearGradient>
        <radialGradient id="orionWin" cx="35%" cy="35%">
          <stop offset="0%" stopColor="#66d0ff" />
          <stop offset="70%" stopColor="#0a3a6a" />
          <stop offset="100%" stopColor="#000" />
        </radialGradient>
        <linearGradient id="flameOrange" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fff5a0" />
          <stop offset="40%" stopColor="#ff9500" />
          <stop offset="100%" stopColor="#ff2200" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Crew module - capsule shape */}
      <path d="M120 60 Q170 130 165 200 L75 200 Q70 130 120 60 Z" fill="url(#orionTop)" stroke="#666" strokeWidth="1.5" />
      
      {/* Window */}
      <ellipse cx="120" cy="130" rx="22" ry="18" fill="url(#orionWin)" stroke="#00d4ff" strokeWidth="2" />
      <ellipse cx="113" cy="124" rx="6" ry="4" fill="#fff" opacity="0.5" />

      {/* Service module (bottom) */}
      <rect x="70" y="200" width="100" height="55" rx="4" fill="url(#orionBot)" stroke="#555" strokeWidth="1.5" />
      <rect x="75" y="210" width="90" height="3" fill="#cc3333" opacity="0.8" />
      <rect x="75" y="240" width="90" height="3" fill="#cc3333" opacity="0.8" />
      
      {/* Side panels / thruster blocks */}
      <rect x="60" y="215" width="12" height="30" fill="#3a3a4a" stroke="#666" strokeWidth="1" />
      <rect x="168" y="215" width="12" height="30" fill="#3a3a4a" stroke="#666" strokeWidth="1" />
      
      {/* Engine nozzle */}
      <path d="M95 255 L90 275 L150 275 L145 255 Z" fill="#2a2a3a" stroke="#666" strokeWidth="1" />
      <ellipse cx="120" cy="275" rx="30" ry="4" fill="#1a1a2a" />

      {/* Solar panels if selected */}
      {has('solar_panel') && (
        <g>
          <line x1="70" y1="220" x2="25" y2="220" stroke="#888" strokeWidth="2" />
          <line x1="170" y1="220" x2="215" y2="220" stroke="#888" strokeWidth="2" />
          <rect x="0" y="200" width="25" height="40" fill="#1a3a6e" stroke="#2a5aa0" strokeWidth="1" />
          <rect x="215" y="200" width="25" height="40" fill="#1a3a6e" stroke="#2a5aa0" strokeWidth="1" />
          <line x1="8" y1="200" x2="8" y2="240" stroke="#2a5aa0" strokeWidth="0.5" />
          <line x1="17" y1="200" x2="17" y2="240" stroke="#2a5aa0" strokeWidth="0.5" />
          <line x1="223" y1="200" x2="223" y2="240" stroke="#2a5aa0" strokeWidth="0.5" />
          <line x1="232" y1="200" x2="232" y2="240" stroke="#2a5aa0" strokeWidth="0.5" />
        </g>
      )}

      {/* High gain antenna */}
      {has('high_gain_antenna') && (
        <g>
          <line x1="120" y1="60" x2="120" y2="25" stroke="#888" strokeWidth="2" />
          <ellipse cx="120" cy="20" rx="20" ry="6" fill="#c0c0c0" stroke="#666" strokeWidth="1" />
          <circle cx="120" cy="20" r="2" fill="#00d4ff" />
        </g>
      )}

      {/* Flame */}
      {has('propulsion') && (
        <motion.g
          animate={{ scaleY: [0.9, 1.1, 0.9], opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 0.2, repeat: Infinity }}
          style={{ transformOrigin: '120px 275px' }}
        >
          <path d="M100 275 L120 335 L140 275 Z" fill="url(#flameOrange)" />
          <path d="M112 275 L120 315 L128 275 Z" fill="#fff5a0" opacity="0.9" />
        </motion.g>
      )}

      {/* Status lights */}
      <motion.circle cx="85" cy="225" r="2.5" fill="#00ff88" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} />
      <motion.circle cx="155" cy="225" r="2.5" fill="#ff3333" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
    </svg>
  );

  // ============ SCIENCE — Voyager-style probe ============
  const renderScience = () => (
    <svg viewBox="0 0 300 340" className="w-full h-full">
      <defs>
        <linearGradient id="voyBody" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d8d8d8" />
          <stop offset="50%" stopColor="#909090" />
          <stop offset="100%" stopColor="#606060" />
        </linearGradient>
        <radialGradient id="voyDish" cx="30%" cy="30%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#c8c8c8" />
          <stop offset="100%" stopColor="#707070" />
        </radialGradient>
        <linearGradient id="flameBlue" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#a0e0ff" />
          <stop offset="50%" stopColor="#0090ff" />
          <stop offset="100%" stopColor="#001a5a" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Big parabolic dish antenna (Voyager's iconic dish) */}
      <g transform="translate(150, 90)">
        <ellipse cx="0" cy="0" rx="75" ry="18" fill="url(#voyDish)" stroke="#444" strokeWidth="1.5" />
        <ellipse cx="0" cy="0" rx="55" ry="12" fill="#b0b0b0" opacity="0.5" />
        <ellipse cx="0" cy="0" rx="35" ry="8" fill="#888" opacity="0.5" />
        {/* Feed antenna in center */}
        <line x1="0" y1="0" x2="0" y2="35" stroke="#666" strokeWidth="2" />
        <circle cx="0" cy="38" r="3" fill="#00d4ff" />
        {/* Support struts */}
        <line x1="-60" y1="5" x2="0" y2="35" stroke="#666" strokeWidth="1" opacity="0.7" />
        <line x1="60" y1="5" x2="0" y2="35" stroke="#666" strokeWidth="1" opacity="0.7" />
        <line x1="0" y1="-15" x2="0" y2="35" stroke="#666" strokeWidth="1" opacity="0.7" />
      </g>

      {/* Main body (10-sided bus) */}
      <rect x="120" y="135" width="60" height="70" rx="3" fill="url(#voyBody)" stroke="#555" strokeWidth="1.5" />
      {/* Instrument bays */}
      <rect x="125" y="145" width="50" height="12" fill="#2a2a3a" stroke="#666" strokeWidth="0.5" />
      <rect x="125" y="163" width="50" height="12" fill="#2a2a3a" stroke="#666" strokeWidth="0.5" />
      <rect x="125" y="181" width="50" height="12" fill="#2a2a3a" stroke="#666" strokeWidth="0.5" />
      <circle cx="135" cy="151" r="2" fill="#00ff88" />
      <circle cx="155" cy="169" r="2" fill="#00d4ff" />
      <circle cx="170" cy="187" r="2" fill="#ffaa00" />

      {/* RTG power source (long boom on side) */}
      <line x1="120" y1="160" x2="40" y2="160" stroke="#666" strokeWidth="3" />
      <rect x="15" y="152" width="25" height="16" rx="2" fill="#3a3a3a" stroke="#888" strokeWidth="1" />
      <circle cx="27" cy="160" r="4" fill="#ffcc00" opacity="0.9" />
      <motion.circle cx="27" cy="160" r="8" fill="#ffcc00" opacity="0.2" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />

      {/* Magnetometer boom (other side) */}
      <line x1="180" y1="170" x2="270" y2="170" stroke="#666" strokeWidth="2" />
      <rect x="268" y="165" width="8" height="10" fill="#3a3a3a" />

      {/* Antenna dish + other selected components */}
      {has('solar_panel') && (
        <g>
          <rect x="125" y="215" width="50" height="20" fill="#1a3a6e" stroke="#2a5aa0" strokeWidth="1" />
          <line x1="137" y1="215" x2="137" y2="235" stroke="#2a5aa0" strokeWidth="0.5" />
          <line x1="150" y1="215" x2="150" y2="235" stroke="#2a5aa0" strokeWidth="0.5" />
          <line x1="163" y1="215" x2="163" y2="235" stroke="#2a5aa0" strokeWidth="0.5" />
        </g>
      )}

      {has('camera') && (
        <g>
          <rect x="195" y="195" width="25" height="18" rx="2" fill="#2a2a2a" stroke="#666" strokeWidth="1" />
          <circle cx="207" cy="204" r="6" fill="#0a0e1a" stroke="#00ff88" strokeWidth="1.5" />
          <circle cx="207" cy="204" r="2.5" fill="#fff" opacity="0.9" />
        </g>
      )}

      {/* Medium gain antenna */}
      {has('medium_gain_antenna') && !has('high_gain_antenna') && (
        <g>
          <line x1="150" y1="135" x2="150" y2="115" stroke="#888" strokeWidth="1.5" />
          <ellipse cx="150" cy="112" rx="14" ry="5" fill="#c0c0c0" stroke="#666" strokeWidth="1" />
        </g>
      )}

      {/* Radiometer */}
      {has('radiometer') && (
        <g>
          <circle cx="150" cy="250" r="12" fill="#2a2a2a" stroke="#666" strokeWidth="1" />
          <circle cx="150" cy="250" r="6" fill="#0a0e1a" />
          <motion.line x1="150" y1="250" x2="157" y2="245" stroke="#ff3333" strokeWidth="1.5" animate={{ rotate: 360 }} transition={{ duration: 5, repeat: Infinity, ease: 'linear' }} style={{ transformOrigin: '150px 250px' }} />
        </g>
      )}

      {/* High gain dish extra */}
      {has('high_gain_antenna') && (
        <g>
          <line x1="150" y1="135" x2="150" y2="110" stroke="#888" strokeWidth="1.5" />
          <ellipse cx="150" cy="105" rx="22" ry="7" fill="#c0c0c0" stroke="#666" strokeWidth="1" />
        </g>
      )}

      {/* Propulsion + flame */}
      {has('propulsion') && (
        <motion.g
          animate={{ scaleY: [0.9, 1.15, 0.9], opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 0.18, repeat: Infinity }}
          style={{ transformOrigin: '150px 260px' }}
        >
          <path d="M135 260 L150 310 L165 260 Z" fill="url(#flameBlue)" />
          <path d="M142 260 L150 292 L158 260 Z" fill="#a0e0ff" opacity="0.85" />
        </motion.g>
      )}

      {/* Heat shield */}
      {has('heat_shield') && (
        <ellipse cx="150" cy="270" rx="40" ry="7" fill="#3a3a4a" stroke="#888" strokeWidth="1.5" />
      )}
    </svg>
  );

  // ============ HAULER — Space Shuttle ============
  const renderHauler = () => (
    <svg viewBox="0 0 340 240" className="w-full h-full">
      <defs>
        <linearGradient id="shuttleTop" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f5f5f5" />
          <stop offset="100%" stopColor="#c0c0c0" />
        </linearGradient>
        <linearGradient id="shuttleBottom" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2a2a2a" />
          <stop offset="100%" stopColor="#0a0a0a" />
        </linearGradient>
        <radialGradient id="shuttleWin" cx="40%" cy="40%">
          <stop offset="0%" stopColor="#88e0ff" />
          <stop offset="100%" stopColor="#0a3a6a" />
        </radialGradient>
        <linearGradient id="flameWhite" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#ff9500" />
          <stop offset="100%" stopColor="#ff2200" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Main fuselage (white body) */}
      <path d="M60 130 L260 110 Q300 105 320 130 Q300 155 260 150 L60 145 Q40 138 60 130 Z" fill="url(#shuttleTop)" stroke="#555" strokeWidth="1.5" />

      {/* Thermal tiles - black underbelly */}
      <path d="M60 145 L260 150 Q300 155 320 130 Q310 145 280 155 L70 152 Z" fill="url(#shuttleBottom)" stroke="#222" strokeWidth="1" />

      {/* Nose cone */}
      <path d="M320 130 Q330 125 340 130 Q330 138 320 130" fill="#111" />

      {/* Cockpit windows */}
      <ellipse cx="290" cy="122" rx="8" ry="6" fill="url(#shuttleWin)" stroke="#111" strokeWidth="1" />
      <ellipse cx="305" cy="125" rx="4" ry="4" fill="url(#shuttleWin)" stroke="#111" strokeWidth="1" />

      {/* Delta wing */}
      <path d="M60 145 L20 210 L160 210 L180 145 Z" fill="url(#shuttleTop)" stroke="#555" strokeWidth="1.5" />
      <path d="M60 148 L25 205 L160 205 L178 148 Z" fill="url(#shuttleBottom)" />

      {/* Vertical stabilizer (tail fin) */}
      <path d="M70 130 L40 40 L85 40 L95 130 Z" fill="url(#shuttleTop)" stroke="#555" strokeWidth="1.5" />
      <path d="M60 130 L40 50 L60 50 L70 130 Z" fill="#2a2a2a" />

      {/* OMS pods */}
      <ellipse cx="110" cy="125" rx="18" ry="8" fill="#d8d8d8" stroke="#555" strokeWidth="1" />

      {/* Main engines (3 SSMEs) */}
      <g>
        <ellipse cx="55" cy="140" rx="10" ry="14" fill="#2a2a2a" stroke="#666" strokeWidth="1" />
        <ellipse cx="70" cy="128" rx="9" ry="12" fill="#2a2a2a" stroke="#666" strokeWidth="1" />
        <ellipse cx="70" cy="152" rx="9" ry="12" fill="#2a2a2a" stroke="#666" strokeWidth="1" />
      </g>

      {/* Camera on top */}
      {has('camera') && (
        <g>
          <rect x="200" y="105" width="20" height="12" rx="2" fill="#2a2a2a" stroke="#666" strokeWidth="1" />
          <circle cx="210" cy="111" r="4" fill="#0a0e1a" stroke="#00d4ff" strokeWidth="1.5" />
        </g>
      )}

      {/* Solar panels (extended from bay) */}
      {has('solar_panel') && (
        <g>
          <rect x="150" y="98" width="70" height="12" fill="#1a3a6e" stroke="#2a5aa0" strokeWidth="1" />
          <line x1="165" y1="98" x2="165" y2="110" stroke="#2a5aa0" strokeWidth="0.5" />
          <line x1="180" y1="98" x2="180" y2="110" stroke="#2a5aa0" strokeWidth="0.5" />
          <line x1="195" y1="98" x2="195" y2="110" stroke="#2a5aa0" strokeWidth="0.5" />
        </g>
      )}

      {/* Radiometer */}
      {has('radiometer') && (
        <g>
          <circle cx="230" cy="115" r="7" fill="#2a2a2a" stroke="#666" strokeWidth="1" />
          <circle cx="230" cy="115" r="3" fill="#0a0e1a" />
          <motion.line x1="230" y1="115" x2="234" y2="112" stroke="#ff3333" strokeWidth="1" animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} style={{ transformOrigin: '230px 115px' }} />
        </g>
      )}

      {/* Antenna */}
      {has('high_gain_antenna') && (
        <g>
          <line x1="150" y1="100" x2="150" y2="70" stroke="#888" strokeWidth="2" />
          <ellipse cx="150" cy="65" rx="18" ry="6" fill="#c0c0c0" stroke="#666" strokeWidth="1" />
          <circle cx="150" cy="65" r="2" fill="#00d4ff" />
        </g>
      )}

      {/* Flame from main engines */}
      {has('propulsion') && (
        <motion.g
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 0.3, repeat: Infinity }}
        >
          <path d="M40 150 L20 210 L60 165 Z" fill="url(#flameWhite)" />
          <path d="M60 140 L55 195 L80 148 Z" fill="url(#flameWhite)" />
          <path d="M62 155 L65 200 L82 160 Z" fill="url(#flameWhite)" />
        </motion.g>
      )}

      {/* Status lights */}
      <motion.circle cx="240" cy="130" r="2" fill="#00ff88" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} />
      <motion.circle cx="270" cy="130" r="2" fill="#ff3333" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
    </svg>
  );

  const renderMap = {
    scout: renderScout,
    science: renderScience,
    hauler: renderHauler,
  };

  const labels = {
    scout: { name: 'ORION SCOUT', color: '#00d4ff' },
    science: { name: 'VOYAGER PROBE', color: '#00ff88' },
    hauler: { name: 'SPACE HAULER', color: '#ffb800' },
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div
        className="w-full h-full flex items-center justify-center"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          filter: `drop-shadow(0 0 30px ${labels[type].color}80)`,
        }}
      >
        {renderMap[type] ? renderMap[type]() : renderScout()}
      </motion.div>

      <div className="absolute bottom-2 left-0 right-0 text-center">
        <span
          className="text-[10px] font-bold tracking-widest"
          style={{ color: labels[type].color }}
        >
          {labels[type].name}
        </span>
      </div>

      {components.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-gray-500 text-xs text-center px-4">
            Tap parts below to build
          </p>
        </div>
      )}
    </div>
  );
}
