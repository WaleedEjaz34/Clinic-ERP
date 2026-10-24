import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Calendar,
  FileText,
  Receipt,
  Landmark,
  ArrowRight,
  CheckCircle2,
  Clock,
  Printer,
  CreditCard,
  TrendingDown,
  Sparkles,
  Stethoscope,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Zap,
} from 'lucide-react';

const SHOWCASE_MODULES = [
  {
    id: 'billing',
    tabName: 'Itemized Billing',
    icon: Receipt,
    badge: 'Billing & POS',
    title: 'Automated Invoicing & Instant Receipts',
    subtitle: 'Auto-fill doctor rates, itemize procedures, apply discounts, and track balances with zero calculation errors.',
    chips: [
      { text: 'Auto-Calculates Consultant Rates', icon: Zap },
      { text: 'Multi-Payment: Cash, Card & Transfer', icon: CreditCard },
      { text: 'Prints Branded Patient Receipts', icon: Printer },
    ],
    metric: 'Real-time ledger updates with zero balance discrepancies',
    erpPath: '/bills',
  },
  {
    id: 'patients',
    tabName: 'Patient Hub',
    icon: Users,
    badge: 'Electronic Records',
    title: 'Unified Patient Profiles & History',
    subtitle: 'Consolidate demographics, medical notes, active prescriptions, and billing balances in one searchable profile.',
    chips: [
      { text: 'Auto-Generated Medical Record Number (MRN)', icon: Sparkles },
      { text: 'Instant Search by Name, Mobile, or MRN', icon: Users },
      { text: 'Chronological Consultation Timeline', icon: Clock },
    ],
    metric: 'Complete visit history & balances visible in 1 second',
    erpPath: '/patients',
  },
  {
    id: 'appointments',
    tabName: 'OPD Queue',
    icon: Calendar,
    badge: 'Front Desk',
    title: 'Live Appointment Queue & Token Tracking',
    subtitle: 'Keep your waiting room organized with sequential token numbers and live check-in status progression.',
    chips: [
      { text: 'Live Status: Waiting → In-Consultation → Done', icon: Clock },
      { text: 'Doctor-Specific Daily Queue Filtering', icon: Stethoscope },
      { text: 'Fair Sequential Token Routing', icon: CheckCircle2 },
    ],
    metric: 'Reduces front-desk check-in friction by 75%',
    erpPath: '/appointments',
  },
  {
    id: 'prescriptions',
    tabName: 'Digital Rx',
    icon: FileText,
    badge: 'Clinical Tool',
    title: 'Legible, Formulary-Backed Prescriptions',
    subtitle: 'Physicians can write clear digital prescriptions with standardized medicine dosages, food instructions, and lab orders.',
    chips: [
      { text: 'Clinic Formulary with Dosage Frequency (OD/BD)', icon: FileText },
      { text: 'Diagnostic Laboratory Test Orders', icon: Stethoscope },
      { text: 'Professional Printable Clinic Rx Format', icon: Printer },
    ],
    metric: 'Eliminates handwriting errors and medication confusion',
    erpPath: '/prescriptions',
  },
  {
    id: 'treasury',
    tabName: 'Cash & Ledgers',
    icon: Landmark,
    badge: 'Treasury',
    title: 'Cash Drawer to Bank Ledger Transparency',
    subtitle: 'Connect front-desk receipts directly to designated cash drawers or bank accounts with categorized expense tracking.',
    chips: [
      { text: 'Separation of Front-Desk & Operating Bank Accounts', icon: Landmark },
      { text: 'Categorized Daily Expense Vouchers', icon: TrendingDown },
      { text: 'Shift-End Cash Drawer Reconciliation', icon: CheckCircle2 },
    ],
    metric: 'End-of-day cash balanced in under 3 minutes',
    erpPath: '/accounts',
  },
];

export const ProductShowcase = () => {
  const [activeTabId, setActiveTabId] = useState('billing');
  const activeModule = SHOWCASE_MODULES.find((m) => m.id === activeTabId) || SHOWCASE_MODULES[0];

  return (
    <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200/70 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-14">
        {/* Section Header - Crisp & Direct */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Platform Studio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            See MedPulse in Action
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Click through core clinic modules to preview the actual interface and key workflows.
          </p>
        </div>

        {/* Interactive Module Selector Tab Bar */}
        <div className="flex items-center justify-center">
          <div className="inline-flex p-1.5 rounded-2xl bg-white border border-slate-200 shadow-sm max-w-full overflow-x-auto scrollbar-none gap-1 sm:gap-1.5">
            {SHOWCASE_MODULES.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = tab.id === activeTabId;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTabId(tab.id)}
                  className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer select-none ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <TabIcon className={`w-4 h-4 ${isActive ? 'text-brand-400' : 'text-slate-500'}`} />
                  <span>{tab.tabName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Studio Card: Left Mockup, Right Concise Copy */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden p-6 sm:p-10 transition-all">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Ultra-Realistic Product Mockup (7 cols) */}
            <div className="lg:col-span-7 relative">
              <div className="bg-slate-900 rounded-2xl p-0.5 shadow-2xl border border-slate-800 overflow-hidden">
                {/* Mockup Titlebar */}
                <div className="px-4 py-2.5 bg-slate-950 flex items-center justify-between text-slate-400 text-xs border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-[11px] font-mono text-slate-300 ml-1">
                      medpulse.app{activeModule.erpPath}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/60 font-mono">
                    LIVE PREVIEW
                  </span>
                </div>

                {/* Dynamic Screen Content Based on Active Module */}
                <div className="p-4 sm:p-5 bg-slate-50 text-slate-800 font-sans">
                  {/* MODULE 1: BILLING & POS */}
                  {activeTabId === 'billing' && (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      {/* Invoice Card */}
                      <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-extrabold text-sm text-slate-900">
                              INV-2026-00412
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              PAID
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500">
                            Emily Watson (MED-2026-0791) • Oct 24, 2026
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition-colors"
                          >
                            <Printer className="w-3.5 h-3.5 text-slate-500" />
                            <span>Print Receipt</span>
                          </button>
                        </div>
                      </div>

                      {/* Line Items Table */}
                      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden divide-y divide-slate-100 text-xs">
                        <div className="px-3 py-1.5 bg-slate-100/70 text-[10px] font-bold uppercase text-slate-500 grid grid-cols-12 gap-2">
                          <span className="col-span-8">Service / Procedure</span>
                          <span className="col-span-2 text-center">Qty</span>
                          <span className="col-span-2 text-right">Amount</span>
                        </div>
                        <div className="p-2.5 grid grid-cols-12 gap-2 items-center">
                          <span className="col-span-8 font-semibold text-slate-800">
                            Consultation Fee — Dr. James Wilson
                          </span>
                          <span className="col-span-2 text-center text-slate-500">1</span>
                          <span className="col-span-2 text-right font-mono font-bold">$80.00</span>
                        </div>
                        <div className="p-2.5 grid grid-cols-12 gap-2 items-center">
                          <span className="col-span-8 font-semibold text-slate-800">
                            Diagnostic ECG Procedure
                          </span>
                          <span className="col-span-2 text-center text-slate-500">1</span>
                          <span className="col-span-2 text-right font-mono font-bold">$45.00</span>
                        </div>
                        <div className="p-2.5 grid grid-cols-12 gap-2 items-center">
                          <span className="col-span-8 font-semibold text-slate-800">
                            Blood Sugar Fasting Strip
                          </span>
                          <span className="col-span-2 text-center text-slate-500">1</span>
                          <span className="col-span-2 text-right font-mono font-bold">$10.00</span>
                        </div>
                      </div>

                      {/* Totals Summary */}
                      <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs text-xs space-y-1.5">
                        <div className="flex justify-between text-slate-500 text-[11px]">
                          <span>Subtotal:</span>
                          <span className="font-mono">$135.00</span>
                        </div>
                        <div className="flex justify-between text-emerald-600 text-[11px] font-medium">
                          <span>Discount Applied (10%):</span>
                          <span className="font-mono">-$10.00</span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-slate-100 text-xs font-black text-slate-900">
                          <span>Net Payable:</span>
                          <span className="font-mono text-emerald-600 text-sm">$125.00</span>
                        </div>
                        <div className="flex justify-between pt-1 text-[10px] text-slate-500">
                          <span>Paid via Credit Card (Visa •••• 4092)</span>
                          <span className="font-bold text-emerald-600">Balance: $0.00</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* MODULE 2: PATIENT HUB */}
                  {activeTabId === 'patients' && (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-brand-600 text-white font-extrabold text-sm flex items-center justify-center">
                            SJ
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-extrabold text-sm text-slate-900">Sarah Jenkins</h4>
                              <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                Active
                              </span>
                            </div>
                            <span className="text-[11px] font-mono text-brand-600 font-bold block">
                              MRN: MED-2026-0842 • 34Y / Female
                            </span>
                          </div>
                        </div>

                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          Balance: $0.00
                        </span>
                      </div>

                      {/* Vital Stats Strip */}
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="p-2 rounded-lg bg-white border border-slate-200">
                          <span className="text-[10px] text-slate-400 block">Blood Group</span>
                          <span className="font-bold text-slate-900">B Positive</span>
                        </div>
                        <div className="p-2 rounded-lg bg-white border border-slate-200">
                          <span className="text-[10px] text-slate-400 block">Blood Pressure</span>
                          <span className="font-bold text-slate-900">120/80 mmHg</span>
                        </div>
                        <div className="p-2 rounded-lg bg-white border border-slate-200">
                          <span className="text-[10px] text-slate-400 block">Total Consultations</span>
                          <span className="font-bold text-brand-600">6 Visits</span>
                        </div>
                      </div>

                      {/* Recent History snippet */}
                      <div className="bg-white rounded-xl p-3 border border-slate-200 space-y-1.5 text-xs">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Most Recent Visit Record
                        </span>
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="font-semibold text-slate-800">
                            Dr. Sarah Mitchell (Cardiology)
                          </span>
                          <span className="text-slate-400">Oct 24, 10:15 AM</span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Prescribed: Lisinopril 10mg — 1 tab OD after breakfast (30 days)
                        </p>
                      </div>
                    </div>
                  )}

                  {/* MODULE 3: OPD QUEUE */}
                  {activeTabId === 'appointments' && (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 bg-white rounded-xl border border-slate-200">
                          <span className="text-[10px] text-slate-400 block">Scheduled Today</span>
                          <span className="text-sm font-black text-slate-900">18 Patients</span>
                        </div>
                        <div className="p-2 bg-amber-50 rounded-xl border border-amber-200">
                          <span className="text-[10px] text-amber-700 block">Waiting Now</span>
                          <span className="text-sm font-black text-amber-700">4 Waiting</span>
                        </div>
                        <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200">
                          <span className="text-[10px] text-emerald-700 block">Completed</span>
                          <span className="text-sm font-black text-emerald-700">12 Done</span>
                        </div>
                      </div>

                      {/* Queue List */}
                      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden text-xs">
                        <div className="p-2.5 flex items-center justify-between bg-amber-50/50">
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded text-[10px]">
                              #03
                            </span>
                            <div>
                              <span className="font-bold text-slate-900 block">Emily Watson</span>
                              <span className="text-[10px] text-slate-500">Dr. Sarah Mitchell • 10:00 AM</span>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                            In-Consultation
                          </span>
                        </div>

                        <div className="p-2.5 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                              #04
                            </span>
                            <div>
                              <span className="font-bold text-slate-900 block">Michael Vance</span>
                              <span className="text-[10px] text-slate-500">Dr. Sarah Mitchell • 10:30 AM</span>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                            Waiting (8m)
                          </span>
                        </div>

                        <div className="p-2.5 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                              #05
                            </span>
                            <div>
                              <span className="font-bold text-slate-900 block">Amina Al-Mansoor</span>
                              <span className="text-[10px] text-slate-500">Dr. Elena Rostova • 11:00 AM</span>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                            Scheduled
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* MODULE 4: DIGITAL RX */}
                  {activeTabId === 'prescriptions' && (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <div className="bg-white rounded-xl p-3 border border-slate-200 flex justify-between items-center text-xs">
                        <div>
                          <div className="font-bold text-slate-900">Dr. Sarah Mitchell — Cardiologist</div>
                          <span className="text-[10px] text-slate-500">
                            Patient: Robert Chen (48Y/M) • Rx #00389
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-brand-50 text-brand-700 font-mono text-[10px] font-bold border border-brand-200">
                          BP: 138/88 mmHg
                        </span>
                      </div>

                      {/* Diagnosis */}
                      <div className="p-2.5 bg-brand-50/70 rounded-xl border border-brand-200 text-xs">
                        <span className="font-bold text-brand-900">Provisional Diagnosis: </span>
                        <span className="text-brand-800">Essential Hypertension (Stage 1)</span>
                      </div>

                      {/* Medicines List */}
                      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden text-xs">
                        <div className="p-2.5 flex justify-between items-center">
                          <div>
                            <span className="font-bold text-slate-900 block">Amlodipine Besylate 5mg</span>
                            <span className="text-[10px] text-slate-500">1 Tab • Once Daily (OD)</span>
                          </div>
                          <span className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                            Morning After Meals
                          </span>
                        </div>

                        <div className="p-2.5 flex justify-between items-center">
                          <div>
                            <span className="font-bold text-slate-900 block">Atorvastatin 20mg</span>
                            <span className="text-[10px] text-slate-500">1 Tab • At Bedtime (HS)</span>
                          </div>
                          <span className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                            Night
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* MODULE 5: CASH & TREASURY */}
                  {activeTabId === 'treasury' && (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs">
                          <span className="text-[10px] text-slate-400 block">Cash Drawer</span>
                          <span className="text-sm font-black text-slate-900 font-mono">$3,840.00</span>
                        </div>
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs">
                          <span className="text-[10px] text-slate-400 block">Petty Cash</span>
                          <span className="text-sm font-black text-slate-900 font-mono">$450.00</span>
                        </div>
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs">
                          <span className="text-[10px] text-slate-400 block">Operating Bank</span>
                          <span className="text-sm font-black text-brand-600 font-mono">$28,450.00</span>
                        </div>
                      </div>

                      {/* Cash Flow Ledger */}
                      <div className="bg-white rounded-xl border border-slate-200 p-3 text-xs space-y-2">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-slate-500">Today's Total Inflow:</span>
                          <span className="font-mono font-bold text-emerald-600">+$1,860.00</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-slate-500">Vouchers Paid:</span>
                          <span className="font-mono font-bold text-rose-600">-$240.00</span>
                        </div>
                        <div className="pt-1 border-t border-slate-100 flex justify-between items-center text-xs font-black">
                          <span>Net Daily Shift Balance:</span>
                          <span className="font-mono text-brand-600">+$1,620.00 (Reconciled)</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Crisp, Punchy, High-Impact Content (5 cols) */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-brand-600 uppercase tracking-wider block">
                  {activeModule.badge}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                  {activeModule.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {activeModule.subtitle}
                </p>
              </div>

              {/* 3 Visual Feature Chips with Icons */}
              <div className="space-y-2.5 pt-1">
                {activeModule.chips.map((chip, idx) => {
                  const ChipIcon = chip.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm font-semibold text-slate-800"
                    >
                      <div className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-brand-600 flex-shrink-0 shadow-2xs">
                        <ChipIcon className="w-3.5 h-3.5" />
                      </div>
                      <span>{chip.text}</span>
                    </div>
                  );
                })}
              </div>

              {/* Stat Metric Pill */}
              <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/80 flex items-center gap-2 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{activeModule.metric}</span>
              </div>

              {/* Action Link to Live ERP Dashboard */}
              <div className="pt-2">
                <Link
                  to={activeModule.erpPath}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 font-bold text-white text-xs sm:text-sm shadow-sm transition-all transform hover:-translate-y-0.5"
                >
                  <span>Test {activeModule.tabName} in Live ERP</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
