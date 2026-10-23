import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Calendar,
  CalendarDays,
  Users,
  Clock,
  CheckCircle2,
  Receipt,
  CreditCard,
  TrendingDown,
  UserPlus,
  CalendarPlus,
  FilePlus,
  PlusCircle,
  Stethoscope,
  Filter,
  Eye,
  Printer,
  ChevronRight,
  TrendingUp,
  History,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useClinic } from '../../context/ClinicContext';
import { KPICard } from '../../components/common/KPICard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency } from '../../utils/currency';
import { formatDate, formatTime, isDateToday } from '../../utils/date';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const {
    patients,
    doctors,
    appointments,
    bills,
    payments,
    expenses,
    updateAppointmentStatus,
    openDocument,
  } = useClinic();

  const [searchParams] = useSearchParams();
  const [dateFilter, setDateFilter] = useState('all'); // 'today' | 'week' | 'all'

  // React to Sub-Tab scroll navigation
  useEffect(() => {
    const section = searchParams.get('section');
    if (section === 'appointments' || section === 'waiting') {
      const el = document.getElementById('appointments-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (section === 'billing') {
      const el = document.getElementById('payments-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (section === 'expenses') {
      const el = document.getElementById('expenses-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (!section) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [searchParams]);

  // Dynamic KPI calculations based on current mock records
  const kpis = useMemo(() => {
    const todayAppointments = appointments.filter((a) => isDateToday(a.date));
    const waitingPatients = appointments.filter(
      (a) => a.status === 'Waiting' || a.status === 'Checked-In'
    );
    const completedToday = todayAppointments.filter((a) => a.status === 'Completed');

    const todayBills = bills.filter((b) => isDateToday(b.billDate));
    const todayBillingAmount = todayBills.reduce((acc, b) => acc + (b.totalAmount || 0), 0);

    const todayCollections = payments.filter((p) => isDateToday(p.paymentDate));
    const todayCollectionAmount = todayCollections.reduce((acc, p) => acc + (p.amount || 0), 0);

    const todayExp = expenses.filter((e) => isDateToday(e.expenseDate));
    const todayExpensesAmount = todayExp.reduce((acc, e) => acc + (e.amount || 0), 0);

    return {
      todayAppointmentsCount: todayAppointments.length,
      waitingPatientsCount: waitingPatients.length,
      completedTodayCount: completedToday.length,
      totalPatientsCount: patients.length,
      todayBilling: todayBillingAmount,
      todayCollection: todayCollectionAmount,
      todayExpenses: todayExpensesAmount,
    };
  }, [appointments, patients, bills, payments, expenses]);

  // Appointment Status distribution data for Pie Chart
  const statusDistributionData = useMemo(() => {
    const counts = {
      'Scheduled': 0,
      'Checked-In / Waiting': 0,
      'In Consultation': 0,
      'Completed': 0,
      'Cancelled / No Show': 0,
    };

    appointments.forEach((apt) => {
      if (apt.status === 'Scheduled') counts['Scheduled']++;
      else if (apt.status === 'Checked-In' || apt.status === 'Waiting') counts['Checked-In / Waiting']++;
      else if (apt.status === 'In Consultation') counts['In Consultation']++;
      else if (apt.status === 'Completed') counts['Completed']++;
      else counts['Cancelled / No Show']++;
    });

    return [
      { name: 'Completed', value: counts['Completed'], color: '#10b981' },
      { name: 'Waiting / Checked In', value: counts['Checked-In / Waiting'], color: '#f59e0b' },
      { name: 'In Consultation', value: counts['In Consultation'], color: '#0ea5e9' },
      { name: 'Scheduled', value: counts['Scheduled'], color: '#6366f1' },
      { name: 'Cancelled / Other', value: counts['Cancelled / No Show'], color: '#f43f5e' },
    ].filter((item) => item.value > 0);
  }, [appointments]);

  // Income vs Expenses Monthly comparison for Bar Chart
  const incomeExpenseData = useMemo(() => {
    return [
      { month: 'Jul', Income: 85000, Expense: 42000 },
      { month: 'Aug', Income: 98000, Expense: 51000 },
      { month: 'Sep', Income: 112000, Expense: 48000 },
      { month: 'Oct (Current)', Income: 135000 + kpis.todayCollection, Expense: 62000 + kpis.todayExpenses },
    ];
  }, [kpis]);

  // Filtered Today's appointments list
  const displayAppointments = useMemo(() => {
    if (dateFilter === 'today') {
      return appointments.filter((a) => isDateToday(a.date));
    }
    return appointments.slice(0, 5);
  }, [appointments, dateFilter]);

  // Recent payments
  const recentPayments = useMemo(() => {
    return [...payments].slice(0, 4);
  }, [payments]);

  // Recent expenses
  const recentExpenses = useMemo(() => {
    return [...expenses].slice(0, 4);
  }, [expenses]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Controls */}
      <div className="relative overflow-hidden bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Ambient background decoration */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-brand-500/10 via-teal-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-700 border border-brand-200/80">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
              OPD Clinical & Financial Overview
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Clinic Master Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Real-time monitor of patient registrations, appointment queues, doctor consultations, billing collections, and operational expenses.
          </p>
        </div>

        {/* Date Filter Pills & Report Shortcut */}
        <div className="relative flex flex-wrap items-center gap-2 self-start md:self-center">
          <button
            type="button"
            onClick={() => navigate('/reports/daily-summary')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 hover:bg-brand-100/80 text-brand-700 border border-brand-200/80 rounded-xl text-xs font-bold shadow-2xs transition-all hover:shadow-xs active:scale-95 cursor-pointer"
            title="Open Complete Daily Clinic Activity Summary Report"
          >
            <CalendarDays className="w-3.5 h-3.5 text-brand-600" />
            <span>Daily Activity Report</span>
            <ArrowRight className="w-3 h-3 text-brand-500" />
          </button>

          <button
            type="button"
            onClick={() => navigate('/activity-log')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold shadow-2xs transition-all hover:shadow-xs active:scale-95 cursor-pointer"
            title="Open Complete System Activity & Audit Trail"
          >
            <History className="w-3.5 h-3.5 text-slate-600" />
            <span>Activity Log</span>
          </button>

          <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/90 shadow-inner">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
            <button
              onClick={() => setDateFilter('today')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${dateFilter === 'today'
                ? 'bg-white text-brand-700 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              Today Only
            </button>
            <button
              onClick={() => setDateFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${dateFilter === 'all'
                ? 'bg-white text-brand-700 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              All Active
            </button>
          </div>
        </div>
      </div>

      {/* 7 KPI Cards (Section 5) - Mobile 2-column grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-2.5 sm:gap-3.5">
        <KPICard
          title="Today's Appts"
          value={kpis.todayAppointmentsCount}
          icon={Calendar}
          subtitle="Scheduled OPD slots"
          trend="+12%"
          trendType="positive"
          iconBg="bg-blue-50 text-blue-600"
          accentColor="border-blue-100 hover:border-blue-300"
          onClick={() => navigate('/appointments')}
        />
        <KPICard
          title="Waiting in OPD"
          value={kpis.waitingPatientsCount}
          icon={Clock}
          subtitle="In reception lobby"
          trend={kpis.waitingPatientsCount > 0 ? "Action required" : "Clear"}
          trendType={kpis.waitingPatientsCount > 0 ? 'negative' : 'positive'}
          iconBg="bg-amber-50 text-amber-600"
          accentColor="border-amber-100 hover:border-amber-300"
          onClick={() => navigate('/appointments')}
        />
        <KPICard
          title="Completed Today"
          value={kpis.completedTodayCount}
          icon={CheckCircle2}
          subtitle="Consulted by doctors"
          trend="On schedule"
          trendType="positive"
          iconBg="bg-emerald-50 text-emerald-600"
          accentColor="border-emerald-100 hover:border-emerald-300"
          onClick={() => navigate('/appointments')}
        />
        <KPICard
          title="Total Patients"
          value={kpis.totalPatientsCount}
          icon={Users}
          subtitle="Registered health records"
          trend="+4 new"
          trendType="positive"
          iconBg="bg-purple-50 text-purple-600"
          accentColor="border-purple-100 hover:border-purple-300"
          onClick={() => navigate('/patients')}
        />
        <KPICard
          title="Today's Billing"
          value={formatCurrency(kpis.todayBilling)}
          icon={Receipt}
          subtitle="Invoices generated"
          trend="Gross charges"
          trendType="neutral"
          iconBg="bg-indigo-50 text-indigo-600"
          accentColor="border-indigo-100 hover:border-indigo-300"
          onClick={() => navigate('/bills')}
        />
        <KPICard
          title="Collections"
          value={formatCurrency(kpis.todayCollection)}
          icon={CreditCard}
          subtitle="Cash & bank received"
          trend="Collected"
          trendType="positive"
          iconBg="bg-teal-50 text-teal-600"
          accentColor="border-teal-100 hover:border-teal-300"
          onClick={() => navigate('/payments')}
        />
        <div className="col-span-2 sm:col-span-1">
          <KPICard
            title="Disbursements"
            value={formatCurrency(kpis.todayExpenses)}
            icon={TrendingDown}
            subtitle="Clinic expenditures"
            trend="Petty & operational"
            trendType="neutral"
            iconBg="bg-rose-50 text-rose-600"
            accentColor="border-rose-100 hover:border-rose-300"
            onClick={() => navigate('/expenses')}
          />
        </div>
      </div>

      {/* Quick Action Navigation Buttons */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-card">
        <div className="flex items-center justify-between mb-3.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Quick Operational Shortcuts
          </span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">1-Click Launch Workflow</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
          <button
            onClick={() => navigate('/patients')}
            className="group flex flex-col sm:flex-row items-center gap-2 sm:gap-3 p-3 rounded-xl border border-slate-200/90 hover:border-brand-300 hover:bg-brand-50/40 text-left transition-all duration-200 shadow-2xs hover:shadow-sm"
          >
            <div className="p-2 rounded-xl bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors flex-shrink-0">
              <UserPlus className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-brand-700 block">
                Add Patient
              </span>
              <span className="text-[10px] text-slate-400 hidden sm:block">Register profile</span>
            </div>
          </button>
          <button
            onClick={() => navigate('/appointments')}
            className="group flex flex-col sm:flex-row items-center gap-2 sm:gap-3 p-3 rounded-xl border border-slate-200/90 hover:border-emerald-300 hover:bg-emerald-50/40 text-left transition-all duration-200 shadow-2xs hover:shadow-sm"
          >
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors flex-shrink-0">
              <CalendarPlus className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 block">
                Book Slot
              </span>
              <span className="text-[10px] text-slate-400 hidden sm:block">OPD queue</span>
            </div>
          </button>
          <button
            onClick={() => navigate('/prescriptions')}
            className="group flex flex-col sm:flex-row items-center gap-2 sm:gap-3 p-3 rounded-xl border border-slate-200/90 hover:border-indigo-300 hover:bg-indigo-50/40 text-left transition-all duration-200 shadow-2xs hover:shadow-sm"
          >
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors flex-shrink-0">
              <Stethoscope className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-700 block">
                Write Rx
              </span>
              <span className="text-[10px] text-slate-400 hidden sm:block">Prescription</span>
            </div>
          </button>
          <button
            onClick={() => navigate('/bills')}
            className="group flex flex-col sm:flex-row items-center gap-2 sm:gap-3 p-3 rounded-xl border border-slate-200/90 hover:border-amber-300 hover:bg-amber-50/40 text-left transition-all duration-200 shadow-2xs hover:shadow-sm"
          >
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors flex-shrink-0">
              <FilePlus className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-amber-700 block">
                Create Bill
              </span>
              <span className="text-[10px] text-slate-400 hidden sm:block">Invoice charges</span>
            </div>
          </button>
          <button
            onClick={() => navigate('/payments')}
            className="group flex flex-col sm:flex-row items-center gap-2 sm:gap-3 p-3 rounded-xl border border-slate-200/90 hover:border-teal-300 hover:bg-teal-50/40 text-left transition-all duration-200 shadow-2xs hover:shadow-sm"
          >
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors flex-shrink-0">
              <CreditCard className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-teal-700 block">
                Take Payment
              </span>
              <span className="text-[10px] text-slate-400 hidden sm:block">Receipt voucher</span>
            </div>
          </button>
          <button
            onClick={() => navigate('/expenses')}
            className="group flex flex-col sm:flex-row items-center gap-2 sm:gap-3 p-3 rounded-xl border border-slate-200/90 hover:border-rose-300 hover:bg-rose-50/40 text-left transition-all duration-200 shadow-2xs hover:shadow-sm"
          >
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors flex-shrink-0">
              <PlusCircle className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-rose-700 block">
                Add Expense
              </span>
              <span className="text-[10px] text-slate-400 hidden sm:block">Record voucher</span>
            </div>
          </button>
        </div>
      </div>

      {/* Visual Analytics Charts: Recharts with min-w-0 for CSS Grid robustness */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointment Status Distribution */}
        <div className="min-w-0 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Appointment Status Distribution
              </h3>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider bg-slate-100 px-2 py-0.5 rounded-full">
                Active Load
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Live breakdown of today's patient clinic workflow.
            </p>
          </div>

          <div className="w-full min-w-0 h-64 mt-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={240}>
              <PieChart>
                <Pie
                  data={statusDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name) => [`${val} Appointments`, name]}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '0.75rem',
                    fontSize: '11px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value) => <span className="text-[11px] text-slate-600 font-medium">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Income vs Expenses Bar Chart */}
        <div className="min-w-0 lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-card flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Cashflow: Revenue vs Operational Costs
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Monthly comparison of OPD billing collections and operational costs.
              </p>
            </div>
            <span className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
              <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
              Net Positive Flow
            </span>
          </div>

          <div className="w-full min-w-0 h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={240}>
              <BarChart data={incomeExpenseData} barGap={8}>
                <defs>
                  <linearGradient id="incomeBarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity={0.8} />
                  </linearGradient>
                  <linearGradient id="expenseBarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#e11d48" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  stroke="#cbd5e1"
                  tickFormatter={(val) => `Rs.${val / 1000}k`}
                />
                <Tooltip
                  formatter={(val, name) => [formatCurrency(val), name]}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '0.75rem',
                    fontSize: '11px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  height={32}
                  formatter={(value) => <span className="text-xs text-slate-700 font-semibold">{value}</span>}
                />
                <Bar dataKey="Income" fill="url(#incomeBarGrad)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Expense" fill="url(#expenseBarGrad)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Today's Appointments Section with Responsive Mobile Cards View */}
      <div id="appointments-section" className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-hidden scroll-mt-28">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                Today's Scheduled Appointments
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200/80">
                {displayAppointments.length} Active
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live consultation queue and patient flow management.
            </p>
          </div>
          <button
            onClick={() => navigate('/appointments')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
          >
            <span>All Appointments</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile View: Clean Interactive Cards (sm:hidden) */}
        <div className="sm:hidden p-3 space-y-3 bg-slate-50/50">
          {displayAppointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-2xs space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-mono font-bold text-xs">
                  {formatTime(apt.time)}
                </span>
                <StatusBadge status={apt.status} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{apt.patientName}</p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">{apt.patientId} • {apt.visitType} Visit</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-700 pt-1 border-t border-slate-100">
                <Stethoscope className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
                <span className="truncate">{apt.doctorName}</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                {apt.status === 'Scheduled' && (
                  <button
                    onClick={() => updateAppointmentStatus(apt.id, 'Checked-In')}
                    className="w-full py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors border border-amber-200/70"
                  >
                    Check-In Patient
                  </button>
                )}
                {apt.status === 'Checked-In' && (
                  <button
                    onClick={() => updateAppointmentStatus(apt.id, 'Waiting')}
                    className="w-full py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200/70"
                  >
                    Mark Waiting
                  </button>
                )}
                {(apt.status === 'Waiting' || apt.status === 'In Consultation') && (
                  <button
                    onClick={() => navigate('/prescriptions')}
                    className="w-full py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200/70"
                  >
                    Consult Now
                  </button>
                )}
                {apt.status === 'Completed' && (
                  <span className="text-slate-400 text-xs italic">Consultation Completed</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop & Tablet View: Structured Table (hidden sm:block) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Patient ID</th>
                <th className="py-3 px-4">Doctor</th>
                <th className="py-3 px-4">Visit Type</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {displayAppointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-brand-50/25 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    <span className="px-2 py-0.5 bg-slate-100 rounded-md font-mono text-[11px]">
                      {formatTime(apt.time)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-[10px] flex-shrink-0">
                        {apt.patientName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <span className="font-bold text-slate-900">{apt.patientName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                    {apt.patientId}
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Stethoscope className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
                      <span>{apt.doctorName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                      {apt.visitType}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={apt.status} />
                  </td>
                  <td className="py-3 px-4 text-right space-x-1.5">
                    {apt.status === 'Scheduled' && (
                      <button
                        onClick={() => updateAppointmentStatus(apt.id, 'Checked-In')}
                        className="px-2.5 py-1 text-[11px] font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors border border-amber-200/80"
                      >
                        Check-In
                      </button>
                    )}
                    {apt.status === 'Checked-In' && (
                      <button
                        onClick={() => updateAppointmentStatus(apt.id, 'Waiting')}
                        className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200/80"
                      >
                        Mark Waiting
                      </button>
                    )}
                    {(apt.status === 'Waiting' || apt.status === 'In Consultation') && (
                      <button
                        onClick={() => navigate('/prescriptions')}
                        className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200/80 shadow-2xs"
                      >
                        Consult Now
                      </button>
                    )}
                    {apt.status === 'Completed' && (
                      <span className="text-slate-400 text-[11px] italic">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity: Payments & Expenses side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payments */}
        <div id="payments-section" className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-hidden flex flex-col justify-between scroll-mt-28">
          <div>
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                    Recent Patient Payments
                  </h3>
                  <p className="text-[11px] text-slate-500">Cashier receipts collected</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/payments')}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700"
              >
                View All
              </button>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {recentPayments.map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="min-w-0 flex-1 mr-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 font-mono">{p.receiptNumber}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 font-medium">
                        {p.paymentMethod}
                      </span>
                    </div>
                    <p className="text-slate-500 mt-0.5 truncate">
                      {p.patientName} • Bill {p.billNumber}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-bold text-emerald-600 text-sm block">
                      +{formatCurrency(p.amount)}
                    </span>
                    <button
                      onClick={() => openDocument('receipt', p)}
                      className="inline-flex items-center gap-1 text-[11px] text-brand-600 hover:underline mt-0.5"
                    >
                      <Printer className="w-3 h-3" />
                      <span>Receipt</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Expenses */}
        <div id="expenses-section" className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-hidden flex flex-col justify-between scroll-mt-28">
          <div>
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                    Recent Clinic Expenses
                  </h3>
                  <p className="text-[11px] text-slate-500">Cash & bank vouchers disbursed</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/expenses')}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700"
              >
                View All
              </button>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {recentExpenses.map((e) => (
                <div
                  key={e.id}
                  className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="min-w-0 flex-1 mr-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 truncate">{e.categoryName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{e.reference}</span>
                    </div>
                    <p className="text-slate-500 truncate mt-0.5">{e.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-bold text-rose-600 text-sm block">
                      -{formatCurrency(e.amount)}
                    </span>
                    <button
                      onClick={() => openDocument('voucher', e)}
                      className="inline-flex items-center gap-1 text-[11px] text-brand-600 hover:underline mt-0.5"
                    >
                      <Printer className="w-3 h-3" />
                      <span>Voucher</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
