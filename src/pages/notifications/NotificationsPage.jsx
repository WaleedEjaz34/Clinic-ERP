import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Check,
  CheckCheck,
  RotateCcw,
  Trash2,
  Filter,
  Search,
  Calendar,
  Users,
  FileText,
  Receipt,
  CreditCard,
  TrendingDown,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Inbox,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { KPICard } from '../../components/common/KPICard';
import { SearchableSelect } from '../../components/common/SearchableSelect';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';

export const NotificationsPage = () => {
  const navigate = useNavigate();
  const {
    notifications,
    unreadNotifCount,
    markNotificationAsRead,
    markNotificationAsUnread,
    markAllNotificationsAsRead,
    deleteNotification,
    clearAllNotifications,
    addToast,
  } = useClinic();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'unread' | 'read'
  const [typeFilter, setTypeFilter] = useState('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Type configuration
  const typeOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'patient', label: 'Patient Updates' },
    { value: 'appointment', label: 'Appointments & OPD' },
    { value: 'prescription', label: 'Prescriptions & Rx' },
    { value: 'billing', label: 'Invoices & Billing' },
    { value: 'payment', label: 'Payment Receipts' },
    { value: 'expense', label: 'Expenses & Cash' },
    { value: 'system', label: 'System & Security' },
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'patient': return Users;
      case 'appointment': return Calendar;
      case 'prescription': return FileText;
      case 'billing': return Receipt;
      case 'payment': return CreditCard;
      case 'expense': return TrendingDown;
      default: return Bell;
    }
  };

  const getNotificationStyle = (type) => {
    switch (type) {
      case 'patient':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200/80',
          text: 'text-blue-700',
          chipBg: 'bg-blue-100/70',
          label: 'Patient',
        };
      case 'appointment':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200/80',
          text: 'text-amber-700',
          chipBg: 'bg-amber-100/70',
          label: 'Appointment',
        };
      case 'prescription':
        return {
          bg: 'bg-indigo-50',
          border: 'border-indigo-200/80',
          text: 'text-indigo-700',
          chipBg: 'bg-indigo-100/70',
          label: 'Prescription',
        };
      case 'billing':
        return {
          bg: 'bg-purple-50',
          border: 'border-purple-200/80',
          text: 'text-purple-700',
          chipBg: 'bg-purple-100/70',
          label: 'Billing',
        };
      case 'payment':
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-200/80',
          text: 'text-emerald-700',
          chipBg: 'bg-emerald-100/70',
          label: 'Payment',
        };
      case 'expense':
        return {
          bg: 'bg-rose-50',
          border: 'border-rose-200/80',
          text: 'text-rose-700',
          chipBg: 'bg-rose-100/70',
          label: 'Expense',
        };
      default:
        return {
          bg: 'bg-slate-50',
          border: 'border-slate-200/80',
          text: 'text-slate-700',
          chipBg: 'bg-slate-200/70',
          label: 'Alert',
        };
    }
  };

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      // Status filter
      if (statusFilter === 'unread' && item.read) return false;
      if (statusFilter === 'read' && !item.read) return false;

      // Type filter
      if (typeFilter !== 'all' && item.type !== typeFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title?.toLowerCase().includes(q);
        const matchesMessage = item.message?.toLowerCase().includes(q);
        const matchesType = item.type?.toLowerCase().includes(q);
        return matchesTitle || matchesMessage || matchesType;
      }

      return true;
    });
  }, [notifications, statusFilter, typeFilter, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = notifications.length;
    const unread = unreadNotifCount;
    const clinical = notifications.filter((n) =>
      ['patient', 'appointment', 'prescription'].includes(n.type)
    ).length;
    const financial = notifications.filter((n) =>
      ['billing', 'payment', 'expense'].includes(n.type)
    ).length;
    return { total, unread, clinical, financial };
  }, [notifications, unreadNotifCount]);

  const handleActionClick = (notification) => {
    if (!notification.read) {
      markNotificationAsRead(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Clinic Alerts & Notifications
            </h1>
            {unreadNotifCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white shadow-xs">
                {unreadNotifCount} unread
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time feed of clinic appointments, OPD queue, financial receipts, prescriptions, and system alerts.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {unreadNotifCount > 0 && (
            <button
              onClick={() => markAllNotificationsAsRead()}
              className="flex items-center gap-1.5 px-3 py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 rounded-xl text-xs font-semibold transition-all shadow-2xs hover:shadow-xs active:scale-95"
            >
              <CheckCheck className="w-4 h-4 stroke-[2.2]" />
              <span>Mark All Read</span>
            </button>
          )}

          {notifications.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded-xl text-xs font-semibold transition-all shadow-2xs hover:shadow-xs active:scale-95"
            >
              <Trash2 className="w-4 h-4 stroke-[2]" />
              <span>Clear Log</span>
            </button>
          )}
        </div>
      </div>

      {/* ================= STATS OVERVIEW ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KPICard
          title="Total Alerts"
          value={stats.total}
          subtitle="All logged records"
          icon={Bell}
          color="brand"
        />
        <KPICard
          title="Pending Unread"
          value={stats.unread}
          subtitle="Requires attention"
          icon={AlertCircle}
          color={stats.unread > 0 ? 'rose' : 'emerald'}
        />
        <KPICard
          title="Clinical Updates"
          value={stats.clinical}
          subtitle="Patients, Appts, Rx"
          icon={Calendar}
          color="indigo"
        />
        <KPICard
          title="Financial Alerts"
          value={stats.financial}
          subtitle="Bills, Receipts, Expenses"
          icon={Receipt}
          color="amber"
        />
      </div>

      {/* ================= CONTROLS & FILTERS ================= */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl overflow-x-auto no-scrollbar self-start md:self-auto">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Alerts ({notifications.length})
            </button>
            <button
              onClick={() => setStatusFilter('unread')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                statusFilter === 'unread'
                  ? 'bg-white text-rose-600 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Unread</span>
              {unreadNotifCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>
            <button
              onClick={() => setStatusFilter('read')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                statusFilter === 'read'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Read ({notifications.length - unreadNotifCount})
            </button>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 md:max-w-xl md:justify-end">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search alerts by title, patient, or text..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              />
            </div>

            {/* Category Select */}
            <div className="w-full sm:w-48">
              <SearchableSelect
                value={typeFilter}
                onChange={setTypeFilter}
                options={typeOptions}
                placeholder="All Categories"
              />
            </div>
          </div>
        </div>

        {/* ================= NOTIFICATIONS LIST ================= */}
        {filteredNotifications.length === 0 ? (
          <div className="py-16 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Inbox className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No Notifications Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              {searchQuery || typeFilter !== 'all' || statusFilter !== 'all'
                ? 'No alerts match your current search and filter criteria. Try resetting your filters.'
                : 'Your clinic log is clear! New appointments, prescriptions, payments, and system notices will appear here automatically.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notif) => {
              const Icon = getNotificationIcon(notif.type);
              const style = getNotificationStyle(notif.type);

              return (
                <div
                  key={notif.id}
                  className={`p-4 rounded-2xl border transition-all duration-150 flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                    !notif.read
                      ? 'bg-gradient-to-r from-brand-50/40 via-white to-white border-brand-200/90 shadow-2xs ring-1 ring-brand-500/10'
                      : 'bg-white hover:bg-slate-50/70 border-slate-200 shadow-2xs'
                  }`}
                >
                  {/* Left: Icon & Details */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 border shadow-2xs ${style.bg} ${style.border}`}
                    >
                      <Icon className={`w-5 h-5 ${style.text}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${style.chipBg} ${style.text}`}
                        >
                          {style.label}
                        </span>

                        {!notif.read ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200/80">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                            Unread
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500">
                            <Check className="w-2.5 h-2.5" />
                            Read
                          </span>
                        )}

                        <span className="text-[11px] text-slate-400 ml-auto whitespace-nowrap">
                          {notif.timestamp}
                        </span>
                      </div>

                      <h3
                        className={`text-sm font-bold ${
                          !notif.read ? 'text-slate-900' : 'text-slate-700'
                        }`}
                      >
                        {notif.title}
                      </h3>

                      <p className="text-xs text-slate-600 mt-1 leading-relaxed break-words">
                        {notif.message}
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 w-full sm:w-auto justify-end">
                    {notif.link && (
                      <button
                        onClick={() => handleActionClick(notif)}
                        className="px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs hover:shadow-xs active:scale-95"
                      >
                        <span>{notif.actionText || 'Open'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {!notif.read ? (
                      <button
                        onClick={() => markNotificationAsRead(notif.id)}
                        className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Mark as Read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => markNotificationAsUnread(notif.id)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Mark as Unread"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => deleteNotification(notif.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Notification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmation Dialog for Clear Log */}
      <ConfirmationDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={() => {
          clearAllNotifications();
          setShowClearConfirm(false);
        }}
        title="Clear All Notifications"
        message="Are you sure you want to clear all notifications from your clinic activity log? This cannot be undone."
        confirmText="Clear All"
        confirmVariant="danger"
      />
    </div>
  );
};
