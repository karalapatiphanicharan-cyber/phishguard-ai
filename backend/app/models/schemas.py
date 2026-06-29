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

class URLAnalysisResponse(BaseModel):
    status: str
    risk_score: int
    classification: str
    url_details: URLDetails
    security_checks: SecurityChecks
    detected_issues: List[str]
    recommendation: str
