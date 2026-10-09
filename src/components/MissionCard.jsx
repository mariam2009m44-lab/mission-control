import { motion } from 'framer-motion';
import { useState } from 'react';
import { getPlanetImage } from '../data/planetImages';

export default function MissionCard({ objective, selected, onClick }) {
  const [imgError, setImgError] = useState(false);
  const img = getPlanetImage(objective.id);

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full rounded-2xl border-2 overflow-hidden text-left transition-all relative ${
        selected
          ? 'border-space-accent shadow-lg shadow-space-accent/30'
          : 'border-white/10'
      }`}
    >
      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        {!imgError ? (
          <img
            src={img.url}
            alt={objective.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-space-700 to-space-900 flex items-center justify-center text-7xl">
            {objective.icon}
          </div>
        )}

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        {/* Selected checkmark */}
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-space-accent flex items-center justify-center text-space-900 font-bold text-lg shadow-lg"
          >
            ✓
          </motion.div>
        )}

        {/* Difficulty badge */}
        <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-black/70 backdrop-blur-md text-[9px] font-bold text-yellow-300">
          {'★'.repeat(objective.difficulty)}{'☆'.repeat(5 - objective.difficulty)}
        </div>

        {/* Title over image */}
        <div className="absolute bottom-2 left-3 right-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{objective.icon}</span>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-white truncate">
                {objective.name}
              </h3>
              <p className="text-[10px] text-gray-300 truncate">
                {objective.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info row */}
      <div className="px-3 py-2 bg-black/40 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3 text-[10px]">
          <span className="text-gray-400">
            💰 Min: <span className="text-space-warning font-bold">${objective.minBudget}M</span>
          </span>
          <span className="text-gray-400">
            🔬 Target: <span className="text-space-accent font-bold">{objective.scienceTarget}</span>
          </span>
        </div>
        <span className="text-[8px] text-gray-500 italic">{img.credit}</span>
      </div>
    </motion.button>
  );
}
