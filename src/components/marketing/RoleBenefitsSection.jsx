import React, { useState } from 'react';
import {
  Building2,
  UserCheck,
  Stethoscope,
  Coins,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Zap,
} from 'lucide-react';

const ROLES = [
  {
    id: 'owners',
    name: 'Clinic Owners',
    icon: Building2,
    badge: 'Executive Oversight',
    headline: 'Total Operational & Financial Clarity',
    bullets: [
      'Real-time daily patient traffic & collections summary',
      'Track consulting revenue by individual physician',
      'Daily expense vouchers prevent unaccounted cash leaks',
    ],
    previewType: 'owner-preview',
    erpPath: '/dashboard',
  },
  {
    id: 'receptionists',
    name: 'Receptionists',
    icon: UserCheck,
    badge: 'Front Desk Speed',
    headline: '30-Second Patient Check-In & Token Queue',
    bullets: [
      'Instant MRN lookup by name or mobile number',
      'Visual queue tracker alerts doctor room instantly',
      'Generate consultation bills and receipts in 2 clicks',
    ],
    previewType: 'receptionist-preview',
    erpPath: '/appointments',
  },
  {
    id: 'doctors',
    name: 'Consultant Doctors',
    icon: Stethoscope,
    badge: 'Clinical Flow',
    headline: 'Focused Clinical Prescriptions & History',
    bullets: [
      'Dedicated queue showing only scheduled patients',
      'Longitudinal medical history & past diagnoses in 1 scroll',
      'Formulary medicine picker with standard dosages (OD/BD)',
    ],
    previewType: 'doctor-preview',
    erpPath: '/prescriptions',
  },
  {
    id: 'accountants',
    name: 'Accountants',
    icon: Coins,
    badge: 'Treasury & Audit',
    headline: 'Auditable Invoicing & Cash Drawer Ledgers',
    bullets: [
      'Automated rate pull for standard doctor consultation fees',
      'Track partial payments & outstanding patient balances',
      'Reconcile front-desk cash drawer with bank deposits',
    ],
    previewType: 'accountant-preview',
    erpPath: '/bills',
  },
];

export const RoleBenefitsSection = () => {
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(0);
  const currentRole = ROLES[selectedRoleIndex];
  const RoleIcon = currentRole.icon;

  return (
    <section id="roles" className="py-16 sm:py-24 bg-white border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-14">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Tailored for Every Team Member</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Designed for Every Role in Your Practice
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Healthcare is a collaborative effort. MedPulse gives each team member the exact interface they need.
          </p>
        </div>

        {/* Role Switcher Pill Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {ROLES.map((r, idx) => {
            const TabIcon = r.icon;
            const isSelected = selectedRoleIndex === idx;

            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedRoleIndex(idx)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <TabIcon className={`w-4 h-4 ${isSelected ? 'text-brand-400' : 'text-slate-500'}`} />
                <span>{r.name}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Role Card */}
        <div className="bg-gradient-to-br from-slate-50 to-indigo-50/20 rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Punchy Details & Bullets (6 cols) */}
            <div className="lg:col-span-6 space-y-5 text-left">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center shadow-md shadow-brand-500/20">
                  <RoleIcon className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block">
                    {currentRole.badge}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    {currentRole.name}
                  </h3>
                </div>
              </div>

              <h4 className="text-base sm:text-lg font-bold text-slate-800 leading-snug">
                {currentRole.headline}
              </h4>

              <div className="space-y-2.5 pt-1">
                {currentRole.bullets.map((b, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <a
                  href="/request-demo"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
                >
                  <span>Book Role Walkthrough</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Right: Role Mini UI Mockup (6 cols) */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-xs">
                  <span className="font-extrabold text-slate-800">
                    {currentRole.name} Dedicated View
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    Active Preset
                  </span>
                </div>

                {/* Owner View */}
                {currentRole.previewType === 'owner-preview' && (
                  <div className="space-y-2.5 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] text-slate-500 block">Today's Total Billing</span>
                        <span className="text-base font-black text-slate-900 font-mono">$2,480.00</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                        <span className="text-[10px] text-emerald-800 block">Cash Collected</span>
                        <span className="text-base font-black text-emerald-700 font-mono">$2,150.00</span>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center text-[11px]">
                      <span className="text-slate-600">Active Consulting Physicians:</span>
                      <span className="font-bold text-slate-900">4 Doctors on OPD</span>
                    </div>
                  </div>
                )}

                {/* Receptionist View */}
                {currentRole.previewType === 'receptionist-preview' && (
                  <div className="space-y-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-brand-50 border border-brand-200 flex justify-between items-center">
                      <div>
                        <span className="text-[10px] font-bold text-brand-700 block">NEXT IN QUEUE</span>
                        <span className="font-bold text-brand-950">Token #04 — Michael Vance</span>
                      </div>
                      <button
                        type="button"
                        className="px-2.5 py-1 bg-brand-600 text-white font-bold rounded-lg text-[10px]"
                      >
                        Check In
                      </button>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between text-[11px]">
                      <span className="text-slate-500">Fast MRN Search:</span>
                      <span className="font-mono font-bold text-slate-700">MED-2026-0842 [Matched]</span>
                    </div>
                  </div>
                )}

                {/* Doctor View */}
                {currentRole.previewType === 'doctor-preview' && (
                  <div className="space-y-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-indigo-950 block">Patient: Sarah Jenkins (34Y)</span>
                        <span className="text-[10px] text-indigo-700">Diagnosis: Acute Bronchitis</span>
                      </div>
                      <span className="text-[10px] font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
                        Rx Ready
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-[11px] flex justify-between">
                      <span className="text-slate-600">Amoxicillin 500mg (TDS)</span>
                      <span className="font-mono text-slate-500">5 Days</span>
                    </div>
                  </div>
                )}

                {/* Accountant View */}
                {currentRole.previewType === 'accountant-preview' && (
                  <div className="space-y-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                      <div>
                        <span className="font-mono font-bold text-slate-900 block">Drawer #1 Balance</span>
                        <span className="text-[10px] text-slate-500">Front Desk Physical Cash</span>
                      </div>
                      <span className="text-base font-black text-emerald-600 font-mono">$3,840.00</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-800">
                      <span>Shift Reconciliation:</span>
                      <span>100% Balanced</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
