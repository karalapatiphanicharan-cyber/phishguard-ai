import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import GradientButton from '../components/GradientButton';

const CTA: React.FC = () => {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-accent-primary/20 blur-[150px] -z-10 animate-pulse" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-accent-secondary/20 blur-[150px] -z-10 animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-12 md:p-20 rounded-[40px] bg-white/5 border border-white/10 backdrop-blur-xl text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 via-transparent to-accent-secondary/5" />

          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-8 relative z-10">
            Ready to Harden Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary">
              Digital Defense?
            </span>
          </h2>

          <p className="text-text-secondary text-lg mb-12 max-w-2xl mx-auto relative z-10">
            Join thousands of security-conscious organizations who trust PhishGuard Enterprise to
            detect and mitigate sophisticated phishing threats in real-time.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
            <Link to="/url-scanner">
              <GradientButton className="px-10 py-4 text-lg">
                Get Started Now
              </GradientButton>
            </Link>
            <button className="px-10 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all text-lg">
              Contact Sales
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
