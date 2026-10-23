import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarCheck,
  Phone,
  Mail,
  MapPin,
  Save,
  MessageSquare,
  CheckCircle2,
  Clock,
  Sparkles,
  Send,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { useWebsiteCMS } from '../../context/WebsiteCMSContext';
import { CMSPageHeader } from '../../components/cms/CMSPageHeader';

export const ContactSettings = () => {
  const navigate = useNavigate();
  const { appointmentContact, updateAppointmentContact } = useWebsiteCMS();

  const [formData, setFormData] = useState({ ...appointmentContact });

  // Simulated Test Form state
  const [testForm, setTestForm] = useState({
    name: 'Ahmed Tariq',
    email: 'ahmed@example.com',
    phone: '+92 300 1234567',
    message: 'Inquiring about consultation availability for cardiology screening.',
  });
  const [isTestSuccess, setIsTestSuccess] = useState(false);

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateAppointmentContact(formData);
  };

  const handleTestSubmit = (e) => {
    e.preventDefault();
    setIsTestSuccess(true);
    setTimeout(() => setIsTestSuccess(false), 5000);
  };

  return (
    <div className="space-y-6">
      <CMSPageHeader
        title="Appointments & Contact Page Settings"
        subtitle="Configure public consultation booking instructions, contact channels, and test the public website inquiry form."
        breadcrumbs={[{ label: 'Appointments & Contact' }]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/website-preview?page=contact-us')}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4 text-slate-500" />
              <span>Preview Contact</span>
            </button>
            <button
              onClick={() => navigate('/website-preview?page=book-appointment')}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4 text-slate-500" />
              <span>Preview Booking</span>
            </button>
          </div>
        }
      />

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Appointment Page Settings */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-brand-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                1. Public Appointment Page Configuration
              </h3>
            </div>
            <button
              type="button"
              onClick={() => navigate('/appointments')}
              className="text-xs text-brand-600 font-bold hover:underline flex items-center gap-1"
            >
              <span>Go to ERP Clinical Appointments</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Page Heading
              </label>
              <input
                type="text"
                value={formData.appointmentPageHeading || ''}
                onChange={(e) => handleChange('appointmentPageHeading', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Displayed Telephone Desk
              </label>
              <input
                type="text"
                value={formData.displayedContactNumber || ''}
                onChange={(e) => handleChange('displayedContactNumber', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Introduction Text
              </label>
              <textarea
                value={formData.appointmentIntroduction || ''}
                onChange={(e) => handleChange('appointmentIntroduction', e.target.value)}
                rows={2}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2.5"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Booking Instructions (Step-by-step guidance for visitors)
              </label>
              <textarea
                value={formData.bookingInstructions || ''}
                onChange={(e) => handleChange('bookingInstructions', e.target.value)}
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2.5"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Displayed Working Hours
              </label>
              <input
                type="text"
                value={formData.displayedWorkingHours || ''}
                onChange={(e) => handleChange('displayedWorkingHours', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Booking Button CTA Text
              </label>
              <input
                type="text"
                value={formData.appointmentCtaText || ''}
                onChange={(e) => handleChange('appointmentCtaText', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* 2. Contact Page Settings */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Mail className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              2. Public Contact Page Configuration
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Contact Page Heading
              </label>
              <input
                type="text"
                value={formData.contactPageHeading || ''}
                onChange={(e) => handleChange('contactPageHeading', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Contact Form Title
              </label>
              <input
                type="text"
                value={formData.contactFormHeading || ''}
                onChange={(e) => handleChange('contactFormHeading', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 font-semibold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Contact Intro Description
              </label>
              <textarea
                value={formData.contactDescription || ''}
                onChange={(e) => handleChange('contactDescription', e.target.value)}
                rows={2}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2.5"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Form Submission Success Message (Simulated alert for patient)
              </label>
              <input
                type="text"
                value={formData.contactFormSuccessMessage || ''}
                onChange={(e) => handleChange('contactFormSuccessMessage', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-sm shadow-brand-500/25 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>
        </div>
      </form>

      {/* 3. Interactive Contact Form Preview & Simulation */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-purple-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              3. Interactive Public Contact Form Preview
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Frontend test preview with live validation and simulated success message
          </span>
        </div>

        <div className="max-w-xl mx-auto bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
          <h4 className="font-extrabold text-sm text-slate-900">
            {formData.contactFormHeading || 'Send a Message to MedPulse Reception'}
          </h4>

          {isTestSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800 font-semibold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{formData.contactFormSuccessMessage}</span>
            </div>
          )}

          <form onSubmit={handleTestSubmit} className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={testForm.name}
                onChange={(e) => setTestForm({ ...testForm, name: e.target.value })}
                className="w-full bg-white border border-slate-200 text-xs rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={testForm.email}
                  onChange={(e) => setTestForm({ ...testForm, email: e.target.value })}
                  className="w-full bg-white border border-slate-200 text-xs rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={testForm.phone}
                  onChange={(e) => setTestForm({ ...testForm, phone: e.target.value })}
                  className="w-full bg-white border border-slate-200 text-xs rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Message / Inquired Service
              </label>
              <textarea
                value={testForm.message}
                onChange={(e) => setTestForm({ ...testForm, message: e.target.value })}
                rows={3}
                className="w-full bg-white border border-slate-200 text-xs rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Simulate Patient Submission</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
