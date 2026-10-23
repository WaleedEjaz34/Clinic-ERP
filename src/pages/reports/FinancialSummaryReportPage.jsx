import React, { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Calendar,
  Search,
  Printer,
  Download,
  TrendingUp,
  TrendingDown,
  Coins,
  DollarSign,
  Filter,
  Landmark,
  Wallet,
  FileSpreadsheet,
  FileCheck,
  CheckCircle2,
  X,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Building2,
  ArrowRight,
  Eye,
  CreditCard,
  Receipt,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Modal } from '../../components/common/Modal';
import { SearchableSelect } from '../../components/common/SearchableSelect';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { generateFinancialSummaryReportPDF } from '../../services/documentService';

export const FinancialSummaryReportPage = () => {
  const navigate = useNavigate();
  const {
    payments = [],
    expenses = [],
    accounts = [],
  } = useClinic();

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Filter State: Date range with default "thisMonth"
  const [datePreset, setDatePreset] = useState('month'); // 'today' | 'yesterday' | 'week' | 'month' | 'last30' | 'all' | 'custom'
  const [startDate, setStartDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(todayStr);

  // Account filter: 'ALL' or specific account ID
  const [selectedAccountId, setSelectedAccountId] = useState('ALL');

  // Search input for date text
  const [search, setSearch] = useState('');

  // Selected row for detail drawer / breakdown
  const [selectedRowDetail, setSelectedRowDetail] = useState(null);

  // Modals & Export menu state
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const exportMenuRef = useRef(null);

  // Quick Preset Change Handler
  const handlePresetChange = (preset) => {
    setDatePreset(preset);
    const now = new Date();

    if (preset === 'today') {
      setStartDate(todayStr);
      setEndDate(todayStr);
    } else if (preset === 'yesterday') {
      const y = new Date(now);
      y.setDate(y.getDate() - 1);
      const yStr = y.toISOString().split('T')[0];
      setStartDate(yStr);
      setEndDate(yStr);
    } else if (preset === 'week') {
      const past7 = new Date(now);
      past7.setDate(past7.getDate() - 6);
      setStartDate(past7.toISOString().split('T')[0]);
      setEndDate(todayStr);
    } else if (preset === 'month') {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      setStartDate(firstDay.toISOString().split('T')[0]);
      setEndDate(todayStr);
    } else if (preset === 'last30') {
      const past30 = new Date(now);
      past30.setDate(past30.getDate() - 29);
      setStartDate(past30.toISOString().split('T')[0]);
      setEndDate(todayStr);
    } else if (preset === 'all') {
      setStartDate('2025-01-01');
      setEndDate(todayStr);
    }
  };

  // Close export dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setIsExportMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter payments and expenses based on Cash/Bank Account filter
  const accountFilteredPayments = useMemo(() => {
    if (selectedAccountId === 'ALL') return payments;
    return payments.filter(
      (p) => p.accountId === selectedAccountId || p.accountName === selectedAccountId
    );
  }, [payments, selectedAccountId]);

  const accountFilteredExpenses = useMemo(() => {
    if (selectedAccountId === 'ALL') return expenses;
    return expenses.filter(
      (e) => e.accountId === selectedAccountId || e.accountName === selectedAccountId
    );
  }, [expenses, selectedAccountId]);

  // Compile all unique transaction dates within the selected date range
  const allActiveDates = useMemo(() => {
    const datesSet = new Set();

    // If single date selected or today in range, ensure it is considered
    if (startDate === endDate) {
      datesSet.add(startDate);
    } else {
      datesSet.add(todayStr);
    }

    accountFilteredPayments.forEach((p) => {
      if (p.paymentDate) datesSet.add(p.paymentDate.split('T')[0]);
    });

    accountFilteredExpenses.forEach((e) => {
      if (e.expenseDate) datesSet.add(e.expenseDate.split('T')[0]);
    });

    return Array.from(datesSet).sort().reverse();
  }, [accountFilteredPayments, accountFilteredExpenses, startDate, endDate, todayStr]);

  // Generate one financial summary row per date
  const dailyFinancialRows = useMemo(() => {
    // Filter dates by start and end bounds
    const datesInRange = allActiveDates.filter((d) => {
      if (startDate && d < startDate) return false;
      if (endDate && d > endDate) return false;
      return true;
    });

    return datesInRange.map((dateStr) => {
      // 1. Total Income / Collection for this day
      const dayPayments = accountFilteredPayments.filter(
        (p) => (p.paymentDate || '').split('T')[0] === dateStr
      );
      const dayIncome = dayPayments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);

      // 2. Total Expenses for this day
      const dayExpenses = accountFilteredExpenses.filter(
        (e) => (e.expenseDate || '').split('T')[0] === dateStr
      );
      const dayExpenseTotal = dayExpenses.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);

      // 3. Calculation: Net Income = Total Income - Total Expenses
      const netIncome = dayIncome - dayExpenseTotal;

      return {
        date: dateStr,
        income: dayIncome,
        expenses: dayExpenseTotal,
        netIncome,
        paymentCount: dayPayments.length,
        expenseCount: dayExpenses.length,
        payments: dayPayments,
        expensesList: dayExpenses,
      };
    });
  }, [allActiveDates, startDate, endDate, accountFilteredPayments, accountFilteredExpenses]);

  // Filter rows based on search query
  const filteredRows = useMemo(() => {
    if (!search.trim()) return dailyFinancialRows;
    const q = search.toLowerCase().trim();

    return dailyFinancialRows.filter((r) => {
      const dateFormatted = formatDate(r.date, 'dd MMM yyyy EEEE').toLowerCase();
      const rawDate = r.date.toLowerCase();
      return dateFormatted.includes(q) || rawDate.includes(q);
    });
  }, [dailyFinancialRows, search]);

  // Compute Grand Totals across currently filtered rows
  const grandTotals = useMemo(() => {
    return filteredRows.reduce(
      (acc, r) => {
        acc.income += r.income;
        acc.expenses += r.expenses;
        acc.netIncome += r.netIncome;
        acc.paymentCount += r.paymentCount;
        acc.expenseCount += r.expenseCount;
        return acc;
      },
      {
        income: 0,
        expenses: 0,
        netIncome: 0,
        paymentCount: 0,
        expenseCount: 0,
      }
    );
  }, [filteredRows]);

  // Selected account object for display
  const selectedAccountObj = useMemo(() => {
    if (selectedAccountId === 'ALL') return null;
    return accounts.find((a) => a.id === selectedAccountId || a.name === selectedAccountId);
  }, [accounts, selectedAccountId]);

  // Net Margin Percentage calculation
  const netMarginPct = useMemo(() => {
    if (grandTotals.income <= 0) return 0;
    return ((grandTotals.netIncome / grandTotals.income) * 100).toFixed(1);
  }, [grandTotals]);

  // Reset all filters
  const handleResetFilters = () => {
    handlePresetChange('month');
    setSelectedAccountId('ALL');
    setSearch('');
  };

  const hasActiveFilters =
    datePreset !== 'month' ||
    selectedAccountId !== 'ALL' ||
    search !== '';

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Date',
      'Day of Week',
      'Total Income / Collection (PKR)',
      'Total Expenses (PKR)',
      'Net Income (PKR)',
      'Financial Status',
      'Receipts Count',
      'Vouchers Count',
    ];

    const accountLabel = selectedAccountObj
      ? `${selectedAccountObj.name} (${selectedAccountObj.type})`
      : 'All Accounts';

    const csvRows = [
      ['MedPulse Executive Healthcare Clinic - Financial Summary Report'],
      [`Period: ${startDate} to ${endDate}`],
      [`Account Filter: ${accountLabel}`],
      [`Generated At: ${new Date().toLocaleString()}`],
      [],
      headers,
    ];

    filteredRows.forEach((r) => {
      csvRows.push([
        r.date,
        formatDate(r.date, 'EEEE'),
        r.income,
        r.expenses,
        r.netIncome,
        r.netIncome > 0 ? 'Surplus / Profit' : r.netIncome < 0 ? 'Deficit / Loss' : 'Break-even',
        r.paymentCount,
        r.expenseCount,
      ]);
    });

    // Grand Total Row
    csvRows.push([]);
    csvRows.push([
      `Grand Total (${filteredRows.length} Dates)`,
      '—',
      grandTotals.income,
      grandTotals.expenses,
      grandTotals.netIncome,
      grandTotals.netIncome >= 0 ? 'Net Surplus' : 'Net Deficit',
      grandTotals.paymentCount,
      grandTotals.expenseCount,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      csvRows.map((e) => e.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Financial_Summary_Report_${startDate}_to_${endDate}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExportMenuOpen(false);
  };

  // Export to PDF
  const handleExportPDF = () => {
    const accountLabel = selectedAccountObj
      ? `${selectedAccountObj.name} (${selectedAccountObj.type})`
      : 'All Cash & Bank Accounts';

    generateFinancialSummaryReportPDF(filteredRows, grandTotals, {
      startDate,
      endDate,
      accountName: accountLabel,
    });
    setIsExportMenuOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* ========================================================= */}
      {/* 1. PAGE HEADER */}
      {/* ========================================================= */}
      <PageHeader
        title="Management Financial Summary"
        subtitle="Executive financial performance overview reporting daily collections, operating expenses, and net profit/loss for selected periods."
        breadcrumbs={[
          { label: 'Finance', path: '/bills' },
          { label: 'Reports', path: '/reports/daily-summary' },
          { label: 'Financial Summary' },
        ]}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            {/* Switch to Daily Clinical & Financial Summary Report */}
            <button
              onClick={() => navigate('/reports/daily-summary')}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              title="View Complete Daily Clinical & Billing Activity Report"
            >
              <CalendarDays className="w-4 h-4 text-brand-600" />
              <span className="hidden sm:inline">Daily Activity Report</span>
            </button>

            {/* Print Modal Button */}
            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              title="Print Financial Summary Preview"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Print</span>
            </button>

            {/* Export Dropdown Menu */}
            <div className="relative" ref={exportMenuRef}>
              <button
                onClick={() => setIsExportMenuOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-teal-600 via-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm shadow-teal-600/25 transition-all active:scale-95 cursor-pointer"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>Export Report</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-80" />
              </button>

              {isExportMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    Export Format Options
                  </div>

                  <button
                    onClick={handleExportPDF}
                    className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-teal-700 font-semibold flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <FileCheck className="w-4 h-4 text-rose-500" />
                    <div>
                      <span className="block font-bold">PDF Document (.pdf)</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        Formal clinic report with letterhead
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={handleExportCSV}
                    className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-emerald-700 font-semibold flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="block font-bold">Excel / CSV (.csv)</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        Raw tabular data for Excel & Sheets
                      </span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        }
      />

      {/* ========================================================= */}
      {/* 2. DYNAMIC FILTERS BAR (Date Range + Cash/Bank Account + Search) */}
      {/* ========================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-card space-y-3.5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Quick Date Presets */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-thin">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Range:</span>
            </span>

            {[
              { id: 'today', label: 'Today' },
              { id: 'yesterday', label: 'Yesterday' },
              { id: 'week', label: 'Last 7 Days' },
              { id: 'month', label: 'This Month' },
              { id: 'last30', label: 'Last 30 Days' },
              { id: 'all', label: 'All Dates' },
            ].map((preset) => {
              const isActive = datePreset === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handlePresetChange(preset.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          {/* Date Pickers */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-2xs text-xs">
              <span className="text-slate-400 font-semibold text-[11px]">From:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setDatePreset('custom');
                }}
                className="bg-transparent text-slate-800 font-bold focus:outline-none cursor-pointer text-xs"
              />
            </div>

            <span className="text-slate-400 font-bold text-xs">to</span>

            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-2xs text-xs">
              <span className="text-slate-400 font-semibold text-[11px]">To:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setDatePreset('custom');
                }}
                className="bg-transparent text-slate-800 font-bold focus:outline-none cursor-pointer text-xs"
              />
            </div>
          </div>
        </div>

        {/* Secondary Filters: Cash/Bank Account & General Search */}
        <div className="pt-3 border-t border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1">
            {/* Cash / Bank Account Filter */}
            <div className="min-w-[220px] max-w-sm">
              <SearchableSelect
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 shadow-2xs"
                searchPlaceholder="Filter cash or bank account..."
              >
                <option value="ALL">All Accounts (Cash & Bank)</option>
                <optgroup label="Cash Counters & Drawers">
                  {accounts
                    .filter((a) => a.type === 'Cash')
                    .map((a) => (
                      <option key={a.id} value={a.id}>
                        💵 {a.name} ({a.accountNumber})
                      </option>
                    ))}
                </optgroup>
                <optgroup label="Commercial Bank Accounts">
                  {accounts
                    .filter((a) => a.type === 'Bank')
                    .map((a) => (
                      <option key={a.id} value={a.id}>
                        🏦 {a.name} ({a.bankName || a.accountNumber})
                      </option>
                    ))}
                </optgroup>
              </SearchableSelect>
            </div>

            {/* Date Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by date (e.g. 2026-10-18, Oct, Saturday)..."
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-9 pr-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 shadow-2xs placeholder:text-slate-400"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Active Filter summary & Reset button */}
          <div className="flex items-center justify-between sm:justify-end gap-2 text-xs">
            <span className="text-slate-500 font-medium">
              Showing <strong className="text-slate-900">{filteredRows.length}</strong> {filteredRows.length === 1 ? 'day' : 'days'}
            </span>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Selected Account Banner Indicator */}
        {selectedAccountObj && (
          <div className="p-2.5 rounded-xl bg-teal-50/70 border border-teal-200/80 flex items-center justify-between text-xs text-teal-900">
            <div className="flex items-center gap-2">
              {selectedAccountObj.type === 'Cash' ? (
                <Wallet className="w-4 h-4 text-amber-600 flex-shrink-0" />
              ) : (
                <Building2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
              )}
              <span>
                Filtered exclusively by <strong>{selectedAccountObj.name}</strong> ({selectedAccountObj.type} Account: {selectedAccountObj.accountNumber})
              </span>
            </div>
            <button
              onClick={() => setSelectedAccountId('ALL')}
              className="text-teal-700 hover:text-teal-900 text-[11px] font-bold underline cursor-pointer"
            >
              Clear Account Filter
            </button>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 3. EXECUTIVE KPI CARDS */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* KPI 1: Total Income / Collection */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-50/80 via-white to-white border border-teal-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700">
              Total Income / Collection
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-100/80 text-teal-700 flex items-center justify-center shadow-2xs">
              <TrendingUp className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums">
            {formatCurrency(grandTotals.income)}
          </div>
          <p className="text-[11px] text-teal-700 font-medium">
            From {grandTotals.paymentCount} patient receipt{grandTotals.paymentCount !== 1 ? 's' : ''}
          </p>
        </div>

        {/* KPI 2: Total Expenses */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50/80 via-white to-white border border-rose-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-700">
              Total Clinic Expenses
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-100/80 text-rose-700 flex items-center justify-center shadow-2xs">
              <TrendingDown className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums">
            {formatCurrency(grandTotals.expenses)}
          </div>
          <p className="text-[11px] text-rose-700 font-medium">
            Across {grandTotals.expenseCount} disbursement voucher{grandTotals.expenseCount !== 1 ? 's' : ''}
          </p>
        </div>

        {/* KPI 3: Net Income (Surplus / Deficit) */}
        <div
          className={`p-4 rounded-2xl bg-gradient-to-br border shadow-2xs space-y-1 ${
            grandTotals.netIncome >= 0
              ? 'from-emerald-50/80 via-white to-white border-emerald-200/90'
              : 'from-amber-50/80 via-white to-white border-rose-200/90'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-[10px] font-extrabold uppercase tracking-wider ${
                grandTotals.netIncome >= 0 ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              Net Income (Income − Expenses)
            </span>
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-2xs ${
                grandTotals.netIncome >= 0
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              <Coins className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div
            className={`text-xl sm:text-2xl font-black tabular-nums ${
              grandTotals.netIncome >= 0 ? 'text-emerald-700' : 'text-rose-600'
            }`}
          >
            {grandTotals.netIncome >= 0 ? '+' : ''}
            {formatCurrency(grandTotals.netIncome)}
          </div>
          <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
            <span
              className={`px-1.5 py-0.2 rounded font-bold text-[10px] ${
                grandTotals.netIncome >= 0
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {grandTotals.netIncome >= 0 ? 'Surplus' : 'Deficit'}
            </span>
            <span>Net Margin: {netMarginPct}%</span>
          </p>
        </div>

        {/* KPI 4: Daily Average Net Performance */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-white to-white border border-indigo-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700">
              Avg Daily Performance
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-100/80 text-indigo-700 flex items-center justify-center shadow-2xs">
              <Landmark className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums">
            {formatCurrency(
              filteredRows.length > 0 ? Math.round(grandTotals.netIncome / filteredRows.length) : 0
            )}
          </div>
          <p className="text-[11px] text-indigo-700 font-medium">
            Average net daily cashflow for {filteredRows.length} day{filteredRows.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. FINANCIAL SUMMARY TABLE (Desktop Table & Mobile Cards) */}
      {/* ========================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-hidden">
        {/* Table Title Bar */}
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-teal-600" />
            <span className="font-extrabold text-slate-900 uppercase tracking-wider">
              Financial Performance Daybook
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold font-mono">
              {filteredRows.length} {filteredRows.length === 1 ? 'Date' : 'Dates'}
            </span>
          </div>
          <span className="text-[11px] font-medium text-slate-500 hidden sm:inline">
            Formula: <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800 font-bold font-mono">Net Income = Total Income − Total Expenses</code>
          </span>
        </div>

        {/* Empty State */}
        {filteredRows.length === 0 ? (
          <div className="py-20 text-center text-slate-500 px-4">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-800">No financial transactions recorded</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              No payment collections or expense disbursements match your current date range or account filter.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-3 px-3.5 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-2xs hover:bg-slate-800 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <>
            {/* ================= MOBILE VIEW (sm:hidden) ================= */}
            <div className="sm:hidden p-3 space-y-3 bg-slate-50/60">
              {filteredRows.map((row) => {
                const isTodayRow = row.date === todayStr;
                const isProfitable = row.netIncome >= 0;

                return (
                  <div
                    key={row.date}
                    className={`bg-white rounded-2xl border p-3.5 shadow-sm space-y-2.5 transition-all ${
                      isTodayRow ? 'border-teal-400 ring-2 ring-teal-100' : 'border-slate-200'
                    }`}
                  >
                    {/* Card Top: Date & Badge */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 text-sm">
                            {formatDate(row.date, 'dd MMM yyyy')}
                          </span>
                          {isTodayRow && (
                            <span className="px-1.5 py-0.2 rounded bg-teal-100 text-teal-800 font-bold text-[10px]">
                              Today
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {formatDate(row.date, 'EEEE')}
                        </span>
                      </div>

                      <div className="text-right">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                            isProfitable
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
                              : 'bg-rose-50 text-rose-700 border border-rose-200/70'
                          }`}
                        >
                          {isProfitable ? '+' : ''}
                          {formatCurrency(row.netIncome)}
                        </span>
                      </div>
                    </div>

                    {/* Card Details: Income vs Expenses */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-teal-50/50 border border-teal-100 space-y-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block">
                          Total Income
                        </span>
                        <div className="text-sm font-extrabold text-teal-900">
                          {formatCurrency(row.income)}
                        </div>
                        <span className="text-[10px] text-slate-400 block">
                          {row.paymentCount} receipt{row.paymentCount !== 1 ? 's' : ''}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-rose-50/50 border border-rose-100 space-y-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">
                          Total Expenses
                        </span>
                        <div className="text-sm font-extrabold text-rose-900">
                          {formatCurrency(row.expenses)}
                        </div>
                        <span className="text-[10px] text-slate-400 block">
                          {row.expenseCount} voucher{row.expenseCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>

                    {/* Action: View Breakdown */}
                    {(row.paymentCount > 0 || row.expenseCount > 0) && (
                      <div className="pt-2 border-t border-slate-100 flex justify-end">
                        <button
                          onClick={() => setSelectedRowDetail(row)}
                          className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
                        >
                          <span>View Day Transactions</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Mobile Grand Total Summary Card */}
              <div className="bg-slate-100/90 border-2 border-slate-300 rounded-2xl p-4 shadow-sm space-y-3 mt-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs uppercase tracking-wider text-slate-900">
                      Grand Total Summary
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold font-mono">
                      {filteredRows.length} Days
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Financial Totals</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-teal-700 tracking-wider block">
                      Total Income
                    </span>
                    <div className="text-base font-black text-teal-800">
                      {formatCurrency(grandTotals.income)}
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-rose-700 tracking-wider block">
                      Total Expenses
                    </span>
                    <div className="text-base font-black text-rose-800">
                      {formatCurrency(grandTotals.expenses)}
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-700 tracking-wider block">
                      Net Income
                    </span>
                    <div
                      className={`text-base font-black ${
                        grandTotals.netIncome >= 0 ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {grandTotals.netIncome >= 0 ? '+' : ''}
                      {formatCurrency(grandTotals.netIncome)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= DESKTOP TABLE VIEW (hidden sm:block) ================= */}
            <div className="hidden sm:block overflow-x-auto min-h-[300px]">
              <table className="w-full text-left border-collapse text-xs">
                {/* Table Header */}
                <thead>
                  <tr className="bg-slate-50/95 border-b border-slate-200 text-slate-600 uppercase font-bold tracking-wider text-[11px] select-none sticky top-0 z-10 backdrop-blur-xs">
                    <th className="py-3.5 px-4 whitespace-nowrap min-w-[200px]">
                      Date & Day
                    </th>
                    <th className="py-3.5 px-4 text-right whitespace-nowrap min-w-[170px]">
                      Total Income / Collection
                    </th>
                    <th className="py-3.5 px-4 text-right whitespace-nowrap min-w-[170px]">
                      Total Expenses
                    </th>
                    <th className="py-3.5 px-4 text-right whitespace-nowrap min-w-[190px]">
                      Net Income
                    </th>
                    <th className="py-3.5 px-3 text-center whitespace-nowrap w-24">
                      Breakdown
                    </th>
                  </tr>
                </thead>

                {/* Table Body: One Row Per Day */}
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredRows.map((row) => {
                    const isTodayRow = row.date === todayStr;
                    const isProfitable = row.netIncome >= 0;

                    return (
                      <tr
                        key={row.date}
                        className={`hover:bg-slate-50/80 transition-colors group ${
                          isTodayRow ? 'bg-teal-50/30' : ''
                        }`}
                      >
                        {/* 1. Date */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-2xs ${
                                isTodayRow
                                  ? 'bg-teal-600 text-white'
                                  : 'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}
                            >
                              {formatDate(row.date, 'd')}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-900 block leading-tight">
                                  {formatDate(row.date, 'dd MMM yyyy')}
                                </span>
                                {isTodayRow && (
                                  <span className="px-1.5 py-0.2 rounded-md bg-teal-100 text-teal-800 text-[10px] font-bold">
                                    Today
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-400 font-medium">
                                {formatDate(row.date, 'EEEE')}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* 2. Total Income / Collection */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div>
                            <span className="font-extrabold text-slate-900 tabular-nums text-sm">
                              {formatCurrency(row.income)}
                            </span>
                            <span className="block text-[10px] text-teal-700 font-medium">
                              {row.paymentCount} {row.paymentCount === 1 ? 'receipt' : 'receipts'}
                            </span>
                          </div>
                        </td>

                        {/* 3. Total Expenses */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div>
                            <span className="font-extrabold text-rose-600 tabular-nums text-sm">
                              {formatCurrency(row.expenses)}
                            </span>
                            <span className="block text-[10px] text-rose-700 font-medium">
                              {row.expenseCount} {row.expenseCount === 1 ? 'voucher' : 'vouchers'}
                            </span>
                          </div>
                        </td>

                        {/* 4. Net Income = Total Income - Total Expenses */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-black shadow-2xs tabular-nums ${
                              isProfitable
                                ? 'text-emerald-700 bg-emerald-50 border border-emerald-200/80'
                                : 'text-rose-700 bg-rose-50 border border-rose-200/80'
                            }`}
                          >
                            {isProfitable ? (
                              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                            ) : (
                              <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
                            )}
                            <span>
                              {isProfitable ? '+' : ''}
                              {formatCurrency(row.netIncome)}
                            </span>
                          </span>
                        </td>

                        {/* 5. Breakdown Action */}
                        <td className="py-3.5 px-3 text-center whitespace-nowrap">
                          {(row.paymentCount > 0 || row.expenseCount > 0) ? (
                            <button
                              onClick={() => setSelectedRowDetail(row)}
                              className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                              title="Inspect transactions for this date"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          ) : (
                            <span className="text-slate-300 text-xs">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

                {/* ========================================================= */}
                {/* GRAND TOTAL ROW AT THE BOTTOM (Dynamic & Prominent) */}
                {/* ========================================================= */}
                <tfoot className="bg-slate-100/95 border-t-2 border-slate-300/90 font-bold text-slate-900 select-none sticky bottom-0 z-10 backdrop-blur-xs">
                  <tr>
                    {/* Date Column: Grand Total Label */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase font-black text-slate-900 tracking-wider">
                          Grand Total
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold font-mono">
                          {filteredRows.length} {filteredRows.length === 1 ? 'Date' : 'Dates'}
                        </span>
                      </div>
                    </td>

                    {/* Total Income Grand Total */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div>
                        <span className="text-base font-black text-slate-900 tabular-nums">
                          {formatCurrency(grandTotals.income)}
                        </span>
                        <span className="block text-[10px] text-teal-800 font-bold">
                          {grandTotals.paymentCount} Total Receipts
                        </span>
                      </div>
                    </td>

                    {/* Total Expenses Grand Total */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div>
                        <span className="text-base font-black text-rose-700 tabular-nums">
                          {formatCurrency(grandTotals.expenses)}
                        </span>
                        <span className="block text-[10px] text-rose-800 font-bold">
                          {grandTotals.expenseCount} Total Vouchers
                        </span>
                      </div>
                    </td>

                    {/* Net Income Grand Total */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex flex-col items-end">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-black shadow-2xs tabular-nums ${
                            grandTotals.netIncome >= 0
                              ? 'text-emerald-800 bg-emerald-100/90 border border-emerald-300'
                              : 'text-rose-800 bg-rose-100/90 border border-rose-300'
                          }`}
                        >
                          {grandTotals.netIncome >= 0 ? '+' : ''}
                          {formatCurrency(grandTotals.netIncome)}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 mt-0.5">
                          Net Profit Margin: {netMarginPct}%
                        </span>
                      </div>
                    </td>

                    {/* Empty cell for action column */}
                    <td className="py-4 px-3 text-center whitespace-nowrap">
                      —
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </>
        )}
      </div>

      {/* ========================================================= */}
      {/* 5. DAY TRANSACTION BREAKDOWN MODAL */}
      {/* ========================================================= */}
      <Modal
        isOpen={Boolean(selectedRowDetail)}
        onClose={() => setSelectedRowDetail(null)}
        title={
          selectedRowDetail
            ? `Day Ledger Breakdown — ${formatDate(selectedRowDetail.date, 'dd MMM yyyy')}`
            : 'Day Transactions'
        }
        subtitle="Itemized collection receipts and disbursement vouchers recorded for this date."
        maxWidth="max-w-2xl"
      >
        {selectedRowDetail && (
          <div className="space-y-4">
            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 text-center p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-[10px] font-bold uppercase text-teal-700 block">Total Income</span>
                <span className="text-sm font-extrabold text-slate-900">{formatCurrency(selectedRowDetail.income)}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-rose-700 block">Total Expenses</span>
                <span className="text-sm font-extrabold text-slate-900">{formatCurrency(selectedRowDetail.expenses)}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-600 block">Net Income</span>
                <span className={`text-sm font-extrabold ${selectedRowDetail.netIncome >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {selectedRowDetail.netIncome >= 0 ? '+' : ''}{formatCurrency(selectedRowDetail.netIncome)}
                </span>
              </div>
            </div>

            {/* Inflows Section */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-teal-600" />
                <span>Collections / Receipts ({selectedRowDetail.payments.length})</span>
              </h4>

              {selectedRowDetail.payments.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">No collections recorded on this date.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedRowDetail.payments.map((p) => (
                    <div
                      key={p.id}
                      className="p-2.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900">{p.receiptNumber}</span>
                          <span className="text-slate-400">•</span>
                          <span className="font-medium text-slate-700">{p.patientName}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {p.paymentMethod} • Deposited: {p.accountName}
                        </p>
                      </div>
                      <span className="font-bold text-emerald-700 text-sm">
                        +{formatCurrency(p.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Outflows Section */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
                <span>Disbursements / Expenses ({selectedRowDetail.expensesList.length})</span>
              </h4>

              {selectedRowDetail.expensesList.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">No expenses disbursed on this date.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedRowDetail.expensesList.map((e) => (
                    <div
                      key={e.id}
                      className="p-2.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900">{e.reference || e.id}</span>
                          <span className="text-slate-400">•</span>
                          <span className="font-semibold text-rose-700">{e.categoryName}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">
                          {e.description}
                        </p>
                      </div>
                      <span className="font-bold text-rose-600 text-sm">
                        -{formatCurrency(e.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* ========================================================= */}
      {/* 6. PRINT PREVIEW MODAL */}
      {/* ========================================================= */}
      <Modal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        title="Printable Management Financial Summary"
        subtitle="Formal executive report view ready for system printing or PDF saving."
        maxWidth="max-w-4xl"
      >
        <div className="space-y-6 text-slate-800" id="printable-financial-summary">
          {/* Print Letterhead Header */}
          <div className="pb-4 border-b-2 border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider">
                MedPulse Executive Healthcare Clinic
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Plot 14-B, Executive Sector F-8 Markaz, Islamabad, Pakistan
              </p>
              <p className="text-xs text-slate-500">
                UAN: +92 51 2289001 • PHC Registration: ISB-88392-C
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block px-2.5 py-1 bg-slate-900 text-white font-extrabold text-xs uppercase tracking-widest rounded-md">
                Financial Performance Summary
              </span>
              <p className="text-xs text-slate-700 font-bold mt-1.5">
                Period: {startDate ? formatDate(startDate, 'dd MMM yyyy') : 'All'} – {endDate ? formatDate(endDate, 'dd MMM yyyy') : 'All'}
              </p>
              <p className="text-[11px] text-slate-500">
                Account: {selectedAccountObj ? `${selectedAccountObj.name} (${selectedAccountObj.type})` : 'All Accounts'}
              </p>
            </div>
          </div>

          {/* KPI Summary Banner */}
          <div className="grid grid-cols-3 gap-3 text-center border border-slate-200 rounded-xl p-3 bg-slate-50">
            <div>
              <span className="text-[10px] font-bold uppercase text-teal-800 block">Total Income</span>
              <span className="text-base font-black text-slate-900">{formatCurrency(grandTotals.income)}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-rose-800 block">Total Expenses</span>
              <span className="text-base font-black text-slate-900">{formatCurrency(grandTotals.expenses)}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-700 block">Net Income</span>
              <span className={`text-base font-black ${grandTotals.netIncome >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                {grandTotals.netIncome >= 0 ? '+' : ''}{formatCurrency(grandTotals.netIncome)}
              </span>
            </div>
          </div>

          {/* Printable Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-900 text-white font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3 text-right">Total Income / Collection</th>
                  <th className="py-2.5 px-3 text-right">Total Expenses</th>
                  <th className="py-2.5 px-3 text-right">Net Income</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredRows.map((row) => (
                  <tr key={row.date} className="even:bg-slate-50">
                    <td className="py-2 px-3 font-semibold text-slate-900">
                      {formatDate(row.date, 'dd MMM yyyy (EEEE)')}
                    </td>
                    <td className="py-2 px-3 text-right font-bold text-slate-800">
                      {formatCurrency(row.income)}
                    </td>
                    <td className="py-2 px-3 text-right font-bold text-rose-600">
                      {formatCurrency(row.expenses)}
                    </td>
                    <td className="py-2 px-3 text-right font-black">
                      <span className={row.netIncome >= 0 ? 'text-emerald-700' : 'text-rose-600'}>
                        {row.netIncome >= 0 ? '+' : ''}{formatCurrency(row.netIncome)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-400">
                <tr>
                  <td className="py-3 px-3 uppercase font-black text-slate-900">
                    Grand Total ({filteredRows.length} Dates)
                  </td>
                  <td className="py-3 px-3 text-right font-black text-slate-900 text-sm">
                    {formatCurrency(grandTotals.income)}
                  </td>
                  <td className="py-3 px-3 text-right font-black text-rose-700 text-sm">
                    {formatCurrency(grandTotals.expenses)}
                  </td>
                  <td className="py-3 px-3 text-right font-black text-sm">
                    <span className={grandTotals.netIncome >= 0 ? 'text-emerald-800' : 'text-rose-800'}>
                      {grandTotals.netIncome >= 0 ? '+' : ''}{formatCurrency(grandTotals.netIncome)}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Printable Signatures */}
          <div className="pt-6 grid grid-cols-3 gap-6 text-center text-xs text-slate-500">
            <div>
              <div className="border-b border-slate-300 pb-8 mb-1.5" />
              <p className="font-bold text-slate-700">Prepared By</p>
              <p className="text-[10px]">Accounts & Audit Officer</p>
            </div>
            <div>
              <div className="border-b border-slate-300 pb-8 mb-1.5" />
              <p className="font-bold text-slate-700">Verified By</p>
              <p className="text-[10px]">Head of Finance</p>
            </div>
            <div>
              <div className="border-b border-slate-300 pb-8 mb-1.5" />
              <p className="font-bold text-slate-700">Approved By</p>
              <p className="text-[10px]">Medical / Managing Director</p>
            </div>
          </div>

          {/* Print Dialog Trigger Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5 print:hidden">
            <button
              onClick={() => setIsPrintModalOpen(false)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Send to Printer</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
