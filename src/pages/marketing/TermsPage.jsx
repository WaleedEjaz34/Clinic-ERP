import React from 'react';
import { Link } from 'react-router-dom';
import { useMarketingSEO } from '../../utils/seo';
import { ArrowLeft, ShieldCheck, FileCheck } from 'lucide-react';

export const TermsPage = () => {
  useMarketingSEO({
    title: 'Terms of Service — MedPulse Clinic ERP',
    description:
      'Terms of service, evaluation usage boundaries, and licensing details for MedPulse Clinic ERP.',
  });

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Terms of Service & Evaluation Agreement
          </h1>
          <p className="text-sm text-slate-500">Effective Date: October 2026</p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-8 text-sm text-slate-700 leading-relaxed">
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">1. Nature of the Service</h2>
            <p>
              MedPulse Clinic ERP provides clinic management software for outpatient practices.
              This public web platform presents marketing materials and an interactive, client-side
              functional prototype for evaluation purposes.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">2. Evaluation Prototype Boundaries</h2>
            <p>
              The demonstration version accessible at this website operates within the user’s
              browser. Users acknowledge that:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>It is provided "as is" for feature demonstration and workflow review.</li>
              <li>It does not constitute certified clinical diagnostic software or medical advice.</li>
              <li>Actual patient records should not be input into the public evaluation sandbox.</li>
              <li>
                Local browser storage may be cleared upon clearing browser data or resetting state.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">3. Commercial Licensing & Production Use</h2>
            <p>
              Live operational deployment for active medical clinics requires a commercial software
              license agreement covering server installation, database setup, maintenance terms, and
              dedicated technical support.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">4. Intellectual Property</h2>
            <p>
              All software interfaces, branding, workflow architectures, and source code are the
              intellectual property of MedPulse Clinic ERP. Users may not copy, reverse-engineer, or
              redistribute proprietary modules without explicit written consent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
