import React from 'react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  index?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="glass-card p-6 rounded-2xl relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="w-14 h-14 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center mb-6 relative z-10 group-hover:border-primary/50 transition-colors shadow-lg">
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="text-xl font-semibold text-slate-100 mb-3 relative z-10">{title}</h3>
      <p className="text-slate-400 leading-relaxed relative z-10">{description}</p>
    </motion.div>
  );
};

export default FeatureCard;
