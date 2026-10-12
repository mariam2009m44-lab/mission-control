import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { playClick } from '../utils/sounds';
import { getAIResponse } from '../services/aiService';

export default function AIAssistant({ design, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // عشان ينزل لآخر رسالة تلقائياً
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // رسالة ترحيبية وتحليل أولي عند الفتح
  useEffect(() => {
    const initChat = async () => {
      setIsLoading(true);
      const initialHistory = [
        { role: 'user', content: `مرحباً، لقد انتهيت من تصميم المهمة. هل يمكنك تحليلها؟\nبيانات التصميم: ${JSON.stringify(design)}` }
      ];
      const response = await getAIResponse(initialHistory);
      setMessages([{ role: 'assistant', content: response }]);
      setIsLoading(false);
    };
    initChat();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    playClick();
    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    const response = await getAIResponse(newMessages);
    setMessages([...newMessages, { role: 'assistant', content: response }]);
    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/85 backdrop-blur-md z-[85] flex items-center justify-center p-2 md:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-space-800/95 border border-white/20 rounded-3xl p-4 md:p-6 max-w-2xl w-full h-[80vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🤖</div>
            <div>
              <h2 className="text-lg font-bold text-white">مساعد المهمة الذكي</h2>
              <p className="text-[10px] text-gray-400">اسألني أي حاجة عن التصميم!</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">×</button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                msg.role === 'user' 
                  ? 'bg-cyan-600 text-white rounded-br-none' 
                  : 'bg-white/10 text-gray-200 rounded-bl-none border border-white/10'
              }`}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/10 text-gray-400 rounded-2xl p-3 text-sm rounded-bl-none">
                جاري الكتابة...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex gap-2 pt-3 border-t border-white/10">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="اكتب سؤالك هنا..."
            className="flex-1 bg-black/40 border border-white/20 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
            dir="auto"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
          >
            إرسال
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
