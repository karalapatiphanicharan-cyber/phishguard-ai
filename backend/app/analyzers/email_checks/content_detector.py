import re
from ...config.keywords import URGENCY_KEYWORDS, CREDENTIAL_KEYWORDS, SUSPICIOUS_KEYWORDS, THREAT_KEYWORDS

def check_email_content(subject: str, body: str) -> dict:
    content = (subject or "") + " " + body
    content_lower = content.lower()

    findings = []

    # 1. Urgency Detection
    urgency_matches = [kw for kw in URGENCY_KEYWORDS if kw in content_lower]

    # 2. Credential Request Detection
    cred_matches = [kw for kw in CREDENTIAL_KEYWORDS if kw in content_lower]

    # 3. Threat Detection
    threat_matches = [kw for kw in THREAT_KEYWORDS if kw in content_lower]

    # 4. Reward/Scam Detection
    reward_keywords = ["winner", "prize", "gift card", "lottery", "inheritance", "payment pending", "reward"]
    reward_matches = [kw for kw in reward_keywords if kw in content_lower]

    # 5. Generic Suspicious Keywords
    suspicious_matches = [kw for kw in SUSPICIOUS_KEYWORDS if kw in content_lower]

    # Capitalization Check
    body_len = len(body)
    cap_count = sum(1 for c in body if c.isupper())
    cap_percent = (cap_count / body_len * 100) if body_len > 0 else 0

    # Excessive Punctuation
    excessive_punct = len(re.findall(r'[!?]{2,}', body)) > 0

    return {
        "urgency_count": len(urgency_matches),
        "credential_request": len(cred_matches) > 1, # Multiple keywords usually indicate a form or request
        "threat_detected": len(threat_matches) > 0,
        "reward_detected": len(reward_matches) > 0,
        "findings": list(set(urgency_matches + cred_matches + threat_matches + reward_matches + suspicious_matches)),
        "cap_percent": cap_percent,
        "excessive_punctuation": excessive_punct
    }
