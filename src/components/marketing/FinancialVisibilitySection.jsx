import React from 'react';
import {
  Receipt,
  CreditCard,
  TrendingDown,
  Landmark,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { financialHighlights } from '../../data/marketingContent';

export const FinancialVisibilitySection = () => {
  return (
    <section id="financial-visibility" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <span>Clinic Treasury & Revenue</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {financialHighlights.heading}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {financialHighlights.subheading}
          </p>
        </div>

        {/* Financial Mockup Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
          {/* Top 4 KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {financialHighlights.metrics.map((m, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2"
              >
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {m.label}
                </div>
                <div
                  className={`text-2xl sm:text-3xl font-extrabold ${
                    m.type === 'expense'
                      ? 'text-rose-600'
                      : m.type === 'positive'
                      ? 'text-slate-900'
                      : 'text-amber-600'
                  }`}
                >
                  {m.value}
                </div>
                <div className="text-xs text-slate-500 font-medium">{m.change}</div>
              </div>
            ))}
          </div>

          {/* Account Breakdown & Ledgers Mockup */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
            {/* Left: Accounts Ledger Snapshot */}
            <div className="lg:col-span-6 bg-slate-900 text-slate-100 rounded-2xl p-6 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-brand-400" />
                  <span className="font-bold text-sm text-white">Configured Cash & Bank Ledgers</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                  BALANCED
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80">
                  <div>
                    <span className="font-bold text-white block">Main Cash Register (Front Desk)</span>
                    <span className="text-[11px] text-slate-400">Drawer #1 • Reconciled daily</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-400 text-sm">$3,840.00</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80">
                  <div>
                    <span className="font-bold text-white block">Petty Cash Drawer</span>
                    <span className="text-[11px] text-slate-400">For daily consumables & supplies</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-400 text-sm">$450.00</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80">
                  <div>
                    <span className="font-bold text-white block">Commercial Operating Bank</span>
                    <span className="text-[11px] text-slate-400">Primary clinic business account</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-400 text-sm">$28,450.00</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800">
                <span>Total Liquid Treasury Recorded</span>
                <span className="font-mono font-extrabold text-white text-sm">$32,740.00</span>
              </div>
            </div>

            {/* Right: Key Capabilities Description */}
            <div className="lg:col-span-6 space-y-4">
              <h3 className="text-xl font-bold text-slate-900">
                Prevent End-of-Day Cash Discrepancies
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                By enforcing that every rupee or dollar collected is tied to an itemized invoice, and
                every expense payout is logged under an authorized category, clinic managers can
                reconcile the physical cash drawer in minutes at the end of each shift.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {financialHighlights.capabilities.map((c, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-xs text-slate-900 block mb-1">{c.title}</span>
                    <span className="text-[11px] text-slate-600 leading-snug block">{c.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Factual Integrity Disclaimer */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs text-slate-600">
            <AlertCircle className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
            <p>
              <strong className="text-slate-800 font-semibold">Operational Transparency: </strong>
              {financialHighlights.disclaimer}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
