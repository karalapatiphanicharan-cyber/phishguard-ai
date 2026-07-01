import React from 'react';
import { motion } from 'framer-motion';
import { Search, ShieldCheck, Brain, FileText } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const steps = [
  {
    icon: <Search className="w-6 h-6" />,
    title: 'Data Ingestion',
    description: 'Securely extract structural and linguistic features from the target URL or email content.',
    color: 'text-accent-primary',
    delay: 0
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: 'Heuristic Engine',
    description: 'Execute hundreds of behavioral and structural security checks across 20+ specialized detectors.',
    color: 'text-accent-secondary',
    delay: 0.1
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: 'Threat Intelligence',
    description: 'Correlate findings to identify specific attack vectors and calculate the precise risk profile.',
    color: 'text-accent-primary',
    delay: 0.2
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: 'SecOps Reporting',
    description: 'Generate professional executive summaries and technical countermeasures for incident response.',
    color: 'text-accent-secondary',
    delay: 0.3
  }
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-24 px-6 relative overflow-hidden" id="how-it-works">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-accent-primary font-bold uppercase tracking-widest text-sm"
          >
            Methodology
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-heading font-bold text-white mt-4 mb-6"
          >
            Enterprise Grade Analysis
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-text-secondary text-lg max-w-2xl mx-auto"
          >
            PhishGuard uses a proprietary multi-layered heuristic engine to analyze
            digital assets in real-time, providing explainable security intelligence.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: step.delay }}
            >
              <GlassCard className="h-full relative group">
                <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-background-primary border border-white/10 flex items-center justify-center font-heading font-bold text-text-secondary">
                  0{index + 1}
                </div>
                <div className={`mb-6 p-3 rounded-2xl bg-white/5 w-fit ${step.color} group-hover:scale-110 transition-transform duration-500`}>
                  {step.icon}
                </div>
                <h3 className="text-xl font-heading font-bold text-white mb-4">{step.title}</h3>
                <p className="text-text-secondary leading-relaxed">{step.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
