import React, { useState, useMemo } from 'react';
import {
  FolderOpen,
  Upload,
  Search,
  Grid,
  List,
  Trash2,
  Edit2,
  Copy,
  Check,
  ExternalLink,
  Eye,
  Info,
  X,
  FileImage,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { useWebsiteCMS } from '../../context/WebsiteCMSContext';
import { CMSPageHeader } from '../../components/cms/CMSPageHeader';

const MEDIA_CATEGORIES = [
  'All',
  'Banners',
  'Clinic',
  'Doctors',
  'Services',
  'Blog',
  'Icons',
];

export const MediaLibrary = () => {
  const { media, addMediaItem, updateMediaItem, deleteMediaItem } = useWebsiteCMS();

  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc'); // 'date-desc' | 'date-asc' | 'name-asc'

  // Selected file for detail panel / edit
  const [activeFile, setActiveFile] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    altText: '',
    category: 'Clinic',
  });

  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFormData, setUploadFormData] = useState({
    title: '',
    url: '',
    category: 'Clinic',
    altText: '',
  });

  // Copied state indicator
  const [copiedId, setCopiedId] = useState(null);

  // Delete safety state
  const [deletingId, setDeletingId] = useState(null);

  // Filtered & Sorted Media Files
  const filteredMedia = useMemo(() => {
    return media
      .filter((item) => {
        const matchesSearch =
          (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (item.fileName && item.fileName.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (item.altText && item.altText.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory =
          selectedCategory === 'All' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') return (b.uploadedAt || '').localeCompare(a.uploadedAt || '');
        if (sortBy === 'date-asc') return (a.uploadedAt || '').localeCompare(b.uploadedAt || '');
        if (sortBy === 'name-asc') return (a.title || '').localeCompare(b.title || '');
        return 0;
      });
  }, [media, searchQuery, selectedCategory, sortBy]);

  const handleCopyLink = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenEdit = (file) => {
    setActiveFile(file);
    setEditFormData({
      title: file.title || file.fileName || '',
      altText: file.altText || '',
      category: file.category || 'Clinic',
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!activeFile) return;
    updateMediaItem(activeFile.id, editFormData);
    setIsEditModalOpen(false);
  };

  const handleLocalFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit.');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setUploadFormData((prev) => ({
      ...prev,
      url: objectUrl,
      title: prev.title || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      altText: prev.altText || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
    }));
  };

  const handleSaveUpload = (e) => {
    e.preventDefault();
    if (!uploadFormData.url.trim()) {
      alert('Please select or enter an image URL.');
      return;
    }

    addMediaItem({
      title: uploadFormData.title || 'Clinic Media Asset',
      fileName: `${(uploadFormData.title || 'asset').toLowerCase().replace(/\s+/g, '-')}.jpg`,
      url: uploadFormData.url,
      category: uploadFormData.category,
      altText: uploadFormData.altText || uploadFormData.title,
      fileSize: '420 KB',
      dimensions: '1440 × 900',
    });

    setIsUploadModalOpen(false);
    setUploadFormData({ title: '', url: '', category: 'Clinic', altText: '' });
  };

  return (
    <div className="space-y-5">
      <CMSPageHeader
        title="Central Media Library"
        description="Browse, upload, and organize high-resolution images, banners, and doctor headshots shared across your clinic website pages."
        action={
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload New Media</span>
          </button>
        }
      />

      {/* Storage Advisory */}
      <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200/90 flex items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-brand-600 flex-shrink-0" />
          <span>
            <strong className="text-slate-800">Browser Media Storage:</strong> Local uploads use memory object URLs in this frontend demo, while external CDN URLs persist permanently in LocalStorage.
          </span>
        </div>
        <span className="text-[11px] font-mono font-bold text-slate-500 whitespace-nowrap">
          {media.length} Total Assets
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
          {MEDIA_CATEGORIES.map((cat) => (
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

        {/* View Switcher, Sort & Search */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="name-asc">Name (A-Z)</option>
          </select>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
              title="Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search file name..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>
      </div>

      {/* Media Grid or List */}
      {filteredMedia.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-12 text-center">
          <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No Media Files Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Try adjusting your search query or upload new photos.
          </p>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Media</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
          {filteredMedia.map((file) => (
            <div
              key={file.id}
              onClick={() => setActiveFile(file)}
              className={`group bg-white rounded-2xl border transition-all overflow-hidden cursor-pointer flex flex-col justify-between ${
                activeFile?.id === file.id
                  ? 'border-brand-500 ring-2 ring-brand-500/20 shadow-md'
                  : 'border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              {/* Thumbnail */}
              <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                <img
                  src={file.url}
                  alt={file.altText || file.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src =
                      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&auto=format&fit=crop&q=80';
                  }}
                />
                <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-slate-900/70 text-white text-[9px] font-bold backdrop-blur-xs">
                  {file.category}
                </span>
              </div>

              {/* Caption & Actions */}
              <div className="p-2.5">
                <h4 className="text-xs font-bold text-slate-900 truncate">
                  {file.title || file.fileName}
                </h4>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                  <span>{file.fileSize || '350 KB'}</span>
                  <span>{file.uploadedAt || 'Recent'}</span>
                </div>

                {/* Quick copy / edit */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyLink(file.url, file.id);
                    }}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-brand-600 transition-colors"
                  >
                    {copiedId === file.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEdit(file);
                      }}
                      className="p-1 rounded-md text-slate-400 hover:text-brand-600 hover:bg-slate-100 transition-colors"
                      title="Edit Metadata"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingId(file.id);
                      }}
                      className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
              <tr>
                <th className="py-3 px-4">Preview</th>
                <th className="py-3 px-3">Title & File</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Dimensions</th>
                <th className="py-3 px-3">Size</th>
                <th className="py-3 px-3">Uploaded</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMedia.map((file) => (
                <tr key={file.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2.5 px-4">
                    <img
                      src={file.url}
                      alt={file.title}
                      className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                    />
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-slate-900">{file.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{file.fileName || 'asset.jpg'}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                      {file.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                    {file.dimensions || '1200 × 800'}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500">
                    {file.fileSize || '350 KB'}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                    {file.uploadedAt || 'Recent'}
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleCopyLink(file.url, file.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-brand-50"
                        title="Copy Link URL"
                      >
                        {copiedId === file.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleOpenEdit(file)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-brand-50"
                        title="Edit Details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingId(file.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                        title="Delete File"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-600 flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Upload Media Asset</h3>
                  <p className="text-[11px] text-slate-500">
                    Add new graphics, doctor portraits, or equipment photos.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUpload} className="p-5 space-y-4">
              {/* Local File Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Choose File or Paste URL
                </label>
                <label className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-brand-300 hover:border-brand-500 bg-brand-50/50 hover:bg-brand-50 transition-colors cursor-pointer text-center mb-2">
                  <Upload className="w-5 h-5 text-brand-600 mb-1" />
                  <span className="text-xs font-bold text-brand-700">Select Local Image</span>
                  <span className="text-[10px] text-brand-500 mt-0.5">JPEG, PNG, WebP up to 5MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLocalFileUpload}
                    className="hidden"
                  />
                </label>

                <input
                  type="url"
                  value={uploadFormData.url}
                  onChange={(e) => setUploadFormData((prev) => ({ ...prev, url: e.target.value }))}
                  placeholder="Or paste image URL (https://...)"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              {/* Title & Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Asset Title
                </label>
                <input
                  type="text"
                  value={uploadFormData.title}
                  onChange={(e) => setUploadFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Modern Waiting Lounge"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={uploadFormData.category}
                    onChange={(e) =>
                      setUploadFormData((prev) => ({ ...prev, category: e.target.value }))
                    }
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20"
                  >
                    {MEDIA_CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Alt Text
                  </label>
                  <input
                    type="text"
                    value={uploadFormData.altText}
                    onChange={(e) =>
                      setUploadFormData((prev) => ({ ...prev, altText: e.target.value }))
                    }
                    placeholder="Accessibility tag"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  Upload & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Details Modal */}
      {isEditModalOpen && activeFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">Edit Media Details</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alt Text (SEO & Screen Readers)
                </label>
                <input
                  type="text"
                  value={editFormData.altText}
                  onChange={(e) =>
                    setEditFormData((prev) => ({ ...prev, altText: e.target.value }))
                  }
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={editFormData.category}
                  onChange={(e) =>
                    setEditFormData((prev) => ({ ...prev, category: e.target.value }))
                  }
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  {MEDIA_CATEGORIES.filter((c) => c !== 'All').map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-brand-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Save Metadata
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation with Reference Warning */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-sm p-5 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-black text-slate-900">Delete Media Asset?</h4>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              If this image is currently used on your homepage or articles, it may appear as a broken link.
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
                  deleteMediaItem(deletingId);
                  setDeletingId(null);
                  if (activeFile?.id === deletingId) setActiveFile(null);
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
