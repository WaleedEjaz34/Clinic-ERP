import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PanelsTopLeft,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Edit2,
  RotateCcw,
  Sparkles,
  Save,
  Check,
  X,
  Image as ImageIcon,
  Layout,
  ExternalLink,
} from 'lucide-react';
import { useWebsiteCMS } from '../../context/WebsiteCMSContext';
import { CMSPageHeader } from '../../components/cms/CMSPageHeader';
import { Modal } from '../../components/common/Modal';

export const HomepageBuilder = () => {
  const navigate = useNavigate();
  const {
    homepageSections,
    updateHomepageSection,
    toggleSectionVisibility,
    moveSection,
    resetHomepageSections,
    openMediaPicker,
  } = useWebsiteCMS();

  // Selected section for editing in modal
  const [editingSection, setEditingSection] = useState(null);
  const [sectionForm, setSectionForm] = useState({});

  const sortedSections = [...homepageSections].sort((a, b) => a.order - b.order);

  const handleOpenEdit = (sec) => {
    setEditingSection(sec);
    setSectionForm({ ...sec });
  };

  const handleSaveSection = (e) => {
    e.preventDefault();
    if (editingSection) {
      updateHomepageSection(editingSection.id, sectionForm);
      setEditingSection(null);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset homepage layout and section ordering to default?')) {
      resetHomepageSections();
    }
  };

  return (
    <div className="space-y-5">
      <CMSPageHeader
        title="Homepage Layout & Section Builder"
        subtitle="Organize, enable, reorder, and configure each section of the clinic public homepage without touching code."
        breadcrumbs={[{ label: 'Homepage Builder' }]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset Default Order</span>
            </button>

            <button
              onClick={() => navigate('/website-preview')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Preview Homepage</span>
            </button>
          </div>
        }
      />

      {/* Sections Ordering Interface */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between text-xs">
          <span className="font-extrabold text-slate-900 uppercase tracking-wider">
            Homepage Structure ({sortedSections.length} Sections)
          </span>
          <span className="text-slate-500 font-medium hidden sm:inline">
            Use <strong className="text-slate-800">Move Up / Down</strong> to reorder sections on the live website.
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {sortedSections.map((sec, idx) => (
            <div
              key={sec.id}
              className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                sec.enabled ? 'bg-white hover:bg-slate-50/70' : 'bg-slate-50/50 opacity-60'
              }`}
            >
              {/* Left: Order index & Section Info */}
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-bold font-mono text-xs flex items-center justify-center flex-shrink-0">
                  {idx + 1}
                </span>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">
                      {sec.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        sec.enabled
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}
                    >
                      {sec.enabled ? 'Visible' : 'Hidden'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                    {sec.id === 'hero' && `Hero: "${sec.title || 'Advanced Care'}"`}
                    {sec.id === 'about' && `About: "${sec.heading || 'Compassionate Care'}"`}
                    {sec.id === 'services' && 'Displays top featured medical specialties'}
                    {sec.id === 'doctors' && 'Displays consulting specialist doctor cards'}
                    {sec.id === 'whyChooseUs' && '4 key clinical pillars and guarantees'}
                    {sec.id === 'stats' && 'Highlights stats (18+ doctors, 35k patients, etc.)'}
                    {sec.id === 'cta' && 'Appointment booking prompt with phone hotline'}
                    {sec.id === 'testimonials' && 'Recent verified patient reviews'}
                    {sec.id === 'gallery' && 'Clinic facility photo grid'}
                    {sec.id === 'blog' && 'Recent doctor health articles and news'}
                    {sec.id === 'faqs' && 'Frequently asked patient questions accordion'}
                    {sec.id === 'contact' && 'Physical address, contact info and Google Map'}
                    {sec.id === 'footer' && 'Copyright, quick navigation and clinic info'}
                  </p>
                </div>
              </div>

              {/* Right: Actions (Move Up, Move Down, Toggle Visibility, Edit Content) */}
              <div className="flex items-center gap-1.5 self-end sm:self-center flex-shrink-0">
                {/* Move Up */}
                <button
                  onClick={() => moveSection(sec.id, 'up')}
                  disabled={idx === 0}
                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30 rounded-lg transition-colors cursor-pointer"
                  title="Move Up"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>

                {/* Move Down */}
                <button
                  onClick={() => moveSection(sec.id, 'down')}
                  disabled={idx === sortedSections.length - 1}
                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30 rounded-lg transition-colors cursor-pointer"
                  title="Move Down"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Toggle Visibility */}
                <button
                  onClick={() => toggleSectionVisibility(sec.id)}
                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer shadow-2xs ${
                    sec.enabled
                      ? 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                      : 'text-slate-400 bg-slate-100 border-slate-200 hover:text-slate-700'
                  }`}
                  title={sec.enabled ? 'Hide Section' : 'Show Section'}
                >
                  {sec.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                {/* Edit Section Content */}
                <button
                  onClick={() => handleOpenEdit(sec)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-700 border border-slate-200 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Configure</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section Content Configuration Modal */}
      {editingSection && (
        <Modal
          isOpen={true}
          onClose={() => setEditingSection(null)}
          title={`Configure ${editingSection.name}`}
          subtitle="Customize headings, copy, images, and button links for this homepage section."
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleSaveSection} className="space-y-4">
            {/* HERO SECTION CONFIG */}
            {editingSection.id === 'hero' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Main Banner Heading
                  </label>
                  <input
                    type="text"
                    value={sectionForm.title || ''}
                    onChange={(e) =>
                      setSectionForm((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={sectionForm.subtitle || ''}
                    onChange={(e) =>
                      setSectionForm((prev) => ({ ...prev, subtitle: e.target.value }))
                    }
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Description Text
                  </label>
                  <textarea
                    value={sectionForm.description || ''}
                    onChange={(e) =>
                      setSectionForm((prev) => ({ ...prev, description: e.target.value }))
                    }
                    rows={2}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hero Background Image URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={sectionForm.bgImage || ''}
                      onChange={(e) =>
                        setSectionForm((prev) => ({ ...prev, bgImage: e.target.value }))
                      }
                      className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        openMediaPicker((url) =>
                          setSectionForm((prev) => ({ ...prev, bgImage: url }))
                        )
                      }
                      className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer hover:bg-slate-800"
                    >
                      Pick Media
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Primary Button Text
                    </label>
                    <input
                      type="text"
                      value={sectionForm.primaryBtnText || ''}
                      onChange={(e) =>
                        setSectionForm((prev) => ({
                          ...prev,
                          primaryBtnText: e.target.value,
                        }))
                      }
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Primary Button Link
                    </label>
                    <input
                      type="text"
                      value={sectionForm.primaryBtnLink || ''}
                      onChange={(e) =>
                        setSectionForm((prev) => ({
                          ...prev,
                          primaryBtnLink: e.target.value,
                        }))
                      }
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Secondary Button Text
                    </label>
                    <input
                      type="text"
                      value={sectionForm.secondaryBtnText || ''}
                      onChange={(e) =>
                        setSectionForm((prev) => ({
                          ...prev,
                          secondaryBtnText: e.target.value,
                        }))
                      }
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Secondary Button Link
                    </label>
                    <input
                      type="text"
                      value={sectionForm.secondaryBtnLink || ''}
                      onChange={(e) =>
                        setSectionForm((prev) => ({
                          ...prev,
                          secondaryBtnLink: e.target.value,
                        }))
                      }
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Text Alignment
                    </label>
                    <select
                      value={sectionForm.textAlignment || 'left'}
                      onChange={(e) =>
                        setSectionForm((prev) => ({
                          ...prev,
                          textAlignment: e.target.value,
                        }))
                      }
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2"
                    >
                      <option value="left">Left Aligned</option>
                      <option value="center">Centered</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Dark Overlay Opacity ({sectionForm.overlayOpacity || 65}%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="90"
                      value={sectionForm.overlayOpacity || 65}
                      onChange={(e) =>
                        setSectionForm((prev) => ({
                          ...prev,
                          overlayOpacity: Number(e.target.value),
                        }))
                      }
                      className="w-full mt-2"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ABOUT SECTION CONFIG */}
            {editingSection.id === 'about' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={sectionForm.tagline || ''}
                    onChange={(e) =>
                      setSectionForm((prev) => ({ ...prev, tagline: e.target.value }))
                    }
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Heading
                  </label>
                  <input
                    type="text"
                    value={sectionForm.heading || ''}
                    onChange={(e) =>
                      setSectionForm((prev) => ({ ...prev, heading: e.target.value }))
                    }
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={sectionForm.description || ''}
                    onChange={(e) =>
                      setSectionForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Featured Image URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={sectionForm.image || ''}
                      onChange={(e) =>
                        setSectionForm((prev) => ({ ...prev, image: e.target.value }))
                      }
                      className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        openMediaPicker((url) =>
                          setSectionForm((prev) => ({ ...prev, image: url }))
                        )
                      }
                      className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold whitespace-nowrap"
                    >
                      Pick Media
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* GENERIC HEADING & SUBHEADING SECTIONS (Services, Doctors, Testimonials, Blog, FAQs, etc.) */}
            {['services', 'doctors', 'whyChooseUs', 'testimonials', 'gallery', 'blog', 'faqs', 'contact', 'cta'].includes(
              editingSection.id
            ) &&
              editingSection.id !== 'hero' &&
              editingSection.id !== 'about' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Section Heading
                    </label>
                    <input
                      type="text"
                      value={sectionForm.heading || ''}
                      onChange={(e) =>
                        setSectionForm((prev) => ({ ...prev, heading: e.target.value }))
                      }
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 font-bold"
                    />
                  </div>

                  {sectionForm.subheading !== undefined && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Subheading / Subtitle
                      </label>
                      <input
                        type="text"
                        value={sectionForm.subheading || ''}
                        onChange={(e) =>
                          setSectionForm((prev) => ({
                            ...prev,
                            subheading: e.target.value,
                          }))
                        }
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2"
                      />
                    </div>
                  )}

                  {sectionForm.description !== undefined && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Description Text
                      </label>
                      <textarea
                        value={sectionForm.description || ''}
                        onChange={(e) =>
                          setSectionForm((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        rows={2}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2.5"
                      />
                    </div>
                  )}

                  {sectionForm.buttonText !== undefined && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Button Text
                        </label>
                        <input
                          type="text"
                          value={sectionForm.buttonText || ''}
                          onChange={(e) =>
                            setSectionForm((prev) => ({
                              ...prev,
                              buttonText: e.target.value,
                            }))
                          }
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Button Destination
                        </label>
                        <input
                          type="text"
                          value={sectionForm.buttonLink || ''}
                          onChange={(e) =>
                            setSectionForm((prev) => ({
                              ...prev,
                              buttonLink: e.target.value,
                            }))
                          }
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingSection(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Save Section Changes
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
