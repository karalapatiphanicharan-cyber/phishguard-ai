# Test Cases: PhishGuard Enterprise

This document provides a set of sample inputs for verifying the PhishGuard Enterprise detection engine.

## URL Analysis Test Cases

| Input URL | Expected Risk | Expected Indicators | Category |
| :--- | :--- | :--- | :--- |
| `https://google.com` | Safe (0) | None | General Threat |
| `https://github.com` | Safe (0) | None | General Threat |
| `http://paypal-login.xyz` | High Risk (100) | TLD, Brand, Keywords, No HTTPS | Banking Phishing |
| `https://paypa1-login.com` | Suspicious (75) | Typosquatting, Keywords | Credential Phishing |
| `https://amazon-security.xyz` | High Risk (100) | TLD, Brand, Keywords | Brand Impersonation |
| `https://192.168.1.1` | High Risk (80+) | IP Address, Keywords | Credential Harvesting |
| `https://bit.ly/secure-link` | High Risk (80) | URL Shortener | Shortened URL Abuse |

## Email Analysis Test Cases

### 1. Safe Email
**Input:**
```text
From: support@github.com
Subject: New login to your account

Hi, we noticed a new login from a new device. If this was you, ignore this email.
```
**Expected Results:**
- Risk: Safe / Caution
- Category: General Threat

### 2. Banking Phishing
**Input:**
```text
From: alerts@chase-secure-update.com
Subject: URGENT: Account Suspension

Your account has been flagged for suspicious activity. Verify your identity immediately or your account will be locked forever.
http://chase-verification-portal.net/login
```
**Expected Results:**
- Risk: High Risk (100)
- Category: Banking Phishing
- Indicators: Urgent Tone, Credential Request, Malicious Link

### 3. Business Email Compromise (BEC)
**Input:**
```text
From: ceo@company-official.com
Subject: Wire Transfer Request

I am in a meeting and need a wire transfer processed immediately for a new vendor. Please handle this ASAP.
```
**Expected Results:**
- Risk: High Risk
- Category: Business Email Compromise
- Indicators: Urgent Tone, Authority, Financial Language

### 4. Invoice Scam
**Input:**
```text
From: billing@quickbooks-invoice.top
Subject: Overdue Invoice #99281

Your invoice for $4,500 is now 3 days overdue. Please pay immediately using the link below to avoid legal action.
```
**Expected Results:**
- Risk: High Risk
- Category: Invoice Scam
- Indicators: Financial Language, Urgent Tone, TLD
