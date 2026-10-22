import React, { useState, useMemo } from 'react';
import {
  Layers,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Power,
  TrendingUp,
  TrendingDown,
  Tag,
  Check,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { FilterBar } from '../../components/common/FilterBar';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';

export const ChartOfAccountsPage = () => {
  const { categories, addCategory, updateCategory, toggleCategoryStatus } = useClinic();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('ALL'); // 'ALL' | 'Income' | 'Expense'
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Modals state
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    type: 'Expense',
    code: '',
    description: '',
    status: 'Active',
  });

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        cat.name.toLowerCase().includes(q) ||
        cat.code.toLowerCase().includes(q) ||
        (cat.description && cat.description.toLowerCase().includes(q));

      const matchType = selectedType === 'ALL' || cat.type === selectedType;
      const matchStatus = selectedStatus === 'ALL' || cat.status === selectedStatus;

      return matchSearch && matchType && matchStatus;
    });
  }, [categories, search, selectedType, selectedStatus]);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      type: 'Expense',
      code: '',
      description: '',
      status: 'Active',
    });
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      type: cat.type,
      code: cat.code,
      description: cat.description || '',
      status: cat.status,
    });
    setIsAddEditOpen(true);
  };

  const handleSaveCategory = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingCategory) {
      updateCategory(editingCategory.id, formData);
    } else {
      addCategory(formData);
    }
    setIsAddEditOpen(false);
  };

  const columns = [
    {
      key: 'code',
      label: 'Category Code',
      width: '130px',
      render: (val) => <span className="font-mono text-xs font-bold text-slate-800">{val}</span>,
    },
    {
      key: 'name',
      label: 'Category Name',
      render: (val, row) => (
        <div className="flex items-center gap-2.5">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 shadow-2xs ${
              row.type === 'Income'
                ? 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white'
                : 'bg-gradient-to-br from-violet-500 to-purple-600 text-white'
            }`}
          >
            {row.type === 'Income' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          </div>
          <span className="font-bold text-slate-900">{val}</span>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Category Type',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'description',
      label: 'Description / Purpose',
      render: (val) => <span className="text-slate-600 text-xs leading-relaxed">{val || '—'}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      align: 'center',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      sortable: false,
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
            title="Edit Category"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => toggleCategoryStatus(row.id)}
            className={`p-1.5 rounded-lg transition-colors ${
              row.status === 'Active'
                ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
            }`}
            title={row.status === 'Active' ? 'Deactivate Category' : 'Activate Category'}
          >
            <Power className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Chart of Accounts (COA)"
        subtitle="Manage standardized revenue and expenditure classification categories for clinic financial reporting."
        breadcrumbs={[{ label: 'Chart of Accounts' }]}
        actions={
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white rounded-xl text-xs font-semibold shadow-clinical-navy hover:shadow-glow transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Category</span>
          </button>
        }
      />

      {/* Filter and Search Bar */}
      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search category code, name, or description..."
        hasActiveFilters={search !== '' || selectedType !== 'ALL' || selectedStatus !== 'ALL'}
        onResetFilters={() => {
          setSearch('');
          setSelectedType('ALL');
          setSelectedStatus('ALL');
        }}
        totalResults={filteredCategories.length}
      >
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-2xs"
        >
          <option value="ALL">All Types (Income & Expense)</option>
          <option value="Income">Income Categories</option>
          <option value="Expense">Expense Categories</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-2xs"
        >
          <option value="ALL">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </FilterBar>

      {/* Categories Data Table */}
      <DataTable
        columns={columns}
        data={filteredCategories}
        keyField="id"
        emptyMessage="No accounting categories found matching criteria."
      />

      {/* Add / Edit Category Modal (Section 13) */}
      <Modal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        title={editingCategory ? `Edit Category — ${editingCategory.name}` : 'Create Account Category'}
        subtitle="Define ledger category for financial classification of income or expenses."
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveCategory} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold"
              >
                <option value="Income">Income (Revenue)</option>
                <option value="Expense">Expense (Disbursement)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Biomedical Supplies, Rent, Salaried Staff"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Category Code (Optional)
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="Leave blank for auto-code (e.g. EXP-5009)"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description & Clinical Accounting Usage
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Explain what transactions are booked under this category..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddEditOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold shadow-sm shadow-brand-500/20 transition-all"
            >
              {editingCategory ? 'Update Category' : 'Save Category'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
