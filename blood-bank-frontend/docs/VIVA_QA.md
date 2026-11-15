# Top 30 Viva Questions & Accurate Model Answers

### Architecture & Technology
**Q1: Why did you build this with Vanilla JavaScript instead of React or Vue?**  
*Answer*: Vanilla ES2022 modules require zero build steps, zero npm dependencies, and compile-free execution. The code is transparent, lightweight (~50KB), and easy to read and defend in an academic viva without obfuscating abstractions.

**Q2: What is a Single Page Application (SPA) and how does your routing work?**  
*Answer*: An SPA serves one `index.html` file and updates the view dynamically using JavaScript without full page reloads. We use hash routing (`window.location.hash`), listening to `hashchange` events to parse parameters (`#/donors/:id`) and synchronize URL query filters.

**Q3: How do you prevent Cross-Site Scripting (XSS) attacks?**  
*Answer*: We never insert dynamic API data with `innerHTML` or `outerHTML`. All data is rendered using `textContent`, `document.createTextNode()`, or an element builder `h()` that treats strings as plain text. Furthermore, a strict Content Security Policy (CSP) restricts external script execution.

**Q4: How does the application operate offline?**  
*Answer*: The app uses a system font stack (no Google Fonts), local inline SVG sprites (no FontAwesome CDN), and vendors Chart.js locally. No external requests are made outside `localhost:5000`.

**Q5: Why did you use `URLSearchParams` instead of string concatenation for query parameters?**  
*Answer*: Blood groups contain `+` characters (e.g. `O+`, `A+`). In query strings, `+` is interpreted as a space unless encoded as `%2B`. `URLSearchParams` and `encodeURIComponent` ensure accurate encoding.

---

### Database Transactions & Concurrency
**Q6: What is a race condition in blood inventory issuing?**  
*Answer*: If two hospital requests attempt to issue the same last remaining unit of blood simultaneously, both might read `units_available = 1` and both succeed, leading to negative stock or double issuance.

**Q7: How does the backend prevent race conditions during issuing?**  
*Answer*: The backend executes the issue operation inside a database transaction with `FOR UPDATE` row locks on both the inventory row and the request row, guaranteeing strict serialization.

**Q8: What does HTTP Status 409 Conflict mean in this application?**  
*Answer*: 409 indicates a business rule conflict or database referential integrity violation—for example, trying to delete a donor who has recorded donations, issuing expired stock, or registering a duplicate unique email/phone.

**Q9: What is FEFO and why is it used?**  
*Answer*: FEFO stands for *First-Expiring-First-Out*. It sorts available inventory by expiration date ascending so units closest to expiring are transfused first, minimizing clinical waste.

**Q10: Why does the issue endpoint prohibit updating quantity or deleting?**  
*Answer*: Blood issuance is an irreversible medical transfer. Deleting an issue record would tamper with the clinical audit log. Quantity cannot be altered without re-locking and re-validating stock.

---

### Domain Rules & Data Integrity
**Q11: What is the safety rule for blood testing?**  
*Answer*: A blood test overall status can ONLY be `Safe` if HIV, Hepatitis, and Malaria results are all `Negative`. If any test is `Positive`, it is forced to `Unsafe`.

**Q12: Why are all 20 sample requests in seed data fully issued yet marked `Pending`?**  
*Answer*: In `BloodBankDB.sql`, the seed data populated `units_issued` equal to `units_required` before the issue logic was finalized. We detect `units_required - units_issued == 0` and provide an interactive helper to mark them `Fulfilled`.

**Q13: How is donor eligibility calculated?**  
*Answer*: By calculating the elapsed days between today and `last_donation_date`. If greater than or equal to the waiting interval (default 90 days), the donor is marked Eligible. This is labelled advisory in accordance with medical standards.

**Q14: Why can't a donor have multiple tests for the same donation?**  
*Answer*: The `bloodtest` table enforces a `UNIQUE KEY` on `donation_id`, reflecting a 1:1 relationship between a collection bag and its laboratory screening.

**Q15: What components are derived from whole blood and what are their shelf lives?**  
*Answer*: Whole Blood (35 days), Packed Red Cells (42 days), Platelets (5 days), and Fresh Frozen Plasma (365 days).

---

### Design System & Coding Standards
**Q16: How do you achieve WCAG 2.1 AA accessibility?**  
*Answer*: We ensure a minimum contrast ratio of 4.5:1 for normal text, visible focus indicator rings on all interactive elements, keyboard trap inside modal dialogs, and text labels accompanying color badges.

**Q17: What is the purpose of `print.css`?**  
*Answer*: Media query `@media print` hides all navigation headers, sidebars, buttons, and footers, leaving only clean, formatted clinical slips with signature lines suitable for printing.

**Q18: What is the difference between PUT and POST in this API?**  
*Answer*: POST creates a new record. PUT performs a partial update on existing resources, where our frontend computes a diff and sends only the modified fields.

**Q19: How do you handle transient backend disconnection?**  
*Answer*: A health check polls `/api/health` every 30 seconds and on window focus. If unreachable, the status pill turns red and an offline banner with a Retry button appears without crashing the UI.

**Q20: How are lookups cached?**  
*Answer*: Foreign-key tables (banks, hospitals, staff, patients) are cached in memory with a 60-second TTL. The cache is invalidated automatically whenever a mutation event (`data:changed:*`) occurs.

---

### Advanced Viva Concepts
**Q21: What is the JSON Envelope pattern?**  
*Answer*: Every API response is standardized into `{ success: boolean, message: string, data: any, pagination: object }`, allowing consistent error extraction and pagination handling.

**Q22: Why shouldn't you use `new Date(str).toISOString()` for date-only values?**  
*Answer*: Parsing `"2026-11-15"` into a JavaScript Date object in local time zones west of UTC can shift the date backward by one day. We split the string directly into year, month, and day integers.

**Q23: How do you handle pagination limits?**  
*Answer*: The backend caps `limit` at 200. We implement server-side pagination with first/prev/next/last controls and allow users to select page sizes of 10, 25, 50, or 100.

**Q24: How does the CSV export handle thousands of rows?**  
*Answer*: It loops asynchronously across pages using `limit=200` up to a safe cap of 5,000 rows, escapes internal double quotes, prefixes a UTF-8 Byte Order Mark (BOM) for Excel compatibility, and downloads as a blob.

**Q25: What is event delegation?**  
*Answer*: Attaching an event listener to a parent container rather than each individual row, reducing memory footprint and automatically handling dynamically added rows.

**Q26: Why are contact numbers unique on donors and staff, but not patients?**  
*Answer*: Donors and staff are unique registered individuals in the institution. Patients may be infants, dependents, or elderly individuals who share a family emergency contact number.

**Q27: How is the database protected against SQL injection?**  
*Answer*: The Flask backend utilizes parameterized prepared statements for all MySQL queries; the frontend additionally validates input formats before submission.

**Q28: How does the app support users who prefer reduced motion?**  
*Answer*: We honor the CSS media query `@media (prefers-reduced-motion: reduce)` and provide an explicit toggle in Settings that cancels pulsing animations and transitions.

**Q29: How did you avoid code duplication for master data pages?**  
*Answer*: We implemented a universal CRUD factory (`createCrudPage`) configured by simple metadata schemas for Blood Banks, Hospitals, Patients, and Staff.

**Q30: If this product were deployed to a live hospital network, what would be the next critical enhancements?**  
*Answer*: JWT authentication with role-based access control (Nurse vs Admin), SMS/Email donor dispatch notifications, an ABO/Rh compatibility cross-matching matrix, and HL7/FHIR hospital EHR integration.
