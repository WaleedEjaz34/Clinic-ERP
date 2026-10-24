import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { MarketingHeader } from './MarketingHeader';
import { MarketingFooter } from './MarketingFooter';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const MarketingLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-brand-100 selection:text-brand-900 antialiased">
      {/* Top Banner - Live Interactive Demo Notice */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white text-xs py-2 px-4 text-center border-b border-brand-900/40 relative z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 font-semibold text-[11px] border border-brand-400/30">
            <Sparkles className="w-3 h-3 text-brand-300 animate-pulse" />
            Live Browser Demo
          </span>
          <span className="text-slate-300 font-medium">
            Test drive the full MedPulse Clinic ERP dashboard directly in your browser. Zero setup
            required.
          </span>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1 font-bold text-brand-300 hover:text-white underline underline-offset-2 transition-colors ml-1"
          >
            Launch Live ERP
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Main Sticky Header */}
      <MarketingHeader />

      {/* Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Global Marketing Footer */}
      <MarketingFooter />
    </div>
  );
};
