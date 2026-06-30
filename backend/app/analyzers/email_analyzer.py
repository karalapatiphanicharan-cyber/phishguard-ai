import re
from typing import Dict, Any, List

URGENT_WORDS = [
    "immediately", "verify now", "act fast", "account suspended",
    "limited time", "payment failed", "security alert", "password reset",
    "urgent", "asap", "hurry", "expired", "action required"
]

CREDENTIAL_KEYWORDS = [
    "password", "otp", "credit card", "bank", "login",
    "pin", "verification code", "credentials", "social security",
    "ssn", "tax id", "passport"
]

SUSPICIOUS_KEYWORDS = [
    "compromised", "unauthorized", "login attempt", "invoice",
    "gift card", "crypto", "bitcoin", "lottery", "prize",
    "free money", "reward", "winner", "inheritance"
]

BRAND_KEYWORDS = [
    "amazon", "microsoft", "google", "apple", "netflix",
    "paypal", "bank of america", "chase", "wells fargo",
    "facebook", "instagram"
]

THREAT_WORDS = [
    "permanently suspend", "legal action", "police", "lawsuit",
    "arrest", "locked out", "deleted", "blocked"
]

class EmailAnalyzer:
    @staticmethod
    def extract_features(content: str) -> Dict[str, Any]:
        lines = content.split('\n')
        sender = None
        reply_to = None
        subject = None
        body = content
        attachments_count = 0

        for line in lines:
            line_lower = line.lower()
            if line_lower.startswith('from:'):
                sender = line[5:].strip()
            elif line_lower.startswith('reply-to:'):
                reply_to = line[9:].strip()
            elif line_lower.startswith('subject:'):
                subject = line[8:].strip()
            elif 'attachment' in line_lower and ('filename=' in line_lower or 'content-disposition: attachment' in line_lower):
                attachments_count += 1

        # Simple body extraction if headers are present
        if sender or subject or reply_to:
            body_parts = []
            headers_done = False
            for line in lines:
                if headers_done:
                    body_parts.append(line)
                elif line.strip() == "":
                    headers_done = True
            if body_parts:
                body = "\n".join(body_parts)

        content_lower = content.lower()

        # Extract links
        links = re.findall(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', content)

        # Word counts
        urgent_count = sum(1 for word in URGENT_WORDS if word in content_lower)
        credential_count = sum(1 for word in CREDENTIAL_KEYWORDS if word in content_lower)
        suspicious_count = sum(1 for word in SUSPICIOUS_KEYWORDS if word in content_lower)

        # Threat language
        has_threat = any(word in content_lower for word in THREAT_WORDS)

        # Brand impersonation
        detected_brands = [brand for brand in BRAND_KEYWORDS if brand in content_lower]

        # Capital letters percentage
        alnum_chars = [c for c in content if c.isalnum()]
        cap_letters = [c for c in content if c.isupper()]
        cap_percent = (len(cap_letters) / len(alnum_chars) * 100) if alnum_chars else 0

        # Excessive punctuation
        excessive_punc = len(re.findall(r'[!?]{2,}', content)) > 0

        # Grammar/Misspellings (Heuristic)
        # Check for common mistakes
        common_mistakes = ["teh ", "recieve", "adn ", "occured", "untill", "your a ", "youre account"]
        grammar_mistakes = any(mistake in content_lower for mistake in common_mistakes)

        return {
            "sender": sender,
            "reply_to": reply_to,
            "subject": subject,
            "body": body,
            "detected_links": links,
            "suspicious_links_count": len(links),
            "attachments_count": attachments_count,
            "urgent_words_count": urgent_count,
            "credential_words_count": credential_count,
            "suspicious_keywords_count": suspicious_count,
            "has_sensitive_requests": credential_count > 0,
            "threat_language": has_threat,
            "brand_impersonation": len(detected_brands) > 0,
            "capital_letters_percent": cap_percent,
            "excessive_punctuation": excessive_punc,
            "grammar_mistakes": grammar_mistakes,
            "email_length": len(content),
            "detected_keywords": list(set([w for w in URGENT_WORDS + CREDENTIAL_KEYWORDS + SUSPICIOUS_KEYWORDS if w in content_lower]))
        }

    @staticmethod
    def calculate_risk_score(features: Dict[str, Any]) -> Dict[str, Any]:
        score = 0
        issues = []

        if features["urgent_words_count"] > 0:
            score += 15
            issues.append("Urgent or threatening language detected")

        if features["has_sensitive_requests"]:
            score += 20
            issues.append("Request for sensitive credentials or personal info")

        if features["sender"] and any(brand in features["sender"].lower() for brand in BRAND_KEYWORDS):
            score += 20
            issues.append("Potential brand impersonation in sender address")
        elif features["brand_impersonation"]:
            score += 15
            issues.append("Brand names mentioned in suspicious context")

        if features["suspicious_links_count"] > 0:
            score += 20
            issues.append(f"Contains {features['suspicious_links_count']} external link(s)")

        if features["attachments_count"] > 0:
            score += 10
            issues.append(f"Contains {features['attachments_count']} attachment(s)")

        if features["threat_language"]:
            score += 10
            issues.append("Threatening or coercive language used")

        # Reward/Lottery language
        reward_keywords = ["lottery", "prize", "winner", "reward", "free money"]
        if any(word in features["detected_keywords"] for word in reward_keywords):
            score += 10
            issues.append("Promises of rewards or unrealistic gains")

        if features["capital_letters_percent"] > 30:
            score += 5
            issues.append("Excessive use of capital letters")

        if features["excessive_punctuation"]:
            score += 5
            issues.append("Excessive punctuation detected")

        score = min(score, 100)

        if score <= 30:
            classification = "Safe"
        elif score <= 60:
            classification = "Suspicious"
        elif score <= 80:
            classification = "High Risk"
        else:
            classification = "Potential Phishing"

        urgency_level = "Low"
        if features["urgent_words_count"] >= 3 or features["threat_language"]:
            urgency_level = "Critical"
        elif features["urgent_words_count"] >= 1:
            urgency_level = "High"

        return {
            "risk_score": score,
            "classification": classification,
            "detected_issues": issues,
            "urgency_level": urgency_level
        }
