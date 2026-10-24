import React from 'react';
import { Link } from 'react-router-dom';
import { useMarketingSEO } from '../../utils/seo';
import {
  Activity,
  Heart,
  ShieldCheck,
  Stethoscope,
  Zap,
  ArrowRight,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { aboutMedPulse } from '../../data/marketingContent';

export const AboutPage = () => {
  useMarketingSEO({
    title: 'About Us & Product Philosophy — MedPulse Clinic ERP',
    description:
      'Learn about MedPulse Clinic ERP mission: empowering outpatient healthcare clinics with streamlined scheduling, clinical prescribing, and transparent financial tracking.',
  });

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-brand-50/60 via-white to-slate-50 pt-12 pb-16 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold uppercase tracking-wider">
            <span>Our Mission</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Software Built Around the Outpatient Consultation Journey
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            {aboutMedPulse.mission}
          </p>
        </div>
      </section>

      {/* Origin Story & Principles */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-2xl font-extrabold text-slate-900">Why MedPulse Was Built</h2>
            <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              <p>{aboutMedPulse.story}</p>
              <p>
                Many clinic software systems are either bloated adaptations of inpatient hospital bed
                management tools or fragile collections of spreadsheets. MedPulse takes a different
                approach: prioritize the high-frequency tasks that matter most in outpatient care.
              </p>
            </div>
          </div>

          {/* 4 Core Pillars */}
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-slate-900 text-center">
              Our Core Product Principles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aboutMedPulse.corePillars.map((p, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                    0{idx + 1}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{p.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Box */}
          <div className="bg-slate-900 rounded-3xl p-8 text-white text-center space-y-4">
            <h3 className="text-xl font-bold">Explore MedPulse in Your Browser</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
              Test drive the live system immediately without entering credit card details or
              scheduling phone calls.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link
                to="/dashboard"
                className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 font-bold text-white text-xs sm:text-sm transition-colors"
              >
                Launch Live ERP
              </Link>
              <Link
                to="/request-demo"
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-white text-xs sm:text-sm border border-slate-700 transition-colors"
              >
                Request a Demo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
