import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function NasaDaily({ onClose }) {
  const [apod, setApod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to fetch');
        return r.json();
      })
      .then((data) => {
        setApod(data);
        setLoading(false);
      })
      .catch((e) => {
        setError('Could not load NASA data. Please check your connection.');
        setLoading(false);
      });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-[95] flex flex-col overflow-y-auto"
      onClick={onClose}
    >
      <div className="min-h-screen flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="backdrop-blur-md bg-black/60 border-b border-white/10 px-3 py-2 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛰️</span>
            <div>
              <div className="text-xs font-bold text-white">NASA APOD</div>
              <div className="text-[9px] text-gray-400">Astronomy Picture of the Day</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-xs px-3 py-1 bg-space-danger/20 border border-space-danger/50 text-space-danger rounded-lg"
          >
            ✕ Close
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 max-w-2xl mx-auto w-full">

          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="text-5xl mb-4"
              >
                🌌
              </motion.div>
              <p className="text-sm text-gray-300">Loading NASA data...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">📡</div>
              <p className="text-sm text-space-danger">{error}</p>
              <p className="text-xs text-gray-500 mt-2">
                Try again later or check your internet
              </p>
            </div>
          )}

          {apod && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Title + Date */}
              <div>
                <div className="text-[10px] text-space-accent font-bold tracking-widest mb-1">
                  📅 {apod.date}
                </div>
                <h1 className="text-xl md:text-2xl font-bold text-white">
                  {apod.title}
                </h1>
              </div>

              {/* Image / Video */}
              <div className="rounded-2xl overflow-hidden border border-white/10">
                {apod.media_type === 'image' ? (
                  <img
                    src={apod.url}
                    alt={apod.title}
                    className="w-full h-auto"
                    loading="lazy"
                  />
                ) : (
                  <iframe
                    src={apod.url}
                    title={apod.title}
                    className="w-full aspect-video"
                    allow="fullscreen"
                  />
                )}
              </div>

              {/* Copyright */}
              {apod.copyright && (
                <div className="text-[10px] text-gray-500 text-center">
                  © {apod.copyright}
                </div>
              )}

              {/* Explanation */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <button
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <span className="text-xs font-bold text-space-accent">
                    📖 About this image
                  </span>
                  <span className="text-space-accent text-lg">
                    {showExplanation ? '−' : '+'}
                  </span>
                </button>
                <AnimatePresence>
                  {showExplanation && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="text-xs text-gray-300 leading-relaxed mt-3">
                        {apod.explanation}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Real NASA badge */}
              <div className="text-center py-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-space-accent/10 border border-space-accent/30 rounded-full">
                  <span className="text-xs">🚀</span>
                  <span className="text-[10px] text-space-accent font-bold">
                    Data from NASA Open API
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
