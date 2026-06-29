import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Github, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-background-primary border-t border-white/5 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <Shield className="w-8 h-8 text-accent-primary" />
              <span className="text-2xl font-heading font-bold">PhishGuard AI</span>
            </Link>
            <p className="text-text-secondary max-w-sm mb-8">
              Empowering organizations with AI-driven threat intelligence to detect and prevent
              phishing attacks before they compromise your security.
            </p>
            <div className="flex gap-4">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-2 rounded-lg bg-white/5 hover:bg-accent-primary/10 hover:text-accent-primary transition-all"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading font-bold mb-6">Platform</h4>
            <ul className="space-y-4">
              <li><Link to="/url-scanner" className="text-text-secondary hover:text-accent-primary transition-colors">URL Scanner</Link></li>
              <li><Link to="/email-scanner" className="text-text-secondary hover:text-accent-primary transition-colors">Email Scanner</Link></li>
              <li><Link to="#" className="text-text-secondary hover:text-accent-primary transition-colors">API Reference</Link></li>
              <li><Link to="#" className="text-text-secondary hover:text-accent-primary transition-colors">Documentation</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-text-secondary hover:text-accent-primary transition-colors">About Us</Link></li>
              <li><Link to="#" className="text-text-secondary hover:text-accent-primary transition-colors">Careers</Link></li>
              <li><Link to="#" className="text-text-secondary hover:text-accent-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="text-text-secondary hover:text-accent-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-secondary text-sm">
            © {new Date().getFullYear()} PhishGuard AI. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link to="#" className="text-text-secondary hover:text-white text-sm transition-colors">Status</Link>
            <Link to="#" className="text-text-secondary hover:text-white text-sm transition-colors">Cookie Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
