import React, { useState } from 'react';
import { useMarketingSEO } from '../../utils/seo';
import {
  Mail,
  Phone,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';
import { brandConfig } from '../../data/marketingContent';
import { validateContactForm } from '../../utils/formValidation';

export const ContactPage = () => {
  useMarketingSEO({
    title: 'Contact Sales & Support — MedPulse Clinic ERP',
    description:
      'Get in touch with the MedPulse Clinic ERP team for product demonstrations, technical inquiries, and clinic licensing questions.',
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    const { isValid, errors: validationErrors } = validateContactForm(formData);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedData({ ...formData, sentAt: new Date().toLocaleTimeString() });
    }, 700);
  };

  const handleReset = () => {
    setSubmittedData(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
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
            <span>Direct Inquiries</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Contact Our Sales & Support Team
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Have questions about software features, multi-doctor polyclinic licensing, or system
            customization? We are here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Form Column (7 cols) */}
          <div className="lg:col-span-7">
            {submittedData ? (
              <div className="bg-white rounded-3xl p-8 sm:p-10 border border-emerald-200 shadow-lg space-y-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
                </div>

                <div className="text-center space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 inline-block">
                    Inquiry Simulation Recorded
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900">
                    Message Received, {submittedData.name}!
                  </h2>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    Your simulated inquiry regarding "
                    <strong className="text-slate-900">{submittedData.subject}</strong>" was logged
                    at {submittedData.sentAt}.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p>
                    <strong>Demonstration Note:</strong> As this is an unhosted prototype
                    environment, messages are processed in your local browser state only. In
                    production, this form submits directly to our enterprise ticketing system.
                  </p>
                </div>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center justify-center gap-1.5 py-3 px-6 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 text-sm transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Send Another Inquiry</span>
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-5"
              >
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-xl font-bold text-slate-900">Send an Inquiry</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Our sales specialists respond to all clinic inquiries within one business day.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Dr. Eleanor Vance"
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border rounded-xl shadow-2xs focus:outline-none focus:ring-2 ${
                      errors.name
                        ? 'border-rose-400 focus:ring-rose-200'
                        : 'border-slate-300 focus:ring-brand-200 focus:border-brand-500'
                    }`}
                  />
                  {errors.name && (
                    <span className="text-[11px] text-rose-600 font-medium block">{errors.name}</span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="eleanor@vanceclinic.com"
                      className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border rounded-xl shadow-2xs focus:outline-none focus:ring-2 ${
                        errors.email
                          ? 'border-rose-400 focus:ring-rose-200'
                          : 'border-slate-300 focus:ring-brand-200 focus:border-brand-500'
                      }`}
                    />
                    {errors.email && (
                      <span className="text-[11px] text-rose-600 font-medium block">
                        {errors.email}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 019-4823"
                      className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border rounded-xl shadow-2xs focus:outline-none focus:ring-2 ${
                        errors.phone
                          ? 'border-rose-400 focus:ring-rose-200'
                          : 'border-slate-300 focus:ring-brand-200 focus:border-brand-500'
                      }`}
                    />
                    {errors.phone && (
                      <span className="text-[11px] text-rose-600 font-medium block">
                        {errors.phone}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Subject <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Question about multi-doctor consultation fees and billing"
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border rounded-xl shadow-2xs focus:outline-none focus:ring-2 ${
                      errors.subject
                        ? 'border-rose-400 focus:ring-rose-200'
                        : 'border-slate-300 focus:ring-brand-200 focus:border-brand-500'
                    }`}
                  />
                  {errors.subject && (
                    <span className="text-[11px] text-rose-600 font-medium block">
                      {errors.subject}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Provide details about your clinic requirements..."
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border rounded-xl shadow-2xs focus:outline-none focus:ring-2 ${
                      errors.message
                        ? 'border-rose-400 focus:ring-rose-200'
                        : 'border-slate-300 focus:ring-brand-200 focus:border-brand-500'
                    }`}
                  />
                  {errors.message && (
                    <span className="text-[11px] text-rose-600 font-medium block">
                      {errors.message}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 disabled:opacity-60 shadow-md text-sm transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Inquiry</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Contact Details Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Inquiry Channels
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">Sales Inquiries:</span>
                    <a
                      href={`mailto:${brandConfig.contact.salesEmail}`}
                      className="font-bold text-slate-800 hover:text-brand-600 transition-colors"
                    >
                      {brandConfig.contact.salesEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">Inquiry Phone Line:</span>
                    <span className="font-bold text-slate-800">
                      {brandConfig.contact.inquiryPhone}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">Support Hours:</span>
                    <span className="font-medium text-slate-700">
                      {brandConfig.contact.supportHours}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">Headquarters (Placeholder):</span>
                    <span className="font-medium text-slate-700">
                      {brandConfig.contact.officeAddress}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
