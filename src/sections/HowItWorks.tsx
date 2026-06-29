import React from 'react';
import { Type, Cpu, ShieldAlert, FileText, ArrowRight } from 'lucide-react';
import SectionTitle from '../components/SectionTitle';
import AnimatedContainer from '../components/AnimatedContainer';

const steps = [
  {
    title: 'Input',
    description: 'Provide a suspicious URL or email content for analysis.',
    icon: <Type className="w-6 h-6" />,
  },
  {
    title: 'AI Analysis',
    description: 'Our neural networks inspect patterns, headers, and metadata.',
    icon: <Cpu className="w-6 h-6" />,
  },
  {
    title: 'Threat Detection',
    description: 'Models identify risks using global threat intelligence.',
    icon: <ShieldAlert className="w-6 h-6" />,
  },
  {
    title: 'Security Report',
    description: 'Receive a detailed risk assessment and explanation.',
    icon: <FileText className="w-6 h-6" />,
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title="How PhishGuard Works"
          subtitle="A seamless process from suspicious input to actionable intelligence."
        />

        <div className="relative mt-20">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-accent-primary/20 via-accent-secondary/20 to-accent-primary/20" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {steps.map((step, index) => (
              <AnimatedContainer key={index} delay={index * 0.15} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-2xl bg-card border border-white/10 flex items-center justify-center mb-8 relative group">
                  <div className="absolute inset-0 rounded-2xl bg-accent-primary opacity-0 group-hover:opacity-10 blur-xl transition-opacity" />
                  <div className="text-accent-primary group-hover:scale-110 transition-transform">
                    {step.icon}
                  </div>

                  {/* Step Number Badge */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-lg bg-accent-secondary flex items-center justify-center text-xs font-bold text-white shadow-lg">
                    {index + 1}
                  </div>
                </div>

                <h3 className="text-xl font-heading font-bold mb-3">{step.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed max-w-[200px]">
                  {step.description}
                </p>

                {/* Mobile Arrow */}
                {index < steps.length - 1 && (
                  <div className="mt-8 lg:hidden text-accent-primary/30">
                    <ArrowRight className="rotate-90" />
                  </div>
                )}
              </AnimatedContainer>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
