export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface NavLink {
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface AIAnalysis {
  summary: string;
  threat_type: string;
  confidence: string;
  attack_goal: string;
  explanation: string[];
  recommendations: string[];
  likely_target?: string;
}

export interface URLAnalysisResponse {
  status: string;
  risk_score: number;
  classification: string;
  url_details: {
    protocol: string;
    domain: string;
    subdomain: string;
    tld: string;
    path: string;
    hostname: string;
    port: string | null;
  };
  security_checks: {
    https: boolean;
    contains_ip: boolean;
    contains_at_symbol: boolean;
    url_shortener: boolean;
    suspicious_keywords: string[];
    long_url: boolean;
    many_subdomains: boolean;
    suspicious_tld: boolean;
    non_standard_port: boolean;
    encoded_characters: boolean;
  };
  detected_issues: string[];
  recommendation: string;
  ai_analysis?: AIAnalysis;
}

export interface EmailAnalysisResponse {
  status: string;
  risk_score: number;
  classification: string;
  heuristics: {
    sender?: string;
    reply_to?: string;
    subject?: string;
    detected_keywords: string[];
    urgency_level: string;
    suspicious_links_count: number;
    has_sensitive_requests: boolean;
    detected_links: string[];
    email_length: number;
    urgent_words_count: number;
    suspicious_keywords_count: number;
    capital_letters_percent: number;
    excessive_punctuation: boolean;
    threat_language: boolean;
    brand_impersonation: boolean;
    grammar_mistakes: boolean;
    attachments_count: number;
  };
  ai_analysis?: AIAnalysis;
  recommendation: string;
  detected_issues: string[];
}
