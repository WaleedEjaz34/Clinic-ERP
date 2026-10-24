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
} from 'lucide-react';
import { roleBenefits } from '../../data/marketingContent';

const ROLE_ICONS = {
  Building2,
  UserCheck,
  Stethoscope,
  Coins,
};

export const RoleBenefitsSection = () => {
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(0);
  const currentRole = roleBenefits[selectedRoleIndex];
  const Icon = ROLE_ICONS[currentRole.iconName] || Stethoscope;

  return (
    <section id="roles" className="py-16 sm:py-24 bg-white border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-800 text-xs font-bold uppercase tracking-wider">
            <span>Tailored for Every Role</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How MedPulse Empowers Your Entire Clinic Team
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Healthcare is a collaborative team effort. MedPulse gives clinic owners, doctors,
            receptionists, and accountants the exact tools they need.
          </p>
        </div>

        {/* Role Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-10">
          {roleBenefits.map((r, idx) => {
            const TabIcon = ROLE_ICONS[r.iconName] || Stethoscope;
            const isSelected = selectedRoleIndex === idx;

            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedRoleIndex(idx)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <TabIcon
                  className={`w-4 h-4 ${isSelected ? 'text-brand-400' : 'text-slate-500'}`}
                />
                <span>{r.role.split('&')[0].trim()}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Role Interactive Card */}
        <div className="bg-gradient-to-br from-slate-50 to-brand-50/20 rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Role Details & Benefits */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center shadow-md shadow-brand-500/20">
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block">
                    {currentRole.badge}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    {currentRole.role}
                  </h3>
                </div>
              </div>

              <p className="text-base text-slate-700 font-medium leading-relaxed">
                "{currentRole.tagline}"
              </p>

              <p className="text-sm text-slate-600 leading-relaxed">{currentRole.summary}</p>

              {/* Bulleted Benefits */}
              <div className="space-y-3 pt-1">
                {currentRole.keyBenefits.map((ben, bIdx) => (
                  <div key={bIdx} className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="leading-snug">{ben}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Key Feature Callout & Action */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Role Highlights In Practice
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="text-xs font-bold text-brand-700">PRIMARY WORKSPACE FOCUS</div>
                  <div className="text-base font-extrabold text-slate-900">
                    {currentRole.highlightFeature}
                  </div>
                  <p className="text-xs text-slate-500">
                    Specifically streamlined to minimize clicks, eliminate duplicate data entry,
                    and keep attention focused on patient care.
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <a
                    href="/request-demo"
                    className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-colors"
                  >
                    <span>Schedule Role Walkthrough</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
