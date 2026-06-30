# Scoring weights for different detection indicators

URL_WEIGHTS = {
    "typosquatting": 30,
    "homograph": 40,
    "high_entropy": 25,
    "ip_address": 40,
    "non_standard_port": 15,
    "excessive_subdomains": 20,
    "suspicious_tld": 30,
    "suspicious_path": 20,
    "suspicious_params": 20,
    "encoded_chars": 20,
    "brand_impersonation": 35,
    "url_shortener": 80,
    "long_url": 10,
    "multiple_redirects": 20,
    "keyword_match": 25,
    "https_missing": 25
}

EMAIL_WEIGHTS = {
    "urgent_language": 20,
    "credential_request": 35,
    "brand_impersonation": 35,
    "threat_language": 30,
    "reward_language": 25,
    "suspicious_sender": 30,
    "reply_to_mismatch": 25,
    "excessive_caps": 15,
    "excessive_punctuation": 15,
    "grammar_mistakes": 10,
    "suspicious_link": 35,
    "attachment_presence": 20
}
