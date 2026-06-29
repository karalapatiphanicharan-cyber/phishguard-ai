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
