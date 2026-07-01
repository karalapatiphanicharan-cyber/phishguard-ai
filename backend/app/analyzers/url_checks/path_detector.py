from ...config.keywords import SUSPICIOUS_PATHS

def check_suspicious_path(path: str) -> dict:
    if not path:
        return {"detected": False}

    path_lower = path.lower()
    found = [kw for kw in SUSPICIOUS_PATHS if kw in path_lower]

    if found:
        return {
            "detected": True,
            "keywords": found,
            "reason": f"Suspicious directory or file path detected: {', '.join(found)}"
        }
    return {"detected": False}
