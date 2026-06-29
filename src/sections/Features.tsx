import React from 'react';
import { Shield, Search, Mail, Cpu, AlertTriangle, BarChart3 } from 'lucide-react';
import SectionTitle from '../components/SectionTitle';
import HoverCard from '../components/HoverCard';
import AnimatedContainer from '../components/AnimatedContainer';

const features = [
  {
    title: 'AI Detection',
    description: 'Neural network-based analysis that identifies polymorphic phishing attempts in real-time.',
    icon: <Cpu className="w-8 h-8 text-accent-primary" />,
  },
  {
    title: 'Threat Intelligence',
    description: 'Global database of malicious signatures and behavioral patterns updated every minute.',
    icon: <Shield className="w-8 h-8 text-accent-secondary" />,
  },
  {
    title: 'URL Analysis',
    description: 'Deep inspection of URL redirects, domain aging, and visual similarity to known brands.',
    icon: <Search className="w-8 h-8 text-accent-primary" />,
  },
  {
    title: 'Email Inspection',
    description: 'Advanced header analysis and NLP-based content scanning to detect social engineering.',
    icon: <Mail className="w-8 h-8 text-accent-secondary" />,
  },
  {
    title: 'Explainable AI',
    description: 'Get clear, human-readable insights into why a specific content was flagged as suspicious.',
    icon: <AlertTriangle className="w-8 h-8 text-accent-primary" />,
  },
  {
    title: 'Risk Assessment',
    description: 'Detailed scoring system providing multi-layered risk profiles for every scanned entity.',
    icon: <BarChart3 className="w-8 h-8 text-accent-secondary" />,
  },
];

const Features: React.FC = () => {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title="Intelligent Security Features"
          subtitle="Enterprise-grade phishing detection powered by advanced machine learning models."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <AnimatedContainer key={index} delay={index * 0.1}>
              <HoverCard>
                <div className="p-2 w-fit rounded-xl bg-white/5 mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold mb-3">{feature.title}</h3>
                  <p className="text-text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </HoverCard>
            </AnimatedContainer>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
