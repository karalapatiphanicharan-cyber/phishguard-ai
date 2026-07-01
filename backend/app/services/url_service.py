from ..models.schemas import URLAnalysisResponse, URLDetails, SecurityChecks, AIAnalysis
from ..analyzers.detection_engine import DetectionEngine
from .report_generator import SummaryGenerator, RecommendationGenerator

async def analyze_url_heuristics(url: str) -> URLAnalysisResponse:
    # Use the DetectionEngine
    result = DetectionEngine.analyze_url(url)

    indicators = result["indicators"]
    details = result["details"]

    # Map to existing SecurityChecks model for backward compatibility
    security_checks = SecurityChecks(
        https=not indicators["https"]["detected"],
        contains_ip=indicators["ip_address"]["detected"],
        contains_at_symbol="@" in url,
        url_shortener=indicators["url_shortener"]["detected"],
        suspicious_keywords=indicators["suspicious_path"].get("keywords", []) + indicators["suspicious_params"].get("keywords", []) + indicators.get("hostname_keywords", {}).get("keywords", []),
        long_url=indicators["long_url"]["detected"],
        many_subdomains=indicators["subdomain_depth"]["detected"],
        suspicious_tld=indicators["suspicious_tld"]["detected"],
        non_standard_port=indicators["port"]["detected"],
        encoded_characters=indicators["encoding"]["detected"],
        typosquatting=indicators["typosquatting"]["detected"],
        homograph=indicators["homograph"]["detected"],
        high_entropy=indicators["entropy"]["detected"],
        brand_impersonation=indicators["brand_impersonation"]["detected"]
    )

    # Generate Analysis Reports locally
    summary = SummaryGenerator.generate_url_summary(result)
    recommendations = RecommendationGenerator.get_url_recommendations(result)

    ai_result = AIAnalysis(
        summary=summary,
        threat_type=result["threat_category"],
        confidence="High" if result["score"] > 80 else "Medium" if result["score"] > 30 else "Low",
        attack_goal="Credential theft or malicious redirection" if result["score"] > 30 else "Unknown",
        explanation=result["reasons"],
        recommendations=recommendations,
        likely_target="General Web Users"
    )

    recommendation = "This URL appears to be safe."
    if result["score"] >= 80:
        recommendation = "This URL shows strong indicators of a phishing attempt. Avoid it."
    elif result["score"] >= 60:
        recommendation = "Avoid entering sensitive information on this website."
    elif result["score"] > 30:
        recommendation = "Be cautious. This URL has some suspicious indicators."

    return URLAnalysisResponse(
        status="success",
        risk_score=result["score"],
        classification=result["classification"],
        url_details=URLDetails(
            protocol=details["protocol"],
            domain=details["domain"],
            subdomain=details["subdomain"],
            tld=details["tld"],
            path=details["path"],
            hostname=details["hostname"],
            port=str(details["port"]) if details["port"] else None
        ),
        security_checks=security_checks,
        detected_issues=result["reasons"],
        recommendation=recommendation,
        ai_analysis=ai_result,
        indicators=indicators
    )
