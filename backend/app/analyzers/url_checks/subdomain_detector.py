def check_subdomain_depth(subdomain: str) -> dict:
    if not subdomain:
        return {"detected": False, "depth": 0}

    parts = [p for p in subdomain.split('.') if p]
    depth = len(parts)

    # 3 or more subdomains is highly suspicious (e.g., login.microsoft.security.update.com)
    if depth >= 3:
        return {
            "detected": True,
            "depth": depth,
            "reason": f"Excessive subdomain depth ({depth}) detected"
        }
    return {"detected": False, "depth": depth}
