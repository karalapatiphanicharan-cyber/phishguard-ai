from ..models.schemas import EmailAnalysisResponse, EmailHeuristicResults, AIAnalysis
from .gemini_service import GeminiService
from ..analyzers.detection_engine import DetectionEngine

async def analyze_email(content: str) -> EmailAnalysisResponse:
    # Use the new DetectionEngine
    result = DetectionEngine.analyze_email(content)

    indicators = result["indicators"]
    features = result["features"]
    content_res = indicators["content"]

    urgency_level = "Low"
    if content_res["urgency_count"] >= 3 or content_res["threat_detected"]:
        urgency_level = "Critical"
    elif content_res["urgency_count"] >= 1:
        urgency_level = "High"

    heuristics = EmailHeuristicResults(
        sender=features["sender"],
        reply_to=features["reply_to"],
        subject=features["subject"],
        detected_keywords=content_res["findings"],
        urgency_level=urgency_level,
        suspicious_links_count=indicators["links"]["count"],
        has_sensitive_requests=content_res["credential_request"],
        detected_links=features["links"],
        email_length=features["email_length"],
        urgent_words_count=content_res["urgency_count"],
        suspicious_keywords_count=len(content_res["findings"]),
        capital_letters_percent=content_res["cap_percent"],
        excessive_punctuation=content_res["excessive_punctuation"],
        threat_language=content_res["threat_detected"],
        brand_impersonation=indicators["sender"]["type"] == "impersonation" if indicators["sender"]["detected"] else False,
        grammar_mistakes=False,
        attachments_count=0,
        # New indicators
        sender_spoofed=indicators["sender"]["detected"],
        reply_to_mismatch=indicators["sender"]["type"] == "mismatch" if indicators["sender"]["detected"] else False,
        reward_language=content_res["reward_detected"]
    )

    heuristic_data = {
        "risk_score": result["score"],
        "classification": result["classification"],
        "detected_issues": result["reasons"],
        "heuristics": heuristics.model_dump(),
        "indicators": indicators,
        "threat_category": result["threat_category"]
    }

    ai_result = await GeminiService.analyze_email_threats(content, heuristic_data)

    # Heuristic Fallback
    if ai_result is None:
        explanation = result["reasons"]
        recommendations = [
            "Do not click on any links in this email.",
            "Do not download or open any attachments.",
            "Verify the sender's identity through a trusted channel.",
            "Report this email as phishing to your email provider."
        ]
        if result["score"] < 30:
            recommendations = ["Continue to use caution with unsolicited emails."]

        summary = f"Heuristic analysis classifies this email as {result['classification'].lower()}."
        if result["reasons"]:
            summary += f" Detection reasons: {', '.join(result['reasons'][:2])}."

        ai_result = AIAnalysis(
            summary=summary,
            threat_type=result["threat_category"],
            confidence="High" if result["score"] > 80 else "Medium",
            attack_goal="Credential harvesting or social engineering" if result["score"] > 30 else "Unknown",
            explanation=explanation,
            recommendations=recommendations,
            likely_target="General Email Recipient"
        )

    recommendation = "This email appears to be safe."
    if result["score"] >= 80:
        recommendation = "This email is highly likely to be a phishing attempt. Do not click any links or provide any information."
    elif result["score"] >= 60:
        recommendation = "Be very careful. This email has multiple high-risk indicators."
    elif result["score"] > 30:
        recommendation = "Treat this email with suspicion. Verify the sender before taking any action."

    return EmailAnalysisResponse(
        status="success",
        risk_score=result["score"],
        classification=result["classification"],
        heuristics=heuristics,
        ai_analysis=ai_result,
        recommendation=recommendation,
        detected_issues=result["reasons"],
        indicators=indicators
    )
