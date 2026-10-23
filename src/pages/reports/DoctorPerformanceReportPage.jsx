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
  Stethoscope,
  Activity,
  Award,
  FileText,
  UserCheck,
  XCircle,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Modal } from '../../components/common/Modal';
import { SearchableSelect } from '../../components/common/SearchableSelect';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { generateDoctorPerformanceReportPDF } from '../../services/documentService';

export const DoctorPerformanceReportPage = () => {
  const navigate = useNavigate();
  const {
    doctors = [],
    appointments = [],
    prescriptions = [],
    bills = [],
    payments = [],
  } = useClinic();

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Filter 1: Date Range (default: 'all' to show complete doctor historical performance)
  const [datePreset, setDatePreset] = useState('all'); // 'all' | 'today' | 'month' | 'last30' | 'last90' | 'year' | 'custom'
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState(todayStr);

  // Filter 2: Doctor (default: 'ALL')
  const [selectedDoctorId, setSelectedDoctorId] = useState('ALL');

  // General Search query (doctor name, specialization, ID)
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

  // Helper: check if a record's date falls within [startDate, endDate]
  const isDateInRange = (dateStr) => {
    if (!dateStr) return false;
    const d = dateStr.split('T')[0];
    if (startDate && d < startDate) return false;
    if (endDate && d > endDate) return false;
    return true;
  };

  // Helper: check if an appointment / bill / prescription matches a specific doctor
  const isMatchDoctor = (item, doc) => {
    if (!item || !doc) return false;
    if (item.doctorId && item.doctorId === doc.id) return true;
    if (item.doctorName && doc.name) {
      const itemDoc = item.doctorName.toLowerCase().replace(/^(dr\.|dr)\s*/i, '').trim();
      const targetDoc = doc.name.toLowerCase().replace(/^(dr\.|dr)\s*/i, '').trim();
      return itemDoc === targetDoc || itemDoc.includes(targetDoc) || targetDoc.includes(itemDoc);
    }
    return false;
  };

  // Compile Doctor Performance Row for Each Doctor
  const allDoctorRows = useMemo(() => {
    return doctors.map((doc) => {
      // 1. Appointments for this doctor in date range
      const docApts = appointments.filter(
        (a) => isMatchDoctor(a, doc) && isDateInRange(a.date)
      );
      const totalAppointments = docApts.length;

      // 2. Completed Appointments
      const completedAppointments = docApts.filter(
        (a) => a.status === 'Completed'
      ).length;

      // 3. Cancelled / No Show
      const cancelledOrNoShow = docApts.filter(
        (a) =>
          a.status === 'Cancelled' ||
          a.status === 'No-Show' ||
          a.status === 'No Show'
      ).length;

      // 4. Prescriptions written by this doctor in date range
      const docRxs = prescriptions.filter(
        (rx) => isMatchDoctor(rx, doc) && isDateInRange(rx.prescriptionDate)
      );
      const prescriptionsCount = docRxs.length;

      // 5. Bills issued for this doctor in date range
      const docBills = bills.filter(
        (b) => isMatchDoctor(b, doc) && isDateInRange(b.billDate)
      );
      const totalBilling = docBills.reduce(
        (sum, b) => sum + (Number(b.totalAmount) || 0),
        0
      );
      const totalCollection = docBills.reduce(
        (sum, b) => sum + (Number(b.paidAmount) || 0),
        0
      );
      // Outstanding = Total Billing - Total Collection
      const outstanding = Math.max(0, totalBilling - totalCollection);

      // 6. Patients Seen:
      // Unique patient IDs from completed appointments, prescriptions, and consultation bills
      const seenPatientsSet = new Set();
      docApts
        .filter((a) => a.status === 'Completed')
        .forEach((a) => {
          if (a.patientId) seenPatientsSet.add(a.patientId);
        });
      docRxs.forEach((rx) => {
        if (rx.patientId) seenPatientsSet.add(rx.patientId);
      });
      docBills.forEach((b) => {
        if (b.patientId) seenPatientsSet.add(b.patientId);
      });
      const patientsSeen = seenPatientsSet.size;

      return {
        doctorId: doc.id,
        doctorName: doc.name,
        specialization: doc.specialization,
        avatar: doc.avatar,
        phone: doc.phone,
        status: doc.status,
        consultationFee: doc.consultationFee,
        totalAppointments,
        completedAppointments,
        cancelledOrNoShow,
        patientsSeen,
        prescriptions: prescriptionsCount,
        totalBilling,
        totalCollection,
        outstanding,
        rawDoctor: doc,
      };
    });
  }, [doctors, appointments, prescriptions, bills, startDate, endDate]);

  // Filter rows by Selected Doctor and Search Query
  const filteredRows = useMemo(() => {
    return allDoctorRows.filter((row) => {
      // 1. Doctor Filter
      if (selectedDoctorId !== 'ALL' && row.doctorId !== selectedDoctorId) {
        return false;
      }

      // 2. Search Query (Doctor Name, Specialization, ID, Phone)
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matches =
          row.doctorName.toLowerCase().includes(q) ||
          row.specialization.toLowerCase().includes(q) ||
          row.doctorId.toLowerCase().includes(q) ||
          (row.phone && row.phone.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    });
  }, [allDoctorRows, selectedDoctorId, search]);

  // Grand Totals across all filtered rows (numeric columns only)
  const grandTotals = useMemo(() => {
    return filteredRows.reduce(
      (acc, r) => {
        acc.totalAppointments += r.totalAppointments;
        acc.completedAppointments += r.completedAppointments;
        acc.cancelledOrNoShow += r.cancelledOrNoShow;
        acc.patientsSeen += r.patientsSeen;
        acc.prescriptions += r.prescriptions;
        acc.totalBilling += r.totalBilling;
        acc.totalCollection += r.totalCollection;
        acc.outstanding += r.outstanding;
        return acc;
      },
      {
        totalAppointments: 0,
        completedAppointments: 0,
        cancelledOrNoShow: 0,
        patientsSeen: 0,
        prescriptions: 0,
        totalBilling: 0,
        totalCollection: 0,
        outstanding: 0,
      }
    );
  }, [filteredRows]);

  // Completion and Collection percentages
  const completionRate = useMemo(() => {
    if (grandTotals.totalAppointments <= 0) return '0.0';
    return (
      (grandTotals.completedAppointments / grandTotals.totalAppointments) *
      100
    ).toFixed(1);
  }, [grandTotals]);

  const collectionRate = useMemo(() => {
    if (grandTotals.totalBilling <= 0) return '0.0';
    return (
      (grandTotals.totalCollection / grandTotals.totalBilling) *
      100
    ).toFixed(1);
  }, [grandTotals]);

  // Reset all filters
  const handleResetFilters = () => {
    handlePresetChange('all');
    setSelectedDoctorId('ALL');
    setSearch('');
  };

  const hasActiveFilters =
    datePreset !== 'all' || selectedDoctorId !== 'ALL' || search !== '';

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Doctor ID',
      'Doctor Name',
      'Specialization',
      'Total Appointments',
      'Completed Appointments',
      'Cancelled / No Show',
      'Patients Seen',
      'Prescriptions',
      'Total Billing (PKR)',
      'Total Collection (PKR)',
      'Outstanding (PKR)',
    ];

    const csvRows = [
      ['MedPulse Executive Healthcare Clinic - Doctor Performance Summary Report'],
      [`Date Range: ${startDate} to ${endDate}`],
      [`Doctor Filter: ${selectedDoctorId === 'ALL' ? 'All Doctors' : selectedDoctorId}`],
      [`Generated At: ${new Date().toLocaleString()}`],
      [],
      headers,
    ];

    filteredRows.forEach((r) => {
      csvRows.push([
        r.doctorId,
        r.doctorName,
        r.specialization,
        r.totalAppointments,
        r.completedAppointments,
        r.cancelledOrNoShow,
        r.patientsSeen,
        r.prescriptions,
        r.totalBilling,
        r.totalCollection,
        r.outstanding,
      ]);
    });

    // Grand Total Row
    csvRows.push([]);
    csvRows.push([
      'GRAND TOTAL',
      `All Filtered Doctors (${filteredRows.length})`,
      '—',
      grandTotals.totalAppointments,
      grandTotals.completedAppointments,
      grandTotals.cancelledOrNoShow,
      grandTotals.patientsSeen,
      grandTotals.prescriptions,
      grandTotals.totalBilling,
      grandTotals.totalCollection,
      grandTotals.outstanding,
    ]);

    const csvContent =
      '\uFEFF' + csvRows.map((e) => e.map((val) => `"${val}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute(
      'download',
      `Doctor_Performance_Summary_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExportMenuOpen(false);
  };

  // Export to PDF
  const handleExportPDF = () => {
    generateDoctorPerformanceReportPDF(filteredRows, grandTotals, {
      dateRangeStr:
        datePreset === 'all' ? 'All Recorded Dates' : `${startDate} to ${endDate}`,
      doctorFilterStr:
        selectedDoctorId === 'ALL'
          ? 'All Doctors'
          : doctors.find((d) => d.id === selectedDoctorId)?.name || selectedDoctorId,
    });
    setIsExportMenuOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* ========================================================= */}
      {/* 1. PAGE HEADER & ACTIONS */}
      {/* ========================================================= */}
      <PageHeader
        title="Doctor Performance Summary Report"
        subtitle="Individual clinical workload, appointment completions, prescriptions written, revenue invoiced, and collections per doctor."
        breadcrumbs={[
          { label: 'Doctors', path: '/doctors' },
          { label: 'Doctor Performance Report' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            {/* Print Button */}
            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Print Report</span>
            </button>

            {/* Export Dropdown */}
            <div className="relative" ref={exportMenuRef}>
              <button
                onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-150 ${
                    isExportMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isExportMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-slate-200 shadow-modal py-1.5 z-50 text-xs animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1 mb-1">
                    Export Formats
                  </div>
                  <button
                    onClick={handleExportCSV}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium transition-colors cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="block font-semibold">Excel CSV (.csv)</span>
                      <span className="text-[10px] text-slate-400 block">
                        Raw tabular performance data
                      </span>
                    </div>
                  </button>
                  <button
                    onClick={handleExportPDF}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium transition-colors cursor-pointer"
                  >
                    <FileCheck className="w-4 h-4 text-rose-600" />
                    <div>
                      <span className="block font-semibold">Printable PDF (.pdf)</span>
                      <span className="text-[10px] text-slate-400 block">
                        Executive formatted report
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
      {/* 2. TOP KPI SUMMARY TILES */}
      {/* ========================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* KPI 1: Total Appointments */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Total Appts
            </span>
            <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg font-black text-slate-900 tabular-nums">
            {grandTotals.totalAppointments.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500 font-medium block">
            Across {filteredRows.length} {filteredRows.length === 1 ? 'doctor' : 'doctors'}
          </span>
        </div>

        {/* KPI 2: Completed Consultations */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-teal-600 tracking-wider">
              Completed
            </span>
            <div className="w-6 h-6 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg font-black text-teal-700 tabular-nums">
            {grandTotals.completedAppointments.toLocaleString()}
          </div>
          <span className="text-[10px] text-teal-600 font-bold block">
            {completionRate}% Completion Rate
          </span>
        </div>

        {/* KPI 3: Patients Seen */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">
              Patients Seen
            </span>
            <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg font-black text-indigo-700 tabular-nums">
            {grandTotals.patientsSeen.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500 font-medium block">
            Consulted & Treated
          </span>
        </div>

        {/* KPI 4: Total Collection */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">
              Total Collection
            </span>
            <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg font-black text-emerald-700 tabular-nums">
            {formatCurrency(grandTotals.totalCollection)}
          </div>
          <span className="text-[10px] text-emerald-600 font-bold block">
            {collectionRate}% Collected
          </span>
        </div>

        {/* KPI 5: Total Outstanding */}
        <div className="bg-white p-3.5 rounded-2xl border border-rose-200/90 shadow-2xs space-y-1 bg-rose-50/20 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-rose-700 tracking-wider">
              Outstanding Due
            </span>
            <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg font-black text-rose-700 tabular-nums">
            {formatCurrency(grandTotals.outstanding)}
          </div>
          <span className="text-[10px] text-rose-600 font-bold block">
            Total Receivables Due
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. FILTERS & SEARCH BAR */}
      {/* ========================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card p-4 space-y-3">
        {/* Top Row: Date Range Quick Presets & Date Pickers */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Preset Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-thin">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Date Range:</span>
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

        {/* Bottom Row: Doctor Filter, General Search, Reset */}
        <div className="pt-3 border-t border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 flex-wrap lg:flex-nowrap">
            {/* Filter 2: Doctor Filter */}
            <div className="min-w-[220px] max-w-sm flex-1">
              <SearchableSelect
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-2xs"
                searchPlaceholder="Filter doctor..."
              >
                <option value="ALL">All Doctors ({doctors.length})</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.id}) — {d.specialization}
                  </option>
                ))}
              </SearchableSelect>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search doctor name, specialization, ID..."
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-9 pr-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-2xs placeholder:text-slate-400"
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
              Showing <strong className="text-slate-900">{filteredRows.length}</strong>{' '}
              {filteredRows.length === 1 ? 'doctor' : 'doctors'}
            </span>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-brand-600 hover:bg-brand-50 border border-brand-200 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. DOCTOR PERFORMANCE DATA TABLE */}
      {/* ========================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-hidden">
        {/* Table Title Bar */}
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-brand-600" />
            <span className="font-extrabold text-slate-900 uppercase tracking-wider">
              Doctor Performance Ledger
            </span>
            <span className="px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 text-[10px] font-bold font-mono">
              {filteredRows.length} {filteredRows.length === 1 ? 'Doctor' : 'Doctors'}
            </span>
          </div>

          <span className="text-[11px] font-medium text-slate-500 hidden sm:inline">
            Formula: <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800 font-bold font-mono">Outstanding = Total Billing − Total Collection</code>
          </span>
        </div>

        {/* Empty State */}
        {filteredRows.length === 0 ? (
          <div className="py-20 text-center text-slate-500 px-4">
            <Stethoscope className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-800">No doctor records found</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              No doctors match your selected doctor or search criteria.
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
                  key={row.doctorId}
                  className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-sm space-y-3"
                >
                  {/* Doctor Profile Header */}
                  <div className="flex items-center gap-3 pb-2.5 border-b border-slate-100">
                    <img
                      src={row.avatar}
                      alt={row.doctorName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-2xs flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm truncate">
                          {row.doctorName}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">
                          {row.doctorId}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">{row.specialization}</p>
                    </div>
                  </div>

                  {/* Clinical Workload Grid */}
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="bg-slate-50 p-2 rounded-xl">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Appts
                      </span>
                      <span className="font-bold text-slate-800">{row.totalAppointments}</span>
                    </div>
                    <div className="bg-teal-50/60 p-2 rounded-xl">
                      <span className="text-[10px] text-teal-700 uppercase font-bold block">
                        Done
                      </span>
                      <span className="font-bold text-teal-800">{row.completedAppointments}</span>
                    </div>
                    <div className="bg-rose-50/60 p-2 rounded-xl">
                      <span className="text-[10px] text-rose-700 uppercase font-bold block">
                        No-Show
                      </span>
                      <span className="font-bold text-rose-800">{row.cancelledOrNoShow}</span>
                    </div>
                    <div className="bg-indigo-50/60 p-2 rounded-xl">
                      <span className="text-[10px] text-indigo-700 uppercase font-bold block">
                        Seen
                      </span>
                      <span className="font-bold text-indigo-800">{row.patientsSeen}</span>
                    </div>
                  </div>

                  {/* Financial Grid */}
                  <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-slate-100">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Billing
                      </span>
                      <span className="font-bold text-slate-900 block">
                        {formatCurrency(row.totalBilling)}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {row.prescriptions} Rx
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-600 block">
                        Collection
                      </span>
                      <span className="font-bold text-emerald-700 block">
                        {formatCurrency(row.totalCollection)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-rose-600 block">
                        Outstanding
                      </span>
                      <span className="font-black text-rose-700 block">
                        {formatCurrency(row.outstanding)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Mobile Grand Total Summary Card */}
              <div className="bg-slate-100/95 border-2 border-slate-300 rounded-2xl p-4 shadow-sm space-y-3 mt-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-black text-xs uppercase tracking-wider text-slate-900">
                    Grand Total Summary
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold font-mono">
                    {filteredRows.length} Doctors
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Total Appts
                    </span>
                    <span className="text-base font-black text-slate-900">
                      {grandTotals.totalAppointments}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-teal-600 block">
                      Completed
                    </span>
                    <span className="text-base font-black text-teal-700">
                      {grandTotals.completedAppointments}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Total Billing
                    </span>
                    <span className="text-sm font-black text-slate-900">
                      {formatCurrency(grandTotals.totalBilling)}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-emerald-600 block">
                      Collection
                    </span>
                    <span className="text-sm font-black text-emerald-700">
                      {formatCurrency(grandTotals.totalCollection)}
                    </span>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-rose-200 bg-rose-50/40">
                  <span className="text-[10px] uppercase font-bold text-rose-700 block">
                    Total Outstanding Balance
                  </span>
                  <span className="text-base font-black text-rose-700">
                    {formatCurrency(grandTotals.outstanding)}
                  </span>
                </div>
              </div>
            </div>

            {/* ================= DESKTOP TABLE VIEW (hidden sm:block) ================= */}
            <div className="hidden sm:block overflow-x-auto min-h-[300px]">
              <table className="w-full text-left border-collapse text-xs">
                {/* Table Header: Columns matching exact requirements */}
                <thead>
                  <tr className="bg-slate-50/95 border-b border-slate-200 text-slate-600 uppercase font-bold tracking-wider text-[11px] select-none sticky top-0 z-10 backdrop-blur-xs">
                    <th className="py-3.5 px-4 whitespace-nowrap min-w-[220px]">
                      Doctor
                    </th>
                    <th className="py-3.5 px-3 text-center whitespace-nowrap min-w-[120px]">
                      Total Appointments
                    </th>
                    <th className="py-3.5 px-3 text-center whitespace-nowrap min-w-[140px]">
                      Completed Appointments
                    </th>
                    <th className="py-3.5 px-3 text-center whitespace-nowrap min-w-[130px]">
                      Cancelled/No Show
                    </th>
                    <th className="py-3.5 px-3 text-center whitespace-nowrap min-w-[110px]">
                      Patients Seen
                    </th>
                    <th className="py-3.5 px-3 text-center whitespace-nowrap min-w-[110px]">
                      Prescriptions
                    </th>
                    <th className="py-3.5 px-4 text-right whitespace-nowrap min-w-[130px]">
                      Total Billing
                    </th>
                    <th className="py-3.5 px-4 text-right whitespace-nowrap min-w-[130px]">
                      Total Collection
                    </th>
                    <th className="py-3.5 px-4 text-right whitespace-nowrap min-w-[140px]">
                      Outstanding
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredRows.map((row) => (
                    <tr
                      key={row.doctorId}
                      className="hover:bg-brand-50/25 transition-colors group"
                    >
                      {/* 1. Doctor */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={row.avatar}
                            alt={row.doctorName}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-2xs flex-shrink-0"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block leading-tight">
                              {row.doctorName}
                            </span>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                              <span className="font-mono font-medium">{row.doctorId}</span>
                              <span>•</span>
                              <span>{row.specialization}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 2. Total Appointments */}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap font-bold text-slate-800 tabular-nums">
                        {row.totalAppointments}
                      </td>

                      {/* 3. Completed Appointments */}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        <span
                          className={`font-bold tabular-nums ${
                            row.completedAppointments > 0
                              ? 'text-teal-700'
                              : 'text-slate-400'
                          }`}
                        >
                          {row.completedAppointments}
                        </span>
                      </td>

                      {/* 4. Cancelled/No Show */}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        <span
                          className={`font-bold tabular-nums ${
                            row.cancelledOrNoShow > 0
                              ? 'text-rose-600'
                              : 'text-slate-400'
                          }`}
                        >
                          {row.cancelledOrNoShow}
                        </span>
                      </td>

                      {/* 5. Patients Seen */}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap font-bold text-indigo-700 tabular-nums">
                        {row.patientsSeen}
                      </td>

                      {/* 6. Prescriptions */}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap font-semibold text-slate-800 tabular-nums">
                        {row.prescriptions}
                      </td>

                      {/* 7. Total Billing */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap font-bold text-slate-900 tabular-nums">
                        {formatCurrency(row.totalBilling)}
                      </td>

                      {/* 8. Total Collection */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap font-bold text-emerald-700 tabular-nums">
                        {formatCurrency(row.totalCollection)}
                      </td>

                      {/* 9. Outstanding */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <span
                          className={`font-black tabular-nums text-sm ${
                            row.outstanding > 0 ? 'text-rose-600' : 'text-slate-400 font-normal'
                          }`}
                        >
                          {formatCurrency(row.outstanding)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>

                {/* ========================================================= */}
                {/* GRAND TOTAL ROW: Sum for every numeric value column */}
                {/* ========================================================= */}
                <tfoot className="bg-slate-100/95 border-t-2 border-slate-300/90 font-bold text-slate-900 select-none sticky bottom-0 z-10 backdrop-blur-xs">
                  <tr>
                    {/* Doctor column: Grand Total Label + Record Count Badge */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase font-black text-slate-900 tracking-wider">
                          Grand Total
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold font-mono">
                          {filteredRows.length} {filteredRows.length === 1 ? 'Doctor' : 'Doctors'}
                        </span>
                      </div>
                    </td>

                    {/* Total Appointments Grand Total */}
                    <td className="py-4 px-3 text-center whitespace-nowrap font-black text-slate-900 text-sm tabular-nums">
                      {grandTotals.totalAppointments}
                    </td>

                    {/* Completed Appointments Grand Total */}
                    <td className="py-4 px-3 text-center whitespace-nowrap font-black text-teal-700 text-sm tabular-nums">
                      <div>{grandTotals.completedAppointments}</div>
                      <span className="text-[10px] text-teal-600 font-bold block">
                        {completionRate}%
                      </span>
                    </td>

                    {/* Cancelled/No Show Grand Total */}
                    <td className="py-4 px-3 text-center whitespace-nowrap font-black text-rose-600 text-sm tabular-nums">
                      {grandTotals.cancelledOrNoShow}
                    </td>

                    {/* Patients Seen Grand Total */}
                    <td className="py-4 px-3 text-center whitespace-nowrap font-black text-indigo-700 text-sm tabular-nums">
                      {grandTotals.patientsSeen}
                    </td>

                    {/* Prescriptions Grand Total */}
                    <td className="py-4 px-3 text-center whitespace-nowrap font-black text-slate-900 text-sm tabular-nums">
                      {grandTotals.prescriptions}
                    </td>

                    {/* Total Billing Grand Total */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <span className="text-sm font-black text-slate-900 tabular-nums block">
                        {formatCurrency(grandTotals.totalBilling)}
                      </span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        Gross Invoiced
                      </span>
                    </td>

                    {/* Total Collection Grand Total */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <span className="text-sm font-black text-emerald-700 tabular-nums block">
                        {formatCurrency(grandTotals.totalCollection)}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold block">
                        {collectionRate}% Collected
                      </span>
                    </td>

                    {/* Outstanding Grand Total */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <span className="text-base font-black text-rose-700 tabular-nums block">
                        {formatCurrency(grandTotals.outstanding)}
                      </span>
                      <span className="text-[10px] text-rose-600 font-bold block">
                        Total Due
                      </span>
                    </td>
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
        title="Printable Doctor Performance Summary Report"
        subtitle="Clinical performance schedule for medical audit, doctor appraisals, and executive review."
        maxWidth="max-w-5xl"
      >
        <div className="space-y-6 text-slate-800" id="printable-doctor-report">
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
                Doctor Performance Summary
              </span>
              <p className="text-xs text-slate-700 font-bold mt-1.5">
                Period: {datePreset === 'all' ? 'All Recorded Dates' : `${startDate} to ${endDate}`}
              </p>
              <p className="text-[11px] text-slate-500">
                Doctor Filter:{' '}
                {selectedDoctorId === 'ALL'
                  ? 'All Doctors'
                  : doctors.find((d) => d.id === selectedDoctorId)?.name || selectedDoctorId}
              </p>
            </div>
          </div>

          {/* KPI Snapshot */}
          <div className="grid grid-cols-5 gap-2 text-center text-xs border border-slate-200 rounded-xl p-3 bg-slate-50">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">
                Total Appointments
              </span>
              <span className="text-sm font-black text-slate-900">
                {grandTotals.totalAppointments}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-teal-700 uppercase font-bold block">
                Completed Consults
              </span>
              <span className="text-sm font-black text-teal-700">
                {grandTotals.completedAppointments}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">
                Patients Seen
              </span>
              <span className="text-sm font-black text-indigo-700">
                {grandTotals.patientsSeen}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-emerald-700 uppercase font-bold block">
                Total Collection
              </span>
              <span className="text-sm font-black text-emerald-700">
                {formatCurrency(grandTotals.totalCollection)}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-rose-700 uppercase font-bold block">
                Total Outstanding
              </span>
              <span className="text-sm font-black text-rose-700">
                {formatCurrency(grandTotals.outstanding)}
              </span>
            </div>
          </div>

          {/* Printable Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 uppercase font-bold text-[10px]">
                  <th className="py-2 px-3">Doctor</th>
                  <th className="py-2 px-2 text-center">Appts</th>
                  <th className="py-2 px-2 text-center">Completed</th>
                  <th className="py-2 px-2 text-center">No-Show</th>
                  <th className="py-2 px-2 text-center">Patients</th>
                  <th className="py-2 px-2 text-center">Rx</th>
                  <th className="py-2 px-3 text-right">Billing</th>
                  <th className="py-2 px-3 text-right">Collection</th>
                  <th className="py-2 px-3 text-right">Outstanding</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRows.map((r) => (
                  <tr key={r.doctorId} className="text-slate-800">
                    <td className="py-2 px-3">
                      <span className="font-bold block leading-tight">{r.doctorName}</span>
                      <span className="text-[10px] text-slate-500">
                        {r.specialization} ({r.doctorId})
                      </span>
                    </td>
                    <td className="py-2 px-2 text-center font-semibold">{r.totalAppointments}</td>
                    <td className="py-2 px-2 text-center font-bold text-teal-700">
                      {r.completedAppointments}
                    </td>
                    <td className="py-2 px-2 text-center font-bold text-rose-600">
                      {r.cancelledOrNoShow}
                    </td>
                    <td className="py-2 px-2 text-center font-bold text-indigo-700">
                      {r.patientsSeen}
                    </td>
                    <td className="py-2 px-2 text-center font-semibold">{r.prescriptions}</td>
                    <td className="py-2 px-3 text-right font-bold text-slate-900">
                      {formatCurrency(r.totalBilling)}
                    </td>
                    <td className="py-2 px-3 text-right font-bold text-emerald-700">
                      {formatCurrency(r.totalCollection)}
                    </td>
                    <td className="py-2 px-3 text-right font-black text-rose-700">
                      {formatCurrency(r.outstanding)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-100 border-t-2 border-slate-300 font-bold text-slate-900">
                <tr>
                  <td className="py-2.5 px-3 uppercase font-black text-[11px]">
                    Grand Total ({filteredRows.length} Doctors)
                  </td>
                  <td className="py-2.5 px-2 text-center font-black">
                    {grandTotals.totalAppointments}
                  </td>
                  <td className="py-2.5 px-2 text-center font-black text-teal-800">
                    {grandTotals.completedAppointments}
                  </td>
                  <td className="py-2.5 px-2 text-center font-black text-rose-700">
                    {grandTotals.cancelledOrNoShow}
                  </td>
                  <td className="py-2.5 px-2 text-center font-black text-indigo-800">
                    {grandTotals.patientsSeen}
                  </td>
                  <td className="py-2.5 px-2 text-center font-black">
                    {grandTotals.prescriptions}
                  </td>
                  <td className="py-2.5 px-3 text-right font-black text-slate-900">
                    {formatCurrency(grandTotals.totalBilling)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-black text-emerald-800">
                    {formatCurrency(grandTotals.totalCollection)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-black text-rose-800">
                    {formatCurrency(grandTotals.outstanding)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Signature Blocks */}
          <div className="pt-8 grid grid-cols-3 gap-6 text-center text-xs text-slate-600">
            <div>
              <div className="border-t border-slate-400 pt-2 font-bold text-slate-800">
                Medical Records Officer
              </div>
              <span className="text-[10px] text-slate-400">Data Verification & Entry</span>
            </div>

            <div>
              <div className="border-t border-slate-400 pt-2 font-bold text-slate-800">
                Head of Clinical Operations
              </div>
              <span className="text-[10px] text-slate-400">Clinical Review & Appraisal</span>
            </div>

            <div>
              <div className="border-t border-slate-400 pt-2 font-bold text-slate-800">
                Medical Director / MD
              </div>
              <span className="text-[10px] text-slate-400">Executive Endorsement</span>
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              onClick={() => setIsPrintModalOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Now</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
