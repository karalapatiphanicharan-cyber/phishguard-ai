import React from 'react';
import { motion } from 'framer-motion';

interface ConfidenceBarProps {
  confidence: string; // "Low", "Medium", "High"
}

const ConfidenceBar: React.FC<ConfidenceBarProps> = ({ confidence }) => {
  const getPercentage = () => {
    switch (confidence.toLowerCase()) {
      case 'high': return 95;
      case 'medium': return 65;
      case 'low': return 35;
      default: return 50;
    }
  };

  const getColor = () => {
    switch (confidence.toLowerCase()) {
      case 'high': return 'bg-success';
      case 'medium': return 'bg-warning';
      case 'low': return 'bg-danger';
      default: return 'bg-accent-primary';
    }
  };

  const percentage = getPercentage();

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">AI Confidence Meter</span>
        <span className={`text-xs font-bold uppercase ${
          confidence.toLowerCase() === 'high' ? 'text-success' :
          confidence.toLowerCase() === 'medium' ? 'text-warning' : 'text-danger'
        }`}>
          {confidence} ({percentage}%)
        </span>
      </div>
      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${getColor()} shadow-[0_0_10px_rgba(0,0,0,0.5)]`}
        />
      </div>
    </div>
  );
};

export default ConfidenceBar;
