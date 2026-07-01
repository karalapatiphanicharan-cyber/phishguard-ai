import React from 'react';
import { Target, Users, Zap } from 'lucide-react';
import AnimatedContainer from '../components/AnimatedContainer';
import SectionTitle from '../components/SectionTitle';
import GlassCard from '../components/GlassCard';

const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <AnimatedContainer>
        <SectionTitle
          title="About PhishGuard Enterprise"
          subtitle="Our mission is to democratize elite-level cybersecurity intelligence."
        />
      </AnimatedContainer>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
        <AnimatedContainer direction="right">
          <h2 className="text-3xl font-heading font-bold mb-6">Securing the Digital Frontier</h2>
          <p className="text-text-secondary text-lg mb-6 leading-relaxed">
            PhishGuard was born out of a simple observation: as phishing attacks
            become more sophisticated, the tools to combat them must evolve faster.
          </p>
          <p className="text-text-secondary text-lg mb-8 leading-relaxed">
            We leverage state-of-the-art heuristic engines and structural analysis
            to identify malicious intent that traditional signature-based systems miss.
            Our focus is on "Explainable Security"—not just telling you something is
            dangerous, but showing you exactly why using advanced behavioral heuristics.
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-3xl font-heading font-bold text-accent-primary mb-1">99.9%</div>
              <div className="text-sm text-text-secondary">Detection Rate</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-3xl font-heading font-bold text-accent-secondary mb-1">50ms</div>
              <div className="text-sm text-text-secondary">Analysis Speed</div>
            </div>
          </div>
        </AnimatedContainer>

        <AnimatedContainer direction="left">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-accent-primary to-accent-secondary opacity-20 blur-[80px] -z-10" />
            <img
              src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000"
              alt="Cybersecurity"
              className="rounded-3xl border border-white/10 shadow-2xl"
            />
          </div>
        </AnimatedContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            icon: <Target className="w-8 h-8 text-accent-primary" />,
            title: "Precision First",
            desc: "Reducing false positives while maintaining maximum sensitivity."
          },
          {
            icon: <Zap className="w-8 h-8 text-accent-secondary" />,
            title: "Speed at Scale",
            desc: "Real-time analysis that doesn't slow down your workflow."
          },
          {
            icon: <Users className="w-8 h-8 text-accent-primary" />,
            title: "Community Driven",
            desc: "Learning from millions of reported threats globally."
          }
        ].map((v, i) => (
          <AnimatedContainer key={i} delay={i * 0.1}>
            <GlassCard className="text-center flex flex-col items-center">
              <div className="mb-6">{v.icon}</div>
              <h3 className="text-xl font-heading font-bold mb-3">{v.title}</h3>
              <p className="text-text-secondary">{v.desc}</p>
            </GlassCard>
          </AnimatedContainer>
        ))}
      </div>
    </div>
  );
};

export default About;
