import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { Shield, LayoutDashboard, User, MessageSquareText, LogOut, Settings } from 'lucide-react';
import clsx from 'clsx';

export default function Sidebar() {
  const { user, logout } = useAuth();

  const getLinks = () => {
    if (!user) return [];
    const links = [];
    
    if (user.role === 'Admin' || user.role === 'Security Officer') {
      links.push({ to: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' });
    } else {
      links.push({ to: '/employee', icon: <User size={20} />, label: 'My Profile' });
    }
    
    links.push({ to: '/chatbot', icon: <MessageSquareText size={20} />, label: 'AI Assistant' });
    
    return links;
  };

  if (!user) return null;

  return (
    <div className="fixed inset-y-0 left-0 w-64 glass-panel !rounded-none z-50 flex flex-col justify-between hidden md:flex border-r border-white/10">
      <div>
        <div className="flex items-center gap-3 px-6 py-8 border-b border-white/10">
          <div className="p-2 bg-blue-600/20 rounded-lg text-blue-400">
            <Shield size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">AI Guardian</h1>
        </div>
        
        <nav className="mt-8 px-4 flex flex-col gap-2">
          {getLinks().map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200',
                  isActive 
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                )
              }
            >
              {link.icon}
              <span className="font-medium">{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-lg bg-slate-900/50 border border-white/10">
          <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400 font-bold border border-blue-700/50">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{user.name}</p>
            <p className="text-xs text-slate-400 truncate">{user.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 mt-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
