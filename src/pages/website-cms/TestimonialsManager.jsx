import React, { useState, useMemo } from 'react';
import {
  MessageSquareQuote,
  Plus,
  Search,
  Star,
  StarHalf,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Check,
  X,
  Sparkles,
  User,
  FolderOpen,
  Calendar,
} from 'lucide-react';
import { useWebsiteCMS } from '../../context/WebsiteCMSContext';
import { CMSPageHeader } from '../../components/cms/CMSPageHeader';
import { ContentStatusBadge } from '../../components/cms/ContentStatusBadge';

export const TestimonialsManager = () => {
  const {
    testimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    toggleTestimonialFeatured,
    toggleTestimonialStatus,
    openMediaPicker,
  } = useWebsiteCMS();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterRating, setFilterRating] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    patientDisplayName: '',
    roleOrTreatment: '',
    rating: 5,
    testimonialText: '',
    displayDate: '',
    avatarUrl: '',
    featured: false,
    status: 'Published',
  });
  const [formErrors, setFormErrors] = useState({});

  // Delete State
  const [deletingId, setDeletingId] = useState(null);

  // Filtered Testimonials
  const filteredTestimonials = useMemo(() => {
    return testimonials.filter((t) => {
      const matchesSearch =
        t.patientDisplayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.testimonialText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.roleOrTreatment && t.roleOrTreatment.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = filterStatus === 'All' || t.status === filterStatus;
      const matchesRating =
        filterRating === 'All' || Number(t.rating) === Number(filterRating);
      return matchesSearch && matchesStatus && matchesRating;
    });
  }, [testimonials, searchQuery, filterStatus, filterRating]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      patientDisplayName: '',
      roleOrTreatment: '',
      rating: 5,
      testimonialText: '',
      displayDate: new Date().toISOString().split('T')[0],
      avatarUrl: '',
      featured: false,
      status: 'Published',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t) => {
    setEditingItem(t);
    setFormData({
      patientDisplayName: t.patientDisplayName,
      roleOrTreatment: t.roleOrTreatment || '',
      rating: Number(t.rating) || 5,
      testimonialText: t.testimonialText,
      displayDate: t.displayDate || new Date().toISOString().split('T')[0],
      avatarUrl: t.avatarUrl || '',
      featured: !!t.featured,
      status: t.status || 'Published',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.patientDisplayName.trim()) errors.patientDisplayName = 'Patient name is required';
    if (!formData.testimonialText.trim()) errors.testimonialText = 'Testimonial quote text is required';
    if (!formData.displayDate) errors.displayDate = 'Date is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingItem) {
      updateTestimonial(editingItem.id, formData);
    } else {
      addTestimonial(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5">
      <CMSPageHeader
        title="Patient Testimonials"
        description="Manage patient feedback, star ratings, and success stories highlighted on the homepage and review sections."
        action={
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Testimonial</span>
          </button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            {['All', 'Published', 'Draft', 'Archived'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  filterStatus === status
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Rating Filter */}
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="All">All Ratings (⭐)</option>
            <option value="5">5 Stars only</option>
            <option value="4">4 Stars only</option>
            <option value="3">3 Stars only</option>
          </select>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by patient name or quote..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>
      </div>

      {/* Testimonials List */}
      {filteredTestimonials.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-3">
            <MessageSquareQuote className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No Testimonials Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            {searchQuery || filterStatus !== 'All'
              ? 'No testimonials matched your current filters. Clear your filters to see all entries.'
              : 'Add positive patient feedback to foster trust on your clinic website.'}
          </p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Testimonial</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTestimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all p-4 flex flex-col justify-between"
            >
              <div>
                {/* Header: Rating & Status Badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= t.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                    <span className="text-[11px] font-bold text-slate-600 ml-1">
                      {t.rating}.0
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {t.featured && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-700 text-[10px] font-bold">
                        Featured
                      </span>
                    )}
                    <ContentStatusBadge status={t.status} size="xs" />
                  </div>
                </div>

                {/* Quote Text */}
                <p className="text-xs text-slate-700 italic leading-relaxed mb-4 line-clamp-4">
                  "{t.testimonialText}"
                </p>
              </div>

              {/* Bottom Meta & Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {t.avatarUrl ? (
                    <img
                      src={t.avatarUrl}
                      alt={t.patientDisplayName}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 text-xs font-bold">
                      {t.patientDisplayName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">
                      {t.patientDisplayName}
                    </h4>
                    <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                      {t.roleOrTreatment || 'Verified Patient'} • {t.displayDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleTestimonialFeatured(t.id)}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      t.featured
                        ? 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                    }`}
                    title={t.featured ? 'Unfeature from Homepage' : 'Feature on Homepage'}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(t)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-brand-50 transition-colors cursor-pointer"
                    title="Edit Review"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingId(t.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete Review"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <MessageSquareQuote className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    {editingItem ? 'Edit Testimonial' : 'Add Patient Testimonial'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Share real patient praise and experiences.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="p-5 space-y-4">
              {/* Patient Name & Treatment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Patient Display Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.patientDisplayName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, patientDisplayName: e.target.value }))
                    }
                    placeholder="e.g. Fatima Z. or Imran Khan"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                  {formErrors.patientDisplayName && (
                    <p className="text-[11px] text-rose-500 mt-1">{formErrors.patientDisplayName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Treatment / Department Tag
                  </label>
                  <input
                    type="text"
                    value={formData.roleOrTreatment}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, roleOrTreatment: e.target.value }))
                    }
                    placeholder="e.g. Dental Care, Pediatric OPD"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
              </div>

              {/* Rating & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Star Rating (1 - 5)
                  </label>
                  <div className="flex items-center gap-1.5 py-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
                        className="cursor-pointer transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= formData.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-2">
                      {formData.rating} Stars
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Display Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.displayDate}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, displayDate: e.target.value }))
                    }
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
              </div>

              {/* Testimonial Quote */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Testimonial Quote <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={formData.testimonialText}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, testimonialText: e.target.value }))
                  }
                  placeholder="The care received at MedPulse Clinic was exceptional..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
                {formErrors.testimonialText && (
                  <p className="text-[11px] text-rose-500 mt-1">{formErrors.testimonialText}</p>
                )}
              </div>

              {/* Avatar URL or Media Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Patient Avatar Photo (Optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formData.avatarUrl}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, avatarUrl: e.target.value }))
                    }
                    placeholder="https://..."
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      openMediaPicker((selected) => {
                        setFormData((prev) => ({ ...prev, avatarUrl: selected.url }));
                      }, 'Select Patient Avatar')
                    }
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>Browse</span>
                  </button>
                </div>
              </div>

              {/* Status & Featured Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Publication Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  >
                    <option value="Published">Published (Public)</option>
                    <option value="Draft">Draft (Internal)</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 mt-auto">
                  <input
                    type="checkbox"
                    id="featuredReviewCheck"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, featured: e.target.checked }))
                    }
                    className="w-4 h-4 text-amber-500 rounded-sm focus:ring-amber-400 cursor-pointer"
                  />
                  <label
                    htmlFor="featuredReviewCheck"
                    className="text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    Feature on Homepage
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  {editingItem ? 'Save Changes' : 'Add Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-sm p-5 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-black text-slate-900">Delete Testimonial?</h4>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              This review will be permanently removed from all website displays.
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteTestimonial(deletingId);
                  setDeletingId(null);
                }}
                className="px-4 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
