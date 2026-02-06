
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-800 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <i className="fa-solid fa-bolt text-white text-lg"></i>
        </div>
        <span className="text-xl font-bold tracking-tight text-white">validator<span className="text-indigo-500">X</span></span>
      </Link>
      
      <div className="flex items-center gap-8">
        <Link 
          to="/builder" 
          className={`text-sm font-medium transition-colors ${isActive('/builder') ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
        >
          Builder Portal
        </Link>
        <Link 
          to="/expert" 
          className={`text-sm font-medium transition-colors ${isActive('/expert') ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
        >
          Expert Network
        </Link>
        <Link 
          to="/admin" 
          className={`text-sm font-medium transition-colors ${isActive('/admin') ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
        >
          Admin
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-sm font-semibold text-slate-300 hover:text-white">Sign In</button>
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20">
          Join Network
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
