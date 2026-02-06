
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";
import { decode, decodeAudioData, encode, generateSpeech, getQuickInsight } from '../services/geminiService';

const ExpertPortal: React.FC = () => {
  const [isInterviewing, setIsInterviewing] = useState(false);
  const [mode, setMode] = useState<'text' | 'voice'>('text');
  const [transcript, setTranscript] = useState<{ role: string, text: string }[]>([]);
  const [inputText, setInputText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  const [quickInsight, setQuickInsight] = useState('');

  // Audio refs
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());

  useEffect(() => {
    // Initial quick insight for the expert
    getQuickInsight("energy market validation").then(setQuickInsight);
  }, []);

  const playAgentAudio = async (text: string) => {
    try {
      const base64Audio = await generateSpeech(text);
      if (!base64Audio) return;

      if (!outputAudioContextRef.current) {
        outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const ctx = outputAudioContextRef.current;
      const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
      
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      
      nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
      source.start(nextStartTimeRef.current);
      nextStartTimeRef.current += audioBuffer.duration;
      sourcesRef.current.add(source);
    } catch (e) {
      console.error("Audio playback error", e);
    }
  };

  const startInterview = () => {
    setIsInterviewing(true);
    const welcome = 'Hello, I am the Validator Agent for validatorX. I have some themes regarding the "Sustainable Energy Grid" project I would like your expert opinion on. Shall we begin?';
    setTranscript([{ role: 'agent', text: welcome }]);
    playAgentAudio(welcome);
  };

  const handleSend = async () => {
    if (!inputText) return;
    const userText = inputText;
    setInputText('');
    setTranscript(prev => [...prev, { role: 'user', text: userText }]);
    
    // Simulate AI response with Pro for quality
    setTimeout(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Expert said: "${userText}". As a market validator agent, ask a deep follow-up question.`,
      });
      const aiText = response.text || "Interesting point. Can you elaborate?";
      setTranscript(prev => [...prev, { role: 'agent', text: aiText }]);
      playAgentAudio(aiText);
    }, 1000);
  };

  const submitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setIsInterviewing(false);
      setFeedbackSubmitted(false);
      setRating(0);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-12 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Expert Validation Hub</h1>
          <p className="text-slate-400">Share your expertise to refine the next generation of builders.</p>
        </div>
        {quickInsight && (
          <div className="glass px-4 py-2 rounded-xl border-indigo-500/20 bg-indigo-500/5 flex items-center gap-3">
             <i className="fa-solid fa-bolt-lightning text-amber-400 text-sm"></i>
             <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest leading-none">Market Insight: <span className="text-slate-200">{quickInsight}</span></span>
          </div>
        )}
      </div>

      {!isInterviewing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass p-8 rounded-2xl space-y-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-xl">
              <i className="fa-solid fa-microphone"></i>
            </div>
            <h2 className="text-xl font-bold">Pending Interviews</h2>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold">Project: Energy Grid</p>
                <p className="text-xs text-slate-500">3 critical themes need validation</p>
              </div>
              <button onClick={startInterview} className="bg-indigo-600 px-4 py-2 rounded-lg text-xs font-bold shadow-lg shadow-indigo-600/20 hover:scale-105 transition-transform">Accept</button>
            </div>
          </div>
          <div className="glass p-8 rounded-2xl space-y-4">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-xl">
              <i className="fa-solid fa-chart-line"></i>
            </div>
            <h2 className="text-xl font-bold">Expert Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900 p-3 rounded-xl">
                <p className="text-[10px] text-slate-500 uppercase font-bold">Validated</p>
                <p className="text-xl font-bold">24</p>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl">
                <p className="text-[10px] text-slate-500 uppercase font-bold">Impact Score</p>
                <p className="text-xl font-bold text-indigo-400">920</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="glass rounded-3xl overflow-hidden flex flex-col h-[600px] shadow-2xl border-slate-800">
            <div className="bg-slate-800/50 p-4 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                  <i className="fa-solid fa-robot"></i>
                </div>
                <div>
                  <p className="text-sm font-bold">Validator Agent v4.1</p>
                  <p className="text-[10px] text-emerald-400 font-mono tracking-widest flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> LIVE SESSION
                  </p>
                </div>
              </div>
              <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
                <button 
                  onClick={() => setMode('text')}
                  className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${mode === 'text' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  Text Chat
                </button>
                <button 
                  onClick={() => setMode('voice')}
                  className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${mode === 'voice' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  Live Audio
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-950/20">
              {transcript.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-md ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-200'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {mode === 'voice' && (
                <div className="flex justify-center py-8">
                  <div className="flex items-center gap-2 h-16">
                    {[1,3,5,8,10,8,5,3,1].map((h, i) => (
                      <div key={i} className="w-2 bg-indigo-500 rounded-full animate-pulse" style={{ height: `${h * 10}%`, animationDelay: `${i * 0.1}s` }}></div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-700 bg-slate-900/50">
              {mode === 'text' ? (
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="Type your expert insight..."
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                  />
                  <button onClick={handleSend} className="bg-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center text-lg shadow-lg hover:scale-105 active:scale-95 transition-all">
                    <i className="fa-solid fa-paper-plane"></i>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 py-2">
                  <button className="w-20 h-20 bg-rose-600 rounded-full flex items-center justify-center text-3xl shadow-xl shadow-rose-600/30 hover:scale-105 active:scale-95 transition-all animate-pulse">
                    <i className="fa-solid fa-microphone"></i>
                  </button>
                  <p className="text-[10px] text-slate-500 font-mono tracking-[0.2em] uppercase">Recording & Transcribing Voice Input...</p>
                </div>
              )}
            </div>
          </div>

          <div className="glass p-8 rounded-2xl border-indigo-500/20 bg-indigo-900/5">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-star"></i>
              </div>
              <h3 className="text-lg font-bold">Training Feedback</h3>
            </div>
            {feedbackSubmitted ? (
               <div className="text-emerald-400 font-bold py-8 text-center animate-bounce">
                  <i className="fa-solid fa-check-circle mr-2"></i> Feedback Logged! Agents learning...
               </div>
            ) : (
              <form onSubmit={submitFeedback} className="space-y-4">
                <p className="text-sm text-slate-400">Rate the relevance and depth of the agent's questions:</p>
                <div className="flex gap-4">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button 
                      key={star} 
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-2xl transition-all ${rating >= star ? 'text-yellow-400 scale-110' : 'text-slate-700 hover:text-slate-500'}`}
                    >
                      <i className="fa-solid fa-star"></i>
                    </button>
                  ))}
                </div>
                <textarea 
                  rows={3} 
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                  placeholder="Suggestions for the agent's research focus..."
                />
                <button type="submit" className="bg-indigo-600 w-full py-4 rounded-xl font-bold shadow-lg shadow-indigo-600/10 hover:bg-indigo-500 transition-colors">Submit Feedback & End Session</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpertPortal;
