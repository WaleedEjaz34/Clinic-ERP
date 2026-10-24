import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Users,
  Receipt,
  CreditCard,
  Clock,
  Sparkles,
  Play,
  TrendingUp,
  Stethoscope,
  ChevronRight,
} from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24 bg-gradient-to-b from-brand-50/40 via-white to-slate-50 border-b border-slate-200/60">
      {/* Background subtle radial accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-200/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Copy, CTAs, Benefits */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Category / Position Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100/80 border border-brand-200/80 text-brand-800 text-xs font-bold tracking-wide shadow-xs">
              <span className="w-2 h-2 rounded-full bg-brand-600 animate-ping" />
              <span>One Platform for Smarter Clinic Management</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              Run Your Clinic Smarter with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-clinical-teal">
                MedPulse Clinic ERP
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              From patient registration and appointment scheduling to digital prescriptions,
              billing, payments, and clinic expenses, manage your clinic’s daily operations from one
              organized platform.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                to="/request-demo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-bold text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 rounded-xl shadow-md shadow-brand-500/25 hover:shadow-lg hover:shadow-brand-500/35 transition-all transform hover:-translate-y-0.5"
              >
                <span>Request a Demo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition-all hover:border-slate-400 transform hover:-translate-y-0.5"
                title="Launch the interactive live prototype"
              >
                <Play className="w-4 h-4 text-brand-600 fill-brand-600" />
                <span>Try Live Demo</span>
              </Link>
            </div>

            {/* Supporting Benefits Checklist */}
            <div className="pt-4 border-t border-slate-200/80">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm font-medium text-slate-700">
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Organized patient records</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Streamlined appointments</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Clear billing tracking</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Realistic MedPulse Clinic ERP Dashboard Mockup */}
          <div className="lg:col-span-6 relative">
            {/* Glow backing */}
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-clinical-teal rounded-3xl blur-xl opacity-20 -z-10" />

            {/* Application Window Frame */}
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden transform transition-all duration-300 hover:shadow-3xl">
              {/* Fake Window Titlebar */}
              <div className="bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-800 text-slate-300 text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  <span className="font-semibold text-slate-200 ml-2 text-[11px] sm:text-xs">
                    MedPulse ERP — Clinic Operations Dashboard
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-brand-900/60 text-brand-300 px-2 py-0.5 rounded border border-brand-700/50 font-mono">
                    ONLINE
                  </span>
                </div>
              </div>

              {/* Inner Dashboard View */}
              <div className="p-4 sm:p-5 bg-slate-50 space-y-4">
                {/* Metric Cards Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs">
                    <div className="flex items-center justify-between text-slate-500 text-[11px]">
                      <span>Today's Appts</span>
                      <Calendar className="w-3.5 h-3.5 text-brand-500" />
                    </div>
                    <div className="text-xl font-extrabold text-slate-900 mt-1">24</div>
                    <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                      +4 vs yesterday
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs">
                    <div className="flex items-center justify-between text-slate-500 text-[11px]">
                      <span>In Waiting Room</span>
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                    </div>
                    <div className="text-xl font-extrabold text-slate-900 mt-1">5</div>
                    <div className="text-[10px] text-amber-600 font-semibold mt-0.5">
                      Avg wait: 12 min
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs">
                    <div className="flex items-center justify-between text-slate-500 text-[11px]">
                      <span>Today's Billing</span>
                      <Receipt className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                    <div className="text-xl font-extrabold text-slate-900 mt-1">$2,480</div>
                    <div className="text-[10px] text-slate-500 font-medium mt-0.5">18 Invoices</div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs">
                    <div className="flex items-center justify-between text-slate-500 text-[11px]">
                      <span>Collected</span>
                      <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                    <div className="text-xl font-extrabold text-emerald-600 mt-1">$2,150</div>
                    <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                      86.7% realized
                    </div>
                  </div>
                </div>

                {/* Queue & Activity Split Preview */}
                <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
                  <div className="px-3.5 py-2.5 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-xs font-bold text-slate-800">
                        Live Consultation Queue
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">Dr. Sarah Mitchell</span>
                  </div>

                  {/* Queue Items */}
                  <div className="divide-y divide-slate-100 text-xs">
                    <div className="p-3 flex items-center justify-between bg-brand-50/40">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-bold text-brand-700 bg-brand-100 px-1.5 py-0.5 rounded text-[11px]">
                          #03
                        </span>
                        <div>
                          <span className="font-bold text-slate-900 block">Emily Watson</span>
                          <span className="text-[10px] text-slate-500">
                            Cardiology Consultation • 10:00 AM
                          </span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        In-Consultation
                      </span>
                    </div>

                    <div className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                          #04
                        </span>
                        <div>
                          <span className="font-bold text-slate-800 block">Michael Vance</span>
                          <span className="text-[10px] text-slate-500">
                            Follow-up BP Check • 10:30 AM
                          </span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                        Waiting (Room 2)
                      </span>
                    </div>

                    <div className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                          #05
                        </span>
                        <div>
                          <span className="font-bold text-slate-800 block">Amina Al-Mansoor</span>
                          <span className="text-[10px] text-slate-500">
                            General Health Screening • 11:00 AM
                          </span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                        Scheduled
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Quick Action Strip */}
                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Real-time LocalStorage persistence active</span>
                  </div>
                  <Link
                    to="/dashboard"
                    className="font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
                  >
                    <span>Open Live Workspace</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
