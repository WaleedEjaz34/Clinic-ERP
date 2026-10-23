import React, { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Calendar,
  Search,
  Printer,
  Download,
  AlertTriangle,
  CreditCard,
  Receipt,
  Phone,
  MessageCircle,
  Eye,
  Filter,
  CheckCircle2,
  X,
  ChevronDown,
  FileSpreadsheet,
  FileCheck,
  TrendingDown,
  TrendingUp,
  DollarSign,
  ArrowRight,
  User,
  Users,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Modal } from '../../components/common/Modal';
import { SearchableSelect } from '../../components/common/SearchableSelect';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { generateOutstandingBalancesReportPDF } from '../../services/documentService';

export const OutstandingBalancesReportPage = () => {
  const navigate = useNavigate();
  const {
    bills = [],
    patients = [],
    payments = [],
  } = useClinic();

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Filter 1: Date Range (default: 'all' so no outstanding dues are missed)
  const [datePreset, setDatePreset] = useState('all'); // 'all' | 'today' | 'month' | 'last30' | 'last90' | 'year' | 'custom'
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState(todayStr);

  // Filter 2: Patient (default: 'ALL')
  const [selectedPatientId, setSelectedPatientId] = useState('ALL');

  // Filter 3: Balance Status (default: 'OUTSTANDING_ONLY' -> balance > 0)
  const [balanceStatus, setBalanceStatus] = useState('OUTSTANDING_ONLY');
  // Options: 'OUTSTANDING_ONLY' (> 0), 'PARTIALLY_PAID', 'FULLY_UNPAID', 'SETTLED' (= 0), 'ALL'

  // General Search query
  const [search, setSearch] = useState('');

  // Modals & Export menu state
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const exportMenuRef = useRef(null);

  // Quick Preset Change Handler
  const handlePresetChange = (preset) => {
    setDatePreset(preset);
    const now = new Date();

    if (preset === 'all') {
      setStartDate('2025-01-01');
      setEndDate(todayStr);
    } else if (preset === 'today') {
      setStartDate(todayStr);
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
    } else if (preset === 'last90') {
      const past90 = new Date(now);
      past90.setDate(past90.getDate() - 89);
      setStartDate(past90.toISOString().split('T')[0]);
      setEndDate(todayStr);
    } else if (preset === 'year') {
      const firstDayYear = new Date(now.getFullYear(), 0, 1);
      setStartDate(firstDayYear.toISOString().split('T')[0]);
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

  // Map each bill to a standardized record with patient details & calculated outstanding balance
  // Calculation: Outstanding Balance = Total Billing - Total Paid
  const allBillRecords = useMemo(() => {
    // Create quick lookup map for patients
    const patientMap = new Map();
    patients.forEach((p) => patientMap.set(p.id, p));

    return bills.map((b) => {
      const patient = patientMap.get(b.patientId) || {};
      const totalBilling = Number(b.totalAmount) || 0;
      const totalPaid = Number(b.paidAmount) || 0;
      // Calculation: Outstanding Balance = Total Billing - Total Paid
      const outstandingBalance = Math.max(0, totalBilling - totalPaid);

      return {
        id: b.id,
        billNumber: b.billNumber,
        billDate: (b.billDate || '').split('T')[0] || todayStr,
        patientId: b.patientId,
        patientName: b.patientName || patient.name || 'Unknown Patient',
        phone: patient.phone || '',
        emergencyContact: patient.emergencyContact || '',
        doctorName: b.doctorName || 'Attending Physician',
        totalBilling,
        totalPaid,
        outstandingBalance,
        status: b.status,
        rawBill: b,
        rawPatient: patient,
      };
    });
  }, [bills, patients, todayStr]);

  // Filtered rows applying Date Range, Patient, Balance Status, and Search
  const filteredRows = useMemo(() => {
    return allBillRecords.filter((row) => {
      // 1. Date Range Filter on billDate
      if (startDate && row.billDate < startDate) return false;
      if (endDate && row.billDate > endDate) return false;

      // 2. Patient Filter
      if (selectedPatientId !== 'ALL' && row.patientId !== selectedPatientId) {
        return false;
      }

      // 3. Balance Status Filter
      if (balanceStatus === 'OUTSTANDING_ONLY') {
        // Only include patients with an outstanding balance greater than zero by default
        if (row.outstandingBalance <= 0) return false;
      } else if (balanceStatus === 'PARTIALLY_PAID') {
        if (row.totalPaid <= 0 || row.outstandingBalance <= 0) return false;
      } else if (balanceStatus === 'FULLY_UNPAID') {
        if (row.totalPaid > 0 || row.outstandingBalance <= 0) return false;
      } else if (balanceStatus === 'SETTLED') {
        if (row.outstandingBalance > 0) return false;
      }

      // 4. Search Query filter (matches Name, ID, Phone, Bill #, Doctor)
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchSearch =
          row.patientName.toLowerCase().includes(q) ||
          row.patientId.toLowerCase().includes(q) ||
          row.phone.toLowerCase().includes(q) ||
          row.billNumber.toLowerCase().includes(q) ||
          row.doctorName.toLowerCase().includes(q) ||
          formatDate(row.billDate, 'dd MMM yyyy').toLowerCase().includes(q);

        if (!matchSearch) return false;
      }

      return true;
    });
  }, [allBillRecords, startDate, endDate, selectedPatientId, balanceStatus, search]);

  // Grand Totals Calculation: Total Billing, Total Paid, and Outstanding Balance
  const grandTotals = useMemo(() => {
    return filteredRows.reduce(
      (acc, r) => {
        acc.totalBilling += r.totalBilling;
        acc.totalPaid += r.totalPaid;
        acc.outstandingBalance += r.outstandingBalance;
        return acc;
      },
      {
        totalBilling: 0,
        totalPaid: 0,
        outstandingBalance: 0,
      }
    );
  }, [filteredRows]);

  // Unique patient count with outstanding balance
  const uniqueDebtorsCount = useMemo(() => {
    const set = new Set();
    filteredRows.forEach((r) => {
      if (r.outstandingBalance > 0) set.add(r.patientId);
    });
    return set.size;
  }, [filteredRows]);

  // Collection recovery percentage
  const recoveryPct = useMemo(() => {
    if (grandTotals.totalBilling <= 0) return '0.0';
    return ((grandTotals.totalPaid / grandTotals.totalBilling) * 100).toFixed(1);
  }, [grandTotals]);

  // Reset filters
  const handleResetFilters = () => {
    handlePresetChange('all');
    setSelectedPatientId('ALL');
    setBalanceStatus('OUTSTANDING_ONLY');
    setSearch('');
  };

  const hasActiveFilters =
    datePreset !== 'all' ||
    selectedPatientId !== 'ALL' ||
    balanceStatus !== 'OUTSTANDING_ONLY' ||
    search !== '';

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Patient ID',
      'Patient Name',
      'Phone Number',
      'Bill Number',
      'Billing Date',
      'Total Billing (PKR)',
      'Total Paid (PKR)',
      'Outstanding Balance (PKR)',
      'Payment Status',
    ];

    const csvRows = [
      ['MedPulse Executive Healthcare Clinic - Outstanding Patient Balance Report'],
      [`Date Range: ${startDate} to ${endDate}`],
      [`Status Filter: ${balanceStatus}`],
      [`Generated At: ${new Date().toLocaleString()}`],
      [],
      headers,
    ];

    filteredRows.forEach((r) => {
      csvRows.push([
        r.patientId,
        r.patientName,
        r.phone || '—',
        r.billNumber,
        r.billDate,
        r.totalBilling,
        r.totalPaid,
        r.outstandingBalance,
        r.outstandingBalance > 0 ? (r.totalPaid > 0 ? 'Partially Paid' : 'Unpaid') : 'Settled',
      ]);
    });

    // Grand Total Row
    csvRows.push([]);
    csvRows.push([
      `Grand Total (${filteredRows.length} Records)`,
      '—',
      '—',
      '—',
      '—',
      grandTotals.totalBilling,
      grandTotals.totalPaid,
      grandTotals.outstandingBalance,
      grandTotals.outstandingBalance > 0 ? 'Pending Dues' : 'Cleared',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      csvRows.map((e) => e.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Outstanding_Patient_Balances_${startDate}_to_${endDate}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExportMenuOpen(false);
  };

  // Export to PDF
  const handleExportPDF = () => {
    const patientObj = patients.find((p) => p.id === selectedPatientId);
    const patientFilterText = patientObj
      ? `${patientObj.name} (${patientObj.id})`
      : 'All Patients';

    generateOutstandingBalancesReportPDF(filteredRows, grandTotals, {
      dateRangeText: datePreset === 'all' ? 'All Recorded Dates' : `${startDate} to ${endDate}`,
      patientFilter: patientFilterText,
      statusFilter:
        balanceStatus === 'OUTSTANDING_ONLY'
          ? 'Outstanding Balances Only (> 0)'
          : balanceStatus === 'PARTIALLY_PAID'
          ? 'Partially Paid'
          : balanceStatus === 'FULLY_UNPAID'
          ? 'Fully Unpaid'
          : 'All Records',
    });
    setIsExportMenuOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* ========================================================= */}
      {/* 1. PAGE HEADER */}
      {/* ========================================================= */}
      <PageHeader
        title="Outstanding Patient Balance Report"
        subtitle="Identify and track patients with pending balances, overdue receivables, and itemized billing dues to accelerate clinic collections."
        breadcrumbs={[
          { label: 'Finance', path: '/bills' },
          { label: 'Reports', path: '/reports/daily-summary' },
          { label: 'Outstanding Patient Balances' },
        ]}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            {/* Quick navigation to Patient Bills */}
            <button
              onClick={() => navigate('/bills')}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              title="Go to Invoices & Bills"
            >
              <Receipt className="w-4 h-4 text-brand-600" />
              <span className="hidden sm:inline">Billing Invoices</span>
            </button>

            {/* Quick navigation to Payment Collection */}
            <button
              onClick={() => navigate('/payments')}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              title="Collect Patient Payment"
            >
              <CreditCard className="w-4 h-4 text-teal-600" />
              <span className="hidden sm:inline">Collect Payment</span>
            </button>

            {/* Print Modal Trigger */}
            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              title="Print Outstanding Balance Report"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Print</span>
            </button>

            {/* Export Dropdown */}
            <div className="relative" ref={exportMenuRef}>
              <button
                onClick={() => setIsExportMenuOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-rose-600 via-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white rounded-xl text-xs font-bold shadow-sm shadow-rose-600/25 transition-all active:scale-95 cursor-pointer"
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
                    className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-rose-700 font-semibold flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <FileCheck className="w-4 h-4 text-rose-600" />
                    <div>
                      <span className="block font-bold">PDF Document (.pdf)</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        Formal aging report with letterhead
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
                        Raw spreadsheet data for follow-up
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
      {/* 2. RECEIVABLES KPI CARDS */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* KPI 1: Total Outstanding Balance Due */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50/90 via-white to-white border border-rose-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-700">
              Total Outstanding Balance Due
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-100/90 text-rose-700 flex items-center justify-center shadow-2xs">
              <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-rose-700 tabular-nums">
            {formatCurrency(grandTotals.outstandingBalance)}
          </div>
          <p className="text-[11px] text-rose-600 font-medium">
            Across {uniqueDebtorsCount} patient{uniqueDebtorsCount !== 1 ? 's' : ''} ({filteredRows.length} invoice{filteredRows.length !== 1 ? 's' : ''})
          </p>
        </div>

        {/* KPI 2: Total Billing Amount */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50/90 via-white to-white border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600">
              Total Invoiced Charges
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shadow-2xs">
              <Receipt className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums">
            {formatCurrency(grandTotals.totalBilling)}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Gross invoiced fees for filtered records
          </p>
        </div>

        {/* KPI 3: Total Paid / Collected */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/90 via-white to-white border border-emerald-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
              Total Paid / Collected
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-2xs">
              <CreditCard className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-700 tabular-nums">
            {formatCurrency(grandTotals.totalPaid)}
          </div>
          <p className="text-[11px] text-emerald-700 font-medium">
            Recovery Rate: <strong className="font-bold">{recoveryPct}%</strong> settled
          </p>
        </div>

        {/* KPI 4: Pending Debtors Count */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/80 via-white to-white border border-amber-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800">
              Pending Patient Accounts
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-2xs">
              <Users className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums">
            {uniqueDebtorsCount} <span className="text-sm font-semibold text-slate-500">Patients</span>
          </div>
          <p className="text-[11px] text-amber-800 font-medium">
            Requiring payment follow-up & billing reminders
          </p>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. FILTERS BAR: Date Range, Patient, Balance Status, Search */}
      {/* ========================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-card space-y-3.5">
        {/* Top Row: Date Range Presets + Custom Date Pickers */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Quick Date Presets */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-thin">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Billing Date:</span>
            </span>

            {[
              { id: 'all', label: 'All Dates' },
              { id: 'today', label: 'Today' },
              { id: 'month', label: 'This Month' },
              { id: 'last30', label: 'Last 30 Days' },
              { id: 'last90', label: 'Last 90 Days' },
              { id: 'year', label: 'This Year' },
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

        {/* Bottom Row: Patient Selector, Balance Status Filter, General Search */}
        <div className="pt-3 border-t border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 flex-wrap lg:flex-nowrap">
            {/* Filter 1: Patient Filter */}
            <div className="min-w-[200px] flex-1 max-w-xs">
              <SearchableSelect
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 shadow-2xs"
                searchPlaceholder="Filter by patient name or ID..."
              >
                <option value="ALL">All Patients</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.id}) — Due: {formatCurrency(p.outstandingBalance || 0)}
                  </option>
                ))}
              </SearchableSelect>
            </div>

            {/* Filter 2: Balance Status Filter */}
            <div className="min-w-[180px] max-w-xs">
              <SearchableSelect
                value={balanceStatus}
                onChange={(e) => setBalanceStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 shadow-2xs"
                searchPlaceholder="Filter balance status..."
              >
                <option value="OUTSTANDING_ONLY">Outstanding Balance Only (&gt; 0)</option>
                <option value="FULLY_UNPAID">Fully Unpaid (0% Paid)</option>
                <option value="PARTIALLY_PAID">Partially Paid (&gt; 0% &amp; Due &gt; 0)</option>
                <option value="SETTLED">Settled / Paid in Full (= 0)</option>
                <option value="ALL">All Records (Outstanding &amp; Settled)</option>
              </SearchableSelect>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search patient, ID, phone, bill #, doctor..."
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-9 pr-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 shadow-2xs placeholder:text-slate-400"
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

          {/* Records Counter & Reset Filters */}
          <div className="flex items-center justify-between sm:justify-end gap-2 text-xs">
            <span className="text-slate-500 font-medium">
              Showing <strong className="text-slate-900">{filteredRows.length}</strong> {filteredRows.length === 1 ? 'record' : 'records'}
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
      </div>

      {/* ========================================================= */}
      {/* 4. OUTSTANDING BALANCES DATA TABLE */}
      {/* ========================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-hidden">
        {/* Table Title Bar */}
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span className="font-extrabold text-slate-900 uppercase tracking-wider">
              Outstanding Patient Receivables Ledger
            </span>
            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold font-mono">
              {filteredRows.length} {filteredRows.length === 1 ? 'Bill' : 'Bills'}
            </span>
          </div>

          <span className="text-[11px] font-medium text-slate-500 hidden sm:inline">
            Formula: <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800 font-bold font-mono">Outstanding Balance = Total Billing − Total Paid</code>
          </span>
        </div>

        {/* Empty State */}
        {filteredRows.length === 0 ? (
          <div className="py-20 text-center text-slate-500 px-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-800">No outstanding balances found</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              All patient accounts are cleared or no records match your selected filters and search query.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-3 px-3.5 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-2xs hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <>
            {/* ================= MOBILE VIEW (sm:hidden) ================= */}
            <div className="sm:hidden p-3 space-y-3 bg-slate-50/60">
              {filteredRows.map((row) => (
                <div
                  key={row.id}
                  className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-sm space-y-2.5"
                >
                  {/* Card Header: Patient ID & Name */}
                  <div className="flex items-start justify-between pb-2 border-b border-slate-100 gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold text-slate-500">
                          {row.patientId}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="font-bold text-slate-900 text-sm">
                          {row.patientName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span className="font-mono font-medium">{row.phone || 'No phone'}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Due Balance
                      </span>
                      <span className="text-sm font-black text-rose-700 tabular-nums">
                        {formatCurrency(row.outstandingBalance)}
                      </span>
                    </div>
                  </div>

                  {/* Card Body: Billing Date, Total Billing, Total Paid */}
                  <div className="grid grid-cols-3 gap-2 text-xs text-slate-700">
                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Billing Date
                      </span>
                      <span className="font-semibold block">{formatDate(row.billDate)}</span>
                      <span className="font-mono text-[10px] text-slate-400 block">{row.billNumber}</span>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Total Billing
                      </span>
                      <span className="font-bold text-slate-900 block">{formatCurrency(row.totalBilling)}</span>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Total Paid
                      </span>
                      <span className="font-bold text-emerald-700 block">{formatCurrency(row.totalPaid)}</span>
                    </div>
                  </div>

                  {/* Card Actions: Collect Payment & Phone link */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    {row.phone && (
                      <a
                        href={`tel:${row.phone.replace(/[^0-9+]/g, '')}`}
                        className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 font-semibold"
                      >
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>Call</span>
                      </a>
                    )}

                    {row.outstandingBalance > 0 && (
                      <button
                        onClick={() => navigate('/payments', { state: { targetBill: row.rawBill } })}
                        className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Collect Payment</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Mobile Grand Total Summary Card */}
              <div className="bg-slate-100/90 border-2 border-slate-300 rounded-2xl p-4 shadow-sm space-y-3 mt-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs uppercase tracking-wider text-slate-900">
                      Grand Total Summary
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold font-mono">
                      {filteredRows.length} Bills
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Receivables</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                      Total Invoiced
                    </span>
                    <div className="text-base font-black text-slate-900">
                      {formatCurrency(grandTotals.totalBilling)}
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider block">
                      Total Collected
                    </span>
                    <div className="text-base font-black text-emerald-700">
                      {formatCurrency(grandTotals.totalPaid)}
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-rose-200 space-y-1 bg-rose-50/30">
                    <span className="text-[10px] uppercase font-bold text-rose-700 tracking-wider block">
                      Outstanding Due
                    </span>
                    <div className="text-base font-black text-rose-700">
                      {formatCurrency(grandTotals.outstandingBalance)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= DESKTOP TABLE VIEW (hidden sm:block) ================= */}
            <div className="hidden sm:block overflow-x-auto min-h-[300px]">
              <table className="w-full text-left border-collapse text-xs">
                {/* Table Header: Columns matching exact requirements */}
                <thead>
                  <tr className="bg-slate-50/95 border-b border-slate-200 text-slate-600 uppercase font-bold tracking-wider text-[11px] select-none sticky top-0 z-10 backdrop-blur-xs">
                    <th className="py-3.5 px-4 whitespace-nowrap min-w-[110px]">
                      Patient ID
                    </th>
                    <th className="py-3.5 px-4 whitespace-nowrap min-w-[180px]">
                      Patient Name
                    </th>
                    <th className="py-3.5 px-4 whitespace-nowrap min-w-[140px]">
                      Phone
                    </th>
                    <th className="py-3.5 px-4 whitespace-nowrap min-w-[120px]">
                      Billing Date
                    </th>
                    <th className="py-3.5 px-4 text-right whitespace-nowrap min-w-[130px]">
                      Total Billing
                    </th>
                    <th className="py-3.5 px-4 text-right whitespace-nowrap min-w-[130px]">
                      Total Paid
                    </th>
                    <th className="py-3.5 px-4 text-right whitespace-nowrap min-w-[150px]">
                      Outstanding Balance
                    </th>
                    <th className="py-3.5 px-3 text-center whitespace-nowrap w-24">
                      Actions
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredRows.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-brand-50/25 transition-colors group"
                    >
                      {/* 1. Patient ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700 whitespace-nowrap">
                        {row.patientId}
                      </td>

                      {/* 2. Patient Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-brand-600/15 via-brand-500/10 to-teal-500/20 text-brand-700 font-bold flex items-center justify-center text-[10px] flex-shrink-0 border border-brand-200/60 shadow-2xs">
                            {row.patientName
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block leading-tight">
                              {row.patientName}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Dr: {row.doctorName}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 3. Phone */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono text-slate-800 font-semibold">
                        {row.phone ? (
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-slate-400 flex-shrink-0" />
                            <span>{row.phone}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-normal">—</span>
                        )}
                      </td>

                      {/* 4. Billing Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-semibold text-slate-900 block">
                          {formatDate(row.billDate)}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400 block">
                          {row.billNumber}
                        </span>
                      </td>

                      {/* 5. Total Billing */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap font-bold text-slate-900 tabular-nums">
                        {formatCurrency(row.totalBilling)}
                      </td>

                      {/* 6. Total Paid */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap font-bold text-emerald-700 tabular-nums">
                        {formatCurrency(row.totalPaid)}
                      </td>

                      {/* 7. Outstanding Balance = Total Billing - Total Paid */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <span
                          className={`font-black tabular-nums text-sm ${
                            row.outstandingBalance > 0
                              ? 'text-rose-600'
                              : 'text-slate-400 font-normal'
                          }`}
                        >
                          {formatCurrency(row.outstandingBalance)}
                        </span>
                      </td>

                      {/* 8. Quick Actions */}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          {row.outstandingBalance > 0 ? (
                            <button
                              onClick={() =>
                                navigate('/payments', { state: { targetBill: row.rawBill } })
                              }
                              className="px-2.5 py-1 text-[11px] font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors flex items-center gap-1 border border-teal-200/90 shadow-2xs cursor-pointer"
                              title="Collect Payment for this Bill"
                            >
                              <CreditCard className="w-3 h-3 text-teal-700" />
                              <span>Collect</span>
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Cleared</span>
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>

                {/* ========================================================= */}
                {/* GRAND TOTAL ROW: Total Billing, Total Paid, Outstanding Balance */}
                {/* ========================================================= */}
                <tfoot className="bg-slate-100/95 border-t-2 border-slate-300/90 font-bold text-slate-900 select-none sticky bottom-0 z-10 backdrop-blur-xs">
                  <tr>
                    {/* Patient ID: Grand Total Label + Record Count Badge */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase font-black text-slate-900 tracking-wider">
                          Grand Total
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold font-mono">
                          {filteredRows.length} {filteredRows.length === 1 ? 'Record' : 'Records'}
                        </span>
                      </div>
                    </td>

                    {/* Non-value columns: Empty */}
                    <td className="py-4 px-4 whitespace-nowrap">—</td>
                    <td className="py-4 px-4 whitespace-nowrap">—</td>
                    <td className="py-4 px-4 whitespace-nowrap">—</td>

                    {/* Total Billing Grand Total */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <span className="text-sm font-black text-slate-900 tabular-nums block">
                        {formatCurrency(grandTotals.totalBilling)}
                      </span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        Gross Invoiced
                      </span>
                    </td>

                    {/* Total Paid Grand Total */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <span className="text-sm font-black text-emerald-700 tabular-nums block">
                        {formatCurrency(grandTotals.totalPaid)}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-bold">
                        {recoveryPct}% Recovered
                      </span>
                    </td>

                    {/* Outstanding Balance Grand Total */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <span className="text-base font-black text-rose-700 tabular-nums block">
                        {formatCurrency(grandTotals.outstandingBalance)}
                      </span>
                      <span className="text-[10px] text-rose-700 font-bold">
                        Total Receivables Due
                      </span>
                    </td>

                    {/* Actions column */}
                    <td className="py-4 px-3 text-center whitespace-nowrap">—</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </>
        )}
      </div>

      {/* ========================================================= */}
      {/* 5. PRINT PREVIEW MODAL */}
      {/* ========================================================= */}
      <Modal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        title="Printable Outstanding Patient Balance Report"
        subtitle="Formal clinic receivables schedule for credit control, management audit, and collections."
        maxWidth="max-w-4xl"
      >
        <div className="space-y-6 text-slate-800" id="printable-outstanding-report">
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
              <span className="inline-block px-2.5 py-1 bg-rose-700 text-white font-extrabold text-xs uppercase tracking-widest rounded-md">
                Outstanding Balance Schedule
              </span>
              <p className="text-xs text-slate-700 font-bold mt-1.5">
                Period: {datePreset === 'all' ? 'All Recorded Dates' : `${startDate} to ${endDate}`}
              </p>
              <p className="text-[11px] text-slate-500">
                Filter: {balanceStatus === 'OUTSTANDING_ONLY' ? 'Outstanding Balances Only (> 0)' : balanceStatus}
              </p>
            </div>
          </div>

          {/* KPI Summary Banner */}
          <div className="grid grid-cols-3 gap-3 text-center border border-slate-200 rounded-xl p-3 bg-slate-50">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-600 block">Total Invoiced</span>
              <span className="text-base font-black text-slate-900">{formatCurrency(grandTotals.totalBilling)}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-emerald-800 block">Total Paid</span>
              <span className="text-base font-black text-emerald-700">{formatCurrency(grandTotals.totalPaid)}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-rose-800 block">Total Outstanding Balance</span>
              <span className="text-base font-black text-rose-700">{formatCurrency(grandTotals.outstandingBalance)}</span>
            </div>
          </div>

          {/* Printable Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-900 text-white font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-2 px-2.5">Patient ID</th>
                  <th className="py-2 px-2.5">Patient Name</th>
                  <th className="py-2 px-2.5">Phone</th>
                  <th className="py-2 px-2.5">Billing Date</th>
                  <th className="py-2 px-2.5 text-right">Total Billing</th>
                  <th className="py-2 px-2.5 text-right">Total Paid</th>
                  <th className="py-2 px-2.5 text-right">Outstanding Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredRows.map((row) => (
                  <tr key={row.id} className="even:bg-slate-50">
                    <td className="py-2 px-2.5 font-mono font-bold text-slate-700">{row.patientId}</td>
                    <td className="py-2 px-2.5 font-bold text-slate-900">{row.patientName}</td>
                    <td className="py-2 px-2.5 font-mono">{row.phone || '—'}</td>
                    <td className="py-2 px-2.5">{formatDate(row.billDate)}</td>
                    <td className="py-2 px-2.5 text-right font-bold text-slate-800">{formatCurrency(row.totalBilling)}</td>
                    <td className="py-2 px-2.5 text-right font-bold text-emerald-700">{formatCurrency(row.totalPaid)}</td>
                    <td className="py-2 px-2.5 text-right font-black text-rose-700">{formatCurrency(row.outstandingBalance)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-400">
                <tr>
                  <td className="py-2.5 px-2.5 uppercase font-black text-slate-900">
                    Grand Total ({filteredRows.length} Records)
                  </td>
                  <td className="py-2.5 px-2.5">—</td>
                  <td className="py-2.5 px-2.5">—</td>
                  <td className="py-2.5 px-2.5">—</td>
                  <td className="py-2.5 px-2.5 text-right font-black text-slate-900">
                    {formatCurrency(grandTotals.totalBilling)}
                  </td>
                  <td className="py-2.5 px-2.5 text-right font-black text-emerald-700">
                    {formatCurrency(grandTotals.totalPaid)}
                  </td>
                  <td className="py-2.5 px-2.5 text-right font-black text-rose-700 text-sm">
                    {formatCurrency(grandTotals.outstandingBalance)}
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
              <p className="text-[10px]">Billing &amp; Front Desk Officer</p>
            </div>
            <div>
              <div className="border-b border-slate-300 pb-8 mb-1.5" />
              <p className="font-bold text-slate-700">Verified By</p>
              <p className="text-[10px]">Accounts &amp; Credit Manager</p>
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
