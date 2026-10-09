import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { generateRandomEvents } from '../engine/randomEvents';
import { playCountdownBeep, playLaunchSound, playClick } from '../utils/sounds';

export default function LaunchSequence({ rocket, objective, design, onComplete }) {
  const [phase, setPhase] = useState('countdown');
  const [count, setCount] = useState(3);
  const [events, setEvents] = useState([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  useEffect(() => {
    if (phase === 'countdown') {
      if (count > 0) {
        playCountdownBeep(count === 1);
        const t = setTimeout(() => setCount(count - 1), 800);
        return () => clearTimeout(t);
      } else {
        playCountdownBeep(true);
        setPhase('launch');
      }
    }

    if (phase === 'launch') {
      playLaunchSound();
      const t = setTimeout(() => {
        const evs = generateRandomEvents(design);
        setEvents(evs);
        setPhase('space');
      }, 2500);
      return () => clearTimeout(t);
    }

    if (phase === 'space') {
      if (currentEventIndex < events.length) {
        const t = setTimeout(() => {
          setCurrentEventIndex((i) => i + 1);
        }, 1800);
        return () => clearTimeout(t);
      } else if (events.length > 0 && currentEventIndex >= events.length) {
        const t = setTimeout(() => {
          setPhase('done');
          setTimeout(() => onComplete(events), 800);
        }, 1500);
        return () => clearTimeout(t);
      } else if (events.length === 0) {
        const t = setTimeout(() => {
          setPhase('done');
          setTimeout(() => onComplete([]), 800);
        }, 2000);
        return () => clearTimeout(t);
      }
    }
  }, [phase, count, events, currentEventIndex, design, onComplete]);

  const currentEvent = events[currentEventIndex - 1];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black overflow-hidden"
    >
      {/* Stars */}
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

      {/* Target */}
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

      {/* Rocket */}
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
              animate={{ scaleY: [0.9, 1.3, 0.9], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 0.15, repeat: Infinity }}
              style={{ transformOrigin: '40px 100px' }}
            >
              <path d="M30 100 L40 140 L50 100 Z" fill="url(#flameGrad)" />
              <path d="M35 100 L40 130 L45 100 Z" fill="#ffffff" opacity="0.8" />
            </motion.g>
          )}
        </svg>
      </motion.div>

      {/* Countdown */}
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

      {/* Launch message */}
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

      {/* Events during space phase */}
      {phase === 'space' && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-16 left-0 right-0 text-center"
          >
            <p className="text-xl font-bold text-space-accent">
              🌌 In Orbit — Mission Events
            </p>
          </motion.div>

          {/* Current event card */}
          {currentEvent && (
            <motion.div
              key={currentEvent.id}
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 max-w-sm w-[90%] backdrop-blur-md rounded-2xl p-5 border-2 ${
                currentEvent.prevented
                  ? 'bg-space-success/20 border-space-success'
                  : 'bg-space-danger/20 border-space-danger'
              }`}
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring' }}
                  className="text-6xl mb-3"
                >
                  {currentEvent.icon}
                </motion.div>
                <h3 className={`text-lg font-bold mb-2 ${
                  currentEvent.prevented ? 'text-space-success' : 'text-space-danger'
                }`}>
                  {currentEvent.name}
                </h3>
                <p className="text-xs text-gray-300 mb-3">
                  {currentEvent.description}
                </p>
                <div className={`text-xs font-bold p-2 rounded-lg ${
                  currentEvent.prevented
                    ? 'bg-space-success/20 text-space-success'
                    : 'bg-space-danger/20 text-space-danger'
                }`}>
                  {currentEvent.prevented ? '✅ ' : '⚠ '}
                  {currentEvent.message}
                </div>
              </div>
            </motion.div>
          )}

          {/* Progress dots */}
          {events.length > 0 && (
            <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-2">
              {events.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i < currentEventIndex ? 'bg-space-accent' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
