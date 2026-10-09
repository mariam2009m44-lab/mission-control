import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { objectives } from './data/objectives';
import { components } from './data/spacecraft';
import { rockets } from './data/rockets';
import { calculateMetrics, validateDesign, simulateLaunch } from './engine/simulator';
import { getCurrentUser, logout, saveMission } from './utils/auth';
import Starfield from './components/Starfield';
import Spacecraft from './components/Spacecraft';
import MetricBar from './components/MetricBar';
import AuthScreen from './components/AuthScreen';
import MissionHistory from './components/MissionHistory';
import LaunchSequence from './components/LaunchSequence';
import InfoCard from './components/InfoCard';
import SpaceJourney from './components/SpaceJourney';
import AchievementToast from './components/AchievementToast';
import AchievementsPage from './components/AchievementsPage';
import StatisticsPage from './components/StatisticsPage';
import { achievements, checkNewAchievements } from './data/achievements';
import { playClick, playSuccess, playFailure, initAudio, startAmbientMusic } from './utils/sounds';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = getCurrentUser();
    setUser(u);
    setLoading(false);
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  if (loading) {
    return (
      <>
        <Starfield />
        <div className="min-h-screen flex items-center justify-center text-white">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-5xl"
          >
            🚀
          </motion.div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Starfield />
        <AuthScreen onAuth={setUser} />
      </>
    );
  }

  return <GameScreen user={user} onLogout={handleLogout} />;
}

function GameScreen({ user, onLogout }) {
  const [objectiveId, setObjectiveId] = useState('lunar');
  const [rocketId, setRocketId] = useState('small');
  const [componentIds, setComponentIds] = useState(['solar_panel', 'camera']);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showLaunch, setShowLaunch] = useState(false);
  const [infoComponent, setInfoComponent] = useState(null);
  const [showJourney, setShowJourney] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [newAchievement, setNewAchievement] = useState(null);
  const [unlockedIds, setUnlockedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('mc_achievements') || '[]');
    } catch { return []; }
  });
  const [stats, setStats] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('mc_stats') || 'null') || {
        totalMissions: 0,
        successfulMissions: 0,
        visitedPlanets: [],
        usedRockets: [],
        bestScience: 0,
        bestBudget: null,
        bestScore: 0,
      };
    } catch { return {
      totalMissions: 0,
      successfulMissions: 0,
      visitedPlanets: [],
      usedRockets: [],
      bestScience: 0,
      bestBudget: null,
      bestScore: 0,
    }; }
  });

  const design = { objectiveId, rocketId, componentIds };
  const metrics = calculateMetrics(design);
  const validation = validateDesign(metrics, design);
  const objective = objectives.find((o) => o.id === objectiveId);
  const selectedRocket = rockets.find((r) => r.id === rocketId);

  const toggleMusic = () => {
    const next = !musicOn;
    setMusicOn(next);
    initAudio();
    if (next) {
      startAmbientMusic();
    } else {
      stopAmbientMusic();
    }
    playClick();
  };

  const toggleComponent = (id) => {
    setComponentIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleLaunch = () => {
    initAudio();
    playClick();
    setShowLaunch(true);
  };

  const finishLaunch = () => {
    const res = simulateLaunch(metrics, design);
    setResult(res);
    setShowLaunch(false);
    setShowResult(true);
    saveMission({
      objective: objectiveId,
      rocket: rocketId,
      parts: componentIds,
      score: res.score,
      status: res.status,
    });
    updateStatsAndCheck(res, []);
  };

  return (
    <>
      <Starfield />
      <div className="min-h-screen text-white relative overflow-hidden">
        <div className="backdrop-blur-md bg-black/30 border-b border-white/10 px-4 py-3">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-space-accent to-cyan-300 bg-clip-text text-transparent">
              🚀 Mission Control
            </h1>
            <div className="flex items-center gap-2">
              <div className="text-xs text-gray-300 hidden md:block">
                👨‍🚀 <span className="text-space-accent font-bold">{user.username}</span>
              </div>
                            <button
                onClick={toggleMusic}
                className={`text-xs px-2 md:px-3 py-1 border rounded-lg ${
                  musicOn
                    ? 'bg-space-success/20 border-space-success/50 text-space-success'
                    : 'bg-white/5 border-white/10 text-gray-400'
                }`}
              >
                {musicOn ? '🎵' : '🔇'}
              </button>
                            <button
                onClick={() => setShowStats(true)}
                className="text-xs px-2 md:px-3 py-1 bg-purple-500/20 border border-purple-400/50 text-purple-300 rounded-lg hover:bg-purple-500/30"
              >
                📊
              </button>
              <button onClick={() => setShowAchievements(true)}
                className="text-xs px-2 md:px-3 py-1 bg-space-warning/20 border border-space-warning/50 text-space-warning rounded-lg hover:bg-space-warning/30"
              >
                🏆 {unlockedIds.length}
              </button>
              <button
                onClick={() => setShowHistory(true)}
                className="text-xs px-2 md:px-3 py-1 bg-space-accent/20 border border-space-accent/50 text-space-accent rounded-lg hover:bg-space-accent/30"
              >
                📜 Log
              </button>
              <button
                onClick={onLogout}
                className="text-xs px-3 py-1 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10"
              >
                Exit
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-2 md:px-4 py-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-3">
              <h3 className="text-xs text-gray-400 mb-2 font-bold">🎯 MISSION</h3>
              <div className="space-y-2">
                {objectives.map((obj) => (
                  <motion.button
                    key={obj.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      playClick();
                      setObjectiveId(obj.id);
                    }}
                    className={`w-full p-2 rounded-xl text-left text-xs border transition-all ${
                      objectiveId === obj.id
                        ? 'bg-space-accent/20 border-space-accent text-white'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-space-accent'
                    }`}
                  >
                    <div className="text-2xl">{obj.icon}</div>
                    <div className="font-bold mt-1">{obj.name}</div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-4 relative min-h-[400px] md:min-h-[500px] flex flex-col">
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="text-center">
                  <div className="text-[10px] text-gray-500">MASS</div>
                  <div className="text-sm font-bold text-space-accent">{metrics.mass}kg</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-gray-500">BUDGET</div>
                  <div className={`text-sm font-bold ${metrics.cost > 100 ? 'text-space-danger' : 'text-space-warning'}`}>
                    ${metrics.cost}M
                  </div>
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center">
                <Spacecraft selectedComponents={componentIds} objective={objective} />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLaunch}
                disabled={!rocketId}
                className="mt-3 w-full py-3 bg-gradient-to-r from-space-accent via-cyan-300 to-space-accent text-space-900 rounded-xl font-bold text-lg shadow-lg shadow-space-accent/40"
              >
                🚀 LAUNCH MISSION
              </motion.button>
            </div>

            <div className="mt-3 backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-3">
              <h3 className="text-xs text-gray-400 mb-2 font-bold">🔧 ADD PARTS</h3>
              <div className="grid grid-cols-5 gap-2">
                {Object.values(components).map((c) => {
                  const selected = componentIds.includes(c.id);
                  return (
                    <div
                      key={c.id}
                      className={`relative p-2 rounded-xl border transition-all text-center ${
                        selected
                          ? 'bg-space-accent/30 border-space-accent'
                          : 'bg-white/5 border-white/10 hover:border-space-accent/50'
                      }`}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setInfoComponent(c.id);
                        }}
                        className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-space-accent/40 text-space-accent text-[8px] font-bold flex items-center justify-center hover:bg-space-accent hover:text-space-900"
                      >
                        i
                      </button>
                      <div
                        onClick={() => {
                          playClick();
                          toggleComponent(c.id);
                        }}
                        className="cursor-pointer"
                      >
                        <div className="text-2xl">{c.icon}</div>
                        <div className="text-[9px] text-gray-300 mt-1 leading-tight">
                          {c.name.split(' ')[0]}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 order-3 space-y-3">
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-3">
              <h3 className="text-xs text-gray-400 mb-2 font-bold">🚀 LAUNCHER</h3>
              <div className="space-y-2">
                {rockets.map((r) => (
                  <motion.button
                    key={r.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      playClick();
                      setRocketId(r.id);
                    }}
                    className={`w-full p-2 rounded-xl border text-left transition-all ${
                      rocketId === r.id
                        ? 'bg-space-accent/20 border-space-accent'
                        : 'bg-white/5 border-white/10 hover:border-space-accent'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{r.icon}</span>
                      <div className="flex-1">
                        <div className="text-xs font-bold">{r.name}</div>
                        <div className="text-[10px] text-gray-500">
                          {r.maxPayload}kg · ${r.cost}M
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-3">
              <h3 className="text-xs text-gray-400 mb-3 font-bold">📊 STATUS</h3>
              <div className="space-y-3">
                <MetricBar label="Mass" value={metrics.mass} max={500} unit="kg" color={metrics.mass > (metrics.rocket?.maxPayload || 500) ? 'danger' : 'accent'} icon="⚖️" />
                <MetricBar label="Budget" value={metrics.cost} max={100} unit="M$" color={metrics.cost > 100 ? 'danger' : 'warning'} icon="💰" />
                <MetricBar label="Power" value={Math.max(metrics.power, 0)} max={500} unit="W" color={metrics.power < 0 ? 'danger' : 'success'} icon="⚡" />
                <MetricBar label="Science" value={metrics.science} max={100} color="accent" icon="🔬" />
              </div>

              {validation.errors.length > 0 && (
                <div className="mt-3 p-2 rounded-lg bg-space-danger/10 border border-space-danger/30 text-[10px] text-space-danger space-y-1">
                  {validation.errors.map((e, i) => <div key={i}>⚠ {e}</div>)}
                </div>
              )}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showLaunch && (
            <LaunchSequence
              rocket={selectedRocket} design={design}
              objective={objective}
              onComplete={(events) => finishLaunch(events)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showResult && result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
              onClick={() => setShowResult(false)}
            >
              <motion.div
                initial={{ scale: 0.8, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-space-800/95 border border-white/20 rounded-3xl p-6 max-w-md w-full text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="text-7xl mb-3"
                >
                  {result.status === 'SUCCESS' ? '🎉' : result.status === 'PARTIAL' ? '📊' : '❌'}
                </motion.div>
                <h2 className="text-2xl font-bold text-space-accent mb-2">{result.message}</h2>
                <p className="text-gray-400 text-sm mb-4">Score: {result.score}</p>

                <div className="bg-white/5 rounded-xl p-3 text-left text-xs space-y-1 mb-4">
                  {result.details.map((d, i) => (
                    <div key={i} className="text-gray-300">• {d}</div>
                  ))}
                </div>

                <button
                  onClick={() => setShowResult(false)}
                  className="w-full py-3 bg-gradient-to-r from-space-accent to-cyan-400 text-space-900 rounded-xl font-bold"
                >
                  🔄 PLAY AGAIN
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showHistory && <MissionHistory onClose={() => setShowHistory(false)} />}
        </AnimatePresence>

        <AnimatePresence>
          {showStats && (
            <StatisticsPage onClose={() => setShowStats(false)} />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showAchievements && (
            <AchievementsPage
              unlockedIds={unlockedIds}
              onClose={() => setShowAchievements(false)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {newAchievement && (
            <AchievementToast
              achievement={newAchievement}
              onClose={() => setNewAchievement(null)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {infoComponent && (
            <InfoCard componentId={infoComponent} onClose={() => setInfoComponent(null)} />
          )}
        </AnimatePresence>

        <footer className="text-center text-gray-600 text-[10px] pb-4">
          Educational simulator — v1.1.0
        </footer>
      </div>
    </>
  );
}

export default App;
