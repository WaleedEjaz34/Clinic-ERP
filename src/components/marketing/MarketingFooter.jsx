import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Mail,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  ExternalLink,
  ArrowRight,
  Info,
  Server,
  Lock,
} from 'lucide-react';
import { brandConfig } from '../../data/marketingContent';

export const MarketingFooter = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 4-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand & Overview Column (2 cols wide on large screens) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-clinical-teal flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                <Activity className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-white">MedPulse</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-900/60 text-brand-300 border border-brand-700/50">
                  Clinic ERP
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              The modern, unified clinic management platform designed for outpatient clinics, solo
              practitioners, and specialist medical practices to coordinate patient care,
              scheduling, prescriptions, billing, and daily clinic finances.
            </p>

            {/* Architecture / Local Demo Transparency Notice */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1.5 max-w-sm">
              <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                <Info className="w-3.5 h-3.5 text-brand-400" />
                <span>Evaluation Prototype Mode</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-normal">
                This public version runs as a client-side prototype using browser LocalStorage. No
                remote patient data transmission or server dependencies required for evaluation.
              </p>
            </div>

            {/* Social links */}
            <div className="pt-2">
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Connect & Resources
              </div>
              <div className="flex items-center gap-3 text-xs">
                {brandConfig.socials.map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-brand-400 transition-colors"
                  >
                    {s.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Product & Modules Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Clinical Modules
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/features/patients"
                  className="hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>Patient Records</span>
                  <span className="text-[10px] text-brand-400 bg-brand-950/60 px-1.5 py-0.5 rounded border border-brand-900/50">
                    MRN
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/features/appointments" className="hover:text-white transition-colors">
                  Appointment Scheduling
                </Link>
              </li>
              <li>
                <Link to="/features/prescriptions" className="hover:text-white transition-colors">
                  Digital Prescriptions
                </Link>
              </li>
              <li>
                <Link to="/features/billing" className="hover:text-white transition-colors">
                  Patient Invoicing
                </Link>
              </li>
              <li>
                <Link to="/features/payments" className="hover:text-white transition-colors">
                  Payment Collection
                </Link>
              </li>
              <li>
                <Link to="/features/expenses" className="hover:text-white transition-colors">
                  Expense Management
                </Link>
              </li>
              <li>
                <Link to="/features/accounts" className="hover:text-white transition-colors">
                  Cash & Bank Ledgers
                </Link>
              </li>
              <li>
                <Link to="/features/dashboard" className="hover:text-white transition-colors">
                  Executive Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Roles Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Platform & Workflows
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/features" className="hover:text-white transition-colors">
                  All 12 ERP Features
                </Link>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-white transition-colors">
                  Consultation Workflow
                </a>
              </li>
              <li>
                <a href="/#roles" className="hover:text-white transition-colors">
                  Benefits by Team Role
                </a>
              </li>
              <li>
                <a href="/#financial-visibility" className="hover:text-white transition-colors">
                  Financial Visibility
                </a>
              </li>
              <li>
                <a href="/#security" className="hover:text-white transition-colors">
                  Architecture & Security
                </a>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-white transition-colors">
                  Pricing Framework
                </Link>
              </li>
              <li>
                <a href="/#faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1 mt-3"
                >
                  <span>Launch ERP System</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Sales & Contact Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Contact & Inquiries
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block text-slate-500">Sales Inquiries:</span>
                  <a
                    href={`mailto:${brandConfig.contact.salesEmail}`}
                    className="text-slate-300 hover:text-white transition-colors font-medium"
                  >
                    {brandConfig.contact.salesEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block text-slate-500">Phone Demonstration:</span>
                  <span className="text-slate-300 font-medium">
                    {brandConfig.contact.inquiryPhone}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block text-slate-500">Support Hours:</span>
                  <span className="text-slate-300">{brandConfig.contact.supportHours}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block text-slate-500">Headquarters (Placeholder):</span>
                  <span className="text-slate-300">{brandConfig.contact.officeAddress}</span>
                </div>
              </div>

              <div className="pt-3">
                <Link
                  to="/request-demo"
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-lg transition-colors"
                >
                  <span>Book Guided Demo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Legal & Disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {brandConfig.releaseYear} {brandConfig.name}. Designed for Healthcare Practices.
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Link to="/about" className="hover:text-slate-300 transition-colors">
              About MedPulse
            </Link>
            <Link to="/privacy" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-slate-300 transition-colors">
              Terms of Service
            </Link>
            <Link to="/contact" className="hover:text-slate-300 transition-colors">
              Contact Sales
            </Link>
            <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 text-[10px]">
              v{brandConfig.version}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
