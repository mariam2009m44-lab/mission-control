import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { components } from '../data/spacecraft';
import { rockets } from '../data/rockets';
import { objectives } from '../data/objectives';
import { calculateMetrics, validateDesign } from '../engine/simulator';
import { playClick, playSuccess } from '../utils/sounds';
import { getAIResponse } from '../services/aiService';

export default function AIAssistant({ design, onClose, onApplySuggestion }) {
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(true);

  const metrics = calculateMetrics(design);
  const validation = validateDesign(metrics, design);
  const objective = objectives.find(o => o.id === design.objectiveId);
  const rocket = rockets.find(r => r.id === design.rocketId);

  useEffect(() => {
    setIsThinking(true);
    const timer = setTimeout(async () => {
      const prompt = `أنت مساعد مهام فضائية ذكي. حلل هذا التصميم للمركبة الفضائية:
      - الهدف: ${objective?.name || 'غير محدد'}
      - الصاروخ: ${rocket?.name || 'غير محدد'}
      - التكلفة: ${metrics.cost}M
      - الطاقة: ${metrics.power}W
      - الكتلة: ${metrics.mass}kg
      - الأخطاء: ${validation.errors.join(', ') || 'لا يوجد'}
      - التحذيرات: ${validation.warnings.join(', ') || 'لا يوجد'}
      
      قدم تحليلاً موجزاً ونصائح مفيدة للاعب باللغة العربية.`;

      const aiResponse = await getAIResponse(prompt, design);
      setMessages([{ type: 'ai', title: 'تحليل الذكاء الاصطناعي', text: aiResponse, icon: '🤖' }]);
      setIsThinking(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

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
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">
            ×
          </button>
        </div>

        {isThinking ? (
          <div className="text-center py-12">
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              🤖
            </motion.div>
            <p className="text-sm text-gray-400">Analyzing your design with AI...</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="bg-white/5 border border-white/20 rounded-xl p-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl flex-shrink-0">{msg.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-cyan-300">{msg.title}</div>
                      <div className="text-sm text-gray-200 mt-1 leading-relaxed whitespace-pre-wrap">
                        {msg.text}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <button
          onClick={() => {
            playClick();
            onClose();
          }}
          className="w-full mt-4 py-3 rounded-xl font-bold text-sm transition-all bg-gradient-to-r from-green-500 to-emerald-400 text-white shadow-lg shadow-green-500/30"
        >
          ✅ Design Ready - Close
        </button>
      </motion.div>
    </motion.div>
  );
}
