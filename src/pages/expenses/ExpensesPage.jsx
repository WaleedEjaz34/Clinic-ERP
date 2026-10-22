import React, { useState, useMemo } from 'react';
import {
  TrendingDown,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Printer,
  Download,
  Paperclip,
  AlertTriangle,
  Building2,
  Wallet,
  Receipt,
  Check,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { FilterBar } from '../../components/common/FilterBar';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { generateExpenseVoucherPDF } from '../../services/documentService';

export const ExpensesPage = () => {
  const {
    expenses,
    accounts,
    categories,
    addExpense,
    updateExpense,
    deleteExpense,
    openDocument,
  } = useClinic();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedAccount, setSelectedAccount] = useState('ALL');

  // Modals state
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    categoryId: '',
    description: '',
    amount: 1500,
    accountId: accounts[0]?.id || '',
    expenseDate: new Date().toISOString().split('T')[0],
    reference: '',
    attachmentName: '',
    notes: '',
  });

  const [formError, setFormError] = useState('');

  // Active Expense categories only (from Chart of Accounts)
  const activeExpenseCategories = useMemo(() => {
    return categories.filter((c) => c.type === 'Expense' && c.status === 'Active');
  }, [categories]);

  // Selected account object for real-time balance indicator
  const selectedAccountObj = useMemo(() => {
    return accounts.find((a) => a.id === formData.accountId);
  }, [accounts, formData.accountId]);

  // Filtered expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        e.id.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.categoryName.toLowerCase().includes(q) ||
        (e.reference && e.reference.toLowerCase().includes(q));

      const matchCat = selectedCategory === 'ALL' || e.categoryId === selectedCategory;
      const matchAcc = selectedAccount === 'ALL' || e.accountId === selectedAccount;

      return matchSearch && matchCat && matchAcc;
    });
  }, [expenses, search, selectedCategory, selectedAccount]);

  const handleOpenAdd = () => {
    setEditingExpense(null);
    setFormError('');
    setFormData({
      categoryId: activeExpenseCategories[0]?.id || '',
      description: '',
      amount: 1500,
      accountId: accounts[0]?.id || '',
      expenseDate: new Date().toISOString().split('T')[0],
      reference: `VOUCH-2026-${String(expenses.length + 1).padStart(3, '0')}`,
      attachmentName: '',
      notes: '',
    });
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (exp) => {
    setEditingExpense(exp);
    setFormError('');
    setFormData({
      categoryId: exp.categoryId,
      description: exp.description,
      amount: exp.amount,
      accountId: exp.accountId,
      expenseDate: exp.expenseDate,
      reference: exp.reference || '',
      attachmentName: exp.attachmentName || '',
      notes: exp.notes || '',
    });
    setIsAddEditOpen(true);
  };

  const handleSaveExpense = (e) => {
    e.preventDefault();
    setFormError('');

    if (editingExpense) {
      const res = updateExpense(editingExpense.id, formData);
      if (res.success) setIsAddEditOpen(false);
      else setFormError(res.error || 'Failed to update expense');
    } else {
      const res = addExpense(formData);
      if (res.success) setIsAddEditOpen(false);
      else setFormError(res.error || 'Failed to record expense');
    }
  };

  const confirmDeleteExpense = () => {
    if (deletingId) {
      deleteExpense(deletingId);
      setIsDeleteOpen(false);
      setDeletingId(null);
    }
  };

  // Simulate local file attachment picker
  const handleSimulateAttachment = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, attachmentName: file.name }));
    }
  };

  const columns = [
    {
      key: 'id',
      label: 'Expense ID',
      width: '120px',
      render: (val, row) => (
        <div>
          <span className="font-mono text-xs font-bold text-slate-800">{val}</span>
          <span className="text-[10px] text-slate-400 font-mono block">{row.reference}</span>
        </div>
      ),
    },
    {
      key: 'expenseDate',
      label: 'Disbursement Date',
      render: (val) => <span className="text-slate-600">{formatDate(val)}</span>,
    },
    {
      key: 'categoryName',
      label: 'Expense Category',
      render: (val) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-violet-50 text-violet-700 border border-violet-200/60">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
          {val}
        </span>
      ),
    },
    {
      key: 'description',
      label: 'Description / Particulars',
      render: (val, row) => (
        <div className="max-w-xs">
          <p className="text-slate-900 font-medium text-xs truncate leading-snug">{val}</p>
          {row.attachmentName && (
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
              <Paperclip className="w-3 h-3 text-slate-400" />
              <span className="truncate max-w-[140px]">{row.attachmentName}</span>
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'accountName',
      label: 'Paid From Account',
      render: (val) => <span className="text-xs text-slate-600 font-medium">{val}</span>,
    },
    {
      key: 'amount',
      label: 'Amount Paid',
      align: 'right',
      render: (val) => (
        <span className="font-bold text-rose-600 font-mono text-sm">{formatCurrency(val)}</span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      sortable: false,
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => openDocument('voucher', row)}
            className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
            title="Print Expense Voucher"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            onClick={() => generateExpenseVoucherPDF(row)}
            className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            title="Download PDF Voucher"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
            title="Edit Expense"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setDeletingId(row.id);
              setIsDeleteOpen(true);
            }}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete Expense"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Expense Management"
        subtitle="Record clinic disbursements, utilities, supplies, and maintenance with automatic account balance deduction."
        breadcrumbs={[{ label: 'Expenses' }]}
        actions={
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white rounded-xl text-xs font-semibold shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Expense</span>
          </button>
        }
      />

      {/* Filter and Search Bar */}
      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search expense voucher ID, particulars, or reference..."
        hasActiveFilters={search !== '' || selectedCategory !== 'ALL' || selectedAccount !== 'ALL'}
        onResetFilters={() => {
          setSearch('');
          setSelectedCategory('ALL');
          setSelectedAccount('ALL');
        }}
        totalResults={filteredExpenses.length}
      >
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-2xs"
        >
          <option value="ALL">All Expense Categories</option>
          {activeExpenseCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-2xs"
        >
          <option value="ALL">All Payment Accounts</option>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </FilterBar>

      {/* Expenses Data Table */}
      <DataTable
        columns={columns}
        data={filteredExpenses}
        keyField="id"
        emptyMessage="No clinic expenses recorded matching criteria."
      />

      {/* Add / Edit Expense Modal (Section 14) */}
      <Modal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        title={editingExpense ? `Edit Expense Voucher — ${editingExpense.id}` : 'Record Clinic Expense'}
        subtitle="Disburse funds from selected cash register or bank account with automatic ledger deduction."
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSaveExpense} className="space-y-4">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-xs text-rose-800">
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Expense Category *
              </label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              >
                {activeExpenseCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Disbursement Date *
              </label>
              <input
                type="date"
                required
                value={formData.expenseDate}
                onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Paid From Account *
            </label>
            <select
              required
              value={formData.accountId}
              onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold"
            >
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} — Available: {formatCurrency(a.currentBalance)}
                </option>
              ))}
            </select>
            {selectedAccountObj && (
              <p className="text-[11px] text-slate-500 mt-1">
                Current Available Balance: <strong className="text-slate-800">{formatCurrency(selectedAccountObj.currentBalance)}</strong>
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Expense Amount (PKR) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold text-rose-600 text-base"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reference / Voucher Number
              </label>
              <input
                type="text"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                placeholder="e.g. VOUCH-2026-041"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Particulars / Expense Description *
            </label>
            <textarea
              rows={2}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. Purchased 10 boxes disposable latex gloves, BD syringes..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          {/* Attachment upload simulator */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Attach Receipt / Bill Scan (Frontend Preview)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                onChange={handleSimulateAttachment}
                className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
              />
              {formData.attachmentName && (
                <span className="text-[11px] text-emerald-600 font-medium truncate max-w-xs">
                  ✓ {formData.attachmentName}
                </span>
              )}
            </div>
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
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-sm shadow-rose-500/20 transition-all"
            >
              {editingExpense ? 'Save Voucher Updates' : 'Record & Deduct Expense'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Expense Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDeleteExpense}
        title="Delete Expense Voucher"
        message="Are you sure you want to delete this expense record? Deleting this voucher will automatically reverse the expense and restore the disbursed funds back into the account balance."
        confirmText="Yes, Delete & Restore Balance"
        type="danger"
      />
    </div>
  );
};
