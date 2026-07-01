import random
from ..config.recommendations import (
    URL_SAFE_RECOMMENDATIONS, URL_RISK_RECOMMENDATIONS,
    EMAIL_SAFE_RECOMMENDATIONS, EMAIL_RISK_RECOMMENDATIONS
)

class SummaryGenerator:
    @staticmethod
    def generate_url_summary(result: dict) -> str:
        score = result["score"]
        classification = result["classification"].lower()
        threat_category = result["threat_category"]
        reasons = result["reasons"]

        if score < 30:
            return "Heuristic analysis indicates this URL is likely safe. No significant phishing indicators or malicious patterns were detected during the structural scan."

        summary_templates = [
            f"This URL has been classified as {classification} due to clear indicators of {threat_category}.",
            f"Multiple security risk factors were identified, suggesting a highly probable {threat_category} attempt.",
            f"Automated heuristic detection has flagged this URL as {classification}. It exhibits behavioral patterns consistent with {threat_category}."
        ]

        summary = random.choice(summary_templates)
        if reasons:
            summary += f" Critical observations include {reasons[0]}"
            if len(reasons) > 1:
                summary += f" and {reasons[1]}."
            else:
                summary += "."

        return summary

    @staticmethod
    def generate_email_summary(result: dict) -> str:
        score = result["score"]
        classification = result["classification"].lower()
        threat_category = result["threat_category"]
        reasons = result["reasons"]

        if score < 30:
            return "This email appears to be legitimate based on behavioral content analysis and sender verification checks."

        summary = f"This communication is classified as {classification} and matches known signatures for {threat_category}."
        if reasons:
            summary += f" Primary detection factors: {reasons[0]}."

        summary += " The structural and linguistic patterns observed strongly suggest a sophisticated social engineering attempt."
        return summary

class RecommendationGenerator:
    @staticmethod
    def get_url_recommendations(result: dict) -> list:
        score = result["score"]
        indicators = result["indicators"]

        if score < 30:
            return URL_SAFE_RECOMMENDATIONS

        recs = list(URL_RISK_RECOMMENDATIONS)

        # Add context-specific recommendations
        if indicators.get("url_shortener", {}).get("detected"):
            recs.append("Use a URL expansion service to inspect the destination before clicking.")

        if indicators.get("ip_address", {}).get("detected"):
            recs.append("Raw IP addresses are a high-risk indicator; legitimate services use domain names.")

        if indicators.get("homograph", {}).get("detected"):
            recs.append("This domain uses look-alike characters (homographs) to impersonate a legitimate site.")

        return recs

    @staticmethod
    def get_email_recommendations(result: dict) -> list:
        score = result["score"]
        indicators = result["indicators"]

        if score < 30:
            return EMAIL_SAFE_RECOMMENDATIONS

        recs = list(EMAIL_RISK_RECOMMENDATIONS)

        if indicators.get("sender", {}).get("detected"):
            recs.append("The sender's display name or email address shows signs of impersonation.")

        if indicators.get("links", {}).get("max_score", 0) >= 80:
            recs.append("At least one link in this email points to a high-risk phishing destination.")

        return recs
