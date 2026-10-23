import React, { useState } from 'react';
import {
  Menu as MenuIcon,
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  ExternalLink,
  Link as LinkIcon,
  Eye,
  EyeOff,
  Check,
  X,
  ChevronRight,
  FolderTree,
  Sparkles,
} from 'lucide-react';
import { useWebsiteCMS } from '../../context/WebsiteCMSContext';
import { CMSPageHeader } from '../../components/cms/CMSPageHeader';

export const NavigationBuilder = () => {
  const {
    navigation,
    addNavItem,
    updateNavItem,
    deleteNavItem,
    moveNavItem,
    toggleNavItem,
    pages,
  } = useWebsiteCMS();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    label: '',
    type: 'internal', // 'internal' | 'external'
    path: '/',
    pageId: '',
    target: '_self',
    parentId: '',
    enabled: true,
  });
  const [formErrors, setFormErrors] = useState({});

  // Delete State
  const [deletingId, setDeletingId] = useState(null);

  // Sorted Nav Items
  const sortedNavItems = [...navigation].sort((a, b) => a.order - b.order);

  // Parent menu items (items without parents) for dropdown assignment
  const topLevelItems = sortedNavItems.filter((item) => !item.parentId);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      label: '',
      type: 'internal',
      path: '/',
      pageId: pages[0]?.id || '',
      target: '_self',
      parentId: '',
      enabled: true,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      label: item.label,
      type: item.type || (item.path.startsWith('http') ? 'external' : 'internal'),
      path: item.path,
      pageId: item.pageId || '',
      target: item.target || '_self',
      parentId: item.parentId || '',
      enabled: item.enabled !== undefined ? item.enabled : true,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleInternalPageSelect = (pageId) => {
    const selectedPage = pages.find((p) => p.id === pageId);
    if (selectedPage) {
      setFormData((prev) => ({
        ...prev,
        pageId,
        label: prev.label || selectedPage.title,
        path: selectedPage.slug ? `/${selectedPage.slug}` : '/',
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.label.trim()) errors.label = 'Display label is required';
    if (!formData.path.trim()) errors.path = 'URL path or destination is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingItem) {
      updateNavItem(editingItem.id, formData);
    } else {
      addNavItem(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5">
      <CMSPageHeader
        title="Website Navigation Menu Builder"
        description="Configure the primary header navigation menu, sub-menu dropdowns, and button links displayed across your public clinic website."
        action={
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Menu Item</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Menu Items Reordering Tree (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-brand-600" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Header Navigation Hierarchy
                </h3>
              </div>
              <span className="text-[11px] text-slate-500">
                {sortedNavItems.length} Links Active
              </span>
            </div>

            {sortedNavItems.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <MenuIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-bold">No Navigation Links Configured</p>
              </div>
            ) : (
              <div className="space-y-2">
                {sortedNavItems.map((item, index) => {
                  const isChild = !!item.parentId;
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                        isChild
                          ? 'ml-6 bg-slate-50/80 border-slate-200'
                          : 'bg-white border-slate-200/80 shadow-2xs'
                      } ${!item.enabled ? 'opacity-60 bg-slate-100/50' : ''}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Ordering Controls */}
                        <div className="flex flex-col gap-0.5 flex-shrink-0">
                          <button
                            onClick={() => moveNavItem(item.id, 'up')}
                            disabled={index === 0}
                            className="p-1 rounded-sm text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => moveNavItem(item.id, 'down')}
                            disabled={index === sortedNavItems.length - 1}
                            className="p-1 rounded-sm text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Hierarchy Indicator */}
                        {isChild && (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        )}

                        {/* Title and Path */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {item.label}
                            </span>
                            {item.target === '_blank' && (
                              <span className="p-0.5 rounded-sm bg-slate-100 text-slate-500 text-[10px]" title="Opens in new browser tab">
                                <ExternalLink className="w-2.5 h-2.5" />
                              </span>
                            )}
                            {item.isDropdown && (
                              <span className="px-1.5 py-0.5 rounded-sm bg-purple-50 text-purple-700 text-[9px] font-bold">
                                Dropdown
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 block truncate">
                            {item.path}
                          </span>
                        </div>
                      </div>

                      {/* Right Item Actions */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => toggleNavItem(item.id)}
                          className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                            item.enabled
                              ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                          }`}
                          title={item.enabled ? 'Visible in Menu' : 'Hidden from Menu'}
                        >
                          {item.enabled ? (
                            <Eye className="w-3.5 h-3.5" />
                          ) : (
                            <EyeOff className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-brand-50 transition-colors cursor-pointer"
                          title="Edit Link"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setDeletingId(item.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Link"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Header Menu Mockup Preview (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
              Live Header Mockup Preview
            </h3>
            <p className="text-[11px] text-slate-500 leading-tight">
              Demonstrates how website visitors will see your navigation bar:
            </p>

            <div className="p-3 bg-slate-900 rounded-xl text-white space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-md bg-brand-500 flex items-center justify-center text-white text-[10px] font-black">
                    M
                  </div>
                  <span className="text-xs font-bold">MedPulse</span>
                </div>
                <div className="px-2 py-0.5 rounded-md bg-brand-600 text-[10px] font-bold">
                  Book Visit
                </div>
              </div>

              {/* Menu Items List */}
              <div className="flex flex-wrap gap-2 text-[11px]">
                {sortedNavItems
                  .filter((item) => item.enabled && !item.parentId)
                  .map((item) => (
                    <span
                      key={item.id}
                      className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium"
                    >
                      {item.label}
                    </span>
                  ))}
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-800 leading-relaxed">
              <span className="font-bold">Tip:</span> Ensure you keep the primary header to 5-7 items for optimal readability on tablet and mobile viewports.
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Menu Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-600 flex items-center justify-center">
                  <MenuIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    {editingItem ? 'Edit Menu Item' : 'Add Navigation Link'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Link to an internal clinic page or custom destination.
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
              {/* Type Switcher: Internal vs Custom */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Link Destination Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, type: 'internal' }))}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      formData.type === 'internal'
                        ? 'bg-brand-50 border-brand-500 text-brand-700'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Internal Page
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, type: 'external' }))}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      formData.type === 'external'
                        ? 'bg-brand-50 border-brand-500 text-brand-700'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Custom URL
                  </button>
                </div>
              </div>

              {/* If Internal, Page Dropdown */}
              {formData.type === 'internal' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select Clinic Page
                  </label>
                  <select
                    value={formData.pageId}
                    onChange={(e) => handleInternalPageSelect(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  >
                    <option value="">-- Choose Existing Page --</option>
                    {pages.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} (/{p.slug})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Display Label */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Menu Display Label <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData((prev) => ({ ...prev, label: e.target.value }))}
                  placeholder="e.g. Services, About Us, Patient Portal"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
                {formErrors.label && (
                  <p className="text-[11px] text-rose-500 mt-1">{formErrors.label}</p>
                )}
              </div>

              {/* Path URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target URL / Path <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.path}
                  onChange={(e) => setFormData((prev) => ({ ...prev, path: e.target.value }))}
                  placeholder="e.g. /services or https://..."
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
                {formErrors.path && (
                  <p className="text-[11px] text-rose-500 mt-1">{formErrors.path}</p>
                )}
              </div>

              {/* Parent Item for Dropdowns */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Parent Menu (Optional - for sub-menus)
                </label>
                <select
                  value={formData.parentId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, parentId: e.target.value }))}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                >
                  <option value="">None (Top-Level Header Link)</option>
                  {topLevelItems
                    .filter((item) => !editingItem || item.id !== editingItem.id)
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        Nested under: {item.label}
                      </option>
                    ))}
                </select>
              </div>

              {/* Open in New Tab & Enable Toggle */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <input
                    type="checkbox"
                    id="newTabCheck"
                    checked={formData.target === '_blank'}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        target: e.target.checked ? '_blank' : '_self',
                      }))
                    }
                    className="w-4 h-4 text-brand-600 rounded-sm focus:ring-brand-500 cursor-pointer"
                  />
                  <label htmlFor="newTabCheck" className="text-xs font-bold text-slate-700 cursor-pointer">
                    Open in New Browser Tab (_blank)
                  </label>
                </div>

                <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <input
                    type="checkbox"
                    id="navEnabledCheck"
                    checked={formData.enabled}
                    onChange={(e) => setFormData((prev) => ({ ...prev, enabled: e.target.checked }))}
                    className="w-4 h-4 text-brand-600 rounded-sm focus:ring-brand-500 cursor-pointer"
                  />
                  <label htmlFor="navEnabledCheck" className="text-xs font-bold text-slate-700 cursor-pointer">
                    Enable & Display in Public Menu
                  </label>
                </div>
              </div>

              {/* Footer */}
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
                  {editingItem ? 'Save Item' : 'Add Item'}
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
            <h4 className="text-sm font-black text-slate-900">Remove Navigation Link?</h4>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              This item will disappear from your public website header navigation.
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
                  deleteNavItem(deletingId);
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
