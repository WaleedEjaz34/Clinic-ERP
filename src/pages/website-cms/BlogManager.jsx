import React, { useState, useMemo } from 'react';
import {
  Newspaper,
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  Eye,
  Calendar,
  User,
  Tag,
  X,
  ExternalLink,
  FolderOpen,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { useWebsiteCMS } from '../../context/WebsiteCMSContext';
import { CMSPageHeader } from '../../components/cms/CMSPageHeader';
import { ContentStatusBadge } from '../../components/cms/ContentStatusBadge';
import { BlockContentEditor } from '../../components/cms/BlockContentEditor';
import { SEOPanel } from '../../components/cms/SEOPanel';

const BLOG_CATEGORIES = [
  'All',
  'Health & Wellness',
  'Pediatrics',
  'Cardiology',
  'Preventive Care',
  'Nutrition',
  'Mental Health',
  'Dental Health',
];

export const BlogManager = () => {
  const {
    blogPosts,
    addBlogPost,
    updateBlogPost,
    duplicateBlogPost,
    deleteBlogPost,
    setBlogPostStatus,
    openMediaPicker,
  } = useWebsiteCMS();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Modal editor state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [activeTab, setActiveTab] = useState('content'); // 'content' | 'blocks' | 'seo'
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Health & Wellness',
    author: 'Dr. Sarah Jenkins',
    excerpt: '',
    featuredImage: '',
    publishDate: '',
    status: 'Published',
    tags: 'Health, Wellness, Prevention',
    blocks: [],
    seoTitle: '',
    seoDescription: '',
    readTime: '4 min read',
  });
  const [formErrors, setFormErrors] = useState({});

  // Delete Confirmation
  const [deletingId, setDeletingId] = useState(null);

  // Filtered Posts
  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.author && post.author.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory =
        filterCategory === 'All' || post.category === filterCategory;
      const matchesStatus =
        filterStatus === 'All' || post.status === filterStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [blogPosts, searchQuery, filterCategory, filterStatus]);

  const handleOpenAdd = () => {
    setEditingPost(null);
    setActiveTab('content');
    setFormData({
      title: '',
      slug: '',
      category: 'Health & Wellness',
      author: 'Dr. Sarah Jenkins',
      excerpt: '',
      featuredImage: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&auto=format&fit=crop&q=80',
      publishDate: new Date().toISOString().split('T')[0],
      status: 'Published',
      tags: 'Health, Clinical Advice, Wellness',
      readTime: '3 min read',
      seoTitle: '',
      seoDescription: '',
      blocks: [
        {
          id: 'b1',
          type: 'paragraph',
          content: 'Begin writing your health education guide here to inform and empower patients.',
        },
      ],
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (post) => {
    setEditingPost(post);
    setActiveTab('content');
    setFormData({
      title: post.title,
      slug: post.slug,
      category: post.category || 'Health & Wellness',
      author: post.author || 'MedPulse Medical Editorial',
      excerpt: post.excerpt || '',
      featuredImage: post.featuredImage || '',
      publishDate: post.publishDate || new Date().toISOString().split('T')[0],
      status: post.status || 'Published',
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : post.tags || '',
      readTime: post.readTime || '4 min read',
      seoTitle: post.seoTitle || post.title,
      seoDescription: post.seoDescription || post.excerpt,
      blocks: post.blocks || [
        {
          id: 'b1',
          type: 'paragraph',
          content: post.excerpt || 'Article text content.',
        },
      ],
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: !editingPost ? generateSlug(val) : prev.slug,
      seoTitle: !editingPost ? val : prev.seoTitle,
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.slug.trim()) errors.slug = 'Slug is required';
    if (!formData.excerpt.trim()) errors.excerpt = 'Brief summary excerpt is required';
    if (!formData.publishDate) errors.publishDate = 'Publish date is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      ...formData,
      tags: formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    if (editingPost) {
      updateBlogPost(editingPost.id, payload);
    } else {
      addBlogPost(payload);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5">
      <CMSPageHeader
        title="Blog & Health Articles"
        description="Publish informative health guides, preventative medicine tips, and clinic updates for your website visitors."
        action={
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Write New Article</span>
          </button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            {BLOG_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                Category: {cat}
              </option>
            ))}
          </select>

          {/* Status Tabs */}
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
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles by title or keyword..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>
      </div>

      {/* Articles Table */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto mb-3">
            <Newspaper className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No Articles Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            {searchQuery || filterCategory !== 'All'
              ? 'No posts matched your current search filters.'
              : 'Write informative articles to improve clinic patient engagement and search rankings.'}
          </p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Article</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-bold">
                <tr>
                  <th className="py-3 px-4">Article</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Author</th>
                  <th className="py-3 px-3">Publish Date</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Article Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                          onError={(e) => {
                            e.target.src =
                              'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=150&auto=format&fit=crop&q=80';
                          }}
                        />
                        <div className="max-w-md">
                          <h4 className="font-bold text-slate-900 line-clamp-1 hover:text-brand-600 cursor-pointer">
                            {post.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-slate-400 font-mono">
                              /{post.slug}
                            </span>
                            <span className="text-[10px] text-slate-300">•</span>
                            <span className="text-[10px] text-slate-400">
                              {post.readTime || '3 min'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium text-[11px]">
                        {post.category}
                      </span>
                    </td>

                    {/* Author */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{post.author}</span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{post.publishDate}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3">
                      <ContentStatusBadge status={post.status} />
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(post)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-brand-50 transition-colors cursor-pointer"
                          title="Edit Article"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => duplicateBlogPost(post.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                          title="Duplicate Article"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingId(post.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Article"
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
        </div>
      )}

      {/* Article Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-4xl overflow-hidden my-6 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                  <Newspaper className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    {editingPost ? 'Edit Health Article' : 'Write New Health Article'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {editingPost ? `Editing: ${editingPost.title}` : 'Draft new patient advisory content'}
                  </p>
                </div>
              </div>

              {/* Sub-tabs inside modal */}
              <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveTab('content')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'content'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  General Details
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('blocks')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'blocks'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Article Content Blocks
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('seo')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'seo'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  SEO Preview
                </button>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Body - Scrollable */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-4">
              {activeTab === 'content' && (
                <div className="space-y-4">
                  {/* Title & Slug */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Article Title <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={handleTitleChange}
                        placeholder="e.g. 5 Common Signs of Seasonal Allergies"
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                      />
                      {formErrors.title && (
                        <p className="text-[11px] text-rose-500 mt-1">{formErrors.title}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        URL Slug <span className="text-rose-500">*</span>
                      </label>
                      <div className="flex items-center">
                        <span className="px-2.5 py-1.5 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl text-xs text-slate-500 font-mono">
                          /blog/
                        </span>
                        <input
                          type="text"
                          value={formData.slug}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, slug: generateSlug(e.target.value) }))
                          }
                          className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-r-xl text-xs font-mono focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                        />
                      </div>
                      {formErrors.slug && (
                        <p className="text-[11px] text-rose-500 mt-1">{formErrors.slug}</p>
                      )}
                    </div>
                  </div>

                  {/* Category, Author, Publish Date, Status */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, category: e.target.value }))
                        }
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                      >
                        {BLOG_CATEGORIES.filter((c) => c !== 'All').map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Author Name
                      </label>
                      <input
                        type="text"
                        value={formData.author}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, author: e.target.value }))
                        }
                        placeholder="Dr. Author"
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Publish Date <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.publishDate}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, publishDate: e.target.value }))
                        }
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, status: e.target.value }))
                        }
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                      >
                        <option value="Published">Published (Public)</option>
                        <option value="Draft">Draft (Internal)</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </div>
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Excerpt / Summary <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      value={formData.excerpt}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          excerpt: e.target.value,
                          seoDescription: !editingPost ? e.target.value : prev.seoDescription,
                        }))
                      }
                      placeholder="Concise 1-2 sentence lead paragraph shown in blog listings and social cards..."
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                    {formErrors.excerpt && (
                      <p className="text-[11px] text-rose-500 mt-1">{formErrors.excerpt}</p>
                    )}
                  </div>

                  {/* Featured Image */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Featured Header Image
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="url"
                        value={formData.featuredImage}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, featuredImage: e.target.value }))
                        }
                        placeholder="https://images.unsplash.com/..."
                        className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          openMediaPicker((selected) => {
                            setFormData((prev) => ({ ...prev, featuredImage: selected.url }));
                          }, 'Select Article Featured Image')
                        }
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <FolderOpen className="w-3.5 h-3.5" />
                        <span>Media Library</span>
                      </button>
                    </div>

                    {formData.featuredImage && (
                      <div className="w-full h-32 rounded-xl border border-slate-200 bg-slate-100 overflow-hidden">
                        <img
                          src={formData.featuredImage}
                          alt="Featured Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {/* Tags & Estimated Read Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        value={formData.tags}
                        onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
                        placeholder="e.g. Cardiology, Diet, Exercise"
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Estimated Read Time
                      </label>
                      <input
                        type="text"
                        value={formData.readTime}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, readTime: e.target.value }))
                        }
                        placeholder="e.g. 4 min read"
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'blocks' && (
                <div className="space-y-3">
                  <div className="p-3 bg-brand-50/70 border border-brand-200/60 rounded-xl text-xs text-brand-900 flex items-center justify-between">
                    <div>
                      <span className="font-bold">Block Content Editor:</span> Construct your article using structured headings, clinical notes, bullet points, and CTA cards.
                    </div>
                  </div>

                  <BlockContentEditor
                    blocks={formData.blocks}
                    onChange={(newBlocks) =>
                      setFormData((prev) => ({ ...prev, blocks: newBlocks }))
                    }
                  />
                </div>
              )}

              {activeTab === 'seo' && (
                <SEOPanel
                  metaTitle={formData.seoTitle || formData.title}
                  metaDescription={formData.seoDescription || formData.excerpt}
                  slug={`blog/${formData.slug}`}
                  onMetaTitleChange={(val) => setFormData((prev) => ({ ...prev, seoTitle: val }))}
                  onMetaDescriptionChange={(val) =>
                    setFormData((prev) => ({ ...prev, seoDescription: val }))
                  }
                />
              )}

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    {editingPost ? 'Save Article' : 'Publish Article'}
                  </button>
                </div>
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
            <h4 className="text-sm font-black text-slate-900">Delete Blog Article?</h4>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              This article will be removed from your public website blog feed.
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
                  deleteBlogPost(deletingId);
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
