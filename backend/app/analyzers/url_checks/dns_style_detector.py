import re

def check_dns_style(hostname: str) -> dict:
    if not hostname:
        return {"detected": False}

    reasons = []

    # Repeated hyphens
    if "--" in hostname:
        reasons.append("Contains repeated hyphens")

    # Too many hyphens
    if hostname.count("-") > 3:
        reasons.append("Excessive number of hyphens")

    # Mixed numbers and letters in a way that looks random
    if re.search(r'[a-z][0-9][a-z][0-9]', hostname.lower()):
        reasons.append("Suspicious alphanumeric pattern")

    # Long sequences of numbers
    if re.search(r'[0-9]{5,}', hostname):
        reasons.append("Contains long numerical sequences")

    if reasons:
        return {
            "detected": True,
            "reasons": reasons,
            "reason": f"Suspicious DNS style: {'; '.join(reasons)}"
        }

    return {"detected": False}
