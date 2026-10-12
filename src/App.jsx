import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { objectives } from './data/objectives';
import { components } from './data/spacecraft';
import { rockets } from './data/rockets';
import { calculateMetrics, validateDesign, simulateLaunch } from './engine/simulator';
import { getCurrentUser, logout, saveMission, getMissions, deleteUser } from './utils/auth';
import { spacecraftList } from './data/spacecraftTypes';
import { calculateLevel, getUnlockedTypes, xpProgress, awardXP } from './data/levelSystem';
import { checkNewAchievements } from './data/achievements';
import Starfield from './components/Starfield';
import RealisticSpacecraft from './components/RealisticSpacecraft';
import MetricBar from './components/MetricBar';
import AuthScreen from './components/AuthScreen';
import WelcomeScreen from './components/WelcomeScreen';
import MissionCard from './components/MissionCard';
import MissionHistory from './components/MissionHistory';
import Leaderboard from './components/Leaderboard';
import AIAssistant from './components/AIAssistant';
import RandomEvent, { pickRandomEvent } from './components/RandomEvent';
import LaunchSequence from './components/LaunchSequence';
import SpaceJourney from './components/SpaceJourney';
import AchievementsPage from './components/AchievementsPage';
import AchievementToast from './components/AchievementToast';
import StatisticsPage from './components/StatisticsPage';
import InfoCard from './components/InfoCard';
import ExploreSpace from './components/ExploreSpace';
import { ProIcons, SpacecraftTypeIcons } from './components/ProIcons';
import { RocketIcons } from './components/RocketIcons';
import { playClick, playSuccess, playFailure, initAudio, startAmbientMusic, stopAmbientMusic } from './utils/sounds';

const buildStats = (missions) => ({
  totalMissions: missions.length,
  successfulMissions: missions.filter((m) => m.status === 'SUCCESS').length,
  visitedPlanets: [...new Set(missions.map((m) => m.objective))],
  usedRockets: [...new Set(missions.map((m) => m.rocket))],
  bestScience: Math.max(0, ...missions.map((m) => m.science || 0)),
  bestScore: Math.max(0, ...missions.map((m) => m.score || 0)),
  bestBudget: missions.length ? Math.min(...missions.map((m) => m.cost ?? 999)) : null,
});

const loadNumber = (key) => { try { return parseInt(localStorage.getItem(key) || '0', 10); } catch { return 0; } };
const loadList = (key) => { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; } };

function App() {
  const [user, setUser] = useState(() => getCurrentUser());

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
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [activeEvent, setActiveEvent] = useState(null);
  const [eventBonus, setEventBonus] = useState(0);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showExplore, setShowExplore] = useState(false);
  const [showLaunch, setShowLaunch] = useState(false);
  const [showJourney, setShowJourney] = useState(false);
  const [infoComponent, setInfoComponent] = useState(null);
  const [musicOn, setMusicOn] = useState(false);
  const [showExitMenu, setShowExitMenu] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const xpKey = `mc_xp_${user.username}`;
  const achKey = `mc_achievements_${user.username}`;
  const welcomeKey = `mc_welcomed_${user.username}`;

  const [xp, setXp] = useState(() => loadNumber(xpKey));
  const [unlockedIds, setUnlockedIds] = useState(() => loadList(achKey));
  const [showWelcome, setShowWelcome] = useState(() => !localStorage.getItem(welcomeKey));
  const [achievementQueue, setAchievementQueue] = useState([]);

  const design = { objectiveId, rocketId, componentIds };
  const metrics = calculateMetrics(design);
  const validation = validateDesign(metrics, design);
  const objective = objectives.find((o) => o.id === objectiveId);
  const selectedRocket = rockets.find((r) => r.id === rocketId);
  const level = calculateLevel(xp);
  const xpInfo = xpProgress(xp);

  const toggleComponent = (id) => {
    playClick();
    setComponentIds((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);
  };

  const handleLaunch = () => { initAudio(); playClick(); setEventBonus(0); setShowLaunch(true); };

  const finishLaunch = () => {
    setShowLaunch(false);
    const ev = pickRandomEvent(design);
    setTimeout(() => setActiveEvent(ev), 500);
  };

  const handleEventResolve = (outcome) => {
    setEventBonus((prev) => prev + (outcome.scienceDelta || 0));
    setActiveEvent(null);
    setTimeout(() => setShowJourney(true), 500);
  };

  const finishJourney = () => {
    const res = simulateLaunch(metrics, design, eventBonus);
    setResult(res);
    setShowJourney(false);
    setShowResult(true);

    saveMission({
      objective: objectiveId,
      rocket: rocketId,
      parts: componentIds,
      score: res.score,
      status: res.status,
      cost: metrics.cost,
      science: res.finalScience,
    });

    const gained = awardXP({ objective: objectiveId, score: res.score }, res.status);
    setXp((prev) => {
      const next = prev + gained;
      localStorage.setItem(xpKey, String(next));
      return next;
    });

    const stats = buildStats(getMissions());
    const newAchievements = checkNewAchievements(stats, unlockedIds);
    if (newAchievements.length > 0) {
      const newIds = [...unlockedIds, ...newAchievements.map((a) => a.id)];
      setUnlockedIds(newIds);
      localStorage.setItem(achKey, JSON.stringify(newIds));
      setAchievementQueue(newAchievements);
    }

    setTimeout(() => { if (res.status === 'SUCCESS') playSuccess(); else playFailure(); }, 400);
  };

  const toggleMusic = () => {
    const n = !musicOn;
    setMusicOn(n);
    initAudio();
    if (n) startAmbientMusic(); else stopAmbientMusic();
    playClick();
  };

  const closeWelcome = () => {
    localStorage.setItem(welcomeKey, '1');
    setShowWelcome(false);
  };

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
                <div className="text-xs font-bold text-space-accent">🚀 {user.username}</div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[8px] px-1.5 py-0.5 bg-space-accent/20 border border-space-accent/40 rounded text-space-accent font-bold">LVL {level}</span><span className="text-[8px] text-gray-400 ml-1">{xp} XP</span>
                  <div className="w-20 h-1.5 bg-black/40 rounded-full overflow-hidden"><div className="h-full bg-space-accent" style={{ width: xpInfo.progress + '%' }} /></div>
                </div>
              </div>
          <button onClick={() => { playClick(); setShowMenu(true); }} className="flex-shrink-0 text-lg px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-space-accent">☰</button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-24 z-10">
          <div className="max-w-2xl mx-auto px-3 py-4">
            <AnimatePresence mode="wait">
              {activeTab === 'mission' && (
                <motion.div key="m" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-3">
                  <div className="text-center mb-4"><h2 className="text-xl font-bold text-space-accent">🎯 Choose Your Mission</h2><p className="text-xs text-gray-400">Where do you want to go?</p></div>
                  {objectives.map((obj) => (
                    <MissionCard key={obj.id} objective={obj} selected={objectiveId === obj.id} onClick={() => { playClick(); setObjectiveId(obj.id); }} />
                  ))}
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
                    <div className="flex-shrink-0 text-[10px] text-gray-400 font-bold mb-2">SPACECRAFT TYPE</div>
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
                    <div className="flex-shrink-0 text-[10px] text-gray-400 font-bold mb-2">ADD PARTS · {componentIds.length} selected</div>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                      {Object.values(components).map((c) => {
                        const Icon = ProIcons[c.id];
                        const selected = componentIds.includes(c.id);
                        return (
                          <div key={c.id} className={'relative p-2 rounded-xl border-2 text-center cursor-pointer transition-all ' + (selected ? 'bg-space-accent/20 border-space-accent shadow-lg shadow-space-accent/30' : 'bg-white/5 border-white/10 hover:border-space-accent/40')}>
                  <motion.div
                    key={c.id}
                    whileHover={{ scale: 1.08, y: -3 }}
                    whileTap={{ scale: 0.92 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className={`relative p-2 rounded-xl border-2 text-center cursor-pointer transition-all ${selected ? 'bg-space-accent/20 border-space-accent shadow-[0_0_15px_rgba(34,211,238,0.6)]' : 'bg-white/5 border-white/10 hover:border-space-accent/40'}`}
                  >
                    <button onClick={(e) => { e.stopPropagation(); setInfoComponent(c.id); }} className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-space-accent/40 text-space-accent text-[8px] font-bold leading-none flex items-center justify-center">i</button>
                    <div onClick={() => toggleComponent(c.id)}>
                      <motion.div
                        animate={selected ? { scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] } : { scale: 1, rotate: 0 }}
                        transition={selected ? { duration: 0.5, ease: 'easeOut' } : {}}
                        className={`flex justify-center ${selected ? 'drop-shadow-[0_0_12px_rgba(34,211,238,1)]' : ''}`}
                      >
                        <Icon size={28} className={selected ? 'text-space-accent' : 'text-gray-400'} />
                      </motion.div>
                      <div className={`text-[9px] mt-1 font-bold leading-tight ${selected ? 'text-space-accent' : 'text-gray-400'}`}>{c.name.split(' ')[0]}</div>
                    </div>
                  </motion.div>
                  </div>
                  {validation.errors.length > 0 && (<div className="p-3 rounded-xl bg-space-danger/10 border border-space-danger/30 text-[10px] text-space-danger space-y-1">{validation.errors.map((e, i) => <div key={i}>⚠ {e}</div>)}</div>)}
                </motion.div>
              )}
                {validation.warnings.length > 0 && (
                  <div className="p-3 mt-2 rounded-xl bg-space-warning/10 border border-space-warning/30 text-[10px] text-space-warning space-y-1">
                    {validation.warnings.map((w, i) => <div key={i}>⚠️ {w}</div>)}
                  </div>
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
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.02 }}
                  animate={validation.isValid ? { boxShadow: ['0 0 0px rgba(34,211,238,0.4)', '0 0 25px rgba(34,211,238,0.9)', '0 0 0px rgba(34,211,238,0.4)'] } : {}}
                  transition={validation.isValid ? { duration: 1.8, repeat: Infinity, ease: 'easeInOut' } : {}}
                  onClick={handleLaunch}
                  disabled={!validation.isValid}
                  className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl ${validation.isValid ? 'bg-gradient-to-r from-space-accent to-cyan-300 text-space-900' : 'bg-gray-700 text-gray-500'}`}
                >
                  <motion.span
                    animate={validation.isValid ? { y: [0, -4, 0] } : {}}
                    transition={validation.isValid ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' } : {}}
                    className="inline-block"
                  >
                    {validation.isValid ? '🚀 LAUNCH MISSION' : '⚠ Fix errors first'}
                  </motion.span>
                </motion.button>
                </motion.div>
              )}
              {activeTab === 'explore' && (
                <motion.div key="e" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-3">
                  <div className="text-center mb-4"><h2 className="text-xl font-bold text-space-accent">🌌 Explore Space</h2><p className="text-xs text-gray-400">Real NASA data & 3D solar system</p></div>
                  <motion.button whileTap={{ scale: 0.98 }} onClick={() => { playClick(); setShowExplore(true); }} className="w-full p-5 rounded-2xl border-2 border-space-accent/50 bg-space-accent/10 text-left">
                    <div className="flex items-center gap-4"><div className="text-5xl">🛰️</div><div className="flex-1"><div className="text-lg font-bold text-space-accent">NASA's Eyes</div><div className="text-xs text-gray-300 mt-1">Explore planets and 170+ spacecraft in real 3D</div><div className="flex-shrink-0 text-[10px] text-space-accent mt-2 font-bold">TAP TO EXPLORE →</div></div></div>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-20 backdrop-blur-xl bg-black/70 border-t border-white/10">
          <div className="max-w-2xl mx-auto grid grid-cols-4">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileTap={{ scale: 0.85 }}
                  onClick={() => { playClick(); setActiveTab(tab.id); }}
                  className={`relative py-3 flex flex-col items-center gap-1 transition-colors ${activeTab === tab.id ? 'text-space-accent' : 'text-gray-500'}`}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="tabIndicator"
                      className="absolute top-0 w-10 h-1 bg-space-accent rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <motion.span
                    animate={activeTab === tab.id ? { scale: [1, 1.25, 1], y: [0, -3, 0] } : { scale: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className={`text-2xl ${activeTab === tab.id ? 'drop-shadow-[0_0_10px_rgba(34,211,238,0.9)]' : ''}`}
                  >
                    {tab.icon}
                  </motion.span>
                  <span className={`flex-shrink-0 text-[10px] font-bold ${activeTab === tab.id ? 'text-space-accent' : 'text-gray-500'}`}>{tab.label}</span>
                </motion.button>
              ))}
          </div>
        </div>

        <AnimatePresence>{showLaunch && <LaunchSequence rocket={selectedRocket} objective={objective} design={design} onComplete={finishLaunch} />}</AnimatePresence>
        <AnimatePresence>{activeEvent && <RandomEvent event={activeEvent} onResolve={handleEventResolve} />}</AnimatePresence>
        <AnimatePresence>{showJourney && <SpaceJourney rocketId={rocketId} rocketColor="default" objective={objective} onComplete={finishJourney} />}</AnimatePresence>
        <AnimatePresence>{showResult && result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-md z-[90] flex items-center justify-center p-4" onClick={() => setShowResult(false)}>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()} className="bg-space-800/95 border border-white/20 rounded-3xl p-6 max-w-md w-full text-center">
              <div className="text-7xl mb-3">{result.status === 'SUCCESS' ? '🎉' : result.status === 'PARTIAL' ? '📊' : '❌'}</div>
              <h2 className="text-2xl font-bold text-space-accent mb-2">{result.message}</h2>
              <p className="text-gray-400 text-sm mb-4">Score: {result.score}</p>
              <div className="bg-white/5 rounded-xl p-3 text-left text-xs space-y-1 mb-4">
                {result.details?.map((d, i) => <div key={i} className="text-gray-300">• {d}</div>)}
              </div>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => setShowResult(false)} className="flex-1 py-3 bg-space-accent/20 border border-space-accent/40 text-space-accent rounded-xl font-bold text-sm">🔄 AGAIN</button>
                  <button onClick={() => { setShowResult(false); setActiveTab('mission'); }} className="flex-1 py-3 bg-gradient-to-r from-space-accent to-cyan-400 text-space-900 rounded-xl font-bold text-sm">🎯 NEW MISSION</button>
                </div>
            </motion.div>
          </motion.div>
        )}</AnimatePresence>
        <AnimatePresence>{showHistory && <MissionHistory onClose={() => setShowHistory(false)} />}</AnimatePresence>
        <AnimatePresence>{showLeaderboard && <Leaderboard onClose={() => setShowLeaderboard(false)} currentUser={user.username} />}</AnimatePresence>
        <AnimatePresence>{showAI && <AIAssistant design={design} onClose={() => setShowAI(false)} />}</AnimatePresence>
        <AnimatePresence>{showAchievements && <AchievementsPage unlockedIds={unlockedIds} onClose={() => setShowAchievements(false)} />}</AnimatePresence>
        <AnimatePresence>{showStats && <StatisticsPage onClose={() => setShowStats(false)} />}</AnimatePresence>
        <AnimatePresence>{showExplore && <ExploreSpace onClose={() => setShowExplore(false)} />}</AnimatePresence>
        <AnimatePresence>{infoComponent && <InfoCard componentId={infoComponent} onClose={() => setInfoComponent(null)} />}</AnimatePresence>
        <AnimatePresence>{showWelcome && <WelcomeScreen username={user.username} onStart={closeWelcome} />}</AnimatePresence>
        <AnimatePresence>{achievementQueue.length > 0 && (
          <AchievementToast key={achievementQueue[0].id} achievement={achievementQueue[0]} onClose={() => setAchievementQueue((q) => q.slice(1))} />
        )}</AnimatePresence>
        {showMenu && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-end p-4" onClick={() => setShowMenu(false)}>
            <div className="bg-space-900/95 border border-white/20 rounded-2xl p-2 mt-16 w-56 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => { setShowMenu(false); setShowStats(true); }} className="w-full text-left px-4 py-3 text-sm text-space-accent hover:bg-white/5 rounded-lg flex items-center gap-3">📊 Stats</button>
              <button onClick={() => { setShowMenu(false); setShowAchievements(true); }} className="w-full text-left px-4 py-3 text-sm text-space-warning hover:bg-white/5 rounded-lg flex items-center gap-3">🏆 Achievements</button>
              <button onClick={() => { setShowMenu(false); setShowLeaderboard(true); }} className="w-full text-left px-4 py-3 text-sm text-space-warning hover:bg-white/5 rounded-lg flex items-center gap-3">🥇 Leaderboard</button>
              <button onClick={() => { setShowMenu(false); setShowAI(true); }} className="w-full text-left px-4 py-3 text-sm text-space-accent hover:bg-white/5 rounded-lg flex items-center gap-3">🤖 AI Assistant</button>
              <button onClick={() => { setShowMenu(false); setShowHistory(true); }} className="w-full text-left px-4 py-3 text-sm text-space-accent hover:bg-white/5 rounded-lg flex items-center gap-3">📜 History</button>
              <div className="border-t border-white/10 my-1"></div>
              <button onClick={() => { setShowMenu(false); setShowExitMenu(true); }} className="w-full text-left px-4 py-3 text-sm text-gray-400 hover:bg-white/5 rounded-lg flex items-center gap-3">🚪 Exit</button>
            </div>
          </div>
        )}
        {showExitMenu && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => { setShowExitMenu(false); setConfirmDelete(false); }}>
            <div className="bg-space-900/95 border border-white/20 rounded-2xl p-5 max-w-xs w-full" onClick={(e) => e.stopPropagation()}>
              {!confirmDelete ? (
                <>
                  <h3 className="text-lg font-bold text-space-accent text-center mb-4">Exit Options</h3>
                  <button onClick={() => { setShowExitMenu(false); onLogout(); }} className="w-full py-3 mb-2 bg-space-accent/20 border border-space-accent/40 text-space-accent rounded-xl font-bold text-sm">🚪 Logout</button>
                  <button onClick={() => setConfirmDelete(true)} className="w-full py-3 mb-2 bg-space-danger/20 border border-space-danger/40 text-space-danger rounded-xl font-bold text-sm">🗑️ Delete Account</button>
                  <button onClick={() => setShowExitMenu(false)} className="w-full py-2 text-gray-400 text-xs">Cancel</button>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-bold text-space-danger text-center mb-3">⚠️ Are you sure?</h3>
                  <p className="text-xs text-gray-400 text-center mb-4">This will permanently delete your account and all missions. Cannot be undone.</p>
                  <button onClick={() => { deleteUser(); onLogout(); }} className="w-full py-3 mb-2 bg-space-danger text-white rounded-xl font-bold text-sm">Yes, Delete Everything</button>
                  <button onClick={() => setConfirmDelete(false)} className="w-full py-2 text-gray-400 text-xs">Cancel</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
