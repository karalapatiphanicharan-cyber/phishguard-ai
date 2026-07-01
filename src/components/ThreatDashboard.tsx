import React from 'react';
import {
  ShieldAlert,
  Brain,
  Target,
  ShieldCheck,
  Lock,
  User,
  Link as LinkIcon,
  Globe,
  Bell,
  Shield,
  Eye,
  FileText
} from 'lucide-react';
import type { URLAnalysisResponse, EmailAnalysisResponse } from '../types';
import GlassCard from './GlassCard';
import RiskGauge from './RiskGauge';
import Timeline from './Timeline';
import ConfidenceBar from './ConfidenceBar';
import IndicatorCard from './IndicatorCard';
import RecommendationCard from './RecommendationCard';
import MetadataCard from './MetadataCard';
import QuickActions from './QuickActions';
import ThreatOverview from './ThreatOverview';
import SecurityChecklist from './SecurityChecklist';

interface ThreatDashboardProps {
  result: URLAnalysisResponse | EmailAnalysisResponse;
  type: 'url' | 'email';
  onClear: () => void;
  onAnalyzeAnother: () => void;
}

const ThreatDashboard: React.FC<ThreatDashboardProps> = ({ result, type, onClear, onAnalyzeAnother }) => {
  const isUrl = (_res: any): _res is URLAnalysisResponse => type === 'url';

  // Extract common data
  const score = result.risk_score;
  const classification = result.classification;
  const ai = result.ai_analysis;

  const getSecurityChecks = () => {
    if (isUrl(result)) {
      return [
        { label: 'HTTPS Encryption', status: result.security_checks.https },
        { label: 'No IP-based Host', status: !result.security_checks.contains_ip },
        { label: 'Standard URL Length', status: !result.security_checks.long_url },
        { label: 'No URL Shortener', status: !result.security_checks.url_shortener },
        { label: 'Safe TLD', status: !result.security_checks.suspicious_tld },
        { label: 'Clean Encoding', status: !result.security_checks.encoded_characters },
      ];
    } else {
      const h = result.heuristics;
      return [
        { label: 'Urgent Tone Check', status: h.urgency_level === 'Low' },
        { label: 'Credential Requests', status: !h.has_sensitive_requests },
        { label: 'Hostile Language', status: !h.threat_language },
        { label: 'Brand Veracity', status: !h.brand_impersonation },
        { label: 'Grammar Quality', status: !h.grammar_mistakes },
        { label: 'No Malicious Links', status: h.suspicious_links_count === 0 },
      ];
    }
  };

  const getMetadata = () => {
    if (isUrl(result)) {
      return [
        { label: 'Protocol', value: result.url_details.protocol },
        { label: 'Hostname', value: result.url_details.hostname },
        { label: 'Domain', value: result.url_details.domain },
        { label: 'TLD', value: result.url_details.tld },
        { label: 'Subdomain', value: result.url_details.subdomain || 'None' },
        { label: 'Path', value: result.url_details.path || '/' },
      ];
    } else {
      const h = result.heuristics;
      return [
        { label: 'Sender', value: h.sender || 'Not Detected' },
        { label: 'Reply-To', value: h.reply_to || 'Not Detected' },
        { label: 'Subject', value: h.subject || 'No Subject' },
        { label: 'Length', value: `${h.email_length} chars` },
        { label: 'Links Found', value: h.suspicious_links_count },
        { label: 'Attachments', value: h.attachments_count },
      ];
    }
  };

  const getIndicators = () => {
     if (isUrl(result)) {
        const s = result.security_checks;
        return [
          { label: 'Typosquatting', status: s.typosquatting ? 'detected' : 'safe', severity: 'critical' },
          { label: 'Homograph Attack', status: s.homograph ? 'detected' : 'safe', severity: 'critical' },
          { label: 'Domain Entropy', status: s.high_entropy ? 'detected' : 'safe', severity: 'high' },
          { label: 'Brand Spoofing', status: s.brand_impersonation ? 'detected' : 'safe', severity: 'high' },
          { label: 'IP Address Host', status: s.contains_ip ? 'detected' : 'safe', severity: 'critical' },
          { label: 'URL Shortener', status: s.url_shortener ? 'detected' : 'safe', severity: 'medium' },
          { label: 'Encoding Trickery', status: s.encoded_characters ? 'detected' : 'safe', severity: 'high' },
        ] as const;
     } else {
        const h = result.heuristics;
        return [
          { label: 'Sender Spoofing', status: h.sender_spoofed ? 'detected' : 'safe', severity: 'critical' },
          { label: 'Urgent Language', status: h.urgent_words_count > 0 ? 'detected' : 'safe', severity: 'high' },
          { label: 'Credential Request', status: h.has_sensitive_requests ? 'detected' : 'safe', severity: 'critical' },
          { label: 'Brand Impersonation', status: h.brand_impersonation ? 'detected' : 'safe', severity: 'critical' },
          { label: 'Threat Language', status: h.threat_language ? 'detected' : 'safe', severity: 'high' },
          { label: 'Reward / Scam', status: h.reward_language ? 'detected' : 'safe', severity: 'high' },
        ] as const;
     }
  };

  const getRecommendations = () => {
    if (ai?.recommendations && ai.recommendations.length > 0) {
      return ai.recommendations.map((rec, i) => ({
        title: `Action Item ${i + 1}`,
        description: rec,
        icon: i % 2 === 0 ? <Shield className="w-5 h-5" /> : <Lock className="w-5 h-5" />
      }));
    }

    // Fallback recommendations
    return [
      {
        title: "Verify Identity",
        description: "Always confirm the sender or website identity through a separate trusted channel.",
        icon: <User className="w-5 h-5" />
      },
      {
        title: "Enable MFA",
        description: "Multi-factor authentication provides a critical layer of defense against credential theft.",
        icon: <Lock className="w-5 h-5" />
      },
      {
        title: "Report Threat",
        description: "Flag this as phishing in your mail client or security dashboard to help others.",
        icon: <Bell className="w-5 h-5" />
      }
    ];
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <ThreatOverview
          score={score}
          classification={classification}
          threatType={ai?.threat_type}
        />
        <QuickActions
          onClear={onClear}
          onAnalyzeAnother={onAnalyzeAnother}
          result={result}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Intelligence & Summary */}
        <div className="lg:col-span-8 space-y-8">
          {/* Intelligence Summary */}
          <GlassCard className="p-8 border-accent-secondary/30 bg-accent-secondary/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent-secondary/10 blur-[120px] -z-10 group-hover:bg-accent-secondary/20 transition-all duration-1000" />

            <div className="flex items-center justify-between mb-8">
              <h4 className="text-sm font-bold text-accent-secondary uppercase tracking-[0.2em] flex items-center gap-3">
                <Brain className="w-5 h-5 animate-pulse" />
                Cognitive Threat Intelligence
              </h4>
              <div className="hidden sm:block">
                 <ConfidenceBar confidence={ai?.confidence || 'Medium'} />
              </div>
            </div>

            {ai ? (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                      <div className="flex items-center gap-2 text-accent-secondary">
                         <ShieldAlert className="w-4 h-4" />
                         <span className="text-[10px] font-bold uppercase tracking-widest">Detected Threat</span>
                      </div>
                      <p className="text-xl font-heading font-bold text-white">{ai.threat_type}</p>
                   </div>
                   <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                      <div className="flex items-center gap-2 text-accent-secondary">
                         <Target className="w-4 h-4" />
                         <span className="text-[10px] font-bold uppercase tracking-widest">Attack Objective</span>
                      </div>
                      <p className="text-sm text-text-primary leading-relaxed">{ai.attack_goal}</p>
                   </div>
                </div>

                <div className="relative">
                   <div className="absolute -left-4 top-0 bottom-0 w-1 bg-accent-secondary/30 rounded-full" />
                   <div className="pl-6 space-y-3">
                      <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Threat Summary</span>
                      <p className="text-base text-text-primary leading-relaxed italic font-medium">
                        "{ai.summary}"
                      </p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-6">
                      <h5 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
                        <Eye className="w-3.5 h-3.5" /> Technical Observations
                      </h5>
                      <ul className="space-y-4">
                        {ai.explanation.map((item, i) => (
                          <li key={i} className="flex items-start gap-4 text-sm text-text-primary">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent-secondary mt-1.5 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                   </div>
                   <div className="space-y-6">
                      <h5 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5" /> Reasoning Baseline
                      </h5>
                      <div className="space-y-3">
                         {getIndicators().map((indicator, i) => (
                           <IndicatorCard key={i} {...indicator} />
                         ))}
                      </div>
                   </div>
                </div>

                {ai.likely_target && (
                  <div className="pt-6 border-t border-white/5 flex items-center gap-3">
                     <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Likely Target:</span>
                     <span className="text-sm text-accent-primary font-bold">{ai.likely_target}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <Brain className="w-16 h-16 text-white/5 animate-pulse" />
                <div className="space-y-1">
                  <p className="text-text-secondary text-sm font-bold uppercase tracking-widest">Threat Intelligence Engine Offline</p>
                  <p className="text-[10px] text-text-secondary max-w-xs">Heuristic security engine is active. Advanced reasoning is currently unavailable.</p>
                </div>
              </div>
            )}
          </GlassCard>

          {/* Recommendations Grid */}
          <div className="space-y-6">
             <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2 ml-1">
                <ShieldCheck className="w-4 h-4 text-success" /> Recommended Countermeasures
             </h4>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {getRecommendations().map((rec, i) => (
                  <RecommendationCard key={i} {...rec} />
                ))}
             </div>
          </div>
        </div>

        {/* Right Column - Score & Metadata */}
        <div className="lg:col-span-4 space-y-8">
           {/* Risk Severity Gauge */}
           <GlassCard className="p-8 flex flex-col items-center gap-8 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
              <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] self-start">Severity Gauge</h4>
              <RiskGauge score={score} />
              <div className="w-full space-y-6">
                 <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-1">Classification</span>
                    <span className={`text-xl font-heading font-bold ${
                      score > 60 ? 'text-danger' : score > 30 ? 'text-warning' : 'text-success'
                    }`}>
                      {classification}
                    </span>
                 </div>
                 <SecurityChecklist checks={getSecurityChecks()} />
              </div>
           </GlassCard>

           {/* Analysis Timeline */}
           <GlassCard className="p-8">
              <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-6">Processing Chain</h4>
              <Timeline />
           </GlassCard>

           {/* Metadata Explorer */}
           <MetadataCard items={getMetadata()} title={isUrl(result) ? "Source Artifacts" : "Envelope Metadata"} />

           {/* Email Specific - Extracted Links if any */}
           {!isUrl(result) && result.heuristics.detected_links.length > 0 && (
             <GlassCard className="p-6 space-y-4">
                <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Embedded Assets</h4>
                <div className="space-y-2">
                   {result.heuristics.detected_links.map((link, i) => (
                     <div key={i} className="group p-2.5 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between gap-3 hover:border-accent-primary/30 transition-all overflow-hidden">
                        <div className="flex items-center gap-2 overflow-hidden">
                           <LinkIcon className="w-3 h-3 text-text-secondary" />
                           <span className="text-[10px] text-text-secondary truncate">{link}</span>
                        </div>
                        <Globe className="w-3 h-3 text-accent-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                     </div>
                   ))}
                </div>
             </GlassCard>
           )}
        </div>
      </div>
    </div>
  );
};

export default ThreatDashboard;
