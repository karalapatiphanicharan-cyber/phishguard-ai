# PhishGuard Enterprise

PhishGuard Enterprise is a professional-grade, 100% offline Threat Intelligence Platform designed to detect and analyze sophisticated phishing attempts. By leveraging a high-performance modular detection engine and intelligent heuristics, it provides real-time analysis of URLs and emails without any external AI dependencies.

## 🚀 Key Features

-   **Intelligent URL Analyzer**: Detects typosquatting, homograph attacks, IP obfuscation, suspicious TLDs, and deep path redirection.
-   **Email Threat Engine**: Analyzes sender veracity, social engineering tone (urgency, fear, reward), and extracts/scans embedded links.
-   **Enterprise Threat Dashboard**: Visualizes risk scores, threat classifications, and technical indicators with professional-grade gauges and timelines.
-   **Modular Detection Engine**: 14+ independent detectors contribute to a weighted risk model for maximum precision.
-   **Local Report Generation**: Automatically generates professional threat summaries and actionable security recommendations.
-   **Threat Intelligence Center**: Local history tracking and statistical analysis of previous threats.
-   **100% Offline & Private**: Zero external API calls. All analysis is performed locally on the server.

## 🛠 Technology Stack

-   **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide React, Recharts.
-   **Backend**: FastAPI, Pydantic, Python 3.12.
-   **Security Libraries**: `tldextract`, `python-Levenshtein`, `python-whois`, `validators`.
-   **Testing**: Playwright (E2E), Pytest (Backend).

## 🏗 Architecture

PhishGuard Enterprise follows a clean, modular architecture:

1.  **Detection Layer**: Modular detectors in `backend/app/analyzers/` each handle one specific threat indicator.
2.  **Service Layer**: Orchestrates detectors and generates structured reports using local templates.
3.  **API Layer**: FastAPI endpoints for URL and Email analysis.
4.  **Frontend Layer**: A premium, responsive UI that consumes the local Threat Intelligence API.

## 📁 Folder Structure

-   `src/`: React frontend source code.
    -   `components/`: Reusable UI components (Dashboard, Gauges, Cards).
    -   `pages/`: Application views (Home, Scanners, Dashboard).
    -   `layout/`: Global layout components (Navbar, Footer, Background).
-   `backend/`: FastAPI backend source code.
    -   `app/analyzers/`: The core Heuristic Detection Engine.
    -   `app/config/`: Configuration for weights, brands, and keywords.
    -   `app/services/`: Business logic for report generation.
-   `tests/`: Playwright E2E tests and backend Pytest suite.

## 🚦 Installation & Usage

### Prerequisites
- Node.js 18+
- Python 3.12+

### Running the Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Running the Frontend
```bash
npm install
npm run dev
```

## 🛡 Detection Engine Overview

The engine uses a weighted risk model (0-100):
-   **0-30**: Safe
-   **31-60**: Caution
-   **61-80**: Suspicious
-   **81-100**: High Risk / Critical

Supported Threat Categories include:
-   Credential Phishing
-   Banking Phishing
-   Business Email Compromise (BEC)
-   Typosquatting & Brand Impersonation
-   Social Engineering (Invoice/Lottery/Crypto Scams)

## 📄 License

Proprietary Enterprise Edition. All Rights Reserved.
