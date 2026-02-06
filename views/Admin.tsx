
import React, { useState } from 'react';
import { AgentRole, Feedback } from '../types';

type AdminTab = 'Dashboard' | 'API Management' | 'Storage' | 'Experts' | 'Feedback' | 'Agents';

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
  const [activeTab, setActiveTab] = useState<AdminTab>('Dashboard');
  const [geminiKey, setGeminiKey] = useState('••••••••••••••••••••••••••••••••');
  
  const [feedbackList] = useState<(Feedback & { project: string })[]>([
    { id: 'f1', expertName: "Dr. Aris Thorne", rating: 5, comment: "The interviewer agent asked very deep questions about supply chain logistics. Very impressive. It caught nuances I didn't expect from an AI.", timestamp: "2024-05-20T14:02:00Z", project: "Global Logistics AI" },
    { id: 'f2', expertName: "Lina Vance", rating: 4, comment: "Themes were spot on, but the voice synthesis had a slight lag during the middle of the session. Research depth was excellent though.", timestamp: "2024-05-20T13:45:00Z", project: "Sustainable Energy Grid" },
    { id: 'f3', expertName: "Marcus Hertz", rating: 3, comment: "The questions were a bit generic at the start. It took a few turns for the agent to really get into the technical specificities of the medical hardware.", timestamp: "2024-05-19T09:20:00Z", project: "MediChain Hardware" },
    { id: 'f4', expertName: "Sarah Chen", rating: 5, comment: "Exemplary performance. The agent correctly identified the key regulatory hurdles in the new market discovery phase.", timestamp: "2024-05-18T16:10:00Z", project: "FinTech Discovery" },
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
    { 
      id: 's2', 
      name: 'Expert Vector Store', 
      type: 'vector', 
      provider: 'Pinecone', 
      status: 'connected', 
      details: { endpoint: 'expert-index-v2.svc.us-east-1.pinecone.io', region: 'us-east-1' },
      icon: 'fa-database',
      color: 'text-emerald-400'
    },
    { 
      id: 's3', 
      name: 'Relational Archive', 
      type: 'sql', 
      provider: 'PostgreSQL', 
      status: 'disconnected', 
      details: { endpoint: 'db.validatorx.cloud', region: 'eu-west-1' },
      icon: 'fa-server',
      color: 'text-blue-400'
    },
  ]);

  const [agents] = useState<AgentMonitor[]>([
    { id: 'a1', name: 'Discovery-X1', role: AgentRole.DISCOVERY, status: 'active', successRate: 98, tasksCompleted: 1420, currentTask: 'Scanning Web3 trends' },
    { id: 'a2', name: 'Research-Prime', role: AgentRole.RESEARCH, status: 'busy', successRate: 94, tasksCompleted: 890, currentTask: 'Deep dive: AgriDrone' },
    { id: 'a3', name: 'Gen-Questions', role: AgentRole.QUESTION_GENERATOR, status: 'idle', successRate: 99, tasksCompleted: 2301 },
    { id: 'a4', name: 'Validator-Alpha', role: AgentRole.VALIDATOR, status: 'active', successRate: 96, tasksCompleted: 452, currentTask: 'Synthesizing expert feedback' },
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
        setStorages(prev => prev.map(s => {
          if (s.id === id) {
            const isSuccess = Math.random() > 0.1;
            return { ...s, status: isSuccess ? 'connected' : 'error' };
          }
          return s;
        }));
      } else {
        setApis(prev => prev.map(api => {
          if (api.id === id) {
            const isSuccess = Math.random() > 0.1;
            return { 
              ...api, 
              status: isSuccess ? 'online' : 'error', 
              latency: isSuccess ? Math.floor(Math.random() * 500) + 100 : 0 
            };
          }
          return api;
        }));
      }
      setTestingId(null);
    }, 1500);
  };

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

      <div className="glass p-8 rounded-2xl border-l-4 border-emerald-500 bg-emerald-500/5">
        <h4 className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
          <i className="fa-solid fa-microchip"></i> Automated Refinement Engine
        </h4>
        <p className="text-xs text-slate-400 leading-relaxed">
          The feedback logged above is automatically processed by our RAG system. Gemini Pro analyzes negative sentiment or low ratings to adjust the hypothesis-generation logic and system instructions for the <span className="text-indigo-400 font-bold">{AgentRole.INTERVIEWER}</span> agents.
        </p>
      </div>
    </div>
  );

  const renderAgents = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Agent Fleet Monitor</h3>
        <div className="flex gap-2">
           <button className="bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-600/30 transition-all">
            Scale Fleet
          </button>
          <button className="bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-700 transition-all">
            Refresh Metrics
          </button>
        </div>
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
                  <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: `${agent.successRate}%` }}></div>
                  </div>
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
            
            <div className="mt-4 flex gap-2">
               <button className="flex-1 py-2 text-[10px] font-bold text-indigo-400 border border-indigo-500/20 rounded-lg hover:bg-indigo-500/10 transition-all">Inspect Logic</button>
               <button className="flex-1 py-2 text-[10px] font-bold text-slate-400 border border-slate-800 rounded-lg hover:bg-slate-800 transition-all">Restart</button>
            </div>
          </div>
        ))}
      </div>

      <div className="glass p-8 rounded-2xl border-l-4 border-indigo-500 bg-indigo-900/5">
        <h4 className="text-indigo-400 font-bold mb-2 flex items-center gap-2">
          <i className="fa-solid fa-chart-line"></i> Global Fleet Performance
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-2">
           <div>
             <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Avg Reasoning Latency</p>
             <p className="text-xl font-bold">1.2s</p>
           </div>
           <div>
             <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Context Cache Hit</p>
             <p className="text-xl font-bold">84%</p>
           </div>
           <div>
             <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Tokens/Sec (Agg)</p>
             <p className="text-xl font-bold">4.2k</p>
           </div>
           <div>
             <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Error Rate</p>
             <p className="text-xl font-bold text-emerald-500">0.02%</p>
           </div>
        </div>
      </div>
    </div>
  );

  const renderStorageManagement = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Storage Infrastructure</h3>
        <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-lg transition-all">
          <i className="fa-solid fa-plus mr-2"></i> Add New Provider
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {storages.map((storage) => (
          <div key={storage.id} className="glass p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all group">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex items-center gap-4 min-w-[240px]">
                <div className={`w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-2xl ${storage.color}`}>
                  <i className={`fa-solid ${storage.icon}`}></i>
                </div>
                <div>
                  <h4 className="font-bold text-white flex items-center gap-2">
                    {storage.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-slate-500 font-mono uppercase px-1.5 py-0.5 bg-slate-900 rounded border border-slate-800">
                      {storage.provider}
                    </span>
                    <span className={`flex items-center gap-1 text-[10px] font-bold uppercase ${
                      storage.status === 'connected' ? 'text-emerald-400' : 
                      storage.status === 'error' ? 'text-rose-400' : 
                      storage.status === 'testing' ? 'text-indigo-400 animate-pulse' : 'text-slate-500'
                    }`}>
                      {storage.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                {storage.provider === 'Google Storage' ? (
                  <>
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase mb-1 block">Bucket Name</label>
                      <input 
                        type="text" 
                        defaultValue={storage.details.bucketName}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase mb-1 block">Project ID</label>
                      <input 
                        type="text" 
                        defaultValue={storage.details.projectId}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="md:col-span-2">
                      <label className="text-[10px] text-slate-500 font-bold uppercase mb-1 block">Endpoint / Host</label>
                      <input 
                        type="text" 
                        defaultValue={storage.details.endpoint}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => testConnection(storage.id, true)}
                  disabled={testingId !== null}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-2"
                >
                   {storage.status === 'testing' ? (
                    <i className="fa-solid fa-spinner animate-spin"></i>
                  ) : (
                    <i className="fa-solid fa-cloud-arrow-up"></i>
                  )}
                  Ping
                </button>
                <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all">
                  Save
                </button>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800/50 flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-widest font-bold">
              <div className="flex gap-4">
                <span>Storage Class: <span className="text-slate-400">Standard</span></span>
                <span>Region: <span className="text-slate-400">{storage.details.region}</span></span>
                <span>Total Data: <span className="text-slate-400">14.2 GB</span></span>
              </div>
              <div className="flex gap-4">
                <span className="text-indigo-400 cursor-pointer hover:underline flex items-center gap-1">
                   <i className="fa-solid fa-key text-[8px]"></i> Manage Keys
                </span>
                <span className="text-rose-400 cursor-pointer hover:underline">Flush Cache</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="glass p-6 rounded-2xl bg-indigo-900/10 border-indigo-500/20">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 mt-1">
            <i className="fa-solid fa-circle-info"></i>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-1">Knowledge Base Sync</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              ValidatorX automatically partitions data from deep research agents into these storage clusters. Each builder project receives a unique subdirectory for its Knowledge Base to ensure strict isolation and RAG performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderApiManagement = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Primary Configuration Section: Gemini Pro */}
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
                <div className="mt-4 flex flex-col gap-2">
                  <span className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-tighter">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></span>
                    Operational
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Uptime: 99.99%</span>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Gemini API Key</label>
                  <span className="text-[10px] font-mono text-indigo-400 cursor-pointer hover:text-indigo-300">Get key from AI Studio →</span>
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
                    <button className="p-2 text-slate-600 hover:text-indigo-400 transition-colors">
                      <i className="fa-solid fa-eye-slash text-xs"></i>
                    </button>
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

      {/* Secondary Models Section */}
      <section className="space-y-6">
        <h3 className="text-lg font-bold text-slate-300">Secondary & Fallback Models</h3>
        <div className="grid grid-cols-1 gap-6">
          {apis.map((api) => (
            <div key={api.id} className="glass p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-2xl ${api.color}`}>
                    <i className={`fa-brands ${api.icon}`}></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-white flex items-center gap-2">
                      {api.name}
                      <span className="text-[10px] text-slate-500 font-mono tracking-tighter uppercase px-1.5 py-0.5 bg-slate-900 rounded border border-slate-800">
                        {api.provider}
                      </span>
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase ${
                        api.status === 'online' ? 'text-emerald-400' : 
                        api.status === 'error' ? 'text-rose-400' : 
                        api.status === 'testing' ? 'text-indigo-400 animate-pulse' : 'text-slate-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          api.status === 'online' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 
                          api.status === 'error' ? 'bg-rose-400' : 
                          api.status === 'testing' ? 'bg-indigo-400' : 'bg-slate-500'
                        }`}></span>
                        {api.status}
                      </span>
                      {api.status === 'online' && (
                        <span className="text-[10px] text-slate-500 font-mono">
                          Latency: <span className="text-slate-300">{api.latency}ms</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <input 
                      type="password" 
                      defaultValue={api.hasKey ? "••••••••••••••••" : ""}
                      placeholder="Enter API Key"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-700"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400">
                      <i className="fa-solid fa-eye-slash text-xs"></i>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => testConnection(api.id)}
                    disabled={testingId !== null}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {api.status === 'testing' ? (
                      <i className="fa-solid fa-spinner animate-spin"></i>
                    ) : (
                      <i className="fa-solid fa-vial"></i>
                    )}
                    Test
                  </button>
                  <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all">
                    Update
                  </button>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-800/50 flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                <div className="flex gap-4">
                  <span>Usage: <span className="text-slate-400">12,402 / 50,000 req</span></span>
                  <span>Uptime: <span className="text-emerald-500">99.98%</span></span>
                </div>
                <div className="flex gap-2">
                  <span className="text-indigo-400 cursor-pointer hover:underline">View Documentation</span>
                  <span className="text-slate-600">|</span>
                  <span className="text-rose-400 cursor-pointer hover:underline">Revoke Key</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="glass p-8 rounded-2xl border-l-4 border-amber-500 bg-amber-500/5">
        <h4 className="text-amber-400 font-bold mb-2 flex items-center gap-2">
          <i className="fa-solid fa-triangle-exclamation"></i> Security Warning
        </h4>
        <p className="text-xs text-slate-400 leading-relaxed">
          API keys are stored in encrypted format within the secure vault. Access is restricted to super-admins. Ensure that you use production-grade keys with appropriate rate limits to avoid agent degradation during high-traffic validation cycles.
        </p>
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

      <section className="glass p-8 rounded-2xl space-y-6">
        <h3 className="text-xl font-bold">Recent Expert Feedback Highlights</h3>
        <div className="space-y-4">
          {feedbackList.slice(0, 2).map((f) => (
            <div key={f.id} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-indigo-300">{f.expertName}</span>
                <span className="text-[10px] text-slate-500 font-mono">{new Date(f.timestamp).toLocaleDateString()}</span>
              </div>
              <div className="flex gap-1">
                {Array.from({length: 5}).map((_, star) => (
                  <i key={star} className={`fa-solid fa-star text-[10px] ${star < f.rating ? 'text-yellow-500' : 'text-slate-700'}`}></i>
                ))}
              </div>
              <p className="text-xs text-slate-400 italic">"{f.comment}"</p>
            </div>
          ))}
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
        <div className="flex gap-4">
          <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1.5 rounded-full text-[11px] font-bold border border-emerald-500/20 flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span> SYSTEM HEALTH: EXCELLENT
          </span>
          <span className="bg-slate-800 text-slate-400 px-3 py-1.5 rounded-full text-[11px] font-bold border border-slate-700">
            v2.4.0-release
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="space-y-2">
          {(['Dashboard', 'API Management', 'Storage', 'Experts', 'Feedback', 'Agents'] as AdminTab[]).map((item) => (
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
                item === 'Feedback' ? 'fa-comment-dots' : 'fa-robot'
              } text-base`}></i>
              {item}
            </button>
          ))}
          
          <div className="mt-8 p-4 glass rounded-xl border-dashed border-slate-700">
            <p className="text-[10px] font-bold uppercase text-slate-600 mb-3 tracking-widest text-center">Audit Logs</p>
            <div className="space-y-2">
              <div className="text-[9px] text-slate-500"><span className="text-indigo-400">14:02</span> Gemini Pro key refreshed</div>
              <div className="text-[9px] text-slate-500"><span className="text-indigo-400">13:58</span> Expert Feed re-indexed</div>
              <div className="text-[9px] text-slate-500"><span className="text-indigo-400">12:15</span> Backup cluster synced</div>
            </div>
          </div>
        </aside>

        <main className="lg:col-span-3">
          {activeTab === 'API Management' && renderApiManagement()}
          {activeTab === 'Storage' && renderStorageManagement()}
          {activeTab === 'Dashboard' && renderDashboard()}
          {activeTab === 'Agents' && renderAgents()}
          {activeTab === 'Feedback' && renderFeedback()}
          {/* Default to dashboard if not implemented tabs */}
          {!['API Management', 'Storage', 'Dashboard', 'Agents', 'Feedback'].includes(activeTab) && renderDashboard()}
        </main>
      </div>
    </div>
  );
};

export default Admin;
