import React from 'react';
import {
  Users,
  CalendarCheck,
  Receipt,
  Landmark,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Stethoscope,
  CreditCard,
  Lock,
  Zap,
} from 'lucide-react';

export const TrustSection = () => {
  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-200/70 relative overflow-hidden">
      {/* Background subtle light effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-50/50 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* Section Header - Concise & Impactful */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200/70 text-brand-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Why Clinics Choose MedPulse</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Everything Your Clinic Needs, in One Place
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Purpose-built tools designed to replace fragmented paper slips and slow spreadsheets.
          </p>
        </div>

        {/* Visual Bento Grid: 4 Interactive-Style Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Unified Patient Hub */}
          <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200 hover:border-brand-300 hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-xs">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-100 text-brand-800">
                  Patient Records
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                  Unified Patient Profiles
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Search by name, phone, or MRN. Complete medical charts in one click.
                </p>
              </div>

              {/* Visual Mini UI Mockup */}
              <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-2xs space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
                    SJ
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 truncate">Sarah Jenkins</span>
                      <span className="text-[9px] font-mono font-bold text-brand-600 bg-brand-50 px-1 py-0.2 rounded">
                        B+
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 block">MRN: MED-2026-0842</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px]">
                  <span className="text-slate-500">6 Past Visits</span>
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    $0.00 Balance
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>Zero lost paper files</span>
            </div>
          </div>

          {/* Card 2: Live Appointment Queue */}
          <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200 hover:border-emerald-300 hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Live Queue
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  OPD Queue Tracking
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Doctor slot management with live status progression from check-in to consultation.
                </p>
              </div>

              {/* Visual Mini UI Mockup */}
              <div className="bg-white rounded-xl p-2.5 border border-slate-200/80 shadow-2xs space-y-1.5 text-xs">
                <div className="flex items-center justify-between p-1.5 rounded-lg bg-amber-50/70 border border-amber-200/60">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-amber-800 text-[10px] bg-amber-100 px-1 py-0.2 rounded">
                      #03
                    </span>
                    <span className="text-[11px] font-bold text-slate-800">Emily W.</span>
                  </div>
                  <span className="text-[9px] font-extrabold text-amber-700 uppercase">Consulting</span>
                </div>

                <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-slate-500 text-[10px] bg-slate-200 px-1 py-0.2 rounded">
                      #04
                    </span>
                    <span className="text-[11px] font-medium text-slate-700">Michael V.</span>
                  </div>
                  <span className="text-[9px] font-bold text-blue-600">Waiting (8m)</span>
                </div>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>Reduced waiting room congestion</span>
            </div>
          </div>

          {/* Card 3: Clearer Billing & Collections */}
          <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200 hover:border-blue-300 hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Receipt className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  Instant POS
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Itemized Patient Invoicing
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Doctor fees pull automatically with instant printable receipts & balance logs.
                </p>
              </div>

              {/* Visual Mini UI Mockup */}
              <div className="bg-white rounded-xl p-2.5 border border-slate-200/80 shadow-2xs space-y-1.5 text-[11px]">
                <div className="flex justify-between text-slate-600">
                  <span>Consultation Fee:</span>
                  <span className="font-mono font-bold text-slate-900">$80.00</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>ECG Procedure:</span>
                  <span className="font-mono font-bold text-slate-900">$45.00</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-100 font-extrabold text-slate-900 text-xs">
                  <span>Net Paid:</span>
                  <span className="font-mono text-emerald-600">$125.00 (Cash)</span>
                </div>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>Zero billing calculation errors</span>
            </div>
          </div>

          {/* Card 4: Better Operational Visibility */}
          <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200 hover:border-indigo-300 hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <Landmark className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                  Cash & Bank
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Daily Cash Reconciliation
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Reconcile physical front-desk drawer cash with bank accounts and expenses.
                </p>
              </div>

              {/* Visual Mini UI Mockup */}
              <div className="bg-white rounded-xl p-2.5 border border-slate-200/80 shadow-2xs space-y-2 text-[11px]">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Cash Drawer</span>
                    <span className="font-mono font-bold text-slate-900">$3,840.00</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-emerald-500 rounded-full" />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px]">
                  <span className="text-slate-500">Operating Bank</span>
                  <span className="font-mono font-bold text-brand-600">$28,450.00</span>
                </div>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>Shift-end cash balanced</span>
            </div>
          </div>
        </div>

        {/* Clean, Modern Trust & Architecture Badges Bar */}
        <div className="pt-2">
          <div className="bg-slate-100/80 rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-wrap items-center justify-around gap-4 text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-600 flex-shrink-0" />
              <span>Client-Side Local Evaluation</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>100% Private Browser Sandbox</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Instant Setup — No Servers Needed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>Designed for Outpatient Practices</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
