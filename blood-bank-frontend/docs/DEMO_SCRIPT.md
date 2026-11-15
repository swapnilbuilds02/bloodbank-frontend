# 7-Minute Practical Viva Demonstration Script

This step-by-step guide is designed for defending the project in an academic viva.

---

### Step 1: System Overview & Architecture (1 Minute)
1. Open `http://localhost:5500` in the browser.
2. Highlight the **API Status Pill** (green "API Online") in the topbar and the live version number in the footer.
3. Show the **Executive Dashboard**:
   - Point out the KPI metrics loaded concurrently.
   - Click the **Theme Toggle** (sun/moon) to demonstrate instant light/dark re-theming with zero flash.
   - Show the **Triage & Needs Attention** banner flagging critical blood shortages.

---

### Step 2: Donor Registration & Validation Rules (1.5 Minutes)
1. Navigate to **Donors** (`#/donors`).
2. Click **+ Register Donor**.
3. *Demonstrate validation*:
   - Enter Age `17` -> Notice immediate client-side validation ("Age must be between 18 and 65").
   - Change age to `24`.
   - Enter duplicate email -> Notice server-side HTTP 400 error cleanly mapped to the email input field.
4. Fill in valid data:
   - Name: `TEST Demonstration Donor`
   - Blood Group: `A+`
   - Phone: `+919876543210`
   - Email: `test-demo@example.com`
   - City: `Mumbai`
5. Click **Create Record**. The donor profile opens showing the calculated advisory eligibility.

---

### Step 3: Record Donation & Handover to Testing (1.5 Minutes)
1. Click **Record Donation** on the donor detail card.
2. Quantity defaults to `450 ml`; Date defaults to today. Click **Create Record**.
3. When the success prompt asks: *"Would you like to record laboratory test results now?"*, click **Record Test Now**.
4. The **Blood Tests** form opens pre-filled for this donation.
5. *Demonstrate safety rule*:
   - Set HIV to `Positive` and try selecting `Safe` -> Notice the system prevents selecting Safe because a positive screening cannot be approved.
   - Set all results to `Negative`. Overall status becomes `Safe`. Click **Record Test Result**.

---

### Step 4: Add Inventory & Verify Shelf Life (1 Minute)
1. Go to **Inventory** (`#/inventory`). Click **+ Intake Stock**.
2. Select the recent donation. Blood group `A+` is auto-filled and locked.
3. Select Component: `Packed Red Cells`. Notice the expiry date automatically computes `+42 days` shelf life.
4. Click **Create Record**. The new stock appears in the inventory table.

---

### Step 5: Raise Hospital Request & Complete Issue Wizard (2 Minutes)
1. Go to **Blood Requests** (`#/requests`). Click **+ Raise Blood Request**.
2. Select any patient (e.g., patient requiring `A+` blood), Hospital: `City General`, Units Required: `1`, Urgency: `High`.
3. Submit the request.
4. Click **Issue Blood Now** to enter the **Issue Blood Wizard**:
   - **Step 1**: The new request is highlighted with 1 unit needed. Click **Select →**.
   - **Step 2**: The stock we just created is screened and ranked at the top of the FEFO list (First-Expiring-First-Out). Click **Select Stock →**.
   - **Step 3**: Cross-check recipient, compatibility, and authorizing staff. Click **Authorize & Issue Blood**.
5. The **Clinical Issue Slip** displays with the database transaction reference. Click **Print Issue Slip** to showcase `print.css` clean formatting with zero navigation clutter!

---

### Backup Plan (If Database or Backend Goes Down)
- The offline banner immediately notifies: *"Cannot reach server on port 5000"*.
- Open **Settings** (`#/settings`) and click **Test Connection** to demonstrate latency diagnostic.
- Show `docs/QUALITY_REPORT.md` and explain the architecture from `docs/ARCHITECTURE.md`.
