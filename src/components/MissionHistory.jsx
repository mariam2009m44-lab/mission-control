import { motion, AnimatePresence } from 'framer-motion';
import { getMissions, deleteMission } from '../utils/auth';
import { useState } from 'react';
import { objectives } from '../data/objectives';
import { rockets } from '../data/rockets';

export default function MissionHistory({ onClose }) {
  const [missions, setMissions] = useState(getMissions());
  const [compare, setCompare] = useState([]);

  const handleDelete = (id) => {
    deleteMission(id);
    setMissions(getMissions());
  };

  const toggleCompare = (m) => {
    setCompare((prev) => {
      if (prev.find((x) => x.id === m.id)) {
        return prev.filter((x) => x.id !== m.id);
      }
      if (prev.length >= 2) return [prev[1], m];
      return [...prev, m];
    });
  };

  const getObjective = (id) => objectives.find((o) => o.id === id);
  const getRocket = (id) => rockets.find((r) => r.id === id);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-start md:items-center justify-center p-2 md:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-space-800/95 border border-white/20 rounded-3xl p-4 md:p-6 max-w-2xl w-full my-4"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-space-accent">📜 Mission Log</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-space-accent">{missions.length}</div>
            <div className="text-[10px] text-gray-500">TOTAL</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-space-success">
              {missions.filter((m) => m.status === 'SUCCESS').length}
            </div>
            <div className="text-[10px] text-gray-500">SUCCESS</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-space-warning">
              {missions.length > 0
                ? Math.max(...missions.map((m) => m.score || 0))
                : 0}
            </div>
            <div className="text-[10px] text-gray-500">BEST SCORE</div>
          </div>
        </div>

        {/* Compare Panel */}
        {compare.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-space-accent/10 border border-space-accent/30 rounded-xl p-3 mb-4"
          >
            <h3 className="text-sm font-bold text-space-accent mb-2">
              🔍 Comparing {compare.length}/2
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {compare.map((m) => (
                <div key={m.id} className="bg-white/5 rounded-lg p-2">
                  <div className="text-[10px] text-gray-400">
                    {getObjective(m.objective)?.name}
                  </div>
                  <div className="font-bold text-space-accent">
                    Score: {m.score}
                  </div>
                  <div className="text-[10px] text-gray-500">
                    {m.status} · {getRocket(m.rocket)?.name}
                  </div>
                </div>
              ))}
            </div>
            {compare.length === 2 && (
              <div className="mt-2 text-[10px] text-space-warning">
                {compare[0].score > compare[1].score
                  ? `✅ Design 1 wins by ${compare[0].score - compare[1].score} points`
                  : compare[1].score > compare[0].score
                  ? `✅ Design 2 wins by ${compare[1].score - compare[0].score} points`
                  : '🤝 Tie!'}
              </div>
            )}
            <button
              onClick={() => setCompare([])}
              className="text-[10px] text-gray-400 mt-2 underline"
            >
              Clear selection
            </button>
          </motion.div>
        )}

        {/* Missions List */}
        {missions.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            No missions yet. Launch your first mission! 🚀
          </div>
        ) : (
          <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
            {missions.map((m) => {
              const obj = getObjective(m.objective);
              const isSelected = compare.find((x) => x.id === m.id);
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-space-accent/20 border-space-accent'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="text-2xl">{obj?.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold truncate">{obj?.name}</div>
                    <div className="text-[10px] text-gray-500">
                      {new Date(m.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-bold ${
                      m.status === 'SUCCESS'
                        ? 'text-space-success'
                        : m.status === 'PARTIAL'
                        ? 'text-space-warning'
                        : 'text-space-danger'
                    }`}>
                      {m.status}
                    </div>
                    <div className="text-[10px] text-gray-400">Score: {m.score}</div>
                  </div>
                  <button
                    onClick={() => toggleCompare(m)}
                    className="text-xs px-2 py-1 bg-white/5 rounded-lg hover:bg-white/10"
                  >
                    {isSelected ? '✓' : '+'}
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="text-xs px-2 py-1 bg-space-danger/20 text-space-danger rounded-lg hover:bg-space-danger/30"
                  >
                    🗑
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
