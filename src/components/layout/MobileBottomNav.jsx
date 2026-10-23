import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Plus,
  Menu,
  X,
  FileText,
  Receipt,
  CreditCard,
  TrendingDown,
  Landmark,
  Layers,
  ShieldCheck,
  Settings,
  Stethoscope,
  RotateCcw,
  UserPlus,
  FilePlus,
  Coins,
  ChevronRight,
  Bell,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { SearchableSelect } from '../common/SearchableSelect';

export const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, switchRole, resetAllData, addToast, unreadNotifCount } = useClinic();

  const [showQuickSheet, setShowQuickSheet] = useState(false);
  const [showMoreSheet, setShowMoreSheet] = useState(false);

  const roles = ['Admin', 'Doctor', 'Receptionist', 'Accountant'];

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleActionClick = (path) => {
    navigate(path);
    setShowQuickSheet(false);
    setShowMoreSheet(false);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo records back to initial defaults?')) {
      resetAllData();
      addToast('success', 'Data Restored', 'Demo records restored to defaults.');
      setShowMoreSheet(false);
    }
  };

  return (
    <>
      {/* ================= STICKY BOTTOM NAVIGATION BAR ================= */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] md:hidden select-none pb-safe"
      >
        <div className="grid grid-cols-5 items-center h-16 px-1.5 max-w-md mx-auto">
          {/* 1. Dashboard Tab */}
          <NavLink
            to="/"
            end
            onClick={() => {
              setShowQuickSheet(false);
              setShowMoreSheet(false);
            }}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-150 ${
                isActive
                  ? 'text-brand-600 font-bold'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`
            }
          >
            <div className={`p-1 rounded-lg ${isActive('/', true) ? 'bg-brand-50' : ''}`}>
              <LayoutDashboard className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Home</span>
          </NavLink>

          {/* 2. Patients Tab */}
          <NavLink
            to="/patients"
            onClick={() => {
              setShowQuickSheet(false);
              setShowMoreSheet(false);
            }}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-150 ${
                isActive
                  ? 'text-brand-600 font-bold'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`
            }
          >
            <div className={`p-1 rounded-lg ${isActive('/patients') ? 'bg-brand-50' : ''}`}>
              <Users className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Patients</span>
          </NavLink>

          {/* 3. Center Floating Action (+) Button */}
          <div className="flex flex-col items-center justify-center -mt-5">
            <button
              type="button"
              onClick={() => {
                setShowQuickSheet(!showQuickSheet);
                setShowMoreSheet(false);
              }}
              aria-label="Create Quick Action"
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-200 border-2 border-white active:scale-95 ${
                showQuickSheet
                  ? 'bg-slate-900 text-white rotate-45 shadow-slate-900/30'
                  : 'bg-gradient-to-tr from-brand-700 via-brand-600 to-teal-500 text-white shadow-brand-500/35 hover:scale-105'
              }`}
            >
              <Plus className="w-6 h-6 stroke-[2.6]" />
            </button>
            <span className="text-[10px] mt-1 font-bold text-slate-700 tracking-tight">
              Action
            </span>
          </div>

          {/* 4. Appointments Tab */}
          <NavLink
            to="/appointments"
            onClick={() => {
              setShowQuickSheet(false);
              setShowMoreSheet(false);
            }}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-150 ${
                isActive
                  ? 'text-brand-600 font-bold'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`
            }
          >
            <div className={`p-1 rounded-lg ${isActive('/appointments') ? 'bg-brand-50' : ''}`}>
              <Calendar className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Appts</span>
          </NavLink>

          {/* 5. More Menu Tab */}
          <button
            type="button"
            onClick={() => {
              setShowMoreSheet(!showMoreSheet);
              setShowQuickSheet(false);
            }}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-150 ${
              showMoreSheet ||
              isActive('/prescriptions') ||
              isActive('/bills') ||
              isActive('/payments') ||
              isActive('/expenses') ||
              isActive('/accounts') ||
              isActive('/chart-of-accounts') ||
              isActive('/users') ||
              isActive('/doctors') ||
              isActive('/settings')
                ? 'text-brand-600 font-bold'
                : 'text-slate-500 hover:text-slate-900 font-medium'
            }`}
          >
            <div
              className={`p-1 rounded-lg ${
                showMoreSheet ? 'bg-brand-50' : ''
              }`}
            >
              <Menu className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">More</span>
          </button>
        </div>
      </nav>

      {/* ================= QUICK ACTION BOTTOM SHEET ================= */}
      {showQuickSheet && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          {/* Dimmed backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowQuickSheet(false)}
          />

          {/* Sheet Panel */}
          <div className="relative bg-white rounded-t-3xl border-t border-slate-200 shadow-2xl p-5 pb-8 space-y-4 animate-in slide-in-from-bottom duration-200 z-10 max-h-[85vh] overflow-y-auto">
            {/* Grab handle */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto" />

            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Quick Actions</h3>
                <p className="text-xs text-slate-500">Tap any frequent clinical or billing action</p>
              </div>
              <button
                type="button"
                onClick={() => setShowQuickSheet(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleActionClick('/patients?action=new')}
                className="flex items-center gap-3 p-3 rounded-2xl bg-brand-50/80 border border-brand-200/90 text-left hover:bg-brand-100 transition-colors shadow-2xs"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-brand-900 block leading-tight">
                    Add Patient
                  </span>
                  <span className="text-[10px] text-brand-700">New registration</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleActionClick('/appointments?action=new')}
                className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 text-left hover:bg-emerald-100 transition-colors shadow-2xs"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-emerald-900 block leading-tight">
                    Book Appt
                  </span>
                  <span className="text-[10px] text-emerald-700">Schedule slot</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleActionClick('/prescriptions?action=new')}
                className="flex items-center gap-3 p-3 rounded-2xl bg-indigo-50/80 border border-indigo-200/90 text-left hover:bg-indigo-100 transition-colors shadow-2xs"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <FilePlus className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-indigo-900 block leading-tight">
                    Write Rx
                  </span>
                  <span className="text-[10px] text-indigo-700">Prescription note</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleActionClick('/bills?action=new')}
                className="flex items-center gap-3 p-3 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-left hover:bg-amber-100 transition-colors shadow-2xs"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Receipt className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-amber-900 block leading-tight">
                    Create Bill
                  </span>
                  <span className="text-[10px] text-amber-700">Patient invoice</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleActionClick('/payments?action=new')}
                className="flex items-center gap-3 p-3 rounded-2xl bg-teal-50/80 border border-teal-200/90 text-left hover:bg-teal-100 transition-colors shadow-2xs"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-teal-900 block leading-tight">
                    Collect Dues
                  </span>
                  <span className="text-[10px] text-teal-700">Receive payment</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleActionClick('/expenses?action=new')}
                className="flex items-center gap-3 p-3 rounded-2xl bg-rose-50/80 border border-rose-200/90 text-left hover:bg-rose-100 transition-colors shadow-2xs"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-rose-900 block leading-tight">
                    Add Expense
                  </span>
                  <span className="text-[10px] text-rose-700">Disbursement</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MORE MODULES BOTTOM SHEET ================= */}
      {showMoreSheet && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          {/* Dimmed backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowMoreSheet(false)}
          />

          {/* Sheet Panel */}
          <div className="relative bg-white rounded-t-3xl border-t border-slate-200 shadow-2xl p-4 sm:p-5 pb-8 space-y-4 animate-in slide-in-from-bottom duration-200 z-10 max-h-[88vh] overflow-y-auto">
            {/* Grab handle */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto" />

            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">{currentUser.name}</span>
                  <span className="text-[10px] font-semibold text-brand-600 uppercase tracking-wider">
                    {currentUser.role}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowMoreSheet(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Switch Role selector */}
            <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-700">Simulate Role:</span>
              <div className="w-40">
                <SearchableSelect
                  value={currentUser.role}
                  onChange={(e) => switchRole(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-800"
                  searchPlaceholder="Role..."
                  placement="top"
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </SearchableSelect>
              </div>
            </div>

            {/* Navigation Grid by Modules */}
            <div className="space-y-3">
              {/* Prescriptions */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1 mb-1.5">
                  Clinical Consultations
                </span>
                <button
                  type="button"
                  onClick={() => handleActionClick('/prescriptions')}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <span className="text-xs font-bold text-slate-900 block">Prescriptions</span>
                      <span className="text-[10px] text-slate-500">Rx consultations, notes & print</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Finance Section */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1 mb-1.5">
                  Finance & Cash Flow
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleActionClick('/bills')}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-left"
                  >
                    <Receipt className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Patient Bills</span>
                      <span className="text-[10px] text-slate-400">Invoices & dues</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleActionClick('/payments')}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-left"
                  >
                    <CreditCard className="w-4 h-4 text-teal-600 flex-shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Payments</span>
                      <span className="text-[10px] text-slate-400">Receipts</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleActionClick('/expenses')}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-left"
                  >
                    <TrendingDown className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Expenses</span>
                      <span className="text-[10px] text-slate-400">Clinic costs</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleActionClick('/bills?tab=summary')}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-left"
                  >
                    <Coins className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Summary</span>
                      <span className="text-[10px] text-slate-400">P&L snapshot</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Finance Setup (COA & Cash/Bank Accounts) */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1 mb-1.5">
                  Finance Setup
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleActionClick('/chart-of-accounts')}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-left"
                  >
                    <Layers className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">COA</span>
                      <span className="text-[10px] text-slate-400">Chart of accounts</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleActionClick('/accounts')}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-left"
                  >
                    <Landmark className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Cash & Bank</span>
                      <span className="text-[10px] text-slate-400">Ledger entries</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Notifications & System Activity */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1 mb-1.5">
                  Alerts & Activity
                </span>
                <button
                  type="button"
                  onClick={() => handleActionClick('/notifications')}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-rose-50/50 hover:bg-rose-100/70 border border-rose-200/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-rose-500 text-white shadow-xs flex-shrink-0">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 block">Notifications & Alerts</span>
                        {unreadNotifCount > 0 && (
                          <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-rose-500 text-white">
                            {unreadNotifCount} new
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500">OPD queue, receipts, Rx, and system logs</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Users & Settings */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1 mb-1.5">
                  Administration & Clinic Config
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleActionClick('/doctors')}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-left"
                  >
                    <Stethoscope className="w-4 h-4 text-brand-600 flex-shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Doctors</span>
                      <span className="text-[10px] text-slate-400">Schedules & fees</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleActionClick('/users')}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-left"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Users & RBAC</span>
                      <span className="text-[10px] text-slate-400">Permissions</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleActionClick('/settings')}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-left"
                  >
                    <Settings className="w-4 h-4 text-slate-600 flex-shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Settings</span>
                      <span className="text-[10px] text-slate-400">Clinic & Print</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetData}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-rose-50/50 hover:bg-rose-100/70 border border-rose-200/80 text-left text-rose-700"
                  >
                    <RotateCcw className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-rose-900 block">Reset Demo</span>
                      <span className="text-[10px] text-rose-600">Restore records</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
