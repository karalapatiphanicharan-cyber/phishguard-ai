from ...config.keywords import SUSPICIOUS_PARAMS

def check_suspicious_params(query: str) -> dict:
    if not query:
        return {"detected": False}

    query_lower = query.lower()
    found = [kw for kw in SUSPICIOUS_PARAMS if kw in query_lower]

    if found:
        return {
            "detected": True,
            "keywords": found,
            "reason": f"Suspicious query parameters detected: {', '.join(found)}"
        }
    return {"detected": False}
