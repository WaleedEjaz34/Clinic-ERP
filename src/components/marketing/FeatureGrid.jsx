import React, { useState, useMemo } from 'react';
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
  Sparkles,
  CheckCircle2,
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

const CATEGORIES = ['All', 'Clinical', 'Financial', 'Administrative'];

export const FeatureGrid = ({ showViewAll = true }) => {
  const [selectedCat, setSelectedCat] = useState('All');

  const filteredFeatures = useMemo(() => {
    if (selectedCat === 'All') return coreFeatures;
    return coreFeatures.filter((f) => f.category.toLowerCase() === selectedCat.toLowerCase());
  }, [selectedCat]);

  return (
    <section id="features" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Core Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            12 Integrated Clinic Modules
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Every module works together out of the box with zero external dependencies.
          </p>

          {/* Quick Category Switcher */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCat(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedCat === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 12 Features Grid - Crisp, Scannable Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredFeatures.map((feat) => {
            const Icon = FEATURE_ICONS[feat.iconName] || Users;
            return (
              <Link
                key={feat.id}
                to={`/features/${feat.slug}`}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-card-hover hover:border-brand-400 transition-all duration-200 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {feat.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-snug line-clamp-2">
                      {feat.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-brand-600 group-hover:text-brand-700">
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* View all features footer CTA */}
        {showViewAll && (
          <div className="text-center pt-2">
            <Link
              to="/features"
              className="inline-flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-2xs hover:shadow-sm transition-all"
            >
              <span>Explore Full Capabilities & Filters</span>
              <ArrowRight className="w-4 h-4 text-brand-600" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
