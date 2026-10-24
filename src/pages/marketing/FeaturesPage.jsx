import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useMarketingSEO } from '../../utils/seo';
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
  Search,
  CheckCircle2,
  Filter,
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

const CATEGORIES = ['All', 'Clinical', 'Administrative', 'Financial', 'Operations'];

export const FeaturesPage = () => {
  useMarketingSEO({
    title: 'Product Features & Modules — MedPulse Clinic ERP',
    description:
      'Detailed overview of MedPulse Clinic ERP modules: patient management, doctor scheduling, digital prescriptions, itemized billing, and financial ledgers.',
  });

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFeatures = useMemo(() => {
    return coreFeatures.filter((f) => {
      const matchesCategory =
        selectedCategory === 'All' || f.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        searchQuery === '' ||
        f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.longDescription.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-brand-50/60 via-white to-slate-50 pt-12 pb-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold uppercase tracking-wider">
            <span>Platform Capabilities</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive Clinic Management Features
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Every module in MedPulse has been designed from the ground up to solve daily friction
            for outpatient receptionists, doctors, cashiers, and clinic administrators.
          </p>

          {/* Search & Filter Bar */}
          <div className="max-w-2xl mx-auto pt-4 space-y-4">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search modules (e.g. Prescriptions, Billing, Appointments)..."
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-300 rounded-2xl shadow-sm text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredFeatures.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
              <p className="text-slate-500 font-medium">No features match your search query.</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="text-brand-600 font-bold text-sm underline"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredFeatures.map((feat) => {
                const Icon = FEATURE_ICONS[feat.iconName] || Users;
                return (
                  <div
                    key={feat.id}
                    className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-2xs hover:shadow-card-hover hover:border-brand-300 transition-all duration-200 flex flex-col justify-between space-y-6 group"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 group-hover:scale-105 group-hover:bg-brand-600 group-hover:text-white transition-all">
                          <Icon className="w-6 h-6 stroke-[2]" />
                        </div>
                        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                          {feat.category}
                        </span>
                      </div>

                      <div>
                        <h2 className="text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                          {feat.title}
                        </h2>
                        <span className="text-xs font-semibold text-brand-700 block mt-0.5">
                          {feat.badge}
                        </span>
                      </div>

                      <p className="text-sm text-slate-600 leading-relaxed font-normal">
                        {feat.longDescription}
                      </p>

                      {/* Key Capabilities Checklist */}
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                          Key Capabilities
                        </span>
                        {feat.capabilities.slice(0, 3).map((cap, cIdx) => (
                          <div key={cIdx} className="flex items-start gap-2 text-xs text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                            <span className="leading-snug">{cap}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      <Link
                        to={`/features/${feat.slug}`}
                        className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-800 bg-slate-50 hover:bg-brand-50 hover:text-brand-600 border border-slate-200 group-hover:border-brand-200 transition-all"
                      >
                        <span>View Detailed Workflow & Mockup</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="bg-slate-900 text-white py-16 border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Ready to See These Features in Action?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Book a personalized walkthrough with our healthcare software specialists or launch the
            self-guided browser demonstration immediately.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/request-demo"
              className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 font-bold text-white text-sm shadow-md transition-colors"
            >
              Request a Guided Demo
            </Link>
            <Link
              to="/dashboard"
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-white text-sm border border-slate-700 transition-colors"
            >
              Launch Live Browser ERP
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
