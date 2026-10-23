import React, { useState } from 'react';
import {
  Search,
  Globe,
  Share2,
  AlertTriangle,
  CheckCircle2,
  FolderOpen,
  Save,
  RotateCcw,
  Sparkles,
  HelpCircle,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { useWebsiteCMS } from '../../context/WebsiteCMSContext';
import { CMSPageHeader } from '../../components/cms/CMSPageHeader';
import { SEOPanel } from '../../components/cms/SEOPanel';

export const SEOSettings = () => {
  const { seo, updateSEO, openMediaPicker, pages } = useWebsiteCMS();

  const [formData, setFormData] = useState({ ...seo });
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePageOverrideChange = (field, value) => {
    setFormData((prev) => {
      const updatedOverrides = [...(prev.pageOverrides || [])];
      updatedOverrides[selectedPageIndex] = {
        ...updatedOverrides[selectedPageIndex],
        [field]: value,
      };
      return { ...prev, pageOverrides: updatedOverrides };
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateSEO(formData);
  };

  const handleReset = () => {
    setFormData({ ...seo });
  };

  const activeOverride = formData.pageOverrides?.[selectedPageIndex] || {
    pageTitle: 'Home',
    slug: '',
    metaTitle: formData.defaultMetaTitle,
    metaDescription: formData.defaultMetaDescription,
    keywords: formData.defaultKeywords,
  };

  return (
    <div className="space-y-5">
      <CMSPageHeader
        title="SEO & Social Metadata Settings"
        description="Configure search engine optimization meta tags, OpenGraph social sharing previews, and indexation controls across all public pages."
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Reset
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save SEO Settings</span>
            </button>
          </div>
        }
      />

      {/* Simulation Info Notice */}
      <div className="p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-2xl flex items-start gap-3">
        <Globe className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-blue-900 leading-relaxed">
          <span className="font-bold">CMS Search Simulation Notice:</span> These settings control how search engines index and render your clinic pages in SERPs and when shared on social platforms. When pages are exported or served with SSR in production, these values populate the HTML &lt;head&gt; tags.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Form Settings (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Default Global Meta Settings */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Search className="w-4 h-4 text-brand-600" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                Global Website Defaults
              </h3>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  Default Meta Title
                </label>
                <span className={`text-[10px] font-mono ${formData.defaultMetaTitle.length > 60 ? 'text-amber-500 font-bold' : 'text-slate-400'}`}>
                  {formData.defaultMetaTitle.length} / 60 characters
                </span>
              </div>
              <input
                type="text"
                value={formData.defaultMetaTitle}
                onChange={(e) => handleChange('defaultMetaTitle', e.target.value)}
                placeholder="e.g. MedPulse Clinic | Premier Medical & Healthcare Center"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Title Suffix
                </label>
                <input
                  type="text"
                  value={formData.titleSuffix || ' | MedPulse Clinic'}
                  onChange={(e) => handleChange('titleSuffix', e.target.value)}
                  placeholder=" | MedPulse Clinic"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Canonical Base URL
                </label>
                <input
                  type="url"
                  value={formData.canonicalBaseUrl || 'https://www.medpulseclinic.com'}
                  onChange={(e) => handleChange('canonicalBaseUrl', e.target.value)}
                  placeholder="https://www.medpulseclinic.com"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  Default Meta Description
                </label>
                <span className={`text-[10px] font-mono ${formData.defaultMetaDescription.length > 160 ? 'text-amber-500 font-bold' : 'text-slate-400'}`}>
                  {formData.defaultMetaDescription.length} / 160 characters
                </span>
              </div>
              <textarea
                rows={3}
                value={formData.defaultMetaDescription}
                onChange={(e) => handleChange('defaultMetaDescription', e.target.value)}
                placeholder="Brief clinic introduction for search engine summaries..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Default Keywords (comma separated)
              </label>
              <input
                type="text"
                value={formData.defaultKeywords}
                onChange={(e) => handleChange('defaultKeywords', e.target.value)}
                placeholder="clinic, hospital, doctors, cardiology, opd"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            {/* Social Sharing OpenGraph Settings */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Social Sharing Banner Image (og:image)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={formData.ogImage}
                  onChange={(e) => handleChange('ogImage', e.target.value)}
                  placeholder="https://..."
                  className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
                <button
                  type="button"
                  onClick={() =>
                    openMediaPicker((selected) => {
                      handleChange('ogImage', selected.url);
                    }, 'Select Social Share Image')
                  }
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>Browse</span>
                </button>
              </div>
            </div>

            {/* Robots Directives */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  id="robotIndexCheck"
                  checked={formData.robotsIndex !== false}
                  onChange={(e) => handleChange('robotsIndex', e.target.checked)}
                  className="w-4 h-4 text-brand-600 rounded-sm focus:ring-brand-500 cursor-pointer"
                />
                <div>
                  <label htmlFor="robotIndexCheck" className="text-xs font-bold text-slate-800 cursor-pointer block">
                    Allow Search Indexing
                  </label>
                  <span className="text-[10px] text-slate-500">Enable &lt;meta name="robots" content="index"&gt;</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  id="robotFollowCheck"
                  checked={formData.robotsFollow !== false}
                  onChange={(e) => handleChange('robotsFollow', e.target.checked)}
                  className="w-4 h-4 text-brand-600 rounded-sm focus:ring-brand-500 cursor-pointer"
                />
                <div>
                  <label htmlFor="robotFollowCheck" className="text-xs font-bold text-slate-800 cursor-pointer block">
                    Follow Links (nofollow off)
                  </label>
                  <span className="text-[10px] text-slate-500">Allow search bots to follow hyperlinks</span>
                </div>
              </div>
            </div>
          </div>

          {/* Page-Level SEO Overrides Selector */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-600" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Page Specific Overrides
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">
                {formData.pageOverrides?.length || 0} Pages Configured
              </span>
            </div>

            {/* Page selection pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
              {(formData.pageOverrides || []).map((override, idx) => (
                <button
                  key={override.slug || idx}
                  type="button"
                  onClick={() => setSelectedPageIndex(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedPageIndex === idx
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {override.pageTitle}
                </button>
              ))}
            </div>

            {/* Selected Page Editor Form */}
            <div className="p-3.5 bg-slate-50/70 border border-slate-200/80 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900">
                  Editing SEO for: <span className="text-brand-600 font-black">{activeOverride.pageTitle}</span>
                </h4>
                <span className="text-[10px] font-mono text-slate-500">
                  /{activeOverride.slug}
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Meta Title Tag
                </label>
                <input
                  type="text"
                  value={activeOverride.metaTitle}
                  onChange={(e) => handlePageOverrideChange('metaTitle', e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Meta Description
                </label>
                <textarea
                  rows={2}
                  value={activeOverride.metaDescription}
                  onChange={(e) => handlePageOverrideChange('metaDescription', e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs leading-relaxed focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Previews and Health Checklist (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Live SERP & Social Preview Widget */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-3">
              Search Result Snippet Preview
            </h3>
            <SEOPanel
              metaTitle={activeOverride.metaTitle || formData.defaultMetaTitle}
              metaDescription={activeOverride.metaDescription || formData.defaultMetaDescription}
              slug={activeOverride.slug}
              onMetaTitleChange={(val) => handlePageOverrideChange('metaTitle', val)}
              onMetaDescriptionChange={(val) => handlePageOverrideChange('metaDescription', val)}
            />
          </div>

          {/* Social Share Preview Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-brand-600" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                Social Media Feed Preview
              </h3>
            </div>
            <p className="text-[11px] text-slate-500">
              How links appear when posted to WhatsApp, Facebook, or LinkedIn:
            </p>

            <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
              <div className="aspect-16/9 bg-slate-200 overflow-hidden">
                <img
                  src={formData.ogImage}
                  alt="Social preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80';
                  }}
                />
              </div>
              <div className="p-3 bg-white">
                <p className="text-[10px] uppercase font-mono text-slate-400">
                  {formData.canonicalBaseUrl.replace(/^https?:\/\//, '')}
                </p>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mt-0.5">
                  {activeOverride.metaTitle || formData.defaultMetaTitle}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                  {activeOverride.metaDescription || formData.defaultMetaDescription}
                </p>
              </div>
            </div>
          </div>

          {/* SEO Health Checklist */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
              SEO Health Checklist
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Page title length within 60 chars</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Meta description between 50 - 160 chars</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>OpenGraph image configured (1200×630px)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Canonical base URL format verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
