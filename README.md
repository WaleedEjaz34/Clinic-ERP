# MedPulse ERP — Clinic Management System (Frontend UI)

A modern, responsive, professional healthcare administration and clinic ERP system built using **React.js**, **Tailwind CSS**, and **Vite**.

## Technology Stack

- **Core**: React 19, JavaScript (ESM), Vite
- **Styling**: Tailwind CSS v3, PostCSS, Google Fonts (Plus Jakarta Sans)
- **Routing**: React Router DOM (v7)
- **Icons**: Lucide React
- **Analytics & Charts**: Recharts
- **Date Handling**: date-fns
- **Client-Side PDF Engine**: jsPDF & jspdf-autotable
- **State & Persistence**: React Context + LocalStorage

## Modules Implemented

1. **Dashboard (`/`)**: 7 KPI metric cards, Recharts status distribution & cashflow analytics, Today's appointments queue, recent payments, recent expenses, and quick action shortcuts.
2. **Doctors (`/doctors`)**: Doctor directory, specialization filters, Add/Edit modal, and Doctor Profile modal with availability schedules and consultation history.
3. **Patients (`/patients`)**: Comprehensive patient records, duplicate phone warnings, and an **8-tab Patient 360° Profile** (*Overview, Appointments, Visit History, Prescriptions, Invoices, Payments, Outstanding Balance, Notes*).
4. **Appointments (`/appointments`)**: Dual **List View** and **Calendar View** (*Month, Week, Day*), booking conflict prevention, status progression (*Scheduled, Checked-In, Waiting, In Consultation, Completed*), and direct consultation handoff.
5. **Prescriptions & Consultations (`/prescriptions`)**: Clinical consultation workspace with multi-row medication prescriptions (dosage, frequency, duration, instructions), diagnostic test requests, follow-up scheduling, and print/PDF generation.
6. **Patient Bills (`/bills`)**: Itemized charges (consultation, procedures, tests, discounts) with real-time balance calculations, status badges (*Paid, Partially Paid, Unpaid*), and payment collection shortcut.
7. **Payment Collection (`/payments`)**: Cashier payment ledger with reactive bill selector, prefilled balance, bank/cash account deposits, and instant printable receipts.
8. **Cash & Bank Accounts (`/accounts`)**: Physical cash drawer and bank account management with running transaction ledger history (inflows vs outflows).
9. **Chart of Accounts (`/chart-of-accounts`)**: Income and expense category classification for clinic revenue and overhead tracking.
10. **Expense Management (`/expenses`)**: Disbursement vouchers linked to cash registers or bank accounts with balance verification and file attachment simulation.
11. **User Management & RBAC (`/users`)**: Staff accounts, linked doctors, and an interactive **Role-Based Access Control (RBAC) Permissions Matrix** with View, Create, Edit, Delete, and Print controls.

## Running the Project Locally

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Run local development server
npm run dev

# 3. Build production bundle
npm run build
```

Open [http://localhost:5173](http://localhost:5173) in your browser.
