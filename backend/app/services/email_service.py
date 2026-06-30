from typing import List, Dict, Any
from ..models.schemas import EmailAnalysisResponse, EmailHeuristicResults, AIAnalysis
from .gemini_service import GeminiService
from ..analyzers.email_analyzer import EmailAnalyzer
import logging

logger = logging.getLogger(__name__)

async def analyze_email(content: str) -> EmailAnalysisResponse:
    # Extract features using the new analyzer
    features = EmailAnalyzer.extract_features(content)

    # Calculate risk score and classification
    heuristic_results = EmailAnalyzer.calculate_risk_score(features)

    # Combine features and heuristic results for the response
    full_heuristics = {**features, **heuristic_results}

    # AI Analysis
    ai_result = None
    try:
        ai_result = await GeminiService.analyze_email_threats(content, full_heuristics)
    except Exception as e:
        logger.error(f"AI Analysis failed: {str(e)}")

    # Prepare recommendation based on score
    score = heuristic_results["risk_score"]
    if score <= 30:
        recommendation = "This email appears to be legitimate or low risk. However, always remain vigilant."
    elif score <= 60:
        recommendation = "This email has suspicious elements. Do not click any links or share sensitive information until verified."
    elif score <= 80:
        recommendation = "This email looks like a phishing attempt. Exercise extreme caution and do not interact with its content."
    else:
        recommendation = "Strong phishing indicators detected. This is highly likely a malicious attempt. Mark as spam and delete immediately."

    # Return structured response
    return EmailAnalysisResponse(
        status="success",
        risk_score=score,
        classification=heuristic_results["classification"],
        heuristics=EmailHeuristicResults(
            sender=features["sender"],
            reply_to=features["reply_to"],
            subject=features["subject"],
            detected_keywords=features["detected_keywords"],
            urgency_level=heuristic_results["urgency_level"],
            suspicious_links_count=features["suspicious_links_count"],
            has_sensitive_requests=features["has_sensitive_requests"],
            detected_links=features["detected_links"],
            email_length=features["email_length"],
            urgent_words_count=features["urgent_words_count"],
            suspicious_keywords_count=features["suspicious_keywords_count"],
            capital_letters_percent=features["capital_letters_percent"],
            excessive_punctuation=features["excessive_punctuation"],
            threat_language=features["threat_language"],
            brand_impersonation=features["brand_impersonation"],
            grammar_mistakes=features["grammar_mistakes"],
            attachments_count=features["attachments_count"]
        ),
        ai_analysis=ai_result,
        recommendation=recommendation,
        detected_issues=heuristic_results["detected_issues"]
    )
