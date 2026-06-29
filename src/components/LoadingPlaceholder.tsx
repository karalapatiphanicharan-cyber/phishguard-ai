import React from 'react';
import { cn } from '../lib/utils';

interface LoadingPlaceholderProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
}

const LoadingPlaceholder: React.FC<LoadingPlaceholderProps> = ({
  className,
  variant = 'rect',
}) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-white/5',
        {
          'h-4 w-full rounded': variant === 'text',
          'h-24 w-full rounded-xl': variant === 'rect',
          'h-12 w-12 rounded-full': variant === 'circle',
        },
        className
      )}
    />
  );
};

export default LoadingPlaceholder;
