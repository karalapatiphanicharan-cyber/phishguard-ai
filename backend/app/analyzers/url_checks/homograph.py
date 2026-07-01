def check_homograph(hostname: str) -> dict:
    if not hostname:
        return {"detected": False}

    # Check for non-ASCII characters
    try:
        hostname.encode('ascii')
        return {"detected": False}
    except UnicodeEncodeError:
        # Detect where the non-ASCII character is
        non_ascii_chars = [c for c in hostname if ord(c) > 127]
        return {
            "detected": True,
            "type": "Unicode Homograph",
            "characters": non_ascii_chars,
            "reason": f"Unicode homograph detected. Hostname contains non-ASCII characters ({', '.join(non_ascii_chars)}) used for spoofing."
        }
