import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Brain, Search, Activity, Globe, Zap } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const features = [
  {
    icon: <Search className="w-8 h-8 text-accent-primary" />,
    title: 'Heuristic Detection',
    description: 'Advanced behavioral pattern matching to identify zero-day phishing attempts.'
  },
  {
    icon: <Activity className="w-8 h-8 text-accent-secondary" />,
    title: 'Structural Analysis',
    description: 'Deep inspection of URL construction, encoding, and technical indicators.'
  },
  {
    icon: <Shield className="w-8 h-8 text-accent-primary" />,
    title: 'Brand Protection',
    description: 'Automated detection of typosquatting and visual brand impersonation.'
  },
  {
    icon: <Globe className="w-8 h-8 text-accent-secondary" />,
    title: 'Network Intelligence',
    description: 'DNS-level analysis, TLD reputation, and server origin verification.'
  },
  {
    icon: <Brain className="w-8 h-8 text-accent-primary" />,
    title: 'Behavioral Security',
    description: 'Identification of social engineering tactics and manipulative linguistics.'
  },
  {
    icon: <Zap className="w-8 h-8 text-accent-secondary" />,
    title: 'Explainable Intel',
    description: 'Every risk score is backed by granular technical evidence and reasoning.'
  }
];

const Features: React.FC = () => {
  return (
    <section className="py-24 px-6 relative" id="features">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-heading font-bold text-white mb-6"
          >
            Multi-Layered <span className="text-accent-primary">Security Stack</span>
          </motion.h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            PhishGuard Enterprise combines multiple specialized detection layers
            to provide comprehensive protection against digital fraud.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="group hover:border-accent-primary/50 transition-all duration-500">
                <div className="mb-6 p-4 rounded-2xl bg-white/5 w-fit group-hover:bg-accent-primary/10 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-heading font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-text-secondary leading-relaxed">{feature.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
