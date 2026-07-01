from ...config.suspicious_tlds import SUSPICIOUS_TLDS

def check_suspicious_tld(tld: str) -> dict:
    if tld in SUSPICIOUS_TLDS:
        return {
            "detected": True,
            "tld": tld,
            "score": SUSPICIOUS_TLDS[tld],
            "reason": f"Domain uses a suspicious TLD: .{tld}"
        }
    return {"detected": False}
