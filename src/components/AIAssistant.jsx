import { motion } from 'framer-motion';
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  // تنسيقات مخصوصة للمارك داون عشان تبان شيك
  const markdownComponents = {
    p: ({node, ...props}) => <p className="mb-2 leading-relaxed text-sm md:text-base" {...props} />,
    ul: ({node, ...props}) => <ul className="list-disc ml-5 mb-2 space-y-1" {...props} />,
    ol: ({node, ...props}) => <ol className="list-decimal ml-5 mb-2 space-y-1" {...props} />,
    li: ({node, ...props}) => <li className="text-sm md:text-base" {...props} />,
    h1: ({node, ...props}) => <h1 className="text-lg font-bold mb-2 mt-4 text-cyan-300" {...props} />,
    h2: ({node, ...props}) => <h2 className="text-md font-bold mb-2 mt-3 text-cyan-300" {...props} />,
    h3: ({node, ...props}) => <h3 className="text-sm font-bold mb-2 mt-2 text-cyan-200" {...props} />,
    strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
    code: ({node, inline, ...props}) => 
      inline 
        ? <code className="bg-black/50 px-1.5 py-0.5 rounded text-cyan-300 text-xs" {...props} />
        : <pre className="bg-black/60 p-3 rounded-lg overflow-x-auto text-xs my-2 border border-white/10"><code {...props} /></pre>,
    table: ({node, ...props}) => (
      <div className="overflow-x-auto my-3 rounded-lg border border-white/20">
        <table className="w-full text-xs md:text-sm text-right" {...props} />
      </div>
    ),
    th: ({node, ...props}) => <th className="border-b border-white/20 p-2 bg-white/10 font-bold text-cyan-300" {...props} />,
    td: ({node, ...props}) => <td className="border-b border-white/10 p-2 text-gray-200" {...props} />,
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/85 backdrop-blur-md z-[85] flex items-center justify-center p-2 md:p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} onClick={(e) => e.stopPropagation()} className="bg-slate-900/95 border border-white/10 rounded-3xl p-4 md:p-6 max-w-2xl w-full h-[85vh] flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <div className="text-3xl bg-cyan-500/20 p-2 rounded-xl">🤖</div>
            <div>
              <h2 className="text-lg font-bold text-white">مساعد المهمة الذكي</h2>
              <p className="text-xs text-cyan-400">اسألني أي حاجة عن التصميم!</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full w-8 h-8 flex items-center justify-center text-xl transition-colors">×</button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4 scrollbar-thin scrollbar-thumb-white/20">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[90%] rounded-2xl p-4 ${
                msg.role === 'user' 
                  ? 'bg-cyan-600 text-white rounded-br-none shadow-lg shadow-cyan-900/50' 
                  : 'bg-slate-800 text-gray-200 rounded-bl-none border border-white/5 shadow-lg'
              }`}>
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 text-gray-400 rounded-2xl p-4 rounded-bl-none border border-white/5 flex items-center gap-2">
                <span className="text-sm">جاري الكتابة</span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                </span>
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
            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder-gray-500" 
            dir="auto" 
          />
          <button 
            onClick={handleSend} 
            disabled={isLoading} 
            className="bg-cyan-500 hover:bg-cyan-400 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-900/50"
          >
            إرسال
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
