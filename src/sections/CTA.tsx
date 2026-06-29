import React from 'react';
import { useNavigate } from 'react-router-dom';
import GradientButton from '../components/GradientButton';
import AnimatedContainer from '../components/AnimatedContainer';

const CTA: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden bg-card border border-white/10 p-12 md:p-20 text-center">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-accent-primary/5 blur-[100px] -z-10" />
          <div className="absolute bottom-0 left-0 w-1/2 h-full bg-accent-secondary/5 blur-[100px] -z-10" />

          <AnimatedContainer>
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">
              Ready to Analyze <br className="hidden md:block" />
              <span className="gradient-text">Suspicious Content?</span>
            </h2>
            <p className="text-text-secondary text-lg mb-10 max-w-2xl mx-auto">
              Join thousands of security-conscious users who trust PhishGuard AI to
              secure their digital perimeter.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <GradientButton size="lg" onClick={() => navigate('/url-scanner')}>
                Analyze URL
              </GradientButton>
              <GradientButton variant="secondary" size="lg" onClick={() => navigate('/email-scanner')}>
                Analyze Email
              </GradientButton>
            </div>
          </AnimatedContainer>
        </div>
      </div>
    </section>
  );
};

export default CTA;
