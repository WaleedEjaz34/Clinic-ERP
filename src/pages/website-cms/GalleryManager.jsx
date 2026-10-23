import React, { useState, useMemo } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Search,
  Filter,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  Upload,
  Check,
  X,
  ExternalLink,
  Sparkles,
  Info,
  Maximize2,
  FolderOpen,
} from 'lucide-react';
import { useWebsiteCMS } from '../../context/WebsiteCMSContext';
import { CMSPageHeader } from '../../components/cms/CMSPageHeader';
import { ContentStatusBadge } from '../../components/cms/ContentStatusBadge';

const CATEGORIES = [
  'All',
  'Clinic Interior',
  'Medical Equipment',
  'Doctors',
  'Facilities',
  'Events',
  'General',
];

export const GalleryManager = () => {
  const {
    gallery,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    toggleGalleryVisibility,
    openMediaPicker,
  } = useWebsiteCMS();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxImage, setLightboxImage] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Clinic Interior',
    imageUrl: '',
    altText: '',
    caption: '',
    visible: true,
  });
  const [formErrors, setFormErrors] = useState({});

  // Delete confirmation
  const [deletingId, setDeletingId] = useState(null);

  // Filtered gallery items
  const filteredItems = useMemo(() => {
    return gallery.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.altText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.caption && item.caption.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [gallery, searchQuery, selectedCategory]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      category: 'Clinic Interior',
      imageUrl: '',
      altText: '',
      caption: '',
      visible: true,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category || 'General',
      imageUrl: item.imageUrl,
      altText: item.altText || '',
      caption: item.caption || '',
      visible: item.visible !== undefined ? item.visible : true,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.imageUrl.trim()) errors.imageUrl = 'Image URL or selection is required';
    if (!formData.altText.trim()) errors.altText = 'Alt text is recommended for accessibility & SEO';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingItem) {
      updateGalleryItem(editingItem.id, formData);
    } else {
      addGalleryItem(formData);
    }
    setIsModalOpen(false);
  };

  // Local file upload handler simulation
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPEG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit. Please choose a smaller image.');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      imageUrl: objectUrl,
      title: prev.title || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      altText: prev.altText || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
    }));
  };

  return (
    <div className="space-y-5">
      <CMSPageHeader
        title="Gallery Management"
        description="Organize public clinic interior photos, state-of-the-art medical equipment, and facility highlights displayed on the public website."
        action={
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Gallery Image</span>
          </button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search images by title or tag..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>
      </div>

      {/* Gallery Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
            <ImageIcon className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No Gallery Images Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            {searchQuery || selectedCategory !== 'All'
              ? 'No photos matched your filter criteria. Try adjusting your search query.'
              : 'Add high-resolution facility images to showcase your modern clinic.'}
          </p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload First Photo</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col"
            >
              {/* Image Preview Box */}
              <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.altText || item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src =
                      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80';
                  }}
                />

                {/* Status Badges */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold">
                    {item.category}
                  </span>
                  <button
                    onClick={() => toggleGalleryVisibility(item.id)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-xs transition-all cursor-pointer ${
                      item.visible
                        ? 'bg-emerald-500/90 text-white'
                        : 'bg-amber-500/90 text-white'
                    }`}
                    title={item.visible ? 'Visible on Website (Click to hide)' : 'Hidden on Website (Click to show)'}
                  >
                    {item.visible ? 'Visible' : 'Hidden'}
                  </button>
                </div>

                {/* Quick Expand Button */}
                <button
                  onClick={() => setLightboxImage(item)}
                  className="absolute top-2.5 right-2.5 w-7 h-7 rounded-lg bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Expand Full Photo"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Card Meta Content */}
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                    {item.title}
                  </h4>
                  {item.caption && (
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                      {item.caption}
                    </p>
                  )}
                  <p className="text-[10px] text-slate-400 mt-1">
                    Uploaded: {item.uploadDate || 'Recent'}
                  </p>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-2">
                  <button
                    onClick={() => toggleGalleryVisibility(item.id)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-brand-600 transition-colors cursor-pointer"
                  >
                    {item.visible ? (
                      <>
                        <Eye className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Public</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-amber-500" />
                        <span>Hidden</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-brand-50 transition-colors cursor-pointer"
                      title="Edit Image Details"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingId(item.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete Image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
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
            {/* Modal Header */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-600 flex items-center justify-center">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    {editingItem ? 'Edit Gallery Image' : 'Add New Gallery Image'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Provide image details, category, and SEO alt tag.
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

            {/* Modal Body */}
            <form onSubmit={handleSave} className="p-5 space-y-4">
              {/* Image Preview & Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Image Source <span className="text-rose-500">*</span>
                </label>

                {formData.imageUrl ? (
                  <div className="relative aspect-16/9 rounded-xl border border-slate-200 bg-slate-100 overflow-hidden mb-2">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, imageUrl: '' }))}
                      className="absolute top-2 right-2 p-1 rounded-md bg-slate-900/70 hover:bg-slate-900 text-white cursor-pointer"
                      title="Remove"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() =>
                        openMediaPicker((selected) => {
                          setFormData((prev) => ({
                            ...prev,
                            imageUrl: selected.url,
                            title: prev.title || selected.title,
                            altText: prev.altText || selected.altText,
                          }));
                        }, 'Select Facility Image')
                      }
                      className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-brand-300 hover:border-brand-500 bg-brand-50/50 hover:bg-brand-50 transition-colors cursor-pointer text-center"
                    >
                      <FolderOpen className="w-5 h-5 text-brand-600 mb-1" />
                      <span className="text-xs font-bold text-brand-700">Choose From Media Library</span>
                      <span className="text-[10px] text-brand-500 mt-0.5">Pick approved asset</span>
                    </button>

                    <label className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer text-center">
                      <Upload className="w-5 h-5 text-slate-500 mb-1" />
                      <span className="text-xs font-bold text-slate-700">Upload Local File</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">JPEG, PNG up to 5MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}

                {/* Direct URL input fallback */}
                <input
                  type="url"
                  placeholder="Or paste external image URL (https://...)"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
                {formErrors.imageUrl && (
                  <p className="text-[11px] text-rose-500 mt-1">{formErrors.imageUrl}</p>
                )}
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Image Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Modern Consultation Suite"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                  {formErrors.title && (
                    <p className="text-[11px] text-rose-500 mt-1">{formErrors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Alt Text & Caption */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alt Text (Accessibility & SEO)
                </label>
                <input
                  type="text"
                  value={formData.altText}
                  onChange={(e) => setFormData((prev) => ({ ...prev, altText: e.target.value }))}
                  placeholder="Concise description of what is in the photo"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
                {formErrors.altText && (
                  <p className="text-[11px] text-amber-600 mt-1">{formErrors.altText}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Caption (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.caption}
                  onChange={(e) => setFormData((prev) => ({ ...prev, caption: e.target.value }))}
                  placeholder="Short explanatory caption displayed in public preview lightbox..."
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              {/* Visibility Checkbox */}
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  id="visibleCheckbox"
                  checked={formData.visible}
                  onChange={(e) => setFormData((prev) => ({ ...prev, visible: e.target.checked }))}
                  className="w-4 h-4 text-brand-600 rounded-sm focus:ring-brand-500 cursor-pointer"
                />
                <label htmlFor="visibleCheckbox" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Show on Public Website Gallery
                </label>
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  {editingItem ? 'Save Changes' : 'Add to Gallery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-sm p-5 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-black text-slate-900">Delete Gallery Image?</h4>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              This photo will be removed from your website gallery and homepage highlight section.
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
                  deleteGalleryItem(deletingId);
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

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-3xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 cursor-default"
          >
            <div className="relative aspect-16/10 bg-black flex items-center justify-center">
              <img
                src={lightboxImage.imageUrl}
                alt={lightboxImage.title}
                className="max-h-full max-w-full object-contain"
              />
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">{lightboxImage.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {lightboxImage.caption || lightboxImage.altText}
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold">
                {lightboxImage.category}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
