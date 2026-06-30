# Keywords for different types of phishing indicators

URGENCY_KEYWORDS = [
    "immediately", "verify now", "act fast", "account suspended",
    "limited time", "payment failed", "security alert", "password reset",
    "urgent", "asap", "hurry", "expired", "action required",
    "unauthorized access", "prevent suspension", "locked"
]

CREDENTIAL_KEYWORDS = [
    "password", "otp", "credit card", "bank", "login",
    "pin", "verification code", "credentials", "social security",
    "ssn", "tax id", "passport", "cvv", "recovery phrase", "private key"
]

SUSPICIOUS_KEYWORDS = [
    "compromised", "unauthorized", "login attempt", "invoice",
    "gift card", "crypto", "bitcoin", "lottery", "prize",
    "free money", "reward", "winner", "inheritance",
    "tax refund", "payment pending", "parcel delivery"
]

THREAT_KEYWORDS = [
    "permanently suspend", "legal action", "police", "lawsuit",
    "arrest", "locked out", "deleted", "blocked", "termination"
]

SUSPICIOUS_PATHS = [
    "login", "signin", "verify", "authenticate", "reset-password",
    "payment", "invoice", "wallet", "bank", "confirm", "security",
    "account", "update", "secure", "validate"
]

SUSPICIOUS_PARAMS = [
    "token", "session", "redirect", "password", "verify", "login",
    "continue", "return", "auth", "url", "next", "destination"
]

# Added for hostname check specifically to give more granular scores if needed
HOSTNAME_KEYWORDS = SUSPICIOUS_PATHS + ["secure", "bank", "login", "verify", "account", "update", "signin", "support", "billing"]
