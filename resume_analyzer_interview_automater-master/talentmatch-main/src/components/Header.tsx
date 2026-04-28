import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/rbac.types';
import { motion, AnimatePresence } from 'framer-motion';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  const getRoleColor = (role: UserRole) => {
    const colors: Record<UserRole, string> = {
      [UserRole.ADMIN]: 'bg-red-500/10 text-red-400 border border-red-500/20',
      [UserRole.RECRUITER]: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      [UserRole.HIRING_MANAGER]: 'bg-green-500/10 text-green-400 border border-green-500/20',
      [UserRole.INTERVIEWER]: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
      [UserRole.CANDIDATE]: 'bg-slate-500/10 text-slate-300 border border-slate-500/20'
    };
    return colors[role] || 'bg-slate-500/10 text-slate-300 border border-slate-500/20';
  };

  return (
    <header className="glass sticky top-0 z-50 border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/25 transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-lg">TM</span>
              </div>
              <span className="ml-3 text-2xl font-bold text-white tracking-tight">TalentMatch</span>
            </Link>
            
            {user && (
              <nav className="ml-10 flex items-center space-x-1">
                {[
                  { name: 'Dashboard', path: '/dashboard' },
                  { name: 'Jobs', path: '/dashboard/jobs' },
                  { name: 'Candidates', path: '/dashboard/candidates' },
                  { name: 'Analytics', path: '/dashboard/analytics' }
                ].map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      location.pathname === item.path 
                        ? 'bg-primary/10 text-primary border border-primary/20' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            )}
          </div>

          <div className="flex items-center">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 focus:outline-none p-1.5 rounded-xl hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-indigo-500/20 border border-indigo-500/30 rounded-xl flex items-center justify-center shadow-inner">
                      <span className="text-indigo-300 font-bold">
                        {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-3 text-left hidden sm:block">
                      <p className="text-sm font-medium text-slate-200">{user.name || user.email}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold ${getRoleColor(user.role)}`}>
                        {user.role.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <svg className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsProfileOpen(false)}
                      />
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-56 glass-card rounded-xl py-2 z-20"
                      >
                        <div className="px-4 py-3 border-b border-slate-700/50">
                          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Signed in as</p>
                          <p className="text-sm font-medium text-slate-200 truncate">{user.email}</p>
                        </div>
                        
                        <div className="py-2">
                          <Link
                            to="/dashboard/profile"
                            className="block px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            Your Profile
                          </Link>
                          <Link
                            to="/dashboard/settings"
                            className="block px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            Settings
                          </Link>
                          
                          {user.role === UserRole.ADMIN && (
                            <Link
                              to="/admin/users"
                              className="block px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              User Management
                            </Link>
                          )}
                        </div>
                        
                        <div className="border-t border-slate-700/50 pt-2">
                          <button
                            onClick={logout}
                            className="block w-full text-left px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors font-medium"
                          >
                            Sign out
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/login"
                  className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)] hover:shadow-[0_0_25px_-5px_rgba(99,102,241,0.6)]"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
