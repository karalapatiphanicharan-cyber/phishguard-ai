def check_non_standard_port(port) -> dict:
    # Common web ports
    if port and port not in [80, 443]:
        return {
            "detected": True,
            "port": port,
            "reason": f"Non-standard web port {port} detected (commonly used for phishing panels)"
        }
    return {"detected": False}
