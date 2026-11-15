# Blood Bank & Donor Management System — Complete Frontend

An accessible, responsive, zero-build-step Single Page Application (SPA) for managing blood bank logistics, donor registries, laboratory blood safety screening, inventory shelf life, and clinical transfusion issuing.

Built as a 2nd-year engineering DBMS laboratory project.

---

## 1. Key Features

- **Executive Overview Dashboard**: Parallel-loaded KPI metric cards, interactive stock tiles for all 8 blood groups, Chart.js donation trends and request status charts, and a real-time clinical triage alert panel.
- **Donor Directory & History**: Comprehensive donor records with age validation (18–65), advisory donation eligibility countdown (90-day waiting period), and complete historical donation logs.
- **Collection Intake & Testing Handover**: Records volume in milliliters, pre-populates default dates, and immediately prompts the attendant to transition the unit to laboratory screening.
- **Laboratory Safety Verification**: Strict clinical validation (Overall status can ONLY be `Safe` if HIV, Hepatitis, and Malaria are all `Negative`).
- **Inventory & Expiration Tracking**: Tracks usable vs expired units across blood banks, provides FEFO (First-Expiring-First-Out) visibility, and enforces advisory shelf life by component type (Whole Blood 35d, Packed Red Cells 42d, Platelets 5d, Plasma 365d).
- **Hospital Blood Requests Queue**: Prioritizes emergency orders by urgency (`Critical` with pulsing alert, `High`, `Normal`, `Low`), shows visual issued/required progress bars, and resolves seed data quirks.
- **3-Step Blood Issue Wizard**:
  - *Step 1*: Filter and select active hospital request.
  - *Step 2*: Screen and select unexpired, lab-verified `Safe` stock sorted FEFO.
  - *Step 3*: Cross-check compatibility, authorize by staff, execute row-locked transaction, and generate printable clinical slips.
- **Master Data CRUD Factory**: Reusable architecture for Blood Banks, Hospitals, Patients, and Staff.
- **Emergency Regional Search**: Finds available blood units across all banks or on-call donors in under 10 seconds with direct `tel:` calling and `mailto:` links.
- **Theme & Accessibility Settings**: Instant light/dark theme toggle, density mode (comfortable/compact), reduce motion override, and real-time backend API latency diagnostic.

---

## 2. Tech Stack & Engineering Decisions

| Dimension | Decision | Rationale |
| :--- | :--- | :--- |
| **Language** | Vanilla JavaScript (ES2022) | Native ES modules run directly in any modern browser without Webpack, Vite, Babel, or npm dependencies. |
| **CSS Framework** | Custom CSS Custom Properties | Token-driven architecture in `tokens.css`; zero CSS frameworks needed; supports instant light/dark themes. |
| **Charts** | Chart.js v4 (Vendored) | Exactly one vendored library (`assets/vendor/chart.umd.min.js`), loaded locally once; zero CDN links. |
| **Icons** | SVG Sprite Sheet | 33 scalable vector icons in `assets/icons/sprite.svg`, rendered with `<use href="...">`. Zero icon web font downloads. |
| **Security** | Zero `innerHTML` with API Data | All dynamic content is inserted with `textContent` or `h()` element builders, guaranteeing complete protection against Stored/Reflected XSS. |
| **Routing** | Hash-Based SPA Router | `#/dashboard`, `#/donors/:id` handles bookmarking, deep-linking, query-string filters, and browser back/forward history. |

---

## 3. Quick Start (Windows PowerShell)

### Step 1: Start the Backend (Port 5000)
```powershell
cd blood-bank-backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
# Ensure database credentials in .env are configured
python app.py
# Backend runs on http://127.0.0.1:5000
```

### Step 2: Start the Frontend (Port 5500)
```powershell
cd blood-bank-frontend
python -m http.server 5500
# Open http://localhost:5500 in Google Chrome, Microsoft Edge, or Firefox
```

---

## 4. Documentation Pack for Viva Defense

Comprehensive project documentation is located in `blood-bank-frontend/docs/`:

1. [QUALITY_REPORT.md](docs/QUALITY_REPORT.md): Full accessibility (WCAG AA), security XSS audit, and responsiveness report.
2. [ARCHITECTURE.md](docs/ARCHITECTURE.md): Multi-tier architecture diagram, database transaction flow, and layer separation.
3. [SCREEN_TO_TABLE_MAP.md](docs/SCREEN_TO_TABLE_MAP.md): Matrix mapping every UI route to REST endpoints and MySQL tables.
4. [DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md): Step-by-step 7-minute practical viva demonstration script.
5. [VIVA_QA.md](docs/VIVA_QA.md): 30 technical viva questions with model answers.
6. [FUTURE_SCOPE.md](docs/FUTURE_SCOPE.md): Industrial roadmap (JWT RBAC, compatibility cross-matching, SMS alerts).

---

## 5. Troubleshooting

| Problem | Cause | Solution |
| :--- | :--- | :--- |
| **"Cannot reach server on port 5000"** | Backend process is not running | Navigate to `blood-bank-backend/` and run `python app.py` |
| **CORS network error** | Origin not whitelisted | The backend has `flask-cors` active by default. Access via `http://localhost:5500`, not `file:///`. |
| **Request already fully issued** | Seed data sample quirk | Sample requests in seed data have `units_issued = units_required`. Click *"Mark as Fulfilled?"* or create a new request for demoing. |
| **Chart not rendering** | Vendored library missing | Verify `assets/vendor/chart.umd.min.js` exists in the assets directory. |

---

## 6. Academic Disclaimer
*This is an academic DBMS coursework project developed for educational and viva demonstration purposes. It is not approved for live clinical transfusion management.*
