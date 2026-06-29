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
}
