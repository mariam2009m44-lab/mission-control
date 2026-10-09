import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function LaunchSequence({ rocket, objective, onComplete }) {
  const [phase, setPhase] = useState('countdown');
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (phase === 'countdown') {
      if (count > 0) {
        const t = setTimeout(() => setCount(count - 1), 800);
        return () => clearTimeout(t);
      } else {
        setPhase('launch');
      }
    }

    if (phase === 'launch') {
      const t = setTimeout(() => setPhase('space'), 2500);
      return () => clearTimeout(t);
    }

    if (phase === 'space') {
      const t = setTimeout(() => {
        setPhase('done');
        setTimeout(() => onComplete(), 800);
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [phase, count, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black overflow-hidden"
    >
      <div className="absolute inset-0">
        {Array.from({ length: 80 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: phase === 'launch' || phase === 'space' ? [0, 800] : 0,
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              y: { duration: phase === 'space' ? 0.8 : 2, repeat: Infinity, ease: 'linear' },
              opacity: { duration: 1.5, repeat: Infinity },
            }}
          />
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-gray-900 to-transparent" />

      <motion.div
        className="absolute text-6xl"
        style={{ top: '10%', left: '50%', transform: 'translateX(-50%)' }}
        animate={{
          scale: phase === 'space' ? [1, 1.3] : 1,
          opacity: phase === 'countdown' ? 0.3 : 1,
        }}
        transition={{ duration: 2 }}
      >
        {objective?.icon}
      </motion.div>

      <motion.div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ bottom: '15%' }}
        animate={
          phase === 'countdown'
            ? { y: [0, -3, 0] }
            : phase === 'launch'
            ? { y: -100 }
            : phase === 'space'
            ? { y: -800, scale: 0.3 }
            : { y: -900, scale: 0.2, opacity: 0 }
        }
        transition={{
          duration: phase === 'countdown' ? 0.5 : phase === 'launch' ? 2.5 : 3,
          ease: phase === 'space' ? 'easeIn' : 'easeOut',
          repeat: phase === 'countdown' ? Infinity : 0,
        }}
      >
        <svg width="80" height="140" viewBox="0 0 80 140">
          <defs>
            <linearGradient id="rocketBody" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f0f0f0" />
              <stop offset="100%" stopColor="#909090" />
            </linearGradient>
            <linearGradient id="flameGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff200" />
              <stop offset="40%" stopColor="#ff8800" />
              <stop offset="100%" stopColor="#ff0000" stopOpacity="0" />
            </linearGradient>
          </defs>

          <path d="M40 5 L55 40 L25 40 Z" fill="#cc3333" />
          <rect x="25" y="40" width="30" height="60" rx="3" fill="url(#rocketBody)" />
          <rect x="25" y="55" width="30" height="4" fill="#cc3333" />
          <rect x="25" y="85" width="30" height="4" fill="#cc3333" />
          <circle cx="40" cy="50" r="6" fill="#0a0e1a" stroke="#00d4ff" strokeWidth="2" />
          <path d="M25 90 L15 110 L25 105 Z" fill="#cc3333" />
          <path d="M55 90 L65 110 L55 105 Z" fill="#cc3333" />

          {(phase === 'launch' || phase === 'space') && (
            <motion.g
              animate={{
                scaleY: [0.9, 1.3, 0.9],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{ duration: 0.15, repeat: Infinity }}
              style={{ transformOrigin: '40px 100px' }}
            >
              <path d="M30 100 L40 140 L50 100 Z" fill="url(#flameGrad)" />
              <path d="M35 100 L40 130 L45 100 Z" fill="#ffffff" opacity="0.8" />
            </motion.g>
          )}
        </svg>

        {(phase === 'launch' || phase === 'space') && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-32 h-64 bg-gradient-to-b from-white/40 to-transparent blur-xl" />
        )}
      </motion.div>

      {phase === 'countdown' && (
        <motion.div
          key={count}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 2, opacity: 0 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="text-9xl font-black text-space-accent drop-shadow-[0_0_30px_rgba(0,212,255,0.8)]">
            {count > 0 ? count : 'GO!'}
          </span>
        </motion.div>
      )}

      {phase === 'launch' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-20 left-0 right-0 text-center"
        >
          <p className="text-2xl font-bold text-space-warning animate-pulse">
            🚀 LIFT OFF!
          </p>
        </motion.div>
      )}

      {phase === 'space' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-20 left-0 right-0 text-center"
        >
          <p className="text-2xl font-bold text-space-accent">
            🌌 Approaching target...
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
