import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface HoverCardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
}

const HoverCard: React.FC<HoverCardProps> = ({ children, className, gradient = true }) => {
  return (
    <div className={cn('group relative h-full', className)}>
      {gradient && (
        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-accent-primary to-accent-secondary opacity-0 blur transition duration-500 group-hover:opacity-30" />
      )}
      <motion.div
        className="relative flex h-full flex-col justify-between rounded-2xl bg-card p-8 transition-colors duration-300 group-hover:bg-card/80"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default HoverCard;
