import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { components } from '../data/spacecraft';
import { rockets } from '../data/rockets';
import { objectives } from '../data/objectives';
import { calculateMetrics, validateDesign } from '../engine/simulator';
import { playClick, playSuccess } from '../utils/sounds';

export default function AIAssistant({ design, onClose, onApplySuggestion }) {
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(true);

  const metrics = calculateMetrics(design);
  const validation = validateDesign(metrics, design);
  const objective = objectives.find((o) => o.id === design.objectiveId);
  const rocket = rockets.find((r) => r.id === design.rocketId);
  const componentIds = design.componentIds || [];

  useEffect(() => {
    setIsThinking(true);
    const timer = setTimeout(() => {
      const analysis = analyzeDesign();
      setMessages(analysis);
      setIsThinking(false);
    }, 1200);
    return () => clearTimeout(timer);
    // eslint-disable-next-line
  }, []);

  const analyzeDesign = () => {
    const msgs = [];

    // Greeting
    msgs.push({
      type: 'greeting',
      icon: '🤖',
      title: 'Design Analysis Complete',
      text: `Analyzing your ${objective?.name || 'mission'} design...`,
    });

    // === CRITICAL ISSUES ===
    if (metrics.cost > 100) {
      msgs.push({
        type: 'error',
        icon: '💰',
        title: 'Budget Exceeded',
        text: `Your design costs $${metrics.cost}M but budget is $100M. Remove ${Math.ceil((metrics.cost - 100) / 15)} components or use a lighter rocket.`,
        fix: 'Remove 2-3 non-essential components',
      });
    }

    if (metrics.power < 0) {
      msgs.push({
        type: 'error',
        icon: '⚡',
        title: 'Power Deficit',
        text: `You need ${Math.abs(metrics.power)}W more power. Add Solar Panels (+300W) or RTG (+500W).`,
        fix: 'Add power source',
      });
    }

    if (rocket && metrics.mass > rocket.maxPayload) {
      msgs.push({
        type: 'error',
        icon: '⚖️',
        title: 'Too Heavy',
        text: `Mass ${metrics.mass}kg exceeds ${rocket.name} capacity (${rocket.maxPayload}kg). Switch to a heavier rocket or remove components.`,
        fix: 'Use bigger rocket',
      });
    }

    // === WARNINGS ===
    const hasPowerSource = componentIds.includes('solar_panel') || componentIds.includes('rtg');
    if (!hasPowerSource && componentIds.length > 0) {
      msgs.push({
        type: 'warning',
        icon: '🔋',
        title: 'No Power Source',
        text: 'Your spacecraft has no power generation. Add Solar Panels or RTG to survive.',
        fix: 'Add Solar Panels',
      });
    }

    const hasComm = componentIds.includes('high_gain_antenna') || componentIds.includes('medium_gain_antenna');
    if (!hasComm) {
      msgs.push({
        type: 'warning',
        icon: '📡',
        title: 'No Communication',
        text: 'Without an antenna, you cannot send data back to Earth. Add Medium or High-Gain Antenna.',
        fix: 'Add antenna',
      });
    }

    if (objective && metrics.science < objective.scienceTarget) {
      msgs.push({
        type: 'warning',
        icon: '🔬',
        title: 'Low Science Value',
        text: `You have ${metrics.science} science points, but ${objective.name} requires ${objective.scienceTarget}. Add more instruments.`,
        fix: 'Add scientific instruments',
      });
    }

    // === STRENGTHS ===
    if (metrics.science >= (objective?.scienceTarget || 40)) {
      msgs.push({
        type: 'success',
        icon: '✅',
        title: 'Science Target Met',
        text: `Excellent! Your ${metrics.science} science points exceed the requirement.`,
      });
    }

    if (metrics.power >= 200) {
      msgs.push({
        type: 'success',
        icon: '⚡',
        title: 'Strong Power Supply',
        text: `Power margin of ${metrics.power}W. You have room for extra instruments.`,
      });
    }

    if (metrics.cost <= 70) {
      msgs.push({
        type: 'success',
        icon: '💎',
        title: 'Budget Efficient',
        text: `Only $${metrics.cost}M spent. You saved $${100 - metrics.cost}M for future upgrades.`,
      });
    }

    // === TIPS ===
    if (validation.isValid && msgs.filter((m) => m.type !== 'greeting').length === 0) {
      msgs.push({
        type: 'success',
        icon: '🎉',
        title: 'Design Ready!',
        text: 'All systems check out. Your mission is ready to launch!',
      });
    }

    if (validation.isValid && !msgs.some((m) => m.type === 'success')) {
      msgs.push({
        type: 'tip',
        icon: '💡',
        title: 'Optimization Tip',
        text: 'Try adding redundant systems to improve mission reliability.',
      });
    }

    return msgs;
  };

  const getMessageStyle = (type) => {
    switch (type) {
      case 'error':
        return {
          bg: 'bg-red-500/10',
          border: 'border-red-400/50',
          text: 'text-red-200',
          title: 'text-red-300',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-400/50',
          text: 'text-yellow-100',
          title: 'text-yellow-300',
        };
      case 'success':
        return {
          bg: 'bg-green-500/10',
          border: 'border-green-400/50',
          text: 'text-green-100',
          title: 'text-green-300',
        };
      case 'tip':
        return {
          bg: 'bg-cyan-500/10',
          border: 'border-cyan-400/50',
          text: 'text-cyan-100',
          title: 'text-cyan-300',
        };
      default:
        return {
          bg: 'bg-white/5',
          border: 'border-white/20',
          text: 'text-gray-200',
          title: 'text-white',
        };
    }
  };

  const errorCount = messages.filter((m) => m.type === 'error').length;
  const warningCount = messages.filter((m) => m.type === 'warning').length;
  const successCount = messages.filter((m) => m.type === 'success').length;

  const overallScore = Math.max(0, 100 - errorCount * 30 - warningCount * 10);
  const overallStatus =
    errorCount > 0 ? 'Needs Work' : warningCount > 0 ? 'Almost Ready' : 'Excellent';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/85 backdrop-blur-md z-[85] flex items-start md:items-center justify-center p-2 md:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-space-800/95 border border-white/20 rounded-3xl p-4 md:p-6 max-w-2xl w-full my-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="text-4xl"
            >
              🤖
            </motion.div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
                AI Mission Assistant
              </h2>
              <p className="text-[10px] text-gray-400">Smart design analysis & suggestions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Overall Score */}
        <div className="mb-4 p-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-bold">DESIGN SCORE</span>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${
                overallScore >= 80
                  ? 'bg-green-500/20 text-green-300'
                  : overallScore >= 50
                  ? 'bg-yellow-500/20 text-yellow-300'
                  : 'bg-red-500/20 text-red-300'
              }`}
            >
              {overallStatus}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="h-3 bg-black/40 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${overallScore}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={`h-full ${
                    overallScore >= 80
                      ? 'bg-gradient-to-r from-green-500 to-green-300'
                      : overallScore >= 50
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-300'
                      : 'bg-gradient-to-r from-red-500 to-red-300'
                  }`}
                />
              </div>
            </div>
            <span className="text-2xl font-bold text-white">{overallScore}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3 text-center text-[10px]">
            <div>
              <div className="text-red-400 font-bold">{errorCount} Errors</div>
            </div>
            <div>
              <div className="text-yellow-400 font-bold">{warningCount} Warnings</div>
            </div>
            <div>
              <div className="text-green-400 font-bold">{successCount} Checks</div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {isThinking ? (
          <div className="text-center py-12">
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              🤖
            </motion.div>
            <p className="text-sm text-gray-400">Analyzing your design...</p>
            <div className="flex justify-center gap-1 mt-3">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  className="w-2 h-2 bg-cyan-400 rounded-full"
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
            <AnimatePresence>
              {messages.map((msg, i) => {
                const style = getMessageStyle(msg.type);
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className={`${style.bg} ${style.border} border rounded-xl p-3`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl flex-shrink-0">{msg.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-xs font-bold ${style.title}`}>
                          {msg.title}
                        </div>
                        <div className={`text-[11px] ${style.text} mt-1 leading-relaxed`}>
                          {msg.text}
                        </div>
                        {msg.fix && (
                          <div className="mt-2 inline-block text-[9px] px-2 py-1 bg-white/10 rounded-full text-white font-bold">
                            💡 {msg.fix}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Action button */}
        {!isThinking && (
          <button
            onClick={() => {
              playClick();
              const ok = validation.isValid;
              if (ok) playSuccess();
              onClose();
            }}
            className={`w-full mt-4 py-3 rounded-xl font-bold text-sm transition-all ${
              validation.isValid
                ? 'bg-gradient-to-r from-green-500 to-emerald-400 text-white shadow-lg shadow-green-500/30'
                : 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/30'
            }`}
          >
            {validation.isValid ? '✅ Design Ready — Close' : '⚠ Fix Issues Before Launch'}
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}
