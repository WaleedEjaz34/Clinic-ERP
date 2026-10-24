import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Play, CheckCircle2 } from 'lucide-react';

export const CTASection = () => {
  return (
    <section className="py-20 sm:py-28 bg-slate-900 text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-500/20 blur-[120px] rounded-full pointer-events-none -z-0" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-900/60 border border-brand-700/50 text-brand-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Transform Clinic Efficiency</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
          Bring Your Clinic Operations Together with MedPulse
        </h2>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Explore a more organized way to manage patients, appointments, billing, and everyday
          clinic administration in one reliable workspace.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            to="/request-demo"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 text-base font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            <span>Request a Demo</span>
            <ArrowRight className="w-4 h-4 text-brand-600" />
          </Link>

          <Link
            to="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 text-base font-bold text-white bg-slate-800/90 hover:bg-slate-800 border border-slate-700 rounded-xl transition-all transform hover:-translate-y-0.5"
          >
            <span>Contact Us</span>
          </Link>

          <Link
            to="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 text-base font-bold text-brand-300 hover:text-white transition-colors"
            title="Immediate browser trial"
          >
            <Play className="w-4 h-4 fill-brand-300" />
            <span>Launch Live ERP</span>
          </Link>
        </div>

        {/* Reassurance pills */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>No credit card required for demo</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Instant browser evaluation</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Tailored for outpatient clinics</span>
          </div>
        </div>
      </div>
    </section>
  );
};
