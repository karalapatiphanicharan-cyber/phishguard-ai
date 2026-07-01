import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-background-primary border-t border-white/5 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6 group outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded-lg w-fit" aria-label="PhishGuard Enterprise Home">
              <Shield className="w-8 h-8 text-accent-primary group-hover:rotate-12 transition-transform" />
              <span className="text-2xl font-heading font-bold">PhishGuard</span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed mb-8">
              Empowering organizations with behavioral threat intelligence to detect and prevent
              sophisticated phishing attacks before they cause damage.
            </p>
            <div className="flex gap-4">
              {[Github, Twitter, Linkedin, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary hover:text-accent-primary hover:border-accent-primary/50 transition-all"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Platform</h4>
            <ul className="space-y-4">
              <li><Link to="/url-scanner" className="text-text-secondary hover:text-accent-primary transition-colors text-sm">URL Analyzer</Link></li>
              <li><Link to="/email-scanner" className="text-text-secondary hover:text-accent-primary transition-colors text-sm">Email Intelligence</Link></li>
              <li><Link to="/dashboard" className="text-text-secondary hover:text-accent-primary transition-colors text-sm">Intelligence Center</Link></li>
              <li><Link to="/" className="text-text-secondary hover:text-accent-primary transition-colors text-sm">API Documentation</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Resources</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-text-secondary hover:text-accent-primary transition-colors text-sm">Threat Reports</a></li>
              <li><a href="#" className="text-text-secondary hover:text-accent-primary transition-colors text-sm">Security Blog</a></li>
              <li><a href="#" className="text-text-secondary hover:text-accent-primary transition-colors text-sm">Case Studies</a></li>
              <li><a href="#" className="text-text-secondary hover:text-accent-primary transition-colors text-sm">Help Center</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Company</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-text-secondary hover:text-accent-primary transition-colors text-sm">About Us</Link></li>
              <li><a href="#" className="text-text-secondary hover:text-accent-primary transition-colors text-sm">Careers</a></li>
              <li><a href="#" className="text-text-secondary hover:text-accent-primary transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-text-secondary hover:text-accent-primary transition-colors text-sm">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:row justify-between items-center gap-6">
          <p className="text-text-secondary text-xs">
            © {new Date().getFullYear()} PhishGuard Enterprise. All rights reserved.
          </p>
          <div className="flex gap-8">
            <span className="text-[10px] text-text-secondary uppercase tracking-[0.2em]">Secure Infrastructure</span>
            <span className="text-[10px] text-text-secondary uppercase tracking-[0.2em]">Zero-Knowledge Analysis</span>
            <span className="text-[10px] text-text-secondary uppercase tracking-[0.2em]">Enterprise Grade</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
