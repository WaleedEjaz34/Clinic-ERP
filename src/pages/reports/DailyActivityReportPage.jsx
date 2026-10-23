import React, { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Calendar,
  Search,
  Printer,
  Download,
  Users,
  Clock,
  CheckCircle2,
  Stethoscope,
  FileText,
  Receipt,
  CreditCard,
  TrendingDown,
  TrendingUp,
  DollarSign,
  Filter,
  ArrowRight,
  Sparkles,
  ChevronDown,
  X,
  FileSpreadsheet,
  FileCheck,
  Coins,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Modal } from '../../components/common/Modal';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { generateDailyActivityReportPDF } from '../../services/documentService';

export const DailyActivityReportPage = () => {
  const navigate = useNavigate();
  const {
    patients = [],
    appointments = [],
    prescriptions = [],
    bills = [],
    payments = [],
    expenses = [],
  } = useClinic();

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Filter State: Date range with default "today"
  const [datePreset, setDatePreset] = useState('today'); // 'today' | 'yesterday' | 'week' | 'month' | 'last30' | 'all' | 'custom'
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(todayStr);
  const [search, setSearch] = useState('');

  // Modals & Export state
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

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

  // Compile all unique dates across all clinical and financial activity records
  const allActiveDates = useMemo(() => {
    const datesSet = new Set();

    // Include today by default
    datesSet.add(todayStr);

    // Patients registration date
    patients.forEach((p) => {
      if (p.registrationDate) datesSet.add(p.registrationDate.split('T')[0]);
    });

    // Appointments scheduled date
    appointments.forEach((a) => {
      if (a.date) datesSet.add(a.date.split('T')[0]);
    });

    // Prescriptions date
    prescriptions.forEach((rx) => {
      if (rx.prescriptionDate) datesSet.add(rx.prescriptionDate.split('T')[0]);
    });

    // Bills date
    bills.forEach((b) => {
      if (b.billDate) datesSet.add(b.billDate.split('T')[0]);
    });

    // Payments date
    payments.forEach((p) => {
      if (p.paymentDate) datesSet.add(p.paymentDate.split('T')[0]);
    });

    // Expenses date
    expenses.forEach((e) => {
      if (e.expenseDate) datesSet.add(e.expenseDate.split('T')[0]);
    });

    return Array.from(datesSet).sort().reverse(); // Descending (latest first)
  }, [patients, appointments, prescriptions, bills, payments, expenses, todayStr]);

  // Generate Daily Activity Rows for each date
  const dailyDataRows = useMemo(() => {
    // Determine active date list based on start & end bounds
    const filteredDates = allActiveDates.filter((d) => {
      if (startDate && d < startDate) return false;
      if (endDate && d > endDate) return false;
      return true;
    });

    return filteredDates.map((dateStr) => {
      // 1. New Patients
      const dayPatients = patients.filter(
        (p) => (p.registrationDate || '').split('T')[0] === dateStr
      );
      const newPatients = dayPatients.length;

      // 2. Appointments
      const dayAppointments = appointments.filter(
        (a) => (a.date || '').split('T')[0] === dateStr
      );
      const totalAppointments = dayAppointments.length;

      // 3. Completed Appointments
      const completedAppointments = dayAppointments.filter(
        (a) => a.status === 'Completed'
      ).length;

      // 4. Prescriptions
      const dayPrescriptions = prescriptions.filter(
        (rx) => (rx.prescriptionDate || '').split('T')[0] === dateStr
      );
      const prescriptionsCount = dayPrescriptions.length;

      // 5. Consultations
      // A consultation is conducted when an appointment is completed or in-consultation,
      // plus any walk-in consultations that generated a prescription without an appointment reference
      const linkedAptIds = new Set(
        dayPrescriptions.map((r) => r.appointmentId).filter(Boolean)
      );
      const completedOrActiveApts = dayAppointments.filter(
        (a) => a.status === 'Completed' || a.status === 'In Consultation'
      ).length;
      const walkInRxs = dayPrescriptions.filter(
        (r) => !r.appointmentId || r.appointmentId === 'Walk-in' || !linkedAptIds.has(r.appointmentId)
      ).length;
      const consultations = completedOrActiveApts + walkInRxs;

      // 6. Total Billing (sum of all bills issued on that date)
      const dayBills = bills.filter(
        (b) => (b.billDate || '').split('T')[0] === dateStr
      );
      const totalBilling = dayBills.reduce(
        (sum, b) => sum + (Number(b.totalAmount) || 0),
        0
      );

      // 7. Total Collection (sum of payments collected on that date)
      const dayPayments = payments.filter(
        (p) => (p.paymentDate || '').split('T')[0] === dateStr
      );
      const totalCollection = dayPayments.reduce(
        (sum, p) => sum + (Number(p.amount) || 0),
        0
      );

      // 8. Outstanding = Total Billing − Total Collection
      const outstanding = totalBilling - totalCollection;

      // 9. Expenses (sum of disbursements on that date)
      const dayExpenses = expenses.filter(
        (e) => (e.expenseDate || '').split('T')[0] === dateStr
      );
      const dayExpensesAmount = dayExpenses.reduce(
        (sum, e) => sum + (Number(e.amount) || 0),
        0
      );

      // 10. Net Income = Total Collection − Expenses
      const netIncome = totalCollection - dayExpensesAmount;

      return {
        date: dateStr,
        newPatients,
        totalAppointments,
        completedAppointments,
        consultations,
        prescriptions: prescriptionsCount,
        totalBilling,
        totalCollection,
        outstanding,
        expenses: dayExpensesAmount,
        netIncome,
      };
    });
  }, [allActiveDates, startDate, endDate, patients, appointments, prescriptions, bills, payments, expenses]);

  // Filtered rows by search term
  const filteredRows = useMemo(() => {
    if (!search.trim()) return dailyDataRows;
    const q = search.toLowerCase().trim();
    return dailyDataRows.filter((r) => {
      const formatted = formatDate(r.date, 'dd MMM yyyy').toLowerCase();
      const rawDate = r.date.toLowerCase();
      return rawDate.includes(q) || formatted.includes(q);
    });
  }, [dailyDataRows, search]);

  // Grand Totals Calculation for all numeric columns
  const grandTotals = useMemo(() => {
    const totals = filteredRows.reduce(
      (acc, r) => {
        acc.newPatients += r.newPatients;
        acc.totalAppointments += r.totalAppointments;
        acc.completedAppointments += r.completedAppointments;
        acc.consultations += r.consultations;
        acc.prescriptions += r.prescriptions;
        acc.totalBilling += r.totalBilling;
        acc.totalCollection += r.totalCollection;
        acc.expenses += r.expenses;
        return acc;
      },
      {
        newPatients: 0,
        totalAppointments: 0,
        completedAppointments: 0,
        consultations: 0,
        prescriptions: 0,
        totalBilling: 0,
        totalCollection: 0,
        expenses: 0,
      }
    );

    // Exact formulas:
    // Outstanding = Total Billing − Total Collection
    const outstanding = totals.totalBilling - totals.totalCollection;
    // Net Income = Total Collection − Expenses
    const netIncome = totals.totalCollection - totals.expenses;

    return {
      ...totals,
      outstanding,
      netIncome,
    };
  }, [filteredRows]);

  // Date Range Label
  const dateRangeLabel = useMemo(() => {
    if (datePreset === 'today') return `Today (${formatDate(todayStr)})`;
    if (datePreset === 'yesterday') return `Yesterday (${formatDate(startDate)})`;
    if (datePreset === 'week') return `Last 7 Days (${formatDate(startDate)} – ${formatDate(endDate)})`;
    if (datePreset === 'month') return `This Month (${formatDate(startDate)} – ${formatDate(endDate)})`;
    if (datePreset === 'last30') return `Last 30 Days (${formatDate(startDate)} – ${formatDate(endDate)})`;
    if (datePreset === 'all') return 'All Recorded Activity Dates';
    return `${formatDate(startDate)} to ${formatDate(endDate)}`;
  }, [datePreset, todayStr, startDate, endDate]);

  // CSV Export Handler
  const handleExportCSV = () => {
    const headers = [
      'Date',
      'New Patients',
      'Total Appointments',
      'Completed Appointments',
      'Consultations',
      'Prescriptions',
      'Total Billing (PKR)',
      'Total Collection (PKR)',
      'Outstanding (PKR)',
      'Expenses (PKR)',
      'Net Income (PKR)',
    ];

    const dataRows = filteredRows.map((r) => [
      r.date,
      r.newPatients,
      r.totalAppointments,
      r.completedAppointments,
      r.consultations,
      r.prescriptions,
      r.totalBilling,
      r.totalCollection,
      r.outstanding,
      r.expenses,
      r.netIncome,
    ]);

    // Append Grand Total Row
    const footRow = [
      'Grand Total',
      grandTotals.newPatients,
      grandTotals.totalAppointments,
      grandTotals.completedAppointments,
      grandTotals.consultations,
      grandTotals.prescriptions,
      grandTotals.totalBilling,
      grandTotals.totalCollection,
      grandTotals.outstanding,
      grandTotals.expenses,
      grandTotals.netIncome,
    ];

    const csvContent = [
      `"MedPulse Executive Healthcare Clinic - Daily Activity Summary Report"`,
      `"Filter: ${dateRangeLabel}"`,
      `"Exported At: ${new Date().toLocaleString()}"`,
      '',
      headers.map((h) => `"${h}"`).join(','),
      ...dataRows.map((row) => row.join(',')),
      footRow.map((val) => `"${val}"`).join(','),
    ].join('\r\n');

    // Trigger download with UTF-8 BOM
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Daily_Clinic_Summary_${startDate}_to_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsExportMenuOpen(false);
  };

  // PDF Export Handler
  const handleExportPDF = () => {
    generateDailyActivityReportPDF({
      rows: filteredRows,
      grandTotals,
      dateRangeLabel,
    });
    setIsExportMenuOpen(false);
  };

  // Browser Window Print
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <PageHeader
        title="Daily Clinic Activity Summary"
        subtitle="One row for each date summarizing patient flow, consultations, prescriptions, total billing, fee collections, outstanding dues, expenses, and net clinic income."
      >
        <div className="flex items-center gap-2 flex-wrap">
          {/* Switch to Financial Summary */}
          <button
            type="button"
            onClick={() => navigate('/reports/financial-summary')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            title="Switch to Management Financial Performance Report"
          >
            <Coins className="w-4 h-4 text-teal-600" />
            <span>Financial Summary</span>
          </button>

          {/* Print Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            title="Print Daily Summary Report"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print Report</span>
          </button>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-brand-600" />
              <span>Export</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isExportMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-slate-200 shadow-modal py-1.5 z-50 text-xs animate-in fade-in zoom-in-95"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Export Options
                </div>
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Download Excel / CSV</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportPDF}
                  className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-rose-600" />
                  <span>Download Landscape PDF</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Create Rx / Bill */}
          <button
            type="button"
            onClick={() => navigate('/prescriptions?action=new')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-brand-600 via-brand-600 to-teal-600 hover:from-brand-500 hover:to-teal-500 text-white rounded-xl text-xs font-semibold shadow-sm shadow-brand-500/25 transition-all hover:shadow-glow active:scale-95 cursor-pointer"
          >
            <Stethoscope className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">New Consultation</span>
          </button>
        </div>
      </PageHeader>

      {/* Date Range Selector & Preset Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Preset Pill Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            <span className="text-xs font-bold text-slate-700 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-brand-600" />
              <span>Range:</span>
            </span>

            {[
              { id: 'today', label: 'Today' },
              { id: 'yesterday', label: 'Yesterday' },
              { id: 'week', label: 'Last 7 Days' },
              { id: 'month', label: 'This Month' },
              { id: 'last30', label: 'Last 30 Days' },
              { id: 'all', label: 'All Dates' },
              { id: 'custom', label: 'Custom Range' },
            ].map((p) => {
              const active = datePreset === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handlePresetChange(p.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/70'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Live Search */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter by date (e.g. 2026-10-23)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
        </div>

        {/* Custom Date Pickers Drawer (when custom is selected) */}
        {datePreset === 'custom' && (
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/90 flex flex-wrap items-center gap-3 animate-in fade-in duration-150 text-xs">
            <span className="font-semibold text-slate-700">From Date:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium"
            />
            <span className="font-semibold text-slate-700">To Date:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium"
            />
          </div>
        )}

        {/* Current Active Filter Indicator Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 uppercase tracking-wide">
              Selected Period:
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 font-bold border border-brand-200/60">
              {dateRangeLabel}
            </span>
            <span>
              (Showing <strong className="text-slate-800">{filteredRows.length}</strong>{' '}
              {filteredRows.length === 1 ? 'daily record' : 'daily records'})
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Outstanding = Total Billing − Total Collection
            </span>
            <span className="inline-flex items-center gap-1 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-brand-500" />
              Net Income = Total Collection − Expenses
            </span>
          </div>
        </div>
      </div>

      {/* KPI Financial Overview Strip for Selected Range */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Billing */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Billing
            </span>
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            {formatCurrency(grandTotals.totalBilling)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Invoices generated in period</p>
        </div>

        {/* Total Collection */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Collection
            </span>
            <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-teal-700 mt-2">
            {formatCurrency(grandTotals.totalCollection)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Fees collected at cash & bank</p>
        </div>

        {/* Total Expenses */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Operational Expenses
            </span>
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-700">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-rose-600 mt-2">
            {formatCurrency(grandTotals.expenses)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Disbursements in period</p>
        </div>

        {/* Net Income */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Net Clinic Income
            </span>
            <div
              className={`p-1.5 rounded-lg ${
                grandTotals.netIncome >= 0
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-rose-50 text-rose-700'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p
            className={`text-xl sm:text-2xl font-black mt-2 ${
              grandTotals.netIncome >= 0 ? 'text-emerald-700' : 'text-rose-600'
            }`}
          >
            {formatCurrency(grandTotals.netIncome)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Outstanding Due: <strong className="text-amber-700">{formatCurrency(grandTotals.outstanding)}</strong>
          </p>
        </div>
      </div>

      {/* ========================================================= */}
      {/* DAILY CLINIC ACTIVITY SUMMARY TABLE */}
      {/* ========================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            {/* Table Header */}
            <thead>
              <tr className="bg-slate-900 text-white font-bold border-b border-slate-800 tracking-wider">
                <th className="py-3.5 px-4 whitespace-nowrap min-w-[130px]">Date</th>
                <th className="py-3.5 px-3 text-center whitespace-nowrap">New Patients</th>
                <th className="py-3.5 px-3 text-center whitespace-nowrap">Total Apts</th>
                <th className="py-3.5 px-3 text-center whitespace-nowrap">Completed</th>
                <th className="py-3.5 px-3 text-center whitespace-nowrap">Consultations</th>
                <th className="py-3.5 px-3 text-center whitespace-nowrap">Prescriptions</th>
                <th className="py-3.5 px-4 text-right whitespace-nowrap min-w-[120px]">Total Billing</th>
                <th className="py-3.5 px-4 text-right whitespace-nowrap min-w-[120px]">Total Collection</th>
                <th className="py-3.5 px-4 text-right whitespace-nowrap min-w-[110px]">Outstanding</th>
                <th className="py-3.5 px-4 text-right whitespace-nowrap min-w-[110px]">Expenses</th>
                <th className="py-3.5 px-4 text-right whitespace-nowrap min-w-[120px]">Net Income</th>
              </tr>
            </thead>

            {/* Table Body: One Row For Each Date */}
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-700">No activity recorded for this period</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Try selecting a different date range preset or reset your search query.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => {
                  const isTodayRow = row.date === todayStr;
                  const hasNetProfit = row.netIncome >= 0;

                  return (
                    <tr
                      key={row.date}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isTodayRow ? 'bg-brand-50/30' : ''
                      }`}
                    >
                      {/* 1. Date */}
                      <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <div>
                            <span className="font-mono font-bold text-slate-900 block">
                              {formatDate(row.date, 'dd MMM yyyy')}
                            </span>
                            <span className="text-[10px] text-slate-400 font-normal">
                              {formatDate(row.date, 'EEEE')}
                            </span>
                          </div>
                          {isTodayRow && (
                            <span className="ml-1 px-1.5 py-0.2 rounded-md bg-brand-100 text-brand-800 text-[10px] font-bold">
                              Today
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 2. New Patients */}
                      <td className="py-3 px-3 text-center">
                        {row.newPatients > 0 ? (
                          <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 bg-blue-50 text-blue-700 font-bold rounded-full text-xs">
                            {row.newPatients}
                          </span>
                        ) : (
                          <span className="text-slate-300">0</span>
                        )}
                      </td>

                      {/* 3. Total Appointments */}
                      <td className="py-3 px-3 text-center font-medium">
                        {row.totalAppointments > 0 ? (
                          <span className="text-slate-900 font-bold">{row.totalAppointments}</span>
                        ) : (
                          <span className="text-slate-300">0</span>
                        )}
                      </td>

                      {/* 4. Completed Appointments */}
                      <td className="py-3 px-3 text-center">
                        {row.completedAppointments > 0 ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-[11px]">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            {row.completedAppointments}
                          </span>
                        ) : (
                          <span className="text-slate-300">0</span>
                        )}
                      </td>

                      {/* 5. Consultations */}
                      <td className="py-3 px-3 text-center">
                        {row.consultations > 0 ? (
                          <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 bg-indigo-50 text-indigo-700 font-bold rounded-full text-xs">
                            {row.consultations}
                          </span>
                        ) : (
                          <span className="text-slate-300">0</span>
                        )}
                      </td>

                      {/* 6. Prescriptions */}
                      <td className="py-3 px-3 text-center">
                        {row.prescriptions > 0 ? (
                          <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 bg-teal-50 text-teal-700 font-bold rounded-full text-xs">
                            {row.prescriptions}
                          </span>
                        ) : (
                          <span className="text-slate-300">0</span>
                        )}
                      </td>

                      {/* 7. Total Billing */}
                      <td className="py-3 px-4 text-right font-bold text-slate-900 whitespace-nowrap">
                        {formatCurrency(row.totalBilling)}
                      </td>

                      {/* 8. Total Collection */}
                      <td className="py-3 px-4 text-right font-bold text-teal-700 whitespace-nowrap">
                        {formatCurrency(row.totalCollection)}
                      </td>

                      {/* 9. Outstanding = Total Billing − Total Collection */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <span
                          className={`font-semibold ${
                            row.outstanding > 0 ? 'text-amber-700 font-bold' : 'text-slate-400'
                          }`}
                        >
                          {formatCurrency(row.outstanding)}
                        </span>
                      </td>

                      {/* 10. Expenses */}
                      <td className="py-3 px-4 text-right font-medium text-rose-600 whitespace-nowrap">
                        {formatCurrency(row.expenses)}
                      </td>

                      {/* 11. Net Income = Total Collection − Expenses */}
                      <td className="py-3 px-4 text-right font-bold whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold ${
                            hasNetProfit
                              ? 'text-emerald-700 bg-emerald-50'
                              : 'text-rose-700 bg-rose-50'
                          }`}
                        >
                          {hasNetProfit ? '+' : ''}
                          {formatCurrency(row.netIncome)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

            {/* ========================================================= */}
            {/* GRAND TOTAL ROW AT THE BOTTOM */}
            {/* ========================================================= */}
            {filteredRows.length > 0 && (
              <tfoot>
                <tr className="bg-slate-100/90 text-slate-900 font-bold border-t-2 border-slate-300 tracking-tight">
                  {/* Label */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase font-extrabold text-slate-900 tracking-wider">
                        Grand Total
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
                        {filteredRows.length} {filteredRows.length === 1 ? 'Date' : 'Dates'}
                      </span>
                    </div>
                  </td>

                  {/* Total New Patients */}
                  <td className="py-4 px-3 text-center text-xs text-blue-900 font-black">
                    {grandTotals.newPatients}
                  </td>

                  {/* Total Appointments */}
                  <td className="py-4 px-3 text-center text-xs text-slate-900 font-black">
                    {grandTotals.totalAppointments}
                  </td>

                  {/* Total Completed Appointments */}
                  <td className="py-4 px-3 text-center text-xs text-emerald-800 font-black">
                    {grandTotals.completedAppointments}
                  </td>

                  {/* Total Consultations */}
                  <td className="py-4 px-3 text-center text-xs text-indigo-900 font-black">
                    {grandTotals.consultations}
                  </td>

                  {/* Total Prescriptions */}
                  <td className="py-4 px-3 text-center text-xs text-teal-900 font-black">
                    {grandTotals.prescriptions}
                  </td>

                  {/* Grand Total Billing */}
                  <td className="py-4 px-4 text-right text-xs font-black text-slate-900 whitespace-nowrap">
                    {formatCurrency(grandTotals.totalBilling)}
                  </td>

                  {/* Grand Total Collection */}
                  <td className="py-4 px-4 text-right text-xs font-black text-teal-800 whitespace-nowrap">
                    {formatCurrency(grandTotals.totalCollection)}
                  </td>

                  {/* Grand Total Outstanding = Total Billing − Total Collection */}
                  <td className="py-4 px-4 text-right text-xs font-black text-amber-800 whitespace-nowrap">
                    {formatCurrency(grandTotals.outstanding)}
                  </td>

                  {/* Grand Total Expenses */}
                  <td className="py-4 px-4 text-right text-xs font-black text-rose-700 whitespace-nowrap">
                    {formatCurrency(grandTotals.expenses)}
                  </td>

                  {/* Grand Total Net Income = Total Collection − Expenses */}
                  <td className="py-4 px-4 text-right text-xs font-black whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-lg text-xs font-black ${
                        grandTotals.netIncome >= 0
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'bg-rose-600 text-white shadow-2xs'
                      }`}
                    >
                      {grandTotals.netIncome >= 0 ? '+' : ''}
                      {formatCurrency(grandTotals.netIncome)}
                    </span>
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};
