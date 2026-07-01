import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Search, Zap, Brain, ShieldCheck } from 'lucide-react';

const Timeline: React.FC = () => {
  const steps = [
    { icon: <Search className="w-4 h-4" />, label: 'Input Received', desc: 'Secure data ingestion complete.' },
    { icon: <Zap className="w-4 h-4" />, label: 'Feature Extraction', desc: 'Analyzing structural elements.' },
    { icon: <ShieldCheck className="w-4 h-4" />, label: 'Heuristic Analysis', desc: 'Pattern matching active.' },
    { icon: <Brain className="w-4 h-4" />, label: 'Deep Analysis', desc: 'Enterprise security reasoning.' },
    { icon: <CheckCircle2 className="w-4 h-4" />, label: 'Report Generated', desc: 'Final classification ready.' },
  ];

  return (
    <div className="relative py-4">
      <div className="absolute left-[23px] top-4 bottom-4 w-px bg-white/10" />
      <div className="space-y-8">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
            className="flex items-start gap-6 relative"
          >
            <div className="z-10 flex items-center justify-center w-12 h-12 rounded-xl bg-background-primary border border-white/10 text-accent-primary">
              {step.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white">{step.label}</span>
              <span className="text-xs text-text-secondary">{step.desc}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
