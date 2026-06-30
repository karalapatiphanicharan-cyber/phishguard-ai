import re
from ...config.keywords import URGENCY_KEYWORDS, CREDENTIAL_KEYWORDS, THREAT_KEYWORDS, SUSPICIOUS_KEYWORDS

def check_email_content(subject: str, body: str) -> dict:
    """
    Analyzes email subject and body for social engineering tactics.
    """
    combined = f"{subject or ''} {body or ''}".lower()

    findings = []
    urgency_count = 0
    credential_request = False
    threat_detected = False
    reward_detected = False

    # 1. Urgency/Pressure
    for kw in URGENCY_KEYWORDS:
        if kw in combined:
            # Count occurrences
            count = combined.count(kw)
            urgency_count += count
            findings.append(f"Urgency indicator: {kw}")

    # 2. Credential Requests
    for kw in CREDENTIAL_KEYWORDS:
        if kw in combined:
            credential_request = True
            findings.append(f"Credential Request: {kw}")

    # 3. Threats
    for kw in THREAT_KEYWORDS:
        if kw in combined:
            threat_detected = True
            findings.append(f"Threat: {kw}")

    # 4. Rewards/Scams
    scam_keywords = ["lottery", "prize", "winner", "reward", "free money", "inheritance", "tax refund", "gift card", "crypto", "bitcoin"]
    for kw in scam_keywords:
        if kw in combined:
            reward_detected = True
            findings.append(f"Scam indicator: {kw}")

    # 5. Business / Invoice specific
    invoice_keywords = ["invoice", "billing", "payment", "overdue", "wire transfer", "bank details", "vendor"]
    for kw in invoice_keywords:
        if kw in combined:
            findings.append(f"Financial indicator: {kw}")

    # 6. Grammar/Formatting (Basic)
    alnum_chars = [c for c in combined if c.isalnum()]
    cap_letters = [c for c in (f"{subject or ''} {body or ''}") if c.isupper()]
    cap_percent = (len(cap_letters) / len(alnum_chars) * 100) if alnum_chars else 0

    excessive_punc = len(re.findall(r'[!?]{2,}', body or '')) > 0

    return {
        "urgency_count": urgency_count,
        "credential_request": credential_request,
        "threat_detected": threat_detected,
        "reward_detected": reward_detected,
        "findings": findings,
        "cap_percent": cap_percent,
        "excessive_punctuation": excessive_punc
    }
