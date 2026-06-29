import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Github } from 'lucide-react';
import { cn } from '../lib/utils';
import GradientButton from '../components/GradientButton';
import Logo from '../components/Logo';

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
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6',
        scrolled
          ? 'py-3 bg-background-primary/60 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20'
          : 'py-5 bg-transparent'
      )}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 group outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded-lg transition-all"
          aria-label="PhishGuard AI Home"
        >
          <Logo className="text-accent-primary transition-transform duration-300 group-hover:scale-110" size={32} />
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
                'text-sm font-medium transition-all duration-300 relative group/link outline-none focus-visible:text-accent-primary',
                location.pathname === link.href ? 'text-accent-primary' : 'text-text-secondary hover:text-white'
              )}
            >
              {link.label}
              <span className={cn(
                'absolute -bottom-1 left-0 h-0.5 bg-accent-primary transition-all duration-300',
                location.pathname === link.href ? 'w-full' : 'w-0 group-hover/link:w-full'
              )} />
            </Link>
          ))}
          <div className="h-4 w-px bg-white/10 mx-2" />
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded-lg p-1"
            aria-label="GitHub Repository"
          >
            <Github className="w-5 h-5" />
          </a>
          <GradientButton size="sm">Get Started</GradientButton>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-text-primary p-2 hover:bg-white/5 rounded-lg transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="md:hidden bg-background-primary/98 backdrop-blur-2xl border-b border-white/5 overflow-hidden shadow-2xl"
          >
            <div className="flex flex-col gap-4 p-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'text-lg font-medium outline-none focus-visible:text-accent-primary',
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
