import React from 'react';
import { Shield, Lock, Search } from 'lucide-react';
import GradientButton from '../components/GradientButton';
import AnimatedContainer from '../components/AnimatedContainer';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <AnimatedContainer direction="right">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            <span>Next-Gen Phishing Protection</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight text-white">
            Detect Phishing <br />
            <span className="bg-gradient-to-r from-[#00E5FF] via-[#7C3AED] to-[#00E5FF] bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-slow">
              Before It Detects You.
            </span>
          </h1>
          <p className="text-text-secondary text-lg md:text-xl mb-10 max-w-xl leading-relaxed">
            AI-powered phishing detection for URLs and emails using explainable AI
            and intelligent threat analysis. Protect your digital identity with
            enterprise-grade security.
          </p>
          <div className="flex flex-wrap gap-4">
            <GradientButton size="lg" onClick={() => navigate('/url-scanner')}>
              Analyze URL
            </GradientButton>
            <GradientButton variant="secondary" size="lg" onClick={() => navigate('/email-scanner')}>
              Analyze Email
            </GradientButton>
          </div>
        </AnimatedContainer>

        <AnimatedContainer direction="left" className="relative hidden lg:block">
          <div className="relative w-full aspect-square max-w-lg mx-auto">
            {/* Cybersecurity Illustration with SVG/CSS */}
            <div className="absolute inset-0 bg-accent-primary/5 rounded-full animate-pulse" />
            <svg viewBox="0 0 200 200" className="w-full h-full text-accent-primary drop-shadow-[0_0_30px_rgba(0,229,255,0.2)]">
              <defs>
                <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* Outer rotating rings */}
              <motion.circle
                cx="100" cy="100" r="90"
                fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="20 40"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.circle
                cx="100" cy="100" r="80"
                fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="10 30"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />

              {/* Radar sweep */}
              <motion.path
                d="M100 100 L100 20"
                stroke="url(#shieldGrad)"
                strokeWidth="1"
                strokeLinecap="round"
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                style={{ originX: "100px", originY: "100px" }}
              />

              <path
                d="M100 20 L40 45 L40 100 C40 145 100 180 100 180 C100 180 160 145 160 100 L160 45 L100 20 Z"
                fill="none"
                stroke="url(#shieldGrad)"
                strokeWidth="2"
              />

              <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />

              <motion.g
                animate={{
                  y: [0, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <rect x="85" y="85" width="30" height="30" rx="4" fill="url(#shieldGrad)" className="drop-shadow-[0_0_15px_rgba(0,229,255,0.4)]" />
                <path d="M95 100 L98 103 L105 96" stroke="white" strokeWidth="2" fill="none" />
              </motion.g>

              {/* Floating elements */}
              {[...Array(5)].map((_, i) => (
                <motion.circle
                  key={i}
                  cx={100 + Math.cos(i * 1.2) * 80}
                  cy={100 + Math.sin(i * 1.2) * 80}
                  r="3"
                  fill="currentColor"
                  animate={{
                    opacity: [0.2, 1, 0.2],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.5,
                    repeat: Infinity,
                  }}
                />
              ))}
            </svg>

            {/* Floating Cards */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 right-0 glass-card p-4 flex items-center gap-3"
            >
              <Search className="w-5 h-5 text-accent-primary" />
              <span className="text-xs font-medium">Scanning URL...</span>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-10 left-0 glass-card p-4 flex items-center gap-3"
            >
              <Lock className="w-5 h-5 text-accent-secondary" />
              <span className="text-xs font-medium">Threat Blocked</span>
            </motion.div>
          </div>
        </AnimatedContainer>
      </div>
    </section>
  );
};

export default Hero;
