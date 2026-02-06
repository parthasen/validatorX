
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './views/Home';
import BuilderPortal from './views/BuilderPortal';
import ExpertPortal from './views/ExpertPortal';
import Admin from './views/Admin';
import MarketPulse from './views/MarketPulse';
import Chatbot from './components/Chatbot';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col selection:bg-indigo-500 selection:text-white">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/builder" element={<BuilderPortal />} />
            <Route path="/expert" element={<ExpertPortal />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/market-pulse" element={<MarketPulse />} />
          </Routes>
        </main>
        
        <footer className="glass mt-12 border-t border-slate-800 py-8 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
                <i className="fa-solid fa-bolt text-white text-[10px]"></i>
              </div>
              <span className="font-bold text-slate-300">validatorX</span>
            </div>
            <p className="text-xs text-slate-500">
              &copy; {new Date().getFullYear()} validatorX. Agentic Social Market Discovery.
            </p>
            <div className="flex gap-4">
              <i className="fa-brands fa-github text-slate-500 hover:text-white cursor-pointer transition-colors"></i>
              <i className="fa-brands fa-twitter text-slate-500 hover:text-white cursor-pointer transition-colors"></i>
              <i className="fa-brands fa-linkedin text-slate-500 hover:text-white cursor-pointer transition-colors"></i>
            </div>
          </div>
        </footer>
        
        {/* Persistent AI powered chatbot */}
        <Chatbot />
      </div>
    </Router>
  );
};

export default App;
