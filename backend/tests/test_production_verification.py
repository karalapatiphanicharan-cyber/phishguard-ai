import unittest
import json
from app.analyzers.detection_engine import DetectionEngine

class TestProductionDetection(unittest.TestCase):
    def setUp(self):
        self.engine = DetectionEngine()

    def test_url_https_check(self):
        res_http = self.engine.analyze_url("http://example.com")
        self.assertTrue(res_http["indicators"]["https"]["detected"])
        self.assertIn("HTTPS is not enabled", res_http["reasons"])

        res_https = self.engine.analyze_url("https://example.com")
        self.assertFalse(res_https["indicators"]["https"]["detected"])

    def test_url_suspicious_tld(self):
        res = self.engine.analyze_url("https://test.tk")
        self.assertTrue(res["indicators"]["suspicious_tld"]["detected"])
        self.assertEqual(res["indicators"]["suspicious_tld"]["tld"], "tk")

    def test_url_brand_impersonation(self):
        res = self.engine.analyze_url("https://google-security-update.com")
        self.assertTrue(res["indicators"]["brand_impersonation"]["detected"])
        self.assertIn("google", res["indicators"]["brand_impersonation"]["brands"])

    def test_url_typosquatting(self):
        res = self.engine.analyze_url("https://paypa1.com")
        self.assertTrue(res["indicators"]["typosquatting"]["detected"])
        self.assertEqual(res["indicators"]["typosquatting"]["brand"], "paypal")

    def test_url_homograph(self):
        # 'pаypal' with cyrillic 'а'
        res = self.engine.analyze_url("https://pаypal.com")
        self.assertTrue(res["indicators"]["homograph"]["detected"])

    def test_url_shortener(self):
        res = self.engine.analyze_url("https://bit.ly/3xYz1")
        self.assertTrue(res["indicators"]["url_shortener"]["detected"])

    def test_url_ip_address(self):
        # Standard IP
        res1 = self.engine.analyze_url("http://1.1.1.1")
        self.assertTrue(res1["indicators"]["ip_address"]["detected"])
        # Hex IP
        res2 = self.engine.analyze_url("http://0x7f.0x0.0x0.0x1")
        self.assertTrue(res2["indicators"]["ip_address"]["detected"])
        self.assertEqual(res2["indicators"]["ip_address"]["type"], "Hexadecimal IP")

    def test_url_entropy(self):
        res = self.engine.analyze_url("https://a1b2c3d4e5f6g7h8i9j0.com")
        self.assertTrue(res["indicators"]["entropy"]["detected"])

    def test_url_length(self):
        long_url = "https://example.com/" + "a" * 100
        res = self.engine.analyze_url(long_url)
        self.assertTrue(res["indicators"]["long_url"]["detected"])

    def test_url_subdomain_depth(self):
        res = self.engine.analyze_url("https://a.b.c.d.example.com")
        self.assertTrue(res["indicators"]["subdomain_depth"]["detected"])
        self.assertGreaterEqual(res["indicators"]["subdomain_depth"]["depth"], 3)

    def test_url_params_and_encoding(self):
        res = self.engine.analyze_url("https://example.com/login?token=%20%20%20%20%20%20")
        self.assertTrue(res["indicators"]["suspicious_params"]["detected"])
        self.assertTrue(res["indicators"]["encoding"]["detected"])

    def test_url_redirect(self):
        res = self.engine.analyze_url("https://example.com?url=http://malicious.com")
        self.assertTrue(res["indicators"]["redirects"]["detected"])

    def test_url_port(self):
        res = self.engine.analyze_url("https://example.com:8080")
        self.assertTrue(res["indicators"]["port"]["detected"])

    # EMAIL TESTS
    def test_email_safe(self):
        content = "From: jules@example.com\nSubject: Meeting\nHi, are we meeting at 2pm?"
        res = self.engine.analyze_email(content)
        self.assertEqual(res["classification"], "Safe")

    def test_email_banking_phishing(self):
        content = "From: Chase Support <support@chase-online-secure.com>\nSubject: Urgent Security Alert\nYour account has been locked. Login to verify: http://chase-login.tk"
        res = self.engine.analyze_email(content)
        self.assertEqual(res["threat_category"], "Banking Phishing")
        self.assertGreaterEqual(res["score"], 80)

    def test_email_bec(self):
        content = "From: CEO <ceo@gmail.com>\nSubject: URGENT WIRE TRANSFER\nI need you to process a wire transfer immediately. This is confidential."
        res = self.engine.analyze_email(content)
        self.assertEqual(res["threat_category"], "Business Email Compromise")

    def test_email_invoice_scam(self):
        content = "Subject: Invoice #88271 Pending\nPlease pay the attached invoice immediately to avoid service interruption."
        res = self.engine.analyze_email(content)
        self.assertEqual(res["threat_category"], "Invoice Scam")

    def test_email_lottery_scam(self):
        content = "Subject: YOU WON THE LOTTERY!!!\nClaim your prize of $1,000,000 now by clicking here."
        res = self.engine.analyze_email(content)
        self.assertEqual(res["threat_category"], "Lottery Scam")

    def test_email_crypto_scam(self):
        content = "Subject: Bitcoin Giveaway\nSend 0.1 BTC to this wallet to receive 1.0 BTC back!"
        res = self.engine.analyze_email(content)
        self.assertEqual(res["threat_category"], "Crypto Scam")

    def test_email_sender_spoofing(self):
        # Reply-to mismatch
        content = "From: support@amazon.com\nReply-To: hacker@attacker.com\nSubject: Issue"
        res = self.engine.analyze_email(content)
        self.assertTrue(res["indicators"]["sender"]["detected"])
        self.assertEqual(res["indicators"]["sender"]["type"], "mismatch")

if __name__ == "__main__":
    unittest.main()
