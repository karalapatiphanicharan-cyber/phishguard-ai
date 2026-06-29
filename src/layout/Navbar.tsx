import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Menu, X, Github } from 'lucide-react';
import { cn } from '../lib/utils';
import GradientButton from '../components/GradientButton';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'URL Scanner', href: '/url-scanner' },
    { label: 'Email Scanner', href: '/email-scanner' },
    { label: 'About', href: '/about' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4',
        scrolled ? 'bg-background-primary/80 backdrop-blur-lg border-b border-white/10' : 'bg-transparent'
      )}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-xl bg-accent-primary/10 group-hover:bg-accent-primary/20 transition-colors">
            <Shield className="w-6 h-6 text-accent-primary" />
          </div>
          <span className="text-xl font-heading font-bold tracking-tight">
            PhishGuard <span className="text-accent-primary">AI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-accent-primary',
                location.pathname === link.href ? 'text-accent-primary' : 'text-text-secondary'
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="h-4 w-px bg-white/10 mx-2" />
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-white transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
          <GradientButton size="sm">Get Started</GradientButton>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-text-primary"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background-primary/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col gap-4 p-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'text-lg font-medium',
                    location.pathname === link.href ? 'text-accent-primary' : 'text-text-secondary'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                <GradientButton className="w-full">Get Started</GradientButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
