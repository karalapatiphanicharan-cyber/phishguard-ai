import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  align = 'center',
  className,
}) => {
  const alignment = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right',
  };

  return (
    <div className={cn('mb-12 max-w-3xl relative z-20', alignment[align], className)}>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl md:text-5xl font-heading font-bold mb-4 gradient-text"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-text-secondary text-lg"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};

export default SectionTitle;
