import unittest
from app.analyzers.detection_engine import DetectionEngine

class TestDetectionEngine(unittest.TestCase):
    def test_safe_url(self):
        url = "https://www.google.com"
        result = DetectionEngine.analyze_url(url)
        self.assertEqual(result["classification"], "Safe")
        self.assertLess(result["score"], 30)

    def test_typosquatting_url(self):
        url = "https://paypa1.com"
        result = DetectionEngine.analyze_url(url)
        self.assertIn(result["classification"], ["High Risk", "Suspicious", "Caution"])
        self.assertTrue(result["indicators"]["typosquatting"]["detected"])

    def test_homograph_url(self):
        # Using a unicode 'а' (Cyrillic) instead of 'a'
        url = "https://pаypal.com"
        result = DetectionEngine.analyze_url(url)
        self.assertTrue(result["indicators"]["homograph"]["detected"])

    def test_ip_address_url(self):
        url = "http://192.168.1.1/login"
        result = DetectionEngine.analyze_url(url)
        self.assertTrue(result["indicators"]["ip_address"]["detected"])
        self.assertEqual(result["threat_category"], "Credential Harvesting")

    def test_obfuscated_ip_hex(self):
        url = "http://0x7f.0x0.0x0.0x1"
        result = DetectionEngine.analyze_url(url)
        self.assertTrue(result["indicators"]["ip_address"]["detected"])
        self.assertEqual(result["indicators"]["ip_address"]["type"], "Hexadecimal IP")

    def test_suspicious_tld(self):
        url = "https://secure-login.tk"
        result = DetectionEngine.analyze_url(url)
        self.assertTrue(result["indicators"]["suspicious_tld"]["detected"])

    def test_url_shortener(self):
        url = "https://bit.ly/secure"
        result = DetectionEngine.analyze_url(url)
        self.assertTrue(result["indicators"]["url_shortener"]["detected"])
        self.assertEqual(result["threat_category"], "Shortened URL Abuse")

    def test_banking_phishing_email(self):
        content = """From: Security <alerts@chase-bank-verify.com>
Subject: Urgent: Suspicious Activity Detected
Please login to your account immediately to verify your identity.
Failure to act will result in account suspension.
Go to http://chase-update.com/login"""
        result = DetectionEngine.analyze_email(content)
        self.assertEqual(result["classification"], "High Risk")
        self.assertEqual(result["threat_category"], "Banking Phishing")
        self.assertTrue(result["indicators"]["content"]["urgency_count"] > 0)

    def test_invoice_scam_email(self):
        content = """From: Billing <invoice@legit-company.com>
Subject: Outstanding Invoice #12345
Please find attached invoice for your recent purchase.
Payment is due immediately."""
        result = DetectionEngine.analyze_email(content)
        self.assertEqual(result["threat_category"], "Invoice Scam")

if __name__ == "__main__":
    unittest.main()
