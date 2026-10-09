import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { objectives } from './data/objectives';
import { components } from './data/spacecraft';
import { rockets } from './data/rockets';
import { calculateMetrics, validateDesign, simulateLaunch } from './engine/simulator';
import Starfield from './components/Starfield';
import MetricBar from './components/MetricBar';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

function App() {
  const [step, setStep] = useState(1);
  const [objectiveId, setObjectiveId] = useState(null);
  const [rocketId, setRocketId] = useState(null);
  const [componentIds, setComponentIds] = useState([]);
  const [result, setResult] = useState(null);

  const design = { objectiveId, rocketId, componentIds };
  const metrics = calculateMetrics(design);
  const validation = validateDesign(metrics, design);
  const objective = objectives.find((o) => o.id === objectiveId);

  const toggleComponent = (id) => {
    setComponentIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleLaunch = () => {
    const res = simulateLaunch(metrics, design);
    setResult(res);
    setStep(4);
  };

  const resetMission = () => {
    setStep(1);
    setObjectiveId(null);
    setRocketId(null);
    setComponentIds([]);
    setResult(null);
  };

  return (
    <>
      <Starfield />
      <div className="min-h-screen text-white p-4 relative">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-6"
        >
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-space-accent via-cyan-300 to-space-accent bg-clip-text text-transparent">
            🚀 Mission Control
          </h1>
          <div className="flex items-center justify-center gap-2 mt-4 max-w-xs mx-auto">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                  s <= step ? 'bg-space-accent' : 'bg-space-700'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">Step {step} of 4</p>
        </motion.header>

        <AnimatePresence mode="wait">
          {/* STEP 1 */}
          {step === 1 && (
            <motion.div
              key="step1"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-xl text-center mb-6 text-gray-300">
                Choose your mission objective
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {objectives.map((obj) => (
                  <motion.div
                    key={obj.id}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setObjectiveId(obj.id);
                      setStep(2);
                    }}
                    className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-space-accent hover:bg-white/10 transition-all cursor-pointer shadow-xl"
                  >
                    <div className="text-5xl mb-3 text-center">{obj.icon}</div>
                    <h3 className="text-lg font-bold text-space-accent text-center">
                      {obj.name}
                    </h3>
                    <p className="text-xs text-gray-400 text-center mt-2">
                      {obj.description}
                    </p>
                    <div className="flex justify-between text-[10px] text-gray-500 border-t border-white/10 pt-3 mt-3">
                      <span>Diff: {obj.difficulty}/5</span>
                      <span>Min: ${obj.minBudget}M</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <motion.div
              key="step2"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-xl text-center mb-2 text-gray-300">
                Design your spacecraft
              </h2>
              <p className="text-xs text-center text-space-accent mb-6">
                {objective?.icon} {objective?.name}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.values(components).map((c) => {
                  const selected = componentIds.includes(c.id);
                  return (
                    <motion.div
                      key={c.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => toggleComponent(c.id)}
                      className={`p-3 rounded-xl border cursor-pointer backdrop-blur-md transition-all ${
                        selected
                          ? 'bg-space-accent/20 border-space-accent shadow-lg shadow-space-accent/20'
                          : 'bg-white/5 border-white/10 hover:border-space-accent'
                      }`}
                    >
                      <div className="text-3xl text-center">{c.icon}</div>
                      <div className="text-xs font-bold text-center mt-2">
                        {c.name}
                      </div>
                      <div className="text-[10px] text-gray-500 text-center mt-1">
                        {c.mass}kg · ${c.cost}M
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 backdrop-blur-md bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={componentIds.length === 0}
                  className="px-6 py-2 bg-space-accent text-space-900 rounded-lg text-sm font-bold disabled:opacity-50 hover:bg-cyan-300 transition"
                >
                  Next →
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <motion.div
              key="step3"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-xl text-center mb-6 text-gray-300">
                Select your launch vehicle
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {rockets.map((r) => (
                  <motion.div
                    key={r.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setRocketId(r.id)}
                    className={`p-4 rounded-2xl border cursor-pointer backdrop-blur-md transition-all ${
                      rocketId === r.id
                        ? 'bg-space-accent/20 border-space-accent shadow-lg shadow-space-accent/20'
                        : 'bg-white/5 border-white/10 hover:border-space-accent'
                    }`}
                  >
                    <div className="text-5xl text-center">{r.icon}</div>
                    <h3 className="text-lg font-bold text-center mt-2">{r.name}</h3>
                    <p className="text-xs text-gray-400 text-center mt-1">
                      {r.description}
                    </p>
                    <div className="text-xs text-gray-500 text-center mt-2">
                      Max: {r.maxPayload}kg · ${r.cost}M
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Live Metrics */}
              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-5 mb-4">
                <h3 className="text-sm font-bold text-space-accent mb-4">
                  📊 Live Metrics
                </h3>
                <div className="space-y-3">
                  <MetricBar
                    label="Mass"
                    value={metrics.mass}
                    max={500}
                    unit="kg"
                    color="accent"
                    icon="⚖️"
                  />
                  <MetricBar
                    label="Budget"
                    value={metrics.cost}
                    max={100}
                    unit="M$"
                    color={metrics.cost > 100 ? 'danger' : 'warning'}
                    icon="💰"
                  />
                  <MetricBar
                    label="Power"
                    value={Math.max(metrics.power, 0)}
                    max={500}
                    unit="W"
                    color={metrics.power < 0 ? 'danger' : 'success'}
                    icon="⚡"
                  />
                  <MetricBar
                    label="Science"
                    value={metrics.science}
                    max={100}
                    unit=""
                    color="accent"
                    icon="🔬"
                  />
                </div>

                {validation.errors.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 rounded-lg bg-space-danger/10 border border-space-danger/30 text-xs text-space-danger"
                  >
                    {validation.errors.map((e, i) => (
                      <div key={i}>⚠ {e}</div>
                    ))}
                  </motion.div>
                )}

                {validation.warnings.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 p-3 rounded-lg bg-space-warning/10 border border-space-warning/30 text-xs text-space-warning"
                  >
                    {validation.warnings.map((w, i) => (
                      <div key={i}>! {w}</div>
                    ))}
                  </motion.div>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 backdrop-blur-md bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10"
                >
                  ← Back
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLaunch}
                  disabled={!rocketId}
                  className="px-6 py-3 bg-gradient-to-r from-space-accent to-cyan-400 text-space-900 rounded-lg font-bold disabled:opacity-50 shadow-lg shadow-space-accent/30"
                >
                  🚀 LAUNCH MISSION
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* STEP 4 */}
          {step === 4 && result && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="max-w-2xl mx-auto text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="text-7xl mb-4"
              >
                {result.status === 'SUCCESS'
                  ? '🎉'
                  : result.status === 'PARTIAL'
                  ? '📊'
                  : '❌'}
              </motion.div>
              <h2 className="text-3xl font-bold text-space-accent mb-2">
                {result.message}
              </h2>
              <p className="text-lg text-gray-300 mb-6">Score: {result.score}</p>

              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-5 text-left text-sm mb-6">
                <h3 className="text-space-accent font-bold mb-3">📋 Mission Report</h3>
                {result.details.map((d, i) => (
                  <div key={i} className="py-1 text-gray-300">
                    • {d}
                  </div>
                ))}
                {result.warnings && result.warnings.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/10 text-space-warning text-xs">
                    {result.warnings.map((w, i) => (
                      <div key={i}>⚠ {w}</div>
                    ))}
                  </div>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetMission}
                className="px-6 py-3 bg-gradient-to-r from-space-accent to-cyan-400 text-space-900 rounded-lg font-bold shadow-lg shadow-space-accent/30"
              >
                🔄 Try Again
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="text-center text-gray-600 text-xs mt-12 pb-4">
          Educational simulator — v0.3.0
        </footer>
      </div>
    </>
  );
}

export default App;
