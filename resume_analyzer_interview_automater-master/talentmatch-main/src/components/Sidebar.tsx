import React from 'react';
import { motion } from 'framer-motion';

interface SidebarProps {
  activeView: 'overview' | 'candidates' | 'jobs' | 'analytics';
  onViewChange: (view: 'overview' | 'candidates' | 'jobs' | 'analytics') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '🏠' },
    { id: 'candidates', label: 'Candidates', icon: '👥' },
    { id: 'jobs', label: 'Jobs', icon: '💼' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
  ] as const;

  return (
    <aside className="w-64 glass border-r border-slate-800/50 min-h-[calc(100vh-5rem)] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-purple-500/5 pointer-events-none" />
      <div className="p-6 relative z-10">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Menu</h2>
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden group ${
                    activeView === item.id
                      ? 'text-primary font-medium'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {activeView === item.id && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className={`absolute inset-0 bg-slate-800/50 rounded-xl opacity-0 transition-opacity duration-300 ${activeView !== item.id ? 'group-hover:opacity-100' : ''}`} />
                  <span className="mr-3 text-lg relative z-10 transition-transform duration-300 group-hover:scale-110">{item.icon}</span>
                  <span className="relative z-10">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="mt-12 pt-6 border-t border-slate-800/50">
          <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
            <p className="text-sm text-slate-400 mb-2">Need help?</p>
            <a 
              href="mailto:support@talentmatch.com" 
              className="text-primary text-sm font-medium hover:text-primary-hover hover:underline transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
