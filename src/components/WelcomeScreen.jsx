import { motion } from 'framer-motion';
import { useState } from 'react';

export default function WelcomeScreen({ username, onStart }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: '🎯',
      title: 'Pick Your Mission',
      description: 'Choose where to go: the Moon, Mars, or Earth orbit.',
      color: '#00d4ff',
    },
    {
      icon: '🛰️',
      title: 'Build Your Spacecraft',
      description: 'Add instruments, power sources, and antennas. Watch mass, budget, and power.',
      color: '#00ff88',
    },
    {
      icon: '🚀',
      title: 'Select Launcher & Launch',
      description: 'Pick a rocket that can carry your spacecraft. Then launch!',
      color: '#ffb800',
    },
    {
      icon: '🌌',
      title: 'Explore & Learn',
      description: 'Travel through space, visit planets, and discover real NASA data.',
      color: '#ff6b9d',
    },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onStart();
    }
  };

  const handleSkip = () => {
    onStart();
  };

  const current = steps[step];
  const isLast = step === steps.length - 1;
  const progress = ((step + 1) / steps.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      style={{
        background: 'radial-gradient(ellipse at center, #0a1230 0%, #04060f 60%, #000 100%)',
      }}
    >
      <div className="w-full max-w-md">

        {/* Welcome header */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          <motion.div
            animate={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
            className="text-6xl mb-2"
          >
            🚀
          </motion.div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-space-accent to-cyan-300 bg-clip-text text-transparent">
            Welcome, Commander {username}!
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Let's learn how to design your mission
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          className="backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-6 mb-4"
        >
          {/* Progress bar */}
          <div className="flex gap-1 mb-5">
            {steps.map((_, i) => (
              <div
                key={i}
                className="flex-1 h-1 rounded-full transition-all duration-500"
                style={{
                  background: i <= step ? current.color : 'rgba(255,255,255,0.15)',
                }}
              />
            ))}
          </div>

          {/* Step counter */}
          <div className="text-[10px] font-bold tracking-widest mb-3" style={{ color: current.color }}>
            STEP {step + 1} OF {steps.length}
          </div>

          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            className="text-7xl text-center mb-4"
          >
            {current.icon}
          </motion.div>

          {/* Title */}
          <h2 className="text-xl font-bold text-white text-center mb-2">
            {current.title}
          </h2>

          {/* Description */}
          <p className="text-sm text-gray-300 text-center leading-relaxed">
            {current.description}
          </p>

          {/* Visual hint */}
          <div className="mt-5 flex justify-center">
            <div
              className="px-4 py-2 rounded-full text-[10px] font-bold"
              style={{
                background: `${current.color}20`,
                color: current.color,
                border: `1px solid ${current.color}40`,
              }}
            >
              {step === 0 && '🎯 Start here'}
              {step === 1 && '🛰️ Watch your budget'}
              {step === 2 && '🚀 Match the weight'}
              {step === 3 && '🌌 Enjoy the journey'}
            </div>
          </div>
        </motion.div>

        {/* Buttons */}
        <div className="flex gap-2">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-3 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl text-sm text-gray-300 hover:bg-white/10"
            >
              ← Back
            </button>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            className="flex-1 py-3 rounded-xl font-bold text-sm shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${current.color}, ${current.color}aa)`,
              color: '#0a0e1a',
              boxShadow: `0 8px 30px ${current.color}50`,
            }}
          >
            {isLast ? "🚀 Let's Go!" : 'Next →'}
          </motion.button>
        </div>

        {/* Skip */}
        <button
          onClick={handleSkip}
          className="w-full mt-3 text-xs text-gray-500 hover:text-gray-300 underline"
        >
          Skip tutorial
        </button>

      </div>
    </motion.div>
  );
}
