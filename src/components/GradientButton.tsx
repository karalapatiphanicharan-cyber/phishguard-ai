import React from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { cn } from '../lib/utils';

interface GradientButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const GradientButton: React.FC<GradientButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white shadow-lg shadow-accent-primary/20',
    secondary: 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm',
    outline: 'border border-accent-primary/50 text-accent-primary hover:bg-accent-primary/10',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg font-semibold',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'relative overflow-hidden rounded-full transition-all duration-300',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {variant === 'primary' && (
        <motion.div
          className="absolute inset-0 bg-white/20"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.5 }}
        />
      )}
    </motion.button>
  );
};

export default GradientButton;
