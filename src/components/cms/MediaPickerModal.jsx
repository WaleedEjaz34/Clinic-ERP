import React, { useState } from 'react';
import {
  X,
  Search,
  UploadCloud,
  Check,
  Image as ImageIcon,
  Link2,
  FolderOpen,
} from 'lucide-react';
import { useWebsiteCMS } from '../../context/WebsiteCMSContext';

export const MediaPickerModal = () => {
  const { mediaPickerState, closeMediaPicker, media, addMediaItem } = useWebsiteCMS();
  const { isOpen, onSelect, title } = mediaPickerState;

  const [activeTab, setActiveTab] = useState('library'); // 'library' | 'upload' | 'url'
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedMediaId, setSelectedMediaId] = useState(null);
  const [customUrl, setCustomUrl] = useState('');
  const [uploadPreview, setUploadPreview] = useState(null);
  const [uploadTitle, setUploadTitle] = useState('');

  if (!isOpen) return null;

  // Filter media files
  const filteredMedia = media.filter((m) => {
    if (selectedCategory !== 'ALL' && m.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const match =
        (m.title && m.title.toLowerCase().includes(q)) ||
        (m.fileName && m.fileName.toLowerCase().includes(q)) ||
        (m.altText && m.altText.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const categories = ['ALL', 'Interior', 'Equipment', 'Doctors', 'Facilities', 'General'];

  // Handle confirming selection
  const handleConfirm = () => {
    if (activeTab === 'library') {
      const item = media.find((m) => m.id === selectedMediaId);
      if (item && onSelect) {
        onSelect(item.url, item);
      }
    } else if (activeTab === 'url') {
      if (customUrl.trim() && onSelect) {
        onSelect(customUrl.trim(), { url: customUrl.trim(), title: 'External Image' });
      }
    } else if (activeTab === 'upload') {
      if (uploadPreview && onSelect) {
        const newMedia = addMediaItem({
          fileName: `uploaded-${Date.now()}.jpg`,
          title: uploadTitle.trim() || 'Uploaded Media',
          url: uploadPreview,
          category: 'General',
          fileType: 'image/jpeg',
          altText: uploadTitle.trim() || 'Clinic Image',
        });
        onSelect(uploadPreview, newMedia);
      }
    }
    closeMediaPicker();
  };

  // Handle local file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadPreview(reader.result);
        if (!uploadTitle) {
          setUploadTitle(file.name.replace(/\.[^/.]+$/, ''));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600 border border-brand-200/80">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{title}</h3>
              <p className="text-[11px] text-slate-500">
                Choose an image from the clinic library, upload a file, or provide an image link.
              </p>
            </div>
          </div>
          <button
            onClick={closeMediaPicker}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-slate-100 text-xs">
          <button
            onClick={() => setActiveTab('library')}
            className={`flex items-center gap-1.5 pb-2.5 font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'library'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Media Library ({media.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-1.5 pb-2.5 font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'upload'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload File</span>
          </button>

          <button
            onClick={() => setActiveTab('url')}
            className={`flex items-center gap-1.5 pb-2.5 font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'url'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Direct Image URL</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'library' && (
            <div className="space-y-4">
              {/* Filter bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search media files..."
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-9 pr-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>

                <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of images */}
              {filteredMedia.length === 0 ? (
                <div className="py-16 text-center text-slate-400">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-semibold">No media files found</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {filteredMedia.map((item) => {
                    const isSelected = selectedMediaId === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedMediaId(item.id)}
                        className={`group relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-slate-100 aspect-video ${
                          isSelected
                            ? 'border-brand-600 ring-2 ring-brand-500/20 shadow-md'
                            : 'border-slate-200 hover:border-brand-300'
                        }`}
                      >
                        <img
                          src={item.url}
                          alt={item.altText || item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-slate-950/80 to-transparent text-white">
                          <p className="text-[10px] font-bold truncate leading-tight">
                            {item.title}
                          </p>
                          <span className="text-[9px] text-slate-300 font-mono">
                            {item.fileSize}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-brand-600 text-white rounded-full flex items-center justify-center shadow-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="space-y-4 max-w-lg mx-auto py-4">
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:bg-slate-50 transition-colors">
                {uploadPreview ? (
                  <div className="space-y-3">
                    <img
                      src={uploadPreview}
                      alt="Upload Preview"
                      className="max-h-48 mx-auto rounded-xl object-contain border border-slate-200"
                    />
                    <button
                      onClick={() => setUploadPreview(null)}
                      className="text-xs text-rose-600 font-bold hover:underline"
                    >
                      Remove & Choose Another
                    </button>
                  </div>
                ) : (
                  <div>
                    <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-700">
                      Choose an image file from your computer
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      PNG, JPG, WebP up to 5MB (simulated local preview)
                    </p>
                    <label className="mt-4 inline-block px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-slate-800 transition-colors cursor-pointer">
                      Select Local File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>

              {uploadPreview && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Image Title / Alt Description
                  </label>
                  <input
                    type="text"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="e.g. Executive Reception Suite"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'url' && (
            <div className="space-y-4 max-w-lg mx-auto py-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  External Image URL
                </label>
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://example.com/images/clinic.jpg"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              {customUrl && (
                <div className="p-3 border border-slate-200 rounded-xl bg-slate-50 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-2">
                    Live URL Preview
                  </span>
                  <img
                    src={customUrl}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded-lg object-contain border border-slate-200 bg-white"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/600x400?text=Invalid+Image+URL';
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            {activeTab === 'library'
              ? selectedMediaId
                ? '1 image selected'
                : 'Select an image from the library'
              : activeTab === 'upload'
              ? uploadPreview
                ? 'File ready for selection'
                : 'Choose a file to proceed'
              : customUrl
              ? 'Valid URL entered'
              : 'Enter a valid image URL'}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={closeMediaPicker}
              className="px-3.5 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={
                (activeTab === 'library' && !selectedMediaId) ||
                (activeTab === 'upload' && !uploadPreview) ||
                (activeTab === 'url' && !customUrl.trim())
              }
              className="px-4 py-1.5 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white rounded-xl font-bold shadow-xs transition-colors cursor-pointer"
            >
              Confirm Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
