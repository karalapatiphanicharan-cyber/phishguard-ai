# Scoring weights for different detection indicators

URL_WEIGHTS = {
    "typosquatting": 30,
    "homograph": 40,
    "high_entropy": 20,
    "ip_address": 30,
    "non_standard_port": 15,
    "excessive_subdomains": 15,
    "suspicious_tld": 15,
    "suspicious_path": 10,
    "suspicious_params": 10,
    "encoded_chars": 10,
    "brand_impersonation": 25,
    "url_shortener": 20,
    "long_url": 10,
    "multiple_redirects": 20
}

EMAIL_WEIGHTS = {
    "urgent_language": 15,
    "credential_request": 25,
    "brand_impersonation": 25,
    "threat_language": 20,
    "reward_language": 15,
    "suspicious_sender": 20,
    "reply_to_mismatch": 15,
    "excessive_caps": 10,
    "excessive_punctuation": 10,
    "grammar_mistakes": 5,
    "suspicious_link": 20,
    "attachment_presence": 10
}
