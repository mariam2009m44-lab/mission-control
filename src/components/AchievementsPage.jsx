import { motion, AnimatePresence } from 'framer-motion';
import { achievements } from '../data/achievements';

export default function AchievementsPage({ unlockedIds, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-[80] flex items-start md:items-center justify-center p-2 md:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-space-800/95 border border-white/20 rounded-3xl p-4 md:p-6 max-w-2xl w-full my-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-space-warning">
              🏆 Achievements
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              {unlockedIds.length} / {achievements.length} unlocked
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(unlockedIds.length / achievements.length) * 100}%` }}
            transition={{ duration: 0.8 }}
            className="h-full bg-gradient-to-r from-space-warning to-yellow-300"
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {achievements.map((a, i) => {
            const unlocked = unlockedIds.includes(a.id);
            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                className={`relative p-3 rounded-2xl border-2 text-center ${
                  unlocked
                    ? 'bg-gradient-to-br from-space-warning/20 to-yellow-500/10 border-space-warning/50'
                    : 'bg-white/5 border-white/10 opacity-50'
                }`}
              >
                {unlocked && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-space-success rounded-full border-2 border-black flex items-center justify-center text-[10px]"
                  >
                    ✓
                  </motion.div>
                )}
                <div className={`text-4xl mb-2 ${unlocked ? '' : 'grayscale'}`}>
                  {unlocked ? a.icon : '🔒'}
                </div>
                <div className={`text-xs font-bold ${unlocked ? 'text-space-warning' : 'text-gray-400'}`}>
                  {a.name}
                </div>
                <div className="text-[9px] text-gray-400 mt-1 leading-tight">
                  {a.description}
                </div>
              </motion.div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 py-3 bg-gradient-to-r from-space-warning to-yellow-400 text-space-900 rounded-xl font-bold text-sm"
        >
          CLOSE
        </button>
      </motion.div>
    </motion.div>
  );
}
