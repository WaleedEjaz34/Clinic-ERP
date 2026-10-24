import React, { useState } from 'react';
import {
  UserPlus,
  CalendarPlus,
  Stethoscope,
  FileText,
  Receipt,
  CreditCard,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Printer,
  ShieldCheck,
} from 'lucide-react';

const WORKFLOW_STEPS = [
  {
    step: 1,
    title: 'Register Patient',
    role: 'Receptionist',
    icon: UserPlus,
    shortDesc: 'Instant demographic capture with auto-generated MRN.',
    artifactType: 'patient-mrn',
    artifactTitle: 'Patient Digital Identity Card',
    artifactData: {
      name: 'Sarah Jenkins',
      mrn: 'MED-2026-0842',
      phone: '+1 (555) 234-8901',
      blood: 'B Positive',
      tag: 'New OPD Profile Created',
    },
  },
  {
    step: 2,
    title: 'Schedule & Token',
    role: 'Front Desk',
    icon: CalendarPlus,
    shortDesc: 'Doctor slot allocation with sequential queue token.',
    artifactType: 'queue-token',
    artifactTitle: 'Waiting Room Queue Token',
    artifactData: {
      token: '#03',
      patient: 'Emily Watson',
      doctor: 'Dr. Sarah Mitchell',
      time: '10:00 AM',
      status: 'In-Consultation',
    },
  },
  {
    step: 3,
    title: 'Consultation',
    role: 'Physician',
    icon: Stethoscope,
    shortDesc: 'Review patient history, vital stats, and clinical notes.',
    artifactType: 'clinical-vitals',
    artifactTitle: 'Physician Clinical Chart',
    artifactData: {
      patient: 'Robert Chen (48Y/M)',
      vitals: 'BP: 138/88 mmHg | Pulse: 74 bpm',
      notes: 'Essential Hypertension review. Patient reports mild dizziness.',
      status: 'Active Consultation',
    },
  },
  {
    step: 4,
    title: 'Digital Prescription',
    role: 'Doctor',
    icon: FileText,
    shortDesc: 'Select formulary medications with dosage & lab orders.',
    artifactType: 'rx-slip',
    artifactTitle: 'Standardized Clinic Rx Slip',
    artifactData: {
      rxNo: 'RX-2026-00389',
      medicines: 'Amlodipine 5mg (OD) + Atorvastatin 20mg (HS)',
      instructions: 'After breakfast for 30 days',
      lab: 'Fasting Lipid Profile',
    },
  },
  {
    step: 5,
    title: 'Itemized Invoicing',
    role: 'Cashier',
    icon: Receipt,
    shortDesc: 'Auto-fill doctor fee, add procedure items & discounts.',
    artifactType: 'itemized-bill',
    artifactTitle: 'Patient Consultation Invoice',
    artifactData: {
      invoiceNo: 'INV-2026-00412',
      doctorFee: '$80.00',
      procedureFee: '$45.00 (ECG)',
      discount: '-$10.00',
      netPayable: '$125.00',
    },
  },
  {
    step: 6,
    title: 'Record Payment',
    role: 'Billing',
    icon: CreditCard,
    shortDesc: 'Cash, card, or transfer with instant receipt printing.',
    artifactType: 'payment-receipt',
    artifactTitle: 'Settlement & Audit Receipt',
    artifactData: {
      receiptNo: 'RCP-2026-00412',
      amount: '$125.00 (Paid)',
      method: 'Cash Drawer #1',
      balance: '$0.00 Outstanding',
      status: 'Settled & Logged',
    },
  },
];

export const WorkflowSection = () => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const currentStep = WORKFLOW_STEPS[activeStepIndex];
  const StepIcon = currentStep.icon;

  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-white border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Structured Outpatient Journey</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How It Works: Connected Clinic Pipeline
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            One seamless lifecycle from front-desk check-in to doctor prescription and final payment receipt.
          </p>
        </div>

        {/* 6-Step Interactive Horizontal Stepper */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
          {WORKFLOW_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = activeStepIndex === idx;

            return (
              <button
                key={step.step}
                type="button"
                onClick={() => setActiveStepIndex(idx)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-brand-500/20'
                    : 'bg-slate-50/70 hover:bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono text-xs font-black px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-brand-500 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    0{step.step}
                  </span>
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider ${
                      isSelected ? 'text-brand-300' : 'text-slate-400'
                    }`}
                  >
                    {step.role}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-brand-400' : 'text-slate-500'}`} />
                    <span className="text-xs font-extrabold block leading-tight">{step.title}</span>
                  </div>
                  <p
                    className={`text-[11px] line-clamp-2 leading-snug ${
                      isSelected ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {step.shortDesc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Interactive Step Visualizer Card */}
        <div className="bg-gradient-to-br from-slate-50 to-brand-50/30 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Step Explanation (5 cols) */}
            <div className="lg:col-span-5 space-y-4 text-left">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700">
                <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse" />
                <span>Step {currentStep.step} of 6 • {currentStep.role}</span>
              </div>

              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {currentStep.title}
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                {currentStep.shortDesc} In MedPulse, every entry made here automatically syncs
                forward without requiring receptionists, doctors, or cashiers to re-type data.
              </p>

              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero duplicate entry • Instant cross-module sync</span>
              </div>
            </div>

            {/* Right: Realistic Artifact Generated at this Step (7 cols) */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                      <StepIcon className="w-4 h-4" />
                    </div>
                    <span className="font-extrabold text-slate-900">{currentStep.artifactTitle}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                    STAGE 0{currentStep.step} ARTIFACT
                  </span>
                </div>

                {/* Specific Artifact Preview */}
                {currentStep.artifactType === 'patient-mrn' && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-bold text-slate-900 block text-sm">
                          {currentStep.artifactData.name}
                        </span>
                        <span className="font-mono text-brand-600 text-[11px] font-bold">
                          MRN: {currentStep.artifactData.mrn}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                        Blood: {currentStep.artifactData.blood}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 flex justify-between">
                      <span>Phone: {currentStep.artifactData.phone}</span>
                      <span className="text-emerald-600 font-semibold">{currentStep.artifactData.tag}</span>
                    </div>
                  </div>
                )}

                {currentStep.artifactType === 'queue-token' && (
                  <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-mono font-black text-amber-900 bg-amber-200 px-2 py-0.5 rounded">
                          {currentStep.artifactData.token}
                        </span>
                        <div>
                          <span className="font-bold text-slate-900 block">
                            {currentStep.artifactData.patient}
                          </span>
                          <span className="text-[11px] text-slate-600">
                            {currentStep.artifactData.doctor} • {currentStep.artifactData.time}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                        {currentStep.artifactData.status}
                      </span>
                    </div>
                  </div>
                )}

                {currentStep.artifactType === 'clinical-vitals' && (
                  <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">{currentStep.artifactData.patient}</span>
                      <span className="font-mono font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
                        {currentStep.artifactData.vitals}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 italic">"{currentStep.artifactData.notes}"</p>
                  </div>
                )}

                {currentStep.artifactType === 'rx-slip' && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-brand-600">
                        {currentStep.artifactData.rxNo}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">Prints formatted Rx slip</span>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-200 text-[11px]">
                      <span className="font-bold text-slate-800 block">
                        {currentStep.artifactData.medicines}
                      </span>
                      <span className="text-slate-500 text-[10px]">
                        Timing: {currentStep.artifactData.instructions} | Lab: {currentStep.artifactData.lab}
                      </span>
                    </div>
                  </div>
                )}

                {currentStep.artifactType === 'itemized-bill' && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                    <div className="flex justify-between font-mono font-bold text-slate-900">
                      <span>{currentStep.artifactData.invoiceNo}</span>
                      <span className="text-emerald-600">Net: {currentStep.artifactData.netPayable}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-200">
                      <span>Doctor: {currentStep.artifactData.doctorFee}</span>
                      <span>Procedure: {currentStep.artifactData.procedureFee}</span>
                      <span className="text-emerald-600 font-semibold">{currentStep.artifactData.discount}</span>
                    </div>
                  </div>
                )}

                {currentStep.artifactType === 'payment-receipt' && (
                  <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-emerald-950 font-mono">
                        {currentStep.artifactData.receiptNo}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">
                        PAID & RECONCILED
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-700">
                      <span>Received: <strong>{currentStep.artifactData.amount}</strong></span>
                      <span>Target: {currentStep.artifactData.method}</span>
                      <span className="text-emerald-700 font-bold">{currentStep.artifactData.balance}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
