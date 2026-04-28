import React from 'react';
import { motion } from 'framer-motion';

interface TestimonialProps {
  name: string;
  role: string;
  content: string;
  avatar: string;
  index?: number;
}

const Testimonial: React.FC<TestimonialProps> = ({ name, role, content, avatar, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass-card p-8 rounded-2xl relative"
    >
      <div className="absolute top-0 right-0 p-8 text-6xl text-slate-800/50 font-serif leading-none opacity-50">"</div>
      
      <div className="flex items-center mb-6 relative z-10">
        <div className="w-14 h-14 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl mr-4 shadow-inner">
          {avatar}
        </div>
        <div>
          <h4 className="font-semibold text-slate-100">{name}</h4>
          <p className="text-sm text-slate-400">{role}</p>
        </div>
      </div>
      <p className="text-slate-300 italic relative z-10 leading-relaxed text-lg">"{content}"</p>
      <div className="flex mt-6 text-indigo-400 relative z-10 gap-1">
        {'★★★★★'.split('').map((star, i) => (
          <motion.span 
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + (i * 0.1) }}
          >
            {star}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
};

export default Testimonial;
