
import React, { useState } from 'react';
import { AgentRole, Feedback, KnowledgeBase } from '../types';

type AdminTab = 'Dashboard' | 'API Management' | 'Storage' | 'Experts' | 'Feedback' | 'Agents' | 'Knowledge Hub';

interface ApiConfig {
  id: string;
  name: string;
  provider: string;
  status: 'online' | 'offline' | 'error' | 'testing';
  latency: number;
  icon: string;
  color: string;
  hasKey: boolean;
}

interface StorageConfig {
  id: string;
  name: string;
  type: 'object' | 'nosql' | 'sql' | 'vector';
  provider: string;
  status: 'connected' | 'disconnected' | 'error' | 'testing';
  details: {
    bucketName?: string;
    projectId?: string;
    endpoint?: string;
    region?: string;
  };
  icon: string;
  color: string;
}

interface AgentMonitor {
  id: string;
  name: string;
  role: AgentRole;
  status: 'active' | 'idle' | 'busy';
  successRate: number;
  tasksCompleted: number;
  currentTask?: string;
}

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('Knowledge Hub');
  const [geminiKey, setGeminiKey] = useState('••••••••••••••••••••••••••••••••');
  const [kbForm, setKbForm] = useState({ name: '', scope: '' });
  const [activeSubTab, setActiveSubTab] = useState('Knowledge Hub');
  
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([
    { id: 'kb1', name: 'Next-Gen Mobility', summary: 'Analysis of electric and autonomous transportation trends.', keywords: ['EV', 'Lidar', 'Ride-sharing'], findings: ['High demand in APAC', 'Battery costs falling'] },
    { id: 'kb2', name: 'Decentralized Finance', summary: 'Synthesized research on liquidity pools and flash loans.', keywords: ['DeFi', 'DEX', 'Staking'], findings: ['Regulatory pressure increasing', 'Yield farming peak'] },
  ]);

  const [feedbackList] = useState<(Feedback & { project: string })[]>([
    { id: 'f1', expertName: "Dr. Aris Thorne", rating: 5, comment: "The interviewer agent asked very deep questions about supply chain logistics. Very impressive. It caught nuances I didn't expect from an AI.", timestamp: "2024-05-20T14:02:00Z", project: "Global Logistics AI" },
    { id: 'f2', expertName: "Lina Vance", rating: 4, comment: "Themes were spot on, but the voice synthesis had a slight lag during the middle of the session. Research depth was excellent though.", timestamp: "2024-05-20T13:45:00Z", project: "Sustainable Energy Grid" },
  ]);

  const [apis, setApis] = useState<ApiConfig[]>([
    { id: '2', name: 'GPT-4o', provider: 'OpenAI', status: 'online', latency: 450, icon: 'fa-brain', color: 'text-emerald-400', hasKey: true },
    { id: '3', name: 'Grok-1', provider: 'xAI', status: 'offline', latency: 0, icon: 'fa-x-twitter', color: 'text-slate-500', hasKey: false },
    { id: '4', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', status: 'online', latency: 310, icon: 'fa-feather', color: 'text-amber-400', hasKey: true },
  ]);

  const [storages, setStorages] = useState<StorageConfig[]>([
    { 
      id: 's1', 
      name: 'Primary Asset Bucket', 
      type: 'object', 
      provider: 'Google Storage', 
      status: 'connected', 
      details: { bucketName: 'validatorx-assets-prod', projectId: 'v-x-production', region: 'us-central1' },
      icon: 'fa-cloud',
      color: 'text-indigo-400'
    },
  ]);

  const [agents] = useState<AgentMonitor[]>([
    { id: 'a1', name: 'Discovery-X1', role: AgentRole.DISCOVERY, status: 'active', successRate: 98, tasksCompleted: 1420, currentTask: 'Scanning Web3 trends' },
    { id: 'a2', name: 'Research-Prime', role: AgentRole.RESEARCH, status: 'busy', successRate: 94, tasksCompleted: 890, currentTask: 'Deep dive: AgriDrone' },
  ]);

  const [testingId, setTestingId] = useState<string | null>(null);

  const testConnection = (id: string, isStorage: boolean = false) => {
    setTestingId(id);
    if (isStorage) {
      setStorages(prev => prev.map(s => s.id === id ? { ...s, status: 'testing' } : s));
    } else {
      setApis(prev => prev.map(api => api.id === id ? { ...api, status: 'testing' } : api));
    }
    
    setTimeout(() => {
      if (isStorage) {
        setStorages(prev => prev.map(s => (s.id === id ? { ...s, status: Math.random() > 0.1 ? 'connected' : 'error' } : s)));
      } else {
        setApis(prev => prev.map(api => (api.id === id ? { ...api, status: Math.random() > 0.1 ? 'online' : 'error', latency: Math.floor(Math.random() * 500) + 100 } : api)));
      }
      setTestingId(null);
    }, 1500);
  };

  const renderKnowledgeHub = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Horizontal Sub-Navigation */}
      <div className="flex bg-[#F1F5F9]/50 p-1.5 rounded-2xl border border-slate-200 w-fit">
        {['Build Intelligence', 'Knowledge Hub', 'Sharing Hub', 'Infrastructure'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
              activeSubTab === tab ? 'bg-white text-[#0F172A] shadow-sm' : 'text-[#94A3B8] hover:text-[#475569]'
            }`}
          >
            <i className={`fa-solid mr-2 ${
              tab === 'Build Intelligence' ? 'fa-microchip' : 
              tab === 'Knowledge Hub' ? 'fa-brain' : 
              tab === 'Sharing Hub' ? 'fa-share-nodes' : 'fa-key'
            }`}></i>
            {tab}
          </button>
        ))}
      </div>

      {/* Main Form Section - Based on Screenshot */}
      <div className="text-center space-y-10 py-12">
        <div className="space-y-2">
          <h2 className="text-[28px] font-black text-white tracking-tight uppercase">Knowledge Ingestion Engine</h2>
          <p className="text-[#94A3B8] text-[11px] font-bold uppercase tracking-[0.3em]">Multi-Agent VLM / Extraction Pipeline</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
          <div className="space-y-3">
            <label className="text-[11px] font-black text-[#94A3B8] uppercase tracking-widest ml-1">Central KB Name</label>
            <input 
              type="text"
              placeholder="E.G. NEXT-GEN MOBILITY"
              className="w-full bg-[#F8FAFC]/5 border border-[#E2E8F0]/20 rounded-2xl px-6 py-5 text-sm font-bold placeholder:text-[#475569] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-inner"
              value={kbForm.name}
              onChange={(e) => setKbForm({ ...kbForm, name: e.target.value })}
            />
          </div>
          <div className="space-y-3">
            <label className="text-[11px] font-black text-[#94A3B8] uppercase tracking-widest ml-1">Knowledge Scope</label>
            <input 
              type="text"
              placeholder="Domain coverage..."
              className="w-full bg-[#F8FAFC]/5 border border-[#E2E8F0]/20 rounded-2xl px-6 py-5 text-sm font-bold placeholder:text-[#475569] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-inner"
              value={kbForm.scope}
              onChange={(e) => setKbForm({ ...kbForm, scope: e.target.value })}
            />
          </div>
        </div>

        <button className="bg-[#0F172A] border border-[#334155] hover:bg-[#1E293B] text-white w-full max-w-4xl py-6 rounded-[24px] text-xs font-black uppercase tracking-[0.4em] shadow-2xl transition-all active:scale-[0.98] group">
          <span className="group-hover:tracking-[0.5em] transition-all">Initiate Agentic Ingestion</span>
        </button>
      </div>

      {/* Existing Knowledge Bases / RAG Backend Monitoring */}
      <div className="space-y-6 pt-12 border-t border-slate-800/50">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-3">
            <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
            Active RAG Contexts
          </h3>
          <span className="text-[10px] font-bold text-slate-500 uppercase">Synchronized with Google Storage</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {knowledgeBases.map((kb) => (
            <div key={kb.id} className="glass p-6 rounded-3xl border border-slate-800 hover:border-indigo-500/30 transition-all cursor-pointer group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                    <i className="fa-solid fa-folder-tree"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{kb.name}</h4>
                    <p className="text-[10px] text-slate-500 font-mono">ID: {kb.id}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-white transition-colors">
                    <i className="fa-solid fa-pen-to-square text-[10px]"></i>
                  </button>
                  <button className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-rose-400 transition-colors">
                    <i className="fa-solid fa-trash text-[10px]"></i>
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-400 mb-4 line-clamp-2 italic">"{kb.summary}"</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {kb.keywords.map((word) => (
                  <span key={word} className="px-2 py-1 rounded-md bg-indigo-500/5 border border-indigo-500/10 text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">
                    {word}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-800/50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <span className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1.5">
                     <i className="fa-solid fa-file-invoice text-indigo-400"></i> {kb.findings.length} Source Findings
                   </span>
                </div>
                <button className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300">
                  Inspect Data Core →
                </button>
              </div>
            </div>
          ))}
          
          <div className="border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center p-8 text-slate-600 hover:border-slate-700 hover:text-slate-400 transition-all cursor-pointer group">
             <i className="fa-solid fa-plus-circle text-3xl mb-3 group-hover:scale-110 transition-transform"></i>
             <span className="text-xs font-bold uppercase tracking-widest">Connect External KB</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFeedback = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Expert Feedback Logs</h3>
        <div className="flex gap-2">
          <button className="bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-600/30 transition-all">
            <i className="fa-solid fa-download mr-2"></i> Export CSV
          </button>
          <button className="bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-700 transition-all">
            <i className="fa-solid fa-filter mr-2"></i> Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {feedbackList.map((feedback) => (
          <div key={feedback.id} className="glass p-6 rounded-2xl border border-slate-800 hover:border-indigo-500/30 transition-all group">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 overflow-hidden shadow-inner">
                  <img src={`https://picsum.photos/seed/${feedback.id}/100/100`} alt={feedback.expertName} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h4 className="font-bold text-white text-base">{feedback.expertName}</h4>
                    <span className="text-[10px] text-indigo-400 font-mono tracking-widest uppercase bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/10">
                      {feedback.project}
                    </span>
                  </div>
                  <div className="flex gap-1 mt-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <i key={i} className={`fa-solid fa-star text-[10px] ${i < feedback.rating ? 'text-yellow-500' : 'text-slate-700'}`}></i>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-500 font-mono">
                  {new Date(feedback.timestamp).toLocaleString()}
                </p>
                <div className="mt-2">
                  <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-tighter px-2 py-1 bg-emerald-500/5 rounded border border-emerald-500/10">
                    LEARNING COMPLETE
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-slate-950/40 rounded-xl border border-slate-800/50 italic">
              <p className="text-sm text-slate-300 leading-relaxed">"{feedback.comment}"</p>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-4">
                <button className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5">
                  <i className="fa-solid fa-brain"></i> View Agent Refinement
                </button>
                <button className="text-[10px] font-bold text-slate-500 hover:text-slate-400 flex items-center gap-1.5">
                  <i className="fa-solid fa-reply"></i> Send Response
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold text-slate-600 uppercase">Impact</span>
                <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500/50" style={{ width: feedback.rating * 20 + '%' }}></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAgents = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Agent Fleet Monitor</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {agents.map((agent) => (
          <div key={agent.id} className="glass p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-indigo-400 border border-slate-800">
                  <i className="fa-solid fa-robot"></i>
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{agent.name}</h4>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{agent.role}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1.5 ${
                agent.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                agent.status === 'busy' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                'bg-slate-800 text-slate-500 border border-slate-700'
              }`}>
                <span className={`w-1 h-1 rounded-full ${
                  agent.status === 'active' ? 'bg-emerald-400 animate-pulse' :
                  agent.status === 'busy' ? 'bg-amber-400 animate-pulse' :
                  'bg-slate-600'
                }`}></span>
                {agent.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/50">
                <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">Success Rate</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-bold text-indigo-400">{agent.successRate}%</span>
                </div>
              </div>
              <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/50">
                <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">Tasks Completed</p>
                <p className="text-sm font-mono font-bold text-slate-300">{agent.tasksCompleted.toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
               <p className="text-[9px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                 <i className="fa-solid fa-terminal text-[8px]"></i> Current Activity
               </p>
               <p className="text-[11px] text-slate-400 italic">
                 {agent.currentTask ? `"${agent.currentTask}"` : "Waiting for assignment..."}
               </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderApiManagement = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
            <h3 className="text-xl font-bold">Primary Engine Configuration</h3>
          </div>
        </div>
        
        <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-900/20 to-slate-900/40 border border-indigo-500/30 shadow-2xl shadow-indigo-500/5 backdrop-blur-md">
          <div className="flex flex-col md:flex-row gap-8 md:items-start">
            <div className="flex flex-col items-center gap-4 text-center md:text-left md:items-start min-w-[200px]">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-3xl text-white shadow-xl shadow-indigo-600/20">
                <i className="fa-brands fa-google"></i>
              </div>
              <div>
                <h4 className="text-2xl font-bold text-white tracking-tight">Gemini 3 Pro</h4>
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-1">Core Reasoning Engine</p>
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Gemini API Key</label>
                </div>
                <div className="relative group">
                  <input 
                    type="password" 
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    placeholder="Enter your Gemini API Key..."
                    className="w-full bg-slate-950/80 border border-slate-700/50 rounded-2xl px-5 py-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all placeholder:text-slate-800 text-indigo-100 group-hover:border-slate-600"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Latency', value: '124ms', color: 'text-indigo-400' },
                  { label: 'Throughput', value: '540 RPM', color: 'text-slate-300' },
                  { label: 'Total Tokens', value: '2.4M', color: 'text-slate-300' },
                  { label: 'Grounding', value: 'Active', color: 'text-emerald-400' },
                ].map((stat, i) => (
                  <div key={i} className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/50">
                    <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">{stat.label}</p>
                    <p className={`text-sm font-mono font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  // Added renderStorage to fix the error and display storage infrastructure UI
  const renderStorage = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Storage Infrastructure</h3>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {storages.map(storage => (
          <div key={storage.id} className="glass p-6 rounded-2xl border border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-xl ${storage.color}`}>
                <i className={`fa-solid ${storage.icon}`}></i>
              </div>
              <div>
                <h4 className="font-bold text-white">{storage.name}</h4>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{storage.type} • {storage.provider}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                storage.status === 'connected' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                storage.status === 'testing' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>
                {storage.status}
              </span>
              <button 
                onClick={() => testConnection(storage.id, true)}
                disabled={testingId === storage.id}
                className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
              >
                {testingId === storage.id ? 'Testing...' : 'Test Connection'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-2xl border-l-4 border-indigo-500 shadow-xl shadow-indigo-500/5">
          <p className="text-xs font-bold uppercase text-slate-500 mb-1">Total Agents</p>
          <h4 className="text-3xl font-bold">482</h4>
        </div>
        <div className="glass p-6 rounded-2xl border-l-4 border-purple-500 shadow-xl shadow-purple-500/5">
          <p className="text-xs font-bold uppercase text-slate-500 mb-1">Human Experts</p>
          <h4 className="text-3xl font-bold">1,204</h4>
        </div>
        <div className="glass p-6 rounded-2xl border-l-4 border-emerald-500 shadow-xl shadow-emerald-500/5">
          <p className="text-xs font-bold uppercase text-slate-500 mb-1">Validations/Mo</p>
          <h4 className="text-3xl font-bold">8,529</h4>
        </div>
      </section>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-indigo-600/20">
            <i className="fa-solid fa-shield-halved text-white"></i>
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">System Admin</h1>
            <p className="text-sm text-slate-500">Central command for validatorX agent infrastructure</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="space-y-2">
          {(['Dashboard', 'API Management', 'Storage', 'Experts', 'Feedback', 'Agents', 'Knowledge Hub'] as AdminTab[]).map((item) => (
            <button 
              key={item} 
              onClick={() => setActiveTab(item)}
              className={`w-full text-left px-5 py-4 rounded-xl text-sm font-bold transition-all flex items-center gap-3 ${
                activeTab === item 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <i className={`fa-solid ${
                item === 'Dashboard' ? 'fa-chart-pie' : 
                item === 'API Management' ? 'fa-plug' : 
                item === 'Storage' ? 'fa-database' : 
                item === 'Experts' ? 'fa-user-tie' : 
                item === 'Feedback' ? 'fa-comment-dots' : 
                item === 'Agents' ? 'fa-robot' : 'fa-brain'
              } text-base`}></i>
              {item}
            </button>
          ))}
        </aside>

        <main className="lg:col-span-3">
          {activeTab === 'API Management' && renderApiManagement()}
          {activeTab === 'Storage' && renderStorage()}
          {activeTab === 'Dashboard' && renderDashboard()}
          {activeTab === 'Agents' && renderAgents()}
          {activeTab === 'Feedback' && renderFeedback()}
          {activeTab === 'Knowledge Hub' && renderKnowledgeHub()}
          {!['API Management', 'Storage', 'Dashboard', 'Agents', 'Feedback', 'Knowledge Hub'].includes(activeTab) && renderDashboard()}
        </main>
      </div>
    </div>
  );
};

export default Admin;
