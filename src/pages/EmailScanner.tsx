import React, { useState, useEffect } from 'react';
import { FileSearch, MessageSquareText, ShieldCheck, AlertTriangle, CheckCircle, Brain, Target, ShieldAlert, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedContainer from '../components/AnimatedContainer';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';
import SectionTitle from '../components/SectionTitle';
import RiskBadge from '../components/RiskBadge';
import type { EmailAnalysisResponse, RiskLevel } from '../types';

const EmailScanner: React.FC = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EmailAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('Analyzing email...');

  const loadingMessages = [
    'Analyzing Content...',
    'Scanning for Social Engineering...',
    'Checking for Suspicious Links...',
    'Consulting AI Security Analyst...',
    'Evaluating Risk Levels...',
    'Generating Threat Report...',
  ];

  useEffect(() => {
    let interval: any;
    if (loading) {
      let index = 0;
      setLoadingMessage(loadingMessages[0]);
      interval = setInterval(() => {
        index = (index + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[index]);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleAnalyze = async () => {
    if (!content || content.length < 10) {
      setError('Please enter at least 10 characters of email content.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:8000/api/analyze-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to analyze email');
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
          title="Email Threat Intelligence"
          subtitle="Paste email headers or body to detect sophisticated social engineering and phishing attempts using AI."
          align="center"
        />
      </AnimatedContainer>

      <AnimatedContainer delay={0.2} className="max-w-4xl mx-auto mb-16">
        <GlassCard className="p-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-text-secondary ml-1">Email Body or Headers</label>
              <textarea
                rows={8}
                placeholder="Paste the email content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={loading}
                className="w-full bg-background-primary border border-white/10 rounded-xl py-4 px-4 focus:outline-none focus:ring-2 focus:ring-accent-primary/50 transition-all resize-none text-white disabled:opacity-50"
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
                'Run Threat Scan'
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
            <div className="lg:col-span-2 space-y-8">
              {/* Heuristic Results */}
              <GlassCard className="p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                  <div>
                    <h3 className="text-2xl font-heading font-bold text-white mb-2">Analysis Results</h3>
                    <p className="text-text-secondary text-sm">Heuristic & AI Threat Detection</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <RiskBadge level={getRiskLevel(result.risk_score)} />
                    <span className="text-xs font-medium text-text-secondary">Risk Score: {result.risk_score}/100</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                    <h4 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4">Classification</h4>
                    <div className="text-2xl font-heading font-bold text-white">{result.classification}</div>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                    <h4 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4">Final Recommendation</h4>
                    <div className="text-sm text-text-primary">{result.recommendation}</div>
                  </div>
                </div>

                <div className="space-y-6">
                   <h4 className="text-sm font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Heuristic Findings
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                      <p className="text-xs text-text-secondary mb-1 uppercase tracking-tighter font-bold">Urgency Level</p>
                      <p className={`text-sm font-bold ${result.heuristics.urgency_level === 'Low' ? 'text-success' : 'text-warning'}`}>
                        {result.heuristics.urgency_level}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                      <p className="text-xs text-text-secondary mb-1 uppercase tracking-tighter font-bold">Suspicious Links</p>
                      <p className="text-sm font-bold text-white">{result.heuristics.suspicious_links_count}</p>
                    </div>
                  </div>

                  {result.heuristics.detected_keywords.length > 0 && (
                    <div>
                      <p className="text-xs text-text-secondary uppercase font-bold tracking-tighter mb-3">Detected Suspicious Keywords</p>
                      <div className="flex flex-wrap gap-2">
                        {result.heuristics.detected_keywords.map((kw, i) => (
                          <span key={i} className="px-3 py-1 rounded-full bg-danger/10 border border-danger/20 text-[10px] text-danger font-bold uppercase">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </GlassCard>

              {/* AI Analysis Section */}
              <GlassCard className="p-8 border-accent-secondary/30 bg-accent-secondary/5">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-sm font-bold text-accent-secondary uppercase tracking-wider flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Explainable AI Insights
                  </h4>
                  {result.ai_analysis && (
                    <div className="px-3 py-1 rounded-full bg-accent-secondary/10 border border-accent-secondary/20">
                      <span className="text-[10px] font-bold text-accent-secondary uppercase">Confidence: {result.ai_analysis.confidence}</span>
                    </div>
                  )}
                </div>

                {result.ai_analysis ? (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <p className="text-xs text-text-secondary uppercase font-bold tracking-tighter flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" /> Potential Threat
                        </p>
                        <p className="text-lg font-heading font-bold text-white">{result.ai_analysis.threat_type}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs text-text-secondary uppercase font-bold tracking-tighter flex items-center gap-1">
                          <Target className="w-3 h-3" /> Attacker Objective
                        </p>
                        <p className="text-sm text-text-primary">{result.ai_analysis.attack_goal}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-text-secondary uppercase font-bold tracking-tighter mb-3">Intelligence Summary</p>
                      <p className="text-sm text-text-primary leading-relaxed p-4 rounded-xl bg-white/5 border border-white/5 italic">
                        "{result.ai_analysis.summary}"
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <p className="text-xs text-text-secondary uppercase font-bold tracking-tighter mb-4">Technical Breakdown</p>
                        <ul className="space-y-3">
                          {result.ai_analysis.explanation.map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-text-primary">
                              <span className="text-accent-secondary mt-1">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs text-text-secondary uppercase font-bold tracking-tighter mb-4">Actionable Advice</p>
                        <ul className="space-y-3">
                          {result.ai_analysis.recommendations.map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-text-primary">
                              <CheckCircle className="w-4 h-4 text-success shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <Brain className="w-12 h-12 text-white/10 mb-4 animate-pulse" />
                    <p className="text-text-secondary text-sm">AI intelligence temporarily unavailable.</p>
                    <p className="text-[10px] text-text-secondary mt-1">Manual heuristic inspection complete.</p>
                  </div>
                )}
              </GlassCard>
            </div>

            {/* Sidebar info */}
            <div className="space-y-8">
              <GlassCard className="p-8">
                <h4 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-6">Security Context</h4>
                <div className="space-y-4">
                  {[
                    { label: 'Sense of Urgency', checked: result.heuristics.urgency_level !== 'Low' },
                    { label: 'Suspicious Links', checked: result.heuristics.suspicious_links_count > 0 },
                    { label: 'Sensitive Requests', checked: result.heuristics.has_sensitive_requests },
                    { label: 'Keyword Match', checked: result.heuristics.detected_keywords.length > 0 },
                  ].map((check, i) => (
                    <div key={i} className="flex items-center justify-between gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="text-sm text-text-secondary">{check.label}</span>
                      {check.checked ? (
                        <ShieldAlert className="w-4 h-4 text-warning" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-success" />
                      )}
                    </div>
                  ))}
                </div>
              </GlassCard>

               <GlassCard className="p-8 bg-accent-secondary/5 border-accent-secondary/20">
                <h4 className="text-sm font-bold text-accent-secondary uppercase tracking-wider mb-4">Security Warning</h4>
                <p className="text-sm text-text-primary leading-relaxed mb-4">
                  AI analysis is an assistive tool. Never trust emails requesting immediate financial actions or password resets via links.
                </p>
                <GradientButton variant="outline" size="sm" className="w-full">
                  Security Best Practices
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
              icon: <MessageSquareText className="text-accent-primary" />,
              title: "Sentiment Analysis",
              desc: "Detects urgency, fear, and other common social engineering emotions."
            },
            {
              icon: <FileSearch className="text-accent-secondary" />,
              title: "Heuristic Inspection",
              desc: "Scans for known malicious patterns, keywords, and suspicious structural elements."
            },
            {
              icon: <ShieldCheck className="text-accent-primary" />,
              title: "Malicious Intent",
              desc: "Identifies requests for credentials, money transfers, or sensitive data using AI."
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

export default EmailScanner;
