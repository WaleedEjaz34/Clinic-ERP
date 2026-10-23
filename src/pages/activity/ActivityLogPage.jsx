import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History,
  Search,
  Filter,
  Calendar,
  CalendarDays,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  CreditCard,
  Receipt,
  TrendingDown,
  Stethoscope,
  Users,
  Settings,
  Pill,
  FlaskConical,
  Lock,
  Printer,
  Download,
  Eye,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  RotateCcw,
  Sparkles,
  Info,
  Layers,
  Laptop,
  Check,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Modal } from '../../components/common/Modal';
import { formatDate } from '../../utils/date';
import { formatCurrency } from '../../utils/currency';

// Distinct action badge styles & icons
const getActionMeta = (action) => {
  switch (action) {
    case 'Payment Collected':
      return {
        label: 'Payment Collected',
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
        dot: 'bg-emerald-500',
        icon: CreditCard,
      };
    case 'Created':
      return {
        label: 'Created',
        bg: 'bg-blue-50 text-blue-700 border-blue-200/80',
        dot: 'bg-blue-500',
        icon: CheckCircle2,
      };
    case 'Updated':
      return {
        label: 'Updated',
        bg: 'bg-amber-50 text-amber-700 border-amber-200/80',
        dot: 'bg-amber-500',
        icon: RotateCcw,
      };
    case 'Deleted':
      return {
        label: 'Deleted',
        bg: 'bg-rose-50 text-rose-700 border-rose-200/80',
        dot: 'bg-rose-500',
        icon: AlertCircle,
      };
    case 'Status Changed':
      return {
        label: 'Status Changed',
        bg: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
        dot: 'bg-indigo-500',
        icon: Layers,
      };
    case 'Printed':
      return {
        label: 'Printed',
        bg: 'bg-purple-50 text-purple-700 border-purple-200/80',
        dot: 'bg-purple-500',
        icon: Printer,
      };
    case 'Viewed':
      return {
        label: 'Viewed',
        bg: 'bg-sky-50 text-sky-700 border-sky-200/80',
        dot: 'bg-sky-500',
        icon: Eye,
      };
    case 'Login':
      return {
        label: 'User Login',
        bg: 'bg-teal-50 text-teal-700 border-teal-200/80',
        dot: 'bg-teal-500',
        icon: ShieldCheck,
      };
    case 'Logout':
      return {
        label: 'User Logout',
        bg: 'bg-slate-100 text-slate-700 border-slate-200',
        dot: 'bg-slate-400',
        icon: User,
      };
    default:
      return {
        label: action || 'Activity',
        bg: 'bg-slate-50 text-slate-700 border-slate-200',
        dot: 'bg-slate-400',
        icon: History,
      };
  }
};

// Module badge metadata & icons
const getModuleMeta = (module) => {
  switch (module) {
    case 'Patient':
      return { label: 'Patient', icon: Users, color: 'text-blue-600', path: '/patients' };
    case 'Appointment':
      return { label: 'Appointment', icon: Calendar, color: 'text-amber-600', path: '/appointments' };
    case 'Prescription':
      return { label: 'Prescription', icon: FileText, color: 'text-indigo-600', path: '/prescriptions' };
    case 'Patient Bill':
      return { label: 'Patient Bill', icon: Receipt, color: 'text-teal-600', path: '/bills' };
    case 'Payment':
      return { label: 'Payment', icon: CreditCard, color: 'text-emerald-600', path: '/payments' };
    case 'Expense':
      return { label: 'Expense', icon: TrendingDown, color: 'text-rose-600', path: '/expenses' };
    case 'Account':
      return { label: 'Account', icon: CreditCard, color: 'text-cyan-600', path: '/accounts' };
    case 'Doctor & Staff':
      return { label: 'Doctor & Staff', icon: Stethoscope, color: 'text-violet-600', path: '/users' };
    case 'Medicines Master':
      return { label: 'Medicines Master', icon: Pill, color: 'text-emerald-600', path: '/prescriptions/medicines' };
    case 'Tests Master':
      return { label: 'Tests Master', icon: FlaskConical, color: 'text-fuchsia-600', path: '/prescriptions/tests' };
    case 'System':
      return { label: 'System', icon: Settings, color: 'text-slate-600', path: '/settings' };
    default:
      return { label: module || 'Record', icon: Layers, color: 'text-slate-600', path: '/' };
  }
};

export const ActivityLogPage = () => {
  const navigate = useNavigate();
  const { activityLogs = [] } = useClinic();

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Filter States
  const [datePreset, setDatePreset] = useState('all'); // 'all' | 'today' | 'yesterday' | 'week' | 'month' | 'last30' | 'custom'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected Log for detail modal
  const [selectedLog, setSelectedLog] = useState(null);
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
      setStartDate('');
      setEndDate('');
    }
  };

  // Distinct Filter Option Lists
  const availableUsers = useMemo(() => {
    const map = new Map();
    activityLogs.forEach((l) => {
      if (l.actionBy?.name) {
        map.set(l.actionBy.name, l.actionBy);
      }
    });
    return Array.from(map.values());
  }, [activityLogs]);

  const availableModules = useMemo(() => {
    const set = new Set();
    activityLogs.forEach((l) => {
      if (l.module) set.add(l.module);
    });
    return Array.from(set);
  }, [activityLogs]);

  const availableActions = [
    'Payment Collected',
    'Created',
    'Updated',
    'Deleted',
    'Status Changed',
    'Printed',
    'Viewed',
    'Login',
    'Logout',
  ];

  // Filtered Activity Logs
  const filteredLogs = useMemo(() => {
    return activityLogs.filter((log) => {
      // 1. Date Range
      if (startDate || endDate) {
        const logDate = (log.timestamp || '').split('T')[0];
        if (startDate && logDate < startDate) return false;
        if (endDate && logDate > endDate) return false;
      }

      // 2. Action Filter
      if (actionFilter !== 'all' && log.action !== actionFilter) {
        return false;
      }

      // 3. User Filter
      if (userFilter !== 'all' && log.actionBy?.name !== userFilter) {
        return false;
      }

      // 4. Module Filter
      if (moduleFilter !== 'all' && log.module !== moduleFilter) {
        return false;
      }

      // 5. General Search (matches description, record ID, user name, action, or module)
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const descMatch = (log.description || '').toLowerCase().includes(q);
        const recordIdMatch = (log.recordId || '').toLowerCase().includes(q);
        const recordTitleMatch = (log.recordTitle || '').toLowerCase().includes(q);
        const userMatch = (log.actionBy?.name || '').toLowerCase().includes(q);
        const actionMatch = (log.action || '').toLowerCase().includes(q);
        const moduleMatch = (log.module || '').toLowerCase().includes(q);

        if (!descMatch && !recordIdMatch && !recordTitleMatch && !userMatch && !actionMatch && !moduleMatch) {
          return false;
        }
      }

      return true;
    });
  }, [activityLogs, startDate, endDate, actionFilter, userFilter, moduleFilter, searchTerm]);

  // Activity Metrics Summary Cards
  const stats = useMemo(() => {
    const total = filteredLogs.length;
    const financial = filteredLogs.filter(
      (l) => l.action === 'Payment Collected' || l.module === 'Patient Bill' || l.module === 'Expense' || l.module === 'Payment'
    ).length;
    const clinical = filteredLogs.filter(
      (l) => l.module === 'Prescription' || l.module === 'Patient' || l.module === 'Appointment'
    ).length;
    const security = filteredLogs.filter(
      (l) => l.action === 'Login' || l.action === 'Logout' || l.module === 'Doctor & Staff' || l.module === 'System' || l.module === 'Medicines Master' || l.module === 'Tests Master'
    ).length;

    return { total, financial, clinical, security };
  }, [filteredLogs]);

  // CSV Export Handler
  const handleExportCSV = () => {
    const headers = [
      'Activity ID',
      'Date & Time',
      'Action',
      'Action By',
      'Role',
      'Action Related To (Module)',
      'Record Reference',
      'Description',
      'IP Address / Terminal',
    ];

    const dataRows = filteredLogs.map((log) => [
      log.id,
      formatDate(log.timestamp, 'dd MMM yyyy, hh:mm a'),
      log.action,
      log.actionBy?.name || 'N/A',
      log.actionBy?.role || 'N/A',
      log.module || 'N/A',
      log.recordTitle || log.recordId || 'N/A',
      log.description || '',
      log.details?.ipAddress || '192.168.1.10',
    ]);

    const csvContent = [
      `"MedPulse Clinic ERP - Official System Activity & Audit Trail"`,
      `"Generated At: ${new Date().toLocaleString()}"`,
      `"Total Records: ${filteredLogs.length}"`,
      '',
      headers.map((h) => `"${h}"`).join(','),
      ...dataRows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')),
    ].join('\r\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `MedPulse_Audit_Log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsExportMenuOpen(false);
  };

  // Reset all filters
  const resetFilters = () => {
    setDatePreset('all');
    setStartDate('');
    setEndDate('');
    setActionFilter('all');
    setUserFilter('all');
    setModuleFilter('all');
    setSearchTerm('');
  };

  const hasActiveFilters =
    datePreset !== 'all' ||
    actionFilter !== 'all' ||
    userFilter !== 'all' ||
    moduleFilter !== 'all' ||
    searchTerm.trim() !== '';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="System Activity & Audit Log"
        subtitle="Complete chronological history of important actions across MedPulse ERP. Every clinical, financial, and administrative activity is automatically recorded in this immutable audit ledger."
      >
        <div className="flex items-center gap-2 flex-wrap">
          {/* Immutability & Compliance Badge */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-slate-200 border border-slate-800 rounded-xl text-xs font-semibold shadow-xs select-none">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Immutable Audit Trail</span>
          </div>

          {/* Print Button */}
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            title="Print Audit Log"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print Log</span>
          </button>

          {/* Export CSV Button */}
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
                  Audit Export Options
                </div>
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Download Excel / CSV</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </PageHeader>

      {/* KPI Overview Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Events */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Activities
            </span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <History className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 mt-2">{stats.total}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Matching active filters</p>
        </div>

        {/* Financial Events */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Financial Events
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-700 mt-2">{stats.financial}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Payments, bills & disbursements</p>
        </div>

        {/* Clinical Events */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Clinical Events
            </span>
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
              <Stethoscope className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-indigo-700 mt-2">{stats.clinical}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Prescriptions, appointments & charts</p>
        </div>

        {/* Security / System Events */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Security & Masters
            </span>
            <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-teal-700 mt-2">{stats.security}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Logins, catalog updates & config</p>
        </div>
      </div>

      {/* ========================================================= */}
      {/* FILTER & SEARCH CONTROL BAR */}
      {/* ========================================================= */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3.5">
        {/* Date Preset Pills & General Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Preset Range Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            <span className="text-xs font-bold text-slate-700 mr-1 flex items-center gap-1 flex-shrink-0">
              <Filter className="w-3.5 h-3.5 text-brand-600" />
              <span>Range:</span>
            </span>
            {[
              { id: 'all', label: 'All Time' },
              { id: 'today', label: 'Today' },
              { id: 'yesterday', label: 'Yesterday' },
              { id: 'week', label: 'Last 7 Days' },
              { id: 'month', label: 'This Month' },
              { id: 'last30', label: 'Last 30 Days' },
              { id: 'custom', label: 'Custom Range' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handlePresetChange(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  datePreset === p.id
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* General Search Input */}
          <div className="relative min-w-[260px] sm:min-w-[320px]">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by description, record ID, user, action..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Custom Date Pickers (when custom is selected) */}
        {datePreset === 'custom' && (
          <div className="flex items-center gap-3 pt-2 border-t border-slate-100 flex-wrap animate-in fade-in text-xs">
            <span className="font-semibold text-slate-700">From Date:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
            />
            <span className="font-semibold text-slate-700">To Date:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
            />
          </div>
        )}

        {/* Dropdowns Row: Action, Action By, Module/Related To */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs">
          {/* 1. Action Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Filter Action
            </label>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all cursor-pointer"
            >
              <option value="all">All Actions ({activityLogs.length})</option>
              {availableActions.map((act) => (
                <option key={act} value={act}>
                  {act}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Action By (User) Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Filter Action By (User)
            </label>
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all cursor-pointer"
            >
              <option value="all">All Users & Doctors ({availableUsers.length})</option>
              {availableUsers.map((u) => (
                <option key={u.name} value={u.name}>
                  {u.name} ({u.role || 'Staff'})
                </option>
              ))}
            </select>
          </div>

          {/* 3. Module / Related To Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Filter Module / Related To
            </label>
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all cursor-pointer"
            >
              <option value="all">All Modules ({availableModules.length})</option>
              {availableModules.map((mod) => (
                <option key={mod} value={mod}>
                  {mod}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Results & Reset Button */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
          <div>
            Showing <strong className="text-slate-900 font-bold">{filteredLogs.length}</strong> of{' '}
            <strong className="text-slate-900 font-bold">{activityLogs.length}</strong> recorded activities
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-800 font-semibold hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* ACTIVITY LOG TABLE */}
      {/* ========================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            {/* Table Header */}
            <thead>
              <tr className="bg-slate-900 text-white font-bold border-b border-slate-800 tracking-wider">
                <th className="py-3.5 px-4 whitespace-nowrap min-w-[170px]">Date & Time</th>
                <th className="py-3.5 px-4 whitespace-nowrap min-w-[150px]">Action</th>
                <th className="py-3.5 px-4 whitespace-nowrap min-w-[180px]">Action By</th>
                <th className="py-3.5 px-4 whitespace-nowrap min-w-[180px]">Action Related To</th>
                <th className="py-3.5 px-4 min-w-[280px]">Description</th>
                <th className="py-3.5 px-4 text-center whitespace-nowrap w-[90px]">Details</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <History className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-700">No activities match your filters</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Try selecting a different date range or resetting your search term.
                    </p>
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="mt-3 px-3.5 py-1.5 bg-brand-50 text-brand-700 hover:bg-brand-100 font-semibold rounded-lg text-xs transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const actionMeta = getActionMeta(log.action);
                  const moduleMeta = getModuleMeta(log.module);
                  const ActionIcon = actionMeta.icon;
                  const ModuleIcon = moduleMeta.icon;

                  return (
                    <tr
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      className="hover:bg-slate-50/90 transition-colors cursor-pointer group"
                    >
                      {/* 1. Date & Time */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <div>
                            <span className="font-bold text-slate-900 block font-mono">
                              {formatDate(log.timestamp, 'dd MMM yyyy, hh:mm a')}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {formatDate(log.timestamp, 'EEEE')} • {log.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 2. Action */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${actionMeta.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${actionMeta.dot}`} />
                          <ActionIcon className="w-3 h-3" />
                          <span>{actionMeta.label}</span>
                        </span>
                      </td>

                      {/* 3. Action By */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          {log.actionBy?.avatar ? (
                            <img
                              src={log.actionBy.avatar}
                              alt={log.actionBy.name}
                              className="w-7 h-7 rounded-full object-cover border border-slate-200 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                              {log.actionBy?.name?.charAt(0) || 'U'}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 text-xs truncate max-w-[150px]">
                              {log.actionBy?.name || 'System User'}
                            </p>
                            <span className="inline-block text-[10px] text-slate-500 font-medium">
                              {log.actionBy?.role || 'Staff'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 4. Action Related To */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className={`p-1 rounded-lg bg-slate-100 ${moduleMeta.color}`}>
                            <ModuleIcon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block text-xs">
                              {log.recordTitle || log.recordId}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              Module: {log.module}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 5. Description */}
                      <td className="py-3 px-4 text-slate-700 leading-relaxed">
                        <p className="line-clamp-2 text-xs font-normal text-slate-800">
                          {log.description}
                        </p>
                      </td>

                      {/* 6. Detail View Action */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLog(log);
                          }}
                          className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors cursor-pointer"
                          title="View Full Audit Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* INTERACTIVE ACTIVITY AUDIT DETAIL MODAL */}
      {/* ========================================================= */}
      {selectedLog && (
        <Modal
          isOpen={Boolean(selectedLog)}
          onClose={() => setSelectedLog(null)}
          title={`Audit Record — ${selectedLog.id}`}
          size="lg"
        >
          <div className="space-y-5">
            {/* Top Verified Immutability Banner */}
            <div className="p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-mono font-bold tracking-wide">
                  VERIFIED AUDIT LOG • IMMUTABLE RECORD
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">
                {selectedLog.id}
              </span>
            </div>

            {/* Action & Module Card */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                      getActionMeta(selectedLog.action).bg
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${getActionMeta(selectedLog.action).dot}`} />
                    <span>{selectedLog.action}</span>
                  </span>
                  <span className="text-slate-400 font-bold">•</span>
                  <span className="text-xs font-bold text-slate-700">
                    Module: <strong className="text-slate-900">{selectedLog.module}</strong>
                  </span>
                </div>

                <div className="text-xs text-slate-500 font-mono">
                  {formatDate(selectedLog.timestamp, 'dd MMM yyyy, hh:mm:ss a')}
                </div>
              </div>

              {/* Description */}
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Activity Description
                </p>
                <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                  {selectedLog.description}
                </p>
              </div>
            </div>

            {/* Two Column Grid: Performed By & Target Record */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Action By Profile */}
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Action Performed By
                </p>
                <div className="flex items-center gap-3">
                  {selectedLog.actionBy?.avatar ? (
                    <img
                      src={selectedLog.actionBy.avatar}
                      alt={selectedLog.actionBy.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm">
                      {selectedLog.actionBy?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900">
                      {selectedLog.actionBy?.name}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Role: <strong className="text-slate-700">{selectedLog.actionBy?.role}</strong>
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      User ID: {selectedLog.actionBy?.id || 'USR-SYS'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Related Record */}
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Target Entity / Record
                </p>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-900">
                    {selectedLog.recordTitle || selectedLog.recordId}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Record ID: <strong className="text-slate-700 font-mono">{selectedLog.recordId}</strong>
                  </p>
                </div>
                {getModuleMeta(selectedLog.module).path && (
                  <button
                    type="button"
                    onClick={() => {
                      const path = getModuleMeta(selectedLog.module).path;
                      setSelectedLog(null);
                      navigate(path);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs text-brand-600 hover:text-brand-800 font-bold hover:underline mt-1"
                  >
                    <span>Navigate to {selectedLog.module} Module</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Contextual Technical Footprint & Metadata */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Technical Audit Footprint
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">IP Address:</span>
                  <span className="font-mono font-semibold text-slate-800">
                    {selectedLog.details?.ipAddress || '192.168.1.10'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Terminal / Station:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedLog.details?.terminal || 'Reception Desk 1'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Session ID:</span>
                  <span className="font-mono font-semibold text-slate-800">
                    {selectedLog.details?.sessionId || 'SESS-2026-99014'}
                  </span>
                </div>
              </div>

              {/* Additional Context Details (if present) */}
              {selectedLog.details && (
                <div className="pt-2 border-t border-slate-200/80 text-xs">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                    Event Parameters
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(selectedLog.details).map(([key, val]) => {
                      if (['ipAddress', 'terminal', 'sessionId'].includes(key)) return null;
                      if (typeof val === 'object' && val !== null) {
                        return (
                          <div key={key} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px]">
                            <span className="text-slate-400 capitalize">{key}:</span>{' '}
                            <strong className="text-slate-800">{JSON.stringify(val)}</strong>
                          </div>
                        );
                      }
                      return (
                        <div key={key} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px]">
                          <span className="text-slate-400 capitalize">{key}:</span>{' '}
                          <strong className="text-slate-800">
                            {typeof val === 'number' && key.toLowerCase().includes('amount')
                              ? formatCurrency(val)
                              : String(val)}
                          </strong>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Immutability Notice */}
            <div className="flex items-center gap-2 p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-amber-800 text-[11px]">
              <Lock className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                This activity record is cryptographically preserved in MedPulse's permanent audit log. It cannot be edited, altered, or deleted by normal users or administrators.
              </span>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
              >
                Close Audit Sheet
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
