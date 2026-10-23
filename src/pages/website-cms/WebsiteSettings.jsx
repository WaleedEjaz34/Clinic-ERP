import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Save,
  RotateCcw,
  Eye,
  Globe,
  Building2,
  Clock,
  Share2,
  FileText,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Image as ImageIcon,
} from 'lucide-react';
import { useWebsiteCMS } from '../../context/WebsiteCMSContext';
import { CMSPageHeader } from '../../components/cms/CMSPageHeader';

export const WebsiteSettings = () => {
  const navigate = useNavigate();
  const { settings, updateSettings, resetSettings, openMediaPicker } = useWebsiteCMS();

  const [formData, setFormData] = useState({ ...settings });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings(formData);
  };

  const handleReset = () => {
    if (window.confirm('Reset all website settings back to defaults?')) {
      resetSettings();
      setFormData({ ...settings });
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <CMSPageHeader
        title="Website General Settings"
        subtitle="Manage clinic identity, contact details, operating hours, and social channels displayed across the public site."
        breadcrumbs={[{ label: 'Website Settings' }]}
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset Defaults</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/website-preview')}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4 text-slate-500" />
              <span>Preview</span>
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-sm shadow-brand-500/25 transition-all hover:shadow-glow cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>
        }
      />

      {/* 1. Clinic Brand & Identity */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Building2 className="w-4 h-4 text-brand-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            1. Clinic Identity & Branding
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Website Name
            </label>
            <input
              type="text"
              value={formData.websiteName || ''}
              onChange={(e) => handleChange('websiteName', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Clinic Legal Name
            </label>
            <input
              type="text"
              value={formData.clinicName || ''}
              onChange={(e) => handleChange('clinicName', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Clinic Tagline
            </label>
            <input
              type="text"
              value={formData.tagline || ''}
              onChange={(e) => handleChange('tagline', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Clinic Logo URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={formData.logoUrl || ''}
                onChange={(e) => handleChange('logoUrl', e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2"
              />
              <button
                type="button"
                onClick={() =>
                  openMediaPicker((url) => handleChange('logoUrl', url))
                }
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer"
              >
                Choose
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Favicon URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={formData.faviconUrl || ''}
                onChange={(e) => handleChange('faviconUrl', e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2"
              />
              <button
                type="button"
                onClick={() =>
                  openMediaPicker((url) => handleChange('faviconUrl', url))
                }
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer"
              >
                Choose
              </button>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Short Description (Appears in hero & search snippets)
            </label>
            <textarea
              value={formData.shortDescription || ''}
              onChange={(e) => handleChange('shortDescription', e.target.value)}
              rows={2}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              About Clinic (Appears in homepage about section & footer)
            </label>
            <textarea
              value={formData.aboutClinic || ''}
              onChange={(e) => handleChange('aboutClinic', e.target.value)}
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>
      </div>

      {/* 2. Contact & Physical Location */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            2. Contact Channels & Clinic Address
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Contact Email
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={formData.contactEmail || ''}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-9 pr-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Official Telephone / Landline
            </label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={formData.contactPhone || ''}
                onChange={(e) => handleChange('contactPhone', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-9 pr-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              WhatsApp Contact Number
            </label>
            <div className="relative">
              <MessageCircle className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={formData.whatsappNumber || ''}
                onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-9 pr-3 py-2"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Physical Clinic Address
            </label>
            <input
              type="text"
              value={formData.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Public Website URL
            </label>
            <input
              type="url"
              value={formData.websiteUrl || ''}
              onChange={(e) => handleChange('websiteUrl', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Google Maps Embed URL (Iframe src link)
            </label>
            <input
              type="text"
              value={formData.googleMapsEmbedUrl || ''}
              onChange={(e) => handleChange('googleMapsEmbedUrl', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 font-mono"
            />
          </div>
        </div>
      </div>

      {/* 3. Business Hours & Booking Instructions */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Clock className="w-4 h-4 text-blue-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            3. Business Schedule & Booking Guidelines
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Opening Days
            </label>
            <input
              type="text"
              value={formData.openingDays || ''}
              onChange={(e) => handleChange('openingDays', e.target.value)}
              placeholder="e.g. Monday – Saturday"
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Daily Opening Time
            </label>
            <input
              type="text"
              value={formData.openingTime || ''}
              onChange={(e) => handleChange('openingTime', e.target.value)}
              placeholder="08:30 AM"
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Daily Closing Time
            </label>
            <input
              type="text"
              value={formData.closingTime || ''}
              onChange={(e) => handleChange('closingTime', e.target.value)}
              placeholder="09:00 PM"
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Emergency Contact Hotline
            </label>
            <input
              type="text"
              value={formData.emergencyContact || ''}
              onChange={(e) => handleChange('emergencyContact', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2"
            />
          </div>

          <div className="sm:col-span-4">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Consultation Booking Instructions (Shown to patients on booking page)
            </label>
            <textarea
              value={formData.bookingInstructions || ''}
              onChange={(e) => handleChange('bookingInstructions', e.target.value)}
              rows={2}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2.5"
            />
          </div>
        </div>
      </div>

      {/* 4. Social Media Links */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Share2 className="w-4 h-4 text-purple-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            4. Social Media Channels
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Facebook URL
            </label>
            <input
              type="url"
              value={formData.facebookUrl || ''}
              onChange={(e) => handleChange('facebookUrl', e.target.value)}
              placeholder="https://facebook.com/..."
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Instagram URL
            </label>
            <input
              type="url"
              value={formData.instagramUrl || ''}
              onChange={(e) => handleChange('instagramUrl', e.target.value)}
              placeholder="https://instagram.com/..."
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              YouTube Channel URL
            </label>
            <input
              type="url"
              value={formData.youtubeUrl || ''}
              onChange={(e) => handleChange('youtubeUrl', e.target.value)}
              placeholder="https://youtube.com/@..."
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              LinkedIn Profile URL
            </label>
            <input
              type="url"
              value={formData.linkedinUrl || ''}
              onChange={(e) => handleChange('linkedinUrl', e.target.value)}
              placeholder="https://linkedin.com/company/..."
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* 5. Footer Information */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <FileText className="w-4 h-4 text-slate-700" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            5. Footer Details & Copyright
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Footer Description
            </label>
            <textarea
              value={formData.footerDescription || ''}
              onChange={(e) => handleChange('footerDescription', e.target.value)}
              rows={2}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2.5"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Copyright Notice
            </label>
            <input
              type="text"
              value={formData.copyrightText || ''}
              onChange={(e) => handleChange('copyrightText', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Footer Telephone / Direct Line
            </label>
            <input
              type="text"
              value={formData.footerPhone || ''}
              onChange={(e) => handleChange('footerPhone', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/25 transition-all hover:scale-[1.02] cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save All Settings</span>
        </button>
      </div>
    </form>
  );
};
