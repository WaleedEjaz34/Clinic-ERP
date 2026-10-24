import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
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
  ArrowLeft,
  CheckCircle2,
  Clock,
  Printer,
  Sparkles,
} from 'lucide-react';
import { coreFeatures, productShowcases } from '../../data/marketingContent';

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

export const FeatureDetailPage = () => {
  const { moduleId } = useParams();

  // Find the feature by slug or id
  const feature = coreFeatures.find(
    (f) => f.slug === moduleId || f.id === moduleId
  );

  if (!feature) {
    // If not found, redirect back to /features
    return <Navigate to="/features" replace />;
  }

  // Find matching product showcase if available
  const matchingShowcase = productShowcases.find(
    (s) => s.id === `showcase-${feature.slug}` || s.id.includes(feature.slug)
  );

  // Find related features (other modules in same category or adjacent)
  const relatedFeatures = coreFeatures
    .filter((f) => f.id !== feature.id)
    .slice(0, 3);

  useMarketingSEO({
    title: `${feature.title} — MedPulse Clinic ERP`,
    description: feature.longDescription,
  });

  const Icon = FEATURE_ICONS[feature.iconName] || Users;

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Top Breadcrumb & Hero */}
      <section className="bg-gradient-to-b from-brand-50/60 via-white to-slate-50 pt-10 pb-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link to="/features" className="hover:text-brand-600 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Features</span>
            </Link>
            <span>/</span>
            <span className="text-slate-800">{feature.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center shadow-md shadow-brand-500/20">
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block">
                    {feature.category} Module
                  </span>
                  <span className="text-xs text-slate-500">{feature.badge}</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                {feature.title}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                {feature.longDescription}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/request-demo"
                  className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 font-bold text-white text-sm shadow-md transition-colors inline-flex items-center gap-2"
                >
                  <span>Request a Demo of this Module</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/dashboard"
                  className="px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm border border-slate-300 transition-colors"
                >
                  Launch Live Demo Workspace
                </Link>
              </div>
            </div>

            {/* Quick Summary Pill Box */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                At a Glance
              </div>
              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Module Category:</span>
                  <span className="font-bold text-slate-900">{feature.category}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Primary Users:</span>
                  <span className="font-bold text-slate-900">
                    {feature.category === 'Clinical'
                      ? 'Doctors & Specialists'
                      : feature.category === 'Administrative'
                      ? 'Receptionists & Front Desk'
                      : 'Accountants & Cashiers'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Data Storage:</span>
                  <span className="font-bold text-emerald-600">Client-Side LocalStorage</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Evaluation Access:</span>
                  <span className="font-bold text-brand-600">Free Browser Trial</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Mockup */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Key Capabilities & Workflow Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Key Capabilities */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-brand-600" />
                <span>Core Capabilities & Features</span>
              </h2>

              <div className="space-y-4">
                {feature.capabilities.map((cap, cIdx) => (
                  <div key={cIdx} className="flex items-start gap-3 text-sm text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">
                      ✓
                    </div>
                    <span className="leading-relaxed">{cap}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Key Clinic Benefits
                </h3>
                <div className="space-y-2.5">
                  {feature.benefits.map((ben, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2.5 text-xs text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
                      <span>{ben}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Realistic Example Workflow */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-600" />
                <span>Example Outpatient Workflow</span>
              </h2>

              <div className="p-4 rounded-2xl bg-brand-50/60 border border-brand-200/80 text-sm text-brand-900 font-medium leading-relaxed">
                {feature.workflowSummary}
              </div>

              <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
                <p>
                  In a busy medical clinic, delays happen when software requires duplicate entries
                  or buries critical details inside multi-layered menus. MedPulse designs each screen
                  so that the next logical clinical or financial step is immediately accessible.
                </p>
                <p>
                  Whether advancing a patient’s queue status or issuing a medication prescription,
                  the relevant demographic and balance history is displayed alongside the action.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Directly accessible in live system:</span>
                <Link
                  to="/dashboard"
                  className="font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                >
                  <span>Test Live Workflow</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Related Modules Section */}
          <div className="space-y-6 pt-6">
            <h2 className="text-2xl font-bold text-slate-900">Related Clinical Modules</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedFeatures.map((rf) => {
                const RelIcon = FEATURE_ICONS[rf.iconName] || Users;
                return (
                  <Link
                    key={rf.id}
                    to={`/features/${rf.slug}`}
                    className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-brand-300 hover:shadow-card-hover transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-700 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                        <RelIcon className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                        {rf.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2">
                        {rf.shortDescription}
                      </p>
                    </div>
                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center gap-1 text-xs font-bold text-brand-600">
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Conversion Banner */}
      <section className="bg-slate-900 text-white py-16 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            See How {feature.title} Works in Your Clinic
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Book a 15-minute live screen share with a software specialist or explore the browser
            sandbox right now.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/request-demo"
              className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 font-bold text-white text-sm shadow-md transition-colors"
            >
              Request a Guided Demo
            </Link>
            <Link
              to="/pricing"
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-white text-sm border border-slate-700 transition-colors"
            >
              View Pricing Framework
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
