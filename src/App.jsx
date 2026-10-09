import { useState } from 'react';
import { objectives } from './data/objectives';
import { components } from './data/spacecraft';
import { rockets } from './data/rockets';
import { calculateMetrics, validateDesign, simulateLaunch } from './engine/simulator';

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
    <div className="min-h-screen bg-space-900 text-white p-4">
      <header className="text-center py-6">
        <h1 className="text-3xl md:text-5xl font-bold text-space-accent">
          🚀 Mission Control
        </h1>
        <p className="text-xs text-gray-500 mt-2">Step {step} of 4</p>
      </header>

      {step === 1 && (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl text-center mb-6">Choose your mission objective</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {objectives.map((obj) => (
              <div
                key={obj.id}
                onClick={() => {
                  setObjectiveId(obj.id);
                  setStep(2);
                }}
                className="bg-space-800 border border-space-700 rounded-2xl p-6 hover:border-space-accent transition-all cursor-pointer"
              >
                <div className="text-5xl mb-3 text-center">{obj.icon}</div>
                <h3 className="text-lg font-bold text-space-accent text-center">{obj.name}</h3>
                <p className="text-xs text-gray-400 text-center mt-2">{obj.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl text-center mb-2">Design your spacecraft</h2>
          <p className="text-xs text-center text-gray-500 mb-6">
            Objective: {objective?.icon} {objective?.name}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.values(components).map((c) => {
              const selected = componentIds.includes(c.id);
              return (
                <div
                  key={c.id}
                  onClick={() => toggleComponent(c.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selected
                      ? 'bg-space-accent/20 border-space-accent'
                      : 'bg-space-800 border-space-700 hover:border-space-accent'
                  }`}
                >
                  <div className="text-3xl text-center">{c.icon}</div>
                  <div className="text-xs font-bold text-center mt-2">{c.name}</div>
                  <div className="text-[10px] text-gray-500 text-center mt-1">
                    {c.mass}kg · ${c.cost}M
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-6">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 bg-space-800 rounded-lg text-sm"
            >
              ← Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={componentIds.length === 0}
              className="px-4 py-2 bg-space-accent text-space-900 rounded-lg text-sm font-bold disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl text-center mb-6">Select your launch vehicle</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {rockets.map((r) => (
              <div
                key={r.id}
                onClick={() => setRocketId(r.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  rocketId === r.id
                    ? 'bg-space-accent/20 border-space-accent'
                    : 'bg-space-800 border-space-700 hover:border-space-accent'
                }`}
              >
                <div className="text-5xl text-center">{r.icon}</div>
                <h3 className="text-lg font-bold text-center mt-2">{r.name}</h3>
                <p className="text-xs text-gray-400 text-center mt-1">{r.description}</p>
                <div className="text-xs text-gray-500 text-center mt-2">
                  Max: {r.maxPayload}kg · ${r.cost}M
                </div>
              </div>
            ))}
          </div>

          <div className="bg-space-800 border border-space-700 rounded-2xl p-4 mb-4">
            <h3 className="text-sm font-bold text-space-accent mb-3">📊 Live Metrics</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>Mass: <span className="text-space-accent">{metrics.mass}kg</span></div>
              <div>Cost: <span className="text-space-warning">${metrics.cost}M</span></div>
              <div>Power: <span className={metrics.power >= 0 ? 'text-space-success' : 'text-space-danger'}>{metrics.power}W</span></div>
              <div>Science: <span className="text-space-accent">{metrics.science}</span></div>
            </div>
            {validation.errors.length > 0 && (
              <div className="mt-3 text-xs text-space-danger">
                {validation.errors.map((e, i) => <div key={i}>⚠ {e}</div>)}
              </div>
            )}
            {validation.warnings.length > 0 && (
              <div className="mt-2 text-xs text-space-warning">
                {validation.warnings.map((w, i) => <div key={i}>! {w}</div>)}
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 bg-space-800 rounded-lg text-sm"
            >
              ← Back
            </button>
            <button
              onClick={handleLaunch}
              disabled={!rocketId || !validation.isValid}
              className="px-6 py-3 bg-space-accent text-space-900 rounded-lg font-bold disabled:opacity-50"
            >
              🚀 LAUNCH MISSION
            </button>
          </div>
        </div>
      )}

      {step === 4 && result && (
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-7xl mb-4">
            {result.status === 'SUCCESS' ? '🎉' : result.status === 'PARTIAL' ? '📊' : '❌'}
          </div>
          <h2 className="text-3xl font-bold text-space-accent mb-2">{result.message}</h2>
          <p className="text-lg text-gray-300 mb-6">Score: {result.score}</p>
          <div className="bg-space-800 border border-space-700 rounded-2xl p-4 text-left text-sm">
            {result.details.map((d, i) => <div key={i} className="py-1">• {d}</div>)}
          </div>
          <button
            onClick={resetMission}
            className="mt-6 px-6 py-3 bg-space-accent text-space-900 rounded-lg font-bold"
          >
            🔄 Try Again
          </button>
        </div>
      )}

      <footer className="text-center text-gray-600 text-xs mt-8">
        Educational simulator — v0.2.0
      </footer>
    </div>
  );
}

export default App;
