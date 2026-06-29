import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

interface LoadingScreenProps {
  children: React.ReactNode;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('Initializing AI Security Engine...');

  useEffect(() => {
    const timer1 = setTimeout(() => setStatus('Loading Threat Intelligence...'), 400);
    const timer2 = setTimeout(() => setLoading(false), 1000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background-primary"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mb-8"
            >
              <Logo size={80} className="text-accent-primary" />
            </motion.div>

            <div className="flex flex-col items-center gap-4">
              <h2 className="text-2xl font-heading font-bold text-white tracking-widest">
                PHISHGUARD AI
              </h2>
              <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="h-full bg-accent-primary shadow-[0_0_10px_#00E5FF]"
                />
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-text-secondary text-sm font-medium h-4"
              >
                {status}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {!loading && children}
    </>
  );
};

export default LoadingScreen;
