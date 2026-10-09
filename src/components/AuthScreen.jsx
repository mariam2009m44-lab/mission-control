import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { register, login } from '../utils/auth';

export default function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const fn = mode === 'login' ? login : register;
      const result = fn(username.trim(), password);

      if (!result.success) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      onAuth(result.user);
    }, 400);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="text-7xl mb-4"
          >
            🚀
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-space-accent via-cyan-300 to-space-accent bg-clip-text text-transparent">
            Mission Control
          </h1>
          <p className="text-gray-400 text-sm mt-2">Space Mission Simulator</p>
        </div>

        {/* Card */}
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl">
          {/* Tabs */}
          <div className="flex mb-6 bg-black/30 rounded-xl p-1">
            {['login', 'register'].map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setError('');
                }}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                  mode === m
                    ? 'bg-space-accent text-space-900'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {m === 'login' ? 'Login' : 'Register'}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">
                Commander Name
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your name"
                autoComplete="username"
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:border-space-accent focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:border-space-accent focus:outline-none transition-all"
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-space-danger bg-space-danger/10 border border-space-danger/30 rounded-lg p-3"
                >
                  ⚠ {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-space-accent to-cyan-400 text-space-900 rounded-xl font-bold shadow-lg shadow-space-accent/30 disabled:opacity-50"
            >
              {isLoading
                ? '⏳ Please wait...'
                : mode === 'login'
                ? '🚀 Login'
                : '✨ Create Account'}
            </motion.button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-6">
            {mode === 'login'
              ? "New commander? Switch to Register tab"
              : "Already have an account? Switch to Login tab"}
          </p>
        </div>

        <p className="text-center text-[10px] text-gray-600 mt-6">
          Educational simulator — v1.0.0
        </p>
      </motion.div>
    </div>
  );
}
