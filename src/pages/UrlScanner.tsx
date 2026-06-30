import React, { useState, useEffect } from 'react';
import { Globe, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedContainer from '../components/AnimatedContainer';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';
import SectionTitle from '../components/SectionTitle';
import ThreatDashboard from '../components/ThreatDashboard';
import EmptyState from '../components/EmptyState';
import type { URLAnalysisResponse } from '../types';
import { saveToHistory } from '../lib/storage';

const UrlScanner: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<URLAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('Checking URL...');

  const loadingMessages = [
    'Checking URL...',
    'Extracting Features...',
    'Running Heuristic Analysis...',
    'Consulting AI Security Analyst...',
    'Generating Threat Intelligence...',
    'Preparing Final Report...',
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
      saveToHistory('url', data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setUrl('');
    setResult(null);
    setError(null);
  };

  const handleAnalyzeAnother = () => {
    setUrl('');
    setResult(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 min-h-screen">
      <AnimatedContainer>
        <SectionTitle
          title="URL Threat Analyzer"
          subtitle="Deep scan URLs for phishing, malware, and social engineering indicators using intelligent heuristics and AI."
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
        {result ? (
          <ThreatDashboard
            result={result}
            type="url"
            onClear={handleClear}
            onAnalyzeAnother={handleAnalyzeAnother}
          />
        ) : !loading && (
          <EmptyState type="url" />
        )}
      </AnimatePresence>
    </div>
  );
};

export default UrlScanner;
