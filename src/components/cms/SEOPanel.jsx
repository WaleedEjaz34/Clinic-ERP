import React from 'react';
import { Search, Share2, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const SEOPanel = ({
  metaTitle = '',
  metaDescription = '',
  slug = '',
  canonicalUrl = '',
  ogImage = '',
  onTitleChange,
  onDescriptionChange,
  onSlugChange,
  onCanonicalChange,
  onOgImageChange,
}) => {
  const titleLen = (metaTitle || '').length;
  const descLen = (metaDescription || '').length;

  const isTitleIdeal = titleLen >= 30 && titleLen <= 60;
  const isDescIdeal = descLen >= 80 && descLen <= 160;

  const displaySlug = (slug || 'page-slug').replace(/^\//, '');

  return (
    <div className="space-y-4">
      {/* Inputs */}
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-slate-700">Meta Title</label>
            <span
              className={`text-[10px] font-mono font-bold ${
                isTitleIdeal ? 'text-emerald-600' : 'text-slate-400'
              }`}
            >
              {titleLen}/60 characters {isTitleIdeal ? '✓ Ideal' : ''}
            </span>
          </div>
          <input
            type="text"
            value={metaTitle || ''}
            onChange={(e) => onTitleChange && onTitleChange(e.target.value)}
            placeholder="e.g. Specialist Cardiology Consultations | MedPulse Clinic Islamabad"
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-slate-700">Meta Description</label>
            <span
              className={`text-[10px] font-mono font-bold ${
                isDescIdeal ? 'text-emerald-600' : 'text-slate-400'
              }`}
            >
              {descLen}/160 characters {isDescIdeal ? '✓ Ideal' : ''}
            </span>
          </div>
          <textarea
            value={metaDescription || ''}
            onChange={(e) => onDescriptionChange && onDescriptionChange(e.target.value)}
            rows={2}
            placeholder="Concise summary for search engines and social media previews..."
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        {onSlugChange && (
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">URL Slug</label>
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-500 font-mono">
              <span className="text-slate-400">medpulseclinic.pk/</span>
              <input
                type="text"
                value={slug || ''}
                onChange={(e) => onSlugChange(e.target.value)}
                placeholder="page-slug"
                className="flex-1 bg-transparent text-slate-800 font-bold focus:outline-none"
              />
            </div>
          </div>
        )}

        {onOgImageChange && (
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Social Sharing Image (OG Image)
            </label>
            <input
              type="url"
              value={ogImage || ''}
              onChange={(e) => onOgImageChange(e.target.value)}
              placeholder="https://example.com/social-preview.jpg"
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2"
            />
          </div>
        )}
      </div>

      {/* Live Snippet Previews */}
      <div className="space-y-3 pt-3 border-t border-slate-200/80">
        {/* Google Search Snippet Preview */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <Search className="w-3.5 h-3.5 text-blue-600" />
            <span>Google Search Result Snippet Preview</span>
          </div>

          <div className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-2xs space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[9px]">
                M
              </span>
              <span className="truncate">https://medpulseclinic.pk › {displaySlug}</span>
            </div>
            <h4 className="text-sm font-semibold text-blue-700 hover:underline leading-snug cursor-pointer line-clamp-1">
              {metaTitle || 'Page Title — MedPulse Clinic'}
            </h4>
            <p className="text-xs text-slate-600 leading-snug line-clamp-2">
              {metaDescription ||
                'Comprehensive medical care, qualified specialist physicians, and diagnostic outpatient services at MedPulse Executive Clinic, Islamabad.'}
            </p>
          </div>
        </div>

        {/* Social Card Preview */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <Share2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Social Media Sharing Card Preview</span>
          </div>

          <div className="bg-white rounded-lg border border-slate-200/80 overflow-hidden shadow-2xs max-w-sm">
            {ogImage ? (
              <img
                src={ogImage}
                alt="OG Preview"
                className="w-full h-32 object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-24 bg-gradient-to-r from-brand-700 to-teal-700 flex items-center justify-center text-white text-xs font-bold">
                MedPulse Executive Healthcare Clinic
              </div>
            )}
            <div className="p-2.5 space-y-0.5">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                medpulseclinic.pk
              </span>
              <p className="text-xs font-bold text-slate-800 line-clamp-1">
                {metaTitle || 'MedPulse Clinic Islamabad'}
              </p>
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight">
                {metaDescription || 'Specialist doctor consultations and accredited diagnostics.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
