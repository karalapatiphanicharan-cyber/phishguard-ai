import React from 'react';
import { ShieldAlert, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

interface IndicatorCardProps {
  label: string;
  status: 'detected' | 'safe';
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
}

const IndicatorCard: React.FC<IndicatorCardProps> = ({ label, status, severity }) => {
  const getColors = () => {
    if (status === 'safe') return 'text-success bg-success/5 border-success/10';
    switch (severity) {
      case 'critical': return 'text-danger bg-danger/5 border-danger/10';
      case 'high': return 'text-danger bg-danger/5 border-danger/10';
      case 'medium': return 'text-warning bg-warning/5 border-warning/10';
      case 'low': return 'text-warning bg-warning/5 border-warning/10';
      default: return 'text-accent-primary bg-accent-primary/5 border-accent-primary/10';
    }
  };

  const getIcon = () => {
    if (status === 'safe') return <CheckCircle2 className="w-4 h-4" />;
    switch (severity) {
      case 'critical':
      case 'high': return <ShieldAlert className="w-4 h-4" />;
      case 'medium':
      case 'low': return <AlertTriangle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  return (
    <div className={`flex items-center justify-between p-4 rounded-xl border transition-all hover:bg-opacity-10 ${getColors()}`}>
      <div className="flex items-center gap-3">
        <div className="shrink-0">{getIcon()}</div>
        <span className="text-xs font-bold uppercase tracking-tight">{label}</span>
      </div>
      <div className="text-[10px] font-bold uppercase opacity-70">
        {status === 'safe' ? 'Verified' : 'Flagged'}
      </div>
    </div>
  );
};

export default IndicatorCard;
