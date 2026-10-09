import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { playAchievement } from '../utils/sounds';

export default function LevelUpToast({ level, onClose }) {
  useEffect(() => {
    playAchievement();
    const t = setTimeout(onClose, 4200);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      className="fixed inset-0 z-[110] flex items-center justify-center pointer-events-none"
    >
      <motion.div
        animate={{ rotate: [0, -3, 3, -3, 0] }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-space-accent/30 to-cyan-500/20 backdrop-blur-xl border-2 border-space-accent rounded-3xl p-6 shadow-2xl shadow-space-accent/40 text-center min-w-[260px]"
      >
        <div className="text-[10px] text-space-accent font-bold tracking-widest mb-2">
          ⭐ LEVEL UP ⭐
        </div>
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="text-7xl font-black text-space-accent mb-2"
        >
          {level}
        </motion.div>
        <div className="text-white text-sm font-bold">
          You reached Level {level}!
        </div>
        {level === 2 && (
          <div className="text-space-success text-xs mt-2">
            🎉 Science Vessel Unlocked!
          </div>
        )}
        {level === 4 && (
          <div className="text-space-warning text-xs mt-2">
            🎉 Hauler Unlocked!
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
