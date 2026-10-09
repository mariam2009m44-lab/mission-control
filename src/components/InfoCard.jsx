import { motion, AnimatePresence } from 'framer-motion';
import { getContent } from '../data/educationalContent';

export default function InfoCard({ componentId, onClose }) {
  const content = getContent(componentId);

  if (!content) return null;

  const difficultyColors = {
    Basic: 'text-space-success border-space-success/30 bg-space-success/10',
    Intermediate: 'text-space-warning border-space-warning/30 bg-space-warning/10',
    Advanced: 'text-space-danger border-space-danger/30 bg-space-danger/10',
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.85, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.85, y: 30, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-space-800/95 border border-white/20 rounded-3xl p-5 md:p-6 max-w-lg w-full shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-bold text-space-accent">
                📚 {content.name}
              </h2>
              <p className="text-xs text-gray-400 mt-1 italic">
                {content.fullName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl leading-none ml-2"
            >
              ✕
            </button>
          </div>

          {/* Difficulty badge */}
          <div
            className={`inline-block text-[10px] font-bold px-3 py-1 rounded-full border mb-4 ${difficultyColors[content.difficulty]}`}
          >
            {content.difficulty}
          </div>

          {/* Description */}
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="text-xs font-bold text-space-accent mb-1">
                📖 WHAT IS IT?
              </h3>
              <p className="text-gray-300 text-xs leading-relaxed">
                {content.description}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold text-space-accent mb-1">
                🎯 PURPOSE
              </h3>
              <p className="text-gray-300 text-xs leading-relaxed">
                {content.purpose}
              </p>
            </div>

            <div className="bg-space-warning/5 border border-space-warning/20 rounded-xl p-3">
              <h3 className="text-xs font-bold text-space-warning mb-1">
                💡 DID YOU KNOW?
              </h3>
              <p className="text-gray-300 text-xs leading-relaxed">
                {content.fact}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold text-space-accent mb-1">
                🛰️ REAL MISSIONS
              </h3>
              <p className="text-gray-400 text-xs italic">
                {content.realExample}
              </p>
            </div>
          </div>

          {/* Close button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="w-full mt-5 py-3 bg-gradient-to-r from-space-accent to-cyan-400 text-space-900 rounded-xl font-bold text-sm"
          >
            GOT IT! 🚀
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
