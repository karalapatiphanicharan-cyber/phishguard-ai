from pydantic import BaseModel, Field, HttpUrl
from typing import List, Optional

class URLAnalysisRequest(BaseModel):
    url: str = Field(..., max_length=2048)

class URLDetails(BaseModel):
    protocol: str
    domain: str
    subdomain: str
    tld: str
    path: str
    hostname: str
    port: Optional[str]

class SecurityChecks(BaseModel):
    https: bool
    contains_ip: bool
    contains_at_symbol: bool
    url_shortener: bool
    suspicious_keywords: List[str]
    long_url: bool
    many_subdomains: bool
    suspicious_tld: bool
    non_standard_port: bool
    encoded_characters: bool

class AIAnalysis(BaseModel):
    summary: str
    threat_type: str
    confidence: str
    attack_goal: str
    explanation: List[str]
    recommendations: List[str]
    likely_target: Optional[str] = None

class URLAnalysisResponse(BaseModel):
    status: str
    risk_score: int
    classification: str
    url_details: URLDetails
    security_checks: SecurityChecks
    detected_issues: List[str]
    recommendation: str
    ai_analysis: Optional[AIAnalysis] = None

class EmailAnalysisRequest(BaseModel):
    content: str = Field(..., min_length=10, max_length=10000)

class EmailHeuristicResults(BaseModel):
    sender: Optional[str] = None
    reply_to: Optional[str] = None
    subject: Optional[str] = None
    detected_keywords: List[str]
    urgency_level: str
    suspicious_links_count: int
    has_sensitive_requests: bool
    detected_links: List[str] = []
    email_length: int
    urgent_words_count: int
    suspicious_keywords_count: int
    capital_letters_percent: float
    excessive_punctuation: bool
    threat_language: bool
    brand_impersonation: bool
    grammar_mistakes: bool
    attachments_count: int = 0

class EmailAnalysisResponse(BaseModel):
    status: str
    risk_score: int
    classification: str
    heuristics: EmailHeuristicResults
    ai_analysis: Optional[AIAnalysis] = None
    recommendation: str
    detected_issues: List[str] = []
