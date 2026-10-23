import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Edit2,
  Copy,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  Archive,
  ArrowRight,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { useWebsiteCMS } from '../../context/WebsiteCMSContext';
import { CMSPageHeader } from '../../components/cms/CMSPageHeader';
import { ContentStatusBadge } from '../../components/cms/ContentStatusBadge';
import { Modal } from '../../components/common/Modal';
import { BlockContentEditor } from '../../components/cms/BlockContentEditor';
import { SEOPanel } from '../../components/cms/SEOPanel';
import { formatDate } from '../../utils/date';

export const PagesManager = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    pages,
    addPage,
    updatePage,
    duplicatePage,
    deletePage,
    setPageStatus,
    openMediaPicker,
  } = useWebsiteCMS();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get('status') || 'ALL'
  );
  const [typeFilter, setTypeFilter] = useState('ALL');

  // Modal editor state
  const [isEditorOpen, setIsEditorOpen] = useState(
    searchParams.get('action') === 'new'
  );
  const [editingPage, setEditingPage] = useState(null);
  const [editorTab, setEditorTab] = useState('content'); // 'content' | 'seo' | 'settings'

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    pageType: 'Content Page',
    status: 'Published',
    template: 'Default Content',
    featuredImage: '',
    metaTitle: '',
    metaDescription: '',
    showInNav: true,
    blocks: [],
  });

  const handleOpenAdd = () => {
    setEditingPage(null);
    setFormData({
      title: '',
      slug: '',
      pageType: 'Content Page',
      status: 'Published',
      template: 'Default Content',
      featuredImage: '',
      metaTitle: '',
      metaDescription: '',
      showInNav: true,
      blocks: [
        { id: 'b-init-1', type: 'heading', level: 1, content: 'Page Heading' },
        { id: 'b-init-2', type: 'paragraph', content: 'Add clear, informative content for your patients.' },
      ],
    });
    setEditorTab('content');
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (page) => {
    setEditingPage(page);
    setFormData({ ...page });
    setEditorTab('content');
    setIsEditorOpen(true);
  };

  const handleTitleChange = (newTitle) => {
    setFormData((prev) => {
      const suggestedSlug = (!editingPage || !prev.slug)
        ? newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        : prev.slug;
      return {
        ...prev,
        title: newTitle,
        slug: suggestedSlug,
        metaTitle: prev.metaTitle || `${newTitle} | MedPulse Clinic`,
      };
    });
  };

  const handleSavePage = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingPage) {
      updatePage(editingPage.id, formData);
    } else {
      addPage(formData);
    }
    setIsEditorOpen(false);
  };

  const handleDelete = (page) => {
    if (page.slug === 'home') {
      alert('The Home page cannot be deleted as it serves as the root website URL.');
      return;
    }
    if (window.confirm(`Are you sure you want to permanently delete page "${page.title}"?`)) {
      deletePage(page.id);
    }
  };

  // Filtered pages list
  const filteredPages = useMemo(() => {
    return pages.filter((page) => {
      if (statusFilter !== 'ALL' && page.status !== statusFilter) return false;
      if (typeFilter !== 'ALL' && page.pageType !== typeFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const match =
          page.title.toLowerCase().includes(q) ||
          page.slug.toLowerCase().includes(q) ||
          (page.metaTitle && page.metaTitle.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    });
  }, [pages, statusFilter, typeFilter, search]);

  const pageTypes = ['ALL', 'Standard Page', 'Content Page', 'Directory Page', 'Interactive Form', 'Legal Page'];

  return (
    <div className="space-y-5">
      <CMSPageHeader
        title="Website Pages Management"
        subtitle="Create, edit, duplicate, and publish modular content pages for your public healthcare website."
        breadcrumbs={[{ label: 'Pages' }]}
        actions={
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-sm shadow-brand-500/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create New Page</span>
          </button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by page title, URL slug, or keywords..."
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          {/* Status & Type Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none"
            >
              <option value="ALL">All Statuses ({pages.length})</option>
              <option value="Published">Published ({pages.filter((p) => p.status === 'Published').length})</option>
              <option value="Draft">Draft ({pages.filter((p) => p.status === 'Draft').length})</option>
              <option value="Archived">Archived ({pages.filter((p) => p.status === 'Archived').length})</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none"
            >
              {pageTypes.map((type) => (
                <option key={type} value={type}>
                  {type === 'ALL' ? 'All Page Types' : type}
                </option>
              ))}
            </select>

            {(search || statusFilter !== 'ALL' || typeFilter !== 'ALL') && (
              <button
                onClick={() => {
                  setSearch('');
                  setStatusFilter('ALL');
                  setTypeFilter('ALL');
                }}
                className="text-xs text-brand-600 hover:underline font-bold px-1"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Pages Listing Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-600" />
            <span className="font-extrabold text-slate-900 uppercase tracking-wider">
              Configured Website Pages
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold font-mono text-[10px]">
              {filteredPages.length} {filteredPages.length === 1 ? 'Page' : 'Pages'}
            </span>
          </div>
        </div>

        {filteredPages.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs font-semibold">No pages match the search criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/95 border-b border-slate-200 text-slate-600 uppercase font-bold tracking-wider text-[11px]">
                  <th className="py-3 px-4">Page Title</th>
                  <th className="py-3 px-4">URL Slug</th>
                  <th className="py-3 px-3">Page Type</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3">Last Updated</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPages.map((page) => (
                  <tr key={page.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Page Title */}
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span>{page.title}</span>
                        {page.slug === 'home' && (
                          <span className="px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 font-mono text-[9px] font-bold">
                            Root / Home
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      /{page.slug}
                    </td>

                    {/* Page Type */}
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium">
                        {page.pageType}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3 text-center">
                      <ContentStatusBadge status={page.status} />
                    </td>

                    {/* Last Updated */}
                    <td className="py-3.5 px-3 font-mono text-slate-500">
                      {formatDate(page.lastUpdated)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Live Preview Button */}
                        <button
                          onClick={() => navigate(`/website-preview?page=${page.slug}`)}
                          className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors cursor-pointer"
                          title="Preview Page"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => handleOpenEdit(page)}
                          className="p-1.5 text-brand-600 hover:text-brand-800 hover:bg-brand-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Page Content"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Duplicate Button */}
                        <button
                          onClick={() => duplicatePage(page.id)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Duplicate Page"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        {/* Toggle Status Dropdown */}
                        <select
                          value={page.status}
                          onChange={(e) => setPageStatus(page.id, e.target.value)}
                          className="text-[10px] bg-slate-100 border border-slate-200 rounded-md px-1.5 py-1 font-semibold text-slate-700 cursor-pointer"
                        >
                          <option value="Published">Publish</option>
                          <option value="Draft">Draft</option>
                          <option value="Archived">Archive</option>
                        </select>

                        {/* Delete Button */}
                        {page.slug !== 'home' && (
                          <button
                            onClick={() => handleDelete(page)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Page"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Page Content Editor Modal */}
      {isEditorOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsEditorOpen(false)}
          title={editingPage ? `Edit Page — ${editingPage.title}` : 'Create New Website Page'}
          subtitle="Configure page layout, modular content blocks, URL slug, and search engine metadata."
          maxWidth="max-w-4xl"
        >
          <form onSubmit={handleSavePage} className="space-y-4">
            {/* Editor Tabs: Content | SEO | Page Settings */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs">
              <button
                type="button"
                onClick={() => setEditorTab('content')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                  editorTab === 'content'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                1. Page Content Blocks ({formData.blocks?.length || 0})
              </button>

              <button
                type="button"
                onClick={() => setEditorTab('seo')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                  editorTab === 'seo'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                2. SEO & Snippets
              </button>

              <button
                type="button"
                onClick={() => setEditorTab('settings')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                  editorTab === 'settings'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                3. Page Settings & Status
              </button>
            </div>

            {/* TAB 1: CONTENT BLOCKS */}
            {editorTab === 'content' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Page Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g. Executive Cardiology Consultation"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-3 py-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      URL Slug
                    </label>
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-500 font-mono">
                      <span>/</span>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                          }))
                        }
                        placeholder="page-slug"
                        className="flex-1 bg-transparent text-slate-800 font-bold focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Modular Block Content Editor */}
                <BlockContentEditor
                  blocks={formData.blocks || []}
                  onChange={(newBlocks) =>
                    setFormData((prev) => ({ ...prev, blocks: newBlocks }))
                  }
                />
              </div>
            )}

            {/* TAB 2: SEO CONFIG */}
            {editorTab === 'seo' && (
              <SEOPanel
                metaTitle={formData.metaTitle}
                metaDescription={formData.metaDescription}
                slug={formData.slug}
                onTitleChange={(val) => setFormData((prev) => ({ ...prev, metaTitle: val }))}
                onDescriptionChange={(val) =>
                  setFormData((prev) => ({ ...prev, metaDescription: val }))
                }
                onSlugChange={(val) => setFormData((prev) => ({ ...prev, slug: val }))}
              />
            )}

            {/* TAB 3: PAGE SETTINGS & STATUS */}
            {editorTab === 'settings' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Page Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, status: e.target.value }))
                      }
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 font-bold"
                    >
                      <option value="Published">Published (Live on website)</option>
                      <option value="Draft">Draft (Editable in CMS, hidden from public)</option>
                      <option value="Archived">Archived (Stored in records)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Page Type Classification
                    </label>
                    <select
                      value={formData.pageType}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, pageType: e.target.value }))
                      }
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2"
                    >
                      <option value="Standard Page">Standard Page</option>
                      <option value="Content Page">Content Page</option>
                      <option value="Directory Page">Directory Page</option>
                      <option value="Interactive Form">Interactive Form</option>
                      <option value="Legal Page">Legal Page</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Featured Banner Image URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={formData.featuredImage || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, featuredImage: e.target.value }))
                        }
                        placeholder="https://example.com/banner.jpg"
                        className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          openMediaPicker((url) =>
                            setFormData((prev) => ({ ...prev, featuredImage: url }))
                          )
                        }
                        className="px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold whitespace-nowrap"
                      >
                        Pick
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end pb-2">
                    <input
                      type="checkbox"
                      id="showInNav"
                      checked={formData.showInNav}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, showInNav: e.target.checked }))
                      }
                      className="w-4 h-4 text-brand-600 rounded cursor-pointer"
                    />
                    <label htmlFor="showInNav" className="text-xs font-bold text-slate-700 cursor-pointer">
                      Show in Public Navigation Bar
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              {editingPage && (
                <button
                  type="button"
                  onClick={() => navigate(`/website-preview?page=${editingPage.slug}`)}
                  className="inline-flex items-center gap-1.5 text-xs text-brand-600 font-bold hover:underline"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview Page in Website Frame</span>
                </button>
              )}
              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  Save Page
                </button>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
