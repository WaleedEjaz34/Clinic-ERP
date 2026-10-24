import React from 'react';
import { Link } from 'react-router-dom';
import { useMarketingSEO } from '../../utils/seo';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
  Stethoscope,
  Info,
} from 'lucide-react';
import { pricingFramework } from '../../data/marketingContent';

export const PricingPage = () => {
  useMarketingSEO({
    title: 'Pricing Framework & Plans — MedPulse Clinic ERP',
    description:
      'Transparent licensing framework for MedPulse Clinic ERP based on clinic scale, doctor seats, and deployment needs.',
  });

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-brand-50/60 via-white to-slate-50 pt-12 pb-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold uppercase tracking-wider">
            <span>Transparent Pricing Model</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Tailored Licensing for Clinics of Any Size
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Every healthcare practice has unique operational needs. Our licensing aligns with your
            active consulting doctor count and deployment model.
          </p>

          {/* Pricing Disclaimer Card */}
          <div className="max-w-2xl mx-auto mt-4 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs sm:text-sm text-left flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="leading-relaxed">
              <strong className="font-bold">Transparent Disclosure: </strong>
              {pricingFramework.disclaimer}
            </p>
          </div>
        </div>
      </section>

      {/* 3 Illustrative Tiers */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {pricingFramework.tiers.map((tier) => (
              <div
                key={tier.id}
                className={`bg-white rounded-3xl p-8 border flex flex-col justify-between transition-all relative ${
                  tier.recommended
                    ? 'border-brand-500 shadow-xl ring-2 ring-brand-500/20'
                    : 'border-slate-200 shadow-sm hover:shadow-card-hover'
                }`}
              >
                {tier.recommended && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-600 text-white font-bold text-xs uppercase tracking-wider px-4 py-1 rounded-full shadow-sm">
                    Most Popular Choice
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-extrabold text-slate-900">{tier.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 font-medium">{tier.tagline}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Physician Capacity
                    </span>
                    <div className="text-base font-extrabold text-slate-900">
                      {tier.doctorScope}
                    </div>
                    <span className="text-[11px] text-brand-600 font-semibold block">
                      {tier.illustrativeIndicator}
                    </span>
                  </div>

                  {/* Included features */}
                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                      Included Modules
                    </span>
                    {tier.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}

                    {tier.notIncluded.map((notFeat, nIdx) => (
                      <div key={nIdx} className="flex items-start gap-2.5 text-xs text-slate-400">
                        <XCircle className="w-4 h-4 text-slate-300 mt-0.5 flex-shrink-0" />
                        <span className="line-through leading-snug">{notFeat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8 mt-8 border-t border-slate-100">
                  <Link
                    to={`/request-demo?plan=${tier.id}`}
                    className={`w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                      tier.recommended
                        ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-md'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    <span>{tier.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Matrix */}
      <section className="py-16 bg-white border-t border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Module Comparison Matrix
            </h2>
            <p className="text-sm text-slate-600">
              Compare features across solo practice, multi-doctor clinic, and practice network tiers.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-4">Platform Capability</th>
                    <th className="p-4 text-center">Solo Practice</th>
                    <th className="p-4 text-center">Professional Clinic</th>
                    <th className="p-4 text-center">Practice Network</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {pricingFramework.featureComparisonMatrix.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4 font-semibold text-slate-900">{row.feature}</td>
                      <td className="p-4 text-center text-slate-600 font-medium">
                        {typeof row.solo === 'boolean' ? (
                          row.solo ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                          ) : (
                            <span className="text-slate-300 font-bold">—</span>
                          )
                        ) : (
                          row.solo
                        )}
                      </td>
                      <td className="p-4 text-center text-slate-600 font-medium">
                        {typeof row.pro === 'boolean' ? (
                          row.pro ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                          ) : (
                            <span className="text-slate-300 font-bold">—</span>
                          )
                        ) : (
                          row.pro
                        )}
                      </td>
                      <td className="p-4 text-center text-slate-600 font-medium">
                        {typeof row.enterprise === 'boolean' ? (
                          row.enterprise ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                          ) : (
                            <span className="text-slate-300 font-bold">—</span>
                          )
                        ) : (
                          row.enterprise
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Request Callout */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Need a Custom Quote for Your Practice?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Tell us about your clinic specialty, the number of consulting physicians, and your
            preferred hosting arrangement. We will provide a tailored proposal within 24 hours.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/request-demo"
              className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 font-bold text-white text-sm shadow-md transition-colors"
            >
              Request Custom Quote
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-white text-sm border border-slate-700 transition-colors"
            >
              Talk to Sales Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
