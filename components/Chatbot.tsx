
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: userMsg,
        config: {
          systemInstruction: "You are the validatorX assistant. Help users understand market discovery, agentic simulation, and how to validate their business ideas."
        }
      });
      setMessages(prev => [...prev, { role: 'ai', text: response.text || "I'm sorry, I couldn't process that." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Error connecting to Gemini API." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {isOpen ? (
        <div className="w-80 h-[450px] glass rounded-2xl flex flex-col shadow-2xl border border-indigo-500/30 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-indigo-600/10">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
                <i className="fa-solid fa-sparkles text-[10px] text-white"></i>
              </div>
              <span className="text-sm font-bold">validatorX Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
              <i className="fa-solid fa-times"></i>
            </button>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.length === 0 && (
              <p className="text-xs text-slate-500 text-center mt-10">Ask me anything about market validation!</p>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-xl px-3 py-2 text-xs ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 rounded-xl px-3 py-2 text-xs flex gap-1">
                  <div className="w-1 h-1 bg-slate-500 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1 h-1 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-slate-800 bg-slate-900/50 flex gap-2">
            <input 
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Ask a question..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} className="bg-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-paper-plane text-[10px]"></i>
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center text-xl shadow-xl shadow-indigo-600/30 hover:scale-110 transition-transform group"
        >
          <i className="fa-solid fa-comment-dots text-white group-hover:rotate-12 transition-transform"></i>
        </button>
      )}
    </div>
  );
};

export default Chatbot;
