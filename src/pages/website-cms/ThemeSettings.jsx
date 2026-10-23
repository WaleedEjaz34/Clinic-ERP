import React, { useState } from 'react';
import {
  Palette,
  Check,
  RotateCcw,
  Save,
  Sparkles,
  Layout,
  Type,
  FolderOpen,
  Eye,
  Info,
} from 'lucide-react';
import { useWebsiteCMS } from '../../context/WebsiteCMSContext';
import { CMSPageHeader } from '../../components/cms/CMSPageHeader';
import { THEME_PRESETS } from '../../data/cmsMockData';

export const ThemeSettings = () => {
  const { theme, applyThemePreset, updateTheme, resetTheme, openMediaPicker } = useWebsiteCMS();

  const [formData, setFormData] = useState({ ...theme });

  const handlePresetSelect = (presetKey) => {
    const preset = THEME_PRESETS[presetKey];
    if (preset) {
      setFormData((prev) => ({
        ...prev,
        ...preset,
        preset: presetKey,
      }));
    }
  };

  const handleColorChange = (field, color) => {
    setFormData((prev) => ({ ...prev, [field]: color }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateTheme(formData);
  };

  const handleReset = () => {
    resetTheme();
    setFormData(THEME_PRESETS['Medical Blue'] || { ...theme });
  };

  return (
    <div className="space-y-5">
      <CMSPageHeader
        title="Website Theme & Appearance"
        description="Design the visual identity, brand colors, typography, and styling for your public-facing clinic website without affecting the internal ERP panel."
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Reset to Default
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Theme</span>
            </button>
          </div>
        }
      />

      {/* Scope Disclaimer */}
      <div className="p-3.5 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-emerald-900 leading-relaxed">
          <span className="font-bold">Independent Public Website Theme:</span> Color and typography adjustments here are scoped solely to the public website preview at <code>/website-preview</code>. The clinical administration ERP maintains its optimized high-contrast design.
        </div>
      </div>

      {/* Preset Themes Cards */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <Palette className="w-4 h-4 text-brand-600" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
            Curated Healthcare Presets
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
          {Object.entries(THEME_PRESETS).map(([key, p]) => {
            const isSelected = formData.preset === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handlePresetSelect(key)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                  isSelected
                    ? 'border-brand-600 ring-2 ring-brand-500/20 bg-brand-50/30 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-brand-600 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
                <div className="flex items-center gap-1.5 mb-2">
                  <div
                    className="w-4 h-4 rounded-full shadow-2xs"
                    style={{ backgroundColor: p.primaryColor }}
                  />
                  <div
                    className="w-4 h-4 rounded-full shadow-2xs"
                    style={{ backgroundColor: p.secondaryColor }}
                  />
                  <div
                    className="w-4 h-4 rounded-full shadow-2xs"
                    style={{ backgroundColor: p.accentColor }}
                  />
                </div>
                <h4 className="text-xs font-bold text-slate-900">{key}</h4>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                  {p.headingFont}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Color & Style Customization (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Colors Panel */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
              Color Palette
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Primary Brand Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                    className="w-10 h-9 p-0.5 rounded-lg border border-slate-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.primaryColor}
                    onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Secondary / Header Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.secondaryColor}
                    onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                    className="w-10 h-9 p-0.5 rounded-lg border border-slate-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.secondaryColor}
                    onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Accent Highlights
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.accentColor}
                    onChange={(e) => handleColorChange('accentColor', e.target.value)}
                    className="w-10 h-9 p-0.5 rounded-lg border border-slate-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.accentColor}
                    onChange={(e) => handleColorChange('accentColor', e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Website Background
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.backgroundColor || '#f8fafc'}
                    onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                    className="w-10 h-9 p-0.5 rounded-lg border border-slate-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.backgroundColor || '#f8fafc'}
                    onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono uppercase"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Typography & Geometry */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
              Typography & Component Styling
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Headings Font
                </label>
                <select
                  value={formData.headingFont}
                  onChange={(e) => setFormData((prev) => ({ ...prev, headingFont: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  <option value="Inter">Inter (Clean Modern Sans)</option>
                  <option value="Outfit">Outfit (Bold Editorial)</option>
                  <option value="Plus Jakarta Sans">Plus Jakarta Sans (Contemporary)</option>
                  <option value="Roboto">Roboto (Crisp Healthcare)</option>
                  <option value="Poppins">Poppins (Friendly Geometric)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Body Font
                </label>
                <select
                  value={formData.bodyFont}
                  onChange={(e) => setFormData((prev) => ({ ...prev, bodyFont: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="System-UI">System Default</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Button Style
                </label>
                <select
                  value={formData.buttonStyle || 'rounded-xl'}
                  onChange={(e) => setFormData((prev) => ({ ...prev, buttonStyle: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  <option value="rounded-xl">Soft Rounded (Modern)</option>
                  <option value="rounded-full">Pill Shaped (Friendly)</option>
                  <option value="rounded-md">Sharp (Traditional Clinical)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Header Navigation Layout
                </label>
                <select
                  value={formData.headerLayout || 'standard'}
                  onChange={(e) => setFormData((prev) => ({ ...prev, headerLayout: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  <option value="standard">Standard (Logo Left, Menu Center, CTA Right)</option>
                  <option value="centered">Centered (Logo Centered, Links Below)</option>
                  <option value="slim">Slim (Compact Minimal)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Mockup Card Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
              Live Appearance Mockup
            </h3>
            <p className="text-[11px] text-slate-500">
              Real-time demonstration of selected palette, buttons, and card geometry:
            </p>

            {/* Mockup Card */}
            <div
              className="p-5 rounded-2xl border transition-all space-y-4"
              style={{
                backgroundColor: formData.backgroundColor || '#f8fafc',
                fontFamily: formData.bodyFont,
              }}
            >
              {/* Header Preview */}
              <div
                className="p-3 rounded-xl flex items-center justify-between text-white shadow-xs"
                style={{ backgroundColor: formData.secondaryColor }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center font-black text-xs text-white"
                    style={{ backgroundColor: formData.primaryColor }}
                  >
                    +
                  </div>
                  <span
                    className="text-xs font-bold tracking-tight"
                    style={{ fontFamily: formData.headingFont }}
                  >
                    MedPulse Clinic
                  </span>
                </div>
                <div
                  className={`px-2.5 py-1 text-[10px] font-bold text-white shadow-xs ${
                    formData.buttonStyle === 'rounded-full' ? 'rounded-full' : 'rounded-lg'
                  }`}
                  style={{ backgroundColor: formData.primaryColor }}
                >
                  Book Visit
                </div>
              </div>

              {/* Hero Banner Mock */}
              <div
                className="p-5 rounded-2xl text-white space-y-2.5 shadow-sm"
                style={{
                  background: `linear-gradient(135deg, ${formData.secondaryColor} 0%, ${formData.primaryColor} 100%)`,
                }}
              >
                <span
                  className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
                  style={{ backgroundColor: `${formData.accentColor}33`, color: formData.accentColor }}
                >
                  Leading Patient Care
                </span>
                <h4
                  className="text-sm font-black leading-tight"
                  style={{ fontFamily: formData.headingFont }}
                >
                  Excellence in Clinical Health & Compassion
                </h4>
                <p className="text-[11px] opacity-90 leading-relaxed">
                  State-of-the-art diagnostic testing and world-class doctors dedicated to your family.
                </p>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    className={`px-3 py-1.5 text-xs font-bold shadow-xs transition-transform ${
                      formData.buttonStyle === 'rounded-full' ? 'rounded-full' : 'rounded-xl'
                    }`}
                    style={{
                      backgroundColor: formData.accentColor,
                      color: '#ffffff',
                    }}
                  >
                    Explore Services
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-1.5 text-xs font-bold border border-white/40 text-white ${
                      formData.buttonStyle === 'rounded-full' ? 'rounded-full' : 'rounded-xl'
                    }`}
                  >
                    Meet Doctors
                  </button>
                </div>
              </div>

              {/* Sample Card */}
              <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-1.5">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: formData.primaryColor }}
                  />
                  <h5
                    className="text-xs font-bold text-slate-900"
                    style={{ fontFamily: formData.headingFont }}
                  >
                    Cardiology & Health Check
                  </h5>
                </div>
                <p className="text-[11px] text-slate-500">
                  Comprehensive heart health screenings and non-invasive consultations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
