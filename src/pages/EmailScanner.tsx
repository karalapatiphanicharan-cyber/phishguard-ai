import React, { useState, useEffect } from 'react';
import { FileSearch, MessageSquareText, ShieldCheck, AlertTriangle, CheckCircle, Brain, Target, ShieldAlert, Info, Trash2, Mail, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedContainer from '../components/AnimatedContainer';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';
import SectionTitle from '../components/SectionTitle';
import RiskBadge from '../components/RiskBadge';
import type { EmailAnalysisResponse, RiskLevel } from '../types';

const EXAMPLE_EMAIL = `From: support@amaz0n-security.xyz
Subject: Important: Verify Your Account Immediately

Dear Customer,

We detected unusual activity on your account.

Click the link below to verify your account immediately.

Failure to verify within 24 hours will permanently suspend your account.

https://amaz0n-security.xyz/login

Thank you.`;

const EmailScanner: React.FC = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EmailAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('Analyzing email...');

  const loadingMessages = [
    'Parsing Email...',
    'Extracting Features...',
    'Running Heuristic Analysis...',
    'Consulting AI Security Analyst...',
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
      }, 1200);
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

  const handleClear = () => {
    setContent('');
    setResult(null);
    setError(null);
  };

  const handleLoadExample = () => {
    setContent(EXAMPLE_EMAIL);
    setError(null);
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
          subtitle="Paste email contents to detect sophisticated social engineering and phishing attempts using AI."
          align="center"
        />
      </AnimatedContainer>

      <AnimatedContainer delay={0.2} className="max-w-4xl mx-auto mb-16">
        <GlassCard className="p-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-medium text-text-secondary">Email Body or Headers</label>
                <span className="text-xs text-text-secondary">{content.length} / 10000 characters</span>
              </div>
              <textarea
                rows={10}
                placeholder="Paste suspicious email here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={loading}
                className="w-full bg-background-primary border border-white/10 rounded-xl py-4 px-4 focus:outline-none focus:ring-2 focus:ring-accent-primary/50 transition-all resize-none text-white disabled:opacity-50 font-mono text-sm"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
               <GradientButton
                className="flex-1 py-4 text-lg"
                onClick={handleAnalyze}
                disabled={loading || content.length < 10}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{loadingMessage}</span>
                  </div>
                ) : (
                  'Analyze Email'
                )}
              </GradientButton>
              <div className="flex gap-4">
                 <button
                  onClick={handleLoadExample}
                  disabled={loading}
                  className="px-6 py-4 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all text-sm font-bold uppercase tracking-wider flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Example
                </button>
                <button
                  onClick={handleClear}
                  disabled={loading}
                  className="px-4 py-4 rounded-xl border border-danger/20 bg-danger/5 text-danger hover:bg-danger/10 transition-all flex items-center justify-center"
                  title="Clear content"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
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
              {/* Analysis Overview */}
              <GlassCard className="p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-white/5 pb-6">
                  <div>
                    <h3 className="text-2xl font-heading font-bold text-white mb-2">Analysis Report</h3>
                    <p className="text-text-secondary text-sm flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-success" /> Verified PhishGuard Security Scan
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <RiskBadge level={getRiskLevel(result.risk_score)} />
                    <span className="text-xs font-medium text-text-secondary uppercase tracking-widest">Risk Score: {result.risk_score}/100</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-2">
                    <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Classification</h4>
                    <div className={`text-2xl font-heading font-bold ${
                      result.risk_score > 60 ? 'text-danger' : result.risk_score > 30 ? 'text-warning' : 'text-success'
                    }`}>
                      {result.classification}
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-2">
                    <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Primary Recommendation</h4>
                    <div className="text-sm text-text-primary leading-relaxed">{result.recommendation}</div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-xs font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Security Checks & Features
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                      <p className="text-[10px] text-text-secondary mb-1 uppercase font-bold">Sender Identity</p>
                      <p className="text-sm font-medium text-white truncate" title={result.heuristics.sender || 'Not detected'}>
                        {result.heuristics.sender || 'No specific sender detected'}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                      <p className="text-[10px] text-text-secondary mb-1 uppercase font-bold">Urgency Level</p>
                      <p className={`text-sm font-bold ${
                        result.heuristics.urgency_level === 'Critical' ? 'text-danger' :
                        result.heuristics.urgency_level === 'High' ? 'text-warning' : 'text-success'
                      }`}>
                        {result.heuristics.urgency_level}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                      <p className="text-[10px] text-text-secondary mb-1 uppercase font-bold">Email Length</p>
                      <p className="text-sm font-medium text-white">{result.heuristics.email_length} characters</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                      <p className="text-[10px] text-text-secondary mb-1 uppercase font-bold">Extracted Links</p>
                      <p className="text-sm font-medium text-white">{result.heuristics.suspicious_links_count} URL(s) detected</p>
                    </div>
                  </div>

                  {result.detected_issues.length > 0 && (
                    <div className="mt-6">
                      <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest mb-3">Detected Security Issues</p>
                      <div className="flex flex-wrap gap-2">
                        {result.detected_issues.map((issue, i) => (
                          <span key={i} className="px-3 py-1.5 rounded-lg bg-danger/10 border border-danger/20 text-[10px] text-danger font-bold flex items-center gap-2">
                            <AlertTriangle className="w-3 h-3" />
                            {issue}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </GlassCard>

              {/* AI Analysis Section */}
              <GlassCard className="p-8 border-accent-secondary/30 bg-accent-secondary/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent-secondary/10 blur-[100px] -z-10" />

                <div className="flex items-center justify-between mb-8">
                  <h4 className="text-sm font-bold text-accent-secondary uppercase tracking-widest flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Advanced AI Threat Insight
                  </h4>
                  {result.ai_analysis && (
                    <div className="px-4 py-1.5 rounded-full bg-accent-secondary/10 border border-accent-secondary/20 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-accent-secondary animate-pulse" />
                      <span className="text-[10px] font-bold text-accent-secondary uppercase">Confidence: {result.ai_analysis.confidence}</span>
                    </div>
                  )}
                </div>

                {result.ai_analysis ? (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest flex items-center gap-2">
                          <ShieldAlert className="w-3.5 h-3.5 text-accent-secondary" /> Threat Type
                        </p>
                        <p className="text-xl font-heading font-bold text-white">{result.ai_analysis.threat_type}</p>
                      </div>
                      <div className="space-y-3">
                        <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest flex items-center gap-2">
                          <Target className="w-3.5 h-3.5 text-accent-secondary" /> Attack Objective
                        </p>
                        <p className="text-sm text-text-primary leading-relaxed">{result.ai_analysis.attack_goal}</p>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                      <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest mb-3">AI Intelligence Summary</p>
                      <p className="text-sm text-text-primary leading-relaxed italic">
                        "{result.ai_analysis.summary}"
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div>
                        <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest mb-4">Tactical Breakdown</p>
                        <ul className="space-y-4">
                          {result.ai_analysis.explanation.map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-text-primary">
                              <span className="text-accent-secondary mt-1 text-lg leading-none">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest mb-4">Security Recommendations</p>
                        <ul className="space-y-4">
                          {result.ai_analysis.recommendations.map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-text-primary p-3 rounded-xl bg-success/5 border border-success/10">
                              <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {result.ai_analysis.likely_target && (
                      <div className="pt-6 border-t border-white/5">
                         <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest mb-2">Likely Target Group</p>
                         <p className="text-sm text-accent-primary font-medium">{result.ai_analysis.likely_target}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Brain className="w-16 h-16 text-white/10 mb-6 animate-pulse" />
                    <p className="text-text-secondary text-sm">AI Analysis Temporarily Unavailable</p>
                    <p className="text-[10px] text-text-secondary mt-2 max-w-xs">Heuristic engine is still protecting you, but advanced AI insights could not be generated at this time.</p>
                  </div>
                )}
              </GlassCard>
            </div>

            {/* Sidebar info */}
            <div className="space-y-8">
               {/* Extracted Links */}
              <GlassCard className="p-8">
                <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-6">Extracted Links</h4>
                {result.heuristics.detected_links.length > 0 ? (
                  <div className="space-y-3">
                    {result.heuristics.detected_links.map((link, i) => (
                      <div key={i} className="group p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-3 hover:border-accent-primary/30 transition-all overflow-hidden">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <LinkIcon className="w-3.5 h-3.5 text-text-secondary shrink-0" />
                          <span className="text-xs text-text-secondary truncate">{link}</span>
                        </div>
                        <a href={link} target="_blank" rel="noopener noreferrer" className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink className="w-3.5 h-3.5 text-accent-primary" />
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 border border-dashed border-white/10 rounded-2xl">
                    <p className="text-xs text-text-secondary">No links detected in content.</p>
                  </div>
                )}
              </GlassCard>

              <GlassCard className="p-8">
                <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-6">Linguistic Indicators</h4>
                <div className="space-y-4">
                  {[
                    { label: 'Urgent Language', value: result.heuristics.urgent_words_count > 0, info: `${result.heuristics.urgent_words_count} keywords` },
                    { label: 'Credential Request', value: result.heuristics.has_sensitive_requests, info: 'Sensitive' },
                    { label: 'Threat Language', value: result.heuristics.threat_language, info: 'Hostile' },
                    { label: 'Grammar Mistakes', value: result.heuristics.grammar_mistakes, info: 'Suspicious' },
                    { label: 'Brand Reference', value: result.heuristics.brand_impersonation, info: 'Impersonation' },
                    { label: 'Excessive Caps', value: result.heuristics.capital_letters_percent > 30, info: `${result.heuristics.capital_letters_percent.toFixed(0)}%` },
                  ].map((check, i) => (
                    <div key={i} className="flex items-center justify-between gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="flex flex-col">
                        <span className="text-xs text-white font-medium">{check.label}</span>
                        <span className="text-[9px] text-text-secondary uppercase">{check.info}</span>
                      </div>
                      {check.value ? (
                        <ShieldAlert className="w-4 h-4 text-warning" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-success" />
                      )}
                    </div>
                  ))}
                </div>
              </GlassCard>

               <GlassCard className="p-8 bg-accent-primary/5 border-accent-primary/20">
                <h4 className="text-[10px] font-bold text-accent-primary uppercase tracking-widest mb-4">Security Advisory</h4>
                <p className="text-xs text-text-primary leading-relaxed mb-4">
                  PhishGuard uses a combination of pattern matching and Large Language Models. While highly accurate, social engineering evolves daily. Always verify requests for money or data through an official secondary channel.
                </p>
                <GradientButton variant="outline" size="sm" className="w-full text-[10px] h-10">
                  Read Verification Guide
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
              <GlassCard className="h-full group hover:border-accent-primary/30 transition-all">
                <div className="p-3 rounded-xl bg-white/5 w-fit mb-4 group-hover:bg-accent-primary/10 transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-xl font-heading font-bold mb-2 text-white">{item.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
              </GlassCard>
            </AnimatedContainer>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmailScanner;
