import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Landmark,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Power,
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  Building2,
  Receipt,
  TrendingDown,
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
import { formatDate } from '../../utils/date';

export const AccountsPage = () => {
  const {
    accounts,
    addAccount,
    updateAccount,
    toggleAccountStatus,
    payments,
    expenses,
  } = useClinic();

  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');

  // Modals state
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [viewingAccount, setViewingAccount] = useState(null);

  // React to Sub-Tab navigation
  useEffect(() => {
    const type = searchParams.get('type');
    const tab = searchParams.get('tab');

    if (type) {
      setSelectedType(type);
    } else {
      setSelectedType('ALL');
    }

    if (tab === 'ledgers') {
      if (accounts.length > 0) {
        setViewingAccount(accounts[0]);
        setIsHistoryOpen(true);
      }
    }
  }, [searchParams, accounts]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    type: 'Bank',
    bankName: '',
    accountNumber: '',
    openingBalance: 100000,
    description: '',
    status: 'Active',
  });

  // Filtered accounts
  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        acc.name.toLowerCase().includes(q) ||
        acc.id.toLowerCase().includes(q) ||
        (acc.bankName && acc.bankName.toLowerCase().includes(q)) ||
        (acc.accountNumber && acc.accountNumber.toLowerCase().includes(q));

      const matchType = selectedType === 'ALL' || acc.type === selectedType;
      return matchSearch && matchType;
    });
  }, [accounts, search, selectedType]);

  const handleOpenAdd = () => {
    setEditingAccount(null);
    setFormData({
      name: '',
      type: 'Bank',
      bankName: '',
      accountNumber: '',
      openingBalance: 100000,
      description: '',
      status: 'Active',
    });
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (acc) => {
    setEditingAccount(acc);
    setFormData({
      name: acc.name,
      type: acc.type,
      bankName: acc.bankName || '',
      accountNumber: acc.accountNumber || '',
      openingBalance: acc.openingBalance,
      description: acc.description || '',
      status: acc.status,
    });
    setIsAddEditOpen(true);
  };

  const handleSaveAccount = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingAccount) {
      updateAccount(editingAccount.id, formData);
    } else {
      addAccount(formData);
    }
    setIsAddEditOpen(false);
  };

  const handleOpenHistory = (acc) => {
    setViewingAccount(acc);
    setIsHistoryOpen(true);
  };

  // Build running transaction ledger for viewingAccount (Inflows from Payments, Outflows from Expenses)
  const accountTransactions = useMemo(() => {
    if (!viewingAccount) return [];

    const inflows = payments
      .filter((p) => p.accountId === viewingAccount.id)
      .map((p) => ({
        id: p.id,
        date: p.paymentDate,
        reference: p.receiptNumber,
        type: 'Inflow',
        description: `Patient Collection: ${p.patientName} (${p.billNumber})`,
        inflow: p.amount,
        outflow: 0,
      }));

    const outflows = expenses
      .filter((e) => e.accountId === viewingAccount.id)
      .map((e) => ({
        id: e.id,
        date: e.expenseDate,
        reference: e.reference || e.id,
        type: 'Outflow',
        description: `Expense: ${e.categoryName} — ${e.description}`,
        inflow: 0,
        outflow: e.amount,
      }));

    // Combine and sort by date ascending to calculate running balance
    const combined = [...inflows, ...outflows].sort((a, b) => new Date(a.date) - new Date(b.date));

    let running = viewingAccount.openingBalance || 0;
    const ledger = combined.map((tx) => {
      running = running + tx.inflow - tx.outflow;
      return {
        ...tx,
        runningBalance: running,
      };
    });

    // Return reversed so most recent appears on top
    return ledger.reverse();
  }, [viewingAccount, payments, expenses]);

  const columns = [
    {
      key: 'id',
      label: 'Account ID',
      width: '110px',
      render: (val) => <span className="font-mono text-xs font-bold text-slate-700">{val}</span>,
    },
    {
      key: 'name',
      label: 'Account Name',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-2xs ${
              row.type === 'Cash'
                ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white'
                : 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white'
            }`}
          >
            {row.type === 'Cash' ? <Wallet className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
          </div>
          <div>
            <span className="font-bold text-slate-900 block leading-tight">{val}</span>
            <span className="text-[11px] text-slate-500 font-mono">
              {row.type === 'Bank' ? `${row.bankName} • ${row.accountNumber}` : row.accountNumber}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Account Type',
      render: (val) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${
            val === 'Cash'
              ? 'bg-amber-50 text-amber-700 border-amber-200/60'
              : 'bg-blue-50 text-blue-700 border-blue-200/60'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              val === 'Cash' ? 'bg-amber-500' : 'bg-blue-500'
            }`}
          />
          {val}
        </span>
      ),
    },
    {
      key: 'openingBalance',
      label: 'Opening Balance',
      align: 'right',
      render: (val) => <span className="text-slate-500 font-mono text-xs">{formatCurrency(val)}</span>,
    },
    {
      key: 'currentBalance',
      label: 'Current Balance',
      align: 'right',
      render: (val) => (
        <span className="font-bold text-slate-900 font-mono text-sm">{formatCurrency(val)}</span>
      ),
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
            onClick={() => handleOpenHistory(row)}
            className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
            title="View Account Transactions Ledger"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
            title="Edit Account Details"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => toggleAccountStatus(row.id)}
            className={`p-1.5 rounded-lg transition-colors ${
              row.status === 'Active'
                ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
            }`}
            title={row.status === 'Active' ? 'Deactivate Account' : 'Activate Account'}
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
        title="Cash & Bank Accounts"
        subtitle="Manage physical cash drawers, digital collection merchant accounts, and bank operational balances."
        breadcrumbs={[{ label: 'Accounts' }]}
        actions={
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white rounded-xl text-xs font-semibold shadow-clinical-navy hover:shadow-glow transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Account</span>
          </button>
        }
      />

      {/* Filter and Search Bar */}
      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search account name, bank, IBAN, or ID..."
        hasActiveFilters={search !== '' || selectedType !== 'ALL'}
        onResetFilters={() => {
          setSearch('');
          setSelectedType('ALL');
        }}
        totalResults={filteredAccounts.length}
      >
        <div className="min-w-[170px]">
          <SearchableSelect
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-2xs"
            searchPlaceholder="Filter account type..."
          >
            <option value="ALL">All Account Types</option>
            <option value="Cash">Cash Drawer</option>
            <option value="Bank">Bank Account</option>
          </SearchableSelect>
        </div>
      </FilterBar>

      {/* Accounts Data Table */}
      <DataTable
        columns={columns}
        data={filteredAccounts}
        keyField="id"
        emptyMessage="No financial accounts registered matching criteria."
      />

      {/* Add / Edit Account Modal (Section 12) */}
      <Modal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        title={editingAccount ? `Edit Account — ${editingAccount.name}` : 'Create Financial Account'}
        subtitle="Register cash register or commercial bank account for clinic receipts and expenses."
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSaveAccount} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Account Type *
              </label>
              <SearchableSelect
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                searchPlaceholder="Search account type..."
              >
                <option value="Cash">Physical Cash Drawer</option>
                <option value="Bank">Bank Account</option>
              </SearchableSelect>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Account Status
              </label>
              <SearchableSelect
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                searchPlaceholder="Search account status..."
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </SearchableSelect>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Account Display Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Meezan Bank OPD Operational A/C"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          {formData.type === 'Bank' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  placeholder="e.g. Meezan Bank Ltd"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Account / IBAN Number
                </label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  placeholder="PK72MEZN..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Opening Balance (PKR) *
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.openingBalance}
              onChange={(e) => setFormData({ ...formData, openingBalance: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Account Description & Purpose
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. Primary reception collection drawer for outpatient billing..."
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
              {editingAccount ? 'Update Account' : 'Save Account'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Account Transactions Ledger Modal (Section 12) */}
      <Modal
        isOpen={isHistoryOpen}
        onClose={() => {
          setIsHistoryOpen(false);
          if (searchParams.get('tab')) setSearchParams({});
        }}
        title={viewingAccount ? `Transaction Ledger — ${viewingAccount.name}` : 'Ledger History'}
        subtitle="Chronological inflows from billing collections and outflows from clinic expense vouchers."
        maxWidth="max-w-3xl"
      >
        {viewingAccount && (
          <div className="space-y-4">
            {/* Balance Overview Card */}
            <div className="p-4 bg-slate-900 text-white rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Current Available Balance</span>
                <h3 className="text-2xl font-black text-emerald-400 mt-0.5">
                  {formatCurrency(viewingAccount.currentBalance)}
                </h3>
              </div>
              <div className="text-right text-xs text-slate-400">
                <p><strong>Opening Balance:</strong> {formatCurrency(viewingAccount.openingBalance)}</p>
                <p><strong>Account Ref:</strong> {viewingAccount.accountNumber || viewingAccount.id}</p>
              </div>
            </div>

            {/* Transactions Table */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Recorded Transactions ({accountTransactions.length})
              </h4>

              {accountTransactions.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-6 text-center">
                  No inflows or outflows recorded for this account yet.
                </p>
              ) : (
                <div className="border border-slate-200 rounded-xl overflow-hidden max-h-80 overflow-y-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] border-b border-slate-200 sticky top-0">
                      <tr>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Reference</th>
                        <th className="py-2.5 px-3">Description</th>
                        <th className="py-2.5 px-3 text-right">Inflow (+)</th>
                        <th className="py-2.5 px-3 text-right">Outflow (-)</th>
                        <th className="py-2.5 px-3 text-right">Running Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {accountTransactions.map((tx, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/70">
                          <td className="py-2.5 px-3 whitespace-nowrap text-slate-500">{formatDate(tx.date)}</td>
                          <td className="py-2.5 px-3 font-mono font-semibold text-slate-800">{tx.reference}</td>
                          <td className="py-2.5 px-3">{tx.description}</td>
                          <td className="py-2.5 px-3 text-right font-semibold text-emerald-600">
                            {tx.inflow > 0 ? formatCurrency(tx.inflow) : '—'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-semibold text-rose-600">
                            {tx.outflow > 0 ? formatCurrency(tx.outflow) : '—'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                            {formatCurrency(tx.runningBalance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
