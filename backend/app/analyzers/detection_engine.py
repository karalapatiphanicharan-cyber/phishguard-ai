from typing import Dict, Any, List
from urllib.parse import urlparse
import tldextract
import logging

# Import modular detectors
from .url_checks.typosquatting import check_typosquatting
from .url_checks.homograph import check_homograph
from .url_checks.entropy_detector import check_high_entropy
from .url_checks.brand import check_brand_impersonation
from .url_checks.ip_detector import check_ip_address
from .url_checks.port_detector import check_non_standard_port
from .url_checks.subdomain_detector import check_subdomain_depth
from .url_checks.path_detector import check_suspicious_path
from .url_checks.query_detector import check_suspicious_params
from .url_checks.encoding_detector import check_encoding
from .url_checks.redirect_detector import check_redirect_indicators
from .url_checks.tld_detector import check_suspicious_tld
from .url_checks.dns_style_detector import check_dns_style

from .email_checks.sender_detector import check_sender_spoofing
from .email_checks.content_detector import check_email_content
from .email_checks.link_detector import extract_links

from ..config.weights import URL_WEIGHTS, EMAIL_WEIGHTS
from ..config.keywords import HOSTNAME_KEYWORDS, CREDENTIAL_KEYWORDS, SUSPICIOUS_KEYWORDS, URGENCY_KEYWORDS
from ..config.patterns import SHORTENER_DOMAINS

# Set up logging
logger = logging.getLogger(__name__)

class DetectionEngine:
    @staticmethod
    def analyze_url(url: str) -> Dict[str, Any]:
        parsed = urlparse(url)
        ext = tldextract.extract(url)
        domain = ext.domain
        hostname = parsed.hostname or ""
        subdomain = ext.subdomain
        tld = ext.suffix
        path = parsed.path
        query = parsed.query

        score = 0
        reasons = []
        indicators = {}

        # 1. Typosquatting
        res = check_typosquatting(domain)
        indicators["typosquatting"] = res
        if res["detected"]:
            score += URL_WEIGHTS["typosquatting"]
            reasons.append(res["reason"])
            logger.info(f"FAIL: Typosquatting | Score: {URL_WEIGHTS['typosquatting']} | Evidence: {res.get('brand')}")

        # 2. Homograph
        res = check_homograph(hostname)
        indicators["homograph"] = res
        if res["detected"]:
            score += URL_WEIGHTS["homograph"]
            reasons.append(res["reason"])
            logger.info(f"FAIL: Homograph | Score: {URL_WEIGHTS['homograph']} | Evidence: {res.get('characters')}")

        # 3. Entropy
        res = check_high_entropy(hostname)
        indicators["entropy"] = res
        if res["detected"]:
            score += URL_WEIGHTS["high_entropy"]
            reasons.append(res["reason"])
            logger.info(f"FAIL: Entropy | Score: {URL_WEIGHTS['high_entropy']} | Evidence: {res.get('entropy')}")

        # 4. Brand Impersonation
        res = check_brand_impersonation(url, domain)
        indicators["brand_impersonation"] = res
        if res["detected"]:
            score += URL_WEIGHTS["brand_impersonation"]
            reasons.append(res["reason"])
            logger.info(f"FAIL: Brand Impersonation | Score: {URL_WEIGHTS['brand_impersonation']} | Evidence: {res.get('brands')}")

        # 5. IP Address
        res = check_ip_address(hostname)
        indicators["ip_address"] = res
        if res["detected"]:
            score += URL_WEIGHTS["ip_address"]
            reasons.append(res["reason"])
            logger.info(f"FAIL: IP Address | Score: {URL_WEIGHTS['ip_address']} | Evidence: {res.get('type')}")

        # 6. Non-standard Port
        res = check_non_standard_port(parsed.port)
        indicators["port"] = res
        if res["detected"]:
            score += URL_WEIGHTS["non_standard_port"]
            reasons.append(res["reason"])
            logger.info(f"FAIL: Port | Score: {URL_WEIGHTS['non_standard_port']} | Evidence: {res.get('port')}")

        # 7. Subdomain Depth
        res = check_subdomain_depth(subdomain)
        indicators["subdomain_depth"] = res
        if res["detected"]:
            score += URL_WEIGHTS["excessive_subdomains"]
            reasons.append(res["reason"])
            logger.info(f"FAIL: Subdomains | Score: {URL_WEIGHTS['excessive_subdomains']} | Evidence: {res.get('depth')}")

        # 8. DNS Style
        res = check_dns_style(hostname)
        indicators["dns_style"] = res
        if res["detected"]:
            score += URL_WEIGHTS["dns_style"]
            reasons.append(res["reason"])
            logger.info(f"FAIL: DNS Style | Score: {URL_WEIGHTS['dns_style']} | Evidence: {res.get('reasons')}")

        # 9. Suspicious Path
        res = check_suspicious_path(path)
        indicators["suspicious_path"] = res
        if res["detected"]:
            score += URL_WEIGHTS["suspicious_path"]
            reasons.append(res["reason"])
            logger.info(f"FAIL: Path | Score: {URL_WEIGHTS['suspicious_path']} | Evidence: {res.get('keywords')}")

        # 10. Suspicious Params
        res = check_suspicious_params(query)
        indicators["suspicious_params"] = res
        if res["detected"]:
            score += URL_WEIGHTS["suspicious_params"]
            reasons.append(res["reason"])
            logger.info(f"FAIL: Params | Score: {URL_WEIGHTS['suspicious_params']} | Evidence: {res.get('keywords')}")

        # 11. Encoding
        res = check_encoding(url)
        indicators["encoding"] = res
        if res["detected"]:
            score += URL_WEIGHTS["encoded_chars"]
            reasons.append(res["reason"])
            logger.info(f"FAIL: Encoding | Score: {URL_WEIGHTS['encoded_chars']}")

        # 12. Redirects
        res = check_redirect_indicators(url)
        indicators["redirects"] = res
        if res["detected"]:
            score += URL_WEIGHTS["multiple_redirects"]
            reasons.append(res["reason"])
            logger.info(f"FAIL: Redirects | Score: {URL_WEIGHTS['multiple_redirects']} | Evidence: {res.get('indicators')}")

        # 13. TLD
        res = check_suspicious_tld(tld)
        indicators["suspicious_tld"] = res
        if res["detected"]:
            score += res["score"]
            reasons.append(res["reason"])
            logger.info(f"FAIL: TLD | Score: {res.get('score')} | Evidence: {res.get('tld')}")

        # 14. URL Shortener
        full_domain = f"{domain}.{tld}"
        if full_domain in SHORTENER_DOMAINS:
            score += URL_WEIGHTS["url_shortener"]
            indicators["url_shortener"] = {"detected": True}
            reasons.append("URL uses a known shortener service which hides the destination")
            logger.info(f"FAIL: Shortener | Score: {URL_WEIGHTS['url_shortener']} | Evidence: {full_domain}")
        else:
            indicators["url_shortener"] = {"detected": False}

        # 15. Long URL
        if len(url) > 75:
            score += URL_WEIGHTS["long_url"]
            indicators["long_url"] = {"detected": True, "length": len(url)}
            reasons.append("URL is unusually long")
            logger.info(f"FAIL: Length | Score: {URL_WEIGHTS['long_url']} | Evidence: {len(url)}")
        else:
            indicators["long_url"] = {"detected": False}

        # 16. HTTPS
        is_https = parsed.scheme == "https"
        indicators["https"] = {"detected": not is_https}
        if not is_https:
            score += URL_WEIGHTS.get("https_missing", 25)
            reasons.append("HTTPS is not enabled")
            logger.info(f"FAIL: HTTPS | Score: {URL_WEIGHTS.get('https_missing', 25)}")

        # 17. Hostname Keyword Check
        hostname_lower = hostname.lower()
        found_hostname_keywords = list(set([kw for kw in HOSTNAME_KEYWORDS if kw in hostname_lower]))
        if found_hostname_keywords:
            kw_score = min(len(found_hostname_keywords) * URL_WEIGHTS.get("keyword_match", 25), 60)
            score += kw_score
            indicators["hostname_keywords"] = {"detected": True, "keywords": found_hostname_keywords}
            reasons.append(f"Suspicious keywords in hostname: {', '.join(found_hostname_keywords)}")
            logger.info(f"FAIL: Hostname Keywords | Score: {kw_score} | Evidence: {found_hostname_keywords}")
        else:
            indicators["hostname_keywords"] = {"detected": False}

        score = min(score, 100)

        # Classification
        classification = "Safe"
        if score >= 80: classification = "High Risk"
        elif score >= 60: classification = "Suspicious"
        elif score >= 30: classification = "Caution"

        # Refined Threat Category
        url_lower = url.lower()
        is_banking = any(kw in url_lower for kw in ["bank", "finance", "credit", "chase", "sbi", "hdfc", "paypal"])
        is_credential = any(kw in url_lower for kw in ["login", "signin", "verify", "account", "security", "auth", "reset"])

        threat_category = "General Threat"
        if indicators["url_shortener"]["detected"]:
            threat_category = "Shortened URL Abuse"
        elif indicators["ip_address"]["detected"]:
            threat_category = "Credential Harvesting"
        elif indicators["typosquatting"]["detected"] or indicators["homograph"]["detected"]:
            if is_banking:
                threat_category = "Banking Phishing"
            elif is_credential:
                threat_category = "Credential Phishing"
            else:
                threat_category = "Typosquatting"
        elif indicators["brand_impersonation"]["detected"]:
            if is_banking:
                threat_category = "Banking Phishing"
            else:
                threat_category = "Brand Impersonation"
        elif is_banking:
            threat_category = "Banking Phishing"
        elif is_credential:
            threat_category = "Credential Phishing"
        elif indicators["redirects"]["detected"]:
            threat_category = "Suspicious Redirect"

        return {
            "score": score,
            "classification": classification,
            "threat_category": threat_category,
            "reasons": reasons,
            "indicators": indicators,
            "details": {
                "protocol": parsed.scheme,
                "domain": domain,
                "subdomain": subdomain,
                "tld": tld,
                "path": path,
                "hostname": hostname,
                "port": parsed.port
            }
        }

    @staticmethod
    def analyze_email(content: str) -> Dict[str, Any]:
        # Extract features manually for headers
        lines = content.split('\n')
        sender = None
        reply_to = None
        subject = None

        for line in lines:
            line_lower = line.lower()
            if line_lower.startswith('from:'):
                sender = line[5:].strip()
            elif line_lower.startswith('reply-to:'):
                reply_to = line[9:].strip()
            elif line_lower.startswith('subject:'):
                subject = line[8:].strip()

        # Extract links
        links = extract_links(content)

        score = 0
        reasons = []
        indicators = {}

        # 1. Sender Analysis
        res = check_sender_spoofing(sender, reply_to)
        indicators["sender"] = res
        if res["detected"]:
            if res["type"] == "mismatch":
                score += EMAIL_WEIGHTS["reply_to_mismatch"]
            elif res["type"] == "impersonation":
                score += EMAIL_WEIGHTS["brand_impersonation"]
            elif res["type"] == "display_name_spoofing":
                score += EMAIL_WEIGHTS["suspicious_sender"]
            reasons.append(res["reason"])
            logger.info(f"FAIL: Sender | Evidence: {res.get('reason')}")

        # 2. Content Analysis
        res = check_email_content(subject, content)
        indicators["content"] = res

        if res["urgency_count"] > 0:
            score += min(res["urgency_count"] * 20, 60)
            reasons.append(f"Urgent language detected ({res['urgency_count']} instances)")
            logger.info(f"FAIL: Urgency | Evidence: {res.get('urgency_count')} words")

        if res["credential_request"]:
            score += EMAIL_WEIGHTS["credential_request"]
            reasons.append("Request for sensitive credentials detected")
            logger.info(f"FAIL: Credentials Request")

        if res["threat_detected"]:
            score += EMAIL_WEIGHTS["threat_language"]
            reasons.append("Threatening or coercive language detected")
            logger.info(f"FAIL: Threat Language")

        if res["reward_detected"]:
            score += EMAIL_WEIGHTS["reward_language"]
            reasons.append("Promises of rewards or unrealistic gains detected")
            logger.info(f"FAIL: Reward/Scam Language")

        if res["cap_percent"] > 30:
            score += EMAIL_WEIGHTS["excessive_caps"]
            reasons.append("Excessive use of capital letters")
            logger.info(f"FAIL: Caps | Evidence: {res.get('cap_percent')}%")

        if res["excessive_punctuation"]:
            score += EMAIL_WEIGHTS["excessive_punctuation"]
            reasons.append("Excessive punctuation detected")
            logger.info(f"FAIL: Punctuation")

        # 3. Link Analysis
        link_results = []
        max_link_score = 0
        for link in links:
            l_res = DetectionEngine.analyze_url(link)
            link_results.append({
                "url": link,
                "score": l_res["score"],
                "classification": l_res["classification"]
            })
            max_link_score = max(max_link_score, l_res["score"])

        indicators["links"] = {
            "count": len(links),
            "max_score": max_link_score,
            "results": link_results
        }

        if max_link_score >= 80:
            score += 80
            reasons.append(f"Critical risk link detected (Risk Score: {max_link_score})")
            logger.info(f"FAIL: Malicious Link | Score Contribution: 80")
        elif max_link_score >= 60:
            score += 50
            reasons.append(f"Highly suspicious link detected (Risk Score: {max_link_score})")
            logger.info(f"FAIL: Suspicious Link | Score Contribution: 50")
        elif len(links) > 5:
            score += 30
            reasons.append("Unusually high number of links in email")
            logger.info(f"FAIL: Link Count | Evidence: {len(links)}")

        score = min(score, 100)

        # Classification
        classification = "Safe"
        if score >= 80: classification = "High Risk"
        elif score >= 60: classification = "Suspicious"
        elif score >= 30: classification = "Caution"

        # Refined Threat Category
        content_lower = (content + (subject or "")).lower()

        threat_category = "General Threat"
        if res["reward_detected"]:
            threat_category = "Reward Scam"
            if "lottery" in content_lower:
                threat_category = "Lottery Scam"
        elif res["threat_detected"]:
            threat_category = "Extortion Scam"
        elif "invoice" in content_lower or "billing" in content_lower:
            threat_category = "Invoice Scam"
        elif "password" in content_lower and ("reset" in content_lower or "expire" in content_lower or "changed" in content_lower):
            threat_category = "Password Reset Scam"
        elif "crypto" in content_lower or "bitcoin" in content_lower or "wallet" in content_lower:
            threat_category = "Crypto Scam"
        elif indicators["sender"]["detected"] and indicators["sender"]["type"] == "impersonation":
            if any(kw in content_lower for kw in ["wire", "transfer", "payment", "urgent", "ceo", "president"]):
                threat_category = "Business Email Compromise"
            else:
                threat_category = "Brand Impersonation"
        elif any(kw in content_lower for kw in ["ceo", "president", "director", "executive"]) and any(kw in content_lower for kw in ["urgent", "immediately", "asap", "wire", "transfer"]):
            threat_category = "Business Email Compromise"
        elif res["credential_request"]:
            if "bank" in content_lower or "chase" in content_lower or "paypal" in content_lower:
                threat_category = "Banking Phishing"
            else:
                threat_category = "Credential Phishing"
        elif "bank" in content_lower or "chase" in content_lower or "paypal" in content_lower:
            threat_category = "Banking Phishing"

        return {
            "score": score,
            "classification": classification,
            "threat_category": threat_category,
            "reasons": reasons,
            "indicators": indicators,
            "features": {
                "sender": sender,
                "reply_to": reply_to,
                "subject": subject,
                "links": links,
                "email_length": len(content)
            }
        }
