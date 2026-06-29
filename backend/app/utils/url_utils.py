import re
from urllib.parse import urlparse
import tldextract
import ipaddress

SUSPICIOUS_KEYWORDS = [
    "login", "verify", "secure", "account", "update", "payment",
    "bank", "confirm", "wallet", "password", "signin", "auth"
]

SUSPICIOUS_TLDS = [
    "xyz", "top", "pw", "ga", "ml", "cf", "tk", "gq", "bid", "icu", "date", "win"
]

URL_SHORTENERS = [
    "bit.ly", "goo.gl", "t.co", "tinyurl.com", "is.gd", "buff.ly", "adf.ly", "bit.do"
]

def extract_url_features(url: str):
    parsed = urlparse(url)
    ext = tldextract.extract(url)

    return {
        "protocol": parsed.scheme,
        "domain": ext.domain,
        "subdomain": ext.subdomain,
        "tld": ext.suffix,
        "path": parsed.path,
        "hostname": parsed.hostname or "",
        "port": parsed.port,
        "query": parsed.query
    }

def check_ip_address(hostname: str) -> bool:
    try:
        ipaddress.ip_address(hostname)
        return True
    except ValueError:
        return False

def contains_at_symbol(url: str) -> bool:
    return "@" in url

def is_url_shortener(domain: str, tld: str) -> bool:
    full_domain = f"{domain}.{tld}"
    return full_domain in URL_SHORTENERS

def get_suspicious_keywords(url: str) -> list:
    found = []
    url_lower = url.lower()
    for kw in SUSPICIOUS_KEYWORDS:
        if kw in url_lower:
            found.append(kw)
    return found

def has_many_subdomains(subdomain: str) -> bool:
    if not subdomain:
        return False
    return len(subdomain.split('.')) >= 3

def is_non_standard_port(port) -> bool:
    if port is None:
        return False
    return port not in [80, 443]

def has_encoded_characters(url: str) -> bool:
    return "%" in url

def is_suspicious_tld(tld: str) -> bool:
    return tld in SUSPICIOUS_TLDS
