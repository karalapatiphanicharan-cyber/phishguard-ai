import re

def check_encoding(url: str) -> dict:
    # Check for URL encodings
    encodings = re.findall(r'%[0-9a-fA-F]{2}', url)
    if len(encodings) > 5:
        return {
            "detected": True,
            "count": len(encodings),
            "reason": f"Excessive URL encoding detected ({len(encodings)} characters)"
        }

    # Check for double encoding
    if re.search(r'%25[0-9a-fA-F]{2}', url):
        return {
            "detected": True,
            "type": "Double Encoding",
            "reason": "Double URL encoding detected (common obfuscation tactic)"
        }

    return {"detected": False}
