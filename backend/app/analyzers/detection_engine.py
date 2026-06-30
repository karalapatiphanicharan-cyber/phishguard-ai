from typing import Dict, Any, List
from urllib.parse import urlparse
import tldextract

from .url_checks.typosquatting import check_typosquatting
from .url_checks.homograph import check_homograph
from .url_checks.entropy import check_high_entropy
from .url_checks.brand import check_brand_impersonation
from .url_checks.technical_checks import (
    check_ip_address, check_non_standard_port, check_subdomain_depth,
    check_suspicious_path, check_suspicious_params, check_encoding,
    check_redirect_indicators
)
from .email_checks.sender import check_sender_spoofing
from .email_checks.content_analysis import check_email_content
from .email_checks.links import extract_links

from ..config.weights import URL_WEIGHTS, EMAIL_WEIGHTS
from ..config.suspicious_tlds import SUSPICIOUS_TLDS
from ..utils import url_utils

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

        # 2. Homograph
        res = check_homograph(hostname)
        indicators["homograph"] = res
        if res["detected"]:
            score += URL_WEIGHTS["homograph"]
            reasons.append(res["reason"])

        # 3. Entropy
        res = check_high_entropy(hostname)
        indicators["entropy"] = res
        if res["detected"]:
            score += URL_WEIGHTS["high_entropy"]
            reasons.append(res["reason"])

        # 4. Brand Impersonation
        res = check_brand_impersonation(url, domain)
        indicators["brand_impersonation"] = res
        if res["detected"]:
            score += URL_WEIGHTS["brand_impersonation"]
            reasons.append(res["reason"])

        # 5. Technical Checks
        # IP Address
        res = check_ip_address(hostname)
        indicators["ip_address"] = res
        if res["detected"]:
            score += URL_WEIGHTS["ip_address"]
            reasons.append(res["reason"])

        # Non-standard Port
        res = check_non_standard_port(parsed.port)
        indicators["port"] = res
        if res["detected"]:
            score += URL_WEIGHTS["non_standard_port"]
            reasons.append(res["reason"])

        # Subdomain Depth
        res = check_subdomain_depth(subdomain)
        indicators["subdomain_depth"] = res
        if res["detected"]:
            score += URL_WEIGHTS["excessive_subdomains"]
            reasons.append(res["reason"])

        # Suspicious Path
        res = check_suspicious_path(path)
        indicators["suspicious_path"] = res
        if res["detected"]:
            score += URL_WEIGHTS["suspicious_path"]
            reasons.append(res["reason"])

        # Suspicious Params
        res = check_suspicious_params(query)
        indicators["suspicious_params"] = res
        if res["detected"]:
            score += URL_WEIGHTS["suspicious_params"]
            reasons.append(res["reason"])

        # Encoding
        res = check_encoding(url)
        indicators["encoding"] = res
        if res["detected"]:
            score += URL_WEIGHTS["encoded_chars"]
            reasons.append(res["reason"])

        # Redirects
        res = check_redirect_indicators(url)
        indicators["redirects"] = res
        if res["detected"]:
            score += URL_WEIGHTS["multiple_redirects"]
            reasons.append(res["reason"])

        # TLD
        if tld in SUSPICIOUS_TLDS:
            score += SUSPICIOUS_TLDS[tld]
            indicators["suspicious_tld"] = {"detected": True, "tld": tld}
            reasons.append(f"Domain uses a suspicious TLD: .{tld}")
        else:
            indicators["suspicious_tld"] = {"detected": False}

        # URL Shortener
        if url_utils.is_url_shortener(domain, tld):
            score += URL_WEIGHTS["url_shortener"]
            indicators["url_shortener"] = {"detected": True}
            reasons.append("URL uses a known shortener service")
        else:
            indicators["url_shortener"] = {"detected": False}

        # Long URL
        if len(url) > 75:
            score += URL_WEIGHTS["long_url"]
            indicators["long_url"] = {"detected": True, "length": len(url)}
            reasons.append("URL is unusually long")
        else:
            indicators["long_url"] = {"detected": False}

        # HTTPS
        is_https = parsed.scheme == "https"
        indicators["https"] = {"detected": not is_https}
        if not is_https:
            score += 20 # Fixed weight for HTTPS
            reasons.append("HTTPS is not enabled")

        score = min(score, 100)

        classification = "Safe"
        if score > 80: classification = "Potential Phishing"
        elif score > 60: classification = "High Risk"
        elif score > 30: classification = "Suspicious"

        return {
            "score": score,
            "classification": classification,
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

        # 2. Content Analysis
        res = check_email_content(subject, content)
        indicators["content"] = res

        if res["urgency_count"] > 0:
            score += EMAIL_WEIGHTS["urgent_language"]
            reasons.append(f"Urgent language detected ({res['urgency_count']} instances)")

        if res["credential_request"]:
            score += EMAIL_WEIGHTS["credential_request"]
            reasons.append("Request for sensitive credentials detected")

        if res["threat_detected"]:
            score += EMAIL_WEIGHTS["threat_language"]
            reasons.append("Threatening or coercive language detected")

        if res["reward_detected"]:
            score += EMAIL_WEIGHTS["reward_language"]
            reasons.append("Promises of rewards or unrealistic gains detected")

        if res["cap_percent"] > 30:
            score += EMAIL_WEIGHTS["excessive_caps"]
            reasons.append("Excessive use of capital letters")

        if res["excessive_punctuation"]:
            score += EMAIL_WEIGHTS["excessive_punctuation"]
            reasons.append("Excessive punctuation detected")

        # 3. Link Analysis (Integrated)
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

        if max_link_score > 60:
            score += EMAIL_WEIGHTS["suspicious_link"]
            reasons.append(f"Highly suspicious link detected (Risk Score: {max_link_score})")
        elif len(links) > 5:
            score += 10 # Extra penalty for many links
            reasons.append("Unusually high number of links in email")

        score = min(score, 100)

        classification = "Safe"
        if score > 80: classification = "Potential Phishing"
        elif score > 60: classification = "High Risk"
        elif score > 30: classification = "Suspicious"

        return {
            "score": score,
            "classification": classification,
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
