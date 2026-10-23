import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
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
  FlaskConical,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { FilterBar } from '../../components/common/FilterBar';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { SearchableSelect } from '../../components/common/SearchableSelect';

const DOSAGE_FORMS = [
  'Tablet',
  'Capsule',
  'Syrup',
  'Suspension',
  'Injection',
  'Inhaler',
  'Drops',
  'Cream/Gel',
  'Sachet/Effervescent',
  'Ointment',
  'Solution',
];

const COMMON_FREQUENCIES = [
  '1-0-1 (Twice daily)',
  '1-1-1 (Thrice daily)',
  '1-0-0 (Morning)',
  '0-0-1 (Night)',
  '0-1-0 (Noon)',
  '1 SOS (As needed)',
  '1-1-1-1 (Four times daily)',
  'Every 8 hours',
  'Every 12 hours',
  'Once weekly',
];

const COMMON_DURATIONS = [
  '3 Days',
  '5 Days',
  '7 Days',
  '10 Days',
  '14 Days',
  '15 Days',
  '21 Days',
  '30 Days',
  'Continuous',
  'As needed',
];

export const MedicinesPage = () => {
  const navigate = useNavigate();
  const {
    medicines,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    toggleMedicineStatus,
    prescriptions = [],
    tests = [],
  } = useClinic();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [selectedForm, setSelectedForm] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Modal State
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    dosage: '500 mg',
    dosageForm: 'Tablet',
    frequency: '1-0-1 (Twice daily)',
    duration: '5 Days',
    instructions: 'Take after meals with water',
    category: 'General Medicine',
    status: 'Active',
  });

  // Extract unique categories for filter
  const categoriesList = useMemo(() => {
    const set = new Set();
    medicines.forEach((m) => {
      if (m.category) set.add(m.category);
    });
    return Array.from(set).sort();
  }, [medicines]);

  // Filtered medicines
  const filteredMedicines = useMemo(() => {
    return medicines.filter((m) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        (m.genericName && m.genericName.toLowerCase().includes(q)) ||
        (m.dosage && m.dosage.toLowerCase().includes(q)) ||
        (m.category && m.category.toLowerCase().includes(q)) ||
        (m.instructions && m.instructions.toLowerCase().includes(q));

      const matchForm = selectedForm === 'ALL' || m.dosageForm === selectedForm;
      const matchStatus = selectedStatus === 'ALL' || m.status === selectedStatus;
      const matchCategory = selectedCategory === 'ALL' || m.category === selectedCategory;

      return matchSearch && matchForm && matchStatus && matchCategory;
    });
  }, [medicines, search, selectedForm, selectedStatus, selectedCategory]);

  // Statistics
  const stats = useMemo(() => {
    const total = medicines.length;
    const active = medicines.filter((m) => m.status === 'Active').length;
    const inactive = total - active;
    const formsCount = new Set(medicines.map((m) => m.dosageForm)).size;
    return { total, active, inactive, formsCount };
  }, [medicines]);

  // Handlers
  const handleOpenAdd = () => {
    setEditingMedicine(null);
    setFormData({
      name: '',
      genericName: '',
      dosage: '500 mg',
      dosageForm: 'Tablet',
      frequency: '1-0-1 (Twice daily)',
      duration: '5 Days',
      instructions: 'Take after meals with water',
      category: 'General Medicine',
      status: 'Active',
    });
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (med) => {
    setEditingMedicine(med);
    setFormData({
      name: med.name || '',
      genericName: med.genericName || '',
      dosage: med.dosage || '',
      dosageForm: med.dosageForm || 'Tablet',
      frequency: med.frequency || '1-0-1 (Twice daily)',
      duration: med.duration || '5 Days',
      instructions: med.instructions || '',
      category: med.category || 'General Medicine',
      status: med.status || 'Active',
    });
    setIsAddEditOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingMedicine) {
      updateMedicine(editingMedicine.id, formData);
    } else {
      addMedicine(formData);
    }
    setIsAddEditOpen(false);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from the Medicine Master?`)) {
      deleteMedicine(id);
    }
  };

  // Table Columns
  const columns = [
    {
      header: 'Medicine / Brand',
      accessor: 'name',
      render: (_, row) => (
        <div className="flex items-start gap-2.5">
          <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/60 mt-0.5 flex-shrink-0">
            <Pill className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-xs sm:text-sm">{row.name}</span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-slate-100 text-slate-600 border border-slate-200">
                {row.dosageForm}
              </span>
            </div>
            <p className="text-[11px] text-teal-800 font-medium mt-0.5">
              {row.genericName || 'Generic formula not specified'}
            </p>
            {row.category && (
              <span className="inline-block text-[10px] text-slate-500 font-medium">
                {row.category}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      header: 'Strength / Dosage',
      accessor: 'dosage',
      render: (dosage) => (
        <span className="font-semibold text-slate-800 text-xs px-2 py-0.5 bg-slate-50 border border-slate-200 rounded-md">
          {dosage || '—'}
        </span>
      ),
    },
    {
      header: 'Default Frequency',
      accessor: 'frequency',
      render: (freq) => (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 bg-brand-50/80 px-2.5 py-1 rounded-lg border border-brand-200/50">
          <Clock className="w-3 h-3 text-brand-600" />
          <span>{freq}</span>
        </span>
      ),
    },
    {
      header: 'Default Duration',
      accessor: 'duration',
      render: (dur) => (
        <span className="text-xs text-slate-700 font-medium">
          {dur || '—'}
        </span>
      ),
    },
    {
      header: 'Default Instructions',
      accessor: 'instructions',
      render: (inst) => (
        <p className="text-xs text-slate-600 max-w-xs line-clamp-2" title={inst}>
          {inst || <span className="text-slate-400 italic">No special instructions</span>}
        </p>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (status, row) => (
        <button
          type="button"
          onClick={() => toggleMedicineStatus(row.id)}
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
            title="Edit Medicine"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleDelete(row.id, row.name)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Delete Medicine"
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
        title="Medicines Master Catalog"
        subtitle="Manage predefined pharmaceutical medicines, generic formulas, strengths, dosage forms, and default clinical instructions for 1-click prescription creation."
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
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-xl text-xs font-semibold shadow-sm shadow-teal-500/25 transition-all hover:shadow-glow active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Medicine</span>
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
            className="flex items-center gap-2 px-3.5 py-2 bg-white text-teal-800 font-bold rounded-xl shadow-xs border border-teal-200/80 cursor-pointer"
          >
            <Pill className="w-4 h-4 text-teal-600" />
            <span>Medicines Master</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-teal-50 text-teal-700 font-extrabold">
              {medicines.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/prescriptions/tests')}
            className="flex items-center gap-2 px-3.5 py-2 text-slate-600 hover:text-slate-900 hover:bg-white/60 font-semibold rounded-xl transition-colors cursor-pointer"
          >
            <FlaskConical className="w-4 h-4 text-indigo-600" />
            <span>Diagnostic Tests Master</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-200 text-slate-700 font-bold">
              {tests.length}
            </span>
          </button>
        </div>

        <span className="hidden md:flex items-center gap-1.5 text-[11px] text-slate-500 font-medium pr-3">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          Predefined medicines catalog connected directly with Rx creation
        </span>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Catalog
            </span>
            <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
              <Pill className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{stats.total}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Predefined medicines</p>
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
          <p className="text-[11px] text-slate-500 mt-0.5">Ready for auto-fill in prescriptions</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Dosage Forms
            </span>
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{stats.formsCount}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Tablets, syrups, inhalers, etc.</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Archived / Inactive
            </span>
            <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-600 mt-2">{stats.inactive}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Hidden from doctor selection</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Live Search */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search brand, generic name, strength, category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          {/* Dosage Form Filter */}
          <div>
            <SearchableSelect
              value={selectedForm}
              onChange={(e) => setSelectedForm(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 font-medium"
              searchPlaceholder="Filter dosage form..."
            >
              <option value="ALL">All Dosage Forms</option>
              {DOSAGE_FORMS.map((form) => (
                <option key={form} value={form}>
                  {form}
                </option>
              ))}
            </SearchableSelect>
          </div>

          {/* Category Filter */}
          <div>
            <SearchableSelect
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 font-medium"
              searchPlaceholder="Filter therapeutic class..."
            >
              <option value="ALL">All Categories</option>
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
            Showing <strong className="text-slate-800">{filteredMedicines.length}</strong> of{' '}
            <strong className="text-slate-800">{medicines.length}</strong> master medicines
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full font-medium">
            <Sparkles className="w-3 h-3" />
            Auto-fills brand, strength, frequency, and instructions into prescriptions
          </span>
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={filteredMedicines}
        emptyMessage="No medicines match your filter criteria. Try adjusting your search term."
      />

      {/* Add / Edit Medicine Modal */}
      <Modal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        title={editingMedicine ? `Edit Medicine: ${editingMedicine.name}` : 'Add Predefined Medicine'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Brand / Medicine Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Medicine / Brand Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Panadol, Augmentin, Glucophage"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            {/* Generic / Formula Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Generic / Formula Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Paracetamol, Amoxicillin + Clavulanic Acid"
                value={formData.genericName}
                onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            {/* Strength / Dosage */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Strength / Dosage *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 500 mg, 625 mg, 10 ml, 100 mcg"
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            {/* Dosage Form */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Dosage Form *
              </label>
              <SearchableSelect
                value={formData.dosageForm}
                onChange={(e) => setFormData({ ...formData, dosageForm: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white font-medium"
              >
                {DOSAGE_FORMS.map((form) => (
                  <option key={form} value={form}>
                    {form}
                  </option>
                ))}
              </SearchableSelect>
            </div>

            {/* Default Frequency */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Default Frequency *
              </label>
              <SearchableSelect
                allowCustom={true}
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                placeholder="Select or enter frequency..."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white font-medium"
              >
                {COMMON_FREQUENCIES.map((freq) => (
                  <option key={freq} value={freq}>
                    {freq}
                  </option>
                ))}
              </SearchableSelect>
            </div>

            {/* Duration / No. of Days */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Default Duration / Days *
              </label>
              <SearchableSelect
                allowCustom={true}
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="Select or enter duration..."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white font-medium"
              >
                {COMMON_DURATIONS.map((dur) => (
                  <option key={dur} value={dur}>
                    {dur}
                  </option>
                ))}
              </SearchableSelect>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Therapeutic Class / Category
              </label>
              <input
                type="text"
                placeholder="e.g. Analgesic, Antibiotic, Cardiovascular"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            {/* Active Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Status
              </label>
              <SearchableSelect
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white font-medium"
              >
                <option value="Active">Active (Available in Prescriptions)</option>
                <option value="Inactive">Inactive (Archived)</option>
              </SearchableSelect>
            </div>
          </div>

          {/* Default Instructions */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Default Clinical Administration Instructions *
            </label>
            <textarea
              rows={2}
              required
              placeholder="e.g. Take after meals with a full glass of water. Avoid taking on empty stomach."
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              When doctors select this medicine in any prescription, these instructions will automatically populate, while remaining freely editable for that individual patient.
            </p>
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
              className="px-5 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
            >
              {editingMedicine ? 'Update Medicine' : 'Save to Master'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
