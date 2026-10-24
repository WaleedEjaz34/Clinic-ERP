import React from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Users,
  Calendar,
  FileText,
  Receipt,
  Landmark,
  ArrowRight,
  Clock,
  Printer,
  CreditCard,
  TrendingDown,
  Stethoscope,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { productShowcases } from '../../data/marketingContent';

export const ProductShowcase = () => {
  return (
    <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200/70 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 sm:space-y-32">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold uppercase tracking-wider">
            <span>In-Depth Product Tour</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Designed for Speed, Accuracy, and Peace of Mind
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Explore how MedPulse handles each critical stage of clinic administration with
            purpose-built screens.
          </p>
        </div>

        {/* Alternating Showcase Rows */}
        {productShowcases.map((showcase, index) => {
          const isEven = index % 2 === 1;

          return (
            <div
              key={showcase.id}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center ${
                isEven ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Text Description Column (5 cols) */}
              <div
                className={`lg:col-span-5 space-y-5 text-left ${
                  isEven ? 'lg:order-2' : 'lg:order-1'
                }`}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200/70 text-brand-700 text-xs font-bold uppercase tracking-wider">
                  <span>{showcase.tag}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                  {showcase.title}
                </h3>

                <p className="text-base text-slate-600 leading-relaxed font-normal">
                  {showcase.description}
                </p>

                {/* Bullet Points */}
                <div className="space-y-2.5 pt-2">
                  {showcase.bullets.map((b, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3">
                  <Link
                    to={`/features/${showcase.id.replace('showcase-', '')}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors"
                  >
                    <span>Learn more about {showcase.tag}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Realistic Mockup Column (7 cols) */}
              <div
                className={`lg:col-span-7 relative ${
                  isEven ? 'lg:order-1' : 'lg:order-2'
                }`}
              >
                {/* Backing Gradient Glow */}
                <div className="absolute -inset-2 bg-gradient-to-r from-brand-400/20 to-teal-400/20 rounded-3xl blur-xl opacity-50 -z-10" />

                {/* Render specific realistic mockup according to showcase.mockupType */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-xs">
                  {/* Mockup Titlebar */}
                  <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-slate-300">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                      </div>
                      <span className="text-[11px] font-mono text-slate-300 ml-1">
                        medpulse.app / {showcase.tag.toLowerCase().replace(/\s+/g, '-')}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                      Live Data
                    </span>
                  </div>

                  {/* Mockup Content Views */}
                  {showcase.mockupType === 'patient-profile' && (
                    <div className="p-4 sm:p-5 space-y-4 bg-slate-50/60">
                      {/* Top Header Card */}
                      <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-brand-100 border border-brand-200 text-brand-700 font-bold text-base flex items-center justify-center">
                            SJ
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-extrabold text-sm text-slate-900">
                                {showcase.mockupData.name}
                              </h4>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                {showcase.mockupData.status}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5 flex flex-wrap gap-2">
                              <span className="font-mono text-brand-600 font-bold">
                                {showcase.mockupData.mrn}
                              </span>
                              <span>•</span>
                              <span>{showcase.mockupData.ageGender}</span>
                              <span>•</span>
                              <span>{showcase.mockupData.bloodGroup}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-left sm:text-right bg-slate-50 sm:bg-transparent p-2 sm:p-0 rounded-lg w-full sm:w-auto">
                          <div className="text-[10px] text-slate-500 uppercase font-semibold">
                            Ledger Balance
                          </div>
                          <div className="text-base font-extrabold text-emerald-600">
                            {showcase.mockupData.outstandingBalance}
                          </div>
                        </div>
                      </div>

                      {/* Detail Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 bg-white rounded-xl border border-slate-200">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                            Last Consultation
                          </span>
                          <div className="font-semibold text-slate-800">
                            {showcase.mockupData.consultant}
                          </div>
                          <div className="text-slate-500 text-[11px] mt-0.5">
                            {showcase.mockupData.lastVisit} (Total: {showcase.mockupData.totalVisits}{' '}
                            visits)
                          </div>
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-slate-200">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                            Current Active Prescription
                          </span>
                          <div className="font-medium text-slate-800 line-clamp-2">
                            {showcase.mockupData.recentPrescription}
                          </div>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="flex items-center justify-end gap-2 pt-1 text-[11px]">
                        <span className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-semibold text-slate-700">
                          View Full History
                        </span>
                        <span className="px-3 py-1.5 rounded-lg bg-brand-600 font-bold text-white shadow-2xs">
                          + New Consultation
                        </span>
                      </div>
                    </div>
                  )}

                  {showcase.mockupType === 'appointment-queue' && (
                    <div className="p-4 sm:p-5 space-y-3 bg-slate-50/60">
                      {/* Metric pills */}
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 bg-white rounded-lg border border-slate-200">
                          <span className="text-[10px] text-slate-500 block">Total Scheduled</span>
                          <span className="text-sm font-extrabold text-slate-900">
                            {showcase.mockupData.totalScheduled}
                          </span>
                        </div>
                        <div className="p-2 bg-white rounded-lg border border-amber-200 bg-amber-50/40">
                          <span className="text-[10px] text-amber-700 block">Waiting Now</span>
                          <span className="text-sm font-extrabold text-amber-700">
                            {showcase.mockupData.waitingCount}
                          </span>
                        </div>
                        <div className="p-2 bg-white rounded-lg border border-emerald-200 bg-emerald-50/40">
                          <span className="text-[10px] text-emerald-700 block">Completed</span>
                          <span className="text-sm font-extrabold text-emerald-700">
                            {showcase.mockupData.completedCount}
                          </span>
                        </div>
                      </div>

                      {/* Queue Table */}
                      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                        {showcase.mockupData.queue.map((item, qIdx) => (
                          <div
                            key={qIdx}
                            className={`p-2.5 flex items-center justify-between ${
                              item.status === 'In-Consultation' ? 'bg-amber-50/50' : ''
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="font-mono font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                                {item.token}
                              </span>
                              <div>
                                <span className="font-bold text-slate-900">{item.patient}</span>
                                <span className="text-[10px] text-slate-500 block">
                                  {item.doctor} • {item.time}
                                </span>
                              </div>
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                item.status === 'Completed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : item.status === 'In-Consultation'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {item.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {showcase.mockupType === 'prescription-writer' && (
                    <div className="p-4 sm:p-5 space-y-3 bg-slate-50/60 font-sans">
                      {/* Doctor header */}
                      <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-slate-900 text-xs">
                            {showcase.mockupData.doctor}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Patient: {showcase.mockupData.patient} • Rx #{showcase.mockupData.rxId}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-600 font-semibold bg-slate-100 px-2.5 py-1 rounded-lg">
                          <Printer className="w-3.5 h-3.5" />
                          <span>Print Slip</span>
                        </div>
                      </div>

                      {/* Diagnosis & Vitals */}
                      <div className="p-2.5 bg-brand-50/60 rounded-xl border border-brand-200/80 text-[11px]">
                        <span className="font-bold text-brand-900">Diagnosis: </span>
                        <span className="text-brand-800">{showcase.mockupData.diagnosis}</span>
                        <div className="text-[10px] text-brand-700 mt-1 font-mono">
                          {showcase.mockupData.vitals}
                        </div>
                      </div>

                      {/* Medicines List */}
                      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
                        <div className="px-3 py-1.5 bg-slate-100/70 text-[10px] font-bold uppercase text-slate-500 flex justify-between">
                          <span>Prescribed Medicine</span>
                          <span>Instructions</span>
                        </div>
                        {showcase.mockupData.medicines.map((m, mIdx) => (
                          <div key={mIdx} className="p-2.5 flex items-center justify-between">
                            <div>
                              <div className="font-bold text-slate-900">{m.name}</div>
                              <div className="text-[10px] text-slate-500">
                                {m.dosage} • {m.frequency}
                              </div>
                            </div>
                            <div className="text-right text-[11px]">
                              <span className="font-medium text-slate-700 block">{m.timing}</span>
                              <span className="text-[10px] text-slate-500 font-mono">{m.duration}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Investigations & Follow Up */}
                      <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-[11px] flex justify-between items-center text-slate-600">
                        <div>
                          <span className="font-bold text-slate-800">Lab Orders: </span>
                          <span>{showcase.mockupData.investigations.join(', ')}</span>
                        </div>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                          {showcase.mockupData.followUp}
                        </span>
                      </div>
                    </div>
                  )}

                  {showcase.mockupType === 'billing-invoice' && (
                    <div className="p-4 sm:p-5 space-y-3 bg-slate-50/60">
                      {/* Invoice meta header */}
                      <div className="p-3 bg-white rounded-xl border border-slate-200 flex justify-between items-center">
                        <div>
                          <div className="font-mono font-bold text-slate-900">
                            {showcase.mockupData.invoiceNo}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {showcase.mockupData.patient} ({showcase.mockupData.mrn}) •{' '}
                            {showcase.mockupData.date}
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {showcase.mockupData.status}
                        </span>
                      </div>

                      {/* Itemized Table */}
                      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                        <div className="px-3 py-1.5 bg-slate-100/70 text-[10px] font-bold uppercase text-slate-500 grid grid-cols-12 gap-2">
                          <span className="col-span-8">Service / Procedure</span>
                          <span className="col-span-2 text-center">Qty</span>
                          <span className="col-span-2 text-right">Amount</span>
                        </div>
                        {showcase.mockupData.items.map((it, itIdx) => (
                          <div key={itIdx} className="p-2.5 grid grid-cols-12 gap-2 text-[11px]">
                            <span className="col-span-8 font-medium text-slate-800">{it.desc}</span>
                            <span className="col-span-2 text-center text-slate-500">{it.qty}</span>
                            <span className="col-span-2 text-right font-mono font-bold text-slate-900">
                              ${it.total.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Totals Breakdown */}
                      <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1 text-[11px]">
                        <div className="flex justify-between text-slate-500">
                          <span>Subtotal:</span>
                          <span className="font-mono">${showcase.mockupData.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-emerald-600 font-medium">
                          <span>Discount Applied:</span>
                          <span className="font-mono">-${showcase.mockupData.discount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-slate-100 font-extrabold text-slate-900 text-xs">
                          <span>Net Payable:</span>
                          <span className="font-mono">${showcase.mockupData.total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-500 pt-1">
                          <span>Paid via {showcase.mockupData.paymentMethod}</span>
                          <span className="font-bold text-emerald-600">Balance: $0.00</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {showcase.mockupType === 'financial-ledger' && (
                    <div className="p-4 sm:p-5 space-y-3 bg-slate-50/60">
                      {/* Cash Accounts Summary */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                          <span className="text-[10px] text-slate-400 block uppercase font-bold">
                            Cash in Hand
                          </span>
                          <span className="text-sm font-extrabold text-slate-900">
                            {showcase.mockupData.cashInHand}
                          </span>
                        </div>
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                          <span className="text-[10px] text-slate-400 block uppercase font-bold">
                            Petty Cash
                          </span>
                          <span className="text-sm font-extrabold text-slate-900">
                            {showcase.mockupData.pettyCashDrawer}
                          </span>
                        </div>
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                          <span className="text-[10px] text-slate-400 block uppercase font-bold">
                            Operating Bank
                          </span>
                          <span className="text-sm font-extrabold text-slate-900">
                            {showcase.mockupData.operatingBank}
                          </span>
                        </div>
                      </div>

                      {/* Daily Cash Flow Bar */}
                      <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-slate-500 text-[11px] block">
                            Today's Collections:
                          </span>
                          <span className="font-bold text-emerald-600">
                            {showcase.mockupData.todayCollections}
                          </span>
                        </div>
                        <div className="text-center">
                          <span className="text-slate-500 text-[11px] block">
                            Today's Expenses:
                          </span>
                          <span className="font-bold text-rose-600">
                            {showcase.mockupData.todayExpenses}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-500 text-[11px] block">Net Inflow:</span>
                          <span className="font-extrabold text-brand-600">
                            {showcase.mockupData.netDailyFlow}
                          </span>
                        </div>
                      </div>

                      {/* Recent Vouchers List */}
                      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                        <div className="px-3 py-1.5 bg-slate-100/70 text-[10px] font-bold uppercase text-slate-500 flex justify-between">
                          <span>Recent Expense Disbursements</span>
                          <span>Account / Paid</span>
                        </div>
                        {showcase.mockupData.recentExpenses.map((exp, expIdx) => (
                          <div key={expIdx} className="p-2.5 flex items-center justify-between text-[11px]">
                            <div>
                              <div className="font-medium text-slate-800">{exp.desc}</div>
                              <span className="text-[10px] text-slate-400">{exp.cat}</span>
                            </div>
                            <div className="text-right">
                              <span className="font-mono font-bold text-rose-600 block">
                                -{exp.amt}
                              </span>
                              <span className="text-[10px] text-slate-500">{exp.acc}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
