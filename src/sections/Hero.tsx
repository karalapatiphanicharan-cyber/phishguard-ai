import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, ArrowRight, Activity, Search } from 'lucide-react';
import GradientButton from '../components/GradientButton';

const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-primary/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-accent-secondary/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-sm font-bold mb-8"
          >
            <Shield className="w-4 h-4" />
            <span className="uppercase tracking-widest text-[10px]">Next-Gen Phishing Protection</span>
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-heading font-bold text-white leading-[1.1] mb-8">
            Detect Phishing <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary via-white to-accent-secondary animate-gradient-slow">
              Before It <br /> Detects You.
            </span>
          </h1>

          <p className="text-text-secondary text-xl md:text-2xl leading-relaxed mb-12 max-w-xl">
            Enterprise-grade phishing detection for URLs and emails using
            explainable heuristics and structural threat analysis. Protect your
            digital frontier with real-time intelligence.
          </p>

          <div className="flex flex-col sm:flex-row gap-6">
            <Link to="/url-scanner">
              <GradientButton className="group px-8 py-4">
                Analyze URL
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </GradientButton>
            </Link>
            <Link to="/email-scanner">
              <button className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                Analyze Email
              </button>
            </Link>
          </div>

          <div className="mt-16 flex items-center gap-8">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-background-primary bg-background-secondary overflow-hidden">
                  <img src={`https://i.pravatar.cc/150?u=pg${i}`} alt="User" />
                </div>
              ))}
            </div>
            <div className="text-sm text-text-secondary">
              <span className="text-white font-bold">10k+</span> Enterprise users secured
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative hidden lg:block"
        >
          <div className="relative z-10 w-full aspect-square max-w-2xl mx-auto">
            {/* Main Visual Component - Animated Shield */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[80%] h-[80%] rounded-[60px] border border-white/10 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-3xl relative overflow-hidden group shadow-2xl">
                 <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />

                 {/* Animated Core */}
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-64 bg-accent-primary/20 blur-[80px] rounded-full animate-pulse" />
                    <motion.div
                      animate={{
                        rotate: 360,
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                        scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                      }}
                      className="relative z-10"
                    >
                      <div className="w-48 h-48 rounded-[40px] border border-accent-primary/30 flex items-center justify-center relative">
                         <div className="absolute inset-0 border border-accent-secondary/30 rounded-[40px] rotate-45" />
                         <Shield className="w-24 h-24 text-accent-primary drop-shadow-[0_0_15px_rgba(0,229,255,0.5)]" />
                      </div>
                    </motion.div>
                 </div>

                 {/* Floating Data Nodes */}
                 <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-[20%] right-[20%] p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <Activity className="w-6 h-6 text-accent-secondary" />
                 </motion.div>
                 <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute bottom-[20%] left-[20%] p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <Search className="w-6 h-6 text-accent-primary" />
                 </motion.div>
              </div>
            </div>

            {/* Orbiting Elements */}
            <div className="absolute inset-0">
               {[0, 120, 240].map((deg, i) => (
                 <motion.div
                   key={i}
                   animate={{ rotate: 360 }}
                   transition={{ duration: 15 + i * 5, repeat: Infinity, ease: "linear" }}
                   className="absolute inset-0"
                 >
                   <div
                    className="w-4 h-4 rounded-full bg-accent-primary absolute"
                    style={{
                      top: '50%',
                      left: '100%',
                      transform: `rotate(${deg}deg) translateX(-50%)`,
                      boxShadow: '0 0 15px #00E5FF'
                    }}
                   />
                 </motion.div>
               ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
