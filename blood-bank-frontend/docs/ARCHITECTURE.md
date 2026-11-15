# System Architecture & Lifecycle Specification

## 1. Multi-Tier Architecture

```mermaid
flowchart TD
  subgraph Client ["Client Browser (Offline Capable SPA)"]
    HTML["index.html"] --> DOM["Virtual Shell & Routing"]
    DOM --> Pages["Page Controllers (js/pages/*)"]
    Pages --> Services["API Services (js/services/*)"]
    Services --> Core["Core Engine (api.js, store.js, format.js)"]
  end

  subgraph Backend ["Application Server (Port 5000)"]
    Flask["Flask REST API Server"]
    CORS["CORS Middleware"]
    Endpoints["Flask Blueprints / Routes"]
    Flask --> CORS --> Endpoints
  end

  subgraph Database ["Persistence Layer"]
    MySQL[("MySQL 8.0 Engine\nBloodBankDB")]
    Tables["10 Relational Tables\nTransactions & Row Locks"]
    MySQL --> Tables
  end

  Core <-->|JSON Envelope over HTTP| Flask
```

---

## 2. End-to-End "Issue Blood" Transaction Flow

```mermaid
sequenceDiagram
  autonumber
  actor Attendant as Blood Bank Staff
  participant UI as Frontend Issue Wizard
  participant API as Flask REST API
  participant DB as MySQL Database

  Attendant->>UI: Selects Open Request (Patient & Group)
  UI->>API: GET /api/inventory?blood_group=O+
  API->>DB: SELECT * FROM bloodinventory WHERE blood_group='O+'
  DB-->>API: Rows returned
  API-->>UI: Inventory list with expiry_status & test_status
  UI->>UI: Filter (Valid + Safe + Available > 0) & Sort FEFO
  Attendant->>UI: Chooses Stock, Authorizing Staff, & Units
  Attendant->>UI: Clicks "Authorize & Issue Blood"
  UI->>API: POST /api/issues {request_id, inventory_id, staff_id, units_issued}
  
  Note over API,DB: Begin Database Transaction
  API->>DB: SELECT * FROM bloodinventory WHERE inventory_id=... FOR UPDATE
  API->>DB: SELECT * FROM bloodrequest WHERE request_id=... FOR UPDATE
  API->>DB: Verify unexpired, Safe test, and matching blood group
  API->>DB: INSERT INTO bloodissue (...)
  API->>DB: UPDATE bloodinventory SET units_available = units_available - N
  API->>DB: UPDATE bloodrequest SET units_issued = units_issued + N (Fulfilled if complete)
  API->>DB: COMMIT Transaction
  Note over API,DB: End Transaction
  
  API-->>UI: 201 Created {issue_id, units_remaining, request_fulfilled}
  UI-->>Attendant: Renders Clinical Issue Slip & Print Dialog
```

---

## 3. Frontend Architecture Layers

1. **Pages Layer (`js/pages/*`)**: View controllers responsible for rendering DOM subtrees, binding user interactions, and triggering workflows. Never issues raw `fetch` calls.
2. **Services Layer (`js/services/*`)**: Thin API client wrappers created using `createResource` factory. Manages pagination parameters and lookup cache invalidations.
3. **Core Layer (`js/core/*`)**: Zero-dependency framework abstractions:
   - `api.js`: Envelope unboxing, status extraction, network error transformation, and request aborting.
   - `router.js`: Hash-based SPA routing with query string synchronization.
   - `dom.js`: Secure element builders that escape untrusted strings by construction.
   - `format.js`: Date arithmetic, relative time formatting, and number localization.
   - `store.js`: LocalStorage preference caching with fallback.
   - `events.js`: Pub/sub event bus decoupling services from view updates.
4. **UI Components Layer (`js/ui/*`)**: Generic, resource-agnostic widgets: data table, form dialog, modal, drawer, toast, status badges, pagination, and searchable comboboxes.
