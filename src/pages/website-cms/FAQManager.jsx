import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  Plus,
  Search,
  ChevronDown,
  ChevronUp,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Check,
  X,
  Layers,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useWebsiteCMS } from '../../context/WebsiteCMSContext';
import { CMSPageHeader } from '../../components/cms/CMSPageHeader';
import { ContentStatusBadge } from '../../components/cms/ContentStatusBadge';

const FAQ_CATEGORIES = [
  'All',
  'General',
  'Appointments',
  'Billing & Insurance',
  'Medical Services',
  'Emergency Care',
];

export const FAQManager = () => {
  const {
    faqs,
    addFAQ,
    updateFAQ,
    deleteFAQ,
    moveFAQ,
    toggleFAQHomepage,
    toggleFAQStatus,
  } = useWebsiteCMS();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [activeAccordionId, setActiveAccordionId] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'General',
    showOnHomepage: true,
    status: 'Active',
  });
  const [formErrors, setFormErrors] = useState({});

  // Delete State
  const [deletingId, setDeletingId] = useState(null);

  // Filtered & Sorted FAQs
  const filteredFAQs = useMemo(() => {
    return [...faqs]
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .filter((item) => {
        const matchesSearch =
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
          filterCategory === 'All' || item.category === filterCategory;
        return matchesSearch && matchesCategory;
      });
  }, [faqs, searchQuery, filterCategory]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      question: '',
      answer: '',
      category: 'General',
      showOnHomepage: true,
      status: 'Active',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (faq) => {
    setEditingItem(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || 'General',
      showOnHomepage: !!faq.showOnHomepage,
      status: faq.status || 'Active',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.question.trim()) errors.question = 'Question text is required';
    if (!formData.answer.trim()) errors.answer = 'Answer explanation is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingItem) {
      updateFAQ(editingItem.id, formData);
    } else {
      addFAQ(formData);
    }
    setIsModalOpen(false);
  };

  const toggleAccordion = (id) => {
    setActiveAccordionId(activeAccordionId === id ? null : id);
  };

  return (
    <div className="space-y-5">
      <CMSPageHeader
        title="Frequently Asked Questions (FAQs)"
        description="Address common patient questions regarding appointments, insurance coverage, clinic timings, and OPD procedures."
        action={
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New FAQ</span>
          </button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
          {FAQ_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                filterCategory === cat
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
            placeholder="Search questions or keywords..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>
      </div>

      {/* FAQ Items Accordion List */}
      {filteredFAQs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-3">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No FAQ Entries Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            {searchQuery || filterCategory !== 'All'
              ? 'No questions matched your search criteria.'
              : 'Add questions to help patients find quick answers before calling the reception.'}
          </p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Question</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFAQs.map((faq, index) => {
            const isOpen = activeAccordionId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all"
              >
                {/* Header Row */}
                <div
                  onClick={() => toggleAccordion(faq.id)}
                  className="p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Ordering Buttons */}
                    <div
                      className="flex flex-col gap-0.5 flex-shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => moveFAQ(faq.id, 'up')}
                        disabled={index === 0}
                        className="p-1 rounded-sm text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => moveFAQ(faq.id, 'down')}
                        disabled={index === filteredFAQs.length - 1}
                        className="p-1 rounded-sm text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="w-7 h-7 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center text-xs font-black flex-shrink-0">
                      Q{index + 1}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {faq.question}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                          {faq.category}
                        </span>
                        {faq.showOnHomepage && (
                          <span className="px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-400/30 text-teal-700 text-[10px] font-bold">
                            Homepage
                          </span>
                        )}
                        <ContentStatusBadge status={faq.status} size="xs" />
                      </div>
                    </div>
                  </div>

                  {/* Actions & Chevron */}
                  <div
                    className="flex items-center gap-1 flex-shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => toggleFAQHomepage(faq.id)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        faq.showOnHomepage
                          ? 'text-teal-600 bg-teal-50 hover:bg-teal-100'
                          : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                      }`}
                      title={faq.showOnHomepage ? 'Shown on Homepage' : 'Hidden from Homepage'}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(faq)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-brand-50 transition-colors cursor-pointer"
                      title="Edit Question"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingId(faq.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete Question"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div
                      onClick={() => toggleAccordion(faq.id)}
                      className="p-1 text-slate-400 hover:text-slate-700 ml-1 cursor-pointer"
                    >
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Answer Content */}
                {isOpen && (
                  <div className="px-5 pb-4 pt-1 border-t border-slate-100 bg-slate-50/50">
                    <p className="text-xs text-slate-700 leading-relaxed pl-13">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit FAQ Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    {editingItem ? 'Edit FAQ' : 'Add FAQ Question'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Provide clear, patient-friendly medical or administrative guidance.
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
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Question <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) => setFormData((prev) => ({ ...prev, question: e.target.value }))}
                  placeholder="e.g. Do I need an appointment or do you accept walk-in patients?"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
                {formErrors.question && (
                  <p className="text-[11px] text-rose-500 mt-1">{formErrors.question}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Answer <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={formData.answer}
                  onChange={(e) => setFormData((prev) => ({ ...prev, answer: e.target.value }))}
                  placeholder="Provide comprehensive, reassuring instructions..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
                {formErrors.answer && (
                  <p className="text-[11px] text-rose-500 mt-1">{formErrors.answer}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  >
                    {FAQ_CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  >
                    <option value="Active">Active (Visible)</option>
                    <option value="Inactive">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Show on Homepage Checkbox */}
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  id="showOnHomeFAQ"
                  checked={formData.showOnHomepage}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, showOnHomepage: e.target.checked }))
                  }
                  className="w-4 h-4 text-brand-600 rounded-sm focus:ring-brand-500 cursor-pointer"
                />
                <label htmlFor="showOnHomeFAQ" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Feature this question on the Public Homepage FAQ Section
                </label>
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
                  {editingItem ? 'Save FAQ' : 'Add FAQ'}
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
            <h4 className="text-sm font-black text-slate-900">Delete FAQ Question?</h4>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              This question will be removed from your public website accordion.
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
                  deleteFAQ(deletingId);
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
