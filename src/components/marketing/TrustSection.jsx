import React from 'react';
import {
  FolderHeart,
  CalendarCheck,
  Receipt,
  Activity,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { valuePropositions } from '../../data/marketingContent';

const ICONS = {
  FolderHeart: FolderHeart,
  CalendarCheck: CalendarCheck,
  Receipt: Receipt,
  Activity: Activity,
};

export const TrustSection = () => {
  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
            <span>Core Value Propositions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Everything Your Clinic Needs, in One Place
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            MedPulse replaces disconnected spreadsheets and loose paper slips with a unified
            system designed specifically for outpatient clinic workflows.
          </p>
        </div>

        {/* 4 Value Proposition Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {valuePropositions.map((item, idx) => {
            const Icon = ICONS[item.iconName] || Activity;
            return (
              <div
                key={item.id}
                className="bg-slate-50/70 rounded-2xl p-6 border border-slate-200/80 hover:border-brand-300 hover:bg-white hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Icon & Badge */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-center text-brand-600 group-hover:scale-110 group-hover:bg-brand-50 transition-all">
                      <Icon className="w-6 h-6 stroke-[2]" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 font-mono">0{idx + 1}</span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs font-semibold text-brand-600 uppercase tracking-wide mt-0.5">
                      {item.metrics}
                    </p>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200/70 flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{item.details}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Truthful Trust Statement */}
        <div className="mt-12 p-4 sm:p-5 rounded-2xl bg-slate-100/80 border border-slate-200 text-center max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3">
          <ShieldCheck className="w-5 h-5 text-brand-600 flex-shrink-0" />
          <p className="text-xs sm:text-sm text-slate-700 font-medium">
            <span className="font-bold text-slate-900">Honest Healthcare Software:</span> No fake
            patient counts, no fabricated hospital testimonials. Every capability demonstrated here
            is genuinely built and operable.
          </p>
        </div>
      </div>
    </section>
  );
};
