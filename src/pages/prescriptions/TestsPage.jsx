import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FlaskConical,
  Pill,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Power,
  FileText,
  Clock,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Stethoscope,
  Info,
  DollarSign,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { FilterBar } from '../../components/common/FilterBar';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { SearchableSelect } from '../../components/common/SearchableSelect';
import { formatCurrency } from '../../utils/currency';

const TEST_CATEGORIES = [
  'Hematology',
  'Clinical Biochemistry',
  'Endocrinology',
  'Lipid & Cardiovascular',
  'Urine & Body Fluids',
  'Microbiology & Serology',
  'Radiology & Imaging',
  'Cardiology',
  'Pathology / Histopathology',
  'General Diagnostics',
];

const SAMPLE_TYPES = [
  'Whole Blood (EDTA)',
  'Serum',
  'Fluoride Plasma',
  'Spot Midstream Urine',
  'Sterile Midstream Urine',
  'Fresh Stool',
  'Digital Radiography',
  'Sonography / Ultrasound',
  'Diagnostic Non-invasive',
  'Swab / Culture',
];

export const TestsPage = () => {
  const navigate = useNavigate();
  const {
    tests,
    addTest,
    updateTest,
    deleteTest,
    toggleTestStatus,
    prescriptions = [],
    medicines = [],
  } = useClinic();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Modal State
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingTest, setEditingTest] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Clinical Biochemistry',
    shortCode: '',
    instructions: 'No fasting required. Water permitted.',
    notes: '',
    sampleType: 'Serum',
    standardPrice: 1000,
    status: 'Active',
  });

  // Unique categories for filter
  const categoriesList = useMemo(() => {
    const set = new Set(TEST_CATEGORIES);
    tests.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return Array.from(set).sort();
  }, [tests]);

  // Filtered tests
  const filteredTests = useMemo(() => {
    return tests.filter((t) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        (t.shortCode && t.shortCode.toLowerCase().includes(q)) ||
        (t.category && t.category.toLowerCase().includes(q)) ||
        (t.instructions && t.instructions.toLowerCase().includes(q)) ||
        (t.notes && t.notes.toLowerCase().includes(q));

      const matchCategory = selectedCategory === 'ALL' || t.category === selectedCategory;
      const matchStatus = selectedStatus === 'ALL' || t.status === selectedStatus;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [tests, search, selectedCategory, selectedStatus]);

  // Statistics
  const stats = useMemo(() => {
    const total = tests.length;
    const active = tests.filter((t) => t.status === 'Active').length;
    const inactive = total - active;
    const categoriesCount = new Set(tests.map((t) => t.category)).size;
    return { total, active, inactive, categoriesCount };
  }, [tests]);

  // Handlers
  const handleOpenAdd = () => {
    setEditingTest(null);
    setFormData({
      name: '',
      category: 'Clinical Biochemistry',
      shortCode: '',
      instructions: 'No fasting required. Water permitted.',
      notes: '',
      sampleType: 'Serum',
      standardPrice: 1000,
      status: 'Active',
    });
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (test) => {
    setEditingTest(test);
    setFormData({
      name: test.name || '',
      category: test.category || 'Clinical Biochemistry',
      shortCode: test.shortCode || '',
      instructions: test.instructions || '',
      notes: test.notes || '',
      sampleType: test.sampleType || 'Serum',
      standardPrice: test.standardPrice || 1000,
      status: test.status || 'Active',
    });
    setIsAddEditOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingTest) {
      updateTest(editingTest.id, formData);
    } else {
      addTest(formData);
    }
    setIsAddEditOpen(false);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from the Diagnostic Tests Master?`)) {
      deleteTest(id);
    }
  };

  // Table Columns
  const columns = [
    {
      header: 'Test Name & Code',
      accessor: 'name',
      render: (_, row) => (
        <div className="flex items-start gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200/60 mt-0.5 flex-shrink-0">
            <FlaskConical className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-xs sm:text-sm">{row.name}</span>
              {row.shortCode && (
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded bg-indigo-100/70 text-indigo-800 border border-indigo-200">
                  {row.shortCode}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-block text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-semibold">
                {row.category}
              </span>
              {row.sampleType && (
                <span className="text-[10px] text-slate-400">
                  • {row.sampleType}
                </span>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Category / Department',
      accessor: 'category',
      render: (cat) => (
        <span className="text-xs font-semibold text-slate-800 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200">
          {cat}
        </span>
      ),
    },
    {
      header: 'Preparation Instructions',
      accessor: 'instructions',
      render: (inst) => (
        <div className="max-w-xs">
          <p className="text-xs text-slate-700 leading-snug" title={inst}>
            {inst || <span className="text-slate-400 italic">No specific preparation required</span>}
          </p>
        </div>
      ),
    },
    {
      header: 'Clinical Notes / Purpose',
      accessor: 'notes',
      render: (notes) => (
        <div className="max-w-xs">
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed" title={notes}>
            {notes || '—'}
          </p>
        </div>
      ),
    },
    {
      header: 'Standard Fee',
      accessor: 'standardPrice',
      render: (price) => (
        <span className="text-xs font-bold text-slate-800">
          {price ? formatCurrency(price) : '—'}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (status, row) => (
        <button
          type="button"
          onClick={() => toggleTestStatus(row.id)}
          className="group inline-flex items-center gap-1.5 cursor-pointer"
          title={`Click to mark as ${status === 'Active' ? 'Inactive' : 'Active'}`}
        >
          <StatusBadge status={status} />
          <Power className="w-3 h-3 text-slate-300 group-hover:text-slate-600 transition-colors" />
        </button>
      ),
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors cursor-pointer"
            title="Edit Test"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleDelete(row.id, row.name)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Delete Test"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <PageHeader
        title="Diagnostic & Lab Tests Master"
        subtitle="Maintain predefined laboratory investigations, blood profiles, imaging procedures, sample preparation instructions, and clinical diagnostic notes."
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/prescriptions?action=new')}
            className="inline-flex items-center gap-2 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>New Prescription</span>
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-brand-600 hover:from-indigo-500 hover:to-brand-500 text-white rounded-xl text-xs font-semibold shadow-sm shadow-indigo-500/25 transition-all hover:shadow-glow active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Diagnostic Test</span>
          </button>
        </div>
      </PageHeader>

      {/* Module Navigation Sub-Tabs Banner */}
      <div className="flex items-center justify-between p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/80 text-xs">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => navigate('/prescriptions')}
            className="flex items-center gap-2 px-3.5 py-2 text-slate-600 hover:text-slate-900 hover:bg-white/60 font-semibold rounded-xl transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4 text-brand-600" />
            <span>Prescription Records</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-200 text-slate-700 font-bold">
              {prescriptions.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/prescriptions/medicines')}
            className="flex items-center gap-2 px-3.5 py-2 text-slate-600 hover:text-slate-900 hover:bg-white/60 font-semibold rounded-xl transition-colors cursor-pointer"
          >
            <Pill className="w-4 h-4 text-teal-600" />
            <span>Medicines Master</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-200 text-slate-700 font-bold">
              {medicines.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/prescriptions/tests')}
            className="flex items-center gap-2 px-3.5 py-2 bg-white text-indigo-700 font-bold rounded-xl shadow-xs border border-indigo-200/80 cursor-pointer"
          >
            <FlaskConical className="w-4 h-4 text-indigo-600" />
            <span>Diagnostic Tests Master</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-50 text-indigo-700 font-extrabold">
              {tests.length}
            </span>
          </button>
        </div>

        <span className="hidden md:flex items-center gap-1.5 text-[11px] text-slate-500 font-medium pr-3">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          Predefined diagnostic tests directory connected directly with Rx creation
        </span>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Tests
            </span>
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
              <FlaskConical className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{stats.total}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Predefined lab tests</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Active For Rx
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-2">{stats.active}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Selectable by consulting doctors</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Departments / Types
            </span>
            <div className="p-1.5 rounded-lg bg-brand-50 text-brand-700">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{stats.categoriesCount}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Biochemistry, Imaging, ECG, etc.</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Archived Tests
            </span>
            <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-600 mt-2">{stats.inactive}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Discontinued / hidden tests</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Live Search */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search test name, code (e.g. CBC, FBS), instructions, or notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <SearchableSelect
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 font-medium"
              searchPlaceholder="Filter department/type..."
            >
              <option value="ALL">All Categories / Types</option>
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </SearchableSelect>
          </div>

          {/* Status Filter */}
          <div>
            <SearchableSelect
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 font-medium"
              searchPlaceholder="Filter status..."
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </SearchableSelect>
          </div>
        </div>

        {/* Quick hint banner */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
          <span>
            Showing <strong className="text-slate-800">{filteredTests.length}</strong> of{' '}
            <strong className="text-slate-800">{tests.length}</strong> diagnostic tests
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full font-medium">
            <Sparkles className="w-3 h-3" />
            Supports single & multi-test selection with pre-filled preparation guidelines in prescriptions
          </span>
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={filteredTests}
        emptyMessage="No diagnostic tests match your filter criteria."
      />

      {/* Add / Edit Test Modal */}
      <Modal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        title={editingTest ? `Edit Diagnostic Test: ${editingTest.name}` : 'Add New Diagnostic / Lab Test'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Test Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Diagnostic / Lab Test Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Complete Blood Count (CBC) with ESR"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            {/* Short Name / Code */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Short Name / Code *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. CBC, FBS, HbA1c, LFT, CXR"
                value={formData.shortCode}
                onChange={(e) => setFormData({ ...formData, shortCode: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono font-bold text-indigo-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            {/* Test Category / Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Test Category / Type *
              </label>
              <SearchableSelect
                allowCustom={true}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white font-medium"
              >
                {TEST_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </SearchableSelect>
            </div>

            {/* Sample Type / Modality */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sample Type / Modality
              </label>
              <SearchableSelect
                allowCustom={true}
                value={formData.sampleType}
                onChange={(e) => setFormData({ ...formData, sampleType: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white font-medium"
              >
                {SAMPLE_TYPES.map((sample) => (
                  <option key={sample} value={sample}>
                    {sample}
                  </option>
                ))}
              </SearchableSelect>
            </div>

            {/* Standard Price (PKR) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Standard Fee (PKR)
              </label>
              <input
                type="number"
                min="0"
                step="50"
                value={formData.standardPrice}
                onChange={(e) => setFormData({ ...formData, standardPrice: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white font-medium"
              />
            </div>

            {/* Status */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Active / Inactive Status
              </label>
              <SearchableSelect
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white font-medium"
              >
                <option value="Active">Active (Available for prescription selection)</option>
                <option value="Inactive">Inactive (Discontinued / Archived)</option>
              </SearchableSelect>
            </div>
          </div>

          {/* Preparation Instructions */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Patient Preparation Instructions *
            </label>
            <textarea
              rows={2}
              required
              placeholder="e.g. Requires 10-12 hours overnight fasting. Water permitted. Avoid alcohol or heavy fatty meals 24 hrs prior."
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              These preparation instructions will auto-fill whenever a doctor advises this investigation in an OPD prescription.
            </p>
          </div>

          {/* Clinical Diagnostic Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Clinical Diagnostic Notes / Clinical Significance
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Biomarker for 3-month glycemic control monitoring; assesses diabetes mellitus progression."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddEditOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-brand-600 hover:from-indigo-500 hover:to-brand-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
            >
              {editingTest ? 'Update Test' : 'Save Test to Master'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
