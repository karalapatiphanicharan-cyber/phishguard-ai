import React from 'react';
import { cn } from '../lib/utils';
import type { RiskLevel } from '../types';

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
}

const RiskBadge: React.FC<RiskBadgeProps> = ({ level, className }) => {
  const configs = {
    low: { color: 'bg-success/20 text-success border-success/30', label: 'Low Risk' },
    medium: { color: 'bg-warning/20 text-warning border-warning/30', label: 'Medium Risk' },
    high: { color: 'bg-danger/20 text-danger border-danger/30', label: 'High Risk' },
    critical: { color: 'bg-danger/40 text-danger border-danger/50 animate-pulse', label: 'Critical' },
  };

  const config = configs[level];

  return (
    <span
      className={cn(
        'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border',
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
};

export default RiskBadge;
