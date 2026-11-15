# Blood Bank & Donor Management System — Frontend

A single-page web application (SPA) for managing blood bank operations: donor registration, donation tracking, blood testing, inventory tracking with expiration monitoring, hospital blood requests, and emergency issuing workflows. Built as a college DBMS course project frontend.

## Tech Stack
- **Architecture**: Vanilla HTML5, CSS3, Modern JavaScript (ES2022 modules)
- **Frameworks**: None (No React, Vue, Angular, or TypeScript)
- **Build Step**: Zero build tools required (no Webpack, Vite, or npm scripts needed)
- **Third-Party Libraries**: Chart.js v4 (vendored locally in `assets/vendor/chart.umd.min.js`)
- **Offline Capable**: Zero CDN links, system font stack, local inline SVG sprite
- **Routing**: Single-page application with hash-based router (`#/dashboard`, `#/donors`, etc.)

## Prerequisites
- Python 3.x (to serve the static files)
- Blood Bank backend running on `http://127.0.0.1:5000` (Flask + MySQL)

## Quick Start (Windows PowerShell)

### 1. Start Backend
```powershell
cd blood-bank-backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
# Ensure database credentials in .env are configured
python app.py
# Backend runs on http://127.0.0.1:5000
```

### 2. Start Frontend
```powershell
cd blood-bank-frontend
python -m http.server 5500
# Open http://localhost:5500 in your browser
```

## Directory Structure
```
blood-bank-frontend/
  index.html                    # SPA entry point
  README.md                     # Documentation
  assets/
    css/                        # Token-driven stylesheets
      tokens.css                # Color palette, spacing, typography, z-index
      base.css                  # CSS reset, typography, accessibility helpers
      layout.css                # Sidebar, topbar, responsive containers
      components.css            # Buttons, forms, cards, badges, modal, tables
      pages.css                 # Specific page styling
      print.css                 # Issue slip print stylesheet
    icons/sprite.svg            # 33 line icon SVG sprite
    vendor/chart.umd.min.js     # Vendored Chart.js v4
  js/
    main.js                     # Application entry point
    config.js                   # Application configuration, enums, constants
    core/                       # Core infrastructure
      api.js                    # Fetch wrapper with envelope & error handling
      router.js                 # Hash SPA router
      store.js                  # LocalStorage settings store
      dom.js                    # DOM builder and escape utilities
      format.js                 # Dates, numbers, ml, relative time formatters
      validate.js               # Validation logic mirroring backend rules
      events.js                 # Event bus for data changes
    ui/                         # Reusable UI components
      badge.js, chart.js, confirm.js, drawer.js, form.js,
      icon.js, modal.js, pagination.js, select.js, skeleton.js,
      table.js, toast.js
    services/                   # API resource services (fetch wrappers only)
      bloodbanks.js, bloodtests.js, dashboard.js, donations.js,
      donors.js, hospitals.js, inventory.js, issues.js,
      lookups.js, patients.js, requests.js, staff.js
    pages/                      # Route view controllers
      dashboard.js, donors.js, donations.js, bloodtests.js,
      inventory.js, requests.js, issues.js, issuewizard.js,
      bloodbanks.js, hospitals.js, patients.js, staff.js,
      crudPage.js, emergency.js, settings.js, styleguide.js
  docs/                         # Project documentation and viva preparation
```

## Troubleshooting

| Problem | Cause | Solution |
| :--- | :--- | :--- |
| Cannot reach server on port 5000 | Flask backend not running | Run `python app.py` in `blood-bank-backend/` |
| Blank page | JavaScript module syntax blocked | Ensure you are serving via `http://localhost:5500`, not `file:///` |
| CORS errors | Origin mismatch | Ensure backend has `flask-cors` active (standard in backend) |
| Icons not rendering | SVG Sprite path issue | Verify `assets/icons/sprite.svg` exists and browser supports SVG `<use>` |

## Academic Scope & Limitations
- **No Authentication**: The backend provides no auth/JWT. The frontend provides simulated admin access for demo purposes.
- **Exact Blood Match**: Issues require exact blood group matching as enforced by the backend.
- **Seed Data**: Sample requests in seed data are already fully issued; create a new request for demoing issues.
