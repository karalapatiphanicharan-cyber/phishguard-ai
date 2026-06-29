from ..utils import url_utils
from ..models.schemas import URLAnalysisResponse, URLDetails, SecurityChecks
from .gemini_service import GeminiService

async def analyze_url_heuristics(url: str) -> URLAnalysisResponse:
    features = url_utils.extract_url_features(url)

    # Security Checks
    is_https = features["protocol"] == "https"
    has_ip = url_utils.check_ip_address(features["hostname"])
    has_at = url_utils.contains_at_symbol(url)
    shortener = url_utils.is_url_shortener(features["domain"], features["tld"])
    keywords = url_utils.get_suspicious_keywords(url)
    is_long = len(url) > 75
    many_subs = url_utils.has_many_subdomains(features["subdomain"])
    suspicious_tld = url_utils.is_suspicious_tld(features["tld"])
    non_std_port = url_utils.is_non_standard_port(features["port"])
    encoded = url_utils.has_encoded_characters(url)

    # Risk Scoring
    score = 0
    issues = []

    if not is_https:
        score += 20
        issues.append("HTTPS is not enabled")
    if has_ip:
        score += 25
        issues.append("URL contains an IP address instead of a domain name")
    if has_at:
        score += 15
        issues.append("URL contains '@' symbol, often used for credential theft")
    if shortener:
        score += 20
        issues.append("URL uses a known shortener service")
    if keywords:
        score += 15 * len(keywords)
        issues.append(f"Suspicious keywords detected: {', '.join(keywords)}")
    if is_long:
        score += 10
        issues.append("URL is unusually long")
    if many_subs:
        score += 10
        issues.append("URL has too many subdomains")
    if suspicious_tld:
        score += 15
        issues.append("Domain uses a suspicious TLD associated with phishing")
    if non_std_port:
        score += 10
        issues.append("URL uses a non-standard port")
    if encoded:
        score += 10
        issues.append("URL contains encoded characters")

    score = min(score, 100)

    # Classification
    if score <= 30:
        classification = "Safe"
        recommendation = "This URL appears to be safe."
    elif score <= 60:
        classification = "Suspicious"
        recommendation = "Be cautious. This URL has some suspicious indicators."
    elif score <= 80:
        classification = "High Risk"
        recommendation = "Avoid entering sensitive information on this website."
    else:
        classification = "Potential Phishing"
        recommendation = "This URL shows strong indicators of a phishing attempt. Avoid it."

    security_checks = SecurityChecks(
        https=is_https,
        contains_ip=has_ip,
        contains_at_symbol=has_at,
        url_shortener=shortener,
        suspicious_keywords=keywords,
        long_url=is_long,
        many_subdomains=many_subs,
        suspicious_tld=suspicious_tld,
        non_standard_port=non_std_port,
        encoded_characters=encoded
    )

    # Heuristic dictionary for AI context
    heuristic_data = {
        "risk_score": score,
        "classification": classification,
        "detected_issues": issues,
        "security_checks": security_checks.model_dump()
    }

    # AI Analysis
    ai_result = await GeminiService.analyze_url_threats(url, heuristic_data)

    return URLAnalysisResponse(
        status="success",
        risk_score=score,
        classification=classification,
        url_details=URLDetails(
            protocol=features["protocol"],
            domain=features["domain"],
            subdomain=features["subdomain"],
            tld=features["tld"],
            path=features["path"],
            hostname=features["hostname"],
            port=str(features["port"]) if features["port"] else None
        ),
        security_checks=security_checks,
        detected_issues=issues,
        recommendation=recommendation,
        ai_analysis=ai_result
    )
