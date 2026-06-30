from ...config.brands import LEGITIMATE_BRANDS

def check_brand_impersonation(url: str, domain: str) -> dict:
    """
    Detects brand names used in suspicious parts of the URL (e.g., as subdomains or in paths).
    """
    url_lower = url.lower()
    domain_lower = domain.lower()

    detected_brands = []

    for brand in LEGITIMATE_BRANDS:
        # If the brand is the actual domain, it's likely legitimate (or handled by typosquatting)
        if brand == domain_lower:
            continue

        # Check if brand is in the URL but NOT the domain
        if brand in url_lower:
            detected_brands.append(brand)

    if detected_brands:
        return {
            "detected": True,
            "brands": detected_brands,
            "reason": f"Legitimate brand(s) {', '.join(detected_brands)} detected in suspicious URL position"
        }

    return {"detected": False}
