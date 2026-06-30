import re
import ipaddress
from urllib.parse import urlparse
from ...config.keywords import SUSPICIOUS_PATHS, SUSPICIOUS_PARAMS

def check_ip_address(hostname: str) -> dict:
    try:
        # Check if it's an IP address
        ipaddress.ip_address(hostname)
        return {
            "detected": True,
            "type": "IP",
            "reason": "URL uses an IP address instead of a domain name"
        }
    except ValueError:
        # Check for Hex/Octal/Decimal obfuscated IPs (basic regex)
        if re.match(r'^0x[0-9a-fA-F.]+$', hostname) or re.match(r'^[0-9.]+$', hostname):
             return {
                "detected": True,
                "type": "Obfuscated IP",
                "reason": "URL uses a potentially obfuscated IP address"
            }
        return {"detected": False}

def check_non_standard_port(port) -> dict:
    if port and port not in [80, 443]:
        return {
            "detected": True,
            "port": port,
            "reason": f"Non-standard port {port} detected"
        }
    return {"detected": False}

def check_subdomain_depth(subdomain: str) -> dict:
    if not subdomain:
        return {"detected": False, "depth": 0}

    parts = [p for p in subdomain.split('.') if p]
    depth = len(parts)

    if depth >= 3:
        return {
            "detected": True,
            "depth": depth,
            "reason": f"Excessive subdomain depth ({depth}) detected"
        }
    return {"detected": False, "depth": depth}

def check_suspicious_path(path: str) -> dict:
    path_lower = path.lower()
    found = [kw for kw in SUSPICIOUS_PATHS if kw in path_lower]

    if found:
        return {
            "detected": True,
            "keywords": found,
            "reason": f"Suspicious keywords in path: {', '.join(found)}"
        }
    return {"detected": False}

def check_suspicious_params(query: str) -> dict:
    query_lower = query.lower()
    found = [kw for kw in SUSPICIOUS_PARAMS if kw in query_lower]

    if found:
        return {
            "detected": True,
            "keywords": found,
            "reason": f"Suspicious query parameters: {', '.join(found)}"
        }
    return {"detected": False}

def check_encoding(url: str) -> dict:
    # Check for multiple encodings or double encoding
    encodings = re.findall(r'%[0-9a-fA-F]{2}', url)
    if len(encodings) > 5:
        return {
            "detected": True,
            "count": len(encodings),
            "reason": "Excessive URL encoding detected"
        }
    return {"detected": False}

def check_redirect_indicators(url: str) -> dict:
    indicators = ["//", "redirect=", "url=", "next=", "destination=", "continue=", "return="]
    found = [ind for ind in indicators if ind in url.lower()[8:]] # Skip protocol //

    if found:
        return {
            "detected": True,
            "indicators": found,
            "reason": f"Potential redirect indicators found: {', '.join(found)}"
        }
    return {"detected": False}
