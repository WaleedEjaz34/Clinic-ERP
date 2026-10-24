import React from 'react';
import {
  UserPlus,
  CalendarPlus,
  Stethoscope,
  FileText,
  Receipt,
  CreditCard,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { clinicWorkflowSteps } from '../../data/marketingContent';

const STEP_ICONS = {
  UserPlus,
  CalendarPlus,
  Stethoscope,
  FileText,
  Receipt,
  CreditCard,
};

export const WorkflowSection = () => {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-white border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider">
            <span>Outpatient Operational Flow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How It Works: The Standard Clinic Workflow
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            From the moment a patient steps into the waiting room to the final receipt, MedPulse
            keeps every handoff structured and accountable.
          </p>
        </div>

        {/* Workflow Steps Horizontal Grid on Desktop, Vertical Stack on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 relative">
          {clinicWorkflowSteps.map((item, idx) => {
            const Icon = STEP_ICONS[item.iconName] || Stethoscope;
            return (
              <div
                key={item.step}
                className="relative bg-slate-50/80 rounded-2xl p-5 border border-slate-200 hover:border-brand-400 hover:bg-white hover:shadow-card-hover transition-all flex flex-col justify-between group"
              >
                {/* Step pill & connector arrow (hidden on mobile, shown on desktop between items) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-full bg-brand-600 text-white font-mono font-bold text-xs flex items-center justify-center shadow-xs">
                      {item.step}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded">
                      {item.role}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-brand-600 group-hover:scale-110 group-hover:bg-brand-50 transition-transform">
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.shortDescription}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-200/60 text-[11px] text-slate-500 leading-normal">
                  {item.detail}
                </div>
              </div>
            );
          })}
        </div>

        {/* Workflow Summary Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base font-bold text-white flex items-center justify-center sm:justify-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>Zero Duplicate Entry Across Your Clinic</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-300">
              When patient info is registered once, it automatically populates in scheduling, the
              doctor’s consultation queue, prescription printing, and final cashier billing.
            </p>
          </div>

          <a
            href="/request-demo"
            className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs transition-colors"
          >
            <span>See Workflow Demo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
