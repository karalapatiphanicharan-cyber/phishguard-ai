import React, { useState, useEffect } from 'react';
import { Search, Shield, Globe, ExternalLink, AlertTriangle, CheckCircle, Info, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedContainer from '../components/AnimatedContainer';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';
import SectionTitle from '../components/SectionTitle';
import type { URLAnalysisResponse, RiskLevel } from '../types';
import RiskBadge from '../components/RiskBadge';

const UrlScanner: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<URLAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('Checking URL...');

  const loadingMessages = [
    'Checking URL...',
    'Analyzing domain...',
    'Extracting features...',
    'Running heuristic checks...',
    'Generating report...',
  ];

  useEffect(() => {
    let interval: any;
    if (loading) {
      let index = 0;
      interval = setInterval(() => {
        index = (index + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[index]);
      }, 800);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleAnalyze = async () => {
    if (!url) {
      setError('Please enter a URL to analyze.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:8000/api/analyze-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to analyze URL');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevel = (score: number): RiskLevel => {
    if (score <= 30) return 'low';
    if (score <= 60) return 'medium';
    if (score <= 80) return 'high';
    return 'critical';
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 min-h-screen">
      <AnimatedContainer>
        <SectionTitle
          title="URL Threat Analyzer"
          subtitle="Deep scan URLs for phishing, malware, and social engineering indicators using intelligent heuristics."
          align="center"
        />
      </AnimatedContainer>

      <AnimatedContainer delay={0.2} className="max-w-3xl mx-auto mb-16">
        <GlassCard className="p-8">
          <div className="flex flex-col gap-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-secondary">
                <Globe className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="https://suspicious-link.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                disabled={loading}
                className="w-full bg-background-primary border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-accent-primary/50 transition-all text-white disabled:opacity-50"
              />
            </div>
            <GradientButton
              className="w-full py-4 text-lg"
              onClick={handleAnalyze}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{loadingMessage}</span>
                </div>
              ) : (
                'Start Analysis'
              )}
            </GradientButton>
          </div>
        </GlassCard>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger flex items-center gap-3"
          >
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </motion.div>
        )}
      </AnimatedContainer>

      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Main Result Card */}
            <div className="lg:col-span-2 space-y-8">
              <GlassCard className="p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                  <div>
                    <h3 className="text-2xl font-heading font-bold text-white mb-2">Analysis Results</h3>
                    <p className="text-text-secondary text-sm break-all">{url}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <RiskBadge level={getRiskLevel(result.risk_score)} />
                    <span className="text-xs font-medium text-text-secondary">Score: {result.risk_score}/100</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                    <h4 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4">Classification</h4>
                    <div className="text-2xl font-heading font-bold text-white">{result.classification}</div>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                    <h4 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4">Recommendation</h4>
                    <div className="text-sm text-text-primary leading-relaxed">{result.recommendation}</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Detected Issues ({result.detected_issues.length})
                  </h4>
                  <div className="space-y-3">
                    {result.detected_issues.length > 0 ? (
                      result.detected_issues.map((issue, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                          <div className="w-1.5 h-1.5 rounded-full bg-danger mt-2 shrink-0" />
                          <p className="text-sm text-text-primary">{issue}</p>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-success/5 border border-success/10 text-success">
                        <CheckCircle className="w-5 h-5" />
                        <p className="text-sm">No significant issues detected.</p>
                      </div>
                    )}
                  </div>
                </div>
              </GlassCard>

              {/* URL Details Card */}
              <GlassCard className="p-8">
                <h4 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-6 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  URL Metadata
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { label: 'Protocol', value: result.url_details.protocol },
                    { label: 'Domain', value: result.url_details.domain },
                    { label: 'TLD', value: result.url_details.tld },
                    { label: 'Subdomain', value: result.url_details.subdomain || 'None' },
                    { label: 'Port', value: result.url_details.port || 'Default' },
                    { label: 'Path', value: result.url_details.path || '/' },
                  ].map((item, i) => (
                    <div key={i}>
                      <p className="text-xs text-text-secondary mb-1">{item.label}</p>
                      <p className="text-sm font-medium text-white break-all">{item.value}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Sidebar Security Checks */}
            <div className="space-y-8">
              <GlassCard className="p-8">
                <h4 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-6">Security Checks</h4>
                <div className="space-y-4">
                  {[
                    { label: 'HTTPS Enabled', checked: result.security_checks.https },
                    { label: 'No IP Address', checked: !result.security_checks.contains_ip },
                    { label: 'No Shortener', checked: !result.security_checks.url_shortener },
                    { label: 'Safe Length', checked: !result.security_checks.long_url },
                    { label: 'Clean Characters', checked: !result.security_checks.encoded_characters },
                    { label: 'Standard Port', checked: !result.security_checks.non_standard_port },
                  ].map((check, i) => (
                    <div key={i} className="flex items-center justify-between gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="text-sm text-text-secondary">{check.label}</span>
                      {check.checked ? (
                        <CheckCircle className="w-4 h-4 text-success" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-warning" />
                      )}
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="p-8 bg-accent-primary/5 border-accent-primary/20">
                <h4 className="text-sm font-bold text-accent-primary uppercase tracking-wider mb-4">Pro Tip</h4>
                <p className="text-sm text-text-primary leading-relaxed mb-4">
                  Always verify the sender's email address and look for slight misspellings in the domain name.
                </p>
                <GradientButton variant="outline" size="sm" className="w-full">
                  Learn More <ArrowRight className="w-4 h-4 ml-2" />
                </GradientButton>
              </GlassCard>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!result && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {[
            {
              icon: <Search className="text-accent-primary" />,
              title: "Domain Intelligence",
              desc: "Analyzes domain age, registrar reputation, and DNS health."
            },
            {
              icon: <Shield className="text-accent-secondary" />,
              title: "Visual Matching",
              desc: "Compares page layout against top targeted brands."
            },
            {
              icon: <ExternalLink className="text-accent-primary" />,
              title: "Redirect Tracing",
              desc: "Follows deep redirect chains to uncover hidden payloads."
            }
          ].map((item, i) => (
            <AnimatedContainer key={i} delay={0.4 + i * 0.1}>
              <GlassCard className="h-full">
                <div className="p-2 rounded-lg bg-white/5 w-fit mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-heading font-bold mb-2 text-white">{item.title}</h3>
                <p className="text-text-secondary text-sm">{item.desc}</p>
              </GlassCard>
            </AnimatedContainer>
          ))}
        </div>
      )}
    </div>
  );
};

export default UrlScanner;
