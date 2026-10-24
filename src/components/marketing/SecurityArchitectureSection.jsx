import React from 'react';
import {
  ShieldAlert,
  Lock,
  Info,
  Server,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { securityAndArchitecture } from '../../data/marketingContent';

const FACT_ICONS = {
  ShieldAlert,
  Lock,
  Info,
  Server,
};

export const SecurityArchitectureSection = () => {
  return (
    <section id="security" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider">
            <span>Verified System Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {securityAndArchitecture.heading}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {securityAndArchitecture.subheading}
          </p>
        </div>

        {/* 4 Architectural Facts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {securityAndArchitecture.coreFacts.map((fact, idx) => {
            const Icon = FACT_ICONS[fact.iconName] || Info;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
                      <Icon className="w-5 h-5 stroke-[2]" />
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                      {fact.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">{fact.title}</h3>

                  <p className="text-sm text-slate-600 leading-relaxed">{fact.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Factual Disclaimer Card */}
        <div className="mt-12 p-6 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <span>Important Clinical Record Disclosure</span>
          </div>
          <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
            {securityAndArchitecture.verifiedNotice} Real patient health records should never be
            stored in this browser evaluation sandbox. For clinical production deployments,
            contact our engineering team to review our turnkey server architecture specifications.
          </p>
        </div>
      </div>
    </section>
  );
};
