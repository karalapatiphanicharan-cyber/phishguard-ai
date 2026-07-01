# Project Structure: PhishGuard Enterprise

This document provides a comprehensive overview of the PhishGuard Enterprise directory structure and the purpose of key files.

## Root Directory
- `package.json`: Frontend dependencies and scripts.
- `tailwind.config.js`: Custom theme configuration (Colors, Animations, Fonts).
- `tsconfig.json`: TypeScript compiler configuration.
- `vite.config.ts`: Vite build tool configuration.
- `index.html`: Main entry point and metadata.
- `public/`: Static assets (Logo, Favicon, Manifest).

## Frontend (`src/`)
- `main.tsx`: React application bootstrap.
- `App.tsx`: Root component and routing logic.
- `types/`: Global TypeScript interfaces for API responses and UI state.

### `src/components/`
- `ThreatDashboard.tsx`: Main results visualization engine.
- `RiskGauge.tsx`: Animated SVG gauge for risk scores.
- `ConfidenceBar.tsx`: Visual indicator for analysis certainty.
- `Timeline.tsx`: Vertical animation of the security processing chain.
- `GlassCard.tsx`: Reusable glassmorphic UI container.
- `LoadingScreen.tsx`: Security engine initialization simulator.

### `src/layout/`
- `Navbar.tsx`: Global navigation with active state tracking.
- `Footer.tsx`: Enterprise footer with legal and social links.
- `BackgroundEffects.tsx`: Dynamic particle and glow system.

### `src/pages/`
- `Home.tsx`: Hero section and platform overview.
- `UrlScanner.tsx`: URL analysis interface.
- `EmailScanner.tsx`: Email content analysis interface.
- `Dashboard.tsx`: Threat Intelligence Center (History & Stats).

## Backend (`backend/`)
- `app/main.py`: FastAPI entry point.
- `requirements.txt`: Backend Python dependencies.

### `backend/app/analyzers/`
- `detection_engine.py`: The heart of the platform. Orchestrates all detectors.
- `url_checks/`: Modular detectors for URL-specific indicators (TLD, IP, Entropy, etc.).
- `email_checks/`: Modular detectors for Email-specific indicators (Sender, Content, Links).

### `backend/app/config/`
- `weights.py`: Scoring weights for every heuristic indicator.
- `brands.py`: Database of monitored enterprise brands.
- `keywords.py`: Dictionary of social engineering and suspicious keywords.
- `patterns.py`: Regex and list patterns for detection (Shorteners, Ports).

### `backend/app/services/`
- `url_service.py`: High-level URL analysis orchestration.
- `email_service.py`: High-level Email analysis orchestration.
- `report_generator.py`: Local logic for generating summaries and recommendations.

## Testing (`tests/` & `backend/tests/`)
- `tests/*.spec.ts`: Playwright E2E test suite.
- `backend/tests/`: Pytest unit tests for the detection engine.
