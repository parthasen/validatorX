
import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
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

const DataCoreInspector: React.FC<{ kb: KnowledgeBase; onBack: () => void }> = ({ kb, onBack }) => {
  const [activeView, setActiveView] = useState<'graph' | 'vector' | 'scan' | 'logs'>('graph');
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (activeView === 'graph' && svgRef.current) {
      const width = 1000;
      const height = 600;
      const svg = d3.select(svgRef.current);
      svg.selectAll('*').remove();

      const nodes = [
        { id: 'EDGE AI', group: 1 },
        { id: 'AGENTIC AI', group: 1 },
        { id: 'VISION TRANSFORMERS (ViT)', group: 2 },
        { id: 'ENGINEERING', group: 3 },
        { id: 'MB...', group: 3 },
      ];

      const links = [
        { source: 'EDGE AI', target: 'AGENTIC AI' },
        { source: 'EDGE AI', target: 'VISION TRANSFORMERS (ViT)' },
        { source: 'EDGE AI', target: 'MB...' },
        { source: 'MB...', target: 'ENGINEERING' },
      ];

      const simulation = d3.forceSimulation(nodes as any)
        .force('link', d3.forceLink(links).id((d: any) => d.id).distance(150))
        .force('charge', d3.forceManyBody().strength(-1000))
        .force('center', d3.forceCenter(width / 2, height / 2));

      const link = svg.append('g')
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('stroke', '#E2E8F0')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5');

      const node = svg.append('g')
        .selectAll('circle')
        .data(nodes)
        .join('circle')
        .attr('r', 25)
        .attr('fill', '#FFFFFF')
        .attr('stroke', '#E2E8F0')
        .attr('stroke-width', 3)
        .call(d3.drag<SVGCircleElement, any>()
          .on('start', (e, d) => {
            if (!e.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x; d.fy = d.y;
          })
          .on('drag', (e, d) => {
            d.fx = e.x; d.fy = e.y;
          })
          .on('end', (e, d) => {
            if (!e.active) simulation.alphaTarget(0);
            d.fx = null; d.fy = null;
          }) as any);

      const label = svg.append('g')
        .selectAll('text')
        .data(nodes)
        .join('text')
        .text(d => d.id)
        .attr('font-size', '10px')
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'middle')
        .attr('dy', 40)
        .attr('fill', '#0F172A');

      simulation.on('tick', () => {
        link
          .attr('x1', (d: any) => d.source.x)
          .attr('y1', (d: any) => d.source.y)
          .attr('x2', (d: any) => d.target.x)
          .attr('y2', (d: any) => d.target.y);
        node
          .attr('cx', (d: any) => d.x)
          .attr('cy', (d: any) => d.y);
        label
          .attr('x', (d: any) => d.x)
          .attr('y', (d: any) => d.y);
      });
    }
  }, [activeView]);

  return (
    <div className="fixed inset-0 z-[100] bg-white flex animate-in fade-in duration-300">
      <div className="w-20 border-r border-slate-100 flex flex-col items-center py-8 gap-10">
        <button onClick={onBack} className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-4">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <button onClick={() => setActiveView('graph')} className={`p-3 rounded-xl transition-all ${activeView === 'graph' ? 'bg-[#6366F1] text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>
          <i className="fa-solid fa-share-nodes text-xl"></i>
          <span className="text-[9px] block font-bold uppercase mt-1">Graph</span>
        </button>
        <button onClick={() => setActiveView('vector')} className={`p-3 rounded-xl transition-all ${activeView === 'vector' ? 'bg-[#6366F1] text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>
          <i className="fa-solid fa-vector-square text-xl"></i>
          <span className="text-[9px] block font-bold uppercase mt-1 text-center">Vector</span>
        </button>
        <button onClick={() => setActiveView('scan')} className={`p-3 rounded-xl transition-all ${activeView === 'scan' ? 'bg-[#6366F1] text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>
          <i className="fa-solid fa-magnifying-glass text-xl"></i>
          <span className="text-[9px] block font-bold uppercase mt-1 text-center">Scan</span>
        </button>
        <button onClick={() => setActiveView('logs')} className={`p-3 rounded-xl transition-all ${activeView === 'logs' ? 'bg-[#6366F1] text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>
          <i className="fa-solid fa-clock-rotate-left text-xl"></i>
          <span className="text-[9px] block font-bold uppercase mt-1 text-center">Logs</span>
        </button>
      </div>

      <div className="flex-1 overflow-hidden relative text-slate-900">
        {activeView === 'graph' && (
          <div className="w-full h-full flex flex-col p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-[#0F172A]">{kb.name} - Semantic Graph</h2>
              <button className="bg-[#0F172A] text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <i className="fa-solid fa-brain"></i> ANSW NETWORK ANALYSIS
              </button>
            </div>
            <div className="flex-1 bg-white border border-slate-100 rounded-[32px] overflow-hidden">
              <svg ref={svgRef} className="w-full h-full" viewBox="0 0 1000 600"></svg>
            </div>
          </div>
        )}

        {activeView === 'scan' && (
          <div className="w-full h-full p-12 overflow-y-auto">
            <div className="flex justify-between items-center mb-2">
              <div className="space-y-1">
                <h2 className="text-3xl font-black text-[#0F172A]">Agentic Market Scan</h2>
                <p className="text-slate-500 font-medium">Grounding intelligence via Google Search API.</p>
              </div>
              <button className="bg-[#4F46E5] text-white px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-200">
                TRIGGER AGENTIC SCAN
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.5fr,1fr] gap-12 mt-12 items-start">
              <div className="space-y-10">
                <div className="space-y-4">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">SUGGESTED TOPICS (FROM AGENTS)</h3>
                  <div className="space-y-3">
                    {[
                      "Accuracy and precision benchmarks for multi-lingual resume parsing across diverse industry sectors",
                      "The impact of centralized talent mapping on reducing time-to-hire for executive and niche technical roles",
                      "Scalability and data privacy compliance of centralized talent repositories under global regulations like GDPR and CCPA",
                      "User adoption barriers and integration friction between AI-driven repositories and legacy Applicant Tracking Systems",
                      "The effectiveness of automated talent mapping in identifying transferable skills and mitigating algorithmic bias in recruitment"
                    ].map((topic, i) => (
                      <div key={i} className="bg-[#F8FAFC] border border-[#E2E8F0] p-5 rounded-2xl text-center text-[13px] font-bold text-[#475569] hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer">
                        {topic}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">CUSTOM FRAMEWORKS (SWOT, 7S...)</h3>
                  <div className="flex gap-4">
                    <input type="text" placeholder="Add new theme..." className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] p-5 rounded-2xl text-sm font-bold text-[#475569] outline-none" />
                    <button className="w-14 h-14 bg-[#0F172A] rounded-2xl text-white flex items-center justify-center"><i className="fa-solid fa-plus"></i></button>
                  </div>
                  <div className="flex gap-3">
                    <button className="bg-[#F1F5F9] text-[#475569] px-4 py-2 rounded-xl text-xs font-black uppercase">SWOT</button>
                    <button className="bg-[#F1F5F9] text-[#475569] px-4 py-2 rounded-xl text-xs font-black uppercase">Porter's Five Forces</button>
                  </div>
                </div>
              </div>

              <div className="aspect-square bg-[#EFF6FF]/30 border border-[#DBEAFE] rounded-[64px] flex flex-col items-center justify-center p-12 text-center space-y-6">
                 <div className="text-[#3B82F6] text-4xl mb-2">
                   <i className="fa-solid fa-magnifying-glass-plus"></i>
                 </div>
                 <h4 className="text-[#1E40AF] font-black text-sm uppercase tracking-widest">GROUNDING PIPELINE ACTIVE</h4>
                 <p className="text-[#60A5FA] text-xs font-bold leading-relaxed max-w-[280px]">
                   Verified search results will be extracted into semantic nodes and stored in the central vector repository.
                 </p>
              </div>
            </div>
          </div>
        )}

        {activeView === 'vector' && (
          <div className="w-full h-full flex items-center justify-center text-slate-400 uppercase font-black tracking-widest">
            Vector Embeddings Explorer Locked
          </div>
        )}

        {activeView === 'logs' && (
          <div className="w-full h-full flex items-center justify-center text-slate-400 uppercase font-black tracking-widest">
            Data Lineage & Activity Logs
          </div>
        )}
      </div>
    </div>
  );
};

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('Knowledge Hub');
  const [geminiKey, setGeminiKey] = useState('••••••••••••••••••••••••••••••••');
  const [kbForm, setKbForm] = useState({ name: '', scope: '' });
  const [activeSubTab, setActiveSubTab] = useState('Knowledge Hub');
  const [inspectingKb, setInspectingKb] = useState<KnowledgeBase | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);
  
  const [sharingForm, setSharingForm] = useState({
    user: '',
    role: '',
    track: ''
  });
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

  const [knowledgeBases] = useState<KnowledgeBase[]>([
    { id: 'kb1', name: 'Next-Gen Mobility', summary: 'Analysis of electric and autonomous transportation trends.', keywords: ['EV', 'Lidar', 'Ride-sharing'], findings: ['High demand in APAC', 'Battery costs falling'] },
    { id: 'kb2', name: 'Decentralized Finance', summary: 'Synthesized research on liquidity pools and flash loans.', keywords: ['DeFi', 'DEX', 'Staking'], findings: ['Regulatory pressure increasing', 'Yield farming peak'] },
  ]);

  const [feedbackList] = useState<(Feedback & { project: string })[]>([
    { id: 'f1', expertName: "Dr. Aris Thorne", rating: 5, comment: "The interviewer agent asked very deep questions about supply chain logistics. Very impressive. It caught nuances I didn't expect from an AI.", timestamp: "2024-05-20T14:02:00Z", project: "Global Logistics AI" },
    { id: 'f2', expertName: "Lina Vance", rating: 4, comment: "Themes were spot on, but the voice synthesis had a slight lag during the middle of the session. Research depth was excellent though.", timestamp: "2024-05-20T13:45:00Z", project: "Sustainable Energy Grid" },
  ]);

  const [apis, setApis] = useState<ApiConfig[]>([
    { id: 'openai', name: 'GPT-4o', provider: 'OpenAI', status: 'online', latency: 450, icon: 'fa-brain', color: 'text-emerald-400', hasKey: true },
    { id: 'grok', name: 'Grok-1', provider: 'xAI', status: 'offline', latency: 0, icon: 'fa-x-twitter', color: 'text-slate-500', hasKey: false },
    { id: 'claude', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', status: 'online', latency: 310, icon: 'fa-feather', color: 'text-amber-400', hasKey: true },
  ]);

  const [storages, setStorages] = useState<StorageConfig[]>([
    { 
      id: 'gs1', 
      name: 'Primary Assets', 
      type: 'object', 
      provider: 'Google Storage', 
      status: 'connected', 
      details: { bucketName: 'validatorx-assets-prod', projectId: 'v-x-production', region: 'us-central1' },
      icon: 'fa-cloud',
      color: 'text-indigo-400'
    },
    { 
      id: 'db1', 
      name: 'Vector Hub', 
      type: 'vector', 
      provider: 'Pinecone', 
      status: 'connected', 
      details: { endpoint: 'https://v-hub.pinecone.io', region: 'us-east1' },
      icon: 'fa-vector-square',
      color: 'text-purple-400'
    },
  ]);

  const [agents] = useState<AgentMonitor[]>([
    { id: 'a1', name: 'Discovery-X1', role: AgentRole.DISCOVERY, status: 'active', successRate: 98, tasksCompleted: 1420, currentTask: 'Scanning Web3 trends' },
    { id: 'a2', name: 'Research-Prime', role: AgentRole.RESEARCH, status: 'busy', successRate: 94, tasksCompleted: 890, currentTask: 'Deep dive: AgriDrone' },
  ]);

  const testConnection = (id: string, isStorage: boolean = false) => {
    setTestingId(id);
    if (isStorage) {
      setStorages(prev => prev.map(s => (s.id === id ? { ...s, status: 'testing' } : s)));
    } else {
      setApis(prev => prev.map(api => (api.id === id ? { ...api, status: 'testing' } : api)));
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

  const handleGenerateLink = () => {
    if (!sharingForm.user || !sharingForm.role || !sharingForm.track) return;
    const link = `https://validatorx.io/invite/join?token=${Math.random().toString(36).substring(7)}&track=${sharingForm.track}`;
    setGeneratedLink(link);
  };

  const renderBuildIntelligence = () => (
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
  );

  const renderSharingHub = () => (
    <div className="space-y-12 py-12">
      <div className="text-center space-y-2">
        <h2 className="text-[28px] font-black text-white tracking-tight uppercase">Workspace Sharing Hub</h2>
        <p className="text-[#94A3B8] text-[11px] font-bold uppercase tracking-[0.3em]">Grant Secure Access to Knowledge Tracks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-[11px] font-black text-[#94A3B8] uppercase tracking-widest ml-1">Target User</label>
            <select 
              value={sharingForm.user}
              onChange={(e) => setSharingForm({...sharingForm, user: e.target.value})}
              className="w-full bg-[#F8FAFC]/5 border border-[#E2E8F0]/20 rounded-2xl px-6 py-4 text-sm font-bold text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-inner appearance-none cursor-pointer"
            >
              <option value="" disabled className="bg-slate-900">Select a Registered User</option>
              <option value="sarah-chen" className="bg-slate-900">Sarah Chen (Expert)</option>
              <option value="aris-thorne" className="bg-slate-900">Dr. Aris Thorne (Expert)</option>
              <option value="marcus-h" className="bg-slate-900">Marcus Hertz (Builder)</option>
            </select>
          </div>
          <div className="space-y-3">
            <label className="text-[11px] font-black text-[#94A3B8] uppercase tracking-widest ml-1">Access Persona Role</label>
            <select 
              value={sharingForm.role}
              onChange={(e) => setSharingForm({...sharingForm, role: e.target.value})}
              className="w-full bg-[#F8FAFC]/5 border border-[#E2E8F0]/20 rounded-2xl px-6 py-4 text-sm font-bold text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-inner appearance-none cursor-pointer"
            >
              <option value="" disabled className="bg-slate-900">Select Access Role</option>
              <option value="validator" className="bg-slate-900">Domain Validator</option>
              <option value="auditor" className="bg-slate-900">Peer Auditor</option>
              <option value="viewer" className="bg-slate-900">Insight Viewer</option>
            </select>
          </div>
          <div className="space-y-3">
            <label className="text-[11px] font-black text-[#94A3B8] uppercase tracking-widest ml-1">Knowledge Base Track</label>
            <select 
              value={sharingForm.track}
              onChange={(e) => setSharingForm({...sharingForm, track: e.target.value})}
              className="w-full bg-[#F8FAFC]/5 border border-[#E2E8F0]/20 rounded-2xl px-6 py-4 text-sm font-bold text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-inner appearance-none cursor-pointer"
            >
              <option value="" disabled className="bg-slate-900">Select Knowledge Track</option>
              {knowledgeBases.map(kb => (
                <option key={kb.id} value={kb.id} className="bg-slate-900">{kb.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="w-full aspect-square max-w-[360px] rounded-[48px] border border-indigo-500/20 bg-indigo-500/5 flex flex-col items-center justify-center p-12 text-center space-y-6">
            <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white text-3xl shadow-[0_0_30px_rgba(79,70,229,0.4)]">
              <i className="fa-solid fa-link"></i>
            </div>
            <div className="space-y-2">
              <h4 className="text-white font-black text-sm uppercase tracking-widest">Secure Link Generation</h4>
              <p className="text-[#6366F1] text-[11px] font-medium leading-relaxed">Generated links are encrypted and restricted.</p>
            </div>
            {generatedLink && (
              <div className="w-full animate-in zoom-in duration-300">
                <div className="bg-white/5 border border-indigo-500/30 p-3 rounded-xl flex items-center gap-3">
                  <span className="text-[10px] font-mono text-indigo-300 truncate flex-1">{generatedLink}</span>
                  <button onClick={() => navigator.clipboard.writeText(generatedLink)} className="text-white hover:text-indigo-400">
                    <i className="fa-solid fa-copy"></i>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-center pt-8">
        <button onClick={handleGenerateLink} className="bg-[#0F172A] border border-[#334155] hover:bg-[#1E293B] text-white w-full max-w-5xl py-6 rounded-[24px] text-xs font-black uppercase tracking-[0.4em] shadow-2xl transition-all active:scale-[0.98]">Generate Access Link</button>
      </div>
    </div>
  );

  const renderKnowledgeHub = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex bg-[#F1F5F9]/50 p-1.5 rounded-2xl border border-slate-200 w-fit">
        {['Build Intelligence', 'Knowledge Hub', 'Sharing Hub'].map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveSubTab(tab); setGeneratedLink(null); }}
            className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeSubTab === tab ? 'bg-white text-[#0F172A] shadow-sm' : 'text-[#94A3B8] hover:text-[#475569]'}`}
          >
            <i className={`fa-solid mr-2 ${tab === 'Build Intelligence' ? 'fa-microchip' : tab === 'Knowledge Hub' ? 'fa-brain' : 'fa-share-nodes'}`}></i>
            {tab}
          </button>
        ))}
      </div>

      {activeSubTab === 'Build Intelligence' && renderBuildIntelligence()}
      {activeSubTab === 'Sharing Hub' && renderSharingHub()}
      {activeSubTab === 'Knowledge Hub' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
              Active RAG Contexts
            </h3>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Synchronized with Google Storage</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {knowledgeBases.map((kb) => (
              <div key={kb.id} className="glass p-6 rounded-3xl border border-slate-800 hover:border-indigo-500/30 transition-all group">
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
                </div>
                <p className="text-xs text-slate-400 mb-4 line-clamp-2 italic">"{kb.summary}"</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {kb.keywords.map((word) => (
                    <span key={word} className="px-2 py-1 rounded-md bg-indigo-500/5 border border-indigo-500/10 text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">{word}</span>
                  ))}
                </div>
                <button onClick={() => setInspectingKb(kb)} className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors">
                  Inspect Data Core →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderFeedback = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <h3 className="text-xl font-bold">Expert Feedback Logs</h3>
      <div className="grid grid-cols-1 gap-4">
        {feedbackList.map((feedback) => (
          <div key={feedback.id} className="glass p-6 rounded-2xl border border-slate-800">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                  <img src={`https://picsum.photos/seed/${feedback.id}/100/100`} alt={feedback.expertName} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-white">{feedback.expertName}</h4>
                  <div className="flex gap-1 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (<i key={i} className={`fa-solid fa-star text-[10px] ${i < feedback.rating ? 'text-yellow-500' : 'text-slate-700'}`}></i>))}
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 font-mono">{new Date(feedback.timestamp).toLocaleString()}</p>
            </div>
            <p className="mt-4 text-sm text-slate-300 italic">"{feedback.comment}"</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAgents = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <h3 className="text-xl font-bold">Agent Fleet Monitor</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {agents.map((agent) => (
          <div key={agent.id} className="glass p-6 rounded-2xl border border-slate-800">
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
              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${agent.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-500'}`}>{agent.status}</span>
            </div>
            <p className="text-[11px] text-slate-400 italic">"{agent.currentTask || "Waiting..."}"</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderApiManagement = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold flex items-center gap-3">
          <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
          LLM Engine Orchestration
        </h3>
        <span className="text-[10px] font-bold text-slate-500 uppercase">Multi-Provider Configuration</span>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Gemini Core Configuration */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-900/20 to-slate-900/40 border border-indigo-500/30 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-3xl text-white shadow-xl shadow-indigo-600/20">
              <i className="fa-brands fa-google"></i>
            </div>
            <div className="flex-1 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-xl font-bold text-white">Gemini 3 Pro</h4>
                  <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-1">Primary Reasoning Engine</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider">Online</span>
                  <span className="text-[10px] font-mono text-slate-500 font-bold">124ms</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">API Credentials</label>
                <div className="relative group">
                  <input 
                    type="password" 
                    value={geminiKey} 
                    onChange={(e) => setGeminiKey(e.target.value)} 
                    className="w-full bg-slate-950/80 border border-slate-700/50 rounded-xl px-5 py-3.5 text-sm font-mono text-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                    placeholder="Enter Gemini API Key..."
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all active:scale-95">Save</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Other Provider Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {apis.map((api) => (
            <div key={api.id} className="glass p-6 rounded-3xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-xl ${api.color} border border-slate-800`}>
                    <i className={`fa-solid ${api.icon}`}></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{api.name}</h4>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{api.provider}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase inline-block border ${
                    api.status === 'online' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    api.status === 'error' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                    'bg-slate-800 text-slate-500 border-slate-700'
                  }`}>
                    {api.status}
                  </div>
                  {api.status === 'online' && <p className="text-[9px] font-mono text-slate-600 mt-1 font-bold">{api.latency}ms</p>}
                </div>
              </div>

              <div className="space-y-4 flex-1">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Key Management</label>
                  <div className="flex gap-2">
                    <input 
                      type="password" 
                      placeholder="Enter Provider Key..."
                      defaultValue={api.hasKey ? "••••••••••••••••" : ""}
                      className="flex-1 bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-indigo-500/50 transition-colors"
                    />
                    <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-slate-700">Set</button>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-800/50 flex items-center justify-between">
                <div className="flex gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${api.status === 'online' ? 'bg-emerald-500' : 'bg-slate-700'}`}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                </div>
                <button 
                  onClick={() => testConnection(api.id)}
                  className={`text-[9px] font-black uppercase tracking-[0.2em] transition-all ${testingId === api.id ? 'text-indigo-400 animate-pulse' : 'text-slate-500 hover:text-indigo-400'}`}
                >
                  {testingId === api.id ? 'DIAGNOSING...' : 'RUN DIAGNOSTICS'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
      <div className="glass p-6 rounded-2xl border-l-4 border-indigo-500">
        <p className="text-xs font-bold uppercase text-slate-500 mb-1">Total Agents</p>
        <h4 className="text-3xl font-bold">482</h4>
      </div>
      <div className="glass p-6 rounded-2xl border-l-4 border-purple-500">
        <p className="text-xs font-bold uppercase text-slate-500 mb-1">Human Experts</p>
        <h4 className="text-3xl font-bold">1,204</h4>
      </div>
      <div className="glass p-6 rounded-2xl border-l-4 border-emerald-500">
        <p className="text-xs font-bold uppercase text-slate-500 mb-1">Validations/Mo</p>
        <h4 className="text-3xl font-bold">8,529</h4>
      </div>
    </div>
  );

  const renderStorage = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold flex items-center gap-3">
          <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
          Storage & Infrastructure
        </h3>
        <span className="text-[10px] font-bold text-slate-500 uppercase">Manual Cloud Configuration</span>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Google Storage Manual Config */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-900/10 to-slate-900/40 border border-indigo-500/20 shadow-xl">
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-[#4285F4] flex items-center justify-center text-3xl text-white shadow-lg shadow-[#4285F4]/20">
                <i className="fa-solid fa-cloud"></i>
              </div>
              <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                storages[0].status === 'connected' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                'bg-slate-800 text-slate-500 border-slate-700'
              }`}>
                {storages[0].status}
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Bucket Name</label>
                  <input 
                    type="text" 
                    placeholder="validatorx-assets-prod"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Project ID</label>
                  <input 
                    type="text" 
                    placeholder="v-x-production-3821"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Region</label>
                  <select className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-400 focus:outline-none focus:border-indigo-500/50 appearance-none">
                    <option>us-central1 (Iowa)</option>
                    <option>europe-west1 (Belgium)</option>
                    <option>asia-northeast1 (Tokyo)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Service Account Key (JSON)</label>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-3 rounded-xl text-xs font-bold transition-all border border-slate-700">
                      <i className="fa-solid fa-upload mr-2"></i> Upload Key File
                    </button>
                    <button onClick={() => testConnection(storages[0].id, true)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
                      {testingId === storages[0].id ? 'Validating...' : 'Connect'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Other Infrastructure Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {storages.slice(1).map((storage) => (
            <div key={storage.id} className="glass p-6 rounded-3xl border border-slate-800 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-xl ${storage.color} border border-slate-800 shadow-inner`}>
                    <i className={`fa-solid ${storage.icon}`}></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{storage.name}</h4>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{storage.type} • {storage.provider}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase border ${
                  storage.status === 'connected' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  'bg-slate-800 text-slate-500 border-slate-700'
                }`}>
                  {storage.status}
                </span>
              </div>
              
              <div className="space-y-3">
                 <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-500">Endpoint:</span>
                    <span className="text-slate-300 truncate max-w-[150px]">{storage.details.endpoint || 'N/A'}</span>
                 </div>
                 <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-500">Region:</span>
                    <span className="text-slate-300">{storage.details.region || 'N/A'}</span>
                 </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/50 flex gap-2">
                <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-400 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-700">Configure</button>
                <button onClick={() => testConnection(storage.id, true)} className="bg-slate-800 hover:bg-slate-700 text-indigo-400 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-700">Test</button>
              </div>
            </div>
          ))}
          
          {/* Add New Source Placeholder */}
          <div className="border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center p-8 gap-4 hover:border-indigo-500/30 transition-all cursor-pointer group">
             <div className="w-12 h-12 rounded-full border-2 border-slate-800 flex items-center justify-center text-slate-600 group-hover:text-indigo-500 group-hover:border-indigo-500 transition-all">
                <i className="fa-solid fa-plus text-xl"></i>
             </div>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-indigo-400">Add Infrastructure Source</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8 relative">
      {inspectingKb && <DataCoreInspector kb={inspectingKb} onBack={() => setInspectingKb(null)} />}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-indigo-600/20 text-white">
            <i className="fa-solid fa-shield-halved"></i>
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
            <button key={item} onClick={() => setActiveTab(item)} className={`w-full text-left px-5 py-4 rounded-xl text-sm font-bold transition-all flex items-center gap-3 ${activeTab === item ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>
              <i className={`fa-solid ${item === 'Dashboard' ? 'fa-chart-pie' : item === 'API Management' ? 'fa-plug' : item === 'Storage' ? 'fa-database' : item === 'Experts' ? 'fa-user-tie' : item === 'Feedback' ? 'fa-comment-dots' : item === 'Agents' ? 'fa-robot' : 'fa-brain'} text-base`}></i>
              {item}
            </button>
          ))}
        </aside>
        <main className="lg:col-span-3 min-h-[600px]">
          {activeTab === 'Dashboard' && renderDashboard()}
          {activeTab === 'API Management' && renderApiManagement()}
          {activeTab === 'Feedback' && renderFeedback()}
          {activeTab === 'Agents' && renderAgents()}
          {activeTab === 'Knowledge Hub' && renderKnowledgeHub()}
          {activeTab === 'Storage' && renderStorage()}
          {!['API Management', 'Storage', 'Dashboard', 'Agents', 'Feedback', 'Knowledge Hub'].includes(activeTab) && renderDashboard()}
        </main>
      </div>
    </div>
  );
};

export default Admin;
