import { objectives } from './data/objectives';

function App() {
  return (
    <div className="min-h-screen bg-space-900 text-white p-6">
      {/* Header */}
      <header className="text-center py-12">
        <h1 className="text-5xl md:text-7xl font-bold text-space-accent mb-4">
          🚀 Mission Control
        </h1>
        <p className="text-xl text-gray-300">
          Space Mission Simulator
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Choose your mission objective
        </p>
      </header>

      {/* Objectives Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {objectives.map((obj) => (
          <div
            key={obj.id}
            className="bg-space-800 border border-space-700 rounded-2xl p-6 hover:border-space-accent transition-all cursor-pointer"
          >
            <div className="text-6xl mb-4 text-center">{obj.icon}</div>
            <h2 className="text-2xl font-bold text-space-accent mb-3 text-center">
              {obj.name}
            </h2>
            <p className="text-gray-400 text-center mb-4 text-sm">
              {obj.description}
            </p>
            <div className="flex justify-between text-xs text-gray-500 border-t border-space-700 pt-4">
              <span>Difficulty: {obj.difficulty}/5</span>
              <span>Min: ${obj.minBudget}M</span>
            </div>
          </div>
        ))}
      </div>

      <footer className="text-center text-gray-600 text-xs mt-16">
        Educational simulator — v0.1.0
      </footer>
    </div>
  );
}

export default App;
