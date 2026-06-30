import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Inbox, MousePointer2 } from 'lucide-react';
import GlassCard from './GlassCard';

interface EmptyStateProps {
  type: 'url' | 'email';
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ type }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto mt-12"
    >
      <GlassCard className="p-12 text-center flex flex-col items-center gap-6 border-dashed border-2 border-white/10">
        <div className="relative">
          <div className="absolute inset-0 bg-accent-primary/20 blur-3xl rounded-full" />
          <div className="relative w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent-primary">
            {type === 'url' ? <ShieldAlert className="w-10 h-10" /> : <Inbox className="w-10 h-10" />}
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-heading font-bold text-white">No Analysis Yet</h3>
          <p className="text-text-secondary max-w-sm mx-auto">
            Paste a {type === 'url' ? 'URL' : 'suspicious email'} above to begin the security intelligence analysis.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-accent-primary uppercase tracking-widest bg-accent-primary/5 px-4 py-2 rounded-full border border-accent-primary/20">
          <MousePointer2 className="w-3 h-3" />
          Awaiting Input
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default EmptyState;
