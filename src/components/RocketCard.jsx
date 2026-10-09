import { motion } from 'framer-motion';
import { useState } from 'react';
import { getRocketImage } from '../data/rocketImages';

export default function RocketCard({ rocket, selected, onClick, tooHeavy }) {
  const [imgError, setImgError] = useState(false);
  const img = getRocketImage(rocket.id);

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full rounded-2xl border-2 overflow-hidden text-left transition-all relative ${
        selected
          ? 'border-space-warning shadow-lg shadow-space-warning/30'
          : 'border-white/10'
      } ${tooHeavy ? 'opacity-60' : ''}`}
    >
      {/* Image */}
      <div className="relative h-36 overflow-hidden">
        {!imgError ? (
          <img
            src={img.url}
            alt={img.realName}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-600/30 to-red-800/40 flex items-center justify-center text-6xl">
            {rocket.icon}
          </div>
        )}

        {/* Dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        {/* Selected checkmark */}
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-space-warning flex items-center justify-center text-space-900 font-bold text-lg shadow-lg"
          >
            ✓
          </motion.div>
        )}

        {/* Real name badge */}
        <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-black/70 backdrop-blur-md text-[9px] font-bold text-orange-300">
          🔥 {img.realName}
        </div>

        {/* Too heavy warning */}
        {tooHeavy && (
          <div className="absolute top-12 right-3 px-2 py-1 rounded-full bg-red-500/90 text-[9px] font-bold text-white">
            ⚠ Too Heavy
          </div>
        )}

        {/* Title */}
        <div className="absolute bottom-2 left-3 right-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{rocket.icon}</span>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-white truncate">
                {rocket.name}
              </h3>
              <p className="text-[10px] text-gray-300 truncate">
                {rocket.maxPayload}kg · ${rocket.cost}M
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info footer */}
      <div className="px-3 py-2 bg-black/40 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3 text-[10px]">
          <span className="text-gray-400">
            🎯 Max: <span className="text-space-warning font-bold">{rocket.maxPayload}kg</span>
          </span>
          <span className="text-gray-400">
            ✅ <span className="text-space-success font-bold">{(rocket.reliability * 100).toFixed(0)}%</span>
          </span>
        </div>
        <span className="text-[8px] text-gray-500 italic">{img.credit}</span>
      </div>
    </motion.button>
  );
}
