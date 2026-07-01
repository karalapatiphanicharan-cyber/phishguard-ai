import React, { useState, useEffect } from 'react';
import { Mail, Trash2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedContainer from '../components/AnimatedContainer';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';
import SectionTitle from '../components/SectionTitle';
import ThreatDashboard from '../components/ThreatDashboard';
import EmptyState from '../components/EmptyState';
import type { EmailAnalysisResponse } from '../types';
import { saveToHistory } from '../lib/storage';

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
    'Consulting Threat Intelligence Analyst...',
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
      saveToHistory('email', data);
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

  const handleAnalyzeAnother = () => {
    setContent('');
    setResult(null);
  };

  const handleLoadExample = () => {
    setContent(EXAMPLE_EMAIL);
    setError(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 min-h-screen">
      <AnimatedContainer>
        <SectionTitle
          title="Email Threat Intelligence"
          subtitle="Paste email contents to detect sophisticated social engineering and phishing attempts using enterprise threat intelligence."
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
        {result ? (
          <ThreatDashboard
            result={result}
            type="email"
            onClear={handleClear}
            onAnalyzeAnother={handleAnalyzeAnother}
          />
        ) : !loading && (
          <EmptyState type="email" />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmailScanner;
