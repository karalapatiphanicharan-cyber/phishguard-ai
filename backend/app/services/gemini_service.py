import os
import json
import logging
from typing import Optional, Dict, Any
from google import genai
from google.genai import types
from dotenv import load_dotenv
from ..models.schemas import AIAnalysis

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
MODEL_NAME = "gemini-2.0-flash"

class GeminiService:
    @staticmethod
    def _get_client():
        """Initializes and returns the GenAI client using the API key from environment."""
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key or api_key == "your_actual_api_key_here":
            logger.warning("GEMINI_API_KEY is not set or is using the placeholder value. AI features will be disabled.")
            return None
        try:
            return genai.Client(api_key=api_key)
        except Exception as e:
            logger.error(f"Failed to initialize Gemini client: {str(e)}")
            return None

    @classmethod
    async def analyze_url_threats(cls, url: str, heuristic_results: Dict[str, Any]) -> Optional[AIAnalysis]:
        """Analyzes a URL for potential threats using Gemini AI."""
        client = cls._get_client()
        if not client:
            return None

        logger.info(f"Model: {MODEL_NAME}")
        logger.info("URL analysis request started")

        prompt = f"""
        You are a Senior Cybersecurity Threat Analyst. Analyze the following URL and its heuristic scan results for phishing and malicious intent.

        URL: {url}
        Risk Score: {heuristic_results.get('risk_score')}/100
        Classification: {heuristic_results.get('classification')}
        Detected Issues: {', '.join(heuristic_results.get('detected_issues', []))}
        Security Checks: {json.dumps(heuristic_results.get('security_checks', {}))}

        Provide a detailed explanation and cybersecurity insights in JSON format.

        Rules:
        - Think like a cybersecurity analyst.
        - Avoid speculation; use only provided evidence.
        - Never classify with 100% certainty if evidence is weak.
        - Return ONLY a valid JSON object.

        Expected JSON structure:
        {{
            "summary": "Short professional summary of the threat.",
            "threat_type": "e.g., Credential Phishing, Malware Distribution, Safe, etc.",
            "confidence": "Low, Medium, or High",
            "attack_goal": "What the attacker is likely trying to achieve.",
            "explanation": ["Point 1", "Point 2", ...],
            "recommendations": ["Action 1", "Action 2", ...]
        }}
        """

        try:
            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                )
            )

            logger.info("Gemini response received successfully")
            data = json.loads(response.text)
            return AIAnalysis(**data)
        except Exception as e:
            logger.error(f"Gemini API error during URL analysis: {str(e)}")
            # Log additional error details if available
            if hasattr(e, 'response') and e.response:
                logger.error(f"Gemini error response body: {e.response}")
            return None

    @classmethod
    async def analyze_email_threats(cls, content: str, heuristic_results: Dict[str, Any]) -> Optional[AIAnalysis]:
        """Analyzes email content for potential threats using Gemini AI."""
        client = cls._get_client()
        if not client:
            return None

        logger.info(f"Model: {MODEL_NAME}")
        logger.info("Email analysis request started")

        prompt = f"""
        You are a Senior Cybersecurity Threat Analyst. Analyze the following email content and its heuristic scan results for phishing, social engineering, and malicious intent.

        Email Content:
        \"\"\"{content}\"\"\"

        Heuristic Findings:
        - Detected Keywords: {', '.join(heuristic_results.get('detected_keywords', []))}
        - Urgency Level: {heuristic_results.get('urgency_level')}
        - Suspicious Links Count: {heuristic_results.get('suspicious_links_count')}
        - Sensitive Data Requests: {heuristic_results.get('has_sensitive_requests')}

        Provide a detailed explanation and cybersecurity insights in JSON format.

        Rules:
        - Think like a cybersecurity analyst.
        - Detect social engineering tactics (urgency, authority, fear, scarcity).
        - Return ONLY a valid JSON object.

        Expected JSON structure:
        {{
            "summary": "Short professional summary of the threat.",
            "threat_type": "e.g., Business Email Compromise (BEC), Phishing, Spam, Safe, etc.",
            "confidence": "Low, Medium, or High",
            "attack_goal": "What the attacker is likely trying to achieve.",
            "explanation": ["Point 1", "Point 2", ...],
            "recommendations": ["Action 1", "Action 2", ...]
        }}
        """

        try:
            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                )
            )

            logger.info("Gemini response received successfully")
            data = json.loads(response.text)
            return AIAnalysis(**data)
        except Exception as e:
            logger.error(f"Gemini API error during email analysis: {str(e)}")
            # Log additional error details if available
            if hasattr(e, 'response') and e.response:
                logger.error(f"Gemini error response body: {e.response}")
            return None
