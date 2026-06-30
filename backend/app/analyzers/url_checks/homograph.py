import unicodedata

def check_homograph(hostname: str) -> dict:
    """
    Detects potential Unicode homograph attacks (e.g., using Cyrillic 'а' instead of Latin 'a').
    """
    is_unicode = False
    suspicious_chars = []

    for char in hostname:
        if ord(char) > 127:
            is_unicode = True
            try:
                name = unicodedata.name(char)
                suspicious_chars.append(f"{char} ({name})")
            except ValueError:
                suspicious_chars.append(char)

    if is_unicode:
        return {
            "detected": True,
            "suspicious_chars": suspicious_chars,
            "reason": "URL contains non-ASCII characters, possible homograph attack"
        }

    return {"detected": False}
