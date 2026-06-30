import React from 'react';
import RiskBadge from './RiskBadge';
import type { RiskLevel } from '../types';

interface ThreatOverviewProps {
  score: number;
  classification: string;
  threatType?: string;
  timestamp?: string;
}

const ThreatOverview: React.FC<ThreatOverviewProps> = ({ score, threatType, timestamp }) => {
  const getRiskLevel = (s: number): RiskLevel => {
    if (s <= 30) return 'low';
    if (s <= 60) return 'medium';
    if (s <= 80) return 'high';
    return 'critical';
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-white/5">
      <div className="space-y-2">
        <h3 className="text-3xl font-heading font-bold text-white tracking-tight">Threat Intelligence Report</h3>
        <div className="flex flex-wrap items-center gap-3">
          <RiskBadge level={getRiskLevel(score)} />
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/10">
            {threatType || 'General Threat'}
          </span>
          <span className="text-[10px] font-medium text-text-secondary uppercase tracking-widest">
            {timestamp || new Date().toLocaleString()}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className={`text-5xl font-heading font-bold ${
          score > 60 ? 'text-danger' : score > 30 ? 'text-warning' : 'text-success'
        }`}>
          {score}<span className="text-xl opacity-30">/100</span>
        </div>
        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Aggregate Risk Score</span>
      </div>
    </div>
  );
};

export default ThreatOverview;
