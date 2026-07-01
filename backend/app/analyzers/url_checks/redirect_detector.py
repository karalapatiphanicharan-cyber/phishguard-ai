def check_redirect_indicators(url: str) -> dict:
    indicators = ["//", "redirect=", "url=", "next=", "destination=", "continue=", "return=", "to="]
    # Skip the initial protocol part
    url_body = url.split("://", 1)[1] if "://" in url else url

    found = [ind for ind in indicators if ind in url_body.lower()]

    if found:
        return {
            "detected": True,
            "indicators": found,
            "reason": f"Potential malicious redirect indicators found: {', '.join(found)}"
        }
    return {"detected": False}
