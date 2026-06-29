import React, { useState } from 'react';
import { Search, Shield, Globe, ExternalLink } from 'lucide-react';
import AnimatedContainer from '../components/AnimatedContainer';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';
import SectionTitle from '../components/SectionTitle';

const UrlScanner: React.FC = () => {
  const [url, setUrl] = useState('');

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <AnimatedContainer>
        <SectionTitle
          title="URL Threat Analyzer"
          subtitle="Deep scan URLs for phishing, malware, and social engineering indicators."
          align="center"
        />
      </AnimatedContainer>

      <AnimatedContainer delay={0.2} className="max-w-3xl mx-auto mb-16">
        <GlassCard className="p-8">
          <div className="flex flex-col gap-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-secondary">
                <Globe className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="https://suspicious-link.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-background-primary border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-accent-primary/50 transition-all"
              />
            </div>
            <GradientButton className="w-full py-4 text-lg">
              Start Analysis
            </GradientButton>
          </div>
        </GlassCard>
      </AnimatedContainer>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            icon: <Search className="text-accent-primary" />,
            title: "Domain Intelligence",
            desc: "Analyzes domain age, registrar reputation, and DNS health."
          },
          {
            icon: <Shield className="text-accent-secondary" />,
            title: "Visual Matching",
            desc: "Compares page layout against top 500 targeted brands."
          },
          {
            icon: <ExternalLink className="text-accent-primary" />,
            title: "Redirect Tracing",
            desc: "Follows deep redirect chains to uncover hidden malicious payloads."
          }
        ].map((item, i) => (
          <AnimatedContainer key={i} delay={0.4 + i * 0.1}>
            <GlassCard className="h-full">
              <div className="p-2 rounded-lg bg-white/5 w-fit mb-4">
                {item.icon}
              </div>
              <h3 className="text-xl font-heading font-bold mb-2">{item.title}</h3>
              <p className="text-text-secondary text-sm">{item.desc}</p>
            </GlassCard>
          </AnimatedContainer>
        ))}
      </div>
    </div>
  );
};

export default UrlScanner;
