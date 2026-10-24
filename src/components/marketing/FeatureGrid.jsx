import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Stethoscope,
  Calendar,
  FileText,
  Receipt,
  CreditCard,
  Landmark,
  TrendingDown,
  Layers,
  ShieldCheck,
  LayoutDashboard,
  Globe,
  ArrowRight,
} from 'lucide-react';
import { coreFeatures } from '../../data/marketingContent';

const FEATURE_ICONS = {
  Users,
  Stethoscope,
  Calendar,
  FileText,
  Receipt,
  CreditCard,
  Landmark,
  TrendingDown,
  Layers,
  ShieldCheck,
  LayoutDashboard,
  Globe,
};

export const FeatureGrid = ({ showViewAll = true }) => {
  return (
    <section id="features" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold uppercase tracking-wider">
            <span>Comprehensive ERP Modules</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Designed for the Complete Clinic Journey
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Every clinical and financial module works together seamlessly, so patient data flows
            effortlessly from the front desk to the consulting room and cashier.
          </p>
        </div>

        {/* 12 Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {coreFeatures.map((feat) => {
            const Icon = FEATURE_ICONS[feat.iconName] || Users;
            return (
              <div
                key={feat.id}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-card-hover hover:border-brand-300 transition-all duration-200 flex flex-col justify-between group"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl bg-brand-50 border border-brand-100/80 flex items-center justify-center text-brand-600 group-hover:scale-105 group-hover:bg-brand-600 group-hover:text-white transition-all">
                      <Icon className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {feat.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-xs font-semibold text-brand-700/80 mt-0.5">
                      {feat.badge}
                    </p>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {feat.shortDescription}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/features/${feat.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 group-hover:text-brand-700 group-hover:gap-2 transition-all"
                  >
                    <span>Explore Module Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* View all features footer CTA */}
        {showViewAll && (
          <div className="mt-12 text-center">
            <Link
              to="/features"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-2xs hover:shadow-sm transition-all"
            >
              <span>Explore Full Feature Directory & Capabilities</span>
              <ArrowRight className="w-4 h-4 text-brand-600" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
