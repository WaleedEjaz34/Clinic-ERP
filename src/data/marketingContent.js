// ============================================================================
// MEDPULSE CLINIC ERP — CENTRALIZED MARKETING CONTENT CONFIGURATION
// ============================================================================
// This file serves as the single source of truth for the public-facing marketing
// website of MedPulse Clinic ERP. All marketing copy, feature descriptions,
// workflows, role benefits, pricing frameworks, and FAQs are configured here.
// ============================================================================

export const brandConfig = {
  name: 'MedPulse Clinic ERP',
  shortName: 'MedPulse',
  category: 'Clinic Management Software',
  tagline: 'One Platform for Smarter Clinic Management',
  subtitle:
    'Manage appointments, patients, prescriptions, billing, payments, and clinic expenses in one organized workspace.',
  version: '2.4.0',
  releaseYear: 2026,

  // Contact & Inquiries (Clearly identified demonstration & sales placeholders)
  contact: {
    salesEmail: 'sales@medpulse-erp.com',
    supportEmail: 'support@medpulse-erp.com',
    inquiryPhone: '+1 (800) 555-0199',
    officeAddress: 'Healthcare Technology Hub, Suite 400, Innovation District',
    supportHours: 'Monday – Saturday: 8:00 AM – 7:00 PM (EST)',
    demoAvailability: 'Online via Screen Share or Self-Guided Browser Tour',
  },

  // Social & Community Links
  socials: [
    { name: 'LinkedIn', url: 'https://linkedin.com', id: 'linkedin' },
    { name: 'Twitter / X', url: 'https://x.com', id: 'twitter' },
    { name: 'YouTube', url: 'https://youtube.com', id: 'youtube' },
    { name: 'GitHub', url: 'https://github.com', id: 'github' },
  ],
};

// ============================================================================
// VALUE PROPOSITIONS (Section 2)
// ============================================================================
export const valuePropositions = [
  {
    id: 'organized-records',
    title: 'Organized Patient Information',
    description:
      'Maintain unified medical and administrative profiles with complete visit histories, past diagnoses, active prescriptions, and billing ledgers in one searchable place.',
    iconName: 'FolderHeart',
    metrics: 'Unified Profiles',
    details: 'Zero fragmented paper folders; instant patient lookup by name, phone, or MRN.',
  },
  {
    id: 'streamlined-scheduling',
    title: 'Easier Appointment Management',
    description:
      'Coordinate doctor schedules, patient check-ins, and consultation queues with live status indicators from scheduled to in-consultation and completed.',
    iconName: 'CalendarCheck',
    metrics: 'Live Queue Tracking',
    details: 'Reduce patient wait times with transparent doctor slot allocation and queue oversight.',
  },
  {
    id: 'clear-billing',
    title: 'Clearer Billing & Collections',
    description:
      'Generate itemized consultation and procedure invoices, record partial or full payments, track outstanding balances, and print clear receipts on demand.',
    iconName: 'Receipt',
    metrics: 'Itemized Invoicing',
    details: 'Eliminate billing disputes with clear breakdown of fees, discounts, and paid balances.',
  },
  {
    id: 'operational-visibility',
    title: 'Better Operational Visibility',
    description:
      'Gain real-time visibility into daily patient volume, collections, clinic expenses, and cash/bank balances through consolidated executive dashboards.',
    iconName: 'Activity',
    metrics: 'End-of-Day Clarity',
    details: 'Reconcile front-desk cash collections with bank deposits and recorded expense vouchers.',
  },
];

// ============================================================================
// CORE FEATURES (Section 3 & Features Page)
// ============================================================================
export const coreFeatures = [
  {
    id: 'patients',
    slug: 'patients',
    title: 'Patient Management',
    category: 'Clinical',
    iconName: 'Users',
    badge: 'Core Module',
    shortDescription:
      'Comprehensive digital patient profiles with medical history, appointment logs, prescriptions, and financial balances.',
    longDescription:
      'MedPulse replaces scattered paper records with unified electronic patient profiles. Each patient record maintains full demographic details, blood group, emergency contacts, chronological consultation history, past prescriptions, and real-time outstanding billing balances.',
    benefits: [
      'Fast registration with automated Medical Record Number (MRN) generation.',
      'Instant search by patient name, phone number, CNIC, or MRN.',
      'Complete visit history timeline linking every appointment to its doctor, prescription, and invoice.',
      'Transparent account ledger showing total billed, total paid, and outstanding balance.',
    ],
    capabilities: [
      'Patient demographics, emergency contacts, and blood group logging',
      'Medical visit history with one-click access to past prescriptions',
      'Unified financial balance and payment history for every patient',
      'Quick action bar: Schedule Appointment, New Bill, Write Rx',
    ],
    workflowSummary:
      'Receptionist registers patient once -> Instant MRN assigned -> Available across scheduling, consultation, and billing immediately.',
  },
  {
    id: 'doctors',
    slug: 'doctors',
    title: 'Doctor Management',
    category: 'Administrative',
    iconName: 'Stethoscope',
    badge: 'Clinical Staff',
    shortDescription:
      'Manage consultant profiles, specializations, consulting hours, OPD consultation fees, and active patient rosters.',
    longDescription:
      'Organize your clinic’s consulting physicians and specialists. Configure consultation fees, department specializations, weekly availability schedules, room assignments, and contact channels.',
    benefits: [
      'Structured specialist directory with qualifications and department categorization.',
      'Configurable consultation fee schedules used automatically during bill generation.',
      'Clear scheduling availability prevents accidental double-booking.',
      'Performance tracking for patient visits and consulting revenue generated.',
    ],
    capabilities: [
      'Consultant qualifications, department, and contact details',
      'Standard consultation fee auto-fills in patient billing',
      'Weekly consulting day and time slot configuration',
      'Direct filter for doctor-specific daily appointment queues',
    ],
    workflowSummary:
      'Define doctor profiles and standard fees -> System uses them automatically when scheduling appointments and issuing bills.',
  },
  {
    id: 'appointments',
    slug: 'appointments',
    title: 'Appointment Scheduling',
    category: 'Administrative',
    iconName: 'Calendar',
    badge: 'Front Desk',
    shortDescription:
      'Coordinate patient bookings, doctor time slots, token numbers, and live queue status tracking from check-in to consultation.',
    longDescription:
      'Streamline your front desk with flexible appointment management. Book new visits, assign time slots and token numbers, and update live status badges (Scheduled, Waiting, In-Consultation, Completed, Cancelled).',
    benefits: [
      'Prevents waiting room congestion with sequential token assignments.',
      'Visual status tags keep front-desk and doctors aligned on patient flow.',
      'Filter appointments by date, doctor, or status with one click.',
      'Direct transition from completed appointment to prescription and billing.',
    ],
    capabilities: [
      'Calendar and list views with doctor and date filters',
      'Status lifecycle: Scheduled -> Waiting -> In-Consultation -> Completed',
      'Auto-generated queue token numbers for fair patient routing',
      'Quick links to view patient profile or generate bill directly',
    ],
    workflowSummary:
      'Patient arrives -> Reception marks status as "Waiting" -> Doctor sees live queue -> Consultation starts -> Marked "Completed".',
  },
  {
    id: 'prescriptions',
    slug: 'prescriptions',
    title: 'Digital Prescriptions',
    category: 'Clinical',
    iconName: 'FileText',
    badge: 'Physician Tool',
    shortDescription:
      'Structured digital prescription writer with standardized medication dosages, administration instructions, and lab tests.',
    longDescription:
      'Empower doctors to write clean, professional, and legible prescriptions in seconds. Select medications from the clinic formulary, define dosage, frequency, duration, and meal instructions, add diagnostic test orders, and print formatted Rx sheets.',
    benefits: [
      'Eliminates handwriting errors and medication misinterpretation.',
      'Master formulary lookup for quick medicine selection and standard instructions.',
      'Include recommended lab investigations and follow-up consultation dates.',
      'Prints professional clinic-branded Rx slips for patient convenience.',
    ],
    capabilities: [
      'Clinical notes, provisional diagnosis, and chief complaint documentation',
      'Itemized medication table: Brand/Generic, Dosage, Frequency, Duration, Instructions',
      'Recommended laboratory investigations and diagnostic tests',
      'Formatted print/PDF generation with clinic header and doctor signature area',
    ],
    workflowSummary:
      'Doctor reviews patient history -> Inputs diagnosis -> Selects medicines and tests from formulary -> Prints branded prescription.',
  },
  {
    id: 'billing',
    slug: 'billing',
    title: 'Patient Billing & Invoicing',
    category: 'Financial',
    iconName: 'Receipt',
    badge: 'Cashier / Billing',
    shortDescription:
      'Itemized invoice generation for doctor consultation fees, diagnostic procedures, treatments, discounts, and taxes.',
    longDescription:
      'MedPulse provides a robust patient invoicing system. Automatically pull doctor consultation fees, add custom clinic charges or medical consumables, apply authorized discounts, calculate subtotal and balance due, and issue professional receipts.',
    benefits: [
      'Transparent itemized invoices with clear fee breakdown.',
      'Automated pull of standard doctor consultation rates saves cashier time.',
      'Tracks total bill amount, payments made, and remaining balance due.',
      'Supports print-ready receipts with clinic branding and tax breakdown.',
    ],
    capabilities: [
      'Itemized line items with quantities, unit rates, and row totals',
      'Authorized discount application with percentage or fixed reduction',
      'Automatic sync with patient ledger to track outstanding dues',
      'Multiple payment status tracking: Paid, Partial, Unpaid',
    ],
    workflowSummary:
      'Consultation completes -> Front desk opens bill -> Doctor fee auto-populates -> Any extra services added -> Invoice generated.',
  },
  {
    id: 'payments',
    slug: 'payments',
    title: 'Payment Collection',
    category: 'Financial',
    iconName: 'CreditCard',
    badge: 'Collections',
    shortDescription:
      'Record full or partial payments, track payment methods (Cash, Card, Bank Transfer), and generate receipts.',
    longDescription:
      'Ensure every rupee or dollar received at the clinic is accurately accounted for. Record payments against specific patient bills, select payment mode, specify target cash or bank accounts, and maintain an audit-friendly payment journal.',
    benefits: [
      'Supports partial payments and deposit collection for ongoing treatments.',
      'Assigns received funds to specific Cash or Bank ledger accounts.',
      'Generates instant printable payment receipts with transaction reference.',
      'Updates patient outstanding balance automatically in real time.',
    ],
    capabilities: [
      'Payment allocation against specific invoice numbers',
      'Multi-method support: Cash, Credit/Debit Card, Online Transfer, Cheque',
      'Direct deposit into configured Cash in Hand or Bank accounts',
      'Real-time update to clinic daily collection summaries',
    ],
    workflowSummary:
      'Patient pays at counter -> Cashier records payment amount and method -> System issues receipt and reduces outstanding balance.',
  },
  {
    id: 'accounts',
    slug: 'accounts',
    title: 'Cash & Bank Accounts',
    category: 'Financial',
    iconName: 'Landmark',
    badge: 'Ledger Management',
    shortDescription:
      'Monitor clinic liquidity across Cash in Hand, petty cash registers, and commercial bank accounts in real time.',
    longDescription:
      'Keep tight control over clinic liquid funds. Maintain dedicated accounts for the front-desk cash drawer, petty cash fund, and main operating bank accounts. Every patient collection and clinic expense updates account balances accurately.',
    benefits: [
      'Separation between front-desk cash register and primary business bank accounts.',
      'Audit trail of all inward collections and outward expense disbursements.',
      'Real-time account balance visibility prevents cash handling discrepancies.',
      'Enables daily cash drawer reconciliation at the close of every shift.',
    ],
    capabilities: [
      'Configurable accounts: Main Cash Register, Petty Cash, Commercial Bank accounts',
      'Automated balance updates from payment receipts and expense vouchers',
      'Account statement view showing chronological credit and debit entries',
      'Account status toggling (Active/Inactive) for seasonal accounts',
    ],
    workflowSummary:
      'Payments deposit to selected accounts -> Expenses deduct from specified accounts -> Account balances update in real time.',
  },
  {
    id: 'expenses',
    slug: 'expenses',
    title: 'Expense Management',
    category: 'Financial',
    iconName: 'TrendingDown',
    badge: 'Cost Tracking',
    shortDescription:
      'Record daily clinic operational expenses, medical supplies, utility bills, maintenance, and staff petty cash.',
    longDescription:
      'Control overhead costs and operational expenditures. Clinic administrators can log expenses with descriptive notes, assign them to expense categories, record vendor names, and deduct the payout directly from the appropriate cash or bank account.',
    benefits: [
      'Complete visibility into where clinic revenues are being spent.',
      'Category-level breakdown helps identify cost-saving opportunities.',
      'Voucher numbering and receipt notes provide accountability.',
      'Immediate deduction from selected cash or bank account keeps balances true.',
    ],
    capabilities: [
      'Categorized expense entry: Utilities, Medical Supplies, Cleaning, Maintenance, etc.',
      'Voucher date, payee/vendor, payment method, and description notes',
      'Direct link to paying account (e.g. Cash in Hand or Petty Cash)',
      'Daily and monthly expense total rollups for executive review',
    ],
    workflowSummary:
      'Staff incurs clinic expense -> Enters voucher with payee & category -> Payout deducted from petty cash -> Recorded in daily logs.',
  },
  {
    id: 'chart-of-accounts',
    slug: 'chart-of-accounts',
    title: 'Financial Categories',
    category: 'Financial',
    iconName: 'Layers',
    badge: 'Classification',
    shortDescription:
      'Organize financial transactions with standardized income categories and operational expense classifications.',
    longDescription:
      'Standardize clinic bookkeeping with a structured chart of expense and revenue categories. Maintain clean distinctions between Consultation Fees, Diagnostic Income, Medical Supplies, Utilities, Rent, and Staff Salaries.',
    benefits: [
      'Uniform reporting across all administrative staff and clinic branches.',
      'Enables granular financial analysis by service line or overhead type.',
      'Customizable category trees accommodate specialty clinic needs.',
      'Prevents misclassified transactions during daily entries.',
    ],
    capabilities: [
      'Standard expense and income category libraries',
      'Code and descriptive tagging for easy search',
      'Active/Inactive status flags to retire outdated classifications',
      'Pre-populated with healthcare industry best-practice categories',
    ],
    workflowSummary:
      'Configure clinic expense categories once -> Cashiers and accountants select valid categories when entering transactions.',
  },
  {
    id: 'users',
    slug: 'users',
    title: 'Clinic Staff & User Roles',
    category: 'Administrative',
    iconName: 'ShieldCheck',
    badge: 'Security & Access',
    shortDescription:
      'Role-based access control for Clinic Owners, Doctors, Receptionists, Cashiers, and Administrative staff.',
    longDescription:
      'Ensure staff members access only the modules relevant to their duties. Define permissions across roles: Doctors access patient clinical records and prescriptions, Receptionists manage appointments, Cashiers manage billing, and Owners view full reports.',
    benefits: [
      'Protects patient confidentiality and sensitive financial data.',
      'Reduces front-desk mistakes by hiding irrelevant configuration menus.',
      'Pre-configured role profiles: Doctor, Receptionist, Cashier, Admin, Owner.',
      'Easily onboard new medical assistants and reception team members.',
    ],
    capabilities: [
      'Role definition with granular module permissions',
      'User profiles with email, role designation, and status',
      'Fast simulated role switching to test staff workflows during evaluation',
      'Clear audit attribution for transactions and clinical notes',
    ],
    workflowSummary:
      'Assign staff member to a role -> System displays only permitted navigation tabs and action buttons.',
  },
  {
    id: 'dashboard',
    slug: 'dashboard',
    title: 'Dashboard & Reporting',
    category: 'Operations',
    iconName: 'LayoutDashboard',
    badge: 'Executive Oversight',
    shortDescription:
      'Real-time executive dashboard summarizing today’s patient visits, queue status, billing, collections, and expenses.',
    longDescription:
      'Get an instantaneous pulse on your clinic from the moment you open the application. Monitor today’s scheduled appointments, waiting room counts, completed consultations, daily billing, cash collections, and total expenses in a clean, visual command center.',
    benefits: [
      'High-level operational overview requires no manual spreadsheet tallying.',
      'Quick glance at waiting room occupancy helps manage patient flow.',
      'Immediate reconciliation of billing vs. collected amounts prevents end-of-day shortfalls.',
      'Instant access to detailed operational and financial sub-reports.',
    ],
    capabilities: [
      'Real-time KPI metrics: Appointments, Waiting Patients, Completed Visits, Total Patients',
      'Daily Financial Summary: Today’s Billed, Collected, and Incurred Expenses',
      'Interactive appointment list with live status indicators and quick action shortcuts',
      'Recent financial transactions feed showing live payment and expense flow',
    ],
    workflowSummary:
      'Open MedPulse -> Dashboard shows live clinic metrics -> Spot bottlenecks or pending balances at a single glance.',
  },
  {
    id: 'website-cms',
    slug: 'website-cms',
    title: 'Clinic Website CMS',
    category: 'Operations',
    iconName: 'Globe',
    badge: 'Optional Add-on',
    shortDescription:
      'Integrated content management tool to manage the clinic’s public patient website, doctor profiles, and services.',
    longDescription:
      'For practices that need a public patient-facing website, MedPulse includes a built-in Website CMS. Clinic managers can customize clinic information, consulting physician biographies, outpatient services, patient testimonials, FAQs, and appointment contact details.',
    benefits: [
      'Update clinic operating hours, phone numbers, and address without hiring web developers.',
      'Showcase consulting doctor profiles and specializations to prospective patients.',
      'Manage published healthcare service descriptions and diagnostic test menus.',
      'Live responsive preview tool (Desktop, Tablet, Mobile) before publishing.',
    ],
    capabilities: [
      'Clinic branding settings: Logo, tagline, contact information, social links',
      'Doctor public profiles sync directly with clinic doctor roster',
      'Services and treatments manager with descriptions and badge tags',
      'Interactive multi-device preview simulator built directly into the ERP',
    ],
    workflowSummary:
      'Edit clinic services or doctor bio in CMS -> Instant live preview in simulated browser -> Keep patient website up-to-date.',
  },
];

// ============================================================================
// HOW IT WORKS: CORE CLINIC WORKFLOW (Section 4)
// ============================================================================
export const clinicWorkflowSteps = [
  {
    step: 1,
    title: 'Register Patient',
    role: 'Receptionist',
    iconName: 'UserPlus',
    shortDescription:
      'Capture patient demographics, contact details, and emergency contacts. The system issues a unique Medical Record Number (MRN).',
    detail:
      'Takes under 30 seconds at the front desk. Patient profile is instantly created and ready for immediate or future bookings.',
  },
  {
    step: 2,
    title: 'Schedule Appointment',
    role: 'Front Desk',
    iconName: 'CalendarPlus',
    shortDescription:
      'Select the consulting doctor, date, and time slot. System assigns a queue token and marks the patient as scheduled.',
    detail:
      'When the patient arrives, the receptionist clicks "Check In" to update status to "Waiting", alerting the doctor’s room.',
  },
  {
    step: 3,
    title: 'Conduct Consultation',
    role: 'Consultant Doctor',
    iconName: 'Stethoscope',
    shortDescription:
      'The physician reviews past visit history, checks vitals and notes, and updates the appointment status to "In-Consultation".',
    detail:
      'Full longitudinal history ensures continuity of care, even when seeing multiple clinic specialists over time.',
  },
  {
    step: 4,
    title: 'Create Prescription',
    role: 'Doctor',
    iconName: 'FileText',
    shortDescription:
      'The doctor types diagnosis, selects prescribed medicines from the formulary with precise dosages, and adds diagnostic test orders.',
    detail:
      'Prints a clear clinic-branded prescription slip and saves the digital record permanently in the patient’s profile.',
  },
  {
    step: 5,
    title: 'Generate Bill',
    role: 'Cashier / Billing',
    iconName: 'Receipt',
    shortDescription:
      'Consultation fee is automatically applied. Front desk adds any additional procedure charges or discounts and finalizes the invoice.',
    detail:
      'Transparent itemized bill is presented to the patient with total fee, any applied discounts, and net payable amount.',
  },
  {
    step: 6,
    title: 'Record Payment',
    role: 'Cashier',
    iconName: 'CreditCard',
    shortDescription:
      'Cashier logs the received payment via Cash, Card, or Bank Transfer. System issues a receipt and credits the designated account.',
    detail:
      'The patient ledger updates instantly, remaining balance resets to zero, and the daily collection counter increases.',
  },
];

// ============================================================================
// EDITORIAL PRODUCT SHOWCASES (Section 5)
// ============================================================================
export const productShowcases = [
  {
    id: 'showcase-patients',
    tag: 'Patient Records',
    title: 'Unified Patient Profiles That Keep Every History Intact',
    headline: 'Eliminate missing paper folders with comprehensive digital patient profiles.',
    description:
      'MedPulse consolidates every patient interaction into a clean, searchable electronic card. From personal demographics and contact details to past consultation notes, active prescriptions, and billing balances, staff have everything at their fingertips in seconds.',
    bullets: [
      'Instant search across thousands of records by name, phone number, or MRN.',
      'Chronological visit timeline linking past appointments to prescriptions and bills.',
      'Active financial balance tracker clearly showing unbilled or pending amounts.',
      'One-click shortcuts to book appointments, create bills, or issue prescriptions.',
    ],
    mockupType: 'patient-profile',
    mockupData: {
      name: 'Sarah Jenkins',
      mrn: 'MED-2026-0842',
      phone: '+1 (555) 234-8901',
      ageGender: '34 Yrs / Female',
      bloodGroup: 'B Positive',
      lastVisit: 'Today, 10:15 AM',
      consultant: 'Dr. Sarah Mitchell (Cardiology)',
      status: 'Active',
      outstandingBalance: '$0.00',
      totalVisits: 6,
      recentPrescription: 'Lisinopril 10mg — 1 tab OD after breakfast (30 days)',
    },
  },
  {
    id: 'showcase-appointments',
    tag: 'Front Desk Queue',
    title: 'Intelligent Appointment Scheduling & Live Queue Management',
    headline: 'Keep your waiting room calm, organized, and running on time.',
    description:
      'Replace messy paper registers with a coordinated scheduling calendar. Front-desk staff can see doctor availability at a glance, assign sequential token numbers, and advance patient statuses through the consultation journey with zero confusion.',
    bullets: [
      'Visual status indicators: Scheduled, Waiting, In-Consultation, Completed, Cancelled.',
      'Doctor-specific queue filtering so each physician sees their exact patient list.',
      'Automated token numbering provides a fair, predictable patient experience.',
      'Quick check-in action alerts physicians that the patient is in the waiting room.',
    ],
    mockupType: 'appointment-queue',
    mockupData: {
      date: 'Today, Oct 24, 2026',
      totalScheduled: 18,
      waitingCount: 4,
      inConsultation: 2,
      completedCount: 12,
      queue: [
        {
          token: '#01',
          patient: 'Sarah Jenkins',
          doctor: 'Dr. Sarah Mitchell',
          time: '09:00 AM',
          status: 'Completed',
        },
        {
          token: '#02',
          patient: 'Robert Chen',
          doctor: 'Dr. Sarah Mitchell',
          time: '09:30 AM',
          status: 'Completed',
        },
        {
          token: '#03',
          patient: 'Emily Watson',
          doctor: 'Dr. James Wilson',
          time: '10:00 AM',
          status: 'In-Consultation',
        },
        {
          token: '#04',
          patient: 'Michael Vance',
          doctor: 'Dr. Sarah Mitchell',
          time: '10:30 AM',
          status: 'Waiting',
        },
        {
          token: '#05',
          patient: 'Amina Al-Mansoor',
          doctor: 'Dr. Elena Rostova',
          time: '11:00 AM',
          status: 'Waiting',
        },
      ],
    },
  },
  {
    id: 'showcase-prescriptions',
    tag: 'Clinical Prescription Tool',
    title: 'Legible, Standardized Digital Prescriptions in Seconds',
    headline: 'Protect patient safety with structured electronic prescriptions.',
    description:
      'Physicians can write clear, mistake-free prescriptions using the built-in medicine formulary. Select medications, dosage, frequency, and food instructions, add recommended diagnostic tests, and print professional clinic-branded Rx sheets.',
    bullets: [
      'Master formulary lookup for branded and generic pharmaceutical compounds.',
      'Standardized dosage instruction templates (e.g. 1 Tablet Twice Daily After Meals).',
      'Diagnostic test ordering with direct instructions for lab investigations.',
      'Print-ready Rx layout formatted with doctor credentials and clinic header.',
    ],
    mockupType: 'prescription-writer',
    mockupData: {
      rxId: 'RX-2026-00389',
      patient: 'Robert Chen (48Y / M)',
      doctor: 'Dr. Sarah Mitchell — Consultant Cardiologist',
      diagnosis: 'Essential Hypertension (Stage 1), Mild Hyperlipidemia',
      vitals: 'BP: 138/88 mmHg | Pulse: 74 bpm | Weight: 78 kg',
      medicines: [
        {
          name: 'Amlodipine Besylate 5mg',
          type: 'Tablet',
          dosage: '1 Tab',
          frequency: 'Once Daily (OD)',
          timing: 'Morning After Breakfast',
          duration: '30 Days',
        },
        {
          name: 'Atorvastatin 20mg',
          type: 'Tablet',
          dosage: '1 Tab',
          frequency: 'Once at Night (HS)',
          timing: 'Before Bedtime',
          duration: '30 Days',
        },
      ],
      investigations: ['Fasting Lipid Profile', 'Serum Creatinine & Electrolytes'],
      followUp: 'Return in 4 weeks for BP review and lab results.',
    },
  },
  {
    id: 'showcase-billing',
    tag: 'Billing & Payments',
    title: 'Transparent Invoicing with Automated Balance Tracking',
    headline: 'Prevent billing leaks and clarify patient fees with itemized receipts.',
    description:
      'Manage financial transactions with complete transparency. Standard consultation fees are pulled automatically, additional clinical services or supplies can be itemized, and payments can be logged in full or installments with immediate ledger updates.',
    bullets: [
      'Automated consultation fee calculation based on doctor profile configuration.',
      'Support for multiple payment methods: Cash, Credit/Debit Card, and Bank Transfer.',
      'Tracks partial payments, outstanding balances, and customer advance deposits.',
      'Prints branded patient receipts with clear breakdown of fees and discounts.',
    ],
    mockupType: 'billing-invoice',
    mockupData: {
      invoiceNo: 'INV-2026-00412',
      date: 'Oct 24, 2026',
      patient: 'Emily Watson',
      mrn: 'MED-2026-0791',
      items: [
        { desc: 'Consultation Fee — Dr. James Wilson', qty: 1, rate: 80.0, total: 80.0 },
        { desc: 'Diagnostic ECG Procedure', qty: 1, rate: 45.0, total: 45.0 },
        { desc: 'Blood Sugar Fasting Strip', qty: 1, rate: 10.0, total: 10.0 },
      ],
      subtotal: 135.0,
      discount: 10.0,
      total: 125.0,
      amountPaid: 125.0,
      balanceDue: 0.0,
      paymentMethod: 'Credit Card (Visa ending in 4092)',
      status: 'Paid',
    },
  },
  {
    id: 'showcase-financial',
    tag: 'Clinic Treasury & Accounts',
    title: 'Clear Cash & Bank Ledgers with Expense Accountability',
    headline: 'Know your exact cash in hand and clinic expense run-rate every day.',
    description:
      'MedPulse connects front-desk receipts directly to designated Cash in Hand or Bank accounts, while tracking operational expense disbursements by category. Clinic owners can reconcile the physical cash drawer in minutes at shift end.',
    bullets: [
      'Dedicated accounts for Front-Desk Cash, Petty Cash, and Operating Bank Accounts.',
      'Categorized expense vouchers for clinic supplies, utilities, staff perks, and maintenance.',
      'Real-time account balance updates with every payment collected and expense paid.',
      'Chronological activity log prevents unaccounted petty cash leakages.',
    ],
    mockupType: 'financial-ledger',
    mockupData: {
      cashInHand: '$3,840.00',
      pettyCashDrawer: '$450.00',
      operatingBank: '$28,450.00',
      todayCollections: '$1,860.00',
      todayExpenses: '$240.00',
      netDailyFlow: '+$1,620.00',
      recentExpenses: [
        {
          desc: 'Clinic Disposable Gloves & Syringes',
          cat: 'Medical Supplies',
          acc: 'Petty Cash',
          amt: '$85.00',
        },
        {
          desc: 'Reception Waiting Room Water Dispenser',
          cat: 'Clinic Amenities',
          acc: 'Cash in Hand',
          amt: '$35.00',
        },
        {
          desc: 'High-Speed Broadband Internet Bill',
          cat: 'Utilities',
          acc: 'Operating Bank',
          amt: '$120.00',
        },
      ],
    },
  },
];

// ============================================================================
// BENEFITS BY ROLE (Section 6)
// ============================================================================
export const roleBenefits = [
  {
    id: 'owners',
    role: 'Clinic Owners & Practice Managers',
    badge: 'Executive Oversight',
    iconName: 'Building2',
    tagline: 'Get total operational and financial clarity across your practice.',
    summary:
      'Clinic owners need a bird’s-eye view of patient traffic, daily revenue collections, outstanding balances, and operational costs without having to manually inspect logbooks.',
    keyBenefits: [
      'Real-time executive dashboard summarizing daily appointments, revenue, and expenses.',
      'Verify front-desk cash collections against recorded invoices to eliminate discrepancies.',
      'Track doctor patient volumes and consulting revenue contribution.',
      'Categorized expense tracking prevents runaway clinic overheads.',
    ],
    highlightFeature: 'Consolidated Daily Summary Report & Multi-Account Visibility',
  },
  {
    id: 'receptionists',
    role: 'Receptionists & Front-Desk Staff',
    badge: 'Front Desk Flow',
    iconName: 'UserCheck',
    tagline: 'Register patients and manage waiting room queues in seconds.',
    summary:
      'Front-desk staff handle fast-paced patient arrivals. MedPulse provides lightning-fast search, streamlined appointment booking, and instant queue status toggles.',
    keyBenefits: [
      'Register new patients with automated Medical Record Numbers in under 30 seconds.',
      'Instant search by patient name, mobile number, or MRN avoids duplicate records.',
      'Visual queue management: mark patients as "Waiting" to alert doctors immediately.',
      'Generate clear consultation bills and print receipts with two clicks.',
    ],
    highlightFeature: 'Fast Patient Search & One-Click Status Advancements',
  },
  {
    id: 'doctors',
    role: 'Consultant Doctors & Physicians',
    badge: 'Clinical Efficiency',
    iconName: 'Stethoscope',
    tagline: 'Focus on patient care with fast digital prescribing and visit histories.',
    summary:
      'Physicians want an unencumbered tool that lets them see waiting patients, inspect past visit notes, and write legible digital prescriptions without unnecessary administrative friction.',
    keyBenefits: [
      'Dedicated appointment queue showing only patients scheduled for their consultation.',
      'Review previous visit notes, diagnoses, and past medications in one scroll.',
      'Formulary-backed prescription writer with standard dosage frequencies and instructions.',
      'Order recommended laboratory investigations and specify follow-up consultation dates.',
    ],
    highlightFeature: 'Standardized Rx Writer with Clean Printable Clinic Slips',
  },
  {
    id: 'accountants',
    role: 'Accountants & Clinic Administrators',
    badge: 'Financial Control',
    iconName: 'Coins',
    tagline: 'Maintain clean, auditable billing, payment, and expense records.',
    summary:
      'Financial teams need structured transaction logs, accurate cash/bank ledgers, and reliable tracking of partial payments and outstanding balances.',
    keyBenefits: [
      'Itemized billing with automated rate lookup for standard consultation fees.',
      'Allocate collected payments to specific Cash in Hand or Bank accounts.',
      'Log clinic expense vouchers with payee notes, dates, and category classifications.',
      'Review outstanding patient balances to facilitate timely collection follow-ups.',
    ],
    highlightFeature: 'Cash/Bank Account Reconciliation & Expense Categorization',
  },
];

// ============================================================================
// FINANCIAL VISIBILITY METRICS & HIGHLIGHTS (Section 7)
// ============================================================================
export const financialHighlights = {
  heading: 'Structured Financial Management for Healthcare Practices',
  subheading:
    'Organize patient billing, payment collection, cash accounts, and daily expenses in one transparent system.',
  disclaimer:
    'MedPulse organizes internal clinic transaction records and ledger balances for operational oversight. It does not provide automated bank feed synchronization or certified government tax filing.',
  metrics: [
    { label: "Today's Billing", value: '$2,480.00', change: '18 Invoices Generated', type: 'positive' },
    { label: "Today's Collection", value: '$2,150.00', change: '86.7% Realization Rate', type: 'positive' },
    { label: 'Outstanding Balances', value: '$330.00', change: '3 Partial Invoices', type: 'neutral' },
    { label: "Today's Expenses", value: '$310.00', change: '4 Vouchers Recorded', type: 'expense' },
  ],
  capabilities: [
    {
      title: 'Itemized Invoicing',
      desc: 'Clear line items for doctor consultations, diagnostic tests, procedures, and medical consumables.',
    },
    {
      title: 'Multi-Mode Collection',
      desc: 'Record cash payments, credit/debit card transactions, and direct online bank transfers.',
    },
    {
      title: 'Cash Drawer Reconciliation',
      desc: 'Track physical cash in the front-desk drawer separately from commercial operating bank accounts.',
    },
    {
      title: 'Auditable Expense Logging',
      desc: 'Categorize operational expenditures with voucher numbers, payee details, and paying account.',
    },
  ],
};

// ============================================================================
// REPORTING & DASHBOARD (Section 8)
// ============================================================================
export const reportingMetrics = {
  heading: 'Consolidated Executive Dashboard for Daily Operations',
  subheading:
    'Start every morning with an instant overview of patient visits, queue occupancy, consultation progress, and financial flow.',
  kpis: [
    { id: 'today-appointments', label: "Today's Appointments", value: '24', icon: 'Calendar', helper: 'Scheduled for today' },
    { id: 'waiting-patients', label: 'Waiting in Clinic', value: '5', icon: 'Clock', helper: 'Checked-in, awaiting doctor' },
    { id: 'completed-visits', label: 'Completed Consultations', value: '14', icon: 'CheckCircle2', helper: 'Consultation & Rx done' },
    { id: 'total-patients', label: 'Total Registered Patients', value: '1,280', icon: 'Users', helper: 'All-time active records' },
    { id: 'today-billing', label: "Today's Billing", value: '$2,480.00', icon: 'Receipt', helper: 'Gross services billed' },
    { id: 'today-collection', label: "Today's Collections", value: '$2,150.00', icon: 'CreditCard', helper: 'Cash & card collected' },
    { id: 'today-expenses', label: "Today's Expenses", value: '$310.00', icon: 'TrendingDown', helper: 'Operational disbursements' },
  ],
};

// ============================================================================
// SECURITY, ARCHITECTURE & DATA HANDLING (Section 9)
// ============================================================================
export const securityAndArchitecture = {
  heading: 'Transparent Architecture & Data Handling',
  subheading:
    'An honest explanation of how MedPulse operates, current evaluation architecture, and production readiness.',
  coreFacts: [
    {
      title: 'Local Browser Evaluation Sandbox',
      status: 'Active in Current Build',
      iconName: 'ShieldAlert',
      description:
        'In this live demonstration version, MedPulse operates entirely client-side using your browser’s LocalStorage. All data entered during your test tour remains private on your computer.',
    },
    {
      title: 'Zero Remote Data Transmission',
      status: 'Privacy Preserved',
      iconName: 'Lock',
      description:
        'Because this build operates without an external server or telemetry pipeline, no patient information, doctor notes, or billing amounts are ever transmitted across the internet to third parties.',
    },
    {
      title: 'Demonstration & Evaluation Prototype',
      status: 'Important Notice',
      iconName: 'Info',
      description:
        'This frontend prototype is engineered for feature evaluation and workflow demonstration. It is NOT intended as a production-certified medical record repository for storing real patient health data.',
    },
    {
      title: 'Production Backend Deployment Roadmap',
      status: 'Enterprise Deployment',
      iconName: 'Server',
      description:
        'For live clinic deployment, MedPulse integrates with a dedicated backend (Node.js/PostgreSQL), secure server-side role authentication, encrypted cloud/on-premise storage, and automated backups.',
    },
  ],
  verifiedNotice:
    'We believe in honest software presentation. We do not claim server-side HIPAA certification, cloud database replication, or real-time banking API sync for this client-side demonstration build.',
};

// ============================================================================
// FREQUENTLY ASKED QUESTIONS (Section 10)
// ============================================================================
export const frequentlyAskedQuestions = [
  {
    question: 'What is MedPulse Clinic ERP?',
    answer:
      'MedPulse Clinic ERP is a dedicated clinic management software platform built to help outpatient practices, private clinics, and specialist centers organize patient records, doctor scheduling, digital prescriptions, billing, payment collections, clinic expenses, and daily operations in one unified workspace.',
    category: 'General',
  },
  {
    question: 'Which clinic operations can it manage?',
    answer:
      'MedPulse covers the complete outpatient patient journey: patient registration (MRN creation), doctor availability management, appointment booking with queue status, prescription writing with medicine formulary, itemized invoicing, payment recording across cash and bank accounts, clinic operational expense vouchers, chart of accounts, and real-time executive dashboard reporting.',
    category: 'Features',
  },
  {
    question: 'Can I manage patient appointments and queues?',
    answer:
      'Yes. Front-desk staff can schedule appointments for specific doctors and dates, assign queue token numbers, and advance patient statuses through a live lifecycle: Scheduled, Waiting, In-Consultation, Completed, or Cancelled.',
    category: 'Features',
  },
  {
    question: 'Does it support digital prescriptions?',
    answer:
      'Yes. Physicians can create structured electronic prescriptions with clinical notes, provisional diagnoses, medications with dosage/frequency/instructions selected from the clinic formulary, diagnostic test recommendations, and print formatted clinic-branded prescription slips.',
    category: 'Features',
  },
  {
    question: 'Can I record patient payments and track balances?',
    answer:
      'Yes. Invoices can be generated with itemized consultation fees, procedures, and authorized discounts. Cashiers can record full or partial payments via Cash, Card, or Bank Transfer. The patient ledger tracks outstanding balances automatically.',
    category: 'Financial',
  },
  {
    question: 'Can I track clinic expenses and petty cash?',
    answer:
      'Yes. MedPulse includes dedicated expense tracking. Administrators can record daily clinic expenses by category (e.g. Medical Supplies, Utilities, Maintenance), note the payee and voucher description, and deduct the payout directly from Cash in Hand, Petty Cash, or Bank accounts.',
    category: 'Financial',
  },
  {
    question: 'Is the system suitable for small clinics and solo practices?',
    answer:
      'Yes. MedPulse is specifically optimized for small-to-medium healthcare practices, solo general practitioners, and multi-specialist polyclinics that want structured management without the complexity or high maintenance costs of bloated hospital ERP systems.',
    category: 'General',
  },
  {
    question: 'Can I request a personalized product demonstration?',
    answer:
      'Yes! You can submit a demonstration request using our online form with your clinic name and requirements. You can also explore the fully interactive live prototype right in your browser immediately by clicking "Sign In / Open ERP".',
    category: 'Sales',
  },
  {
    question: 'Does the current version require a backend server or database?',
    answer:
      'The current public demonstration build operates entirely in your browser using React and LocalStorage for state persistence. It requires zero server setup, database configuration, or external API keys to evaluate.',
    category: 'Technical',
  },
  {
    question: 'How can the software be deployed for real clinic use?',
    answer:
      'For live clinical practice deployment, MedPulse is delivered as a turnkey package connected to a secure backend API with relational database persistence (PostgreSQL/MySQL), role-based user authentication, automated encrypted backups, and custom print templates configured for your clinic’s letterhead.',
    category: 'Technical',
  },
];

// ============================================================================
// PRICING FRAMEWORK (Section 9)
// ============================================================================
export const pricingFramework = {
  disclaimer:
    'Pricing is tailored to clinic size, number of active consulting doctors, and deployment requirements (Cloud vs. On-Premise). The tiers below demonstrate illustrative feature packages and do not represent a rigid commercial checkout.',
  tiers: [
    {
      id: 'solo-practice',
      name: 'Solo Practice',
      tagline: 'Ideal for independent practitioners & single-doctor outpatient clinics.',
      doctorScope: '1 Consultant Physician',
      illustrativeIndicator: 'Starting tier for single doctors',
      features: [
        'Patient Management & Electronic Record History',
        'Appointment Booking with Queue Token Generation',
        'Digital Prescription Writer with Medicine Formulary',
        'Consultation Billing & Payment Receipts',
        'Cash in Hand & Daily Collection Tracking',
        'Single Receptionist & Doctor User Accounts',
        'Local Data Backup & Export',
      ],
      notIncluded: ['Multi-Doctor Shift Scheduling', 'Clinic Website CMS Add-on', 'Custom Chart of Accounts'],
      ctaText: 'Request Solo Quote',
      recommended: false,
    },
    {
      id: 'multispecialty-clinic',
      name: 'Professional Clinic',
      tagline: 'Best for growing polyclinics and multi-specialist healthcare practices.',
      doctorScope: 'Up to 10 Consultant Doctors',
      illustrativeIndicator: 'Most Popular Clinic Configuration',
      features: [
        'Everything in Solo Practice, plus:',
        'Multi-Doctor Roster & Department Specializations',
        'Consulting Queue Filter by Individual Doctor',
        'Comprehensive Patient Invoicing with Diagnostic Procedures',
        'Cash & Commercial Bank Account Ledgers',
        'Categorized Expense Voucher Management',
        'Daily Executive Activity & Financial Summary Reports',
        'Role-Based Staff Access (Doctor, Cashier, Reception, Admin)',
        'Clinic Website CMS Module Included',
      ],
      notIncluded: ['Custom Multi-Branch Database Replication'],
      ctaText: 'Request Clinic Demo & Quote',
      recommended: true,
    },
    {
      id: 'practice-network',
      name: 'Practice Network / Enterprise',
      tagline: 'For large medical centers, diagnostic polyclinics, and healthcare groups.',
      doctorScope: 'Unlimited Doctors & Multi-Room OPD',
      illustrativeIndicator: 'Custom Turnkey Deployment',
      features: [
        'Everything in Professional Clinic, plus:',
        'Unlimited Doctor & Staff User Accounts',
        'Multi-Cashier Shift Handover & Drawer Reconciliation',
        'Custom Chart of Accounts & Financial Categories',
        'Turnkey Dedicated Database Deployment (PostgreSQL)',
        'Custom Clinic Letterhead & Prescription Print Layouts',
        'On-Premise Server or Dedicated Private Cloud Hosting',
        'Staff Onboarding & Priority Technical Support',
      ],
      notIncluded: [],
      ctaText: 'Contact Enterprise Sales',
      recommended: false,
    },
  ],
  featureComparisonMatrix: [
    { feature: 'Electronic Patient Records (MRN)', solo: true, pro: true, enterprise: true },
    { feature: 'Appointment Queue & Token Assignment', solo: true, pro: true, enterprise: true },
    { feature: 'Digital Prescription Generator', solo: true, pro: true, enterprise: true },
    { feature: 'Itemized Patient Invoicing & Receipts', solo: true, pro: true, enterprise: true },
    { feature: 'Cash & Bank Account Tracking', solo: 'Single Cash', pro: 'Multi-Account', enterprise: 'Unlimited Accounts' },
    { feature: 'Categorized Expense Management', solo: 'Basic', pro: 'Full Vouchers', enterprise: 'Advanced Auditing' },
    { feature: 'Doctor Capacity', solo: '1 Doctor', pro: 'Up to 10 Doctors', enterprise: 'Unlimited Doctors' },
    { feature: 'Role-Based Permissions (RBAC)', solo: '2 Profiles', pro: '5 Profiles', enterprise: 'Custom Roles' },
    { feature: 'Executive Dashboard & Financial Reports', solo: 'Standard', pro: 'Comprehensive', enterprise: 'Comprehensive' },
    { feature: 'Clinic Website CMS Integration', solo: false, pro: true, enterprise: true },
    { feature: 'Deployment Mode', solo: 'Turnkey Cloud', pro: 'Cloud or On-Premise', enterprise: 'Custom Dedicated' },
  ],
};

// ============================================================================
// ABOUT & PHILOSOPHY
// ============================================================================
export const aboutMedPulse = {
  mission:
    'To empower outpatient clinics and healthcare providers with software that is genuinely easy to use, clinically reliable, and financially transparent.',
  story:
    'Healthcare professionals spend too much time navigating sluggish, outdated software or struggling with fragmented paper files. MedPulse Clinic ERP was designed around the natural outpatient consultation journey — from patient registration and doctor queue management to prescriptions, itemized billing, and daily cash reconciliation.',
  corePillars: [
    {
      title: 'Built Around Real Outpatient Workflows',
      desc: 'Engineered specifically for outpatient consultation dynamics, not adapted from hospital bed-management monoliths.',
      icon: 'Stethoscope',
    },
    {
      title: 'Financial Integrity & Discrepancy Prevention',
      desc: 'Seamlessly connects front-desk billing with physical cash receipts and categorized expense vouchers.',
      icon: 'ReceiptCheck',
    },
    {
      title: 'Zero Clutter, Maximum Speed',
      desc: 'Clean interfaces designed for high-stress front desks and busy consulting rooms where every second counts.',
      icon: 'Zap',
    },
    {
      title: 'Transparent & Honest Technology',
      desc: 'Clear data ownership, straightforward deployment roadmaps, and truthful software architecture without inflated claims.',
      icon: 'ShieldCheck',
    },
  ],
};
