import React from 'react';
import { motion } from 'framer-motion';

interface RecommendationCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ icon, title, description }) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-accent-primary/30 hover:bg-accent-primary/5 transition-all group"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-white/5 group-hover:bg-accent-primary/10 text-accent-primary transition-colors">
          {icon}
        </div>
        <div className="flex flex-col gap-1">
          <h5 className="text-sm font-bold text-white group-hover:text-accent-primary transition-colors">{title}</h5>
          <p className="text-xs text-text-secondary leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default RecommendationCard;
