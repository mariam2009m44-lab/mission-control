import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { playAchievement } from '../utils/sounds';

export default function AchievementToast({ achievement, onClose }) {
  useEffect(() => {
    playAchievement();
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [achievement, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -100, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -100, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] pointer-events-none"
    >
      <div className="bg-gradient-to-br from-space-warning/30 to-yellow-500/20 backdrop-blur-xl border-2 border-space-warning rounded-2xl p-4 shadow-2xl shadow-space-warning/30 flex items-center gap-3 min-w-[280px] max-w-[90vw]">
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1.5 }}
          className="text-4xl"
        >
          {achievement.icon}
        </motion.div>
        <div className="flex-1">
          <div className="text-[10px] text-space-warning font-bold tracking-widest">
            ✨ ACHIEVEMENT UNLOCKED
          </div>
          <div className="text-white font-bold text-sm">{achievement.name}</div>
          <div className="text-gray-300 text-[10px]">{achievement.description}</div>
        </div>
      </div>
    </motion.div>
  );
}
