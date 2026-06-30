import React from 'react';
import { Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface SecurityChecklistProps {
  checks: { label: string; status: boolean }[];
}

const SecurityChecklist: React.FC<SecurityChecklistProps> = ({ checks }) => {
  return (
    <div className="space-y-3">
      {checks.map((check, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5"
        >
          <span className="text-xs text-text-secondary font-medium">{check.label}</span>
          <div className={`p-1 rounded-md ${check.status ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
            {check.status ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SecurityChecklist;
