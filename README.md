# Passport Portal — Passport Automation System
**R25 Software Engineering Project • Full-Stack Web Application Prototype**

---

## 1. Overview
The **Passport Portal — Passport Automation System** is an institutional-grade, desktop-first demonstration website engineered for the **R25 Software Engineering Project**. The application provides an automated end-to-end lifecycle for national travel document issuance, including multi-step applicant bio-data intake, real-time Machine Readable Zone (MRZ ISO/IEC 7501) generation, DigiLocker/e-KYC identity verification, simulated fee payments, automated Passport Seva Kendra (PSK) biometric appointment scheduling with collision avoidance, and a dedicated Passport Officer Scrutiny Console with background clearance verification engines (Aadhaar Bridge, CCTNS criminal check, and Prior Loss DB).

> **Demonstration Website Architecture:**
> Configured as a self-contained, frontend-only demonstration website. Application state, document records, simulated fee receipts, biometric appointments, and officer scrutiny decisions are persisted in the browser via `localStorage` and synchronized dynamically using React state and real-time custom event broadcasting. No external backend, Flask, or MySQL servers are required to experience the full software engineering prototype.

---

## 2. Technology Stack & Design System
- **Frontend:** React 19, TypeScript, Tailwind CSS with custom Stitch theme tokens.
- **State & Data Layer:** React State + Browser `localStorage` simulation engine with real-time Pub/Sub synchronization.
- **Icons & Visual Language:** Lucide React & Google Material Symbols Outlined.
- **Development Runtime:** Vite on Node.js.
- **Design Specifications (Google Stitch):**
  - **Coffee brown:** `#6F4E37`
  - **Dark coffee brown:** `#4B3621`
  - **Light coffee brown:** `#A67B5B`
  - **White:** `#FFFFFF`
  - **Warm background:** `#F8F5F2`
  - **Borders & Dividers:** `#E7DED6`
  - **Primary text:** `#29231F`
  - **Secondary text:** `#756B63`
  - **Verification / Success:** `#2E6F40`, bg `#EAF5ED`
  - **Pending / Warning:** `#B37D14`, bg `#FEF8E7`
  - **Flagged Discrepancy / Error:** `#A63A3A` / `#BA1A1A`, bg `#FFDAD6`

---

## 3. System Architecture & Directory Structure

```
├── .env.example                     # Environment configuration variables
├── index.html                       # HTML5 entry with Inter font & Material Symbols
├── metadata.json                    # Project metadata & capabilities
├── package.json                     # Node.js dependencies
├── tsconfig.json                    # TypeScript compiler configuration
├── vite.config.ts                   # Vite bundler configuration
│
├── database/
│   ├── schema.sql                   # MySQL 8.0 normalized schema (7 core tables)
│   └── seed.sql                     # Seed records (Eleanor Vance, Officer OFF-4029, filings)
│
├── backend/
│   ├── app/
│   │   ├── __init__.py              # Flask app factory, CORS, and blueprint registration
│   │   ├── models/models.py         # SQLAlchemy ORM models (User, Application, Document, etc.)
│   │   └── routes/
│   │       ├── auth_routes.py       # Authentication (/api/auth)
│   │       ├── application_routes.py# Applications & ARN tracking (/api/applications)
│   │       ├── document_routes.py   # Document vault & verification (/api/documents)
│   │       ├── payment_routes.py    # Simulated fee payments (/api/applications/:id/payment)
│   │       ├── appointment_routes.py# PSK slot booking & collision check (/api/appointments)
│   │       ├── officer_routes.py    # Officer scrutiny queue & decisions (/api/officer)
│   │       └── notification_routes.py# Consular alert dispatches (/api/notifications)
│   ├── config.py                    # Flask configuration & MySQL database URI
│   ├── requirements.txt             # Python pip dependencies
│   ├── run.py                       # Flask entry point script
│   └── tests/
│       └── test_api.py              # Pytest automated test suites
│
└── src/
    ├── types/index.ts               # Complete TypeScript data model definitions
    ├── data/mockDatabase.ts         # Persistent browser storage engine for client evaluation
    ├── services/api.ts              # Unified REST API service with graceful fallback
    ├── components/
    │   ├── Header.tsx               # Top bar with emblem, nav links, and role switcher
    │   ├── Sidebar.tsx              # Persistent 256px sidebar (Adjudication & Administrative)
    │   ├── AuthModal.tsx            # Login, register, and one-click demo personas
    │   ├── NotificationModal.tsx    # Live consular dispatches & unread tracker
    │   ├── SimulatedPaymentModal.tsx# Fee breakdown, mock gateway, and transaction ref generator
    │   ├── AppointmentBookingModal.tsx# PSK center locator & slot collision prevention
    │   └── DocumentPreviewModal.tsx # High-fidelity document inspector with officer stamps
    ├── pages/
    │   ├── LandingPage.tsx          # Stitch Image 1 replica (hero, e-passport card, matrix, FAQs)
    │   ├── ApplicantDashboard.tsx   # Stitch Image 3 replica (dockets, 4 Bento stats, ledger table)
    │   ├── NewApplicationPage.tsx   # Stitch Image 5 replica (6-step form, live MRZ preview, auto-save)
    │   ├── OfficerConsole.tsx       # Stitch Image 7 replica (queue docket, engines, split inspection)
    │   ├── MyApplicationsPage.tsx   # Full application list & status filters
    │   ├── DocumentVaultPage.tsx    # Upload & replacement of verification collateral
    │   ├── AppointmentBookingPage.tsx# Schedule, reschedule & cancel appointments
    │   ├── ApplicationTrackingPage.tsx# ARN search, audit trail, and officer remarks
    │   └── NotificationsSettingsPage.tsx# Profile details & prototype sandbox reset
    ├── App.tsx                      # Applet routing shell & state orchestration
    ├── main.tsx                     # React root mount
    └── index.css                    # Tailwind CSS theme tokens
```

---

## 4. User Roles & Demo Credentials

| Role | Demo Account Name | Email | Password | Role Features |
|---|---|---|---|---|
| **Applicant** | Eleanor Vance | `eleanor.vance@example.com` | `DemoPass123!` | Bio-data filing, draft saving, live MRZ generation, document uploads, simulated payments, appointment booking, status tracking. |
| **Passport Officer** | Inspector R. K. Thorne (Badge: OFF-4029) | `officer.rpo@passport.gov.in` | `DemoPass123!` | Adjudication queue, Tatkaal triage, split-dossier inspection, document verification, request correction with remarks, grant passport / reject. |

*Quick Persona Switching: Use the profile dropdown in the top header or the "One-Click Academic Evaluation Access" buttons inside the Sign In modal.*

---

## 5. REST API Documentation

### Authentication
- `POST /api/auth/register` — Registers citizen with full name, email, and password hashing.
- `POST /api/auth/login` — Authenticates credentials and starts session.
- `POST /api/auth/logout` — Destroys current session.
- `GET /api/auth/me` — Returns active session user profile.

### Applications
- `GET /api/applications` — Returns applications (scoped to applicant or all for officer).
- `POST /api/applications` — Creates a new draft or submitted application.
- `GET /api/applications/:id` — Retrieves comprehensive application dossier.
- `PUT /api/applications/:id` — Updates draft application fields.
- `POST /api/applications/:id/submit` — Finalizes and timestamps application submission.
- `GET /api/applications/track/:arn` — Public status tracking by ARN or URN.

### Document Management
- `POST /api/applications/:id/documents` — Ingests document metadata and sample files.
- `GET /api/applications/:id/documents` — Retrieves attached documents for application.
- `POST /api/documents/:id/verify` — Officer marks document as Verified with audit stamp.
- `POST /api/documents/:id/request-correction` — Officer requests correction with remark.

### Simulated Payments
- `POST /api/applications/:id/payment/demo` — Processes simulated fee payment with unique transaction reference (e.g., `TXN-PAS-2025-88412-A1`). Prevents duplicate payments.
- `GET /api/applications/:id/payment` — Retrieves payment receipt and status.

### Appointments
- `GET /api/appointments` — Lists scheduled appointments.
- `POST /api/appointments` — Books appointment slot. Enforces collision prevention against double-booking.
- `PATCH /api/appointments/:id/cancel` — Cancels scheduled appointment and resets status.

### Officer Console
- `GET /api/officer/dashboard` — Live queue metrics (Urgent triage, Tatkaal count, acceptance rate).
- `GET /api/officer/applications` — Returns FIFO adjudication docket with search and filters.
- `POST /api/officer/applications/:id/approve` — Grants passport (validates no unresolved document corrections).
- `POST /api/officer/applications/:id/reject` — Rejects application with reason and records audit log.
- `GET /api/officer/reports` — Statistical performance summary.

### Notifications
- `GET /api/notifications` — Lists consular alerts for citizen.
- `PATCH /api/notifications/:id/read` — Marks notification as acknowledged.

---

## 6. Execution & Setup Instructions

### Option A: Direct Web Runtime (Vite + React)
The frontend application and its integrated REST API client run immediately out-of-the-box:
```bash
npm run dev
```
Navigate to `http://localhost:3000` to interact with the full UI.

### Option B: Python Flask & MySQL Backend
To run the native Python backend locally:

1. **MySQL Database Initialization:**
   ```bash
   mysql -u root -p < database/schema.sql
   mysql -u root -p < database/seed.sql
   ```

2. **Python Environment Setup:**
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate    # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Configure Environment:**
   Create a `.env` in `backend/`:
   ```env
   DATABASE_URL=mysql+pymysql://root:password@localhost:3306/passport_automation
   SECRET_KEY=r25-software-eng-passport-portal-secure-key-2025
   ```

4. **Launch Flask Server:**
   ```bash
   python run.py
   ```
   Flask API runs on `http://127.0.0.1:5000`.

---

## 7. Automated Testing Instructions
Run backend automated test suites with pytest:
```bash
cd backend
pytest -v tests/test_api.py
```

Test coverage includes:
- User registration, duplicate email rejection, and credential verification.
- Application draft saving, retrieval, and final submission timestamping.
- Simulated payment execution and duplicate payment prevention.
- Appointment booking collision avoidance (blocking two applicants from reserving the same slot).
- Officer prerequisite validation (preventing approval when document corrections remain unresolved).
- Officer decision auditing and notification dispatches.
