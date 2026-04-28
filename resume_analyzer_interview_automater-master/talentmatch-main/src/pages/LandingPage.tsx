import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@components/Header';
import Footer from '@components/Footer';
import FeatureCard from '@components/FeatureCard';
import Testimonial from '@components/Testimonial';

const LandingPage: React.FC = () => {
  const features = [
    {
      title: 'AI-Powered Candidate Matching',
      description: 'Advanced algorithms to match candidates with job requirements instantly and accurately.',
      icon: '🎯'
    },
    {
      title: 'Automated Interview Questions',
      description: 'Generate tailored interview questions based on job descriptions and candidate profiles.',
      icon: '💬'
    },
    {
      title: 'Real-time Scoring',
      description: 'Instant candidate evaluation with detailed scoring breakdown and skill gap analysis.',
      icon: '⚡'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'HR Director at TechCorp',
      content: 'Reduced our hiring time by 70% with accurate AI matching. The interface is simply phenomenal.',
      avatar: '👩‍💼'
    },
    {
      name: 'Mike Chen',
      role: 'Engineering Manager at StartupXYZ',
      content: 'The interview question generator is a game-changer for technical roles. Highly recommended.',
      avatar: '👨‍💻'
    }
  ];

  return (
    <div className="min-h-screen bg-[#030712] relative overflow-hidden selection:bg-primary/30">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-[100px] animate-blob rounded-full mix-blend-screen" />
      </div>

      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block mb-6 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium backdrop-blur-md"
          >
            ✨ The Future of Intelligent Hiring
          </motion.div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-8 tracking-tight">
            AI-Powered <span className="text-gradient animate-gradient">Talent Matching</span> Platform
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Streamline your hiring process with intelligent candidate matching, 
            automated interview questions, and real-time scoring.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/dashboard" 
              className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:shadow-[0_0_60px_-15px_rgba(99,102,241,0.7)] hover:-translate-y-1 w-full sm:w-auto"
            >
              Launch Dashboard
            </Link>
            <Link 
              to="/login" 
              className="glass px-8 py-4 rounded-xl text-lg font-semibold text-slate-200 hover:bg-white/10 transition-all duration-300 w-full sm:w-auto"
            >
              View Demo
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Unleash the Power of AI</h2>
            <p className="text-xl text-slate-400">Everything you need to scale your engineering team</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                index={index}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 relative z-10 border-t border-slate-800/50 bg-slate-900/20">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Trusted by Industry Leaders</h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Testimonial
                key={index}
                index={index}
                name={testimonial.name}
                role={testimonial.role}
                content={testimonial.content}
                avatar={testimonial.avatar}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 text-center relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/10 pointer-events-none" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto glass-card p-12 md:p-20 rounded-3xl relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white relative z-10">Ready to Transform Your Hiring?</h2>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto relative z-10">
            Join hundreds of forward-thinking companies using TalentMatch to find the perfect candidates faster.
          </p>
          <Link 
            to="/dashboard" 
            className="inline-block bg-white text-slate-900 px-10 py-4 rounded-xl text-xl font-bold hover:bg-slate-100 transition-all duration-300 shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_-5px_rgba(255,255,255,0.5)] hover:-translate-y-1 relative z-10"
          >
            Get Started Free
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
