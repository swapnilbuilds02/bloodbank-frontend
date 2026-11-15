# Blood Bank & Donor Management System — Frontend

A clinical-grade, modern Single Page Application (SPA) for blood bank operations, donor management, laboratory testing, stock inventory (FEFO), emergency requests, and blood issue transfusion processing.

Built with **pure Vanilla JavaScript (ES2022+ modules)**, modern CSS design tokens, responsive layout, and zero third-party framework dependencies.

---

## 🌟 Key Features

### 1. Executive Healthcare Dashboard
- **Real-Time KPIs**: Total active donors, donations, total vs usable inventory units, pending hospital requests, critical demand alerts, and total transfusion issues.
- **Visual Stock by Blood Group**: 8 ABO/Rh blood group cards with real-time level indicators and direct routing to inventory filtered by blood group.
- **Needs Attention Triage**: Automated warnings for depleted stock, critical low thresholds, and held expired units.
- **Analytics Visualizations**: Donation intake trends and hospital request status distributions via vendored Chart.js.
- **Recent Transfusion Logs**: Live data tables of recent blood donations and incoming patient requests.

### 2. Donor & Donation Intake Management
- Complete donor registration and lifecycle tracking.
- Pre-donation eligibility assessment (age >= 18, weight >= 50kg, minimum interval tracking).
- Collection volume logging (ml) with automatic status workflows (Accepted, Pending, Deferred).

### 3. Laboratory Testing & Safety Verification
- Mandatory serology screening tracking: HIV, Hepatitis B (HBsAg), Hepatitis C (HCV), and Malaria test records.
- Automated safety rule determination: units marked `Safe` only when all negative, otherwise `Unsafe`.
- Direct safety handover to inventory qualification.

### 4. Blood Stock & Inventory Management (FEFO)
- Real-time stock status monitoring with automated expiry calculation (valid, expiring soon, expired).
- First-Expiring-First-Out (FEFO) sorting to minimize wastage and optimize clinical shelf life.
- Component-type classification (Whole Blood, Packed Red Blood Cells, Platelets, Fresh Frozen Plasma).

### 5. Hospital Blood Requests
- Emergency and routine blood demand intake from networked hospitals.
- Triage urgency tiers: `Low`, `Normal`, `High`, and `Critical` (with visual pulse indicator).
- Request status lifecycle: `Pending` → `Approved` / `Rejected` / `Cancelled` → `Fulfilled`.

### 6. 3-Step Guided Blood Issue Wizard
- **Step 1 — Request Selection**: Identifies open patient requests awaiting fulfillment.
- **Step 2 — FEFO Stock Allocation**: Strictly screens inventory for safe, unexpired, and matching ABO/Rh units.
- **Step 3 — Authorization & Dispensation**: Validates available units, authorizes staff ID, and issues immediate printable transfusion receipts.
- **Printable Transfusion Slips**: Clean receipt layout with dual signatures for clinical compliance.

### 7. Master Data Directories & Settings
- Comprehensive directory management for Regional Blood Banks, Partner Hospitals, Registered Patients, and Clinical Staff.
- Settings panel with backend API base URL configuration, connectivity testing, and light/dark theme switching.

---

## 🏗 Architecture & Design System

- **Vanilla JavaScript Modular Architecture**: Native ES Modules (`import`/`export`), custom reactive hash-based router (`#/donors`, `#/inventory`, etc.), centralized state store, and REST API service abstraction.
- **Strict Security & XSS Prevention**: 100% DOM API-based rendering using custom `h()` hyperscript element builders (`document.createElement`, `replaceChildren`, `textContent`). **Zero usage of `innerHTML`, `outerHTML`, `eval()`, or unescaped HTML injections.**
- **Enterprise Design Tokens**: Accessible clinical palette (Deep Navy `#0c1427`, Crimson `#b91c1c`, Emerald `#15803d`, Amber `#b45309`), WCAG AAA / AA contrast compliance, responsive sidebar, glassmorphic header, and dark mode support.
- **Vendored Offline Assets**: SVG icon sprite system and single vendored Chart.js distribution. Completely functional offline without external CDNs.

---

## 📁 Repository Structure

```
├── blood-bank-frontend/            # Primary frontend application folder
│   ├── index.html                  # Application entry point with strict CSP
│   ├── README.md                   # Frontend specific guide
│   ├── assets/
│   │   ├── css/
│   │   │   ├── tokens.css          # Design system variables, light/dark themes
│   │   │   ├── base.css            # Typography, CSS reset, accessibility utilities
│   │   │   ├── layout.css          # Sidebar, topbar, responsive app shell
│   │   │   ├── components.css      # Buttons, cards, tables, forms, modals, toasts
│   │   │   ├── pages.css           # Page-specific views (dashboard, stepper, slip)
│   │   │   └── print.css           # Clean print-only stylesheet for issue slips
│   │   ├── icons/
│   │   │   └── sprite.svg          # Local SVG icon sprite
│   │   └── vendor/
│   │       └── chart.umd.min.js    # Vendored Chart.js library
│   └── js/
│       ├── main.js                 # App initialization, routing & theme setup
│       ├── config.js               # Enums, API defaults, navigation structure
│       ├── core/                   # Framework utilities (router, api, dom, store)
│       ├── services/               # REST API service endpoints (CRUD factory)
│       ├── ui/                     # UI components (table, modal, drawer, toast, badge)
│       └── pages/                  # Page route controllers
└── .gitignore                      # Git ignore file
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.8+ (for serving local static files)
- Blood Bank REST API backend (Flask + MySQL) running on `http://127.0.0.1:5000`

### Running the Application

1. Open PowerShell / Terminal in this repository:
   ```bash
   cd "blood-bank-frontend"
   ```

2. Start the local server:
   ```bash
   python -m http.server 5500
   ```

3. Launch your browser and navigate to:
   ```
   http://localhost:5500
   ```

4. Verify API Connection:
   The app connects by default to `http://127.0.0.1:5000/api`. You can test or update the backend URL under **Settings** (`#/settings`).

---

## 🔒 Security & Standards Compliance

- **Content Security Policy (CSP)**: Configured in `index.html` allowing only self-hosted scripts, styles, and verified local API connections.
- **Zero Framework Footprint**: Zero node modules, zero build step required, runs directly in any modern browser.
- **Accessible WCAG AA/AAA**: Contrast-verified color palette, semantic HTML elements, accessible keyboard navigation, and screen reader skip links.
