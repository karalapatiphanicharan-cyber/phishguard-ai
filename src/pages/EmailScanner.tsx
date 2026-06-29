import React, { useState } from 'react';
import { FileSearch, MessageSquareText, ShieldCheck } from 'lucide-react';
import AnimatedContainer from '../components/AnimatedContainer';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';
import SectionTitle from '../components/SectionTitle';

const EmailScanner: React.FC = () => {
  const [content, setContent] = useState('');

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <AnimatedContainer>
        <SectionTitle
          title="Email Content Inspector"
          subtitle="Paste email headers or body to detect sophisticated social engineering attempts."
          align="center"
        />
      </AnimatedContainer>

      <AnimatedContainer delay={0.2} className="max-w-4xl mx-auto mb-16">
        <GlassCard className="p-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-text-secondary ml-1">Email Body or Headers</label>
              <textarea
                rows={8}
                placeholder="Paste the email content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-background-primary border border-white/10 rounded-xl py-4 px-4 focus:outline-none focus:ring-2 focus:ring-accent-primary/50 transition-all resize-none"
              />
            </div>
            <GradientButton className="w-full py-4 text-lg">
              Run Threat Scan
            </GradientButton>
          </div>
        </GlassCard>
      </AnimatedContainer>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            icon: <MessageSquareText className="text-accent-primary" />,
            title: "Sentiment Analysis",
            desc: "Detects urgency, fear, and other common social engineering emotions."
          },
          {
            icon: <FileSearch className="text-accent-secondary" />,
            title: "Header Inspection",
            desc: "Validates SPF, DKIM, and DMARC records to prevent spoofing."
          },
          {
            icon: <ShieldCheck className="text-accent-primary" />,
            title: "Malicious Intent",
            desc: "Identifies requests for credentials, money transfers, or sensitive data."
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

export default EmailScanner;
