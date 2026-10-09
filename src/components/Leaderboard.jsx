import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { objectives } from '../data/objectives';
import { rockets } from '../data/rockets';

export default function Leaderboard({ onClose, currentUser }) {
  const [entries, setEntries] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    try {
      const users = JSON.parse(localStorage.getItem('mc_users') || '{}');
      const all = [];

      Object.entries(users).forEach(([username, data]) => {
        (data.missions || []).forEach((mission) => {
          all.push({
            username,
            score: mission.score || 0,
            status: mission.status || 'FAILED',
            objective: mission.objective || 'lunar',
            rocket: mission.rocket || 'small',
            date: mission.createdAt || new Date().toISOString(),
          });
        });
      });

      all.sort((a, b) => b.score - a.score);
      setEntries(all.slice(0, 50));
    } catch (e) {
      console.error(e);
      setEntries([]);
    }
  }, []);

  const filtered = filter === 'all'
    ? entries
    : entries.filter((e) => e.objective === filter);

  const getObjective = (id) => objectives.find((o) => o.id === id);
  const getRocket = (id) => rockets.find((r) => r.id === id);

  const getMedal = (i) => {
    if (i === 0) return { icon: '🥇', color: '#FFD700' };
    if (i === 1) return { icon: '🥈', color: '#C0C0C0' };
    if (i === 2) return { icon: '🥉', color: '#CD7F32' };
    return { icon: `#${i + 1}`, color: '#888' };
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/85 backdrop-blur-md z-[80] flex items-start md:items-center justify-center p-2 md:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-space-800/95 border border-white/20 rounded-3xl p-4 md:p-6 max-w-2xl w-full my-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-4xl">🏆</div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                Global Leaderboard
              </h2>
              <p className="text-[10px] text-gray-400">Top commanders of all time</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {[
            { id: 'all', label: '🌌 All Missions' },
            { id: 'lunar', label: '🌙 Lunar' },
            { id: 'mars', label: '🔴 Mars' },
            { id: 'earth', label: '🌍 Earth' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === f.id
                  ? 'bg-yellow-500/30 border border-yellow-400/50 text-yellow-300'
                  : 'bg-white/5 border border-white/10 text-gray-400'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🚀</div>
            <p className="text-sm text-gray-400">No missions yet</p>
            <p className="text-xs text-gray-600 mt-1">Be the first to launch!</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
            {filtered.slice(0, 20).map((entry, i) => {
              const medal = getMedal(i);
              const obj = getObjective(entry.objective);
              const isCurrent = entry.username === currentUser;
              return (
                <motion.div
                  key={`${entry.username}-${i}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`flex items-center gap-3 p-3 rounded-xl border ${
                    i === 0
                      ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/10 border-yellow-400/50 shadow-lg shadow-yellow-500/20'
                      : i === 1
                      ? 'bg-gradient-to-r from-gray-400/20 to-gray-500/10 border-gray-400/40'
                      : i === 2
                      ? 'bg-gradient-to-r from-orange-600/20 to-orange-700/10 border-orange-500/40'
                      : isCurrent
                      ? 'bg-space-accent/20 border-space-accent/50'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  {/* Medal */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${medal.color}40, ${medal.color}20)`,
                      border: `2px solid ${medal.color}80`,
                      color: medal.color,
                    }}
                  >
                    {medal.icon}
                  </div>

                  {/* User + Mission */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold truncate ${isCurrent ? 'text-space-accent' : 'text-white'}`}>
                        {entry.username}
                        {isCurrent && <span className="text-[8px] text-space-accent ml-1">(YOU)</span>}
                      </span>
                    </div>
                    <div className="flex gap-2 text-[9px] text-gray-500 mt-0.5">
                      <span>{obj?.icon} {obj?.name || 'Mission'}</span>
                      <span>· {getRocket(entry.rocket)?.name || 'Rocket'}</span>
                    </div>
                  </div>

                  {/* Status + Score */}
                  <div className="text-right flex-shrink-0">
                    <div
                      className={`text-xs font-bold ${
                        entry.status === 'SUCCESS'
                          ? 'text-green-400'
                          : entry.status === 'PARTIAL'
                          ? 'text-yellow-400'
                          : 'text-red-400'
                      }`}
                    >
                      {entry.status === 'SUCCESS' ? '🎉' : entry.status === 'PARTIAL' ? '📊' : '❌'}{' '}
                      {entry.status}
                    </div>
                    <div className="text-[10px] text-gray-300 font-mono">
                      {entry.score} pts
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Footer stats */}
        {filtered.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-bold text-space-accent">{filtered.length}</div>
              <div className="text-[9px] text-gray-500">MISSIONS</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-400">
                {filtered.filter((e) => e.status === 'SUCCESS').length}
              </div>
              <div className="text-[9px] text-gray-500">SUCCESS</div>
            </div>
            <div>
              <div className="text-lg font-bold text-yellow-400">
                {filtered[0]?.score || 0}
              </div>
              <div className="text-[9px] text-gray-500">TOP SCORE</div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
