import re
from typing import List, Dict, Any
from ..models.schemas import EmailAnalysisResponse, EmailHeuristicResults, AIAnalysis
from .gemini_service import GeminiService

SUSPICIOUS_KEYWORDS = [
    "urgent", "immediate", "action required", "compromised", "verify",
    "account suspended", "unauthorized", "login attempt", "bank", "payment",
    "invoice", "gift card", "crypto", "bitcoin", "password reset"
]

SENSITIVE_REQUESTS = [
    "social security", "credit card", "bank account", "password",
    "credentials", "pin number", "transfer money", "wire transfer"
]

def extract_email_heuristics(content: str) -> Dict[str, Any]:
    content_lower = content.lower()

    detected_keywords = [kw for kw in SUSPICIOUS_KEYWORDS if kw in content_lower]

    # Check for urgency
    urgency_indicators = ["urgent", "immediate", "asap", "hurry", "expired"]
    urgency_count = sum(1 for indicator in urgency_indicators if indicator in content_lower)

    if urgency_count >= 3:
        urgency_level = "Critical"
    elif urgency_count >= 1:
        urgency_level = "High"
    else:
        urgency_level = "Low"

    # Find links
    links = re.findall(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', content)

    # Check for sensitive requests
    has_sensitive = any(req in content_lower for req in SENSITIVE_REQUESTS)

    return {
        "detected_keywords": detected_keywords,
        "urgency_level": urgency_level,
        "suspicious_links_count": len(links),
        "has_sensitive_requests": has_sensitive
    }

async def analyze_email(content: str) -> EmailAnalysisResponse:
    heuristics = extract_email_heuristics(content)

    # Risk Scoring
    score = 0
    if heuristics["urgency_level"] == "Critical":
        score += 30
    elif heuristics["urgency_level"] == "High":
        score += 15

    score += len(heuristics["detected_keywords"]) * 10
    score += heuristics["suspicious_links_count"] * 10
    if heuristics["has_sensitive_requests"]:
        score += 40

    score = min(score, 100)

    # Classification
    if score <= 30:
        classification = "Safe"
        recommendation = "This email appears to be legitimate or low risk."
    elif score <= 60:
        classification = "Suspicious"
        recommendation = "This email has suspicious elements. Do not click any links or share sensitive information."
    elif score <= 80:
        classification = "High Risk"
        recommendation = "This email looks like a phishing attempt. Exercise extreme caution."
    else:
        classification = "Potential Phishing"
        recommendation = "Strong phishing indicators detected. Mark as spam and delete."

    # AI Analysis
    ai_result = await GeminiService.analyze_email_threats(content, heuristics)

    return EmailAnalysisResponse(
        status="success",
        risk_score=score,
        classification=classification,
        heuristics=EmailHeuristicResults(**heuristics),
        ai_analysis=ai_result,
        recommendation=recommendation
    )
