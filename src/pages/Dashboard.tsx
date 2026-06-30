import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart3,
  Shield,
  ShieldAlert,
  ShieldCheck,
  History,
  TrendingUp,
  Download,
  Trash2,
  ExternalLink,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import AnimatedContainer from '../components/AnimatedContainer';
import GlassCard from '../components/GlassCard';
import SectionTitle from '../components/SectionTitle';
import GradientButton from '../components/GradientButton';
import { getHistory, clearHistory, type HistoryEntry } from '../lib/storage';
import ThreatDashboard from '../components/ThreatDashboard';
import type { URLAnalysisResponse, EmailAnalysisResponse } from '../types';

const Dashboard: React.FC = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const stats = useMemo(() => {
    if (history.length === 0) return { total: 0, safe: 0, suspicious: 0, highRisk: 0, avgScore: 0 };

    const total = history.length;
    const safe = history.filter(h => h.data.classification === 'Safe').length;
    const highRisk = history.filter(h => h.data.classification === 'High Risk').length;
    const suspicious = total - safe - highRisk;
    const avgScore = Math.round(history.reduce((acc, h) => acc + h.data.risk_score, 0) / total);

    return { total, safe, suspicious, highRisk, avgScore };
  }, [history]);

  const threatDistributionData = useMemo(() => {
    const categories: Record<string, number> = {
      'Credential Phishing': 0,
      'Banking Phishing': 0,
      'Brand Impersonation': 0,
      'Business Email Compromise': 0,
      'Invoice Scam': 0,
      'Other': 0
    };

    history.forEach(h => {
      const type = h.data.ai_analysis?.threat_type || 'Other';
      if (categories[type] !== undefined) {
        categories[type]++;
      } else {
        categories['Other']++;
      }
    });

    return Object.entries(categories)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));
  }, [history]);

  const riskTrendData = useMemo(() => {
    return [...history]
      .reverse()
      .map(h => ({
        time: new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        score: h.data.risk_score
      }));
  }, [history]);

  const topIndicators = useMemo(() => {
    const counts: Record<string, number> = {};
    history.forEach(h => {
      h.data.detected_issues.forEach(issue => {
        // Normalize issue names for better grouping
        let key = issue;
        if (issue.includes('typosquat')) key = 'Typosquatting';
        else if (issue.includes('brand')) key = 'Brand Impersonation';
        else if (issue.includes('shortener')) key = 'URL Shortener';
        else if (issue.includes('TLD')) key = 'Suspicious TLD';
        else if (issue.includes('credential')) key = 'Credential Request';
        else if (issue.includes('redirect')) key = 'Redirect Parameter';

        counts[key] = (counts[key] || 0) + 1;
      });
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, [history]);

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `phishguard_intelligence_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
    setShowClearConfirm(false);
  };

  const COLORS = ['#00E5FF', '#7C3AED', '#FF3D71', '#FFAB00', '#00D68F', '#8F9BB3'];

  if (selectedEntry) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 min-h-screen">
        <button
          onClick={() => setSelectedEntry(null)}
          className="mb-8 flex items-center gap-2 text-text-secondary hover:text-white transition-colors font-bold uppercase tracking-widest text-xs"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          Back to Intelligence Center
        </button>
        <ThreatDashboard
          result={selectedEntry.data}
          type={selectedEntry.type}
          onClear={() => setSelectedEntry(null)}
          onAnalyzeAnother={() => setSelectedEntry(null)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 min-h-screen">
      <AnimatedContainer>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <SectionTitle
            title="Threat Intelligence Center"
            subtitle="Strategic analytics and historical data from your security operations."
            align="left"
            className="mb-0"
          />
          <div className="flex gap-4">
            <button
              onClick={handleExport}
              disabled={history.length === 0}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all flex items-center gap-2 text-sm font-bold disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Export JSON
            </button>
            <button
              onClick={() => setShowClearConfirm(true)}
              disabled={history.length === 0}
              className="px-4 py-2 rounded-lg bg-danger/5 border border-danger/20 text-danger hover:bg-danger/10 transition-all flex items-center gap-2 text-sm font-bold disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              Clear History
            </button>
          </div>
        </div>
      </AnimatedContainer>

      {history.length === 0 ? (
        <AnimatedContainer delay={0.2}>
          <GlassCard className="p-20 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <History className="w-10 h-10 text-text-secondary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-heading font-bold text-white">No Analysis Data Found</h3>
              <p className="text-text-secondary max-w-md">Your security history is empty. Start by analyzing a URL or Email to populate the Intelligence Center.</p>
            </div>
            <div className="flex gap-4 pt-4">
              <Link to="/url-scanner">
                <GradientButton>Scan URL</GradientButton>
              </Link>
              <Link to="/email-scanner">
                <GradientButton variant="secondary">Scan Email</GradientButton>
              </Link>
            </div>
          </GlassCard>
        </AnimatedContainer>
      ) : (
        <div className="space-y-8">
          {/* Executive Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { label: 'Total Analyses', value: stats.total, icon: <BarChart3 className="text-accent-primary" /> },
              { label: 'Safe Results', value: stats.safe, icon: <ShieldCheck className="text-success" /> },
              { label: 'Suspicious', value: stats.suspicious, icon: <AlertCircle className="text-warning" /> },
              { label: 'High Risk', value: stats.highRisk, icon: <ShieldAlert className="text-danger" /> },
              { label: 'Avg Risk Score', value: `${stats.avgScore}%`, icon: <TrendingUp className="text-accent-secondary" /> },
            ].map((stat, i) => (
              <AnimatedContainer key={i} delay={i * 0.1}>
                <GlassCard className="p-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{stat.label}</span>
                    <div className="p-2 rounded-lg bg-white/5 border border-white/5">{stat.icon}</div>
                  </div>
                  <motion.span
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-3xl font-heading font-bold text-white"
                  >
                    {stat.value}
                  </motion.span>
                </GlassCard>
              </AnimatedContainer>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Charts Column */}
            <div className="lg:col-span-8 space-y-8">
              {/* Risk Trend Chart */}
              <AnimatedContainer delay={0.3}>
                <GlassCard className="p-8">
                  <h4 className="text-sm font-bold text-text-secondary uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-accent-primary" />
                    Security Risk Trend
                  </h4>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={riskTrendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis
                          dataKey="time"
                          stroke="#8F9BB3"
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                          dy={10}
                        />
                        <YAxis
                          stroke="#8F9BB3"
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                          domain={[0, 100]}
                        />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #ffffff10', borderRadius: '12px' }}
                          itemStyle={{ color: '#00E5FF' }}
                        />
                        <Line
                          type="monotone"
                          dataKey="score"
                          stroke="#00E5FF"
                          strokeWidth={3}
                          dot={{ fill: '#00E5FF', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </GlassCard>
              </AnimatedContainer>

              {/* Recent Analyses Table */}
              <AnimatedContainer delay={0.4}>
                <GlassCard className="p-8">
                  <h4 className="text-sm font-bold text-text-secondary uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                    <History className="w-4 h-4 text-accent-secondary" />
                    Activity Ledger
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-white/5">
                          <th className="pb-4 text-[10px] font-bold text-text-secondary uppercase tracking-widest px-4">Timestamp</th>
                          <th className="pb-4 text-[10px] font-bold text-text-secondary uppercase tracking-widest px-4">Target Identity</th>
                          <th className="pb-4 text-[10px] font-bold text-text-secondary uppercase tracking-widest px-4 text-center">Risk</th>
                          <th className="pb-4 text-[10px] font-bold text-text-secondary uppercase tracking-widest px-4">Category</th>
                          <th className="pb-4 text-[10px] font-bold text-text-secondary uppercase tracking-widest px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {history.slice(0, 10).map((entry) => (
                          <tr key={entry.id} className="group hover:bg-white/[0.02] transition-colors">
                            <td className="py-4 px-4 text-xs text-text-secondary font-mono">
                              {new Date(entry.timestamp).toLocaleDateString()} {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="py-4 px-4 max-w-[200px]">
                              <div className="flex flex-col gap-1">
                                <span className="text-sm font-bold text-white truncate">
                                  {entry.type === 'url' ? (entry.data as URLAnalysisResponse).url_details.hostname : (entry.data as EmailAnalysisResponse).heuristics.sender || 'Unknown Sender'}
                                </span>
                                <span className="text-[10px] text-text-secondary uppercase tracking-widest">{entry.type} analysis</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full border text-xs font-bold ${
                                entry.data.risk_score > 60 ? 'border-danger/30 text-danger bg-danger/5' :
                                entry.data.risk_score > 30 ? 'border-warning/30 text-warning bg-warning/5' :
                                'border-success/30 text-success bg-success/5'
                              }`}>
                                {entry.data.risk_score}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="text-xs font-medium text-white px-3 py-1 rounded-full bg-white/5 border border-white/5">
                                {entry.data.ai_analysis?.threat_type || 'General Threat'}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <button
                                onClick={() => setSelectedEntry(entry)}
                                className="p-2 rounded-lg bg-accent-primary/10 text-accent-primary opacity-0 group-hover:opacity-100 transition-all hover:bg-accent-primary hover:text-white"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </GlassCard>
              </AnimatedContainer>
            </div>

            {/* Side Intelligence Column */}
            <div className="lg:col-span-4 space-y-8">
               {/* Distribution Chart */}
               <AnimatedContainer delay={0.5}>
                <GlassCard className="p-8">
                  <h4 className="text-sm font-bold text-text-secondary uppercase tracking-[0.2em] mb-8">Threat Distribution</h4>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={threatDistributionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {threatDistributionData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #ffffff10', borderRadius: '12px' }}
                        />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </GlassCard>
              </AnimatedContainer>

              {/* Security Insights */}
              <AnimatedContainer delay={0.6}>
                <GlassCard className="p-8 space-y-6">
                  <h4 className="text-sm font-bold text-text-secondary uppercase tracking-[0.2em] flex items-center gap-2">
                    <Shield className="w-4 h-4 text-accent-primary" />
                    Security Insights
                  </h4>
                  <div className="space-y-4">
                     {[
                       { label: 'Primary Vector', value: stats.highRisk > stats.safe ? 'Phishing Redirection' : 'Low Threat Surface' },
                       { label: 'Most Common Indicator', value: topIndicators[0]?.[0] || 'N/A' },
                       { label: 'Detected Brands', value: history.filter(h => h.data.detected_issues.some(i => i.toLowerCase().includes('brand'))).length },
                       { label: 'AI Confidence', value: 'High Accuracy' }
                     ].map((insight, i) => (
                       <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                         <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{insight.label}</span>
                         <p className="text-sm font-bold text-white">{insight.value}</p>
                       </div>
                     ))}
                  </div>
                </GlassCard>
              </AnimatedContainer>

              {/* Top Indicators */}
              <AnimatedContainer delay={0.7}>
                <GlassCard className="p-8">
                  <h4 className="text-sm font-bold text-text-secondary uppercase tracking-[0.2em] mb-6">Top Detectors</h4>
                  <div className="space-y-4">
                    {topIndicators.map(([name, count], i) => (
                      <div key={i} className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                           <div className="w-2 h-2 rounded-full bg-accent-primary" />
                           <span className="text-xs text-text-primary">{name}</span>
                         </div>
                         <span className="text-xs font-bold text-accent-primary">{count}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </AnimatedContainer>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showClearConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowClearConfirm(false)}
              className="absolute inset-0 bg-background-primary/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md p-8 rounded-2xl bg-background-secondary border border-white/10 shadow-2xl"
            >
              <div className="w-12 h-12 rounded-full bg-danger/10 border border-danger/20 flex items-center justify-center mb-6">
                <Trash2 className="text-danger w-6 h-6" />
              </div>
              <h3 className="text-xl font-heading font-bold text-white mb-2">Wipe Security History?</h3>
              <p className="text-text-secondary text-sm mb-8">This will permanently delete all stored analysis results from your Intelligence Center. This action cannot be undone.</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-white font-bold text-sm hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearHistory}
                  className="flex-1 py-3 rounded-xl bg-danger text-white font-bold text-sm hover:bg-danger/90 transition-colors"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
