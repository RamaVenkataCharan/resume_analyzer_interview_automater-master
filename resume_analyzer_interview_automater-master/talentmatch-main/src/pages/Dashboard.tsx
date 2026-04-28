import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import JobManager from '../components/admin/JobManager';
import AnalyticsDashboard from '../components/admin/AnalyticsDashboard';
import { WithPermission } from '../components/auth/WithPermission';
import { Permission } from '../types/rbac.types';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'overview' | 'candidates' | 'jobs' | 'analytics'>('overview');
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalCandidates: 0,
    averageScore: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [jobsRes, candidatesRes] = await Promise.all([
        api.getJobs(),
        api.getCandidates(),
      ]);
      
      setStats({
        totalJobs: jobsRes.data?.jobs?.length || 0,
        totalCandidates: candidatesRes.data?.candidates?.length || 0,
        averageScore: 78, // Mock average
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] relative overflow-hidden selection:bg-primary/30">
      {/* Background glow effects */}
      <div className="fixed top-0 left-1/4 w-[800px] h-[400px] opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-transparent blur-[120px] rounded-full mix-blend-screen" />
      </div>
      
      <Header />
      <div className="flex relative z-10">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        
        <main className="flex-1 p-8 overflow-y-auto h-[calc(100vh-5rem)] custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Dashboard</h1>
              <p className="text-slate-400 text-lg">
                Welcome back, <span className="text-slate-200 font-medium">{user?.name || user?.email}</span>! Here's your hiring overview.
              </p>
            </motion.div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="glass-card p-6 rounded-2xl relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex items-center relative z-10">
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl mr-5 shadow-inner">
                    <span className="text-blue-400 text-2xl">📋</span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 font-medium tracking-wide uppercase">Active Jobs</p>
                    <p className="text-3xl font-bold text-white mt-1">{stats.totalJobs}</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="glass-card p-6 rounded-2xl relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex items-center relative z-10">
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl mr-5 shadow-inner">
                    <span className="text-emerald-400 text-2xl">👥</span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 font-medium tracking-wide uppercase">Total Candidates</p>
                    <p className="text-3xl font-bold text-white mt-1">{stats.totalCandidates}</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="glass-card p-6 rounded-2xl relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex items-center relative z-10">
                  <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl mr-5 shadow-inner">
                    <span className="text-purple-400 text-2xl">🎯</span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 font-medium tracking-wide uppercase">Avg Match Score</p>
                    <p className="text-3xl font-bold text-white mt-1">{stats.averageScore}%</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Role-based Features */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="space-y-6"
            >
              {/* Job Management (Recruiters/Admins) */}
              <WithPermission permission={Permission.VIEW_ALL_JOBS}>
                <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                   <JobManager />
                </div>
              </WithPermission>

              {/* Analytics (Admins/Hiring Managers) */}
              <WithPermission permission={Permission.VIEW_ANALYTICS}>
                <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                   <AnalyticsDashboard />
                </div>
              </WithPermission>

              {/* Candidate View */}
              {user?.role === 'candidate' && (
                <div className="glass-card rounded-2xl p-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                  <h2 className="text-2xl font-bold text-white mb-4">Your Applications</h2>
                  <p className="text-slate-400">
                    You have applied to 3 positions. Check your application status below.
                  </p>
                  {/* Candidate-specific content would go here */}
                </div>
              )}

              {/* AI Configuration (Admins only) */}
              <WithPermission permission={Permission.CONFIGURE_AI}>
                <div className="glass-card rounded-2xl p-8 relative overflow-hidden border border-red-500/30">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-red-500 to-orange-500"></div>
                  <h2 className="text-2xl font-bold text-white mb-3">AI Configuration</h2>
                  <p className="text-slate-400 mb-6">
                    Configure AI models, scoring algorithms, and matching parameters.
                  </p>
                  <div className="space-y-6 max-w-2xl">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-3 flex justify-between">
                        <span>Matching Threshold</span>
                        <span className="text-primary font-bold">70%</span>
                      </label>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        defaultValue="70"
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>
                    <button className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-xl hover:shadow-[0_0_20px_-5px_rgba(239,68,68,0.5)] transition-all duration-300 font-semibold shadow-lg">
                      Save Configuration
                    </button>
                  </div>
                </div>
              </WithPermission>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
