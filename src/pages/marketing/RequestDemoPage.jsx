import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useMarketingSEO } from '../../utils/seo';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  Play,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';
import { validateDemoForm } from '../../utils/formValidation';

export const RequestDemoPage = () => {
  useMarketingSEO({
    title: 'Request a Demo — MedPulse Clinic ERP',
    description:
      'Schedule a personalized demonstration of MedPulse Clinic ERP or test drive the live browser prototype.',
  });

  const [searchParams] = useSearchParams();
  const preselectedPlan = searchParams.get('plan') || '';

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    clinicName: '',
    workEmail: '',
    phoneNumber: '',
    city: '',
    numberOfDoctors: preselectedPlan === 'solo-practice' ? '1 Doctor (Solo Practice)' : '2-5 Doctors',
    preferredContactMethod: 'Email',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear specific error on change
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { isValid, errors: validationErrors } = validateDemoForm(formData);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    // Simulate async submission with honest frontend prototype feedback
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedData({ ...formData, submittedAt: new Date().toLocaleTimeString() });
    }, 800);
  };

  const handleReset = () => {
    setSubmittedData(null);
    setFormData({
      fullName: '',
      clinicName: '',
      workEmail: '',
      phoneNumber: '',
      city: '',
      numberOfDoctors: '2-5 Doctors',
      preferredContactMethod: 'Email',
      message: '',
    });
    setErrors({});
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold uppercase tracking-wider">
            <span>Schedule a Consultation</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Request a Guided Product Demo
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            See how MedPulse Clinic ERP simplifies scheduling, clinical prescribing, and financial
            tracking for your specific medical practice.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Form or Success Confirmation (7 cols) */}
          <div className="lg:col-span-7">
            {submittedData ? (
              /* Honest Simulated Submission Confirmation State */
              <div className="bg-white rounded-3xl p-8 sm:p-10 border border-emerald-200 shadow-lg space-y-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
                </div>

                <div className="text-center space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 inline-block">
                    Demonstration Submission Recorded
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900">
                    Thank You, {submittedData.fullName}!
                  </h2>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    Your demo request for{' '}
                    <strong className="text-slate-900">{submittedData.clinicName}</strong> has been
                    simulated successfully at {submittedData.submittedAt}.
                  </p>
                </div>

                {/* Submitted Summary Receipt Box */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-200">
                    Recorded Form Details
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-700">
                    <div>
                      <span className="text-slate-400 block">Work Email:</span>
                      <span className="font-semibold">{submittedData.workEmail}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Phone:</span>
                      <span className="font-semibold">{submittedData.phoneNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Location:</span>
                      <span className="font-semibold">{submittedData.city}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Doctor Seats:</span>
                      <span className="font-semibold">{submittedData.numberOfDoctors}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Preferred Contact:</span>
                      <span className="font-semibold">{submittedData.preferredContactMethod}</span>
                    </div>
                  </div>
                  {submittedData.message && (
                    <div className="pt-2 border-t border-slate-200 text-slate-600">
                      <span className="text-slate-400 block mb-0.5">Notes:</span>
                      <p className="italic">"{submittedData.message}"</p>
                    </div>
                  )}
                </div>

                {/* Honest Prototype Notice */}
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p>
                    <strong>Prototype Demonstration Note:</strong> As this is a client-side
                    evaluation build running without a remote backend server, this submission was
                    processed in your local browser sandbox. No real email or telemetric lead was
                    transmitted to external servers.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link
                    to="/dashboard"
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md text-sm transition-colors"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Launch Live Browser ERP</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 text-sm transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Submit Another Request</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Request Demo Form */
              <form
                onSubmit={handleSubmit}
                noValidate
                className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-5"
              >
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-xl font-bold text-slate-900">Clinic & Contact Details</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Fill in your practice information to receive a tailored feature walkthrough.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Dr. Alexander Wright"
                      className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border rounded-xl shadow-2xs focus:outline-none focus:ring-2 ${
                        errors.fullName
                          ? 'border-rose-400 focus:ring-rose-200'
                          : 'border-slate-300 focus:ring-brand-200 focus:border-brand-500'
                      }`}
                    />
                    {errors.fullName && (
                      <span className="text-[11px] text-rose-600 font-medium block">
                        {errors.fullName}
                      </span>
                    )}
                  </div>

                  {/* Clinic Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      Clinic / Practice Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="clinicName"
                      value={formData.clinicName}
                      onChange={handleChange}
                      placeholder="Apex Heart & Vascular Clinic"
                      className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border rounded-xl shadow-2xs focus:outline-none focus:ring-2 ${
                        errors.clinicName
                          ? 'border-rose-400 focus:ring-rose-200'
                          : 'border-slate-300 focus:ring-brand-200 focus:border-brand-500'
                      }`}
                    />
                    {errors.clinicName && (
                      <span className="text-[11px] text-rose-600 font-medium block">
                        {errors.clinicName}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Work Email */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      Work Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="workEmail"
                      value={formData.workEmail}
                      onChange={handleChange}
                      placeholder="dr.wright@apexclinic.com"
                      className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border rounded-xl shadow-2xs focus:outline-none focus:ring-2 ${
                        errors.workEmail
                          ? 'border-rose-400 focus:ring-rose-200'
                          : 'border-slate-300 focus:ring-brand-200 focus:border-brand-500'
                      }`}
                    />
                    {errors.workEmail && (
                      <span className="text-[11px] text-rose-600 font-medium block">
                        {errors.workEmail}
                      </span>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="+1 (555) 019-2834"
                      className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border rounded-xl shadow-2xs focus:outline-none focus:ring-2 ${
                        errors.phoneNumber
                          ? 'border-rose-400 focus:ring-rose-200'
                          : 'border-slate-300 focus:ring-brand-200 focus:border-brand-500'
                      }`}
                    />
                    {errors.phoneNumber && (
                      <span className="text-[11px] text-rose-600 font-medium block">
                        {errors.phoneNumber}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* City */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      City / Location <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Chicago, IL"
                      className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border rounded-xl shadow-2xs focus:outline-none focus:ring-2 ${
                        errors.city
                          ? 'border-rose-400 focus:ring-rose-200'
                          : 'border-slate-300 focus:ring-brand-200 focus:border-brand-500'
                      }`}
                    />
                    {errors.city && (
                      <span className="text-[11px] text-rose-600 font-medium block">
                        {errors.city}
                      </span>
                    )}
                  </div>

                  {/* Number of Doctors */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      Number of Doctors <span className="text-rose-500">*</span>
                    </label>
                    <select
                      name="numberOfDoctors"
                      value={formData.numberOfDoctors}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl shadow-2xs focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-500 text-slate-800"
                    >
                      <option value="1 Doctor (Solo Practice)">1 Doctor (Solo Practice)</option>
                      <option value="2-5 Doctors">2–5 Doctors (Polyclinic)</option>
                      <option value="6-15 Doctors">6–15 Doctors (Multi-Specialty)</option>
                      <option value="16+ Doctors">16+ Doctors (Medical Center / Network)</option>
                    </select>
                  </div>
                </div>

                {/* Preferred Contact Method */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Preferred Contact Method
                  </label>
                  <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-700">
                    {['Email', 'Phone Call', 'WhatsApp'].map((method) => (
                      <label key={method} className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="preferredContactMethod"
                          value={method}
                          checked={formData.preferredContactMethod === method}
                          onChange={handleChange}
                          className="text-brand-600 focus:ring-brand-500"
                        />
                        <span>{method}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Requirements / Message */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Specific Requirements or Questions (Optional)
                  </label>
                  <textarea
                    name="message"
                    rows={3}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your clinic setup, current pain points, or specific modules you want to review..."
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl shadow-2xs focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-500"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 disabled:opacity-60 shadow-md shadow-brand-500/20 text-sm transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Processing Request...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Demo Request</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: What to Expect & Immediate Browser Demo (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Instant Browser Demo Card */}
            <div className="bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900 rounded-3xl p-7 text-white shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-brand-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Zero Wait Time</span>
              </div>
              <h3 className="text-xl font-black text-white">Prefer to Explore Right Now?</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                You do not need to wait for a scheduled sales call. MedPulse includes an interactive
                browser sandbox pre-loaded with demonstration clinic data.
              </p>
              <div className="pt-2">
                <Link
                  to="/dashboard"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs sm:text-sm transition-all"
                >
                  <Play className="w-4 h-4 fill-slate-900" />
                  <span>Launch Live Browser ERP</span>
                </Link>
              </div>
            </div>

            {/* What Happens in a Demo Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900">What to Expect in Your Demo</h3>
              <div className="space-y-3 text-xs sm:text-sm text-slate-600">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>15-Minute Screen Share:</strong> Tailored specifically to your medical
                    specialty and consulting room count.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Workflow Review:</strong> See how patient check-in, prescription
                    writing, and itemized billing work sequentially.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Technical & Deployment Q&A:</strong> Discuss cloud vs. on-premise
                    server requirements and print template customization.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
