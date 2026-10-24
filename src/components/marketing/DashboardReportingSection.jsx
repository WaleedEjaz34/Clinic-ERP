import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  Receipt,
  CreditCard,
  TrendingDown,
  ArrowRight,
  Sparkles,
  Play,
  BarChart3,
} from 'lucide-react';
import { reportingMetrics } from '../../data/marketingContent';

const METRIC_ICONS = {
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  Receipt,
  CreditCard,
  TrendingDown,
};

export const DashboardReportingSection = () => {
  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <span>Executive Command Center</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {reportingMetrics.heading}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {reportingMetrics.subheading}
          </p>
        </div>

        {/* Executive Dashboard Mockup Frame */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-800 shadow-2xl space-y-8">
          {/* Header bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white">
                <BarChart3 className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">MedPulse Operations Overview</h3>
                <span className="text-xs text-slate-400">
                  Consolidated Daily Activity & Performance Summary
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">Date: Today, Oct 24, 2026</span>
              <span className="text-[11px] font-bold text-brand-300 bg-brand-900/60 px-2.5 py-1 rounded-md border border-brand-700/50">
                Demonstration Data
              </span>
            </div>
          </div>

          {/* 7 Core KPI Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {reportingMetrics.kpis.map((kpi) => {
              const Icon = METRIC_ICONS[kpi.icon] || Users;
              return (
                <div
                  key={kpi.id}
                  className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700/80 flex flex-col justify-between hover:bg-slate-800 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="text-[11px] font-medium line-clamp-1">{kpi.label}</span>
                      <Icon className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-white mt-1">
                      {kpi.value}
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-2 font-mono leading-tight">
                    {kpi.helper}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live Action Bar inside Dashboard Mockup */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="text-slate-300 text-center sm:text-left">
              <span className="font-bold text-white block">Interactive Live Demonstration:</span>
              Explore the real dashboard components, role switches, and reports in the functional
              app.
            </div>

            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 font-bold text-white transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Launch Live Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
