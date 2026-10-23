import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stethoscope,
  Eye,
  EyeOff,
  Edit2,
  Star,
  Check,
  Award,
  Globe,
  Languages,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useWebsiteCMS } from '../../context/WebsiteCMSContext';
import { CMSPageHeader } from '../../components/cms/CMSPageHeader';
import { Modal } from '../../components/common/Modal';
import { formatCurrency } from '../../utils/currency';

export const DoctorProfiles = () => {
  const navigate = useNavigate();
  const {
    publicDoctors,
    updateDoctorProfile,
    toggleDoctorWebsiteVisibility,
    toggleDoctorFeatured,
    openMediaPicker,
  } = useWebsiteCMS();

  // Edit Doctor Profile Modal State
  const [editingDoc, setEditingDoc] = useState(null);
  const [formData, setFormData] = useState({});

  const handleOpenEdit = (doc) => {
    setEditingDoc(doc);
    setFormData({
      ...doc,
      languagesSpokenStr: Array.isArray(doc.languagesSpoken)
        ? doc.languagesSpoken.join(', ')
        : doc.languagesSpoken || 'English, Urdu',
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!editingDoc) return;

    const languages = (formData.languagesSpokenStr || '')
      .split(',')
      .map((l) => l.trim())
      .filter(Boolean);

    updateDoctorProfile(editingDoc.doctorId, {
      ...formData,
      languagesSpoken: languages,
    });
    setEditingDoc(null);
  };

  return (
    <div className="space-y-5">
      <CMSPageHeader
        title="Public Doctor Profiles & Visibility"
        subtitle="Control which clinic doctors appear on the public website, customize their public biography, certifications, and highlighted doctor features."
        breadcrumbs={[{ label: 'Doctor Profiles' }]}
      />

      {/* Info Notice */}
      <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-2xl flex items-start gap-3 text-xs text-blue-900">
        <Stethoscope className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold">ERP Integration:</span> Doctor accounts are sourced from the existing clinical Doctors directory. Customizations made here apply to the <strong>public website only</strong> and do not modify clinical medical records or consultation tariff ledgers.
        </div>
      </div>

      {/* Doctors CMS Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {publicDoctors.map((doc) => (
          <div
            key={doc.doctorId}
            className={`bg-white rounded-2xl border p-4 shadow-card flex flex-col justify-between transition-all ${
              doc.showOnWebsite
                ? 'border-slate-200/90 hover:border-brand-300'
                : 'border-slate-200/60 bg-slate-50/60 opacity-60'
            }`}
          >
            <div>
              {/* Top row: Avatar, Name, Specialization */}
              <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
                <img
                  src={doc.avatar}
                  alt={doc.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-2xs flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm truncate">
                      {doc.name}
                    </span>
                    {doc.featuredDoctor && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
                        <Star className="w-3 h-3 fill-amber-500" />
                        <span>Featured</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-brand-600 font-semibold truncate mt-0.5">
                    {doc.specialization}
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono block">
                    ID: {doc.doctorId} • {doc.yearsOfExperience || 10}+ yrs exp
                  </span>
                </div>
              </div>

              {/* Bio summary */}
              <div className="py-3 space-y-2 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Qualifications
                  </span>
                  <p className="font-semibold text-slate-800 line-clamp-1">
                    {doc.qualifications}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Public Bio
                  </span>
                  <p className="text-slate-600 text-[11px] line-clamp-2 leading-relaxed">
                    {doc.publicBio || doc.bio}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Languages className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {Array.isArray(doc.languagesSpoken)
                        ? doc.languagesSpoken.join(', ')
                        : 'English, Urdu'}
                    </span>
                  </span>
                  <span className="font-bold text-slate-700">
                    Order: #{doc.displayOrder}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                {/* Toggle Show on Website */}
                <button
                  onClick={() => toggleDoctorWebsiteVisibility(doc.doctorId)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                    doc.showOnWebsite
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-slate-100 text-slate-500 border-slate-200 hover:text-slate-800'
                  }`}
                  title={doc.showOnWebsite ? 'Visible on Public Website' : 'Hidden from Public Website'}
                >
                  {doc.showOnWebsite ? (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Shown</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hidden</span>
                    </>
                  )}
                </button>

                {/* Toggle Featured */}
                <button
                  onClick={() => toggleDoctorFeatured(doc.doctorId)}
                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                    doc.featuredDoctor
                      ? 'bg-amber-50 text-amber-600 border-amber-200'
                      : 'bg-slate-50 text-slate-300 border-slate-200 hover:text-slate-600'
                  }`}
                  title={doc.featuredDoctor ? 'Remove Featured' : 'Mark as Featured on Homepage'}
                >
                  <Star className={`w-3.5 h-3.5 ${doc.featuredDoctor ? 'fill-amber-500' : ''}`} />
                </button>
              </div>

              <button
                onClick={() => handleOpenEdit(doc)}
                className="inline-flex items-center gap-1 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-2xs transition-colors cursor-pointer"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Public Doctor Profile Modal */}
      {editingDoc && (
        <Modal
          isOpen={true}
          onClose={() => setEditingDoc(null)}
          title={`Edit Public Profile — ${editingDoc.name}`}
          subtitle="Configure what website visitors see about this consultant doctor."
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Public Display Name
                </label>
                <input
                  type="text"
                  value={formData.publicDisplayName || formData.name || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      publicDisplayName: e.target.value,
                    }))
                  }
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Public Specialization
                </label>
                <input
                  type="text"
                  value={formData.specialization || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      specialization: e.target.value,
                    }))
                  }
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Public Qualifications & Degrees
                </label>
                <input
                  type="text"
                  value={formData.publicQualifications || formData.qualifications || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      publicQualifications: e.target.value,
                    }))
                  }
                  placeholder="e.g. MBBS, FCPS (Cardiology), MRCP (UK)"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 font-semibold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Professional Biography
                </label>
                <textarea
                  value={formData.publicBio || formData.bio || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, publicBio: e.target.value }))
                  }
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Years of Clinical Experience
                </label>
                <input
                  type="number"
                  value={formData.yearsOfExperience || 10}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      yearsOfExperience: Number(e.target.value),
                    }))
                  }
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Languages Spoken (Comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.languagesSpokenStr || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      languagesSpokenStr: e.target.value,
                    }))
                  }
                  placeholder="English, Urdu, Punjabi"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.displayOrder || 1}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      displayOrder: Number(e.target.value),
                    }))
                  }
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  OPD Consulting Hours (Public text)
                </label>
                <input
                  type="text"
                  value={formData.opdDays || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, opdDays: e.target.value }))
                  }
                  placeholder="e.g. Mon – Fri: 09:00 AM – 02:00 PM"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredDocModal"
                  checked={formData.featuredDoctor || false}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      featuredDoctor: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 text-brand-600 rounded cursor-pointer"
                />
                <label htmlFor="featuredDocModal" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Feature on Website Homepage
                </label>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="showOnWebsiteModal"
                  checked={formData.showOnWebsite !== false}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      showOnWebsite: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 text-brand-600 rounded cursor-pointer"
                />
                <label htmlFor="showOnWebsiteModal" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Show Profile on Public Website
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingDoc(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Save Doctor Profile
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
