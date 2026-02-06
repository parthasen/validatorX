
import React, { useState } from 'react';
import { createKnowledgeBase, performDeepResearch } from '../services/geminiService';
import { KnowledgeBase, Theme } from '../types';

const BuilderPortal: React.FC = () => {
  const [step, setStep] = useState(1);
  const [input, setInput] = useState({ title: '', brief: '' });
  const [kb, setKb] = useState<KnowledgeBase | null>(null);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);

  const startDiscovery = async () => {
    if (!input.title || !input.brief) return;
    setLoading(true);
    setStep(2);
    addLog("Initializing Discovery Agents...");
    
    try {
      const result = await createKnowledgeBase(input.title, input.brief);
      setKb(result);
      addLog(`Knowledge Base Created: ${result.name}`);
      addLog("Starting Deep Research Agents (using Gemini Search Grounding)...");
      
      const researchThemes = await performDeepResearch(result);
      setThemes(researchThemes.map(t => ({ ...t, selected: false })));
      addLog("Deep Research complete. Themes synthesized.");
      setStep(3);
    } catch (err) {
      addLog("Error in agentic process. Retrying...");
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = (id: string) => {
    setThemes(prev => prev.map(t => t.id === id ? { ...t, selected: !t.selected } : t));
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-12 flex items-center justify-between border-b border-slate-800 pb-8">
        <div>
          <h1 className="text-3xl font-bold">Builder Portal</h1>
          <p className="text-slate-400">Transform your concept into a validated market solution.</p>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`w-10 h-2 rounded-full ${step >= s ? 'bg-indigo-500' : 'bg-slate-800'}`} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {step === 1 && (
            <div className="glass p-8 rounded-2xl space-y-6">
              <h2 className="text-xl font-bold">New Project Entry</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Project Title</label>
                  <input 
                    type="text" 
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. AI-driven Sustainable Energy Grid"
                    value={input.title}
                    onChange={e => setInput({ ...input, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Problem Statement / Brief</label>
                  <textarea 
                    rows={6}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Describe the opportunity, pain points, and your hypothesis..."
                    value={input.brief}
                    onChange={e => setInput({ ...input, brief: e.target.value })}
                  />
                </div>
              </div>
              <button 
                onClick={startDiscovery}
                disabled={!input.title || !input.brief}
                className="w-full bg-indigo-600 py-4 rounded-xl font-bold text-white hover:bg-indigo-500 transition-all disabled:opacity-50"
              >
                Summon Discovery Agents
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="glass p-12 rounded-2xl flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-20 h-20 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
              <div>
                <h3 className="text-xl font-bold">Agent Social Discovery in Progress</h3>
                <p className="text-slate-400 mt-2">Agents are simulating market conversations and querying external APIs...</p>
              </div>
            </div>
          )}

          {step === 3 && (step >= 3) && (
            <div className="space-y-6">
              <div className="glass p-8 rounded-2xl">
                <h2 className="text-xl font-bold mb-4">Market Validation Themes</h2>
                <p className="text-sm text-slate-400 mb-8">Select themes for human domain experts to validate in real-time interviews.</p>
                <div className="grid gap-4">
                  {themes.map(theme => (
                    <div 
                      key={theme.id}
                      onClick={() => toggleTheme(theme.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${theme.selected ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 hover:border-slate-500'}`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-white">{theme.keyword}</span>
                        {theme.selected && <i className="fa-solid fa-check-circle text-indigo-400"></i>}
                      </div>
                      <p className="text-xs text-slate-400">{theme.description}</p>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setStep(4)}
                  className="w-full mt-8 bg-indigo-600 py-4 rounded-xl font-bold text-white hover:bg-indigo-500 transition-all"
                >
                  Proceed to Expert Selection
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
             <div className="glass p-8 rounded-2xl text-center space-y-6">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto text-2xl">
                  <i className="fa-solid fa-users"></i>
                </div>
                <h2 className="text-2xl font-bold">Match Found</h2>
                <p className="text-slate-400">We've identified 3 domain experts ready to validate your "Energy Grid" themes. They are waiting in the Expert Network.</p>
                <div className="bg-slate-900/50 p-6 rounded-xl text-left border border-slate-800">
                  <div className="flex items-center gap-4">
                    <img src="https://picsum.photos/seed/expert1/100/100" className="w-12 h-12 rounded-full" alt="Expert" />
                    <div>
                      <p className="font-bold">Sarah Chen</p>
                      <p className="text-xs text-slate-500">VP Sustainability @ Greentech Global</p>
                    </div>
                  </div>
                </div>
                <button className="w-full bg-purple-600 py-4 rounded-xl font-bold text-white">Start Live Interview Sync</button>
             </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="glass p-6 rounded-2xl">
            <h3 className="text-xs font-bold uppercase text-slate-500 mb-4 tracking-widest">Agent Activity Log</h3>
            <div className="space-y-3 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {logs.length === 0 && <p className="text-xs text-slate-600 italic">No activity yet...</p>}
              {logs.map((log, i) => (
                <div key={i} className="text-[11px] font-mono text-slate-400 border-l-2 border-slate-800 pl-3 py-1">
                  {log}
                </div>
              ))}
            </div>
          </div>

          {kb && (
            <div className="glass p-6 rounded-2xl bg-indigo-900/10 border-indigo-500/20">
              <h3 className="text-xs font-bold uppercase text-indigo-400 mb-4 tracking-widest">Static Knowledge Base</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] text-indigo-300 font-bold uppercase">Source Summary</p>
                  <p className="text-xs text-slate-300 line-clamp-4 mt-1">{kb.summary}</p>
                </div>
                <div>
                  <p className="text-[10px] text-indigo-300 font-bold uppercase">Entities</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {kb.keywords.map(k => (
                      <span key={k} className="bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded text-[10px]">{k}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuilderPortal;
