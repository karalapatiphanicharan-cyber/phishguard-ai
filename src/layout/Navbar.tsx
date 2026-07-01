import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../components/Logo';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'URL Scanner', path: '/url-scanner' },
    { name: 'Email Scanner', path: '/email-scanner' },
    { name: 'Intelligence', path: '/dashboard' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 ${
        isScrolled ? 'py-4' : 'py-8'
      }`}
    >
      <div className={`max-w-7xl mx-auto rounded-2xl transition-all duration-500 flex items-center justify-between px-8 ${
        isScrolled ? 'bg-background-secondary/80 backdrop-blur-xl border border-white/10 shadow-2xl py-3' : 'bg-transparent py-0'
      }`}>
        <Link
          to="/"
          className="flex items-center gap-3 group outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded-lg"
          aria-label="PhishGuard Home"
        >
          <Logo size={32} className="text-accent-primary group-hover:rotate-12 transition-transform" />
          <span className="text-2xl font-heading font-bold text-white tracking-tighter">
            PhishGuard <span className="text-accent-primary underline decoration-2 underline-offset-4">Enterprise</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all outline-none focus-visible:ring-2 focus-visible:ring-accent-primary ${
                location.pathname === link.path
                  ? 'text-accent-primary bg-accent-primary/10'
                  : 'text-text-secondary hover:text-white hover:bg-white/5'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="w-px h-6 bg-white/10 mx-4" />
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-text-secondary hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded-lg"
            aria-label="GitHub Repository"
          >
            <Github className="w-5 h-5" />
          </a>
          <Link to="/url-scanner" className="ml-4">
            <button className="px-6 py-2.5 rounded-xl bg-accent-primary text-background-primary font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)]">
              Get Started
            </button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-white outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded-lg"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-full left-6 right-6 mt-4 rounded-2xl bg-background-secondary border border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl font-bold transition-all ${
                    location.pathname === link.path
                      ? 'text-accent-primary bg-accent-primary/10'
                      : 'text-text-secondary hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-white/10 my-2" />
              <Link to="/url-scanner" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="w-full py-4 rounded-xl bg-accent-primary text-background-primary font-bold shadow-lg">
                  Get Started Now
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
