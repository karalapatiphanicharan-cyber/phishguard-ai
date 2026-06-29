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
      whileHover={hover ? { y: -5, borderColor: 'rgba(0, 229, 255, 0.3)' } : {}}
      className={cn(
        'glass-card p-6 transition-colors duration-300 relative z-10',
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
