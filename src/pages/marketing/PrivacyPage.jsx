import React from 'react';
import { Link } from 'react-router-dom';
import { useMarketingSEO } from '../../utils/seo';
import { ShieldCheck, Lock, AlertTriangle, ArrowLeft } from 'lucide-react';

export const PrivacyPage = () => {
  useMarketingSEO({
    title: 'Privacy Policy & Data Handling — MedPulse Clinic ERP',
    description:
      'Information on how MedPulse Clinic ERP handles evaluation data, browser LocalStorage, and clinical privacy guidelines.',
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
            Privacy Policy & Data Handling Notice
          </h1>
          <p className="text-sm text-slate-500">Last Updated: October 2026</p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-8 text-sm text-slate-700 leading-relaxed">
          {/* Important Notice Callout */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Client-Side Evaluation Mode Disclaimer</span>
            </div>
            <p>
              This public web application is an interactive software demonstration. It is designed
              exclusively for feature exploration and workflow evaluation. It is NOT intended or
              certified as a live production electronic medical records repository for storing real
              identifiable patient health data.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">1. Data Storage in This Demonstration</h2>
            <p>
              In this public prototype build, all data created or edited (patients, appointments,
              prescriptions, invoices, and expenses) is stored strictly in your local browser’s
              LocalStorage.
            </p>
            <p>
              No clinical records, patient names, medical histories, or financial values are
              transmitted across the internet to MedPulse servers or any third-party analytics
              vendor.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">2. Demonstration Form Inquiries</h2>
            <p>
              When submitting forms on the "Request a Demo" or "Contact Us" pages within this
              demonstration application, input is processed locally in browser memory for simulated
              feedback and confirmation previews. No marketing tracking pixels or automated
              telemetry profiles are created.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">3. Production Deployment Data Guidelines</h2>
            <p>
              When MedPulse is licensed and deployed for an active clinic or hospital:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>
                <strong>Data Ownership:</strong> The clinic retains 100% exclusive ownership of all
                patient health records, prescription histories, and financial logs.
              </li>
              <li>
                <strong>Hosting Models:</strong> Practices can select on-premise installation
                (within clinic local area networks) or dedicated private cloud databases.
              </li>
              <li>
                <strong>Access Controls:</strong> Server-side role-based access control (RBAC) ensures
                receptionists, physicians, and financial auditors access only permitted data.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">4. Clearing Evaluation Data</h2>
            <p>
              You can wipe all demonstration records at any time by clearing your browser cache and
              LocalStorage, or by clicking the "Reset Data" shortcut inside the ERP settings panel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
