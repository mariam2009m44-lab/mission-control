import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { playClick, playSuccess, playFailure } from '../utils/sounds';

export default function RandomEvent({ event, onResolve }) {
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [resolved, setResolved] = useState(false);
  const [outcome, setOutcome] = useState(null);
  const [timer, setTimer] = useState(8);

  useEffect(() => {
    if (resolved) return;
    if (timer <= 0) {
      // Auto-fail if time runs out
      const defaultChoice = event.choices.find((c) => c.isDefault) || event.choices[0];
      handleChoice(defaultChoice);
      return;
    }
    const t = setTimeout(() => setTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timer, resolved]);

  const handleChoice = (choice) => {
    if (resolved) return;
    setSelectedChoice(choice);
    setResolved(true);
    setOutcome(choice.outcome);
    if (choice.outcome.type === 'success') playSuccess();
    else playFailure();

    setTimeout(() => {
      onResolve(choice.outcome);
    }, 2500);
  };

  const urgencyColor =
    timer > 5 ? 'from-cyan-500 to-blue-500' :
    timer > 3 ? 'from-yellow-500 to-orange-500' :
    'from-red-500 to-orange-600';

  return (
    <motion.div
      initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
      animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-xl flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.7, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 20 }}
        className="bg-space-800/95 border-2 border-white/20 rounded-3xl p-5 max-w-md w-full shadow-2xl"
      >
        {/* Alert header */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className={`text-center mb-4 p-3 rounded-2xl bg-gradient-to-r ${urgencyColor} bg-opacity-20 border border-white/30`}
        >
          <div className="text-[10px] font-bold text-white/90 tracking-widest mb-1">
            ⚠️ MISSION EVENT ⚠️
          </div>
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 0.5 }}
            className="text-6xl mb-2"
          >
            {event.icon}
          </motion.div>
          <h2 className="text-xl font-bold text-white">{event.title}</h2>
          <p className="text-[11px] text-white/90 mt-2">{event.description}</p>
        </motion.div>

        {/* Timer bar */}
        {!resolved && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-gray-400 font-bold">TIME REMAINING</span>
              <span className={`text-sm font-bold ${timer <= 3 ? 'text-red-400' : 'text-yellow-400'}`}>
                {timer}s
              </span>
            </div>
            <div className="h-2 bg-black/40 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: `${(timer / 8) * 100}%` }}
                transition={{ duration: 0.9, ease: 'linear' }}
                className={`h-full bg-gradient-to-r ${urgencyColor}`}
              />
            </div>
          </div>
        )}

        {/* Choices */}
        {!resolved && (
          <div className="space-y-2">
            <div className="text-[10px] text-gray-400 font-bold mb-2">
              🎯 CHOOSE YOUR ACTION:
            </div>
            {event.choices.map((choice, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  playClick();
                  handleChoice(choice);
                }}
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 hover:border-space-accent hover:bg-space-accent/10 text-left transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl flex-shrink-0">{choice.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white">{choice.label}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{choice.description}</div>
                  </div>
                  <div className="text-xs text-space-accent flex-shrink-0">→</div>
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {/* Outcome */}
        {resolved && outcome && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-4 rounded-2xl text-center border-2 ${
              outcome.type === 'success'
                ? 'bg-green-500/20 border-green-400/60'
                : 'bg-red-500/20 border-red-400/60'
            }`}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="text-6xl mb-2"
            >
              {outcome.type === 'success' ? '✅' : '⚠️'}
            </motion.div>
            <div
              className={`text-sm font-bold ${
                outcome.type === 'success' ? 'text-green-300' : 'text-red-300'
              }`}
            >
              {outcome.title}
            </div>
            <div className="text-[11px] text-gray-300 mt-1">{outcome.message}</div>
            {outcome.impact && (
              <div className="mt-2 text-[10px] font-mono text-white/80">
                {outcome.impact}
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ========== EVENT DEFINITIONS ==========
export const RANDOM_EVENTS = [
  {
    id: 'solar_flare',
    icon: '☀️',
    title: 'Solar Flare Incoming!',
    description: 'Massive solar radiation heading towards your spacecraft.',
    choices: [
      {
        icon: '🛡️',
        label: 'Deploy Heat Shield',
        description: 'Use protective systems to absorb radiation',
        outcome: {
          type: 'success',
          title: 'Shield Held!',
          message: 'Your heat shield absorbed the radiation safely.',
          impact: '+10 Science Points',
          scienceDelta: 10,
        },
      },
      {
        icon: '🚀',
        label: 'Speed Through It',
        description: 'Try to outrun the solar flare',
        outcome: {
          type: 'failure',
          title: 'Instruments Damaged!',
          message: 'Radiation caused permanent damage to some systems.',
          impact: '-20 Science Points',
          scienceDelta: -20,
        },
      },
    ],
  },
  {
    id: 'fuel_leak',
    icon: '💧',
    title: 'Fuel Leak Detected!',
    description: 'Small leak in your propulsion system.',
    choices: [
      {
        icon: '🔧',
        label: 'Emergency Repair',
        description: 'Send astronaut to fix the leak',
        outcome: {
          type: 'success',
          title: 'Leak Sealed!',
          message: 'Quick thinking saved the mission.',
          impact: 'No penalty',
          scienceDelta: 0,
        },
      },
      {
        icon: '⏭️',
        label: 'Continue Mission',
        description: 'Ignore the leak and press on',
        outcome: {
          type: 'failure',
          title: 'Fuel Lost!',
          message: 'Significant fuel wasted. Trajectory affected.',
          impact: '-15 Score Points',
          scienceDelta: -10,
        },
      },
    ],
  },
  {
    id: 'signal_loss',
    icon: '📡',
    title: 'Communication Lost!',
    description: 'Earth cannot reach your spacecraft.',
    choices: [
      {
        icon: '📡',
        label: 'Reroute to Backup Antenna',
        description: 'Switch to secondary communication system',
        outcome: {
          type: 'success',
          title: 'Signal Restored!',
          message: 'Backup antenna re-established communication.',
          impact: '+10 Communication',
          scienceDelta: 0,
        },
      },
      {
        icon: '🤐',
        label: 'Continue Autonomously',
        description: 'Let AI handle the mission',
        outcome: {
          type: 'failure',
          title: 'Isolated Mission',
          message: 'No communication for hours. Data lost.',
          impact: '-15 Score Points',
          scienceDelta: -15,
        },
      },
    ],
  },
  {
    id: 'data_bonus',
    icon: '💎',
    title: 'Unexpected Discovery!',
    description: 'Your instruments detected something extraordinary!',
    choices: [
      {
        icon: '🔬',
        label: 'Analyze the Data',
        description: 'Spend time investigating the anomaly',
        outcome: {
          type: 'success',
          title: 'Major Discovery!',
          message: 'Scientists are thrilled with your findings.',
          impact: '+25 Science Points',
          scienceDelta: 25,
        },
      },
      {
        icon: '⏩',
        label: 'Skip and Continue',
        description: 'Focus on the primary mission',
        outcome: {
          type: 'success',
          title: 'Mission Focused',
          message: 'Stayed on course, but missed potential data.',
          impact: '+0 Science Points',
          scienceDelta: 0,
        },
      },
    ],
  },
  {
    id: 'meteor',
    icon: '☄️',
    title: 'Meteor Shower!',
    description: 'Small meteors approaching your spacecraft!',
    choices: [
      {
        icon: '🛡️',
        label: 'Take Defensive Position',
        description: 'Use heat shield for protection',
        outcome: {
          type: 'success',
          title: 'Protected!',
          message: 'Shield deflected all meteors.',
          impact: 'Safe',
          scienceDelta: 0,
        },
      },
      {
        icon: '🎯',
        label: 'Collect Samples',
        description: 'Try to capture meteor material',
        outcome: {
          type: 'failure',
          title: 'Hit by Meteor!',
          message: 'Hull damage from small meteorite.',
          impact: '-15 Score Points',
          scienceDelta: -10,
        },
      },
    ],
  },
  {
    id: 'power_surge',
    icon: '⚡',
    title: 'Power Surge Detected!',
    description: 'Solar panels generating extra power.',
    choices: [
      {
        icon: '🔋',
        label: 'Store in Batteries',
        description: 'Save the extra power for later',
        outcome: {
          type: 'success',
          title: 'Power Stored!',
          message: 'Extra energy secured for future needs.',
          impact: '+15 Science Points',
          scienceDelta: 15,
        },
      },
      {
        icon: '🚫',
        label: 'Vent Excess Power',
        description: 'Release to prevent overload',
        outcome: {
          type: 'success',
          title: 'Safe Venting',
          message: 'Power safely released. No damage.',
          impact: 'No bonus',
          scienceDelta: 0,
        },
      },
    ],
  },
];

export const pickRandomEvent = (design) => {
  // Filter events based on available components
  const has = (id) => design.componentIds?.includes(id);
  let pool = [...RANDOM_EVENTS];

  // Boost specific events based on components
  const solarBoosted = has('heat_shield') ? RANDOM_EVENTS.filter(e => e.id === 'solar_flare') : [];
  const propBoosted = has('propulsion') ? RANDOM_EVENTS.filter(e => e.id === 'fuel_leak') : [];
  const antennaBoosted = has('high_gain_antenna') || has('medium_gain_antenna')
    ? RANDOM_EVENTS.filter(e => e.id === 'signal_loss')
    : [];

  pool = [...pool, ...solarBoosted, ...propBoosted, ...antennaBoosted];

  return pool[Math.floor(Math.random() * pool.length)];
};
