import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { objectives } from './data/objectives';
import { components } from './data/spacecraft';
import { rockets } from './data/rockets';
import { calculateMetrics, validateDesign, simulateLaunch } from './engine/simulator';
import { getCurrentUser, logout, saveMission } from './utils/auth';
import { spacecraftList } from './data/spacecraftTypes';
import { calculateLevel, getUnlockedTypes, xpProgress } from './data/levelSystem';
import Starfield from './components/Starfield';
import RealisticSpacecraft from './components/RealisticSpacecraft';
import MetricBar from './components/MetricBar';
import AuthScreen from './components/AuthScreen';
import WelcomeScreen from './components/WelcomeScreen';
import MissionHistory from './components/MissionHistory';
import LaunchSequence from './components/LaunchSequence';
import SpaceJourney from './components/SpaceJourney';
import AchievementsPage from './components/AchievementsPage';
import StatisticsPage from './components/StatisticsPage';
import InfoCard from './components/InfoCard';
import ExploreSpace from './components/ExploreSpace';
import { ProIcons, ObjectiveIcons, RocketIcons, SpacecraftTypeIcons } from './components/ProIcons';
import { playClick, playSuccess, playFailure, initAudio, startAmbientMusic, stopAmbientMusic } from './utils/sounds';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { setUser(getCurrentUser()); setLoading(false); }, []);
  if (loading) return (<><Starfield /><div className="min-h-screen flex items-center justify-center text-white"><motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-5xl">🚀</motion.div></div></>);
  if (!user) return (<><Starfield /><AuthScreen onAuth={setUser} /></>);
  return <GameScreen user={user} onLogout={() => { logout(); setUser(null); }} />;
}

function GameScreen({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('mission');
  const [objectiveId, setObjectiveId] = useState('lunar');
  const [rocketId, setRocketId] = useState('small');
  const [componentIds, setComponentIds] = useState(['solar_panel', 'camera']);
  const [spacecraftTypeId, setSpacecraftTypeId] = useState('scout');
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showExplore, setShowExplore] = useState(false);
  const [showLaunch, setShowLaunch] = useState(false);
  const [showJourney, setShowJourney] = useState(false);
  const [infoComponent, setInfoComponent] = useState(null);
  const [musicOn, setMusicOn] = useState(false);
  const [xp, setXp] = useState(() => { try { return parseInt(localStorage.getItem('mc_xp') || '0'); } catch { return 0; } });
  const [unlockedIds, setUnlockedIds] = useState(() => { try { return JSON.parse(localStorage.getItem('mc_achievements') || '[]'); } catch { return []; } });

  const design = { objectiveId, rocketId, componentIds };
  const metrics = calculateMetrics(design);
  const validation = validateDesign(metrics, design);
  const objective = objectives.find((o) => o.id === objectiveId);
  const selectedRocket = rockets.find((r) => r.id === rocketId);
  const level = calculateLevel(xp);
  const xpInfo = xpProgress(xp);

  const toggleComponent = (id) => { playClick(); setComponentIds((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]); };
  const handleLaunch = () => { initAudio(); playClick(); setShowLaunch(true); };
  const finishLaunch = () => { setShowLaunch(false); setShowJourney(true); };
  const finishJourney = () => {
    const res = simulateLaunch(metrics, design);
    setResult(res); setShowJourney(false); setShowResult(true);
    saveMission({ objective: objectiveId, rocket: rocketId, parts: componentIds, score: res.score, status: res.status });
    setTimeout(() => { if (res.status === 'SUCCESS') playSuccess(); else playFailure(); }, 400);
  };
  const toggleMusic = () => { const n = !musicOn; setMusicOn(n); initAudio(); if (n) startAmbientMusic(); else stopAmbientMusic(); playClick(); };

  const tabs = [
    { id: 'mission', icon: '🎯', label: 'Mission' },
    { id: 'build', icon: '🛰️', label: 'Build' },
    { id: 'launch', icon: '🚀', label: 'Launch' },
    { id: 'explore', icon: '🌌', label: 'Explore' },
  ];

  return (
    <>
      <Starfield />
      <div className="min-h-screen text-white relative overflow-hidden flex flex-col">
        <div className="backdrop-blur-md bg-black/40 border-b border-white/10 px-3 py-2 z-10">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🚀</span>
              <div>
                <div className="text-xs font-bold text-space-accent">Mission Control</div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[8px] px-1.5 py-0.5 bg-space-accent/20 border border-space-accent/40 rounded text-space-accent font-bold">LVL {level}</span>
                  <div className="w-12 h-1 bg-black/40 rounded-full overflow-hidden"><div className="h-full bg-space-accent" style={{ width: xpInfo.progress + '%' }} /></div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={toggleMusic} className={'text-[10px] px-2 py-1 rounded-lg border ' + (musicOn ? 'bg-space-success/20 border-space-success/50 text-space-success' : 'bg-white/5 border-white/10 text-gray-400')}>{musicOn ? '🎵' : '🔇'}</button>
              <button onClick={() => { playClick(); setShowStats(true); }} className="text-[10px] px-2 py-1 bg-purple-500/20 border border-purple-400/50 text-purple-300 rounded-lg">📊</button>
              <button onClick={() => { playClick(); setShowAchievements(true); }} className="text-[10px] px-2 py-1 bg-space-warning/20 border border-space-warning/50 text-space-warning rounded-lg">🏆</button>
              <button onClick={() => { playClick(); setShowHistory(true); }} className="text-[10px] px-2 py-1 bg-space-accent/20 border border-space-accent/50 text-space-accent rounded-lg">📜</button>
              <button onClick={onLogout} className="text-[10px] px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-gray-400">Exit</button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-24 z-10">
          <div className="max-w-2xl mx-auto px-3 py-4">
            <AnimatePresence mode="wait">
              {activeTab === 'mission' && (
                <motion.div key="m" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-3">
                  <div className="text-center mb-4"><h2 className="text-xl font-bold text-space-accent">🎯 Choose Your Mission</h2><p className="text-xs text-gray-400">Where do you want to go?</p></div>
                  {objectives.map((obj) => {
                    const Icon = ObjectiveIcons[obj.id];
                    const selected = objectiveId === obj.id;
                    return (
                      <motion.button key={obj.id} whileTap={{ scale: 0.98 }} onClick={() => { playClick(); setObjectiveId(obj.id); }} className={'w-full p-4 rounded-2xl border-2 text-left flex items-center gap-4 ' + (selected ? 'bg-space-accent/20 border-space-accent' : 'bg-white/5 border-white/10')}>
                        <div className={'w-14 h-14 rounded-xl flex items-center justify-center ' + (selected ? 'bg-space-accent/30' : 'bg-white/5')}>{Icon && <Icon size={32} className={selected ? 'text-space-accent' : 'text-gray-400'} />}</div>
                        <div className="flex-1"><div className={'text-base font-bold ' + (selected ? 'text-space-accent' : 'text-white')}>{obj.name}</div><div className="text-[11px] text-gray-400 mt-0.5">{obj.description}</div></div>
                        {selected && <div className="text-space-accent text-2xl">✓</div>}
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}
              {activeTab === 'build' && (
                <motion.div key="b" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-3">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-3"><div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                    <div><div className="text-gray-500">MASS</div><div className="text-sm font-bold text-space-accent">{metrics.mass}kg</div></div>
                    <div><div className="text-gray-500">BUDGET</div><div className="text-sm font-bold text-space-warning">${metrics.cost}M</div></div>
                    <div><div className="text-gray-500">POWER</div><div className="text-sm font-bold text-space-success">{metrics.power}W</div></div>
                    <div><div className="text-gray-500">SCIENCE</div><div className="text-sm font-bold text-space-accent">{metrics.science}</div></div>
                  </div></div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4" style={{ minHeight: 280 }}><RealisticSpacecraft type={spacecraftTypeId} components={componentIds} /></div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
                    <div className="text-[10px] text-gray-400 font-bold mb-2">SPACECRAFT TYPE</div>
                    <div className="grid grid-cols-3 gap-2">
                      {spacecraftList.map((st) => {
                        const Icon = SpacecraftTypeIcons[st.id];
                        const unlocked = getUnlockedTypes(level).includes(st.id);
                        const selected = spacecraftTypeId === st.id;
                        return (
                          <button key={st.id} onClick={() => { if (unlocked) { playClick(); setSpacecraftTypeId(st.id); } }} disabled={!unlocked} className={'p-2 rounded-xl border text-center ' + (selected ? 'bg-space-accent/30 border-space-accent' : unlocked ? 'bg-white/5 border-white/10' : 'opacity-40')}>
                            <div className="flex justify-center">{unlocked && Icon ? <Icon size={26} className={selected ? 'text-space-accent' : 'text-gray-400'} /> : <span className="text-2xl">🔒</span>}</div>
                            <div className="text-[9px] mt-1">{st.name}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
                    <div className="text-[10px] text-gray-400 font-bold mb-2">ADD PARTS · {componentIds.length} selected</div>
                    <div className="grid grid-cols-5 gap-2">
                      {Object.values(components).map((c) => {
                        const Icon = ProIcons[c.id];
                        const selected = componentIds.includes(c.id);
                        return (
                          <div key={c.id} className={'relative p-2 rounded-xl border text-center cursor-pointer ' + (selected ? 'bg-space-accent/30 border-space-accent' : 'bg-white/5 border-white/10')}>
                            <button onClick={(e) => { e.stopPropagation(); setInfoComponent(c.id); }} className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-space-accent/40 text-space-accent text-[8px] font-bold">i</button>
                            <div onClick={() => toggleComponent(c.id)}>
                              <div className="flex justify-center">{Icon ? <Icon size={22} className={selected ? 'text-space-accent' : 'text-gray-400'} /> : <span className="text-xl">{c.icon}</span>}</div>
                              <div className="text-[8px] text-gray-400 mt-1">{c.name.split(' ')[0]}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {validation.errors.length > 0 && (<div className="p-3 rounded-xl bg-space-danger/10 border border-space-danger/30 text-[10px] text-space-danger space-y-1">{validation.errors.map((e, i) => <div key={i}>⚠ {e}</div>)}</div>)}
                </motion.div>
              )}
              {activeTab === 'launch' && (
                <motion.div key="l" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-3">
                  <div className="text-center mb-4"><h2 className="text-xl font-bold text-space-warning">🚀 Select Launcher</h2><p className="text-xs text-gray-400">Choose a rocket for your spacecraft</p></div>
                  {rockets.map((r) => {
                    const Icon = RocketIcons[r.id];
                    const selected = rocketId === r.id;
                    return (
                      <motion.button key={r.id} whileTap={{ scale: 0.98 }} onClick={() => { playClick(); setRocketId(r.id); }} className={'w-full p-4 rounded-2xl border-2 text-left flex items-center gap-4 ' + (selected ? 'bg-space-warning/20 border-space-warning' : 'bg-white/5 border-white/10')}>
                        <div className={'w-14 h-14 rounded-xl flex items-center justify-center ' + (selected ? 'bg-space-warning/30' : 'bg-white/5')}>{Icon && <Icon size={32} className={selected ? 'text-space-warning' : 'text-gray-400'} />}</div>
                        <div className="flex-1"><div className={'text-base font-bold ' + (selected ? 'text-space-warning' : 'text-white')}>{r.name}</div><div className="text-[11px] text-gray-400">{r.maxPayload}kg · ${r.cost}M</div></div>
                        {selected && <div className="text-space-warning text-2xl">✓</div>}
                      </motion.button>
                    );
                  })}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                    <MetricBar label="Mass" value={metrics.mass} max={selectedRocket?.maxPayload || 500} unit="kg" color={metrics.mass > (selectedRocket?.maxPayload || 500) ? 'danger' : 'accent'} icon="⚖️" />
                    <MetricBar label="Budget" value={metrics.cost} max={100} unit="M$" color={metrics.cost > 100 ? 'danger' : 'warning'} icon="💰" />
                    <MetricBar label="Power" value={Math.max(metrics.power, 0)} max={500} unit="W" color={metrics.power < 0 ? 'danger' : 'success'} icon="⚡" />
                  </div>
                  <motion.button whileTap={{ scale: 0.97 }} onClick={handleLaunch} disabled={!validation.isValid} className={'w-full py-4 rounded-2xl font-bold text-lg shadow-2xl ' + (validation.isValid ? 'bg-gradient-to-r from-space-accent to-cyan-300 text-space-900' : 'bg-gray-700 text-gray-500')}>
                    {validation.isValid ? '🚀 LAUNCH MISSION' : '⚠ Fix errors first'}
                  </motion.button>
                </motion.div>
              )}
              {activeTab === 'explore' && (
                <motion.div key="e" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-3">
                  <div className="text-center mb-4"><h2 className="text-xl font-bold text-space-accent">🌌 Explore Space</h2><p className="text-xs text-gray-400">Real NASA data & 3D solar system</p></div>
                  <motion.button whileTap={{ scale: 0.98 }} onClick={() => { playClick(); setShowExplore(true); }} className="w-full p-5 rounded-2xl border-2 border-space-accent/50 bg-space-accent/10 text-left">
                    <div className="flex items-center gap-4"><div className="text-5xl">🛰️</div><div className="flex-1"><div className="text-lg font-bold text-space-accent">NASA's Eyes</div><div className="text-xs text-gray-300 mt-1">Explore planets and 170+ spacecraft in real 3D</div><div className="text-[10px] text-space-accent mt-2 font-bold">TAP TO EXPLORE →</div></div></div>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-20 backdrop-blur-xl bg-black/70 border-t border-white/10">
          <div className="max-w-2xl mx-auto grid grid-cols-4">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => { playClick(); setActiveTab(tab.id); }} className={'py-3 flex flex-col items-center gap-1 ' + (activeTab === tab.id ? 'text-space-accent' : 'text-gray-500')}>
                <span className="text-2xl">{tab.icon}</span>
                <span className="text-[10px] font-bold">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence>{showLaunch && <LaunchSequence rocket={selectedRocket} objective={objective} design={design} onComplete={finishLaunch} />}</AnimatePresence>
        <AnimatePresence>{showJourney && <SpaceJourney objective={objective} rocket={selectedRocket} onComplete={finishJourney} />}</AnimatePresence>
        <AnimatePresence>{showResult && result && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={() => setShowResult(false)}><motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()} className="bg-space-800/95 border border-white/20 rounded-3xl p-6 max-w-md w-full text-center"><div className="text-7xl mb-3">{result.status === 'SUCCESS' ? '🎉' : result.status === 'PARTIAL' ? '📊' : '❌'}</div><h2 className="text-2xl font-bold text-space-accent mb-2">{result.message}</h2><p className="text-gray-400 text-sm mb-4">Score: {result.score}</p><button onClick={() => setShowResult(false)} className="w-full py-3 bg-space-accent text-space-900 rounded-xl font-bold">PLAY AGAIN</button></motion.div></motion.div>)}</AnimatePresence>
        <AnimatePresence>{showHistory && <MissionHistory onClose={() => setShowHistory(false)} />}</AnimatePresence>
        <AnimatePresence>{showAchievements && <AchievementsPage unlockedIds={unlockedIds} onClose={() => setShowAchievements(false)} />}</AnimatePresence>
        <AnimatePresence>{showStats && <StatisticsPage onClose={() => setShowStats(false)} />}</AnimatePresence>
        <AnimatePresence>{showWelcome && <WelcomeScreen username={user.username} onStart={() => setShowWelcome(false)} />}</AnimatePresence>
        <AnimatePresence>{showExplore && <ExploreSpace onClose={() => setShowExplore(false)} />}</AnimatePresence>
        <AnimatePresence>{infoComponent && <InfoCard componentId={infoComponent} onClose={() => setInfoComponent(null)} />}</AnimatePresence>
      </div>
    </>
  );
}

export default App;
