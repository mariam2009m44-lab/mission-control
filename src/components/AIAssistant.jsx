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

  // تنسيقات مخصوصة للمارك داون عشان تبان شيك واحترافية
  const markdownComponents = {
    p: ({node, ...props}) => <p className="mb-4 leading-relaxed text-slate-200" {...props} />,
    ul: ({node, ...props}) => <ul className="list-disc list-inside ml-4 mb-4 space-y-2 text-slate-200" {...props} />,
    ol: ({node, ...props}) => <ol className="list-decimal list-inside ml-4 mb-4 space-y-2 text-slate-200" {...props} />,
    li: ({node, ...props}) => <li className="leading-relaxed" {...props} />,
    h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-4 mt-6 text-cyan-400 border-b border-white/10 pb-2" {...props} />,
    h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-3 mt-5 text-cyan-400" {...props} />,
    h3: ({node, ...props}) => <h3 className="text-base font-bold mb-3 mt-4 text-cyan-300" {...props} />,
    strong: ({node, ...props}) => <strong className="font-semibold text-white" {...props} />,
    table: ({node, ...props}) => (
      <div className="overflow-x-auto my-5 rounded-xl border border-white/10 shadow-lg w-full bg-slate-900/50">
        <table className="w-full text-sm text-right min-w-[500px]" {...props} />
      </div>
    ),
    thead: ({node, ...props}) => <thead className="bg-slate-800 text-cyan-300" {...props} />,
    th: ({node, ...props}) => <th className="px-5 py-3 font-semibold border-b border-white/10 whitespace-nowrap" {...props} />,
    td: ({node, ...props}) => <td className="px-5 py-4 border-b border-white/5 text-slate-300" {...props} />,
    code: ({node, inline, ...props}) => 
      inline 
        ? <code className="bg-black/60 px-2 py-0.5 rounded-md text-cyan-300 text-xs font-mono" {...props} />
        : <pre className="bg-black/80 p-4 rounded-xl overflow-x-auto text-xs my-4 border border-white/10 font-mono text-cyan-200" dir="ltr"><code {...props} /></pre>,
    blockquote: ({node, ...props}) => <blockquote className="border-r-4 border-cyan-500 pr-4 italic text-slate-400 my-4 bg-white/5 p-3 rounded-l-lg" {...props} />,
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-2 md:p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} onClick={(e) => e.stopPropagation()} className="bg-[#0B1120] border border-white/10 rounded-2xl max-w-4xl w-full h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between bg-white/5 border-b border-white/10 p-4 md:px-6">
          <div className="flex items-center gap-4">
            <div className="text-2xl bg-cyan-500/20 p-2 rounded-xl border border-cyan-500/30">🤖</div>
            <div>
              <h2 className="text-lg font-bold text-white font-sans">مساعد المهمة الذكي</h2>
              <p className="text-xs text-cyan-400 font-sans">اسألني أي حاجة عن التصميم!</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full w-10 h-10 flex items-center justify-center text-2xl transition-all">×</button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[90%] md:max-w-[80%] rounded-2xl p-5 text-sm md:text-base font-sans ${
                msg.role === 'user' 
                  ? 'bg-cyan-600 text-white rounded-tr-sm shadow-lg shadow-cyan-900/30' 
                  : 'bg-slate-800 text-slate-200 rounded-tl-sm border border-white/5 shadow-lg'
              }`}>
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 text-slate-400 rounded-2xl p-4 rounded-tl-sm border border-white/5 flex items-center gap-3">
                <span className="text-sm font-sans">جاري الكتابة</span>
                <span className="flex gap-1">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.15s'}}></span>
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></span>
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white/5 border-t border-white/10 p-4 md:px-6">
          <div className="flex gap-3">
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
              placeholder="اكتب سؤالك هنا..." 
              className="flex-1 bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder-slate-500 font-sans" 
              dir="auto" 
            />
            <button 
              onClick={handleSend} 
              disabled={isLoading} 
              className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-900/40 font-sans"
            >
              إرسال
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
