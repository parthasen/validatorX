
import React from 'react';

const MarketPulse: React.FC = () => {
  const networkActivities = [
    {
      id: 1,
      type: "AI COMMUNICATION PLATFORM",
      content: "Hypothesis: AI-driven supply chains reduce waste by 40%. Validating..."
    },
    {
      id: 2,
      type: "AI COMMUNICATION PLATFORM",
      content: "Research Agent a2 is extracting keywords for 'Eco-logistics'."
    },
    {
      id: 3,
      type: "AI COMMUNICATION PLATFORM",
      content: "Research Agent a2 is extracting keywords for 'Eco-logistics'."
    },
    {
      id: 4,
      type: "AI COMMUNICATION PLATFORM",
      content: "Market simulation: Consumer interest in decentralized web is peaking."
    }
  ];

  const domainExperts = [
    {
      name: "Discovery Bot 3000",
      role: "DISCOVERY AGENT",
      specialty: "Market Analysis",
      avatar: "https://picsum.photos/seed/bot3000/100/100"
    },
    {
      name: "Researcher Prime",
      role: "DEEP RESEARCH AGENT",
      specialty: "Competitor Intelligence",
      avatar: "https://picsum.photos/seed/prime/100/100"
    },
    {
      name: "Question Master",
      role: "QUESTION DESIGNER",
      specialty: "Psychology & Interviews",
      avatar: "https://picsum.photos/seed/qmaster/100/100"
    },
    {
      name: "Validator X",
      role: "MARKET VALIDATOR",
      specialty: "Financial Feasibility",
      avatar: "https://picsum.photos/seed/valx/100/100"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0F172A]">Market Pulse</h1>
          <p className="text-[#64748B] text-lg font-medium">
            Simulation of hundreds of agentic AI domain experts communicating in real-time.
          </p>
        </div>
        <div className="bg-white px-5 py-2.5 rounded-xl border border-[#E2E8F0] shadow-sm flex items-center gap-3 self-start">
          <div className="text-emerald-500">
            <i className="fa-solid fa-waveform-lines animate-pulse"></i>
          </div>
          <span className="text-[#1E293B] font-bold text-sm tracking-tight">1,248 Agents Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-12 items-start">
        {/* Left Column: Network Activity */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-[#1E293B] mb-2">
             <i className="fa-solid fa-tower-broadcast text-[#6366F1]"></i>
             <h2 className="text-xl font-bold tracking-tight">Network Activity</h2>
          </div>
          
          <div className="space-y-4">
            {networkActivities.map((activity) => (
              <div key={activity.id} className="bg-white p-6 rounded-[24px] border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-[#EEF2FF] rounded-md flex items-center justify-center">
                    <span className="text-[10px] font-bold text-[#6366F1]">AI</span>
                  </div>
                  <span className="text-[11px] font-extrabold text-[#64748B] tracking-wider uppercase">
                    {activity.type}
                  </span>
                </div>
                <p className="text-[#1E293B] text-lg font-medium leading-relaxed">
                  {activity.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Active Domain Experts */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-[#1E293B] mb-2">
             <i className="fa-solid fa-magnifying-glass text-[#6366F1]"></i>
             <h2 className="text-xl font-bold tracking-tight">Active Domain Experts</h2>
          </div>

          <div className="space-y-4">
            {domainExperts.map((expert, idx) => (
              <div key={idx} className="bg-white p-5 rounded-[24px] border border-[#E2E8F0] shadow-sm flex items-center gap-4 group hover:border-[#6366F1]/30 transition-all cursor-pointer">
                <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-inner flex-shrink-0">
                  <img src={expert.avatar} alt={expert.name} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all" />
                </div>
                <div className="flex-1">
                  <h4 className="text-[#0F172A] font-extrabold text-base leading-tight">{expert.name}</h4>
                  <p className="text-[#6366F1] font-black text-[11px] tracking-wider mt-0.5">
                    {expert.role}
                  </p>
                  <p className="text-[#94A3B8] text-[12px] font-medium mt-0.5">
                    {expert.specialty}
                  </p>
                </div>
                <div className="w-3 h-3 bg-[#4ADE80] rounded-full shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 rounded-[24px] bg-indigo-50 border border-indigo-100/50">
            <h5 className="text-indigo-900 font-bold text-sm mb-2">Agent Synergy Model</h5>
            <p className="text-indigo-700/70 text-xs leading-relaxed">
              Domain experts are currently cross-referencing validator hypotheses with historical market sentiment data points.
            </p>
            <button className="mt-4 text-xs font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors">
              Inspect Model →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPulse;
