import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className, hover = true }) => {
  return (
    <motion.div
      whileHover={hover ? {
        y: -8,
        borderColor: 'rgba(0, 229, 255, 0.4)',
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 229, 255, 0.1)'
      } : {}}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className={cn(
        'glass-card p-8 rounded-2xl transition-all duration-500 relative z-10 border border-white/5 shadow-xl',
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
