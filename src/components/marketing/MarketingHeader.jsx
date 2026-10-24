import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  Activity,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Sparkles,
  Users,
  Calendar,
  FileText,
  Receipt,
  TrendingDown,
  LayoutDashboard,
  ShieldCheck,
  PhoneCall,
  LogIn,
} from 'lucide-react';
import { brandConfig } from '../../data/marketingContent';

const FEATURE_DROPDOWN_MODULES = [
  {
    name: 'Patient Management',
    desc: 'Digital profiles, visit history & balances',
    path: '/features/patients',
    icon: Users,
    color: 'text-brand-600 bg-brand-50',
  },
  {
    name: 'Appointment Scheduling',
    desc: 'Token queues, doctor slots & check-in',
    path: '/features/appointments',
    icon: Calendar,
    color: 'text-emerald-600 bg-emerald-50',
  },
  {
    name: 'Digital Prescriptions',
    desc: 'Formulary lookup, dosage & instructions',
    path: '/features/prescriptions',
    icon: FileText,
    color: 'text-indigo-600 bg-indigo-50',
  },
  {
    name: 'Billing & Invoicing',
    desc: 'Itemized bills, discounts & receipts',
    path: '/features/billing',
    icon: Receipt,
    color: 'text-blue-600 bg-blue-50',
  },
  {
    name: 'Expense Management',
    desc: 'Operational vouchers & petty cash',
    path: '/features/expenses',
    icon: TrendingDown,
    color: 'text-amber-600 bg-amber-50',
  },
  {
    name: 'Executive Dashboard',
    desc: 'Real-time daily KPI oversight',
    path: '/features/dashboard',
    icon: LayoutDashboard,
    color: 'text-teal-600 bg-teal-50',
  },
];

export const MarketingHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [featuresDropdownOpen, setFeaturesDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setFeaturesDropdownOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-200 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/90 py-3'
            : 'bg-white/80 backdrop-blur-sm border-b border-slate-200/60 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo & Brand Wordmark */}
            <Link
              to="/"
              className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-lg p-0.5"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-clinical-teal flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
                <Activity className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
                    MedPulse
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-100 text-brand-700 border border-brand-200/60">
                    Clinic ERP
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-500 hidden sm:block">
                  Clinic Management Platform
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {/* Features with Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setFeaturesDropdownOpen(true)}
                onMouseLeave={() => setFeaturesDropdownOpen(false)}
              >
                <Link
                  to="/features"
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    location.pathname.startsWith('/features')
                      ? 'text-brand-600 bg-brand-50/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  Features
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      featuresDropdownOpen ? 'rotate-180 text-brand-600' : 'text-slate-400'
                    }`}
                  />
                </Link>

                {/* Dropdown Menu */}
                {featuresDropdownOpen && (
                  <div className="absolute left-0 top-full pt-2 w-[480px] z-50">
                    <div className="bg-white rounded-2xl shadow-dropdown border border-slate-200/90 p-4 grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
                      {FEATURE_DROPDOWN_MODULES.map((mod) => {
                        const Icon = mod.icon;
                        return (
                          <Link
                            key={mod.path}
                            to={mod.path}
                            className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200/80 transition-all group"
                          >
                            <div className={`p-2 rounded-lg ${mod.color} flex-shrink-0 mt-0.5`}>
                              <Icon className="w-4 h-4 stroke-[2.2]" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-800 group-hover:text-brand-600 transition-colors">
                                {mod.name}
                              </div>
                              <div className="text-[11px] text-slate-500 leading-snug line-clamp-1">
                                {mod.desc}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                      <div className="col-span-2 pt-2 mt-1 border-t border-slate-100 flex items-center justify-between text-xs px-2">
                        <span className="text-slate-500 font-medium">Explore all 12 core modules</span>
                        <Link
                          to="/features"
                          className="text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-1 group"
                        >
                          View Full Feature Directory
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* How It Works anchor link */}
              <a
                href="/#how-it-works"
                className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-colors"
              >
                How It Works
              </a>

              {/* Benefits anchor link */}
              <a
                href="/#benefits"
                className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-colors"
              >
                Benefits
              </a>

              {/* Pricing Page */}
              <NavLink
                to="/pricing"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-brand-600 bg-brand-50/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`
                }
              >
                Pricing
              </NavLink>

              {/* FAQ anchor link */}
              <a
                href="/#faq"
                className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-colors"
              >
                FAQ
              </a>

              {/* Contact Page */}
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-brand-600 bg-brand-50/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`
                }
              >
                Contact
              </NavLink>
            </nav>

            {/* Action CTAs */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Sign In / Launch ERP Button */}
              <Link
                to="/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs md:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 border border-slate-200/90 rounded-lg transition-colors focus:ring-2 focus:ring-slate-400"
                title="Launch Live ERP System Dashboard"
              >
                <LogIn className="w-4 h-4 text-slate-500" />
                <span>Sign In</span>
              </Link>

              {/* Request a Demo Primary CTA */}
              <Link
                to="/request-demo"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs md:text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 rounded-lg shadow-sm shadow-brand-500/20 hover:shadow-brand-500/30 transition-all focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
              >
                <span>Request a Demo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Mobile Menu Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                  <Activity className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-slate-900">MedPulse Menu</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Links scroll container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand-600"
              >
                Home
              </Link>

              <div className="pt-2 pb-1">
                <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Product & Features
                </span>
              </div>
              <Link
                to="/features"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand-600"
              >
                All Features
              </Link>
              <Link
                to="/features/patients"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 pl-6"
              >
                Patient Management
              </Link>
              <Link
                to="/features/appointments"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 pl-6"
              >
                Appointment Scheduling
              </Link>
              <Link
                to="/features/prescriptions"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 pl-6"
              >
                Digital Prescriptions
              </Link>
              <Link
                to="/features/billing"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 pl-6"
              >
                Billing & Payments
              </Link>
              <Link
                to="/features/expenses"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 pl-6"
              >
                Expenses & Cash Accounts
              </Link>
              <Link
                to="/features/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 pl-6"
              >
                Executive Dashboard
              </Link>

              <div className="pt-2 pb-1">
                <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Quick Navigation
                </span>
              </div>
              <a
                href="/#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand-600"
              >
                How It Works
              </a>
              <a
                href="/#benefits"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand-600"
              >
                Benefits by Role
              </a>
              <Link
                to="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand-600"
              >
                Pricing Framework
              </Link>
              <a
                href="/#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand-600"
              >
                FAQ
              </a>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand-600"
              >
                Contact Sales
              </Link>
            </div>

            {/* Mobile Drawer Bottom Actions */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2">
              <Link
                to="/request-demo"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm"
              >
                <span>Request a Demo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg"
              >
                <LogIn className="w-4 h-4 text-slate-500" />
                <span>Sign In / Launch ERP</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
